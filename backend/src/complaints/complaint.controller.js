import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  assignComplaintToOfficer,
  updateComplaintStatus,
  getComplaintTimeLine,
  notifyUser,
  getAdminAnalytics,
  getOfficerAnalytics,
  createAuditLog,
} from "./complaint.service.js";

export const createComplaintController = async (req, res) => {
  try {
    if (req.body.location && typeof req.body.location === "string") {
      try {
        console.log(req.body.location);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid location format",
        });
      }
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requiredFields = [
      "subject",
      "description",
      "category",
      "location"
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }
    console.log("🔥 FILE:", req.file);
    
    let attachments = [];

    if (req.file) {
      attachments.push({
        name: req.file.originalname,
        url: req.file.path || req.file.secure_url,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      });
    }

    const complaint = await createComplaint({
      ...req.body,
      attachments,
      user: userId
    });

    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const getAllComplaintsController = async (req, res) => {
  try {
    const complaints = await getAllComplaints();
    console.log("complaints : ", complaints);
    return res
      .status(200)
      .json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplaintByIdController = async (req, res) => {
  try {
    const { role, id } = req.user;

    const complaint = await getComplaintById(req.params.id);
    console.log("COMPLAINT OBJECT:", complaint); // Full complaint document

    // Complaint not found
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // -------------------- CITIZEN --------------------
    if (role === "citizen") {
      // complaint.user can be populated or not
      const complaintUserId =
        complaint.user?._id?.toString() || complaint.user?.toString();

      if (complaintUserId !== id) {
        console.log("403: Citizen tried to access someone else's complaint");
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // -------------------- OFFICER --------------------
    if (role === "officer") {
      let assignedOfficerId = null;

      if (complaint.assignedOfficer) {
        // If populated object
        assignedOfficerId =
          complaint.assignedOfficer._id.toString() ||
          complaint.assignedOfficer.toString();
      }

      if (!assignedOfficerId || assignedOfficerId !== id) {
        console.log("403: Officer tried to access unassigned complaint");
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    // -------------------- ADMIN (optional) --------------------
    // Admins can access any complaint, no check needed
    if (role === "admin") {
      console.log("Admin access granted");
    }

    await complaint.save();
    // -------------------- SUCCESS --------------------
    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("getComplaintByIdController error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const assignComplaintToOfficerController = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("PARAMS:", req.params);

  try {
    const { id } = req.params;
    const { officerId } = req.body;

    // 1️⃣ Validate inputs
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    // 2️⃣ Assign complaint (service layer)
    const complaint = await assignComplaintToOfficer(id, officerId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 3️⃣ Notify officer (non-blocking)
    notifyUser(officerId, "A new complaint has been assigned to you").catch(
      (err) => console.error("Notification failed:", err),
    );

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Assign Complaint Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateComplaintStatusController = async (req, res) => {
  try {
    const { status, remark } = req.body;
    const { role, id } = req.user;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const complaint = await updateComplaintStatus(
      req.params.id,
      status,
      remark,
    );
    // console.log("Fetched Complaint from updateComplaintStatus :- ", complaint);
    // Officer can only update assigned complaints
    if (role === "officer" && complaint.assignedOfficer?.toString() !== id) {
      return res.status(403).json({ message: "Not assigned to you" });
    }
    console.log("status : ", status);
    console.log("remark : ", remark);
    console.log("complaint : ", complaint);

    await notifyUser(complaint.user, `Your complaint status is now ${status}`);

    await createAuditLog({
      action: "STATUS_UPDATE",
      role: role, // ✅ REQUIRED
      performedBy: id, // ✅ REQUIRED
      complaintId: complaint._id,
      user: req.user,
      oldValue: { status: complaint.status },
      newValue: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      data: complaint,
    });
  } catch (error) {
    console.error("STATUS_UPDATE ERROR →", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getComplaintTimelineController = async (req, res) => {
  const logs = await getComplaintTimeLine({ complaintId: req.params.id });

  return res.json({ success: true, data: logs });
};

export const adminAnalyticsController = async (req, res) => {
  const data = await getAdminAnalytics();
  return res.json({ success: true, data });
};

export const officerAnalyticsController = async (req, res) => {
  const data = await getOfficerAnalytics(req.user.id);
  return res.json({ success: true, data });
};
