import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiAlertCircle,
  FiChevronRight,
  FiSearch,
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
  email: string;
  phone?: string;
}

const Children: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Static data for demo
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
      email: "emma.johnson@school.com",
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
      email: "michael.johnson@school.com",
    },
  ];

  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getZoneColor = (zone: string): string => {
    const colors: { [key: string]: string } = {
      "Green Zone": "#10b981",
      "Yellow Zone": "#f59e0b",
      "Brown Zone": "#8b4513",
      "Light Red Zone": "#ff6b6b",
      "Dark Red Zone": "#dc2626",
      "Blue Zone": "#3b82f6",
    };
    return colors[zone] || "#ccc";
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Children</h1>
        <p className="text-slate-600">Manage and monitor your children's profiles</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-slate-200/80">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
          />
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChildren.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold text-white"
                  style={{ background: getZoneColor(child.currentZone) }}
                >
                  {child.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {child.name}
                    </h3>
                    {child.needsAttention && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Needs Attention
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    {child.age} years old • {child.grade}
                  </p>
                  <p className="text-sm text-slate-500">{child.school}</p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mb-4 p-4 rounded-lg" style={{ background: `${getZoneColor(child.currentZone)}15` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Current Status</span>
                <span
                  className="text-sm font-semibold px-2 py-1 rounded"
                  style={{ background: getZoneColor(child.currentZone), color: "white" }}
                >
                  {child.currentZone}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Mood: <strong>{child.currentMood}</strong> • Last logged: {child.lastLogged}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">Mood Streak</div>
                <div className="text-lg font-bold text-slate-900">{child.moodStreak} days</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-1">Total Logs</div>
                <div className="text-lg font-bold text-slate-900">{child.totalMoods}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Link
                to={`/parent/children/${child.id}/mood-tracking`}
                className="flex-1 bg-[#1ecab8] text-white text-center py-2 rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center justify-center gap-2"
              >
                <FiTrendingUp size={18} />
                View Mood Tracking
              </Link>
              <Link
                to={`/parent/children/${child.id}/profile`}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiUsers size={18} />
                Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredChildren.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200/80">
          <FiUsers size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600">No children found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Children;

