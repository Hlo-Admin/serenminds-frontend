import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiFilter, FiDownload, FiCalendar } from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../config/api";

// TypeScript interfaces
interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  division: string;
  school: string;
  enrollmentDate: string;
  status: string;
}

interface MoodLog {
  id: number;
  date: string;
  time: string;
  feelingDescription?: string;
  category?: {
    name: string;
  };
  subCategory?: {
    name: string;
  };
  addNote?: string;
  impact: number;
  joyfulness: number;
  calculatedEmotion?: string;
  calculatedZone?: string;
}

interface StudentStats {
  totalMoods: number;
  avgImpact: string;
  avgJoyfulness: string;
  mostCommonEmotion: string;
  mostCommonZone: string;
  zoneDistribution: { [key: string]: number };
}

const Reports: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentMoodLogs, setStudentMoodLogs] = useState<MoodLog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  // Helper functions for colors
  const getEmotionColor = (emotion?: string): string => {
    if (!emotion) return "#6b7280";
    const emotionColors: { [key: string]: string } = {
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
    return emotionColors[emotion] || "#6b7280";
  };

  const getZoneColor = (zone?: string): string => {
    if (!zone) return "#6b7280";
    const zoneColors: { [key: string]: string } = {
      "Green Zone": "#10b981",
      "Yellow Zone": "#f59e0b",
      "Orange Zone": "#f97316",
      "Red Zone": "#ef4444",
      "Blue Zone": "#3b82f6",
    };
    return zoneColors[zone] || "#6b7280";
  };

  // Static student data for now (TODO: Replace with API call when student management is ready)
  const staticStudents: Student[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      grade: "Grade 10",
      division: "A",
      school: "Springfield High School",
      enrollmentDate: "2023-09-01",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      grade: "Grade 9",
      division: "B",
      school: "Springfield High School",
      enrollmentDate: "2023-09-01",
      status: "Active",
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.williams@email.com",
      grade: "Grade 11",
      division: "A",
      school: "Springfield High School",
      enrollmentDate: "2022-09-01",
      status: "Active",
    },
  ];

  useEffect(() => {
    // For now, use static students
    // TODO: Fetch from /api/students when endpoint is ready
    setStudents(staticStudents);
    setLoading(false);
  }, []);

  // Fetch mood logs for selected student
  const fetchStudentMoodLogs = async (studentId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student-mood-logs`, {
        params: {
          studentId: studentId,
          status: true,
        },
      });

      if (response.data) {
        setStudentMoodLogs(response.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching student mood logs:", axiosError);
      setStudentMoodLogs([]);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    fetchStudentMoodLogs(student.id);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate student statistics
  const calculateStats = (): StudentStats | null => {
    if (!studentMoodLogs.length) {
      return {
        totalMoods: 0,
        avgImpact: "0",
        avgJoyfulness: "0",
        mostCommonEmotion: "N/A",
        mostCommonZone: "N/A",
        zoneDistribution: {},
      };
    }

    const zoneCount: { [key: string]: number } = {};
    const emotionCount: { [key: string]: number } = {};
    let totalImpact = 0;
    let totalJoyfulness = 0;

    studentMoodLogs.forEach((log) => {
      // Zone distribution
      const zone = log.calculatedZone || "N/A";
      zoneCount[zone] = (zoneCount[zone] || 0) + 1;

      // Emotion distribution
      const emotion = log.calculatedEmotion || "N/A";
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;

      // Averages
      totalImpact += log.impact;
      totalJoyfulness += log.joyfulness;
    });

    // Find most common
    const mostCommonZone = Object.keys(zoneCount).reduce((a, b) =>
      zoneCount[a] > zoneCount[b] ? a : b
    );
    const mostCommonEmotion = Object.keys(emotionCount).reduce((a, b) =>
      emotionCount[a] > emotionCount[b] ? a : b
    );

    return {
      totalMoods: studentMoodLogs.length,
      avgImpact: (totalImpact / studentMoodLogs.length).toFixed(1),
      avgJoyfulness: (totalJoyfulness / studentMoodLogs.length).toFixed(1),
      mostCommonEmotion,
      mostCommonZone,
      zoneDistribution: zoneCount,
    };
  };

  const stats = selectedStudent ? calculateStats() : null;

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm">
        <h2 className="text-3xl font-bold m-0 mb-2">Student Report</h2>
        <p className="text-gray-500 m-0 text-sm">
          View comprehensive student data and mood analytics
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex gap-3 items-stretch">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder="Search students by name, email, or grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-10 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-[#1ecab8]"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer text-sm font-semibold text-gray-700 transition-all whitespace-nowrap hover:bg-[#1ecab8] hover:text-white hover:border-[#1ecab8]"
          >
            <FiFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 flex-wrap">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                From Date
              </label>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, from: e.target.value })
                }
                className="py-2 px-3 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                To Date
              </label>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, to: e.target.value })
                }
                className="py-2 px-3 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div
        className={`grid gap-6 ${
          selectedStudent ? "grid-cols-[400px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* Student List */}
        <div className="bg-white rounded-xl p-5 shadow-sm h-fit max-h-[calc(100vh-300px)] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Students ({filteredStudents.length})
          </h3>
          <div className="grid gap-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleViewStudent(student)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedStudent?.id === student.id
                    ? "border-2 border-[#1ecab8] bg-teal-50"
                    : "border border-gray-300 bg-white hover:border-[#1ecab8] hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {student.grade} - Division {student.division}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {student.email}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-md text-[11px] font-semibold">
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Details */}
        {selectedStudent && (
          <div className="grid gap-6">
            {/* Student Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold m-0 mb-2">
                    {selectedStudent.name}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {selectedStudent.email}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors">
                  <FiDownload /> Export Report
                </button>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-5 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Grade & Division
                  </div>
                  <div className="text-base font-semibold">
                    {selectedStudent.grade} - {selectedStudent.division}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">School</div>
                  <div className="text-base font-semibold">
                    {selectedStudent.school}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Enrollment Date
                  </div>
                  <div className="text-base font-semibold">
                    {selectedStudent.enrollmentDate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <div className="text-base font-semibold text-green-700">
                    {selectedStudent.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Statistics */}
            {stats && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold mb-5">Mood Analytics</h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-800 mb-1">
                      Total Mood Logs
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {stats.totalMoods}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-800 mb-1">
                      Avg Impact
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {stats.avgImpact}/7
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-xs text-yellow-800 mb-1">
                      Avg Joyfulness
                    </div>
                    <div className="text-2xl font-bold text-yellow-800">
                      {stats.avgJoyfulness}/7
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs text-red-800 mb-1">
                      Most Common Zone
                    </div>
                    <div
                      className="text-sm font-bold flex items-center gap-1.5"
                      style={{ color: getZoneColor(stats.mostCommonZone) }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getZoneColor(stats.mostCommonZone),
                        }}
                      />
                      {stats.mostCommonZone}
                    </div>
                  </div>
                </div>

                {/* Zone Distribution */}
                <div className="mt-6">
                  <h5 className="text-sm font-semibold mb-3 text-gray-700">
                    Zone Distribution
                  </h5>
                  <div className="grid gap-2">
                    {Object.entries(stats.zoneDistribution).map(
                      ([zone, count]) => (
                        <div
                          key={zone}
                          className="flex items-center gap-3"
                        >
                          <div className="w-[100px] text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: getZoneColor(zone) }}
                            />
                            {zone}
                          </div>
                          <div className="flex-1 relative h-6 bg-gray-200 rounded-xl overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full rounded-xl transition-all duration-300"
                              style={{
                                width: `${(count / stats.totalMoods) * 100}%`,
                                backgroundColor: getZoneColor(zone),
                              }}
                            />
                          </div>
                          <div className="w-[60px] text-right text-xs font-semibold">
                            {count} ({((count / stats.totalMoods) * 100).toFixed(0)}%)
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mood Logs Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 pb-5 border-b border-gray-100">
                <h4 className="text-lg font-semibold m-0">
                  Mood History ({studentMoodLogs.length} entries)
                </h4>
              </div>

              {studentMoodLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Date & Time
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Feeling Description
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Sub Category
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Impact
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Joyfulness
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Emotion
                        </th>
                        <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                          Zone
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMoodLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 border-b border-gray-100">
                            <div className="font-semibold text-gray-900">
                              {log.date}
                            </div>
                            <div className="text-xs text-gray-400">
                              {log.time.substring(0, 5)}
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                              {log.feelingDescription || "—"}
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="text-sm font-semibold">
                              {log.category?.name || "—"}
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="text-sm">
                              {log.subCategory?.name || log.addNote || "—"}
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="inline-block px-2.5 py-1 bg-blue-50 rounded-md font-semibold text-xs text-blue-800">
                              {log.impact}/7
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="inline-block px-2.5 py-1 bg-yellow-50 rounded-md font-semibold text-xs text-yellow-800">
                              {log.joyfulness}/7
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-4 h-4 rounded-full border border-white shadow-sm"
                                style={{
                                  backgroundColor: getEmotionColor(
                                    log.calculatedEmotion
                                  ),
                                }}
                              />
                              <span className="text-xs font-semibold">
                                {log.calculatedEmotion || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-4 h-4 rounded-full border border-white shadow-sm"
                                style={{
                                  backgroundColor: getZoneColor(
                                    log.calculatedZone
                                  ),
                                }}
                              />
                              <span className="text-xs font-semibold">
                                {log.calculatedZone || "—"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center text-gray-400">
                  <div className="text-5xl mb-3">📊</div>
                  <div className="text-base font-semibold mb-1">
                    No mood logs yet
                  </div>
                  <div className="text-sm">
                    This student hasn't logged any moods yet
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

