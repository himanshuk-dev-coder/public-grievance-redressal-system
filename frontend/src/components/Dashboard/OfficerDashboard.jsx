import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";

import Footer from "../../Layout/Footer/Footer.jsx";
import api from "../../utils/API.js";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444"];

const OfficerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    statusWise: {
      PENDING: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      REJECTED: 0,
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/complaints/officer");
        const data = res.data?.data || {};

        setStats({
          assigned: data.assigned ?? 0,
          statusWise: data.statusWise ?? {
            PENDING: 0,
            IN_PROGRESS: 0,
            RESOLVED: 0,
            REJECTED: 0,
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading...
      </div>
    );
  }

  const { assigned, statusWise } = stats;
  const kpiConfig = {
    assigned: {
      title: "Assigned",
      value: assigned,
      bg: "bg-indigo-600",
    },
    pending: {
      title: "Pending",
      value: statusWise.PENDING,
      bg: "bg-amber-500",
    },
    inProgress: {
      title: "In Progress",
      value: statusWise.IN_PROGRESS,
      bg: "bg-blue-600",
    },
    resolved: {
      title: "Resolved",
      value: statusWise.RESOLVED,
      bg: "bg-green-600",
    },
    rejected: {
      title: "Rejected",
      value: statusWise.REJECTED,
      bg: "bg-red-600",
    },
  };

  /* ================= CHART DATA ================= */

  const statusData = [
    {
      name: "Pending",
      value: statusWise.PENDING,
      fill: "#facc15",
    },
    {
      name: "In Progress",
      value: statusWise.IN_PROGRESS,
      fill: "#3b82f6",
    },
    {
      name: "Resolved",
      value: statusWise.RESOLVED,
      fill: "#22c55e",
    },
    {
      name: "Rejected",
      value: statusWise.REJECTED,
      fill: "#ef4444",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl text-yellow-300 font-bold mb-6">Officer Dashboard</h2>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.values(kpiConfig).map((card, index) => (
          <div
            key={index}
            className={`${card.bg} text-white  rounded-2xl p-6 shadow-lg hover:scale-[1.03] transition`}
          >
            <p className="text-xl font-semibold opacity-90">{card.title}</p>
            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* ================= 4 RECHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* 1️⃣ PIE CHART */}
        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
                label
              ></Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2️⃣ BAR CHART */}
        <ChartCard title="Status Comparison">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3️⃣ LINE CHART */}
        <ChartCard title="Status Trend Snapshot">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4️⃣ RADAR CHART */}
        <ChartCard title="Workload Radar">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={statusData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis allowDecimals={false} />
              <Radar
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Footer />
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg">
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default OfficerDashboard;
