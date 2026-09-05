import {User} from "../users/user.model.js";
import {Complaint} from "../complaints/complaint.model.js";
import argon2 from "argon2";


export const getAllOfficersController = async (req, res) => {
  try {
    const officers = await User.find({ role: "officer" });
    console.log(officers);
    res.status(200).json({ success: true, data: officers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// CREATE OFFICER
export const createOfficerController = async (req, res) => {
  try {
    const { name, email, password, ministry, department } = req.body;

    // 🔒 Validation
    if (!name || !email || !password || !ministry || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔒 Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Officer with this email already exists",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await argon2.hash(password, 10);

    // 👮 Create officer
    const officer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "officer",
      ministry,
      department,
    });

    res.status(201).json({
      success: true,
      message: "Officer created successfully",
      data: officer,
    });

  } catch (error) {
    console.error("CREATE OFFICER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL USERS
export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Close complaint
export const closeComplaint = async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findById(id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  complaint.status = "RESOLVED";
  await complaint.save();

  res.status(200).json({ success: true, data: complaint });
};

// Delete any complaint
export const deleteComplaint = async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findByIdAndDelete(id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  res.status(200).json({ success: true, message: "Complaint deleted" });
};


// Reassign complaint
export const reassignComplaint = async (req, res) => {
  const { id } = req.params;
  const { officerId } = req.body;

  const complaint = await Complaint.findById(id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  complaint.assignedOfficer = officerId;
  await complaint.save();

  res.status(200).json({ success: true, data: complaint });
};


// Delete officer
export const deleteOfficer = async (req, res) => {
  const { id } = req.params;

  const officer = await User.findByIdAndDelete(id);
  if (!officer) return res.status(404).json({ success: false, message: "Officer not found" });

  res.status(200).json({ success: true, message: "Officer deleted" });
};


// Change user role
export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.role = role;
  await user.save();

  res.status(200).json({ success: true, data: user });
};


export const updateOfficerDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const officer = await User.findByIdAndUpdate(
      id,
      { department },
      { new: true }
    );

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: officer,
    });
  } catch (error) {
    console.error("Update Officer Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ UPDATE complaint (assign officer / change status / remarks)
export const updateComplaintByAdmin = async (req, res) => {
  try {
    const { assignedOfficer, status, remarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update only if values are provided
    if (assignedOfficer !== undefined)
      complaint.assignedOfficer = assignedOfficer;

    if (status !== undefined)
      complaint.status = status;

    if (remarks !== undefined)
      complaint.remarks = remarks;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

