import Complaint from "../models/Complaint.js";

export const checkSLABreach = async () => {
  const now = new Date();

  const breachedComplaints = await Complaint.find({
    "sla.deadline": { $lt: now },
    status: { $ne: "RESOLVED" },
    "sla.breached": false
  });

  for (const complaint of breachedComplaints) {
    complaint.sla.breached = true;
    complaint.status = "IN_PROGRESS";
    await complaint.save();
  }
};
