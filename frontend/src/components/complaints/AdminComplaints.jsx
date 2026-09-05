import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";
import api from "../../utils/API.js";
import Footer from "../../Layout/Footer/Footer.jsx";
import { toast } from "react-toastify";
import "./AdminComplaints.css"

const AdminComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  // const [assignMap, setAssignMap] = useState({});

  // ✅ FETCH ALL COMPLAINTS (CORRECT API)
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/complaints/complaints");
        console.log("Admin complaints API response:", res.data.data);
        setComplaints(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get("/admin/officers");
        setOfficers(res.data.data);
      } catch {
        toast.error("Failed to load officers");
      }
    };

    fetchOfficers();
  }, []);

  // State to store selected officer for each complaint
  const [selectedOfficer, setSelectedOfficer] = useState({});

  // ✅ Handler function

  // 1️⃣ Handle when user changes the select dropdown
  const handleSelectChange = (complaintId, officerId) => {
    setSelectedOfficer((prev) => ({
      ...prev,
      [complaintId]: officerId, // store officer id for this complaint
    }));
  };

  // 2️⃣ Handle Assign button click
  const handleAssignOfficer = async (complaintId) => {
    const officerId = selectedOfficer[complaintId];

    if (!officerId) {
      toast.error("Please select an officer first!");
      return;
    }

    try {
      const res = await api.patch(
        `/complaints/assign/${complaintId}`,
        { officerId }, // ✅ VERY IMPORTANT
      );

      console.log("Assigned:", res.data);

      const officer = officers.find((o) => o._id === officerId);

      toast.success(`Complaint assigned to ${officer?.name || "Officer"}`);

      // 🔄 OPTIONAL: update UI immediately
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? { ...c, assigned: officer, status: "IN_PROGRESS" }
            : c,
        ),
      );
    } catch (error) {
      console.error("Failed to Assign Officer", error);
      toast.error("Failed to assign officer");
    }
  };

  // 🔹 STATS
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;
  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const rejectedCount = complaints.filter(
    (c) => c.status === "REJECTED",
  ).length;

  // 🔹 FILTER + SEARCH
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c._id?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-4 md:p-6">
        {/* 🔹 TITLE */}
        <h1 className="text-4xl font-semibold mb-4">
          Admin Complaints Dashboard
        </h1>

        {/* 🔹 STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            title="Total Complaints"
            value={totalComplaints}
            icon={<ClipboardList />}
          />
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={<CheckCircle />}
            bg="bg-green-100"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<Clock />}
            bg="bg-yellow-100"
          />
          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={<Clock />}
            bg="bg-red-100"
          />
        </div>

        {/* 🔹 SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by title or ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-4 py-2 text-sm w-full md:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* 🔹 TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          {loading ? (
            <p className="p-4 text-gray-500 text-sm">Loading complaints...</p>
          ) : filteredComplaints.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">No complaints found.</p>
          ) : (
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xl font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-semibold">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xl font-semibold">
                    Location
                  </th>
                  <th className="px-5 py-3 text-center text-xl font-semibold">
                    Assigned
                  </th>
                  <th className="px-5 py-3 text-center text-xl font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-3 text-center text-xl font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      #{complaint._id.slice(-6)}
                    </td>

                    {/* SUBJECT */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {complaint.subject || "—"}
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-6 py-2 text-sm text-gray-700">
                      <button className="bg-[lightseagreen] text-amber-50 rounded-full" onClick={() => window.location.href=`${complaint.location}`}>Complaint Location</button>
                    </td>

                    {/* ASSIGN OFFICER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Dropdown */}
                        <select
                          value={selectedOfficer[complaint._id] || ""}
                          onChange={(e) =>
                            handleSelectChange(complaint._id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                        >
                          <option value="">Select Officer</option>
                          {officers.map((officer) => (
                            <option key={officer._id} value={officer._id}>
                              {officer.name}
                            </option>
                          ))}
                        </select>

                        {/* Assign Button */}
                        <button
                          onClick={() => handleAssignOfficer(complaint._id)}
                          className="assign-btn"
                        >
                          Assign
                        </button>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3 text-center">
                      <StatusBadge status={complaint.status} />
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => navigate(`/complaints/${complaint._id}`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View <ArrowRight size={16} />
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

/* 🔹 SMALL REUSABLE COMPONENTS */

const StatCard = ({ title, value, icon, bg = "bg-white" }) => (
  <div
    className={`rounded-2xl shadow p-6 flex items-center justify-between ${bg}`}
  >
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="text-gray-600">{icon}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "border border-gray-400 text-gray-700",
    RESOLVED: "border border-green-500 text-green-700",
    REJECTED: "border border-red-500 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "border border-gray-300"
      }`}
    >
      {status}
    </span>
  );
};

export default AdminComplaints;
