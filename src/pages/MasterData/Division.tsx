import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiTrash2,
  FiEye,
  FiHome,
  FiUser,
} from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface DivisionData {
  id: number;
  name: string;
  class: string;
  school: string;
  code: string;
  classCode: string;
  schoolCode: string;
  status: boolean;
}

interface DivisionForm {
  name: string;
  class: string;
  school: string;
  code: string;
  classCode: string;
  schoolCode: string;
  status: boolean;
}

type ViewMode = "list" | "form" | "edit" | "overview";

const defaultForm: DivisionForm = {
  name: "",
  class: "",
  school: "",
  code: "",
  classCode: "",
  schoolCode: "",
  status: true,
};

const Division: React.FC = () => {
  const [divisions, setDivisions] = useState<DivisionData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<ViewMode>("list");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<DivisionData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState<DivisionForm>(defaultForm);

  const SERVER_URL = `${API_BASE_URL}/divisions`;

  // Fetch divisions from API
  const fetchDivisions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}`);
      if (!response.status) throw new Error("Failed to fetch divisions");
      const data = await response.data;
      setDivisions(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch divisions");
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  // Status toggle
  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/${id}/toggle-status`);
      if (!response.status) throw new Error("Failed to toggle status");
      const data = await response.data;
      setDivisions((prev) => prev.map((imp) => (imp.id === id ? data : imp)));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to toggle status");
    }
    setMode("list");
  };

  // Filtered and paginated data
  const filteredDivisions = divisions.filter((div) =>
    div.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredDivisions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredDivisions.slice(startIdx, endIdx);

  // Form handlers
  const handleChange = (field: keyof DivisionForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleCancel = () => {
    setMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
    setSelectedDivision(null);
    setError("");
  };

  // Create or Edit submit
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.name) {
      setError("Division name is required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}`, form);
      if (!response.status) throw new Error("Failed to create division");
      setMode("list");
      fetchDivisions();
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to create division");
    } finally {
      setLoading(false);
    }
  };

  const handleFormEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${SERVER_URL}/${editId}`, form);
      if (!response.status) throw new Error("Failed to update division");
      setMode("list");
      fetchDivisions();
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      setError("Failed to update division");
    } finally {
      setLoading(false);
    }
  };

  // Edit handler
  const handleEdit = (div: DivisionData) => {
    setForm({
      name: div.name || "",
      class: div.class || "",
      school: div.school || "",
      code: div.code || "",
      status: div.status,
      schoolCode: div.schoolCode || "",
      classCode: div.classCode || "",
    });
    setIsEdit(true);
    setEditId(div.id);
    setMode("edit");
  };

  // Overview handler
  const handleOverview = (div: DivisionData) => {
    setSelectedDivision(div);
    setMode("overview");
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${SERVER_URL}/${id}`);
      if (!response.status) throw new Error("Failed to delete division");
      setDeleteConfirmId(null);
      setMode("list");
      setSelectedDivision(null);
      fetchDivisions();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to delete division");
    } finally {
      setLoading(false);
    }
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
  if (mode === "form") {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Division
          </span>
          <span className="text-gray-400">&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>
        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto shadow-sm">
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Division Name"
                value={form.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Class Name"
                value={form.class}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("class", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="School Name"
                value={form.school}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("school", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <label className="relative inline-block w-9 h-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.status}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("status", e.target.checked)
                  }
                />
                <span
                  className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                    form.status ? "bg-[#1ecab8]" : "bg-gray-300"
                  }`}
                ></span>
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    form.status ? "translate-x-4" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
            {error && (
              <div className="text-red-600 text-center mb-4 col-span-2">
                {error}
              </div>
            )}
            <div className="col-span-2 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {isEdit
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                  ? "Creating..."
                  : "Submit"}
              </button>
              <button
                type="button"
                className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Division
          </span>
          <span className="text-gray-400">&gt;</span>
          <span>Edit</span>
        </div>
        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto shadow-sm">
          <form onSubmit={handleFormEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Division Name"
                value={form.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Division Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Division Code"
                value={form.code}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("code", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Class Name"
                value={form.class}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("class", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="Class Code"
                value={form.classCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("classCode", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="School Name"
                value={form.school}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("school", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                placeholder="School Code"
                value={form.schoolCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("schoolCode", e.target.value)
                }
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-center mb-4 col-span-2">
                {error}
              </div>
            )}
            <div className="col-span-2 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {isEdit
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                  ? "Creating..."
                  : "Submit"}
              </button>
              <button
                type="button"
                className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- OVERVIEW VIEW ---
  if (mode === "overview" && selectedDivision) {
    const div = selectedDivision;
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Division
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1ecab8] font-medium">Overview</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex items-center mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-6 flex-shrink-0">
            <FiUser size={32} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl text-gray-900 mb-2">{div.name}</div>
          </div>
          <button
            className="bg-[#d4f4f0] border-2 border-[#1ecab8] rounded-lg px-4 py-2 text-[#1ecab8] font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-[#c0ede8] hover:border-[#1bb8a6] flex-shrink-0"
            onClick={() => handleEdit(div)}
          >
            <FiEdit size={16} /> Edit
          </button>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="font-bold text-base text-gray-800 mb-5">Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="text-sm">
              <span className="text-gray-500">Division Name</span>
              <span className="text-gray-900 font-medium ml-2">: {div.name}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Division Code</span>
              <span className="text-gray-900 font-medium ml-2">: {div.code || "-"}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Class Name</span>
              <span className="text-gray-900 font-medium ml-2">: {div.class}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-gray-900 font-medium ml-2">
                : {div.status ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">School Name</span>
              <span className="text-gray-900 font-medium ml-2">: {div.school}</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
              onClick={handleCancel}
            >
              Back
            </button>
          </div>
        </div>
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
              setMode("form");
              setIsEdit(false);
              setForm(defaultForm);
              setEditId(null);
            }}
          >
            <span className="text-lg leading-none">+</span>
            <span>Create</span>
          </button>
          <button className="p-2.5 border border-gray-200 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center">
            <FiDownload size={18} />
          </button>
          <button className="p-2.5 border border-gray-200 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center">
            <FiMaximize2 size={18} />
          </button>
          <button className="p-2.5 border border-gray-200 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-[#1ecab8] hover:text-[#1ecab8] shadow-sm hover:shadow-md flex items-center justify-center">
            <FiFilter size={18} />
          </button>
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading divisions...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Division Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Class
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  School
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
              {paginated.map((div) => (
                <tr key={div.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {div.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{div.code}</div>
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                    {div.class}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                    {div.school}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={div.status}
                        onChange={() => toggleStatus(div.id)}
                      />
                      <span
                        className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                          div.status ? "bg-[#1ecab8]" : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          div.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Edit"
                        onClick={() => handleEdit(div)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Overview"
                        onClick={() => handleOverview(div)}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                        title="Delete"
                        onClick={() => setDeleteConfirmId(div.id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="text-sm text-gray-600">
            {`Showing ${total === 0 ? 0 : startIdx + 1} to ${endIdx} of ${total} entries`}
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
              Are you sure you want to delete this division?
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

export default Division;

