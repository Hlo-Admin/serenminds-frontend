import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiMail,
  FiPhone,
  FiGlobe,
  FiTrash2,
  FiEye,
  FiUpload,
  FiX,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiCreditCard,
  FiBell,
  FiHome,
  FiLock,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface State {
  id: number;
  state: string;
  country: string;
  status: boolean;
}

interface City {
  id: number;
  city: string;
  state: string;
  country: string;
  status: boolean;
}

interface Board {
  id: number;
  name: string;
  email: string;
  type: string;
  code?: string;
  status: boolean;
}

interface Institute {
  id: number;
  name: string;
  code?: string | null;
}

interface Branch {
  id: number;
  name: string;
  code?: string;
  branchName?: string;
  branchCode?: string;
}

interface School {
  id: number;
  name: string;
  code: string;
  instituteCode: string;
  instituteName: string;
  branchCode: string;
  branchName: string;
  address1: string;
  address2?: string;
  cityId: number | null;
  stateId: number | null;
  pincode: string;
  schoolType: string;
  boardId: number | null;
  phone: string;
  email: string;
  telephone?: string;
  website?: string;
  logo?: string | File | null;
  status: boolean;
  city?: City;
  state?: State;
  board?: Board;
}

interface SchoolForm {
  name: string;
  code: string;
  instituteCode: string;
  instituteName: string;
  branchCode: string;
  branchName: string;
  address1: string;
  address2: string;
  cityId: string | null;
  stateId: string | null;
  pincode: string;
  schoolType: string;
  boardId: string | null;
  phone: string;
  email: string;
  telephone: string;
  website: string;
  logo: File | string | null;
  status: boolean;
}

interface Filters {
  instituteCode: string;
  instituteName: string;
  branchCode: string;
  branchName: string;
  boardId: string;
  schoolType: string;
  schoolCode: string;
  schoolName: string;
  status: string;
}

type ViewMode = "list" | "form" | "overview";

const overviewTabs = [
  { label: "Overview", icon: FiClock },
  { label: "Security", icon: FiLock },
  { label: "Statics", icon: FiBarChart2 },
  { label: "Students", icon: FiUser },
  { label: "Plans", icon: FiDollarSign },
  { label: "Invoice", icon: FiFileText },
  { label: "Bill", icon: FiCreditCard },
  { label: "History", icon: FiClock },
];

const initialFormState: SchoolForm = {
  name: "",
  code: "",
  instituteCode: "",
  instituteName: "",
  branchCode: "",
  branchName: "",
  address1: "",
  address2: "",
  cityId: null,
  stateId: null,
  pincode: "",
  schoolType: "",
  boardId: null,
  phone: "",
  email: "",
  telephone: "",
  website: "",
  logo: null,
  status: true,
};

const School: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<SchoolForm>(initialFormState);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(
    null
  );
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);

  // Filter states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    instituteCode: "",
    instituteName: "",
    branchCode: "",
    branchName: "",
    boardId: "",
    schoolType: "",
    schoolCode: "",
    schoolName: "",
    status: "",
  });

  // Overview tab state
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const SERVER_URL = `${API_BASE_URL}/schools`;
  const SERVER_URL_INSTITUTES = `${API_BASE_URL}/institutes`;
  const SERVER_URL_BRANCHES = `${API_BASE_URL}/branches`;
  const SERVER_URL_BOARDS = `${API_BASE_URL}/boards`;
  const SERVER_URL_STATES = `${API_BASE_URL}/states`;
  const SERVER_URL_CITIES = `${API_BASE_URL}/cities`;

  const fetchInstitutes = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_INSTITUTES}`);
      setInstitutes(response.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_BRANCHES}`);
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_BOARDS}`);
      setBoards(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_STATES}`);
      const data = await response.data;
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_CITIES}`);
      const data = await response.data;
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch schools from API
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}`);
      if (!response.status) throw new Error("Failed to fetch schools");
      const data = await response.data;
      setSchools(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch schools");
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchCities();
    fetchStates();
    fetchInstitutes();
    fetchBranches();
    fetchBoards();
  }, []);

  // Toggle status (optimistic)
  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/${id}/toggle-status`);
      const data = response.data;
      setSchools((prev) => prev.map((p) => (p.id === id ? data : p)));
      if (!response.status) throw new Error("Failed to toggle status");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to toggle status");
    }
  };

  // Advanced filtering
  const filteredSchools = schools.filter((school) => {
    // Basic search
    const matchesSearch =
      !searchTerm ||
      school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.instituteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.instituteCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.branchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.phone?.includes(searchTerm);

    // Advanced filters
    const matchesFilters =
      (!filters.instituteCode ||
        school.instituteCode
          ?.toLowerCase()
          .includes(filters.instituteCode.toLowerCase())) &&
      (!filters.instituteName ||
        school.instituteName
          ?.toLowerCase()
          .includes(filters.instituteName.toLowerCase())) &&
      (!filters.branchCode ||
        school.branchCode
          ?.toLowerCase()
          .includes(filters.branchCode.toLowerCase())) &&
      (!filters.branchName ||
        school.branchName
          ?.toLowerCase()
          .includes(filters.branchName.toLowerCase())) &&
      (!filters.boardId || school.boardId === Number(filters.boardId)) &&
      (!filters.schoolType || school.schoolType === filters.schoolType) &&
      (!filters.schoolCode ||
        school.code
          ?.toLowerCase()
          .includes(filters.schoolCode.toLowerCase())) &&
      (!filters.schoolName ||
        school.name
          ?.toLowerCase()
          .includes(filters.schoolName.toLowerCase())) &&
      (filters.status === "" ||
        (filters.status === "active" && school.status) ||
        (filters.status === "inactive" && !school.status));

    return matchesSearch && matchesFilters;
  });
  const total = filteredSchools.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredSchools.slice(startIdx, endIdx);

  const handleFormChange = (
    field: keyof SchoolForm,
    value: string | File | null | boolean
  ) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        setError("Logo size must be less than 800KB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setForm({ ...form, logo: file });
      setError("");
    }
  };

  // Validation
  const validateForm = (): boolean => {
    if (!form.code || form.code.trim() === "") {
      setError("School Code is required");
      return false;
    }
    if (!form.email || form.email.trim() === "") {
      setError("Email is required");
      return false;
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    // Phone validation
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    // Check for duplicate school code (if creating new)
    if (!isEdit) {
      const duplicateCode = schools.find(
        (s) => s.code.toLowerCase() === form.code.toLowerCase()
      );
      if (duplicateCode) {
        setError("School Code already exists. Please use a unique code.");
        return false;
      }
      // Check for duplicate email
      const duplicateEmail = schools.find(
        (s) => s.email.toLowerCase() === form.email.toLowerCase()
      );
      if (duplicateEmail) {
        setError("Email already exists. Please use a unique email.");
        return false;
      }
    }
    return true;
  };

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "School Code",
        "School Name",
        "Institute Code",
        "Institute Name",
        "Branch Code",
        "Branch Name",
        "Board",
        "School Type",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "Pincode",
        "Status",
      ],
      ...filteredSchools.map((school) => [
        school.code || "",
        school.name || "",
        school.instituteCode || "",
        school.instituteName || "",
        school.branchCode || "",
        school.branchName || "",
        school.board?.name || "",
        school.schoolType || "",
        school.email || "",
        school.phone || "",
        school.address1 || "",
        school.city?.city || "",
        school.state?.state || "",
        school.pincode || "",
        school.status ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `schools_export_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import functionality
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parsing (you may want to use a library like papaparse)
        const lines = text.split("\n");
        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        // This is a basic implementation - you'd need proper CSV parsing
        setError(
          "Import functionality requires CSV parsing library. Please implement using papaparse or similar."
        );
      } catch (err) {
        const error = err as Error;
        setError("Failed to import file: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Create or Edit
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const submitForm: any = { ...form };
    submitForm.stateId = submitForm.stateId ? Number(submitForm.stateId) : null;
    submitForm.cityId = submitForm.cityId ? Number(submitForm.cityId) : null;
    if (submitForm.boardId) {
      submitForm.boardId = Number(submitForm.boardId);
    }

    // Create FormData if logo is present
    const formData = new FormData();
    Object.keys(submitForm).forEach((key) => {
      if (
        key === "logo" &&
        submitForm[key] &&
        typeof submitForm[key] === "object" &&
        submitForm[key] instanceof File
      ) {
        formData.append("logo", submitForm[key] as File);
      } else if (
        submitForm[key as keyof SchoolForm] !== null &&
        submitForm[key as keyof SchoolForm] !== undefined
      ) {
        formData.append(key, String(submitForm[key as keyof SchoolForm]));
      }
    });

    try {
      if (isEdit && editId) {
        const response = await axios.put(
          `${SERVER_URL}/${editId}`,
          submitForm.logo &&
            typeof submitForm.logo === "object" &&
            submitForm.logo instanceof File
            ? formData
            : submitForm,
          submitForm.logo &&
            typeof submitForm.logo === "object" &&
            submitForm.logo instanceof File
            ? {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            : {}
        );
        if (!response.status) throw new Error("Failed to update school");
        fetchSchools();
      } else {
        const response = await axios.post(
          `${SERVER_URL}`,
          submitForm.logo &&
            typeof submitForm.logo === "object" &&
            submitForm.logo instanceof File
            ? formData
            : submitForm,
          submitForm.logo &&
            typeof submitForm.logo === "object" &&
            submitForm.logo instanceof File
            ? {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            : {}
        );
        if (!response.status) throw new Error("Failed to create school");
        const data = await response.data;
        fetchSchools();
      }
      setForm(initialFormState);
      setIsEdit(false);
      setEditId(null);
      setViewMode("list");
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(
        axiosError.response?.data?.error ||
          axiosError.message ||
          "Failed to save school"
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (school: School) => {
    setForm({
      name: school.name || "",
      code: school.code || "",
      instituteCode: school.instituteCode || "",
      instituteName: school.instituteName || "",
      branchCode: school.branchCode || "",
      branchName: school.branchName || "",
      address1: school.address1 || "",
      address2: school.address2 || "",
      cityId: school.cityId ? String(school.cityId) : null,
      stateId: school.stateId ? String(school.stateId) : null,
      pincode: school.pincode || "",
      schoolType: school.schoolType || "",
      boardId:
        school.boardId || school.board?.id
          ? String(school.boardId || school.board?.id)
          : null,
      phone: school.phone || "",
      email: school.email || "",
      telephone: school.telephone || "",
      website: school.website || "",
      logo: school.logo || null,
      status: school.status,
    });
    setIsEdit(true);
    setEditId(school.id);
    setViewMode("form");
    if (school.state) {
      setSelectedState(school.state.state);
    }
  };

  // Overview
  const handleOverview = (school: School) => {
    setSelectedSchool(school);
    setViewMode("overview");
  };

  // Delete
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.delete(`${SERVER_URL}/${id}`);
      setViewMode("list");
      setDeleteConfirmId(null);
      setViewMode("list");
      setSelectedSchool(null);
      fetchSchools();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to delete school");
    } finally {
      setLoading(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setForm(initialFormState);
    setIsEdit(false);
    setEditId(null);
    setSelectedSchool(null);
    setViewMode("list");
    setSelectedState("");
  };

  // Smart pagination logic
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-200 ${
              page === i
                ? "bg-[#1ecab8] text-white shadow-sm"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            }`}
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          buttons.push(
            <button
              key={i}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                page === i
                  ? "bg-[#1ecab8] text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              }`}
              onClick={() => setPage(i)}
            >
              {i}
            </button>
          );
        }
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-400">
            ...
          </span>
        );
        buttons.push(
          <button
            key={totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </button>
        );
      } else if (page >= totalPages - 2) {
        buttons.push(
          <button
            key={1}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            onClick={() => setPage(1)}
          >
            1
          </button>
        );
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-400">
            ...
          </span>
        );
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                page === i
                  ? "bg-[#1ecab8] text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              }`}
              onClick={() => setPage(i)}
            >
              {i}
            </button>
          );
        }
      } else {
        buttons.push(
          <button
            key={1}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            onClick={() => setPage(1)}
          >
            1
          </button>
        );
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-400">
            ...
          </span>
        );
        for (let i = page - 1; i <= page + 1; i++) {
          buttons.push(
            <button
              key={i}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                page === i
                  ? "bg-[#1ecab8] text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
              }`}
              onClick={() => setPage(i)}
            >
              {i}
            </button>
          );
        }
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-400">
            ...
          </span>
        );
        buttons.push(
          <button
            key={totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 hover:border-gray-400 shadow-sm"
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  // --- FORM VIEW ---
  if (viewMode === "form") {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> School
          </span>
          <span className="text-gray-400">&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>
        <form onSubmit={handleFormSubmit}>
          {/* School Details */}
          <div className="bg-white rounded-lg p-8 shadow-sm mb-6 max-w-4xl mx-auto">
            <div className="font-semibold text-lg text-gray-700 mb-6">
              School Details
            </div>
            {/* Logo Upload Section */}
            <div className="mb-6 p-5 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <div className="mb-3">
                {form.logo ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        typeof form.logo === "string"
                          ? form.logo
                          : URL.createObjectURL(form.logo as File)
                      }
                      alt="School Logo"
                      className="max-w-[120px] max-h-[120px] rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleFormChange("logo", null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-red-600"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <FiUpload size={32} />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-block px-4 py-2 bg-[#1ecab8] text-white rounded-lg cursor-pointer text-sm font-medium hover:bg-[#1bb8a6] transition-colors"
              >
                {form.logo ? "Change Logo" : "Upload Logo"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Allowed JPG, GIF or PNG. Max size of 800kB
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="School Name"
                  name="name"
                  value={form.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Code
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="School Code"
                  name="code"
                  value={form.code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute Code
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Institute Code"
                  name="instituteCode"
                  value={form.instituteCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute Name
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Institute Name"
                  name="instituteName"
                  value={form.instituteName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Branch Code"
                  name="branchCode"
                  value={form.branchCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <input
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Branch Name"
                  name="branchName"
                  value={form.branchName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  disabled={isEdit}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Address Line 1"
                  name="address1"
                  value={form.address1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Address Line 2"
                  name="address2"
                  value={form.address2}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={form.stateId || ""}
                  name="stateId"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    handleFormChange("stateId", e.target.value);
                    const selected = states.find(
                      (state) => String(state.id) === e.target.value
                    );
                    setSelectedState(selected ? selected.state : "");
                  }}
                >
                  <option value="">Select</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  name="cityId"
                  value={form.cityId || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleFormChange("cityId", e.target.value)
                  }
                  disabled={!form.stateId}
                >
                  <option value="">Select</option>
                  {cities
                    .filter(
                      (city) => String(city.state) === String(selectedState)
                    )
                    .map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Pin Code"
                  name="pincode"
                  value={form.pincode}
                  maxLength={6}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    handleFormChange("pincode", onlyNums);
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Board
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <select
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  name="boardId"
                  value={form.boardId || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleFormChange("boardId", e.target.value)
                  }
                  disabled={isEdit}
                  required
                >
                  <option value="">Select Board</option>
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Type
                  {isEdit && (
                    <span className="text-gray-500 text-xs ml-1">
                      (Read Only)
                    </span>
                  )}
                </label>
                <select
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] ${
                    isEdit ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  name="schoolType"
                  value={form.schoolType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleFormChange("schoolType", e.target.value)
                  }
                  disabled={isEdit}
                  required
                >
                  <option value="">Select School Type</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="HigherSecondary">Higher Secondary</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                </select>
              </div>
            </div>
          </div>
          {/* Contact Details */}
          <div className="bg-white rounded-lg p-8 shadow-sm mb-6 max-w-4xl mx-auto">
            <div className="font-semibold text-lg text-gray-700 mb-6">
              Contact Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email ID
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Email ID"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone Number
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Telephone Number"
                  name="telephone"
                  value={form.telephone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Link
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Website Link"
                  name="website"
                  value={form.website}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(
                      e.target.name as keyof SchoolForm,
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-center mb-4 max-w-4xl mx-auto">
              {error}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Submit"}
            </button>
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-base cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- OVERVIEW VIEW ---
  if (viewMode === "overview" && selectedSchool) {
    const s = selectedSchool;
    // Mock data for financial/admin features
    const subscriptionData = {
      planName: "Premium Plan",
      startDate: "2024-01-01",
      expiryDate: "2024-12-31",
      renewalDate: "2024-12-15",
      cost: "$999/year",
      status: "Active",
    };

    const invoices = [
      {
        id: 1,
        invoiceDate: "2024-01-01",
        totalAmount: 999,
        taxes: 99,
        paymentStatus: "Paid",
      },
      {
        id: 2,
        invoiceDate: "2023-01-01",
        totalAmount: 999,
        taxes: 99,
        paymentStatus: "Paid",
      },
    ];

    const payments = [
      {
        id: 1,
        transactionId: "TXN123456",
        amount: 999,
        paymentMethod: "Credit Card",
        status: "Completed",
        date: "2024-01-01",
      },
    ];

    const notifications = [
      {
        id: 1,
        message: "Subscription renewal due in 15 days",
        date: "2024-12-01",
        read: false,
      },
      {
        id: 2,
        message: "Payment received successfully",
        date: "2024-01-02",
        read: true,
      },
    ];

    const activityLogs = [
      {
        id: 1,
        action: "Created",
        user: "Admin User",
        timestamp: "2024-01-01 10:00:00",
        details: "School created successfully",
      },
      {
        id: 2,
        action: "Updated",
        user: "Admin User",
        timestamp: "2024-01-15 14:30:00",
        details: "School profile updated",
      },
      {
        id: 3,
        action: "Viewed",
        user: "Admin User",
        timestamp: "2024-01-20 09:15:00",
        details: "School overview accessed",
      },
    ];

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> School
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1ecab8] font-medium">Overview</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex items-center mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-6 flex-shrink-0">
            <FiUser size={32} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl text-gray-900 mb-2">{s.name}</div>
            <div className="flex items-center gap-6 text-gray-600 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <FiMail size={16} className="text-gray-500" /> {s.email}
              </span>
              <span className="flex items-center gap-1.5">
                <FiPhone size={16} className="text-gray-500" /> {s.phone}
              </span>
              {s.website && (
                <span className="flex items-center gap-1.5">
                  <FiGlobe size={16} className="text-gray-500" /> {s.website}
                </span>
              )}
            </div>
          </div>
          <button
            className="bg-[#d4f4f0] border-2 border-[#1ecab8] rounded-lg px-4 py-2 text-[#1ecab8] font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-[#c0ede8] hover:border-[#1bb8a6] flex-shrink-0"
            onClick={() => handleEdit(s)}
          >
            <FiEdit size={16} /> Edit
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {overviewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#1ecab8] text-white shadow-sm"
                    : "bg-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5">
              Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="text-sm">
                <span className="text-gray-500">School Name</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.name}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">School Code</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.code}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Institute Name</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.instituteName}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Institute Code</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.instituteCode}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Branch Name</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.branchName}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Branch Code</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.branchCode}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Phone Number</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.phone}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Email Address</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.email}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Address Line 1</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.address1}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Address Line 2</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.address2 || "-"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">City</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.city?.city || "-"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">State</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.state?.state || "-"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Pin Code</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.pincode}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Board</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.board?.name || "N/A"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Website</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {s.website || "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Plans/Subscription Tab */}
        {activeTab === "Plans" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5">
              Subscription Plan
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="text-sm">
                <span className="text-gray-500">Plan Name</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.planName}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Expiry Date</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.expiryDate}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Start Date</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.startDate}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Cost</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.cost}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Renewal Date</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.renewalDate}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-gray-900 font-medium ml-2">
                  : {subscriptionData.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Tab */}
        {activeTab === "Invoice" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5">
              Billing History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-3 text-left text-sm text-gray-600">
                      Invoice Date
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Total Amount
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Taxes
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="p-3 text-sm">{invoice.invoiceDate}</td>
                      <td className="p-3 text-sm">${invoice.totalAmount}</td>
                      <td className="p-3 text-sm">${invoice.taxes}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            invoice.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "Bill" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5">
              Payment Transactions
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-3 text-left text-sm text-gray-600">
                      Transaction ID
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Amount
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Payment Method
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="p-3 text-sm">{payment.transactionId}</td>
                      <td className="p-3 text-sm">${payment.amount}</td>
                      <td className="p-3 text-sm">{payment.paymentMethod}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "Security" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5 flex items-center gap-2">
              <FiBell /> Notifications
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.read ? "bg-white" : "bg-gray-50"
                  } ${!notification.read ? "border-l-4 border-[#1ecab8]" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div
                        className={`mb-1 ${
                          notification.read ? "font-normal" : "font-semibold"
                        } text-gray-900`}
                      >
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {notification.date}
                      </div>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1ecab8]"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Logs/History Tab */}
        {activeTab === "History" && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="font-bold text-base text-gray-800 mb-5">
              Activity Logs (Audit Trail)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-3 text-left text-sm text-gray-600">
                      Action
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      User
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Timestamp
                    </th>
                    <th className="p-3 text-left text-sm text-gray-600">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{log.user}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {log.timestamp}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder tabs */}
        {(activeTab === "Statics" || activeTab === "Students") && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center text-gray-500">
            <div className="text-base mb-2">
              {activeTab} feature coming soon
            </div>
            <div className="text-sm">
              This section will display {activeTab.toLowerCase()} information
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-4 flex-wrap bg-gray-50 p-4 rounded-lg">
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] transition-all"
          value={pageSize}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] transition-all flex-1 min-w-[200px]"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <button
            className="bg-[#1ecab8] text-white border-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-[#1bb8a6] shadow-sm hover:shadow-md flex items-center gap-1.5"
            onClick={() => {
              setViewMode("form");
              setIsEdit(false);
              setForm(initialFormState);
              setEditId(null);
            }}
          >
            <span className="text-lg leading-none">+</span>
            <span>Create</span>
          </button>
          <button
            className="p-2.5 border border-gray-200 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center"
            onClick={handleExport}
            title="Export"
          >
            <FiDownload size={18} />
          </button>
          <label
            className="p-2.5 border border-gray-200 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center relative"
            title="Import"
          >
            <FiUpload size={18} />
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          <button
            className={`p-2.5 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center ${
              showFilters
                ? "bg-[#1ecab8] text-white border-[#1ecab8]"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setShowFilters(!showFilters)}
            title="Filter"
          >
            <FiFilter size={18} />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Advanced Filters
            </h3>
            <button
              onClick={() => {
                setFilters({
                  instituteCode: "",
                  instituteName: "",
                  branchCode: "",
                  branchName: "",
                  boardId: "",
                  schoolType: "",
                  schoolCode: "",
                  schoolName: "",
                  status: "",
                });
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs cursor-pointer text-gray-600 hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Institute Code
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Institute Code"
                value={filters.instituteCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, instituteCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Institute Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Institute Name"
                value={filters.instituteName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, instituteName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Branch Code
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Branch Code"
                value={filters.branchCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, branchCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Branch Name"
                value={filters.branchName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, branchName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Board
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                value={filters.boardId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, boardId: e.target.value })
                }
              >
                <option value="">All Boards</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                School Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                value={filters.schoolType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, schoolType: e.target.value })
                }
              >
                <option value="">All Types</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="HigherSecondary">Higher Secondary</option>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                School Code
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="School Code"
                value={filters.schoolCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, schoolCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="School Name"
                value={filters.schoolName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, schoolName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                value={filters.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading schools...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  School Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Institute
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Branch
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Board
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  School Type
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Status
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-sm text-gray-900">
                        {school.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {school.code}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-sm text-gray-900">
                        {school.instituteName}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {school.instituteCode}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-sm text-gray-900">
                        {school.branchName}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {school.branchCode}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                      {school.board?.name || "N/A"}
                    </td>
                    <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                      {school.schoolType}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <label className="relative inline-block w-9 h-5 cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={school.status}
                          onChange={() => toggleStatus(school.id)}
                        />
                        <span
                          className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                            school.status ? "bg-[#1ecab8]" : "bg-gray-300"
                          }`}
                        ></span>
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                            school.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                          title="Overview"
                          onClick={() => handleOverview(school)}
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                          title="Edit"
                          onClick={() => handleEdit(school)}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                          title="Delete"
                          onClick={() => setDeleteConfirmId(school.id)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    No schools found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="text-sm text-gray-600">
            {`Showing ${
              total === 0 ? 0 : startIdx + 1
            } to ${endIdx} of ${total} entries`}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {"<"}
            </button>
            {renderPaginationButtons()}
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
            <div className="text-base text-gray-800 mb-6">
              Are you sure you want to delete this school?
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default School;
