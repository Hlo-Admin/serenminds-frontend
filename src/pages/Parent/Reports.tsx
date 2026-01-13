import React, { useState, useEffect, useRef } from "react";
import { FiBarChart2, FiDownload, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface LifeCircleZoneData {
  lifeCircle: string;
  green: number;
  yellow: number;
  brown: number;
  lightRed: number;
  darkRed: number;
  blue: number;
  total: number;
}

interface ReportData {
  period: string;
  totalMoodLogs: number;
  averageMood: number;
  zoneDistribution: {
    green: number;
    yellow: number;
    brown: number;
    lightRed: number;
    darkRed: number;
    blue: number;
  };
  lifeCircleZoneDistribution: LifeCircleZoneData[];
  trends: {
    label: string;
    value: number;
    change: number;
    trend: "up" | "down";
  }[];
}

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [animatedCharts, setAnimatedCharts] = useState<Set<string>>(new Set());
  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Static data for demo
  const reportData: ReportData = {
    period: selectedPeriod,
    totalMoodLogs: 77,
    averageMood: 6.2,
    zoneDistribution: {
      green: 45,
      yellow: 15,
      brown: 8,
      lightRed: 5,
      darkRed: 2,
      blue: 2,
    },
    lifeCircleZoneDistribution: [
      {
        lifeCircle: "Family",
        green: 20,
        yellow: 3,
        brown: 2,
        lightRed: 1,
        darkRed: 0,
        blue: 0,
        total: 26,
      },
      {
        lifeCircle: "Academics",
        green: 15,
        yellow: 5,
        brown: 3,
        lightRed: 2,
        darkRed: 1,
        blue: 1,
        total: 27,
      },
      {
        lifeCircle: "Friends",
        green: 12,
        yellow: 3,
        brown: 1,
        lightRed: 1,
        darkRed: 0,
        blue: 0,
        total: 17,
      },
      {
        lifeCircle: "Self",
        green: 8,
        yellow: 2,
        brown: 1,
        lightRed: 1,
        darkRed: 0,
        blue: 0,
        total: 12,
      },
      {
        lifeCircle: "Teachers",
        green: 5,
        yellow: 2,
        brown: 1,
        lightRed: 1,
        darkRed: 0,
        blue: 0,
        total: 9,
      },
      {
        lifeCircle: "Health & Fitness",
        green: 3,
        yellow: 1,
        brown: 0,
        lightRed: 0,
        darkRed: 0,
        blue: 0,
        total: 4,
      },
      {
        lifeCircle: "Society/ Environment/ Surroundings",
        green: 2,
        yellow: 1,
        brown: 1,
        lightRed: 1,
        darkRed: 0,
        blue: 0,
        total: 5,
      },
      {
        lifeCircle: "Money",
        green: 0,
        yellow: 0,
        brown: 0,
        lightRed: 0,
        darkRed: 0,
        blue: 0,
        total: 0,
      },
    ],
    trends: [
      { label: "Mood Consistency", value: 85, change: 5, trend: "up" },
      { label: "Engagement Rate", value: 78, change: 12, trend: "up" },
      { label: "Attention Needed", value: 15, change: -8, trend: "down" },
      { label: "Average Pleasantness", value: 6.2, change: 0.3, trend: "up" },
    ],
  };

  const getZoneColor = (zone: string): string => {
    const colors: { [key: string]: string } = {
      green: "#10b981",
      yellow: "#f59e0b",
      brown: "#8b4513",
      lightRed: "#ff6b6b",
      darkRed: "#dc2626",
      blue: "#3b82f6",
    };
    return colors[zone] || "#ccc";
  };

  const formatZoneName = (zone: string): string => {
    const zoneNames: { [key: string]: string } = {
      green: "Green",
      yellow: "Yellow",
      brown: "Brown",
      lightRed: "Light Red",
      darkRed: "Dark Red",
      blue: "Blue",
    };
    return zoneNames[zone] || zone;
  };

  // Intersection Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const zone = entry.target.getAttribute("data-zone");
            if (zone) {
              setAnimatedCharts((prev: Set<string>) => new Set(prev).add(zone));
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    Object.values(chartRefs.current).forEach((ref: HTMLDivElement | null) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      Object.values(chartRefs.current).forEach((ref: HTMLDivElement | null) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

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
            {reportData.zoneDistribution.yellow + reportData.zoneDistribution.brown + reportData.zoneDistribution.lightRed + reportData.zoneDistribution.darkRed}%
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
                  <span className="font-medium text-slate-900">
                    {formatZoneName(zone)} Zone
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

      {/* Zone Distribution by Life Circle - Pie Charts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 mb-8">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-2">
          <FiBarChart2 />
          <span>Zone Distribution by Life Circle</span>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Each pie chart shows which Life Circle contributes to that specific zone. Life Circles can appear in multiple zones as they represent different aspects of your child's life.
        </p>
        
        {/* Pie Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(reportData.zoneDistribution).map(([zone, zonePercentage]) => {
            // Get Life Circle data for this zone
            const lifeCircleData = reportData.lifeCircleZoneDistribution
              .map((lc) => ({
                lifeCircle: lc.lifeCircle,
                count: lc[zone as keyof typeof lc] as number,
              }))
              .filter((lc) => lc.count > 0)
              .sort((a, b) => b.count - a.count);
            
            const totalForZone = lifeCircleData.reduce((sum, lc) => sum + lc.count, 0);
            
            // Calculate angles for pie chart
            let currentAngle = -90; // Start from top
            const pieData = lifeCircleData.map((lc) => {
              const percentage = (lc.count / totalForZone) * 100;
              const angle = (lc.count / totalForZone) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              
              return {
                ...lc,
                percentage,
                angle,
                startAngle,
                endAngle: currentAngle,
              };
            });
            
            // Life Circle colors - all 8 Life Circles
            const lifeCircleColors: { [key: string]: string } = {
              Family: "#1e40af", // Deep Blue
              Academics: "#7c3aed", // Deep Purple
              Friends: "#db2777", // Deep Pink
              Self: "#059669", // Emerald Green
              Teachers: "#dc2626", // Red
              "Health & Fitness": "#ea580c", // Orange
              "Society/ Environment/ Surroundings": "#0891b2", // Cyan
              Money: "#ca8a04", // Amber
            };
            
            const radius = 65;
            const centerX = 80;
            const centerY = 80;
            const svgSize = 160;
            
            // Helper function to convert angle to coordinates
            const getCoordinates = (angle: number) => {
              const rad = (angle * Math.PI) / 180;
              return {
                x: centerX + radius * Math.cos(rad),
                y: centerY + radius * Math.sin(rad),
              };
            };
            
            const isAnimated = animatedCharts.has(zone);
            
            return (
              <div 
                key={zone} 
                ref={(el) => {
                  chartRefs.current[zone] = el;
                }}
                data-zone={zone}
                className="flex flex-col items-center p-4 border border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-white"
              >
                <div className="mb-4 text-center w-full">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: getZoneColor(zone) }}
                    />
                    <span className="font-bold text-slate-900 text-base">
                      {formatZoneName(zone)} Zone
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mb-1">
                    {zonePercentage}% of total mood logs
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    {totalForZone} entries
                  </div>
                </div>
                
                {/* Pie Chart SVG */}
                <div className="relative mb-4">
                  <svg 
                    width={svgSize} 
                    height={svgSize} 
                    viewBox={`0 0 ${svgSize} ${svgSize}`} 
                    className="drop-shadow-sm"
                    style={{
                      transform: isAnimated ? "scale(1)" : "scale(0.95)",
                      opacity: isAnimated ? 1 : 0.5,
                      transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    }}
                  >
                    {/* Circular Loading Spinner - shown on top of pie chart */}
                    {!isAnimated && (
                      <>
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={radius + 8}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="5"
                          opacity="0.5"
                        />
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={radius + 8}
                          fill="none"
                          stroke="#1ecab8"
                          strokeWidth="5"
                          strokeDasharray={`${2 * Math.PI * (radius + 8)}`}
                          strokeDashoffset={`${2 * Math.PI * (radius + 8) * 0.75}`}
                          strokeLinecap="round"
                          opacity="0.8"
                          style={{
                            animation: "spin 1s linear infinite",
                            transformOrigin: `${centerX}px ${centerY}px`,
                          }}
                        />
                      </>
                    )}
                    
                    {/* Pie Chart Segments */}
                    {pieData.map((segment, index) => {
                      const start = getCoordinates(segment.startAngle);
                      const end = getCoordinates(segment.endAngle);
                      const largeArc = segment.angle > 180 ? 1 : 0;
                      
                      const pathData = [
                        `M ${centerX} ${centerY}`,
                        `L ${start.x} ${start.y}`,
                        `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
                        "Z",
                      ].join(" ");
                      
                      // Calculate animation delay - segments appear after spinner
                      const animationDelay = isAnimated ? index * 0.08 + 0.5 : 0;
                      
                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill={lifeCircleColors[segment.lifeCircle] || "#94a3b8"}
                          stroke="#ffffff"
                          strokeWidth="3"
                          className="transition-all hover:opacity-90 cursor-pointer"
                          style={{ 
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                            transform: isAnimated ? "scale(1)" : "scale(0.9)",
                            transformOrigin: `${centerX}px ${centerY}px`,
                            opacity: isAnimated ? 1 : 0.4,
                            transition: `transform 0.6s ease-out ${animationDelay}s, opacity 0.6s ease-out ${animationDelay}s`,
                          }}
                        />
                      );
                    })}
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="w-full space-y-2.5">
                  {pieData.map((segment) => (
                    <div key={segment.lifeCircle} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: lifeCircleColors[segment.lifeCircle] || "#94a3b8" }}
                        />
                        <span className="font-semibold text-slate-800">{segment.lifeCircle}</span>
                      </div>
                      <div className="text-slate-600 font-medium">
                        {segment.count} <span className="text-slate-400">({segment.percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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

