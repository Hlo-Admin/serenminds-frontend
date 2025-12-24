import React, { useState } from "react";
import { FiTrendingUp, FiCalendar, FiBarChart2 } from "react-icons/fi";

// TypeScript interfaces
interface OverviewStats {
  totalMoods: number;
  averageImpact: number;
  averageJoyfulness: number;
  mostCommonZone: string;
  mostCommonEmotion: string;
  streakDays: number;
  totalDays: number;
}

interface ZoneDistribution {
  zone: string;
  count: number;
  percentage: number;
  color: string;
}

interface EmotionDistribution {
  emotion: string;
  count: number;
  percentage: number;
  icon: string;
  color: string;
}

interface WeeklyTrend {
  day: string;
  moods: number;
  avgImpact: number;
  avgJoyfulness: number;
}

interface Insight {
  type: "positive" | "negative" | "info";
  title: string;
  message: string;
  icon: string;
}

const MoodOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");

  // Static overview data
  const overviewStats: OverviewStats = {
    totalMoods: 45,
    averageImpact: 5.2,
    averageJoyfulness: 5.8,
    mostCommonZone: "Green Zone",
    mostCommonEmotion: "Happy",
    streakDays: 12,
    totalDays: 30,
  };

  const zoneDistribution: ZoneDistribution[] = [
    { zone: "Green Zone", count: 28, percentage: 62, color: "#2ecc71" },
    { zone: "Yellow Zone", count: 10, percentage: 22, color: "#f39c12" },
    { zone: "Orange Zone", count: 5, percentage: 11, color: "#e67e22" },
    { zone: "Red Zone", count: 2, percentage: 5, color: "#e74c3c" },
  ];

  const emotionDistribution: EmotionDistribution[] = [
    { emotion: "Happy", count: 18, percentage: 40, icon: "😊", color: "#2ecc71" },
    { emotion: "Calm", count: 12, percentage: 27, icon: "😌", color: "#1abc9c" },
    { emotion: "Anxious", count: 8, percentage: 18, icon: "😰", color: "#f39c12" },
    { emotion: "Sad", count: 4, percentage: 9, icon: "😢", color: "#3498db" },
    { emotion: "Angry", count: 3, percentage: 6, icon: "😠", color: "#e74c3c" },
  ];

  const weeklyTrend: WeeklyTrend[] = [
    { day: "Mon", moods: 3, avgImpact: 5.5, avgJoyfulness: 6.0 },
    { day: "Tue", moods: 2, avgImpact: 4.5, avgJoyfulness: 5.5 },
    { day: "Wed", moods: 4, avgImpact: 6.0, avgJoyfulness: 6.5 },
    { day: "Thu", moods: 3, avgImpact: 5.0, avgJoyfulness: 5.0 },
    { day: "Fri", moods: 5, avgImpact: 5.8, avgJoyfulness: 6.2 },
    { day: "Sat", moods: 2, avgImpact: 4.5, avgJoyfulness: 5.5 },
    { day: "Sun", moods: 3, avgImpact: 5.2, avgJoyfulness: 5.8 },
  ];

  const insights: Insight[] = [
    {
      type: "positive",
      title: "Great Consistency!",
      message: "You've logged moods for 12 consecutive days. Keep it up!",
      icon: "🔥",
    },
    {
      type: "positive",
      title: "Mostly Green Zone",
      message: "You've been in the Green Zone 62% of the time this month.",
      icon: "😊",
    },
    {
      type: "info",
      title: "Happy is Your Top Emotion",
      message: "Happy emotions account for 40% of your logged moods.",
      icon: "❤️",
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold m-0">Mood Overview</h2>
          <p className="text-gray-500 mt-1.5 text-sm">
            Comprehensive insights into your emotional patterns
          </p>
        </div>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                selectedPeriod === period
                  ? "bg-[#1ecab8] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Total Moods
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
              <FiBarChart2 className="text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {overviewStats.totalMoods}
          </div>
          <div className="text-xs text-slate-500">
            logged this {selectedPeriod}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Avg Impact
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
              <FiTrendingUp className="text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {overviewStats.averageImpact.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">out of 7</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Avg Joyfulness
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 text-xl">
              ❤️
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {overviewStats.averageJoyfulness.toFixed(1)}
          </div>
          <div className="text-xs text-slate-500">out of 7</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Most Common Zone
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-xl">
              🎯
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mb-1">
            {overviewStats.mostCommonZone}
          </div>
          <div className="text-xs text-slate-500">this {selectedPeriod}</div>
        </div>
      </div>

      {/* Zone Distribution */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          <FiBarChart2 />
          Zone Distribution
        </div>
        <div className="space-y-4">
          {zoneDistribution.map((item) => (
            <div key={item.zone}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="font-semibold text-sm">{item.zone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {item.count} moods
                  </span>
                  <span
                    className="font-bold text-base"
                    style={{ color: item.color }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          <FiTrendingUp />
          Emotion Distribution
        </div>
        <div className="space-y-4">
          {emotionDistribution.map((item) => (
            <div key={item.emotion}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.emotion}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {item.count} times
                  </span>
                  <span
                    className="font-bold text-base"
                    style={{ color: item.color }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percentage}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          <FiCalendar />
          Weekly Trend
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weeklyTrend.map((day) => (
            <div
              key={day.day}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-xs text-gray-500 mb-2">{day.day}</div>
              <div className="text-xl font-bold mb-1">{day.moods}</div>
              <div className="text-[11px] text-gray-600">moods</div>
              <div className="mt-2 p-1.5 bg-white rounded-md text-[11px]">
                <div>I: {day.avgImpact}</div>
                <div>J: {day.avgJoyfulness}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl p-7 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          💡 Insights
        </div>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl flex items-center gap-4 ${
                insight.type === "positive"
                  ? "bg-blue-50 border-2 border-[#1ecab8]"
                  : insight.type === "negative"
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-gray-50 border-2 border-gray-300"
              }`}
            >
              <div className="text-3xl">{insight.icon}</div>
              <div className="flex-1">
                <div className="text-base font-bold mb-1 text-slate-900">
                  {insight.title}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {insight.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodOverview;

