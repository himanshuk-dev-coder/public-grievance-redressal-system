import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/API.js";
import { Eye, ClipboardList, CheckCircle, Clock } from "lucide-react";
import Footer from "../../Layout/Footer/Footer.jsx";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
};

const OfficerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/officer/complaints/assigned");
        setComplaints(res.data.data);
      } catch (err) {
        console.error("Failed to fetch officer complaints", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);
  
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "RESOLVED").length;
  const pending = complaints.filter(c => c.status === "PENDING").length;
  const rejected = complaints.filter(c => c.status === "REJECTED").length;

  return (
    <>
      <div className="p-6 bg-linear-to-br from-gray-100 to-gray-200 min-h-screen">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          My Assigned Complaints
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Assigned" value={total} icon={ClipboardList} white />
          <KpiCard title="Resolved" value={resolved} icon={CheckCircle} green />
          <KpiCard title="Pending" value={pending} icon={Clock} yellow />
          <KpiCard title="Rejected" value={rejected} icon={Clock} red />
        </div>

        {/* Table */}
        <div className="overflow-x-auto backdrop-blur-md bg-white/80 rounded-2xl shadow-xl">
          {loading ? (
            <p className="p-6 text-gray-500">Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="p-6 text-gray-500">
              No complaints assigned to you.
            </p>
          ) : (
            <table className="min-w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Subject</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 font-mono text-sm">
                      #{c._id.slice(-6)}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {c.subject}
                    </td>

                    <td className="px-6 py-2 text-sm text-gray-700">
                      <button className="bg-[lightseagreen] text-amber-50 rounded-full" onClick={() => window.location.href=`${c.location}`}>Complaint Location</button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          STATUS_COLORS[c.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/officer/complaints/${c._id}`)
                        }
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

/* KPI Card */
const KpiCard = ({ title, value, icon: Icon, green, yellow, red, white }) => (
  <div
    className={`p-6 rounded-2xl shadow-lg flex items-center justify-between
      ${green ? "bg-green-100" : yellow ? "bg-yellow-100" :  red ? "bg-red-100" : white ? "bg-white-100" : "bg-gray-100" }`}
  >
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <Icon className="text-gray-500" size={40} />
  </div>
);

export default OfficerComplaints;
