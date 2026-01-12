import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiHeart,
  FiTrendingUp,
  FiCalendar,
  FiArrowLeft,
  FiBarChart2,
  FiChevronRight,
} from "react-icons/fi";

interface MoodEntry {
  id: number;
  date: string;
  time: string;
  mood: string;
  emotion: string;
  zone: string;
  pleasantness: number;
  impact: number;
  note?: string;
}

const ChildMoodTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  // Static data for demo
  const childData = {
    id: id ? parseInt(id) : 1,
    name: id === "2" ? "Michael Johnson" : "Emma Johnson",
    grade: id === "2" ? "Grade 5" : "Grade 7",
    school: "Greenwood Middle School",
  };

  const moodEntries: MoodEntry[] = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:30",
      mood: "Happy",
      emotion: "Joyful",
      zone: "Green Zone",
      pleasantness: 7,
      impact: 6,
      note: "Feeling great about the upcoming school trip",
    },
    {
      id: 2,
      date: "2024-01-14",
      time: "09:15",
      mood: "Happy",
      emotion: "Content",
      zone: "Green Zone",
      pleasantness: 6,
      impact: 5,
    },
    {
      id: 3,
      date: "2024-01-13",
      time: "10:00",
      mood: id === "2" ? "Anxious" : "Happy",
      emotion: id === "2" ? "Worried" : "Excited",
      zone: id === "2" ? "Yellow Zone" : "Green Zone",
      pleasantness: id === "2" ? 4 : 7,
      impact: id === "2" ? 5 : 6,
      note: id === "2" ? "Feeling nervous about the test" : undefined,
    },
    {
      id: 4,
      date: "2024-01-12",
      time: "08:45",
      mood: "Happy",
      emotion: "Calm",
      zone: "Green Zone",
      pleasantness: 6,
      impact: 4,
    },
    {
      id: 5,
      date: "2024-01-11",
      time: "09:30",
      mood: "Happy",
      emotion: "Energetic",
      zone: "Green Zone",
      pleasantness: 7,
      impact: 7,
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

  const stats = {
    totalEntries: moodEntries.length,
    averagePleasantness: Math.round(
      moodEntries.reduce((sum, e) => sum + e.pleasantness, 0) / moodEntries.length
    ),
    averageImpact: Math.round(
      moodEntries.reduce((sum, e) => sum + e.impact, 0) / moodEntries.length
    ),
    mostCommonZone: "Green Zone",
    mostCommonMood: "Happy",
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#1ecab8] mb-4 transition-colors"
        >
          <FiArrowLeft />
          Back to Children
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {childData.name}'s Mood Tracking
            </h1>
            <p className="text-slate-600">
              {childData.grade} • {childData.school}
            </p>
          </div>
          <div className="flex gap-2">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? "bg-[#1ecab8] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Total Entries</div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalEntries}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Avg. Pleasantness</div>
          <div className="text-3xl font-bold text-slate-900">{stats.averagePleasantness}/7</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Avg. Impact</div>
          <div className="text-3xl font-bold text-slate-900">{stats.averageImpact}/7</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Most Common Zone</div>
          <div className="text-lg font-bold text-slate-900">{stats.mostCommonZone}</div>
        </div>
      </div>

      {/* Mood Entries */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <FiHeart />
            <span>Mood History</span>
          </div>
        </div>
        <div className="space-y-4">
          {moodEntries.map((entry) => (
            <div
              key={entry.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ background: getZoneColor(entry.zone) }}
                  >
                    {entry.mood.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{entry.mood}</h3>
                      <span className="text-sm text-slate-500">•</span>
                      <span className="text-sm text-slate-600">{entry.emotion}</span>
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold text-white"
                        style={{ background: getZoneColor(entry.zone) }}
                      >
                        {entry.zone}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>{entry.time}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded mt-2">
                        {entry.note}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>Pleasantness: {entry.pleasantness}/7</span>
                      <span>•</span>
                      <span>Impact: {entry.impact}/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildMoodTracking;

