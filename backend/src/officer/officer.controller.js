import { addOfficerRemarkService, closeComplaintService, getAssignedComplaints, requestMoreInfoService, uploadActionProofService } from "./officer.service.js";

// Get complaints assigned to the officer
// controllers/complaint.controller.js
export const getAssignedComplaintsController = async (req, res) => {
  try {
    const  officerId  = req.user.id; // ✅ use params for GET
    console.log(req.user.id);
    if (!officerId) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required"
      });
    }

    const complaints = await getAssignedComplaints(officerId);

    return res.status(200).json({
      success: true,
      data: complaints
    });

  } catch (error) {
    console.error("Get Assigned Complaints Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};


export const closeComplaint = async (req, res) => {
  try {
    const closedComplaint = await closeComplaintService({
      complaintId: req.params.id,
      userId: req.user._id,
      role: req.user.role,
      remark: req.body.remark
    });

    res.status(200).json({
      success: true,
      message: "Complaint closed successfully",
      data: closedComplaint
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message
    });
  }
};


// Add officer remark
 
export const addOfficerRemark = async (req, res) => {
  const remark = await addOfficerRemarkService({
    complaintId: req.params.id,
    officerId: req.user._id,
    text: req.body.text
  });

  res.json({
    success: true,
    message: "Remark added",
    data: remark
  });
};


/**
 * Request more info from citizen
 */
export const requestMoreInfo = async (req, res) => {
  await requestMoreInfoService(
    req.params.id,
    req.user._id,
    req.body.message
  );

  res.json({
    success: true,
    message: "More information requested"
  });
};

/**
 * Upload action proof
 */
export const uploadActionProof = async (req, res) => {
  const proof = await uploadActionProofService({
    complaintId: req.params.id,
    officerId: req.user._id,
    file: req.file
  });

  res.json({
    success: true,
    message: "Action proof uploaded",
    data: proof
  });
};