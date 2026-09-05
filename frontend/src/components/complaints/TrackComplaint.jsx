import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Building2, ArrowRight } from "lucide-react";
import Footer from '../../Layout/Footer/Footer.jsx'
import api from "../../utils/API.js";

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

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const res = await api.get("/complaints/my");
        console.log("MY COMPLAINTS RESPONSE :- ", res.data);
        setComplaints(res.data.complaints || []);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading complaints...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">
          Track My Complaints
        </h1>

        {complaints.length === 0 ? (
          <p className="text-center text-gray-500">
            You have not raised any complaints yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {complaints.map((complaint) => {
              const statusStyle = getStatusStyle(complaint.status);

              return (
                <div
                  key={complaint._id}
                  className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition duration-300 p-6 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {complaint.subject}
                    </h2>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle.badge}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  {/* Ministry */}
                  {/* <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Building2 size={16} />
                    {complaint.ministry} • {complaint.department}
                  </p> */}

                  {/* Date */}
                  <p className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar size={14} />
                    Raised on{" "}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                    />
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

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        navigate(`/track-complaint/${complaint._id}`)
                      }
                      className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default TrackComplaint;
