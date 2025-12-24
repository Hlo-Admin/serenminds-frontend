import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface MoodLog {
  id: number;
  date: string;
  time: string;
  calculatedZone?: string;
  calculatedEmotion?: string;
  category?: {
    name: string;
  };
  subCategory?: {
    name: string;
  };
  impact: number;
  joyfulness: number;
  addNote?: string;
  feelingDescription?: string;
}

interface MoodData {
  zone: string;
  color: string;
  moods: MoodEntry[];
}

interface MoodEntry {
  id: number;
  time: string;
  emotion: string;
  icon: string;
  category: string;
  subcategory: string;
  impact: number;
  joyfulness: number;
  note: string;
  feelingDescription: string;
  fullData: MoodLog;
}

interface SelectedDay {
  day: number;
  dateStr: string;
  data: MoodData;
}

interface MonthlyStats {
  Green: number;
  Yellow: number;
  Brown: number;
  "Light Red": number;
  "Dark Red": number;
  Blue: number;
  mostCommon: {
    zone: string;
    count: number;
  };
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [selectedMoodLog, setSelectedMoodLog] = useState<MoodEntry | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [moodData, setMoodData] = useState<Record<string, MoodData>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Helper functions for colors
  const getEmotionColor = (emotion?: string): string => {
    const emotionColors: Record<string, string> = {
      Sad: "#3b82f6",
      Calm: "#10b981",
      Angry: "#ef4444",
      Joy: "#10b981",
      Complacent: "#f59e0b",
      Neutral: "#f59e0b",
      Happy: "#10b981",
      Anxious: "#f59e0b",
      Stressed: "#f97316",
      Excited: "#9b59b6",
    };
    return emotionColors[emotion || ""] || "#6b7280";
  };

  const getZoneColor = (zone?: string): string => {
    const zoneColors: Record<string, string> = {
      Green: "#10b981",
      Yellow: "#f59e0b",
      Brown: "#8b4513",
      "Light Red": "#ff6b6b",
      "Dark Red": "#dc2626",
      Blue: "#3b82f6",
    };
    return zoneColors[zone || ""] || "#6b7280";
  };

  const getEmotionIcon = (emotion?: string): string => {
    const emotionIcons: Record<string, string> = {
      Sad: "😢",
      Calm: "😌",
      Angry: "😠",
      Joy: "😊",
      Complacent: "😐",
      Neutral: "😐",
      Happy: "😊",
      Anxious: "😰",
      Stressed: "😰",
      Excited: "🤩",
    };
    return emotionIcons[emotion || ""] || "😐";
  };

  // Fetch mood logs from API
  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        setLoading(true);
        // TODO: Replace studentId=1 with actual logged-in student ID from auth context
        const response = await axios.get(`${API_BASE_URL}/student-mood-logs`, {
          params: {
            studentId: 1,
            status: true,
          },
        });

        if (response.data) {
          setMoodLogs(response.data);
          // Transform API data to calendar format (group by date)
          const dataByDate: Record<string, MoodData> = {};
          response.data.forEach((log: MoodLog) => {
            const dateKey = log.date; // YYYY-MM-DD format
            if (!dataByDate[dateKey]) {
              dataByDate[dateKey] = {
                zone: log.calculatedZone || "N/A",
                color: getZoneColor(log.calculatedZone),
                moods: [],
              };
            }
            dataByDate[dateKey].moods.push({
              id: log.id,
              time: log.time.substring(0, 5), // HH:MM
              emotion: log.calculatedEmotion || "N/A",
              icon: getEmotionIcon(log.calculatedEmotion),
              category: log.category?.name || "N/A",
              subcategory: log.subCategory?.name || log.addNote || "N/A",
              impact: log.impact,
              joyfulness: log.joyfulness,
              note: log.addNote || "",
              feelingDescription: log.feelingDescription || "",
              fullData: log,
            });
          });
          setMoodData(dataByDate);
        }
      } catch (err) {
        console.error("Error fetching mood logs:", err);
        setMoodData({});
      } finally {
        setLoading(false);
      }
    };

    fetchMoodLogs();
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (year: number, month: number, day: number): string => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const dateStr = formatDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (moodData[dateStr]) {
      setSelectedDay({ day, dateStr, data: moodData[dateStr] });
      setSelectedMoodLog(null); // Reset individual mood selection
    }
  };

  const handleMoodLogClick = (moodLog: MoodEntry) => {
    setSelectedMoodLog(moodLog);
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateValue = e.target.value;
    setSelectedDate(selectedDateValue);

    if (selectedDateValue && moodData[selectedDateValue]) {
      // Parse the date to set currentDate to that month
      const [year, month, day] = selectedDateValue.split("-").map(Number);
      setCurrentDate(new Date(year, month - 1, 1));
      setSelectedDay({
        day: day,
        dateStr: selectedDateValue,
        data: moodData[selectedDateValue],
      });
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Filter mood logs based on search query
    const filtered = moodLogs.filter((log) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        log.feelingDescription?.toLowerCase().includes(searchLower) ||
        log.calculatedEmotion?.toLowerCase().includes(searchLower) ||
        log.category?.name?.toLowerCase().includes(searchLower) ||
        log.subCategory?.name?.toLowerCase().includes(searchLower) ||
        log.addNote?.toLowerCase().includes(searchLower)
      );
    });

    if (filtered.length > 0) {
      // Show first result in calendar
      const firstResult = filtered[0];
      const [year, month, day] = firstResult.date.split("-").map(Number);
      setCurrentDate(new Date(year, month - 1, 1));
      setSelectedDay({
        day: day,
        dateStr: firstResult.date,
        data: moodData[firstResult.date],
      });
    } else {
      alert("No mood logs found matching your search.");
    }
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-[#fafbfc] min-h-screen max-w-[1600px] mx-auto font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
        <div className="flex justify-center items-center min-h-[400px]">
          Loading calendar...
        </div>
      </div>
    );
  }

  // Calculate monthly stats
  const getMonthlyStats = (): MonthlyStats => {
    const stats = {
      Green: 0,
      Yellow: 0,
      Brown: 0,
      "Light Red": 0,
      "Dark Red": 0,
      Blue: 0,
    };

    Object.values(moodData).forEach((data) => {
      if (stats[data.zone as keyof typeof stats] !== undefined) {
        stats[data.zone as keyof typeof stats]++;
      }
    });

    // Find most common zone
    let mostCommonZone = "Green";
    let maxCount = 0;
    Object.entries(stats).forEach(([zone, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonZone = zone;
      }
    });

    return { ...stats, mostCommon: { zone: mostCommonZone, count: maxCount } };
  };

  const monthlyStats = getMonthlyStats();

  // Get wellness tip based on zone
  const getWellnessTip = (zone: string) => {
    switch (zone) {
      case "Green":
        return {
          title: "Keep the Momentum!",
          text: "You're in a great headspace. Use this energy to tackle your most challenging subjects or help a friend study.",
          icon: "🌟",
          color: "#10b981",
          bg: "#f0fff4",
          border: "#c6f6d5",
        };
      case "Yellow":
        return {
          title: "Pause and Reset",
          text: "Feeling a bit jittery? Try the 4-7-8 breathing technique before your next study session to regain focus.",
          icon: "🧘",
          color: "#f59e0b",
          bg: "#fffaf0",
          border: "#feebc8",
        };
      case "Brown":
        return {
          title: "Stay Balanced",
          text: "You're in a neutral zone. Take this opportunity to reflect on your feelings and maintain your emotional balance.",
          icon: "⚖️",
          color: "#8b4513",
          bg: "#faf5f0",
          border: "#e8d4bf",
        };
      case "Light Red":
        return {
          title: "Be Gentle with Yourself",
          text: "It's okay to not be okay. Take a short walk, listen to calming music, or talk to a friend. Your mental health comes first.",
          icon: "🧡",
          color: "#ff6b6b",
          bg: "#fff5f5",
          border: "#fed7d7",
        };
      case "Dark Red":
        return {
          title: "Stop and Seek Support",
          text: "High stress can block learning. Please step away from your books and reach out to a counselor or trusted adult.",
          icon: "🛑",
          color: "#dc2626",
          bg: "#fff5f5",
          border: "#feb2b2",
        };
      case "Blue":
        return {
          title: "Embrace the Positive Energy!",
          text: "You're feeling great! This is a perfect time for learning and creative work. Keep up the positive momentum!",
          icon: "💙",
          color: "#3b82f6",
          bg: "#eff6ff",
          border: "#bfdbfe",
        };
      default:
        return null;
    }
  };

  // Mock study impact data
  const getStudyImpact = (zone: string) => {
    switch (zone) {
      case "Green":
        return { level: 90, label: "High Focus", color: "#10b981" };
      case "Yellow":
        return { level: 60, label: "Moderate Focus", color: "#f59e0b" };
      case "Brown":
        return { level: 50, label: "Neutral Focus", color: "#8b4513" };
      case "Light Red":
        return { level: 40, label: "Low Focus", color: "#ff6b6b" };
      case "Dark Red":
        return { level: 20, label: "Distracted", color: "#dc2626" };
      case "Blue":
        return { level: 85, label: "Excellent Focus", color: "#3b82f6" };
      default:
        return { level: 0, label: "Unknown", color: "#ccc" };
    }
  };

  return (
    <div className="p-6 bg-[#fafbfc] min-h-screen max-w-[1600px] mx-auto font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-6 border border-black/5">
        <h2 className="text-[28px] font-extrabold m-0 mb-2 tracking-tight text-[#1a202c]">
          Mood Calendar
        </h2>
        <p className="text-[#718096] m-0 text-base">View your mood patterns across the month</p>
      </div>

      {/* Search and Date Picker Section */}
      <div className="bg-white rounded-[14px] p-5 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by mood, category, subcategory, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full py-2.5 px-4 pr-10 border border-[#e0e0e0] rounded-lg text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#00c7b7] cursor-pointer p-1 flex items-center"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#666] whitespace-nowrap">Jump to date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDatePickerChange}
              className="py-2.5 px-4 border border-[#e0e0e0] rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Monthly Stats Summary */}
      <div className="flex gap-3 mb-6 flex-nowrap overflow-x-auto pb-2">
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Green Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Green"]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Yellow Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Yellow"]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#8b4513]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Brown Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Brown"]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Light Red Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Light Red"]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#dc2626]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Dark Red Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Dark Red"]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/5 flex-[0_1_auto] min-w-[130px] whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] font-semibold uppercase tracking-wide">
              Blue Days
            </span>
            <span className="text-lg font-bold text-[#2d3748]">{monthlyStats["Blue"]}</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-6 border border-black/5">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#f0f0f0]">
          <div className="text-2xl font-extrabold text-[#1a202c] tracking-tight">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={previousMonth}
              className="bg-white border border-[#edf2f7] rounded-xl px-5 py-2.5 cursor-pointer font-semibold text-[#4a5568] transition-all duration-200 flex items-center gap-2 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#00c7b7] hover:text-white hover:border-[#00c7b7] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,199,183,0.25)]"
            >
              <FiChevronLeft /> Previous
            </button>
            <button
              onClick={nextMonth}
              className="bg-white border border-[#edf2f7] rounded-xl px-5 py-2.5 cursor-pointer font-semibold text-[#4a5568] transition-all duration-200 flex items-center gap-2 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#00c7b7] hover:text-white hover:border-[#00c7b7] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,199,183,0.25)]"
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-3">
          {dayNames.map((dayName) => (
            <div key={dayName} className="text-center text-xs font-bold text-[#a0aec0] py-3 uppercase tracking-wide">
              {dayName}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const dateStr = day
              ? formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
              : null;
            const dayMood = dateStr ? moodData[dateStr] : null;

            return (
              <div
                key={index}
                className={`aspect-square border border-[#edf2f7] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative p-2 bg-white ${
                  !day ? "border-none bg-transparent cursor-default" : ""
                } ${
                  isToday(day)
                    ? "bg-gradient-to-br from-[rgba(0,199,183,0.05)] to-[rgba(0,158,142,0.05)] border-[#00c7b7]"
                    : ""
                } hover:border-[#00c7b7] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,199,183,0.12)] hover:z-10`}
                onClick={() => handleDayClick(day)}
              >
                {day && (
                  <>
                    <div
                      className={`text-[15px] font-semibold text-[#4a5568] mb-1.5 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                        isToday(day)
                          ? "bg-[#00c7b7] text-white shadow-[0_2px_8px_rgba(0,199,183,0.3)]"
                          : ""
                      }`}
                    >
                      {day}
                    </div>
                    {dayMood && (
                      <>
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                          style={{ background: dayMood.color }}
                          title={dayMood.zone}
                        />
                        {dayMood.moods.length > 1 && (
                          <div className="text-[10px] text-[#718096] mt-1 font-semibold bg-[#f7fafc] px-2 py-0.5 rounded-[10px]">
                            {dayMood.moods.length} logs
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-8 flex-wrap justify-center pt-6 border-t border-[#f0f0f0]">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Green</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Yellow</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8b4513] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Brown</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Light Red</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Dark Red</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#f8fafc] rounded-[20px] transition-all duration-200 hover:bg-[#edf2f7] hover:-translate-y-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
            <span className="text-[13px] text-[#4a5568] font-medium">Blue</span>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-2xl font-bold text-[#222] m-0">Moods on {selectedDay.dateStr}</h3>
                <button
                  className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                  onClick={() => setSelectedDay(null)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[20px] text-sm font-semibold mt-4" style={{ background: `${selectedDay.data.color}15`, color: selectedDay.data.color }}>
              <div className="w-2 h-2 rounded-full" style={{ background: selectedDay.data.color }} />
              {selectedDay.data.zone}
            </div>

            <div className="mb-6 mt-6">
              <div className="grid gap-4">
                {selectedDay.data.moods.map((mood, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border border-[#edf2f7] rounded-2xl flex items-center gap-5 transition-all duration-200 mb-4 hover:border-[#00c7b7] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:translate-x-1 cursor-pointer"
                    onClick={() => handleMoodLogClick(mood)}
                  >
                    <div className="text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]">{mood.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs text-[#718096] mb-1 uppercase tracking-wide font-semibold">
                        {mood.time}
                      </div>
                      <div className="text-lg font-bold text-[#2d3748]">{mood.emotion}</div>
                      <div className="text-xs text-[#666] mt-1">Click to view details</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Study Impact Section */}
              <div className="mt-6 pt-6 border-t border-[#edf2f7]">
                <div className="text-sm font-bold text-[#4a5568] mb-3 uppercase tracking-wide">
                  Academic Impact
                </div>
                {(() => {
                  const impact = getStudyImpact(selectedDay.data.zone);
                  return (
                    <div>
                      <div className="h-2 bg-[#edf2f7] rounded overflow-hidden mb-2">
                        <div
                          className="h-full rounded transition-all duration-500 ease-out"
                          style={{ width: `${impact.level}%`, background: impact.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[13px] text-[#718096] font-medium">
                        <span>Focus Level</span>
                        <span style={{ color: impact.color, fontWeight: "700" }}>{impact.label}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Wellness Tip */}
              {(() => {
                const tip = getWellnessTip(selectedDay.data.zone);
                if (tip) {
                  return (
                    <div
                      className="mt-6 p-5 rounded-xl flex gap-4 items-start"
                      style={{ background: tip.bg, borderColor: tip.border, borderWidth: "1px", borderStyle: "solid" }}
                    >
                      <div className="text-2xl bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.05)]" style={{ color: tip.color }}>
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="m-0 mb-1 text-base font-bold" style={{ color: tip.color }}>
                          {tip.title}
                        </h4>
                        <p className="m-0 text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                          {tip.text}
                        </p>
                      </div>
                    </div>
                  );
                }
              })()}

              {selectedDay.data.moods.length > 1 && (
                <div className="mt-6 p-5 bg-gradient-to-r from-[#ebf8ff] to-[#e6fffa] rounded-xl text-[15px] text-[#2c5282] border border-[#bee3f8] flex items-center gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    You logged <strong>{selectedDay.data.moods.length} moods</strong> on this day.
                    Great job tracking your emotions!
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                onClick={() => setSelectedDay(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Mood Log Detail Modal */}
      {selectedMoodLog && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => setSelectedMoodLog(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">View Mood Details</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => setSelectedMoodLog(null)}
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <div className="grid gap-5">
                {/* Date (Logged Date) */}
                <div>
                  <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                    Date (Logged Date)
                  </div>
                  <div className="text-base font-semibold text-[#222]">
                    {selectedMoodLog.fullData.date}
                  </div>
                </div>

                {/* Time (Logged Time) */}
                <div>
                  <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                    Time (Logged Time)
                  </div>
                  <div className="text-base font-semibold text-[#222]">{selectedMoodLog.time}</div>
                </div>

                {/* Past Mood (Logged Mood) */}
                <div>
                  <div className="text-xs text-[#888] mb-2 uppercase tracking-wide font-semibold">
                    Past Mood (Logged Mood)
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                      style={{ backgroundColor: getEmotionColor(selectedMoodLog.emotion) }}
                    />
                    <span
                      className="text-base font-semibold"
                      style={{ color: getEmotionColor(selectedMoodLog.emotion) }}
                    >
                      {selectedMoodLog.feelingDescription || selectedMoodLog.emotion}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                    Category
                  </div>
                  <div className="text-base font-semibold text-[#222]">{selectedMoodLog.category}</div>
                </div>

                {/* Sub Category */}
                <div>
                  <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                    Sub Category
                  </div>
                  <div className="text-base font-semibold text-[#222]">
                    {selectedMoodLog.subcategory}
                  </div>
                </div>

                {/* Impact & Joyfulness */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                      Impact
                    </div>
                    <div className="text-2xl font-bold text-[#00c7b7]">
                      {selectedMoodLog.impact}/7
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                      Joyfulness
                    </div>
                    <div className="text-2xl font-bold text-[#00c7b7]">
                      {selectedMoodLog.joyfulness}/7
                    </div>
                  </div>
                </div>

                {/* Calculated Emotion & Zone */}
                <div>
                  <div className="text-xs text-[#888] mb-2.5 uppercase tracking-wide font-semibold">
                    Calculated Emotion & Zone
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{ backgroundColor: getEmotionColor(selectedMoodLog.emotion) }}
                      />
                      <span className="font-semibold text-base text-[#222]">
                        {selectedMoodLog.emotion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{
                          backgroundColor: getZoneColor(selectedMoodLog.fullData.calculatedZone),
                        }}
                      />
                      <span className="font-semibold text-base text-[#222]">
                        {selectedMoodLog.fullData.calculatedZone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Note (Added Note) */}
                {selectedMoodLog.note && (
                  <div>
                    <div className="text-xs text-[#888] mb-1.5 uppercase tracking-wide font-semibold">
                      Note (Added Note)
                    </div>
                    <div className="text-[15px] text-[#444] leading-relaxed p-4 bg-[#f9f9f9] rounded-[10px]">
                      {selectedMoodLog.note}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                onClick={() => setSelectedMoodLog(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

