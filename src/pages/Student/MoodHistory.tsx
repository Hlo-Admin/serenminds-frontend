import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiFilter, FiEye, FiPlus, FiEdit } from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

// TypeScript interfaces
interface MoodLog {
  id: number;
  date: string;
  time: string;
  category: string;
  subcategory: string;
  icon: string;
  color: string;
  impact: number;
  joyfulness: number;
  zone: string;
  zoneColor: string;
  note: string;
  feelingDescription: string;
  categoryName: string;
  createdAt: string;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  category: string;
  impactMin: string;
  impactMax: string;
  joyfulnessMin: string;
  joyfulnessMax: string;
}

interface EditForm {
  date: string;
  time: string;
  category: string;
  subcategory: string;
  impact: number;
  joyfulness: number;
  note: string;
}

const MoodHistory: React.FC = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MoodLog | null>(null);
  const [editingMood, setEditingMood] = useState<MoodLog | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    category: "",
    impactMin: "",
    impactMax: "",
    joyfulnessMin: "",
    joyfulnessMax: "",
  });

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Helper function to get emotion color
  const getEmotionColor = (emotion: string | undefined): string => {
    const emotionColors: { [key: string]: string } = {
      // Negative/Low Energy Emotions (Red/Orange tones)
      Depressed: "#dc2626",
      Discouraged: "#ef4444",
      Exhausted: "#8b4513",
      Lonely: "#3b82f6",
      Miserable: "#dc2626",
      Tired: "#8b4513",
      Frightened: "#ef4444",
      Worried: "#f59e0b",
      Concerned: "#f97316",
      Disgusted: "#dc2626",
      Angry: "#ef4444",
      Disappointed: "#f59e0b",
      Fuming: "#dc2626",
      Frustrated: "#f97316",
      Irritated: "#f59e0b",
      Furious: "#dc2626",
      Nervous: "#f59e0b",
      Enraged: "#991b1b",
      Panicked: "#dc2626",

      // Neutral/Mixed Emotions (Yellow/Brown tones)
      Uneasy: "#f59e0b",
      Bored: "#d97706",
      Complacent: "#f59e0b",
      Satisfied: "#10b981",
      Thoughtful: "#3b82f6",
      Focused: "#6366f1",
      Shocked: "#f59e0b",
      Surprised: "#3b82f6",
      Restless: "#f97316",
      Hyper: "#f59e0b",

      // Positive/High Energy Emotions (Green/Blue tones)
      Relaxed: "#10b981",
      Comfortable: "#10b981",
      Serene: "#10b981",
      Hopeful: "#3b82f6",
      Carefree: "#10b981",
      Peaceful: "#10b981",
      Touched: "#3b82f6",
      Optimistic: "#3b82f6",
      Joyful: "#10b981",
      Grateful: "#10b981",
      Energized: "#f59e0b",
      Cheerful: "#10b981",
      Proud: "#3b82f6",
      Blissful: "#10b981",
      Lively: "#10b981",
      Enthusiastic: "#3b82f6",
      Motivated: "#3b82f6",
      Thrilled: "#3b82f6",
      Inspired: "#8b5cf6",
      Exhilarated: "#3b82f6",

      // Legacy/Alternative names
      Sad: "#3b82f6",
      Calm: "#10b981",
      Joy: "#10b981",
      Neutral: "#f59e0b",
      Happy: "#10b981",
      Anxious: "#f59e0b",
      Stressed: "#f97316",
      Excited: "#9b59b6",
    };
    return emotionColors[emotion || ""] || "#6b7280";
  };

  // Helper function to get zone color
  const getZoneColor = (zone: string | undefined): string => {
    const zoneColors: { [key: string]: string } = {
      Green: "#10b981",
      Yellow: "#f59e0b",
      Brown: "#8b4513",
      "Light Red": "#ff6b6b",
      "Dark Red": "#dc2626",
      Blue: "#3b82f6",
    };
    return zoneColors[zone || ""] || "#6b7280";
  };

  // Helper function to get emoji for emotion
  const getEmotionIcon = (emotion: string | undefined): string => {
    const emotionIcons: { [key: string]: string } = {
      // Negative/Low Energy Emotions
      Depressed: "😔",
      Discouraged: "😞",
      Exhausted: "😴",
      Lonely: "😢",
      Miserable: "😭",
      Tired: "😪",
      Frightened: "😨",
      Worried: "😟",
      Concerned: "😕",
      Disgusted: "🤢",
      Angry: "😠",
      Disappointed: "😞",
      Fuming: "😡",
      Frustrated: "😤",
      Irritated: "😒",
      Furious: "🤬",
      Nervous: "😰",
      Enraged: "😡",
      Panicked: "😱",

      // Neutral/Mixed Emotions
      Uneasy: "😟",
      Bored: "😑",
      Complacent: "😐",
      Satisfied: "🙂",
      Thoughtful: "🤔",
      Focused: "🧐",
      Shocked: "😲",
      Surprised: "😮",
      Restless: "😬",
      Hyper: "😵",

      // Positive/High Energy Emotions
      Relaxed: "😌",
      Comfortable: "😊",
      Serene: "😇",
      Hopeful: "🙂",
      Carefree: "😄",
      Peaceful: "☺️",
      Touched: "🥺",
      Optimistic: "😊",
      Joyful: "😊",
      Grateful: "🥰",
      Energized: "💪",
      Cheerful: "😄",
      Proud: "😎",
      Blissful: "😌",
      Lively: "😃",
      Enthusiastic: "🤩",
      Motivated: "💪",
      Thrilled: "🤩",
      Inspired: "✨",
      Exhilarated: "🎉",

      // Legacy/Alternative names
      Sad: "😢",
      Calm: "😌",
      Joy: "😊",
      Neutral: "😐",
      Happy: "😊",
      Anxious: "😰",
      Stressed: "😰",
      Excited: "🤩",
    };
    return emotionIcons[emotion || ""] || "😐";
  };

  // Check if mood log can be edited (within 24 hours)
  const canEdit = (moodLog: MoodLog): boolean => {
    if (!moodLog.createdAt) return false;

    const createdAt = new Date(moodLog.createdAt);
    const now = new Date();
    const hoursSinceCreation =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceCreation < 24;
  };

  // Get remaining edit time
  const getRemainingEditTime = (moodLog: MoodLog): string | null => {
    if (!moodLog.createdAt) return null;

    const createdAt = new Date(moodLog.createdAt);
    const now = new Date();
    const hoursRemaining =
      24 - (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining <= 0) return "Edit time expired";

    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m left to edit`;
    } else {
      return `${minutes}m left to edit`;
    }
  };

  // Fetch mood logs from API
  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace studentId=1 with actual logged-in student ID from auth context
        const response = await axios.get(`${API_BASE_URL}/student-mood-logs`, {
          params: {
            studentId: 1,
            status: true,
          },
        });

        if (response.data) {
          // Transform API data to match the component's expected format
          const transformedData: MoodLog[] = response.data.map((log: any) => ({
            id: log.id,
            date: log.date,
            time: log.time.substring(0, 5), // Extract HH:MM from HH:MM:SS
            category: log.calculatedEmotion || "N/A",
            subcategory: log.subCategory?.name || log.addNote || "N/A",
            icon: getEmotionIcon(log.calculatedEmotion),
            color: getEmotionColor(log.calculatedEmotion),
            impact: log.impact,
            joyfulness: log.joyfulness,
            zone: log.calculatedZone || "N/A",
            zoneColor: getZoneColor(log.calculatedZone),
            note: log.addNote || "",
            feelingDescription: log.feelingDescription || "",
            categoryName: log.category?.name || "",
            createdAt: log.createdAt, // Include creation timestamp
          }));

          setMoodHistory(transformedData);
        }
      } catch (err) {
        console.error("Error fetching mood logs:", err);
        setError("Failed to load mood history. Please try again.");
        // Fallback to empty array
        setMoodHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodLogs();
  }, []);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      category: "",
      impactMin: "",
      impactMax: "",
      joyfulnessMin: "",
      joyfulnessMax: "",
    });
  };

  const filteredHistory = moodHistory.filter((mood) => {
    if (filters.dateFrom && mood.date < filters.dateFrom) return false;
    if (filters.dateTo && mood.date > filters.dateTo) return false;
    if (filters.category && mood.category !== filters.category) return false;
    if (filters.impactMin && mood.impact < parseInt(filters.impactMin))
      return false;
    if (filters.impactMax && mood.impact > parseInt(filters.impactMax))
      return false;
    if (
      filters.joyfulnessMin &&
      mood.joyfulness < parseInt(filters.joyfulnessMin)
    )
      return false;
    if (
      filters.joyfulnessMax &&
      mood.joyfulness > parseInt(filters.joyfulnessMax)
    )
      return false;
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="flex justify-center items-center min-h-[400px] text-lg text-gray-600">
          Loading mood history...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/80 text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold m-0">Mood History</h2>
          <p className="text-gray-500 mt-1.5 text-sm">
            Track your emotional journey over time
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>
          <Link
            to="/student/log-mood"
            className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2 no-underline"
          >
            <FiPlus /> Log New Mood
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80">
          <div className="text-base font-semibold mb-4 text-gray-700">
            Filter Mood Logs
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Anxious">Anxious</option>
                <option value="Surprised">Surprised</option>
                <option value="Calm">Calm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Impact (Min-Max)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                  placeholder="Min"
                  value={filters.impactMin}
                  onChange={(e) =>
                    handleFilterChange("impactMin", e.target.value)
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                  placeholder="Max"
                  value={filters.impactMax}
                  onChange={(e) =>
                    handleFilterChange("impactMax", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Joyfulness (Min-Max)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                  placeholder="Min"
                  value={filters.joyfulnessMin}
                  onChange={(e) =>
                    handleFilterChange("joyfulnessMin", e.target.value)
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="7"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                  placeholder="Max"
                  value={filters.joyfulnessMax}
                  onChange={(e) =>
                    handleFilterChange("joyfulnessMax", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors">
              Apply Filters
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Mood History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Emotion
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Impact
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Joyfulness
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Zone
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700 w-[150px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((mood) => (
                  <tr
                    key={mood.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-slate-900">
                        {mood.date}
                      </div>
                      <div className="text-xs text-gray-500">{mood.time}</div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{mood.icon}</span>
                        <div>
                          <div
                            className="font-semibold text-sm"
                            style={{ color: mood.color }}
                          >
                            {mood.category}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mood.subcategory}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <span className="inline-block px-3.5 py-1.5 bg-gray-50 rounded-lg font-semibold text-sm">
                        {mood.impact}/7
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <span className="inline-block px-3.5 py-1.5 bg-gray-50 rounded-lg font-semibold text-sm">
                        {mood.joyfulness}/7
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <span
                        className="inline-block px-3.5 py-1.5 rounded-full font-semibold text-xs"
                        style={{
                          background: `${mood.zoneColor}15`,
                          color: mood.zoneColor,
                        }}
                      >
                        {mood.zone}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-4 items-center pl-3">
                        {/* Overview Icon */}
                        <button
                          onClick={() => setSelectedMood(mood)}
                          className="bg-transparent border-none text-[#1ecab8] cursor-pointer text-lg flex items-center justify-center p-2 rounded-md transition-all hover:bg-teal-50 hover:scale-110"
                          title="Overview Mood"
                        >
                          <FiEye />
                        </button>

                        {/* Edit Icon with Timer */}
                        <div className="relative flex flex-col items-center">
                          {canEdit(mood) ? (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMood(mood);
                                  setEditForm({
                                    date: mood.date,
                                    time: mood.time,
                                    category: mood.category,
                                    subcategory: mood.subcategory,
                                    impact: mood.impact,
                                    joyfulness: mood.joyfulness,
                                    note: mood.note || "",
                                  });
                                }}
                                className="bg-transparent border-none text-yellow-600 cursor-pointer text-lg flex items-center justify-center p-2 rounded-md transition-all hover:bg-yellow-50 hover:scale-110"
                                title={`Edit - ${getRemainingEditTime(mood)}`}
                              >
                                <FiEdit />
                              </button>
                              {mood.createdAt && (
                                <div className="text-[10px] text-yellow-600 font-bold mt-0.5 whitespace-nowrap">
                                  {(() => {
                                    const createdAt = new Date(mood.createdAt);
                                    const hoursRemaining =
                                      24 -
                                      (currentTime.getTime() -
                                        createdAt.getTime()) /
                                        (1000 * 60 * 60);
                                    const hours = Math.floor(hoursRemaining);
                                    const minutes = Math.floor(
                                      (hoursRemaining - hours) * 60
                                    );
                                    return hours > 0
                                      ? `${hours}h ${minutes}m`
                                      : `${minutes}m`;
                                  })()}
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                disabled
                                className="bg-transparent border-none text-gray-300 cursor-not-allowed text-lg flex items-center justify-center p-2 rounded-md"
                                title="Edit time expired (24 hours)"
                              >
                                <FiEdit />
                              </button>
                              <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                                🔒
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-5xl mb-4">😊</div>
                      <div className="text-lg font-semibold text-slate-900 mb-2">
                        No mood logs found
                      </div>
                      <div className="text-sm text-gray-500">
                        Try adjusting your filters or log your first mood
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overview Mood Modal */}
      {selectedMood && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => setSelectedMood(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Overview Mood
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => setSelectedMood(null)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {/* Date */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                    Date (Logged Date)
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {selectedMood.date}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                    Time (Logged Time)
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {selectedMood.time}
                  </div>
                </div>

                {/* Current Mood */}
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                    Current Mood (Logged Mood)
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: selectedMood.color }}
                    />
                    <span
                      className="text-base font-semibold"
                      style={{ color: selectedMood.color }}
                    >
                      {selectedMood.category}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                    Category
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {selectedMood.category}
                  </div>
                </div>

                {/* Sub Category */}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                    Sub Category
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {selectedMood.subcategory}
                  </div>
                </div>

                {/* Impact & Joyfulness */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                      Impact
                    </div>
                    <div className="text-2xl font-bold text-[#1ecab8]">
                      {selectedMood.impact}/7
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                      Joyfulness
                    </div>
                    <div className="text-2xl font-bold text-[#1ecab8]">
                      {selectedMood.joyfulness}/7
                    </div>
                  </div>
                </div>

                {/* Calculated Emotion & Zone */}
                <div>
                  <div className="text-xs text-gray-500 mb-2.5 uppercase tracking-wide font-semibold">
                    Calculated Emotion & Zone
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedMood.color }}
                      />
                      <span className="font-semibold text-base text-slate-900">
                        {selectedMood.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: selectedMood.zoneColor }}
                      />
                      <span className="font-semibold text-base text-slate-900">
                        {selectedMood.zone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {selectedMood.note && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-semibold">
                      Note (Added Note)
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg">
                      {selectedMood.note}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setSelectedMood(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mood Modal */}
      {editingMood && editForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => {
            setEditingMood(null);
            setEditForm(null);
          }}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center flex-shrink-0 relative z-10">
              <h3 className="text-xl font-bold text-slate-900">
                Edit Mood Log
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => {
                  setEditingMood(null);
                  setEditForm(null);
                }}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mood updated successfully!");
                setEditingMood(null);
                setEditForm(null);
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 overflow-y-auto flex-1 relative">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm({ ...editForm, time: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Happy">Happy</option>
                    <option value="Sad">Sad</option>
                    <option value="Angry">Angry</option>
                    <option value="Anxious">Anxious</option>
                    <option value="Surprised">Surprised</option>
                    <option value="Calm">Calm</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subcategory *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={editForm.subcategory}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subcategory: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-5 pb-0 border-b-0 relative overflow-visible">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Impact Level (1-7) *
                    </label>
                    <span className="text-sm font-semibold text-[#1ecab8]">
                      {editForm.impact}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={editForm.impact}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        impact: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer relative z-10"
                    style={{
                      background: `linear-gradient(to right, #1ecab8 0%, #1ecab8 ${
                        ((editForm.impact - 1) / 6) * 100
                      }%, #e5e7eb ${
                        ((editForm.impact - 1) / 6) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                </div>

                <div className="mb-5 pb-0 border-b-0 relative overflow-visible">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Joyfulness Level (1-7) *
                    </label>
                    <span className="text-sm font-semibold text-[#1ecab8]">
                      {editForm.joyfulness}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={editForm.joyfulness}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        joyfulness: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer relative z-10"
                    style={{
                      background: `linear-gradient(to right, #1ecab8 0%, #1ecab8 ${
                        ((editForm.joyfulness - 1) / 6) * 100
                      }%, #e5e7eb ${
                        ((editForm.joyfulness - 1) / 6) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Note
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent min-h-[100px]"
                    value={editForm.note}
                    onChange={(e) =>
                      setEditForm({ ...editForm, note: e.target.value })
                    }
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-3 flex-shrink-0 relative z-10">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setEditingMood(null);
                    setEditForm(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
