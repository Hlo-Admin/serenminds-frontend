import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { FiEdit, FiTrash2, FiEye, FiCheck, FiX } from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface Emotion {
  id: number;
  name: string;
  code?: string;
}

interface Zone {
  id: number;
  name: string;
  description?: string;
}

interface Mood {
  id: number;
  code: string;
  name: string;
  emotionId: number;
  zoneId: number;
  status: boolean;
  emotion?: Emotion;
  zone?: Zone;
}

interface MoodForm {
  code: string;
  name: string;
  emotionId: string;
  zoneId: string;
}

const LogMood: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [modalForm, setModalForm] = useState<MoodForm>({
    code: "",
    name: "",
    emotionId: "",
    zoneId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [overviewMood, setOverviewMood] = useState<Mood | null>(null);
  const [statusFilter] = useState<"all" | "active" | "pending">("all");

  const SERVER_URL = `${API_BASE_URL}/moods`;
  const SERVER_URL_EMOTIONS = `${API_BASE_URL}/emotions`;
  const SERVER_URL_ZONES = `${API_BASE_URL}/zones`;

  // Fetch moods from API
  const fetchMoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}`);
      if (!response.status) {
        throw new Error("Failed to fetch moods");
      }
      const data = await response.data;
      setMoods(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch moods");
      console.error("Error fetching moods:", err);
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  // Fetch emotions from API
  const fetchEmotions = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL_EMOTIONS}`);
      if (!response.status) {
        throw new Error("Failed to fetch emotions");
      }
      const data = await response.data;
      setEmotions(data);
    } catch (err) {
      console.error("Error fetching emotions:", err);
    }
  }, [SERVER_URL_EMOTIONS]);

  // Fetch zones from API
  const fetchZones = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL_ZONES}`);
      if (!response.status) {
        throw new Error("Failed to fetch zones");
      }
      const data = await response.data;
      setZones(data);
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  }, [SERVER_URL_ZONES]);

  // Load data on component mount
  useEffect(() => {
    fetchMoods();
    fetchEmotions();
    fetchZones();
  }, [fetchMoods, fetchEmotions, fetchZones]);

  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/${id}/toggle-status`);
      if (!response.status) {
        throw new Error("Failed to toggle status");
      }
      const data = await response.data;
      setMoods((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to toggle status");
      console.error("Error toggling status:", err);
    }
  };

  // Approve pending mood (set status to true)
  const approveMood = async (id: number) => {
    try {
      setLoading(true);
      const mood = moods.find((m) => m.id === id);
      if (!mood) {
        throw new Error("Mood not found");
      }
      const response = await axios.put(`${SERVER_URL}/${id}`, {
        name: mood.name,
        emotionId: mood.emotionId,
        zoneId: mood.zoneId,
        status: true,
      });
      if (!response.status) {
        throw new Error("Failed to approve mood");
      }
      const data = await response.data;
      setMoods((prev) => prev.map((p) => (p.id === id ? data : p)));
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to approve mood");
      console.error("Error approving mood:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reject pending mood (delete it)
  const rejectMood = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to reject mood");
      }
      setMoods((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      if (overviewMood && overviewMood.id === id) setOverviewMood(null);
      setError("");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to reject mood");
      console.error("Error rejecting mood:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", emotionId: "", zoneId: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id: number) => {
    const mood = moods.find((m) => m.id === id);
    setModalType("edit");
    setModalForm({
      code: mood ? mood.code : "",
      name: mood ? mood.name : "",
      emotionId: mood ? String(mood.emotionId) : "",
      zoneId: mood ? String(mood.zoneId) : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedForm = { ...modalForm, [e.target.name]: e.target.value };

    // Auto-generate name when emotion and zone are selected
    if (e.target.name === "emotionId" || e.target.name === "zoneId") {
      const emotionId =
        e.target.name === "emotionId" ? e.target.value : updatedForm.emotionId;
      const zoneId =
        e.target.name === "zoneId" ? e.target.value : updatedForm.zoneId;

      if (emotionId && zoneId) {
        const selectedEmotion = emotions.find(
          (em) => em.id === Number(emotionId)
        );
        const selectedZone = zones.find((z) => z.id === Number(zoneId));
        if (selectedEmotion && selectedZone) {
          const zoneDisplay = selectedZone.description || selectedZone.name;
          updatedForm.name = `${selectedEmotion.name} - ${zoneDisplay}`;
        }
      }
    }

    setModalForm(updatedForm);
  };

  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.emotionId || !modalForm.zoneId)
      return;

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        const res = await axios.put(`${SERVER_URL}/${editingId}`, {
          name: modalForm.name,
          emotionId: Number(modalForm.emotionId),
          zoneId: Number(modalForm.zoneId),
        });

        if (!res.status) {
          throw new Error(`Failed to update mood`);
        }
        fetchMoods();
      } else {
        const res = await axios.post(`${SERVER_URL}`, {
          name: modalForm.name,
          emotionId: Number(modalForm.emotionId),
          zoneId: Number(modalForm.zoneId),
        });

        console.log(res.data);
        fetchMoods();

        if (!res.status) {
          throw new Error(`Failed to create mood`);
        }
      }

      setShowModal(false);
      setModalForm({ code: "", name: "", emotionId: "", zoneId: "" });
      setEditingId(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to save mood");
      console.error(`Error saving mood:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", emotionId: "", zoneId: "" });
    setEditingId(null);
  };

  const filteredMoods = moods.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.emotion?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.zone?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && m.status === true) ||
      (statusFilter === "pending" && m.status === false);

    return matchesSearch && matchesStatus;
  });
  const total = filteredMoods.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredMoods.slice(startIdx, endIdx);

  // DELETE mood
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete mood");
      }

      fetchMoods();
      setDeleteConfirmId(null);
      if (overviewMood && overviewMood.id === id) setOverviewMood(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to delete mood");
      console.error("Error deleting mood:", err);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (mood: Mood) => {
    setOverviewMood(mood);
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

  if (overviewMood) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
        <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Mood Overview
          </h3>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Mood Name:</strong>{" "}
            <span className="text-gray-900">{overviewMood.name}</span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Mood Code:</strong>{" "}
            <span className="text-gray-900">{overviewMood.code}</span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Emotion:</strong>{" "}
            <span className="text-gray-900">
              {overviewMood.emotion ? overviewMood.emotion.name : ""}
            </span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Zone:</strong>{" "}
            <span className="text-gray-900">
              {overviewMood.zone ? overviewMood.zone.name : ""}
            </span>
          </div>
          <div className="mb-6 text-sm">
            <strong className="text-gray-700">Status:</strong>{" "}
            <span className="text-gray-900">
              {overviewMood.status ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setOverviewMood(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={openCreate}
          >
            <span className="text-lg leading-none">+</span>
            <span>Create</span>
          </button>
        </div>
      </div>
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading moods...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Mood Name
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
              {paginated.map((m) => {
                const isPending = !m.status;
                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isPending ? "bg-yellow-50/50" : ""
                    }`}
                  >
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm text-gray-900">
                          {m.name}
                        </div>
                        {isPending && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {m.code}
                      </div>
                      {m.code.startsWith("CUSTOM_") && (
                        <div
                          className={`text-xs mt-1 italic ${
                            m.status ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          {m.status
                            ? "✓ Approved custom mood"
                            : "Student-submitted custom mood"}
                        </div>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      {isPending ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Pending Review
                        </span>
                      ) : (
                        <label className="relative inline-block w-9 h-5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={m.status}
                            onChange={() => toggleStatus(m.id)}
                          />
                          <span
                            className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                              m.status ? "bg-[#1ecab8]" : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                              m.status ? "translate-x-4" : "translate-x-0"
                            }`}
                          ></span>
                        </label>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors rounded"
                              title="Approve"
                              onClick={() => approveMood(m.id)}
                              disabled={loading}
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                              title="Reject"
                              onClick={() => setDeleteConfirmId(m.id)}
                              disabled={loading}
                            >
                              <FiX size={18} />
                            </button>
                            <button
                              className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                              title="Overview"
                              onClick={() => handleOverview(m)}
                            >
                              <FiEye size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                              title="Edit"
                              onClick={() => openEdit(m.id)}
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                              title="Overview"
                              onClick={() => handleOverview(m)}
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                              title="Delete"
                              onClick={() => setDeleteConfirmId(m.id)}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {modalType === "edit" ? "Edit Mood" : "Add New Mood"}
            </h3>
            <form onSubmit={handleModalSubmit}>
              {modalType === "edit" && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-600 text-sm font-medium">
                    Mood Code
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                    value={modalForm.code}
                    name="code"
                    readOnly
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-2 text-gray-600 text-sm font-medium">
                  Emotion Name <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.emotionId}
                  name="emotionId"
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Select Emotion</option>
                  {emotions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-600 text-sm font-medium">
                  Zone Description <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.zoneId}
                  name="zoneId"
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Select Zone</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.description || z.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-gray-600 text-sm font-medium">
                  Mood Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Mood Name (Auto-generated from Emotion and Zone)"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
                  onClick={handleModalCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : modalType === "edit"
                    ? "Update"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
            <div className="text-base text-gray-800 mb-6">
              {moods.find((m) => m.id === deleteConfirmId)?.status === false
                ? "Are you sure you want to reject this pending mood? It will be permanently deleted."
                : "Are you sure you want to delete this mood?"}
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-red-500/20 hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
                onClick={() => {
                  const mood = moods.find((m) => m.id === deleteConfirmId);
                  if (mood && !mood.status) {
                    rejectMood(deleteConfirmId);
                  } else {
                    handleDelete(deleteConfirmId);
                  }
                }}
              >
                {moods.find((m) => m.id === deleteConfirmId)?.status === false
                  ? "Reject"
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogMood;
