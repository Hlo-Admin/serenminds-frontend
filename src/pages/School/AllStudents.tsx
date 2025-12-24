import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit,
  FiEye,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiPlus,
  FiX,
  FiCalendar,
  FiMapPin,
  FiUserCheck,
  FiClock,
  FiBarChart2,
} from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface Student {
  id: number;
  name: string;
  studentId: string;
  class: string;
  division: string;
  classId?: number | null;
  divisionId?: number | null;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  enrollmentDate?: string;
  status: "active" | "inactive";
  moodStatus: "green" | "yellow" | "orange" | "red";
  lastMoodLog: string;
}

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

// Static initial data - resets on refresh
const getInitialStudents = (): Student[] => [
  {
    id: 1,
    name: "John Doe",
    studentId: "STU001",
    class: "10",
    division: "A",
    email: "john.doe@example.com",
    phone: "+1234567890",
    dateOfBirth: "2008-05-15",
    address: "123 Main St, City, State 12345",
    parentName: "Robert Doe",
    parentPhone: "+1234567899",
    parentEmail: "robert.doe@example.com",
    enrollmentDate: "2023-06-01",
    status: "active",
    moodStatus: "green",
    lastMoodLog: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    studentId: "STU002",
    class: "10",
    division: "B",
    email: "jane.smith@example.com",
    phone: "+1234567891",
    dateOfBirth: "2008-08-20",
    address: "456 Oak Ave, City, State 12345",
    parentName: "Mary Smith",
    parentPhone: "+1234567898",
    parentEmail: "mary.smith@example.com",
    enrollmentDate: "2023-06-01",
    status: "active",
    moodStatus: "yellow",
    lastMoodLog: "5 hours ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    studentId: "STU003",
    class: "9",
    division: "A",
    email: "mike.johnson@example.com",
    phone: "+1234567892",
    dateOfBirth: "2009-03-10",
    address: "789 Pine Rd, City, State 12345",
    parentName: "James Johnson",
    parentPhone: "+1234567897",
    parentEmail: "james.johnson@example.com",
    enrollmentDate: "2023-06-01",
    status: "active",
    moodStatus: "red",
    lastMoodLog: "1 day ago",
  },
  {
    id: 4,
    name: "Sarah Williams",
    studentId: "STU004",
    class: "11",
    division: "C",
    email: "sarah.williams@example.com",
    phone: "+1234567893",
    dateOfBirth: "2007-11-25",
    address: "321 Elm St, City, State 12345",
    parentName: "Patricia Williams",
    parentPhone: "+1234567896",
    parentEmail: "patricia.williams@example.com",
    enrollmentDate: "2022-06-01",
    status: "active",
    moodStatus: "green",
    lastMoodLog: "3 hours ago",
  },
  {
    id: 5,
    name: "David Brown",
    studentId: "STU005",
    class: "12",
    division: "A",
    email: "david.brown@example.com",
    phone: "+1234567894",
    dateOfBirth: "2006-07-08",
    address: "654 Maple Dr, City, State 12345",
    parentName: "Michael Brown",
    parentPhone: "+1234567895",
    parentEmail: "michael.brown@example.com",
    enrollmentDate: "2021-06-01",
    status: "inactive",
    moodStatus: "orange",
    lastMoodLog: "2 days ago",
  },
];

interface ClassOption {
  id: number;
  name: string;
  code: string;
}

interface DivisionOption {
  id: number;
  name: string; // Full name like "Grade 10 - A"
  divisionLetter: string; // Just the letter like "A"
  class?: string;
  classCode?: string;
}

const AllStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [loadingMoodHistory, setLoadingMoodHistory] = useState(false);
  const [timePeriod, setTimePeriod] = useState<
    "week" | "month" | "7days" | "30days" | "all"
  >("week");
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [divisions, setDivisions] = useState<DivisionOption[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<DivisionOption[]>(
    []
  );
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    classId: null as number | null,
    divisionId: null as number | null,
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  });

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params: any = { status: "active" };
        if (searchTerm) params.search = searchTerm;

        const response = await axios.get(`${API_BASE_URL}/students`, {
          params,
        });
        if (response.data) {
          const transformedStudents: Student[] = response.data.map((s: any) => {
            // Extract division letter from full division name (e.g., "Grade 10 - A" -> "A")
            const fullDivisionName = s.division?.name || "";
            const divisionLetter = fullDivisionName.includes(" - ")
              ? fullDivisionName.split(" - ").pop() || ""
              : fullDivisionName;

            return {
              id: s.id,
              name: s.name,
              studentId: s.studentId,
              class: s.class?.name || "",
              division: divisionLetter.trim() || "",
              classId: s.classId || null,
              divisionId: s.divisionId || null,
              email: s.email,
              phone: s.phone || "",
              dateOfBirth: s.dateOfBirth,
              address: s.address,
              parentName: s.parentName,
              parentPhone: s.parentPhone,
              parentEmail: s.parentEmail,
              enrollmentDate: s.enrollmentDate,
              status: s.status,
              moodStatus: "green" as const, // This would need to be calculated from mood logs
              lastMoodLog: "N/A", // This would need to be fetched from mood logs
            };
          });
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchTerm]);

  // Fetch classes and divisions
  useEffect(() => {
    const fetchClassesAndDivisions = async () => {
      try {
        // Fetch classes
        const classesResponse = await axios.get(`${API_BASE_URL}/classes`);
        if (classesResponse.data) {
          const transformedClasses: ClassOption[] = classesResponse.data.map(
            (c: any) => ({
              id: c.id,
              name: c.name,
              code: c.code || "",
            })
          );
          setClasses(transformedClasses);
        }

        // Fetch divisions
        const divisionsResponse = await axios.get(`${API_BASE_URL}/divisions`);
        if (divisionsResponse.data) {
          const transformedDivisions: DivisionOption[] =
            divisionsResponse.data.map((d: any) => {
              // Extract the division letter from name (e.g., "Grade 10 - A" -> "A")
              const fullName = d.name || "";
              const divisionLetter = fullName.includes(" - ")
                ? fullName.split(" - ").pop() || ""
                : fullName;

              return {
                id: d.id,
                name: fullName,
                divisionLetter: divisionLetter.trim(),
                class: d.class || "",
                classCode: d.classCode || "",
              };
            });
          setDivisions(transformedDivisions);
          console.log("Fetched divisions:", transformedDivisions);
        }
      } catch (error) {
        console.error("Error fetching classes/divisions:", error);
      }
    };

    fetchClassesAndDivisions();
  }, []);

  // Filter divisions based on selected class
  useEffect(() => {
    if (formData.classId) {
      // Find the selected class to get its name
      const selectedClass = classes.find((c) => c.id === formData.classId);
      if (selectedClass) {
        // Filter divisions by matching class name or classCode
        const filtered = divisions.filter(
          (d) =>
            d.class === selectedClass.name || d.classCode === selectedClass.code
        );
        setFilteredDivisions(filtered);
        console.log(
          "Filtered divisions for class:",
          selectedClass.name,
          filtered
        );
        // Reset divisionId if it's not valid for the selected class
        if (
          formData.divisionId &&
          !filtered.find((d) => d.id === formData.divisionId)
        ) {
          setFormData({ ...formData, divisionId: null });
        }
      } else {
        setFilteredDivisions([]);
      }
    } else {
      setFilteredDivisions([]);
    }
  }, [formData.classId, divisions, classes]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getMoodColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "orange":
        return "bg-orange-100 text-orange-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper functions for mood history
  const getEmotionIcon = (emotion: string | undefined): string => {
    const emotionIcons: { [key: string]: string } = {
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

  const getEmotionColor = (emotion: string | undefined): string => {
    const emotionColors: { [key: string]: string } = {
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

  // Fetch mood history for selected student
  const fetchMoodHistory = async (studentId: number) => {
    try {
      setLoadingMoodHistory(true);
      const today = new Date();
      let dateFrom = "";

      switch (timePeriod) {
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFrom = weekAgo.toISOString().split("T")[0];
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFrom = monthAgo.toISOString().split("T")[0];
          break;
        case "7days":
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          dateFrom = sevenDaysAgo.toISOString().split("T")[0];
          break;
        case "30days":
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          dateFrom = thirtyDaysAgo.toISOString().split("T")[0];
          break;
        case "all":
          dateFrom = "";
          break;
      }

      const params: any = {
        studentId: studentId,
        status: true,
      };

      if (dateFrom) {
        params.dateFrom = dateFrom;
      }

      const response = await axios.get(`${API_BASE_URL}/student-mood-logs`, {
        params,
      });

      if (response.data) {
        const transformedData: MoodLog[] = response.data.map((log: any) => ({
          id: log.id,
          date: log.date,
          time: log.time?.substring(0, 5) || "",
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
          createdAt: log.createdAt,
        }));

        setMoodHistory(transformedData);
      }
    } catch (err) {
      console.error("Error fetching mood history:", err);
      setMoodHistory([]);
    } finally {
      setLoadingMoodHistory(false);
    }
  };

  const handleViewMoodHistory = (student: Student) => {
    setSelectedStudent(student);
    setShowView(false); // Close the profile view modal
    setShowMoodHistory(true);
    setTimePeriod("week");
    fetchMoodHistory(student.id);
  };

  useEffect(() => {
    if (showMoodHistory && selectedStudent) {
      fetchMoodHistory(selectedStudent.id);
    }
  }, [timePeriod]);

  const handleAdd = () => {
    setIsEdit(false);
    // Generate a unique studentId using timestamp to avoid duplicates
    const timestamp = Date.now().toString().slice(-6);
    setFormData({
      name: "",
      studentId: `STU${timestamp}`,
      classId: null,
      divisionId: null,
      email: "",
      phone: "",
      status: "active",
    });
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    setIsEdit(true);
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      studentId: student.studentId,
      classId: student.classId || null,
      divisionId: student.divisionId || null,
      email: student.email,
      phone: student.phone || "",
      status: student.status,
    });
    setShowForm(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowView(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedStudent) {
      try {
        await axios.delete(`${API_BASE_URL}/students/${selectedStudent.id}`);
        setStudents(students.filter((s) => s.id !== selectedStudent.id));
        setShowDeleteConfirm(false);
        setSelectedStudent(null);
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.name.trim()) {
      alert("Please enter a student name");
      return;
    }
    if (!formData.studentId || !formData.studentId.trim()) {
      alert("Please enter a student ID");
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      alert("Please enter an email address");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      if (isEdit && selectedStudent) {
        const response = await axios.put(
          `${API_BASE_URL}/students/${selectedStudent.id}`,
          formData
        );
        if (response.data) {
          const updatedStudent: Student = {
            id: response.data.id,
            name: response.data.name,
            studentId: response.data.studentId,
            class: response.data.class?.name || "",
            division: response.data.division?.name || "",
            email: response.data.email,
            phone: response.data.phone || "",
            dateOfBirth: response.data.dateOfBirth,
            address: response.data.address,
            parentName: response.data.parentName,
            parentPhone: response.data.parentPhone,
            parentEmail: response.data.parentEmail,
            enrollmentDate: response.data.enrollmentDate,
            status: response.data.status,
            moodStatus: "green" as const,
            lastMoodLog: "N/A",
          };
          setStudents(
            students.map((s) =>
              s.id === selectedStudent.id ? updatedStudent : s
            )
          );
        }
      } else {
        // Log the data being sent for debugging
        console.log("Sending student data:", formData);
        const response = await axios.post(`${API_BASE_URL}/students`, formData);
        console.log("Student created successfully:", response.data);
        if (response.data) {
          const newStudent: Student = {
            id: response.data.id,
            name: response.data.name,
            studentId: response.data.studentId,
            class: response.data.class?.name || "",
            division: response.data.division?.name || "",
            email: response.data.email,
            phone: response.data.phone || "",
            dateOfBirth: response.data.dateOfBirth,
            address: response.data.address,
            parentName: response.data.parentName,
            parentPhone: response.data.parentPhone,
            parentEmail: response.data.parentEmail,
            enrollmentDate: response.data.enrollmentDate,
            status: response.data.status,
            moodStatus: "green" as const,
            lastMoodLog: "Just now",
          };
          setStudents([...students, newStudent]);
        }
      }
      setShowForm(false);
      setFormData({
        name: "",
        studentId: "",
        classId: null,
        divisionId: null,
        email: "",
        phone: "",
        status: "active",
      });
      setSelectedStudent(null);
    } catch (error: any) {
      console.error("Error saving student:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.message ||
        "Failed to save student. Please try again.";
      alert(`Failed to save student: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Students</h1>
        <p className="text-gray-600">Manage and view all student records</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 w-full md:w-auto">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, ID, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <FiFilter size={18} />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <FiDownload size={18} />
              Export
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] flex items-center gap-2"
            >
              <FiPlus size={18} />
              Add Student
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Student
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Class/Division
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Contact
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Mood Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Last Mood Log
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1ecab8] bg-opacity-10 flex items-center justify-center">
                        <FiUser className="text-[#1ecab8]" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">
                      {student.class} - {student.division}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-xs text-gray-500">{student.phone}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(
                        student.moodStatus
                      )}`}
                    >
                      {student.moodStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {student.lastMoodLog}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(student)}
                        className="p-2 text-[#1ecab8] hover:bg-[#1ecab8] hover:bg-opacity-10 rounded-lg transition-colors"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-[#1ecab8] hover:bg-[#1ecab8] hover:bg-opacity-10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No students found
          </div>
        ) : null}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredStudents.length)} of{" "}
              {filteredStudents.length} students
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Student" : "Add New Student"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: "",
                    studentId: "",
                    classId: null,
                    divisionId: null,
                    email: "",
                    phone: "",
                    status: "active",
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] disabled:bg-gray-50"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.classId || ""}
                    onChange={(e) => {
                      const classId = e.target.value
                        ? parseInt(e.target.value)
                        : null;
                      setFormData({ ...formData, classId, divisionId: null }); // Reset division when class changes
                    }}
                  >
                    <option value="">Select a Class (Optional)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] disabled:bg-gray-100"
                    value={formData.divisionId || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        divisionId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      });
                    }}
                    disabled={!formData.classId}
                  >
                    <option value="">Select a Division (Optional)</option>
                    {filteredDivisions.length > 0 ? (
                      filteredDivisions
                        .sort((a, b) =>
                          a.divisionLetter.localeCompare(b.divisionLetter)
                        )
                        .map((div) => (
                          <option key={div.id} value={div.id}>
                            {div.divisionLetter}
                          </option>
                        ))
                    ) : formData.classId ? (
                      <option value="" disabled>
                        No divisions available for this class
                      </option>
                    ) : null}
                  </select>
                  {!formData.classId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a class first
                    </p>
                  )}
                  {formData.classId && filteredDivisions.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No divisions found for the selected class
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] font-medium"
                >
                  {isEdit ? "Update" : "Add"} Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: "",
                      studentId: "",
                      classId: null,
                      divisionId: null,
                      email: "",
                      phone: "",
                      status: "active",
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal - Complete Profile */}
      {showView && selectedStudent && !showMoodHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Student Profile
              </h2>
              <button
                onClick={() => {
                  setShowView(false);
                  setSelectedStudent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Student Header */}
            <div className="bg-gradient-to-r from-[#1ecab8] to-[#1bb8a6] rounded-lg p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <FiUser size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-white text-opacity-90">
                    {selectedStudent.studentId}
                  </p>
                  <p className="text-white text-opacity-90">
                    {selectedStudent.class} - {selectedStudent.division}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-[#1ecab8]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Full Name
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Student ID
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.studentId}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Class & Division
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.class} - {selectedStudent.division}
                  </div>
                </div>
                {selectedStudent.dateOfBirth && (
                  <div>
                    <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                      <FiCalendar size={14} />
                      Date of Birth
                    </label>
                    <div className="font-medium text-gray-900">
                      {selectedStudent.dateOfBirth}
                    </div>
                  </div>
                )}
                {selectedStudent.enrollmentDate && (
                  <div>
                    <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                      <FiCalendar size={14} />
                      Enrollment Date
                    </label>
                    <div className="font-medium text-gray-900">
                      {selectedStudent.enrollmentDate}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Status
                  </label>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedStudent.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Mood Status
                  </label>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(
                        selectedStudent.moodStatus
                      )}`}
                    >
                      {selectedStudent.moodStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiMail className="text-[#1ecab8]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                    <FiMail size={14} />
                    Email
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                    <FiPhone size={14} />
                    Phone
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.phone}
                  </div>
                </div>
                {selectedStudent.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                      <FiMapPin size={14} />
                      Address
                    </label>
                    <div className="font-medium text-gray-900">
                      {selectedStudent.address}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Parent/Guardian Information */}
            {selectedStudent.parentName && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUserCheck className="text-[#1ecab8]" />
                  Parent/Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">
                      Parent Name
                    </label>
                    <div className="font-medium text-gray-900">
                      {selectedStudent.parentName}
                    </div>
                  </div>
                  {selectedStudent.parentPhone && (
                    <div>
                      <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                        <FiPhone size={14} />
                        Parent Phone
                      </label>
                      <div className="font-medium text-gray-900">
                        {selectedStudent.parentPhone}
                      </div>
                    </div>
                  )}
                  {selectedStudent.parentEmail && (
                    <div>
                      <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                        <FiMail size={14} />
                        Parent Email
                      </label>
                      <div className="font-medium text-gray-900">
                        {selectedStudent.parentEmail}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mood & Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mood & Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Current Mood Status
                  </label>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(
                        selectedStudent.moodStatus
                      )}`}
                    >
                      {selectedStudent.moodStatus.toUpperCase()} ZONE
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Last Mood Log
                  </label>
                  <div className="font-medium text-gray-900">
                    {selectedStudent.lastMoodLog}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewMoodHistory(selectedStudent)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
              >
                <FiBarChart2 size={18} />
                View Mood History
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedStudent);
                  setShowView(false);
                }}
                className="flex-1 px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] font-medium flex items-center justify-center gap-2"
              >
                <FiEdit size={18} />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setShowView(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delete Student
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedStudent.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood History Side Panel */}
      {showMoodHistory && selectedStudent && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-[60]"
            onClick={() => {
              setShowMoodHistory(false);
              setSelectedStudent(null);
              setMoodHistory([]);
            }}
          />
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mood History
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedStudent.name} ({selectedStudent.studentId})
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowMoodHistory(false);
                    setSelectedStudent(null);
                    setMoodHistory([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Time Period Filter */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiClock size={16} />
                    Time Period:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setTimePeriod("week")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timePeriod === "week"
                          ? "bg-[#1ecab8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Last Week
                    </button>
                    <button
                      onClick={() => setTimePeriod("7days")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timePeriod === "7days"
                          ? "bg-[#1ecab8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => setTimePeriod("month")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timePeriod === "month"
                          ? "bg-[#1ecab8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Last Month
                    </button>
                    <button
                      onClick={() => setTimePeriod("30days")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timePeriod === "30days"
                          ? "bg-[#1ecab8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Last 30 Days
                    </button>
                    <button
                      onClick={() => setTimePeriod("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        timePeriod === "all"
                          ? "bg-[#1ecab8] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      All Time
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Mood History Table */}
              {loadingMoodHistory ? (
                <div className="text-center py-12 text-gray-600">
                  Loading mood history...
                </div>
              ) : moodHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Date & Time
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Emotion
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Impact
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Joyfulness
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Zone
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Feeling
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {moodHistory.map((mood) => (
                        <tr
                          key={mood.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-semibold text-slate-900">
                              {mood.date}
                            </div>
                            <div className="text-xs text-gray-500">
                              {mood.time}
                            </div>
                          </td>
                          <td className="p-4">
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
                          <td className="p-4">
                            <span className="inline-block px-3.5 py-1.5 bg-gray-50 rounded-lg font-semibold text-sm">
                              {mood.impact}/7
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-3.5 py-1.5 bg-gray-50 rounded-lg font-semibold text-sm">
                              {mood.joyfulness}/7
                            </span>
                          </td>
                          <td className="p-4">
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
                          <td className="p-4">
                            <div
                              className="text-sm text-gray-900 max-w-xs truncate"
                              title={mood.feelingDescription}
                            >
                              {mood.feelingDescription || "N/A"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">😊</div>
                  <div className="text-lg font-semibold text-slate-900 mb-2">
                    No mood logs found
                  </div>
                  <div className="text-sm text-gray-500">
                    No mood logs available for the selected time period
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllStudents;
