import React, { useState } from "react";
import CountUp from "react-countup";

// TypeScript interfaces
interface MentalHealthStat {
  title: string;
  value: string;
  numericValue: number;
  change: string;
  icon: string;
  color: string;
  gradient: string;
  trend: "up" | "down";
  detail: string;
}

interface EmotionalZone {
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
  description: string;
}

interface TopEmotion {
  emotion: string;
  count: number;
  percentage: number;
  color: string;
  trend: string;
}

interface RecentMoodUpdate {
  id: number;
  student: string;
  grade: string;
  mood: string;
  emotion: string;
  zone: string;
  time: string;
  avatar: string;
  note: string;
}

interface QuickAction {
  title: string;
  icon: string;
  color: string;
  description: string;
}

interface PeriodOption {
  value: string;
  label: string;
}

interface MoodFilter {
  value: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6M");
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("all");

  // Enhanced mental health focused data
  const mentalHealthStats: MentalHealthStat[] = [
    {
      title: "Students Monitored",
      value: "2,847",
      numericValue: 2847,
      change: "+12.5%",
      icon: "👥",
      color: "#2ad2c9",
      gradient: "linear-gradient(135deg, #2ad2c9 0%, #1e9b8f 100%)",
      trend: "up",
      detail: "Mental health tracking active",
    },
    {
      title: "Positive Mood",
      value: "1,923",
      numericValue: 1923,
      change: "+18.2%",
      icon: "😊",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      trend: "up",
      detail: "Happy & engaged students",
    },
    {
      title: "Needs Attention",
      value: "324",
      numericValue: 324,
      change: "-8.5%",
      icon: "😔",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      trend: "down",
      detail: "Requires support",
    },
    {
      title: "Critical Cases",
      value: "42",
      numericValue: 42,
      change: "-15.3%",
      icon: "🚨",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      trend: "down",
      detail: "Immediate intervention needed",
    },
  ];

  const emotionalZones: EmotionalZone[] = [
    {
      name: "Green Zone",
      count: 1923,
      percentage: 67.5,
      color: "#10b981",
      icon: "🟢",
      description: "Happy & Productive",
    },
    {
      name: "Yellow Zone",
      count: 324,
      percentage: 11.4,
      color: "#f59e0b",
      icon: "🟡",
      description: "Stressed & Anxious",
    },
    {
      name: "Orange Zone",
      count: 156,
      percentage: 5.5,
      color: "#f97316",
      icon: "🟠",
      description: "Frustrated & Overwhelmed",
    },
    {
      name: "Red Zone",
      count: 42,
      percentage: 1.5,
      color: "#ef4444",
      icon: "🔴",
      description: "Critical & Distressed",
    },
    {
      name: "Blue Zone",
      count: 402,
      percentage: 14.1,
      color: "#3b82f6",
      icon: "🔵",
      description: "Sad & Withdrawn",
    },
  ];

  const topEmotions: TopEmotion[] = [
    {
      emotion: "Happy",
      count: 892,
      percentage: 31.3,
      color: "#10b981",
      trend: "+12%",
    },
    {
      emotion: "Anxious",
      count: 456,
      percentage: 16.0,
      color: "#f59e0b",
      trend: "-8%",
    },
    {
      emotion: "Stressed",
      count: 324,
      percentage: 11.4,
      color: "#f97316",
      trend: "-15%",
    },
    {
      emotion: "Sad",
      count: 298,
      percentage: 10.5,
      color: "#3b82f6",
      trend: "-5%",
    },
    {
      emotion: "Angry",
      count: 156,
      percentage: 5.5,
      color: "#ef4444",
      trend: "-20%",
    },
  ];

  const recentMoodUpdates: RecentMoodUpdate[] = [
    {
      id: 1,
      student: "Sarah Johnson",
      grade: "10th Grade",
      mood: "Happy",
      emotion: "Excited",
      zone: "Green",
      time: "2 minutes ago",
      avatar: "SJ",
      note: "Excited about upcoming science project",
    },
    {
      id: 2,
      student: "Mike Chen",
      grade: "9th Grade",
      mood: "Anxious",
      emotion: "Worried",
      zone: "Yellow",
      time: "15 minutes ago",
      avatar: "MC",
      note: "Concerned about math test tomorrow",
    },
    {
      id: 3,
      student: "Emma Davis",
      grade: "11th Grade",
      mood: "Stressed",
      emotion: "Overwhelmed",
      zone: "Orange",
      time: "1 hour ago",
      avatar: "ED",
      note: "Feeling overwhelmed with assignments",
    },
    {
      id: 4,
      student: "Alex Rodriguez",
      grade: "8th Grade",
      mood: "Sad",
      emotion: "Lonely",
      zone: "Blue",
      time: "2 hours ago",
      avatar: "AR",
      note: "Missing friends during lunch break",
    },
    {
      id: 5,
      student: "Jordan Smith",
      grade: "12th Grade",
      mood: "Critical",
      emotion: "Distressed",
      zone: "Red",
      time: "3 hours ago",
      avatar: "JS",
      note: "Needs immediate counselor support",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Mood Check-in",
      icon: "😊",
      color: "#2ad2c9",
      description: "Record student mood",
    },
    {
      title: "Zone Assessment",
      icon: "🎯",
      color: "#6366f1",
      description: "Evaluate emotional zone",
    },
    {
      title: "Emotion Tracking",
      icon: "📊",
      color: "#f59e0b",
      description: "Monitor emotional states",
    },
    {
      title: "Alert System",
      icon: "🚨",
      color: "#ef4444",
      description: "Critical case alerts",
    },
  ];

  const periodOptions: PeriodOption[] = [
    { value: "1M", label: "1 Month" },
    { value: "3M", label: "3 Months" },
    { value: "6M", label: "6 Months" },
    { value: "1Y", label: "1 Year" },
  ];

  const moodFilters: MoodFilter[] = [
    { value: "all", label: "All Moods" },
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Needs Attention" },
    { value: "critical", label: "Critical" },
  ];

  const getZoneBorderColor = (zone: string): string => {
    const zoneColors: { [key: string]: string } = {
      Green: "border-l-green-500",
      Yellow: "border-l-yellow-500",
      Orange: "border-l-orange-500",
      Red: "border-l-red-500",
      Blue: "border-l-blue-500",
    };
    return zoneColors[zone] || "border-l-gray-500";
  };

  const getMoodBadgeClass = (mood: string): string => {
    const moodClasses: { [key: string]: string } = {
      Happy: "bg-green-50 text-green-600",
      Anxious: "bg-yellow-50 text-yellow-600",
      Stressed: "bg-orange-50 text-orange-600",
      Sad: "bg-blue-50 text-blue-600",
      Critical: "bg-red-50 text-red-600",
    };
    return moodClasses[mood] || "bg-gray-50 text-gray-600";
  };

  const getZoneBadgeClass = (zone: string): string => {
    const zoneClasses: { [key: string]: string } = {
      Green: "bg-green-50 text-green-600",
      Yellow: "bg-yellow-50 text-yellow-600",
      Orange: "bg-orange-50 text-orange-600",
      Red: "bg-red-50 text-red-600",
      Blue: "bg-blue-50 text-blue-600",
    };
    return zoneClasses[zone] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen font-sans text-slate-900">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start mb-12 relative">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-[rgba(42,210,201,0.1)] text-[#2ad2c9] px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-[rgba(42,210,201,0.2)] backdrop-blur-sm">
            <span className="text-base">🧠</span>
            <span>Mental Health Dashboard</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 m-0 mb-3 tracking-tight leading-tight">
            Student Emotional Wellness Tracker
          </h1>
          <p className="text-lg text-slate-500 m-0 font-normal leading-relaxed">
            Monitor and support student mental health across your education
            system.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/80 px-5 py-4 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="text-xl opacity-70">📅</div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-slate-900 leading-tight">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mental Health Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {mentalHealthStats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer ${
              hoveredStat === index
                ? "-translate-y-2 shadow-xl border-[rgba(42,210,201,0.2)]"
                : ""
            } hover:-translate-y-2 hover:shadow-xl hover:border-[rgba(42,210,201,0.2)]`}
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div
              className="absolute top-0 left-0 right-0 bottom-0 opacity-5 transition-opacity duration-300"
              style={{ background: stat.gradient }}
            ></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300"
                  style={{ background: stat.color + "20" }}
                >
                  <span>{stat.icon}</span>
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <span className="text-sm font-bold">
                    {stat.trend === "up" ? "↗" : "↘"}
                  </span>
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 m-0 mb-2 leading-none tracking-tight">
                  <CountUp
                    start={0}
                    end={stat.numericValue}
                    duration={2}
                    separator=","
                  />
                </h3>
                <p className="text-base text-slate-500 m-0 mb-2 font-semibold">
                  {stat.title}
                </p>
                <span className="text-sm text-slate-400 font-medium">
                  {stat.detail}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mb-12">
        {/* Emotional Zones Chart */}
        <div className="bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 m-0 mb-2 tracking-tight">
                Emotional Zones Distribution
              </h2>
              <p className="text-base text-slate-500 m-0 font-medium">
                Student emotional states across different zones
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === option.value
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    onClick={() => setSelectedPeriod(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="flex flex-col gap-5">
              {emotionalZones.map((zone, index) => (
                <div
                  key={index}
                  className="bg-slate-50/50 rounded-2xl p-5 transition-all duration-200 border border-transparent hover:bg-slate-50/80 hover:border-slate-200/80 hover:translate-x-1"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-white/80"
                      style={{ color: zone.color }}
                    >
                      {zone.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-slate-900 m-0 mb-1">
                        {zone.name}
                      </h4>
                      <p className="text-sm text-slate-500 m-0 font-medium">
                        {zone.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-bold text-slate-900">
                        {zone.count}
                      </span>
                      <span className="text-sm text-slate-500 font-semibold">
                        {zone.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200/50 rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-300"
                      style={{
                        width: `${zone.percentage}%`,
                        backgroundColor: zone.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Mood Updates */}
        <div className="bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 m-0 mb-2 tracking-tight">
                Recent Mood Updates
              </h2>
              <p className="text-base text-slate-500 m-0 font-medium">
                Latest student emotional check-ins
              </p>
            </div>
            <div className="flex gap-2">
              {moodFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedMoodFilter === filter.value
                      ? "bg-[#2ad2c9] text-white border border-[#2ad2c9]"
                      : "bg-transparent border border-slate-200/80 text-slate-500 hover:bg-[rgba(42,210,201,0.1)] hover:text-[#2ad2c9] hover:border-[#2ad2c9]"
                  }`}
                  onClick={() => setSelectedMoodFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {recentMoodUpdates.map((update) => (
              <div
                key={update.id}
                className={`flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 border-l-4 ${getZoneBorderColor(
                  update.zone
                )} hover:bg-slate-50/80 hover:translate-x-1`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#2ad2c9] to-[#1e9b8f] text-white rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {update.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-slate-900 m-0">
                        {update.student}
                      </p>
                      <span className="text-xs text-slate-500 font-medium">
                        {update.grade}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${getMoodBadgeClass(
                          update.mood
                        )}`}
                      >
                        {update.mood}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${getZoneBadgeClass(
                          update.zone
                        )}`}
                      >
                        {update.zone} Zone
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-slate-500 m-0 font-medium">
                      Feeling: <strong>{update.emotion}</strong>
                    </p>
                    <p className="text-xs text-slate-400 m-0 italic">
                      {update.note}
                    </p>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {update.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Emotions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Emotions */}
        <div className="bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <div className="mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 m-0 mb-2 tracking-tight">
                Top Emotions
              </h2>
              <p className="text-base text-slate-500 m-0 font-medium">
                Most common emotional states
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {topEmotions.map((emotion, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 transition-all duration-200 hover:bg-slate-50/80 hover:translate-x-1 relative"
              >
                <div className="text-lg font-extrabold text-slate-400 min-w-[30px]">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-900 m-0 mb-1">
                    {emotion.emotion}
                  </h4>
                  <div className="flex gap-3">
                    <span className="text-sm text-slate-500 font-medium">
                      {emotion.count} students
                    </span>
                    <span className="text-sm text-slate-400 font-medium">
                      {emotion.percentage}%
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md ${
                      emotion.trend.startsWith("+")
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {emotion.trend}
                  </span>
                </div>
                <div
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: emotion.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
          <div className="mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 m-0 mb-2 tracking-tight">
                Quick Actions
              </h2>
              <p className="text-base text-slate-500 m-0 font-medium">
                Mental health management tools
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden border border-slate-200/80 hover:-translate-y-1 hover:shadow-lg hover:border-[rgba(42,210,201,0.2)]"
              >
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 opacity-0 transition-opacity duration-300"
                  style={{ background: action.color + "08" }}
                ></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
                    style={{ background: action.color + "15" }}
                  >
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 m-0 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500 m-0 font-medium">
                      {action.description}
                    </p>
                  </div>
                  <div className="text-slate-400 text-base transition-all duration-200">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

