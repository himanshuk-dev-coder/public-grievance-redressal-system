// models/Officer.js
import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    required: true, 
    unique: true 
  },
  assignedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  },
  rank: String,
});

export const Officer = mongoose.model("Officer", officerSchema);
