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
  name?: string;
}

interface Institute {
  id: number;
  name: string;
  code?: string | null;
}

interface BranchData {
  id: number;
  name: string;
  code?: string;
  branchName?: string;
  branchCode?: string;
  instituteCode: string;
  instituteName: string;
  cityId: number | null;
  stateId: number | null;
  address1: string;
  address2?: string;
  pincode: string;
  phone: string;
  telephone?: string;
  email: string;
  website?: string;
  status: boolean;
  city?: City;
  state?: State;
}

interface BranchForm {
  name: string;
  code: string;
  instituteCode: string | null;
  instituteName: string;
  cityId: string | null;
  stateId: string | null;
  address1: string;
  address2: string;
  pincode: string;
  phone: string;
  telephone: string;
  email: string;
  website: string;
  status: boolean;
}

type ViewMode = "list" | "form" | "overview";

const defaultForm: BranchForm = {
  name: "",
  code: "",
  instituteCode: null,
  instituteName: "",
  cityId: null,
  stateId: null,
  address1: "",
  address2: "",
  pincode: "",
  phone: "",
  telephone: "",
  email: "",
  website: "",
  status: true,
};

const BranchOverview: React.FC<{
  branch: BranchData;
  onEdit: () => void;
  onBack: () => void;
}> = ({ branch, onEdit, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const tabs = [
    { label: "Overview", icon: FiClock },
    { label: "Security", icon: FiLock },
    { label: "History", icon: FiClock },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <FiHome size={17} /> Home
        </span>
        <span className="text-gray-400">&gt;</span>
        <span>Branch</span>
        <span className="text-gray-400">&gt;</span>
        <span className="text-[#1ecab8] font-medium">Overview</span>
      </div>

      {/* Branch Summary Card */}
      <div className="bg-white rounded-lg p-6 flex items-center mb-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-6 flex-shrink-0">
          <FiUser size={32} className="text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xl text-gray-900 mb-2">
            {branch.branchName || branch.name}
          </div>
        </div>
        <button
          className="bg-[#d4f4f0] border-2 border-[#1ecab8] rounded-lg px-4 py-2 text-[#1ecab8] font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-[#c0ede8] hover:border-[#1bb8a6] flex-shrink-0"
          onClick={onEdit}
        >
          <FiEdit size={16} /> Edit
        </button>
        <button
          className="bg-gray-100 border-2 border-gray-200 rounded-lg px-4 py-2 text-gray-600 font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:border-gray-300 flex-shrink-0 ml-3"
          onClick={onBack}
        >
          Back
        </button>
      </div>

      {/* Sub-navigation Tabs */}
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

      {/* Details Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="font-bold text-base text-gray-800 mb-5">Details</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <div className="text-sm">
            <span className="text-gray-500">Branch Name</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.branchName || branch.name || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Branch Code</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.branchCode || branch.code || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Institute Name</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.instituteName || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Institute Code</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.instituteCode || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Phone Number</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.phone || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Email Address</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.email || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Address Line 1</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.address1 || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Address Line 2</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.address2 || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">City</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.city?.city || branch.city?.name || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">State</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.state?.state || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Pin Code</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.pincode || "-"}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Website</span>
            <span className="text-gray-900 font-medium ml-2">
              : {branch.website || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Branch: React.FC = () => {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // CRUD state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);

  const [selectedState, setSelectedState] = useState<string>("");

  const [form, setForm] = useState<BranchForm>(defaultForm);

  const SERVER_URL = `${API_BASE_URL}/branches`;
  const SERVER_URL_INSTITUTES = `${API_BASE_URL}/institutes`;
  const SERVER_URL_STATES = `${API_BASE_URL}/states`;
  const SERVER_URL_CITIES = `${API_BASE_URL}/cities`;

  const fetchInstitutes = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL_INSTITUTES}`);
      setInstitutes(res.data);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setError("Failed to fetch institutes");
    }
  }, [SERVER_URL_INSTITUTES]);

  const fetchCities = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL_CITIES}`);
      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setError("Failed to fetch cities");
    }
  }, [SERVER_URL_CITIES]);

  const fetchStates = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL_STATES}`);
      setStates(res.data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setError("Failed to fetch states");
    }
  }, [SERVER_URL_STATES]);

  const fetchAllBranches = useCallback(async () => {
    try {
      const res = await axios.get(`${SERVER_URL}`);
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setError("Failed to fetch branches");
    }
  }, [SERVER_URL]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCities(),
        fetchStates(),
        fetchInstitutes(),
        fetchAllBranches(),
      ]);
    };
    fetchData();
  }, [fetchCities, fetchStates, fetchInstitutes, fetchAllBranches]);

  // Toggle status
  const toggleStatus = async (id: number) => {
    try {
      const branch = branches.find((b) => b.id === id);
      if (!branch) return;

      await axios.patch(`${SERVER_URL}/${id}/toggle-status`, {
        status: !branch.status,
      });
      fetchAllBranches();
    } catch (error) {
      console.error("Error toggling status:", error);
      setError("Failed to toggle status");
    }
  };

  // Form handlers
  const handleChange = (field: keyof BranchForm, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.instituteName) {
      setError("Institute is required");
      return;
    }
    if (!form.name) {
      setError("Branch name is required");
      return;
    }

    const payload = {
      name: form.name,
      code: form.code || "1",
      instituteCode: form.instituteCode,
      instituteName: form.instituteName,
      cityId: form.cityId ? Number(form.cityId) : null,
      stateId: form.stateId ? Number(form.stateId) : null,
      address1: form.address1,
      address2: form.address2,
      pincode: form.pincode,
      phone: form.phone,
      telephone: form.telephone,
      email: form.email,
      website: form.website,
      status: true,
    };

    try {
      if (isEdit && editId) {
        await axios.put(`${SERVER_URL}/${editId}`, payload);
      } else {
        await axios.post(`${SERVER_URL}`, payload);
      }
      fetchAllBranches();
      setViewMode("list");
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
      setSelectedBranch(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(axiosError.message || "Failed to save branch");
    }
  };

  const handleEdit = (branch: BranchData) => {
    setForm({
      name: branch.name,
      code: branch.code || "",
      instituteCode: branch.instituteCode,
      instituteName: branch.instituteName,
      cityId: branch.cityId ? String(branch.cityId) : null,
      stateId: branch.stateId ? String(branch.stateId) : null,
      address1: branch.address1,
      address2: branch.address2 || "",
      pincode: branch.pincode,
      phone: branch.phone,
      telephone: branch.telephone || "",
      email: branch.email,
      website: branch.website || "",
      status: branch.status,
    });
    setIsEdit(true);
    setEditId(branch.id);
    setViewMode("form");
  };

  const handleOverview = (branch: BranchData) => {
    setSelectedBranch(branch);
    setViewMode("overview");
  };

  const handleCancel = () => {
    setViewMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
    setSelectedBranch(null);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${SERVER_URL}/${id}`);
      fetchAllBranches();
      setDeleteConfirmId(null);
      setForm(defaultForm);
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting branch:", error);
      setError("Failed to delete branch");
    }
  };

  // Filter and paginate
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.instituteName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = filteredBranches.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBranches.slice(startIdx, endIdx);

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
          <span>Branch</span>
          <span className="text-gray-400">&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>

        <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            {isEdit ? "Edit" : "Create"} Branch
          </h3>
          <form onSubmit={handleFormSubmit} noValidate>
            <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
              <legend className="text-base font-semibold text-gray-700 px-2 mb-4">
                Institute Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.instituteCode || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("instituteCode", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.instituteName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("instituteName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
              <legend className="text-base font-semibold text-gray-700 px-2 mb-4">
                Branch Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEdit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                      value={form.code}
                      disabled
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("name", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.address1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("address1", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.address2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("address2", e.target.value)
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleChange("stateId", e.target.value);
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
                    value={form.cityId || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange("cityId", e.target.value)
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
                    type="text"
                    pattern="\d{6}"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.pincode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      handleChange("pincode", onlyNums);
                    }}
                    required
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="border border-gray-200 p-6 rounded-lg mb-6">
              <legend className="text-base font-semibold text-gray-700 px-2 mb-4">
                Contact Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    pattern="\d{10}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("phone", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.telephone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("telephone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website Link
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={form.website}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("website", e.target.value)
                    }
                  />
                </div>
              </div>
            </fieldset>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30"
                disabled={loading}
              >
                {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
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
  if (viewMode === "overview" && selectedBranch) {
    return (
      <BranchOverview
        branch={selectedBranch}
        onEdit={() => handleEdit(selectedBranch)}
        onBack={handleCancel}
      />
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header with same design as Countries/State/City/Institute */}
      <div className="flex items-center gap-3 mb-4 flex-wrap bg-gray-50 p-4 rounded-lg">
        {/* Page Size Selector */}
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

        {/* Search Input */}
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] transition-all flex-1 min-w-[200px]"
          placeholder="Search by branch or institute..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            className="bg-[#1ecab8] text-white border-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-[#1bb8a6] shadow-sm hover:shadow-md flex items-center gap-1.5"
            onClick={() => {
              setViewMode("form");
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
        <div className="flex justify-center items-center h-[200px] text-base text-red-600 bg-red-100 border border-red-200 rounded-lg p-4 my-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Branch Name
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Institute
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Phone Number
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Address
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
              paginated.map((branch) => (
                <tr
                  key={branch.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {branch.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {branch.code}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="font-semibold text-sm text-gray-900">
                      {branch.instituteName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {branch.instituteCode}
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700">
                    {branch.phone}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-700 whitespace-pre-line">
                    {[
                      branch.address1,
                      branch.address2,
                      branch.city?.city || branch.city?.name,
                      branch.state?.state,
                      branch.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={branch.status}
                        onChange={() => toggleStatus(branch.id)}
                      />
                      <span
                        className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                          branch.status
                            ? "bg-[#1ecab8]"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          branch.status ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Edit"
                        onClick={() => handleEdit(branch)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 text-[#1ecab8] hover:text-[#1bb8a6] transition-colors rounded"
                        title="Overview"
                        onClick={() => handleOverview(branch)}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                        title="Delete"
                        onClick={() => setDeleteConfirmId(branch.id)}
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
                  colSpan={6}
                  className="p-8 text-center text-gray-500 text-sm"
                >
                  No branches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in-overlay">
          <div className="bg-white rounded-xl p-8 min-w-[380px] max-w-[96vw] shadow-xl animate-slide-in-modal">
            <div className="text-base text-gray-800 mb-6">
              Are you sure you want to delete this branch?
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

export default Branch;

