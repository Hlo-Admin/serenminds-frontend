import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiBell,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

interface Child {
  id: number;
  name: string;
  age: number;
  grade: string;
  school: string;
  currentMood: string;
  currentZone: string;
  lastLogged: string;
  moodStreak: number;
  totalMoods: number;
  needsAttention: boolean;
  avatar?: string;
}

interface QuickStat {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
  trendUp: boolean;
}

interface Notification {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  type: string;
  childName?: string;
}

interface RecentActivity {
  id: number;
  type: string;
  action: string;
  details: string;
  time: string;
  icon: string;
  color: string;
  childName: string;
}

const ParentDashboard: React.FC = () => {
  // Static data for demo
  const parentName = "John Parent";
  
  const children: Child[] = [
    {
      id: 1,
      name: "Emma Johnson",
      age: 12,
      grade: "Grade 7",
      school: "Greenwood Middle School",
      currentMood: "Happy",
      currentZone: "Green Zone",
      lastLogged: "2 hours ago",
      moodStreak: 15,
      totalMoods: 45,
      needsAttention: false,
    },
    {
      id: 2,
      name: "Michael Johnson",
      age: 10,
      grade: "Grade 5",
      school: "Greenwood Middle School",
      currentMood: "Anxious",
      currentZone: "Yellow Zone",
      lastLogged: "5 hours ago",
      moodStreak: 8,
      totalMoods: 32,
      needsAttention: true,
    },
  ];

  const quickStats: QuickStat[] = [
    {
      title: "Total Children",
      value: children.length,
      subtitle: "registered",
      icon: <FiUsers size={24} />,
      iconBg: "#1ecab8",
      trend: "+0",
      trendUp: true,
    },
    {
      title: "Active Tracking",
      value: children.filter((c) => c.moodStreak > 0).length,
      subtitle: "children tracking",
      icon: <FiCheckCircle size={24} />,
      iconBg: "#10b981",
      trend: "+1",
      trendUp: true,
    },
    {
      title: "Needs Attention",
      value: children.filter((c) => c.needsAttention).length,
      subtitle: "children",
      icon: <FiAlertCircle size={24} />,
      iconBg: "#f59e0b",
      trend: "-1",
      trendUp: false,
    },
    {
      title: "Total Mood Logs",
      value: children.reduce((sum, c) => sum + c.totalMoods, 0),
      subtitle: "this month",
      icon: <FiHeart size={24} />,
      iconBg: "#ee5a6f",
      trend: "+12",
      trendUp: true,
    },
  ];

  const notifications: Notification[] = [
    {
      id: 1,
      icon: "⚠️",
      iconBg: "#fef3c7",
      title: "Attention Needed",
      message: "Michael's mood has been in Yellow Zone for 3 days",
      time: "1 hour ago",
      type: "alert",
      childName: "Michael",
    },
    {
      id: 2,
      icon: "🎉",
      iconBg: "#dbeafe",
      title: "Great Progress!",
      message: "Emma completed a 15-day mood tracking streak",
      time: "3 hours ago",
      type: "achievement",
      childName: "Emma",
    },
    {
      id: 3,
      icon: "📊",
      iconBg: "#e0e7ff",
      title: "Weekly Report Available",
      message: "View your children's weekly mood summary",
      time: "1 day ago",
      type: "report",
    },
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
      childName: "Emma",
    },
    {
      id: 2,
      type: "alert",
      action: "Zone change",
      details: "Moved to Yellow Zone",
      time: "5 hours ago",
      icon: "⚠️",
      color: "#f39c12",
      childName: "Michael",
    },
    {
      id: 3,
      type: "achievement",
      action: "Streak milestone",
      details: "15 days completed",
      time: "1 day ago",
      icon: "🏆",
      color: "#feca57",
      childName: "Emma",
    },
  ];

  const getZoneColor = (zone: string): string => {
    const colors: { [key: string]: string } = {
      "Green Zone": "#2ecc71",
      "Yellow Zone": "#f39c12",
      "Orange Zone": "#e67e22",
      "Red Zone": "#e74c3c",
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
              Welcome back, {parentName}! 👋
            </h1>
            <p className="text-slate-600 mb-4">
              Monitor your children's wellbeing and track their emotional progress
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Children</span>
                <span className="text-lg font-bold text-slate-900">
                  {children.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Active Tracking</span>
                <span className="text-lg font-bold text-slate-900">
                  {children.filter((c) => c.moodStreak > 0).length}/{children.length}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 flex items-center gap-4">
            <div className="text-4xl">👨‍👩‍👧‍👦</div>
            <div>
              <div className="text-xs text-teal-600 font-semibold mb-1">
                Family Overview
              </div>
              <div className="text-lg font-bold text-teal-700">
                All Children Active
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
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.iconBg}15`, color: stat.iconBg }}
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
          {/* Children List */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiUsers />
                <span>My Children</span>
              </div>
              <Link
                to="/parent/children"
                className="text-sm text-[#1ecab8] font-medium hover:underline flex items-center gap-1"
              >
                View All <FiChevronRight />
              </Link>
            </div>
            <div className="space-y-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold text-white"
                        style={{ background: getZoneColor(child.currentZone) }}
                      >
                        {child.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {child.name}
                          </h3>
                          {child.needsAttention && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              Needs Attention
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          {child.grade} • {child.school}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>
                            Current: <strong>{child.currentMood}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Zone: <strong>{child.currentZone}</strong>
                          </span>
                          <span>•</span>
                          <span>Last logged: {child.lastLogged}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/parent/children/${child.id}/mood-tracking`}
                      className="text-[#1ecab8] hover:text-[#1bb8a6] transition-colors"
                    >
                      <FiChevronRight size={20} />
                    </Link>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">Mood Streak</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {child.moodStreak} days
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">Total Logs</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {child.totalMoods}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Trends Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiBarChart2 />
                <span>Family Mood Overview</span>
              </div>
              <Link
                to="/parent/reports"
                className="text-sm text-[#1ecab8] font-medium hover:underline flex items-center gap-1"
              >
                View Reports <FiChevronRight />
              </Link>
            </div>
            <div className="space-y-4">
              {children.map((child) => (
                <div key={child.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {child.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {child.currentZone}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: child.needsAttention ? "60%" : "85%",
                        background: getZoneColor(child.currentZone),
                      }}
                    />
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
              <FiUser />
              <span>Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/parent/children"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #1ecab8 0%, #1bb8a6 100%)",
                  }}
                >
                  <FiUsers />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  My Children
                </span>
              </Link>

              <Link
                to="/parent/reports"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #00c7b7 0%, #009e8e 100%)",
                  }}
                >
                  <FiBarChart2 />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Reports
                </span>
              </Link>

              <Link
                to="/parent/calendar"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                  }}
                >
                  <FiCalendar />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Calendar
                </span>
              </Link>

              <Link
                to="/parent/notifications"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-[#1ecab8] hover:bg-teal-50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)",
                  }}
                >
                  <FiBell />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  Notifications
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FiTrendingUp />
                <span>Recent Activity</span>
              </div>
              <Link
                to="/parent/children"
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
                      {activity.childName} - {activity.action}
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
                <span>Notifications</span>
              </div>
              <Link
                to="/parent/notifications"
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
              to="/parent/notifications"
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

export default ParentDashboard;

