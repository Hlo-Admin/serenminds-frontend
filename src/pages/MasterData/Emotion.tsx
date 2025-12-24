import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import API_BASE_URL from "../../config/api";

const EMOTION_SCORES = [50, 60, 70, 75, 80, 90, 100];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface EmotionData {
  id: number;
  code: string;
  name: string;
  score: number;
  status: boolean;
}

interface EmotionForm {
  code: string;
  name: string;
  score: string;
}

const Emotion: React.FC = () => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [modalForm, setModalForm] = useState<EmotionForm>({
    code: "",
    name: "",
    score: "",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [overviewEmotion, setOverviewEmotion] = useState<EmotionData | null>(null);

  const SERVER_URL = `${API_BASE_URL}/emotions`;

  // Fetch emotions from API
  const fetchEmotions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}`);
      if (!response.ok) {
        throw new Error("Failed to fetch emotions");
      }
      const data = await response.json();
      setEmotions(data);
      console.log(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to fetch emotions");
      console.error("Error fetching emotions:", err);
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  // Load emotions on component mount
  useEffect(() => {
    fetchEmotions();
  }, [fetchEmotions]);

  const toggleStatus = async (id: number) => {
    try {
      const response = await fetch(`${SERVER_URL}/${id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to toggle status");
      }
      fetchEmotions();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to toggle status");
      console.error("Error toggling status:", err);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", score: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id: number) => {
    const emotion = emotions.find((e) => e.id === id);
    setModalType("edit");
    setModalForm({
      code: emotion ? emotion.code : "",
      name: emotion ? emotion.name : "",
      score: emotion ? String(emotion.score) : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.score) return;

    try {
      setLoading(true);
      setError("");

      if (modalType === "edit" && editingId) {
        // Update existing emotion
        const response = await fetch(`${SERVER_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: modalForm.name,
            score: Number(modalForm.score),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to update emotion");
        }
        fetchEmotions();
      } else {
        // Create new emotion
        const response = await fetch(`${SERVER_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: modalForm.name,
            code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
            score: Number(modalForm.score),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create emotion");
        }
        const newEmotion = await response.json();
        setEmotions([newEmotion, ...emotions]);
      }
      setShowModal(false);
      setModalForm({ code: "", name: "", score: "" });
      setEditingId(null);
      fetchEmotions();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to save emotion");
      console.error("Error saving emotion:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", score: "" });
    setEditingId(null);
  };

  const filteredEmotions = emotions.filter((e) =>
    e?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredEmotions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredEmotions.slice(startIdx, endIdx);

  // DELETE emotion
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete emotion");
      }
      setEmotions((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
      if (overviewEmotion && overviewEmotion.id === id)
        setOverviewEmotion(null);
      fetchEmotions();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to delete emotion");
      console.error("Error deleting emotion:", err);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (emotion: EmotionData) => {
    setOverviewEmotion(emotion);
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

  if (overviewEmotion) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
        <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Emotion Overview
          </h3>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Emotion Name:</strong>{" "}
            <span className="text-gray-900">{overviewEmotion.name}</span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Emotion Score:</strong>{" "}
            <span className="text-gray-900">{overviewEmotion.score}</span>
          </div>
          <div className="mb-6 text-sm">
            <strong className="text-gray-700">Status:</strong>{" "}
            <span className="text-gray-900">
              {overviewEmotion.status ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setOverviewEmotion(null)}
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
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}
      {loading && !showModal ? (
        <div className="text-center py-12 text-gray-600">
          Loading emotions...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Emotion Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Emotion Score
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
              {paginated.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {e.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{e.code}</div>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {e.score}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={e.status}
                        onChange={() => toggleStatus(e.id)}
                      />
                      <span
                        className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                          e.status ? "bg-[#1ecab8]" : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          e.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Edit"
                        onClick={() => openEdit(e.id)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Overview"
                        onClick={() => handleOverview(e)}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                        title="Delete"
                        onClick={() => setDeleteConfirmId(e.id)}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {modalType === "edit" ? "Edit Emotion" : "Add New Emotion"}
            </h3>
            <form onSubmit={handleModalSubmit}>
              {modalType === "edit" && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-600 text-sm font-medium">
                    Emotion Code
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
                  Emotion Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Emotion Name"
                  autoFocus
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-gray-600 text-sm font-medium">
                  Emotion Score
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.score}
                  name="score"
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Select Emotion Score</option>
                  {EMOTION_SCORES.map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
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
                    ? "Saving..."
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
              Are you sure you want to delete this emotion?
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

export default Emotion;

