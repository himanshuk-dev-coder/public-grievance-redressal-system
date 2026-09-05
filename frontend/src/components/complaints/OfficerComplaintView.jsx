import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/API.js";
import Footer from "../../Layout/Footer/Footer.jsx";

const statusOptions = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
const statusColor = {
  Pending: "bg-yellow-400 text-yellow-700",
  "In Progress": "bg-blue-400 text-blue-700",
  Resolved: "bg-green-400 text-green-700",
  Rejected: "bg-red-400 text-red-700",
};

const OfficerComplaintView = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadComplaint = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/officer/complaints/${id}`);
        setComplaint(res.data.data);
        setNewStatus(res.data.data.status); // initialize current status
      } catch (err) {
        if (err.response?.status === 403) {
          setError("FORBIDDEN");
          toast.error("You are not authorized to view this complaint");
        } else if (err.response?.status === 404) {
          setError("NOT_FOUND");
        } else {
          setError("UNKNOWN");
          toast.error("Failed to load complaint");
        }
      } finally {
        console.log(complaint);
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  const getFileType = (url) => {
    if (!url) return null;

    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";

    if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";

    if (ext === "pdf") return "pdf";

    return "other";
  };

  // ✅ Handle Status Update
  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === complaint.status) return;

    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/complaints/status/${id}`, {
        status: newStatus,
      });
      console.log("PATCH payload:", { status: newStatus });

      setComplaint((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!complaint) return <p className="text-center mt-10">Complaint Not Found</p>;

  return (
    <>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-900">
            Complaint #{complaint?.id}
          </h2>
          <span
            className={`px-4 py-2 rounded-full font-semibold ring-1 ring-current ${statusColor[complaint.status]} uppercase`}
          >
            {complaint.status}
          </span>
        </div>

        {/* 🔹 Details Card */}
        <div className="bg-linear-to-r from-white via-blue-50 to-white p-6 rounded-2xl shadow-lg space-y-4 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800">
            Complaint Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            <p>
              <b>Subject:</b> {complaint.subject}
            </p>
            <p>
              <b>Category:</b> {complaint.category}
            </p>
            <p>
              <b>Department:</b> {complaint.department}
            </p>
            <p>
              <b>Created At:</b>{" "}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* 🔹 Description */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Description
          </h3>
          <p className="text-gray-700">{complaint.description}</p>
        </div>

        {/* 🔹 Description */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Access Complaint Location
          </h3>
          <p className="text-gray-700">
            <textarea className="w-full bg-blue-300 p-4 rounded-2xl" rows={5} cols={30} name="location" id="location">{complaint.location}</textarea>
          </p>
        </div>

        {/* 🔹 Attachments */}
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

        {/* 🔹 Update Status Panel */}
        <div className="bg-linear-to-r from-green-50 via-white to-yellow-50 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:gap-4 border border-green-200">
          <label className="font-semibold mb-2 sm:mb-0 text-gray-700">
            Update Status :
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updatingStatus || newStatus === complaint.status}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-2 sm:mt-0 shadow hover:shadow-lg disabled:bg-gray-400 transition-all duration-200"
          >
            {updatingStatus ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* 🔹 Footer */}
      <Footer />
    </>
  );
};

export default OfficerComplaintView;
