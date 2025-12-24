import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiTrash2,
  FiEye,
  FiHome,
  FiClock,
  FiLock,
  FiUser,
} from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface BoardData {
  id: number;
  name: string;
  email: string;
  type: string;
  code?: string;
  status: boolean;
}

interface BoardForm {
  name: string;
  email: string;
  type: string;
  code?: string;
}

type ViewMode = "list" | "create" | "edit" | "overview";

const defaultForm: BoardForm = {
  name: "",
  email: "",
  type: "",
};

const tabs = [
  { label: "Overview", icon: FiClock },
  { label: "Security", icon: FiLock },
  { label: "History", icon: FiClock },
];

const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [mode, setMode] = useState<ViewMode>("list");
  const [form, setForm] = useState<BoardForm>(defaultForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const SERVER_URL = `${API_BASE_URL}/boards`;

  // Fetch boards from API
  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}`);
      if (!response.status) {
        throw new Error("Failed to fetch boards");
      }
      const data = await response.data;
      setBoards(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch boards");
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  // Load boards on component mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // When selectedId changes, update selectedBoard
  useEffect(() => {
    if (selectedId) {
      const board = boards.find((b) => b.id === selectedId);
      setSelectedBoard(board || null);
      if (mode === "edit" && board) {
        setForm({
          name: board.name || "",
          email: board.email || "",
          type: board.type || "",
          code: board.code || "",
        });
      }
    } else {
      setSelectedBoard(null);
    }
  }, [selectedId, boards, mode]);

  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/${id}/toggle-status`);
      if (!response.status) {
        throw new Error("Failed to toggle status");
      }
      const data = response.data;
      setBoards((prev) => prev.map((imp) => (imp.id === id ? data : imp)));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to toggle status");
      console.error("Error toggling status:", err);
    }
  };

  const handleChange = (field: keyof BoardForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // CREATE
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}`, form);
      if (!response.status) {
        throw new Error("Failed to create board");
      }
      setForm(defaultForm);
      fetchBoards();
      setMode("list");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to create board");
      console.error("Error creating board:", err);
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${SERVER_URL}/${selectedId}`, form);
      if (!response.status) {
        throw new Error("Failed to update board");
      }
      setForm(defaultForm);
      setMode("list");
      setSelectedId(null);
      fetchBoards();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to update board");
      console.error("Error updating board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setMode("list");
    setSelectedId(null);
    setError("");
  };

  const filteredBoards = boards.filter(
    (board) =>
      board.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredBoards.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBoards.slice(startIdx, endIdx);

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

  // DELETE
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.delete(`${SERVER_URL}/${id}`);
      if (!response.status) throw new Error("Failed to delete board");
      setDeleteConfirmId(null);
      setMode("list");
      setSelectedId(null);
      setSelectedBoard(null);
      fetchBoards();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to delete board");
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDERING ---

  // CREATE MODE
  if (mode === "create") {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Board
          </span>
          <span className="text-gray-400">&gt;</span>
          <span>Create</span>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
            <div className="font-semibold text-lg text-gray-700 mb-6">Board</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Board Name"
                  value={form.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("email", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={form.type}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleChange("type", e.target.value)
                  }
                  required
                >
                  <option value="">Select Board Type</option>
                  <option value="National">National</option>
                  <option value="CBSC">CBSC</option>
                  <option value="State">State</option>
                </select>
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Submit"}
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
    );
  }

  // EDIT MODE
  if (mode === "edit" && selectedBoard) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Board
          </span>
          <span className="text-gray-400">&gt;</span>
          <span>Edit</span>
        </div>
        <form onSubmit={handleEditSubmit}>
          <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
            <div className="font-semibold text-lg text-gray-700 mb-6">Board</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Board Name"
                  value={form.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  placeholder="Board Code"
                  value={form.code || ""}
                  readOnly
                />
              </div>
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("email", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={form.type}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleChange("type", e.target.value)
                  }
                  required
                >
                  <option value="">Select Board Type</option>
                  <option value="National">National</option>
                  <option value="CBSC">CBSC</option>
                  <option value="State">State</option>
                </select>
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-center mb-4">{error}</div>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update"}
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
    );
  }

  // OVERVIEW MODE
  if (mode === "overview" && selectedBoard) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome size={17} /> Board
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1ecab8] font-medium">Overview</span>
        </div>

        <div className="bg-white rounded-lg p-6 flex items-center mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-6 flex-shrink-0">
            <FiUser size={32} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl text-gray-900 mb-2">
              {selectedBoard.name}
            </div>
          </div>
          <button
            className="bg-[#d4f4f0] border-2 border-[#1ecab8] rounded-lg px-4 py-2 text-[#1ecab8] font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-[#c0ede8] hover:border-[#1bb8a6] flex-shrink-0"
            onClick={() => setMode("edit")}
          >
            <FiEdit size={16} /> Edit
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
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

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="font-bold text-base text-gray-800 mb-5">Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="text-sm">
              <span className="text-gray-500">Board Name</span>
              <span className="text-gray-900 font-medium ml-2">
                : {selectedBoard.name}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Board Code</span>
              <span className="text-gray-900 font-medium ml-2">
                : {selectedBoard.code || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Board Type</span>
              <span className="text-gray-900 font-medium ml-2">
                : {selectedBoard.type}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Email ID</span>
              <span className="text-gray-900 font-medium ml-2">
                : {selectedBoard.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST MODE
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
            onClick={() => setMode("create")}
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
        <div className="text-center py-12 text-gray-600">Loading boards...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Board Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Board Type
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Email ID
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
              {paginated.map((board) => (
                <tr key={board.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {board.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {board.code}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                    {board.type}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                    {board.email}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={board.status}
                        onChange={() => toggleStatus(board.id)}
                      />
                      <span
                        className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                          board.status ? "bg-[#1ecab8]" : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          board.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Overview"
                        onClick={() => {
                          setSelectedId(board.id);
                          setMode("overview");
                        }}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Edit"
                        onClick={() => {
                          setSelectedId(board.id);
                          setMode("edit");
                        }}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                        title="Delete"
                        onClick={() => setDeleteConfirmId(board.id)}
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
              Are you sure you want to delete this board?
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

export default Board;

