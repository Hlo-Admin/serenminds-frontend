import React, { useState } from "react";
import { FiBarChart2, FiDownload, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface ReportData {
  period: string;
  totalMoodLogs: number;
  averageMood: number;
  zoneDistribution: {
    green: number;
    yellow: number;
    orange: number;
    red: number;
  };
  trends: {
    label: string;
    value: number;
    change: number;
    trend: "up" | "down";
  }[];
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  // Static data for demo
  const reportData: ReportData = {
    period: selectedPeriod,
    totalMoodLogs: 77,
    averageMood: 6.2,
    zoneDistribution: {
      green: 65,
      yellow: 25,
      orange: 8,
      red: 2,
    },
    trends: [
      { label: "Mood Consistency", value: 85, change: 5, trend: "up" },
      { label: "Engagement Rate", value: 78, change: 12, trend: "up" },
      { label: "Attention Needed", value: 15, change: -8, trend: "down" },
      { label: "Average Pleasantness", value: 6.2, change: 0.3, trend: "up" },
    ],
  };

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-slate-600">Comprehensive insights into your children's wellbeing</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors">
            <FiDownload size={18} />
            Export Report
          </button>
        </div>

        {/* Period Selector */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Total Mood Logs</div>
          <div className="text-3xl font-bold text-slate-900">{reportData.totalMoodLogs}</div>
          <div className="text-xs text-slate-500 mt-2">This {selectedPeriod}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Average Mood</div>
          <div className="text-3xl font-bold text-slate-900">{reportData.averageMood}/7</div>
          <div className="text-xs text-slate-500 mt-2">Pleasantness score</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Green Zone</div>
          <div className="text-3xl font-bold text-slate-900">
            {reportData.zoneDistribution.green}%
          </div>
          <div className="text-xs text-slate-500 mt-2">Time in optimal zone</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-sm text-slate-600 mb-1">Attention Needed</div>
          <div className="text-3xl font-bold text-slate-900">
            {reportData.zoneDistribution.yellow + reportData.zoneDistribution.orange + reportData.zoneDistribution.red}%
          </div>
          <div className="text-xs text-slate-500 mt-2">Requires monitoring</div>
        </div>
      </div>

      {/* Zone Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-8">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          <FiBarChart2 />
          <span>Zone Distribution</span>
        </div>
        <div className="space-y-4">
          {Object.entries(reportData.zoneDistribution).map(([zone, percentage]) => (
            <div key={zone}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getZoneColor(zone) }}
                  />
                  <span className="font-medium text-slate-900 capitalize">
                    {zone} Zone
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getZoneColor(zone),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportData.trends.map((trend, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-700">{trend.label}</div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                  trend.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.trend === "up" ? (
                  <FiTrendingUp size={14} />
                ) : (
                  <FiTrendingDown size={14} />
                )}
                {Math.abs(trend.change)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {typeof trend.value === "number" && trend.value % 1 !== 0
                ? trend.value.toFixed(1)
                : trend.value}
              {typeof trend.value === "number" && trend.value <= 100 ? "%" : ""}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${trend.value}%`,
                  background:
                    trend.trend === "up"
                      ? "linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)"
                      : "linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;

