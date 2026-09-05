import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/API";
import { ArrowLeft } from "lucide-react";
import Footer from "../../Layout/Footer/Footer";
import "./AdminComplaints.css";
import { toast } from "react-toastify";

const AdminComplaintsView = () => {
  const { id } = useParams(); // complaint id
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  // 🔹 Fetch complaint details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        const response = await api.get(`/feedback/complaint/${id}`);
        setFeedback(response.data.data);
        setComplaint(res.data.data);
        setAssignedOfficer(res.data.data.assignedOfficer?._id || "");
        setStatus(res.data.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Fetch officers
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get("/admin/officers");
        setOfficers(res.data.data.assignedOfficer);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOfficers();
  }, []);

  // 🔹 Update complaint
  const handleUpdate = async () => {
    if (!remarks && status !== complaint.status) {
      toast.error("Remarks are required for status change");
      return;
    }

    try {
      await api.patch(`/admin/complaints/${id}`, {
        assignedOfficer,
        status,
        remarks,
      });
      toast.success("Complaint updated successfully");
      navigate("/admin/complaints");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Detect file type
  const getFileType = (url) => {
    if (!url) return null;

    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";

    if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";

    if (ext === "pdf") return "pdf";

    return "other";
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading complaint...</p>;
  }

  if (!complaint) {
    return <p className="p-6 text-red-500">Complaint not found</p>;
  }

  return (
    <>
      <div className="bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* ================= Header ================= */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="arrowLeft">
              <ArrowLeft className="text-indigo-600" />
            </button>

            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Complaint Details
            </h1>
          </div>

          {/* ================= Loading Guard ================= */}
          {!complaint ? (
            <div className="text-center py-20 text-gray-500">
              Loading complaint details...
            </div>
          ) : (
            <>
              {/* ================= Basic Info ================= */}
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                  📄 Basic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <b className="text-gray-900">ID:</b> {complaint._id}
                  </p>
                  <p>
                    <b className="text-gray-900">Status:</b>{" "}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {complaint.status}
                    </span>
                  </p>
                  <p>
                    <b className="text-gray-900">Subject : </b>{" "}
                    {complaint.subject}
                  </p>
                  <p>
                    <b className="text-gray-900">Category:</b>{" "}
                    {complaint.category}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="font-semibold text-gray-900 mb-1">
                    Description
                  </p>
                  <p className="text-gray-700 bg-gray-300 p-4 rounded-xl">
                    {complaint.description}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Get Complaint Location
                  </p>
                  <textarea
                    className="w-full bg-blue-200 p-4 rounded-2xl"
                    rows={5}
                    cols={30}
                    name="location"
                    value={complaint.location}
                    id="location"
                    readOnly
                  />
                </div>
                {(complaint.status === "RESOLVED") && 
                (<div>
                  <p className="font-semibold text-gray-900 mb-1">View Feedbacks</p>
                  <textarea
                    className="w-full bg-blue-200 p-4 rounded-2xl"
                    rows={5}
                    cols={30}
                    name="feedback"
                    value={feedback.map((obj) => {
                      return obj.comment;
                    })}
                    id="feedback"
                    readOnly
                  />
                </div>)}
                
              </div>

              {/* ================= Citizen Info ================= */}
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                  👤 Complainant Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <b className="text-gray-900">Name:</b>{" "}
                    {complaint.user?.name || "N/A"}
                  </p>
                  <p>
                    <b className="text-gray-900">Email:</b>{" "}
                    {complaint.user?.email || "N/A"}
                  </p>
                </div>
              </div>

              
              {/* ================= Attachment ================= */}
              {complaint.attachments?.length > 0 && (
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                    📎 Attachments
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {complaint.attachments.map((file, index) => {
                      const fileType = getFileType(file.url);

                      // ✅ Fix Windows path
                      const cleanUrl = file.url.replace(/\\/g, "/");

                      const fileUrl = `http://localhost:5000/${cleanUrl}`;
                      console.log(fileUrl);
                      // 🖼 IMAGE
                      if (fileType === "image") {
                        return (
                          <img
                            key={index}
                            src={fileUrl}
                            alt={file.name}
                            className="rounded-xl max-h-96 border shadow"
                          />
                        );
                      }

                      // 🎥 VIDEO
                      if (fileType === "video") {
                        return (
                          <video
                            key={index}
                            controls
                            className="rounded-xl w-full max-h-96 border shadow"
                          >
                            <source src={fileUrl} />
                            Your browser does not support video.
                          </video>
                        );
                      }

                      // 📄 PDF
                      if (fileType === "pdf") {
                        return (
                          <a
                            key={index}
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 inline-block"
                          >
                            📄 Open PDF — {file.name}
                          </a>
                        );
                      }

                      // 📥 OTHER
                      return (
                        <a
                          key={index}
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download {file.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= Admin Actions ================= */}
              <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-indigo-700 mb-6">
                  🛠 Admin Actions
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Assign Officer */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Assign Officer
                    </label>
                    <select
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 bg-linear-to-r from-blue-50 to-indigo-50
                             focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    >
                      <option value="">Select Officer</option>
                      {Array.isArray(officers) && officers.length > 0 ? (
                        officers.map((officer) => (
                          <option key={officer._id} value={officer._id}>
                            {officer.name} ({officer.department})
                          </option>
                        ))
                      ) : (
                        <option disabled>No officers available</option>
                      )}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Complaint Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 bg-linear-to-r from-yellow-50 to-green-50
                             focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Admin Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border px-3 py-2 bg-gray-50
                           focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    placeholder="Reason / action taken..."
                  />
                </div>

                {/* Save Button */}
                <button onClick={handleUpdate} className="save-btn">
                  💾 Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminComplaintsView;
