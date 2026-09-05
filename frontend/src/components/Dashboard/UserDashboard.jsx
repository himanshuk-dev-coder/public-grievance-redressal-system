import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import Footer from "../../Layout/Footer/Footer.jsx";
import api from "../../utils/API.js";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444"]; // Pending, In Progress, Resolved, Rejected

const getStatusStyle = (status) => {
  switch (status) {
    case "PENDING":
      return {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
        progress: "w-1/3 bg-yellow-500",
      };
    case "IN_PROGRESS":
      return {
        badge: "bg-blue-100 text-blue-800 border-blue-300",
        progress: "w-2/3 bg-blue-500",
      };
    case "RESOLVED":
      return {
        badge: "bg-green-100 text-green-800 border-green-300",
        progress: "w-full bg-green-500",
      };
    case "REJECTED":
      return {
        badge: "bg-red-100 text-red-800 border-red-300",
        progress: "w-full bg-red-500",
      };
    default:
      return {
        badge: "bg-gray-100 text-gray-800 border-gray-300",
        progress: "w-1/4 bg-gray-400",
      };
  }
};

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/complaints/my");
        setComplaints(res.data.complaints || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading...
      </div>
    );

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "RESOLVED",
  ).length;
  const pendingComplaints = totalComplaints - resolvedComplaints;

  // Prepare data for charts
  const statusData = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "PENDING").length,
      fill: "#facc15",
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "IN_PROGRESS").length,
      fill: "#3b82f6",
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "RESOLVED").length,
      fill: "#22c55e",
    },
    {
      name: "Rejected",
      value: complaints.filter((c) => c.status === "REJECTED").length,
      fill: "#ef4444",
    },
  ];

  const complaintsOverTime = Object.values(
    complaints.reduce((acc, c) => {
      const date = new Date(c.createdAt);

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!acc[key]) {
        acc[key] = {
          month: date.toLocaleString("default", {
            month: "short",
          }),
          year: date.getFullYear(),
          count: 0,
          sortDate: new Date(date.getFullYear(), date.getMonth()),
        };
      }

      acc[key].count += 1;
      return acc;
    }, {}),
  ).sort((a, b) => a.sortDate - b.sortDate);

  // Category Distribution Data
  const categoryData = Object.values(
    complaints.reduce((acc, c) => {
      console.log(c);
      const category = c.category || "Others";
      // console.log(category);
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
        };
      }

      acc[category].count += 1;
      return acc;
    }, {}),
  );
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl  font-semibold text-blue-800 mb-6">
        Citizen Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold">Total Complaints</h4>
          <p className="text-3xl font-bold mt-2">{totalComplaints}</p>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold">Resolved Complaints</h4>
          <p className="text-3xl font-bold mt-2">{resolvedComplaints}</p>
          <p className="text-sm mt-1">Pending: {pendingComplaints}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold">Pending Complaints</h4>
          <p className="text-3xl font-bold mt-2">{pendingComplaints}</p>
        </div>
        <div className="bg-gray-600 text-white rounded-xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold">Avg Resolution Time</h4>
          <p className="text-3xl font-bold mt-2">5 days</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">
            Complaint Status Overview
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
              />

              {/* Center Text */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-800"
                style={{ fontSize: "22px", fontWeight: "bold" }}
              >
                {totalComplaints}
              </text>

              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-500"
                style={{ fontSize: "12px" }}
              >
                Total Complaints
              </text>

              <Tooltip
                formatter={(value, name) => [
                  `${value} (${((value / totalComplaints) * 100 || 0).toFixed(0)}%)`,
                  name,
                ]}
              />

              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints Over Time Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">
            Complaints Trend (Monthly)
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={complaintsOverTime}>
              {/* Background Grid */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* Gradient */}
              <defs>
                <linearGradient
                  id="colorComplaints"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorComplaints)"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Complaint Category Distribution */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">
              Complaint Category Distribution
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="category" />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [`${value} Complaints`, "Total"]}
                />

                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Visual Complaint Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          My Complaints
        </h3>
        <div className="flex flex-col gap-4">
          {complaints.length === 0 ? (
            <p className="text-center text-gray-500">
              You have not raised any complaints yet.
            </p>
          ) : (
            complaints.map((complaint) => {
              const statusStyle = getStatusStyle(complaint.status);
              return (
                <div
                  key={complaint._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border rounded-lg p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex-1 mb-2 md:mb-0">
                    <p className="text-sm font-medium text-gray-500">
                      ID: {complaint._id.slice(-5)}
                    </p>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {complaint.subject}
                    </h4>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      {complaint.ministry} • {complaint.department}
                    </p> */}
                    <p className="text-xs text-gray-500 mt-1">
                      Raised on{" "}
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle.badge}`}
                    >
                      {complaint.status}
                    </span>
                    <div className="h-1 w-full md:w-48 bg-gray-200 rounded-full mt-2">
                      <div
                        className={`h-1 rounded-full transition-all ${statusStyle.progress}`}
                      />
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/track-complaint/${complaint._id}`)
                      }
                      className="flex items-center gap-1 text-blue-600 text-sm font-medium mt-2 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CitizenDashboard;
