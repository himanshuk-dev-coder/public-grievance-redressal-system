import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Building2, ArrowLeft } from "lucide-react";
import api from "../../utils/API.js";
import Footer from "../../Layout/Footer/Footer.jsx";

const getStatusStyle = (status) => {
  switch (status) {
    case "PENDING":
      return {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
        dot: "bg-yellow-500",
        progress: "w-1/3 bg-yellow-500",
      };
    case "IN_PROGRESS":
      return {
        badge: "bg-blue-100 text-blue-800 border-blue-300",
        dot: "bg-blue-500",
        progress: "w-2/3 bg-blue-500",
      };
    case "RESOLVED":
      return {
        badge: "bg-green-100 text-green-800 border-green-300",
        dot: "bg-green-500",
        progress: "w-full bg-green-500",
      };
    case "REJECTED":
      return {
        badge: "bg-red-100 text-red-800 border-red-300",
        dot: "bg-red-500",
        progress: "w-full bg-red-500",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-800 border-gray-300",
        dot: "bg-gray-500",
        progress: "w-1/4 bg-gray-400",
      };
  }
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFeedback, setHasFeedback] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        console.log("COMPLAINT DETAILS :-", res.data.data);
        setComplaint(res.data.data || null);
      } catch (error) {
        console.error("Failed to fetch complaint details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading complaint details...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Complaint not found.
      </div>
    );
  }

  const statusStyle = getStatusStyle(complaint.status);
  

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Complaints
        </button>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {complaint.subject}
            </h2>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle.badge}`}
            >
              {complaint.status}
            </span>
          </div>

          {/* Ministry & Department */}
          <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Building2 size={16} />
            {complaint.ministry} • {complaint.department}
          </p>

          {/* Date */}
          <p className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Calendar size={14} />
            Raised on {new Date(complaint.createdAt).toLocaleDateString()}
          </p>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
            <span className="text-xs font-medium text-gray-600">
              {complaint.status}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-gray-200 rounded-full mb-4">
            <div
              className={`h-1 rounded-full transition-all ${statusStyle.progress}`}
            />
          </div>

          {/* Complaint Description */}
          <div className="mt-4 text-gray-700 text-sm">
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{complaint.description || "No description provided."}</p>
          </div>

          {/* Any Additional Info */}
          {complaint.attachments?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Attachments</h3>

              <div className="space-y-3">
                {complaint.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between
                     border rounded-lg px-4 py-3
                     bg-gray-50 hover:bg-gray-100
                     transition"
                  >
                    {/* Left: Icon + Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📎</span>
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                    </div>

                    {/* Right: Action */}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/feedback/${complaint._id}`)}
                disabled={hasFeedback}
                className={`mt-2 px-2 py-1 text-sm rounded-md text-white transition ${hasFeedback ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {hasFeedback ? "Feedback Submitted" : "Give Feedback"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ComplaintDetails;
