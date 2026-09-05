import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts";
import Footer from "../../Layout/Footer/Footer.jsx";
import api from "../../utils/API.js";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444"];

const initialStats = {
  totalComplaints: 0,
  resolvedComplaints: 0,
  pendingComplaints: 0,
  rejectedComplaints: 0,
  totalOfficers: 0,
  complaintsByStatus: [],
  complaintsByCategory: [],
  complaintsTrend: [],
  officerPerformance: [],
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(initialStats);
  const [feedbackStats, setFeedbackStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/complaints/admin");
        const dashboard = data?.data ?? {};
        console.log(dashboard);
        const res = await api.get("/feedback/stats");
        setFeedbackStats(res.data.data);

        const complaintsByStatus = dashboard.complaintsByStatus ?? [];
        console.log(complaintsByStatus);
        
        const pending =
          complaintsByStatus.find((s) => s.name === "PENDING")?.value ?? 0;

        const resolved =
          complaintsByStatus.find((s) => s.name === "RESOLVED")?.value ?? 0;

        const rejected =
          complaintsByStatus.find((s) => s.name === "REJECTED")?.value ?? 0;
        
        setStats({
          totalComplaints: dashboard.totalComplaints ?? 0,
          totalOfficers: dashboard.totalOfficers ?? 0,
          resolvedComplaints: resolved,
          pendingComplaints: pending,
          rejectedComplaints: rejected,
          complaintsByStatus,
          complaintsByCategory: dashboard.complaintsByCategory ?? [],
          complaintsTrend: dashboard.complaintsTrend ?? [],
          officerPerformance: dashboard.officerPerformance ?? [],
          feedbackStats: feedbackStats,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const officerData = stats.officerPerformance.map((o) => ({
    officer: o.officerName,
    resolved: o.resolved,
    pending: o.pending,
    rejected: o.rejected,
    total: o.totalAssigned,
  }));
  console.log("OFficer Performance : ", stats.officerPerformance);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* ===================== STATS CARDS ===================== */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          color="bg-blue-600"
        />

        <StatCard
          title="Resolved Complaints"
          value={stats.resolvedComplaints}
          color="bg-green-600"
          subtitle={`Pending: ${stats.pendingComplaints}`}
        />

        <StatCard
          title="Pending Complaints"
          value={stats.pendingComplaints}
          color="bg-yellow-500"
        />

        <StatCard
          title="Total Officers"
          value={stats.totalOfficers}
          color="bg-pink-500"
        />
      </div>

      {/* ===================== CHARTS ===================== */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <ChartContainer title="Complaint Status Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.complaintsByStatus}
                dataKey="value"
                cx="50%"
                cy="50%"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={2}
              >
                {stats.complaintsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Trend Line */}
        <ChartContainer title="Complaints Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.complaintsTrend}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Officer Performance */}
        <ChartContainer title="🏆 Officer Performance">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={officerData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="officer" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey="pending"
                name="Pending"
                fill="#facc15"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="rejected"
                name="Rejected"
                fill="#FF6347"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* ===================== FEEDBACK CHART ===================== */}

        <ChartContainer title="⭐ Feedback Overview">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                {
                  name: "Feedback",
                  total: feedbackStats.totalFeedback,
                  low: feedbackStats.lowRatings,
                  avg: feedbackStats.avgRating,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="total" name="Total Feedback" fill="#3b82f6" />
              <Bar dataKey="low" name="Low Ratings" fill="#ef4444" />
              <Bar dataKey="avg" name="Avg Rating" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* ===================== QUICK ACTIONS ===================== */}
      <div className="bg-white rounded-xl mb-4 shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h3>

        <div className="flex gap-4">
          <ActionButton
            label="View All Complaints"
            color="bg-blue-600"
            onClick={() => navigate("/admin/complaints")}
          />

          <ActionButton
            label="Manage Officers"
            color="bg-green-600"
            onClick={() => navigate("/manage-officers")}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* ===================== REUSABLE COMPONENTS ===================== */

const StatCard = ({ title, value, subtitle, color }) => (
  <div className={`${color} text-white rounded-xl p-6 shadow-lg`}>
    <h4 className="text-lg font-semibold">{title}</h4>
    <p className="text-3xl font-bold mt-2">{value}</p>
    {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg">
    <h3 className="text-2xl font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const ActionButton = ({ label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition ${color}`}
  >
    {label}
  </button>
);

export default AdminDashboard;
