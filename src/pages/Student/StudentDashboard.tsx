import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiHeart,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiSend,
  FiBell,
  FiBook,
  FiActivity,
  FiTarget,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
} from "react-icons/fi";

// TypeScript interfaces
interface StudentData {
  name: string;
  currentMood: string;
  currentZone: string;
  lastLogged: string;
  loginStreak: number;
  moodLogStreak: number;
  totalMoods: number;
  upcomingEvents: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

interface Notification {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  type: string;
}

interface QuickStat {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  iconBg: string;
  trend: string;
  trendUp: boolean;
}

interface MoodTrend {
  day: string;
  zone: string;
  value: number;
}

interface RecentActivity {
  id: number;
  type: string;
  action: string;
  details: string;
  time: string;
  icon: string;
  color: string;
}

interface WeeklyInsight {
  title: string;
  value: string;
  percentage: number;
  color: string;
  icon: string;
}

const StudentDashboard: React.FC = () => {
  // Static data for demo
  const studentData: StudentData = {
    name: "Sarah Johnson",
    currentMood: "Happy",
    currentZone: "Green Zone",
    lastLogged: "2 hours ago",
    loginStreak: 15,
    moodLogStreak: 12,
    totalMoods: 45,
    upcomingEvents: 3,
    weeklyProgress: 78,
    monthlyGoal: 30,
    monthlyProgress: 22,
  };

  const notifications: Notification[] = [
    {
      id: 1,
      icon: "🎉",
      iconBg: "#ffeaa7",
      title: "New Reward Unlocked!",
      message: "Congratulations! You've earned the '7-Day Streak' reward.",
      time: "5 minutes ago",
      type: "reward",
    },
    {
      id: 2,
      icon: "😊",
      iconBg: "#74b9ff",
      title: "Mood Subcategory Added",
      message: "A new emotion 'Grateful' has been added to the Happy category.",
      time: "1 hour ago",
      type: "update",
    },
    {
      id: 3,
      icon: "✨",
      iconBg: "#a29bfe",
      title: "Account Activated",
      message: "Your premium features are now active. Enjoy!",
      time: "3 hours ago",
      type: "system",
    },
  ];

  const quickStats: QuickStat[] = [
    {
      title: "Login Streak",
      value: studentData.loginStreak,
      subtitle: "days in a row",
      icon: "🔥",
      iconBg: "#ff6b6b",
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Mood Logs",
      value: studentData.totalMoods,
      subtitle: "total entries",
      icon: "❤️",
      iconBg: "#ee5a6f",
      trend: "+5",
      trendUp: true,
    },
    {
      title: "Mood Streak",
      value: studentData.moodLogStreak,
      subtitle: "days logged",
      icon: "⚡",
      iconBg: "#feca57",
      trend: "+1",
      trendUp: true,
    },
    {
      title: "Rewards",
      value: "5",
      subtitle: "earned",
      icon: "🏆",
      iconBg: "#48dbfb",
      trend: "+1",
      trendUp: true,
    },
  ];

  const moodTrends: MoodTrend[] = [
    { day: "Mon", zone: "green", value: 85 },
    { day: "Tue", zone: "green", value: 82 },
    { day: "Wed", zone: "yellow", value: 65 },
    { day: "Thu", zone: "green", value: 88 },
    { day: "Fri", zone: "green", value: 90 },
    { day: "Sat", zone: "green", value: 87 },
    { day: "Sun", zone: "green", value: 85 },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "mood",
      action: "Logged mood",
      details: "Happy - Joyful",
      time: "2 hours ago",
      icon: "😊",
      color: "#2ecc71",
    },
    {
      id: 2,
      type: "reward",
      action: "Earned reward",
      details: "7-Day Login Streak",
      time: "5 hours ago",
      icon: "🏆",
      color: "#feca57",
    },
    {
      id: 3,
      type: "community",
      action: "Posted in",
      details: "Student Wellness Hub",
      time: "1 day ago",
      icon: "💬",
      color: "#74b9ff",
    },
    {
      id: 4,
      type: "streak",
      action: "Maintained streak",
      details: "12 days mood logging",
      time: "1 day ago",
      icon: "🔥",
      color: "#ff6b6b",
    },
  ];

  const weeklyInsights: WeeklyInsight[] = [
    {
      title: "Most Common Zone",
      value: "Green Zone",
      percentage: 72,
      color: "#2ecc71",
      icon: "😊",
    },
    {
      title: "Average Mood Score",
      value: "8.2/10",
      percentage: 82,
      color: "#00c7b7",
      icon: "📊",
    },
    {
      title: "Consistency Score",
      value: "Excellent",
      percentage: 95,
      color: "#a29bfe",
      icon: "⭐",
    },
  ];

  const getZoneColor = (zone: string): string => {
    const colors: { [key: string]: string } = {
      green: "#2ecc71",
      yellow: "#f39c12",
      orange: "#e67e22",
      red: "#e74c3c",
    };
    return colors[zone] || "#ccc";
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Enhanced Greeting Section */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Welcome back, {studentData.name}! 👋
            </h1>
            <p className="text-slate-600 mb-4">
              You're in the <strong>{studentData.currentZone}</strong> today.
              Current mood: <strong>{studentData.currentMood}</strong> (logged{" "}
              {studentData.lastLogged})
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">This Week</span>
                <span className="text-lg font-bold text-slate-900">
                  {studentData.weeklyProgress}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Monthly Goal</span>
                <span className="text-lg font-bold text-slate-900">
                  {studentData.monthlyProgress}/{studentData.monthlyGoal}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 flex items-center gap-4">
            <div className="text-4xl">😊</div>
            <div>
              <div className="text-xs text-green-600 font-semibold mb-1">
                Current Zone
              </div>
              <div className="text-lg font-bold text-green-700">
                {studentData.currentZone}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-slate-600">
                {stat.title}
              </span>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: stat.iconBg }}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{stat.subtitle}</span>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.trendUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trendUp ? (
                    <FiArrowUp size={14} />
                  ) : (
                    <FiArrowDown size={14} />
                  )}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Mood Trends Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiBarChart2 />
                <span>Weekly Mood Trends</span>
              </div>
              <Link
                to="/student/mood-overview"
                className="text-sm text-[#1ecab8] font-medium hover:underline flex items-center gap-1"
              >
                View Details <FiChevronRight />
              </Link>
            </div>
            <div className="flex items-end justify-between gap-2 h-48 mb-6">
              {moodTrends.map((trend, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-full flex items-end">
                    <div className="w-full relative h-full flex items-end">
                      <div
                        className="w-full rounded-t-lg transition-all hover:opacity-80"
                        style={{
                          height: `${trend.value}%`,
                          background: getZoneColor(trend.zone),
                        }}
                        title={`${trend.day}: ${trend.value}%`}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    {trend.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Avg. Score</span>
                <span className="text-sm font-semibold text-slate-900">8.2/10</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Best Day</span>
                <span className="text-sm font-semibold text-slate-900">Friday</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Consistency</span>
                <span className="text-sm font-semibold text-slate-900">95%</span>
              </div>
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
              <FiTarget />
              <span>Weekly Insights</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weeklyInsights.map((insight, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">
                      {insight.title}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-3">
                    {insight.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${insight.percentage}%`,
                          background: insight.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {insight.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
              <FiBook />
              <span>Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/student/log-mood"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  }}
                >
                  <FiHeart />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Log Mood
                </span>
              </Link>

              <Link
                to="/student/mood-history"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #00c7b7 0%, #009e8e 100%)",
                  }}
                >
                  <FiTrendingUp />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Mood History
                </span>
              </Link>

              <Link
                to="/student/calendar"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                  }}
                >
                  <FiCalendar />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Calendar
                </span>
              </Link>

              <Link
                to="/student/streaks-rewards"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)",
                  }}
                >
                  <FiAward />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Rewards
                </span>
              </Link>

              <Link
                to="/student/community"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
                  }}
                >
                  <FiUsers />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Community
                </span>
              </Link>

              <Link
                to="/student/referrals"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)",
                  }}
                >
                  <FiSend />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Invite Friends
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiActivity />
                <span>Recent Activity</span>
              </div>
              <Link
                to="/student/mood-history"
                className="text-sm text-[#1ecab8] font-medium hover:underline flex items-center gap-1"
              >
                View All <FiChevronRight />
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${activity.color}15` }}
                  >
                    <span>{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {activity.action}
                    </div>
                    <div className="text-xs text-slate-600 mb-1">
                      {activity.details}
                    </div>
                    <div className="text-xs text-slate-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiBell />
                <span>Recent Notifications</span>
              </div>
              <Link
                to="/student/notifications"
                className="text-sm text-[#1ecab8] font-medium hover:underline flex items-center gap-1"
              >
                View All <FiChevronRight />
              </Link>
            </div>
            <div className="space-y-4 mb-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: notif.iconBg }}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 mb-1">
                      {notif.title}
                    </div>
                    <div className="text-xs text-slate-600 mb-1">
                      {notif.message}
                    </div>
                    <div className="text-xs text-slate-400">{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/student/notifications"
              className="text-sm text-[#1ecab8] font-medium hover:underline block text-center pt-4 border-t border-slate-200"
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

