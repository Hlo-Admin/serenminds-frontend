import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import axios, { AxiosError } from "axios";
import API_BASE_URL from "../../config/api";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// TypeScript interfaces
interface Emotion {
  id: number;
  name: string;
  code?: string;
}

interface ZoneData {
  id: number;
  code: string;
  name: string;
  description: string;
  emotionId: number;
  status: boolean;
  emotion?: Emotion;
}

interface ZoneForm {
  code: string;
  name: string;
  description: string;
  emotionId: string;
}

const Zone: React.FC = () => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [modalForm, setModalForm] = useState<ZoneForm>({
    code: "",
    name: "",
    description: "",
    emotionId: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [overviewZone, setOverviewZone] = useState<ZoneData | null>(null);

  const SERVER_URL = `${API_BASE_URL}/zones`;
  const SERVER_URL_EMOTIONS = `${API_BASE_URL}/emotions`;

  // Fetch zones from API
  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}`);
      if (!response.status) {
        throw new Error("Failed to fetch zones");
      }
      const data = await response.data;
      setZones(data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch zones");
      console.error("Error fetching zones:", err);
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

  // Load data on component mount
  useEffect(() => {
    fetchZones();
    fetchEmotions();
  }, [fetchZones, fetchEmotions]);

  const toggleStatus = async (id: number) => {
    try {
      const response = await axios.patch(`${SERVER_URL}/${id}/toggle-status`);
      if (!response.status) {
        throw new Error("Failed to toggle status");
      }
      const data = await response.data;
      setZones((prev) => prev.map((p) => (p.id === id ? data : p)));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to toggle status");
      console.error("Error toggling status:", err);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", description: "", emotionId: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id: number) => {
    const zone = zones.find((z) => z.id === id);
    setModalType("edit");
    setModalForm({
      code: zone ? zone.code : "",
      name: zone ? zone.name : "",
      description: zone ? zone.description : "",
      emotionId: zone ? String(zone.emotionId) : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.emotionId) return;

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        const res = await axios.put(`${SERVER_URL}/${editingId}`, {
          name: modalForm.name,
          description: modalForm.description,
          emotionId: Number(modalForm.emotionId),
        });

        if (!res.status) {
          throw new Error(`Failed to update zone`);
        }
        fetchZones();
      } else {
        const res = await axios.post(`${SERVER_URL}`, {
          name: modalForm.name,
          description: modalForm.description,
          emotionId: Number(modalForm.emotionId),
        });

        console.log(res.data);
        fetchZones();

        if (!res.status) {
          throw new Error(`Failed to create zone`);
        }
      }

      setShowModal(false);
      setModalForm({ code: "", name: "", description: "", emotionId: "" });
      setEditingId(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to save zone");
      console.error(`Error creating a zone:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", description: "", emotionId: "" });
    setEditingId(null);
  };

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredZones.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredZones.slice(startIdx, endIdx);

  // DELETE zone
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete zone");
      }

      fetchZones();
      setDeleteConfirmId(null);
      if (overviewZone && overviewZone.id === id) setOverviewZone(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to delete zone");
      console.error("Error deleting zone:", err);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (zone: ZoneData) => {
    setOverviewZone(zone);
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

  if (overviewZone) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
        <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Zone Overview
          </h3>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Zone Name:</strong>{" "}
            <span className="text-gray-900">{overviewZone.name}</span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Zone Description:</strong>{" "}
            <span className="text-gray-900">{overviewZone.description}</span>
          </div>
          <div className="mb-4 text-sm">
            <strong className="text-gray-700">Emotion:</strong>{" "}
            <span className="text-gray-900">
              {overviewZone.emotion ? overviewZone.emotion.name : ""}
            </span>
          </div>
          <div className="mb-6 text-sm">
            <strong className="text-gray-700">Status:</strong>{" "}
            <span className="text-gray-900">
              {overviewZone.status ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-6 py-2 border-2 border-gray-300 bg-white text-gray-600 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
              onClick={() => setOverviewZone(null)}
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
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading zones...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Zone Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Emotion
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                  Zone Description
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
              {paginated.map((z) => {
                const emotion = z.emotion;
                return (
                  <tr key={z.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-sm text-gray-900">
                        {z.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {z.code}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-sm text-gray-900">
                        {emotion ? emotion.name : ""}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {emotion ? emotion.code : ""}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100 font-medium text-sm text-gray-900">
                      {z.description}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <label className="relative inline-block w-9 h-5 cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={z.status}
                          onChange={() => toggleStatus(z.id)}
                        />
                        <span
                          className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                            z.status ? "bg-[#1ecab8]" : "bg-gray-300"
                          }`}
                        ></span>
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                            z.status ? "translate-x-4" : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                          title="Edit"
                          onClick={() => openEdit(z.id)}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                          title="Overview"
                          onClick={() => handleOverview(z)}
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                          title="Delete"
                          onClick={() => setDeleteConfirmId(z.id)}
                        >
                          <FiTrash2 size={16} />
                        </button>
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
              {modalType === "edit" ? "Edit Zone" : "Add New Zone"}
            </h3>
            <form onSubmit={handleModalSubmit}>
              {modalType === "edit" && (
                <div className="mb-4">
                  <label className="block mb-2 text-gray-600 text-sm font-medium">
                    Zone Code
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
                  Zone Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Zone Name"
                  autoFocus
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-600 text-sm font-medium">
                  Zone Description
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                  value={modalForm.description}
                  name="description"
                  onChange={handleModalChange}
                  placeholder="Zone Description"
                />
              </div>
              <div className="mb-6">
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
                  <option value="">Emotion Name</option>
                  {emotions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                {modalType === "edit" && (
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed"
                    disabled
                  >
                    Description
                  </button>
                )}
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
              Are you sure you want to delete this zone?
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

export default Zone;

