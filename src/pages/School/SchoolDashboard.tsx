import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiUserCheck,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiCalendar,
  FiBell,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import CountUp from "react-countup";

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeStudents: number;
  studentsNeedingAttention: number;
  criticalCases: number;
  averageAttendance: number;
  moodTrackingActive: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

interface QuickStat {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const SchoolDashboard: React.FC = () => {
  const [stats, setStats] = useState<SchoolStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    activeStudents: 0,
    studentsNeedingAttention: 0,
    criticalCases: 0,
    averageAttendance: 0,
    moodTrackingActive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/schools/dashboard/stats`);
        if (response.data) {
          setStats({
            totalStudents: response.data.totalStudents || 0,
            totalTeachers: response.data.totalTeachers || 0,
            totalClasses: response.data.totalClasses || 0,
            activeStudents: response.data.activeStudents || 0,
            studentsNeedingAttention: response.data.studentsNeedingAttention || 0,
            criticalCases: response.data.criticalCases || 0,
            averageAttendance: response.data.averageAttendance || 0,
            moodTrackingActive: response.data.moodTrackingActive || 0,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  const quickStats: QuickStat[] = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      change: "+12.5%",
      trend: "up",
      icon: <FiUsers size={24} />,
      color: "#1ecab8",
      gradient: "linear-gradient(135deg, #1ecab8 0%, #1bb8a6 100%)",
    },
    {
      title: "Active Students",
      value: stats.activeStudents,
      change: "+8.2%",
      trend: "up",
      icon: <FiCheckCircle size={24} />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      title: "Needs Attention",
      value: stats.studentsNeedingAttention,
      change: "-5.3%",
      trend: "down",
      icon: <FiAlertCircle size={24} />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      title: "Critical Cases",
      value: stats.criticalCases,
      change: "-15.3%",
      trend: "down",
      icon: <FiAlertCircle size={24} />,
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      change: "+3.1%",
      trend: "up",
      icon: <FiUserCheck size={24} />,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      change: "+2.0%",
      trend: "up",
      icon: <FiBook size={24} />,
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      title: "Avg Attendance",
      value: `${stats.averageAttendance}%`,
      change: "+1.2%",
      trend: "up",
      icon: <FiClock size={24} />,
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      title: "Mood Tracking",
      value: stats.moodTrackingActive,
      change: "+18.5%",
      trend: "up",
      icon: <FiTrendingUp size={24} />,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "student",
      title: "New Student Registration",
      description: "5 new students registered today",
      time: "2 hours ago",
      icon: <FiUsers />,
      color: "#1ecab8",
    },
    {
      id: 2,
      type: "alert",
      title: "Critical Case Alert",
      description: "2 students require immediate attention",
      time: "3 hours ago",
      icon: <FiAlertCircle />,
      color: "#ef4444",
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance Update",
      description: "Daily attendance marked for all classes",
      time: "4 hours ago",
      icon: <FiCheckCircle />,
      color: "#10b981",
    },
    {
      id: 4,
      type: "mood",
      title: "Mood Tracking",
      description: "156 students logged their mood today",
      time: "5 hours ago",
      icon: <FiTrendingUp />,
      color: "#8b5cf6",
    },
  ];

  const [moodDistribution, setMoodDistribution] = useState([
    { zone: "Green Zone", count: 0, percentage: 0, color: "#10b981" },
    { zone: "Yellow Zone", count: 0, percentage: 0, color: "#f59e0b" },
    { zone: "Orange Zone", count: 0, percentage: 0, color: "#f97316" },
    { zone: "Red Zone", count: 0, percentage: 0, color: "#ef4444" },
  ]);

  useEffect(() => {
    const fetchMoodDistribution = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/schools/dashboard/stats`);
        if (response.data && response.data.moodDistribution) {
          const zoneColors: { [key: string]: string } = {
            Green: "#10b981",
            Yellow: "#f59e0b",
            Orange: "#f97316",
            "Light Red": "#ff6b6b",
            "Dark Red": "#ef4444",
            Red: "#ef4444",
          };
          
          const distribution = response.data.moodDistribution.map((item: any) => ({
            zone: item.zone || "Unknown",
            count: item.count || 0,
            percentage: parseFloat(item.percentage) || 0,
            color: zoneColors[item.zone] || "#6b7280",
          }));
          
          setMoodDistribution(distribution);
        }
      } catch (error) {
        console.error("Error fetching mood distribution:", error);
      }
    };

    fetchMoodDistribution();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">School Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your school.</p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["week", "month", "quarter", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? "bg-[#1ecab8] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <FiBell size={20} className="text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2">
            <FiBarChart2 size={18} />
            View Reports
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ background: `${stat.color}15` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.trend === "up" ? (
                  <FiArrowUp size={14} />
                ) : (
                  <FiArrowDown size={14} />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof stat.value === "number" ? (
                  <CountUp end={stat.value} duration={2} />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Mood Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mood Distribution</h2>
            <button className="text-sm text-[#1ecab8] hover:text-[#1bb8a6] font-medium">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {moodDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.zone}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{item.count} students</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <button className="text-sm text-[#1ecab8] hover:text-[#1bb8a6] font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ background: `${activity.color}15` }}
                >
                  <div style={{ color: activity.color }}>{activity.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <FiUsers size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Manage Students</h3>
          <p className="text-sm opacity-90">View and manage student records</p>
        </div>
        <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <FiBook size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Academic Setup</h3>
          <p className="text-sm opacity-90">Configure classes and subjects</p>
        </div>
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <FiBarChart2 size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">View Reports</h3>
          <p className="text-sm opacity-90">Generate and analyze reports</p>
        </div>
        <div className="bg-gradient-to-br from-[#ec4899] to-[#db2777] rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <FiCalendar size={32} className="mb-3" />
          <h3 className="font-bold text-lg mb-1">Calendar</h3>
          <p className="text-sm opacity-90">View events and schedules</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;

