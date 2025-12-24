import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiGlobe,
  FiHome,
  FiClock,
  FiLock,
  FiBarChart2,
  FiBriefcase,
  FiFileText,
  FiDollarSign,
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

interface InstituteData {
  id: number;
  name: string;
  code?: string | null;
  addressLine1: string;
  addressLine2?: string;
  pinCode: string;
  phoneNumber: string;
  telephoneNumber?: string;
  email: string;
  website?: string;
  status: boolean;
  city?: City;
  state?: State;
  phone?: string;
  telephone?: string;
}

interface InstituteForm {
  name: string;
  code: string | null;
  addressLine1: string;
  addressLine2: string;
  stateId: string | null;
  cityId: string | null;
  pinCode: string;
  phoneNumber: string;
  telephoneNumber: string;
  email: string;
  website: string;
  status: boolean;
  image?: File | null;
}

const defaultForm: InstituteForm = {
  name: "",
  code: null,
  addressLine1: "",
  addressLine2: "",
  stateId: null,
  cityId: null,
  pinCode: "",
  phoneNumber: "",
  telephoneNumber: "",
  email: "",
  website: "",
  status: false,
};

type ViewMode = "list" | "form" | "overview";

const Institute: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedInstitute, setSelectedInstitute] = useState<InstituteData | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const SERVER_URL = `${API_BASE_URL}/institutes`;
  const SERVER_URL_STATES = `${API_BASE_URL}/states`;
  const SERVER_URL_CITIES = `${API_BASE_URL}/cities`;

  const [form, setForm] = useState<InstituteForm>({
    name: "",
    code: null,
    addressLine1: "",
    addressLine2: "",
    stateId: null,
    cityId: null,
    pinCode: "",
    phoneNumber: "",
    telephoneNumber: "",
    email: "",
    website: "",
    status: true,
  });

  const fetchStates = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<State[]>(SERVER_URL_STATES);
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }, [SERVER_URL_STATES]);

  const fetchCities = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get<City[]>(SERVER_URL_CITIES);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }, [SERVER_URL_CITIES]);

  const fetchInstitutes = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<InstituteData[]>(SERVER_URL);
      setInstitutes(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError("Failed to fetch institutes");
      console.error("Error fetching institutes:", axiosError.message);
    } finally {
      setLoading(false);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchStates();
      await fetchCities();
      await fetchInstitutes();
    };
    fetchData();
  }, [fetchStates, fetchCities, fetchInstitutes]);

  const toggleStatus = async (institute: InstituteData): Promise<void> => {
    try {
      await axios.patch(`${SERVER_URL}/${institute.id}/toggle-status`, {
        status: !institute.status,
      });
      await fetchInstitutes();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to toggle status");
      console.error("Error toggling status:", axiosError.message);
    }
  };

  const handleChange = (
    field: keyof InstituteForm,
    value: string | number | boolean | null | File
  ): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "stateId") {
      setForm((prev) => ({ ...prev, cityId: null }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!form.name) {
      setError("Institute name is required");
      return;
    }

    try {
      if (isEdit && editId) {
        await axios.put<InstituteData>(`${SERVER_URL}/${editId}`, form);
      } else {
        await axios.post<InstituteData>(SERVER_URL, form, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setViewMode("list");
      await fetchInstitutes();
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to save institute");
      console.error("Error saving institute:", axiosError.message);
    }
  };

  const handleEdit = (inst: InstituteData): void => {
    setForm({
      name: inst.name || "",
      addressLine1: inst.addressLine1 || "",
      addressLine2: inst.addressLine2 || "",
      cityId: inst.city?.id ? String(inst.city.id) : null,
      stateId: inst.state?.id ? String(inst.state.id) : null,
      pinCode: inst.pinCode || "",
      phoneNumber: inst.phoneNumber || "",
      telephoneNumber: inst.telephoneNumber || "",
      email: inst.email || "",
      website: inst.website || "",
      code: inst.code || null,
      status: inst.status,
      image: null,
    });
    setIsEdit(true);
    setEditId(inst.id);
    setViewMode("form");
    
    // Set selected state for city filtering
    if (inst.state) {
      setSelectedState(inst.state.state);
    }
  };

  const handleCancel = (): void => {
    setViewMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
    setSelectedInstitute(null);
    setSelectedState("");
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${SERVER_URL}/${id}`);
      setViewMode("list");
      setSelectedInstitute(null);
      await fetchInstitutes();
      setDeleteConfirmId(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to delete institute");
      console.error("Error deleting institute:", axiosError.message);
    }
  };

  const handleOverview = (inst: InstituteData): void => {
    setSelectedInstitute(inst);
    setViewMode("overview");
  };

  const filteredInstitutes: InstituteData[] = institutes.filter((inst) =>
    inst.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total: number = filteredInstitutes.length;
  const totalPages: number = Math.ceil(total / pageSize);
  const startIdx: number = (page - 1) * pageSize;
  const endIdx: number = Math.min(startIdx + pageSize, total);
  const paginated: InstituteData[] = filteredInstitutes.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-base text-gray-600">
        Loading institutes...
      </div>
    );
  }

  // --- FORM VIEW ---
  if (viewMode === "form") {
    return (
      <div className="p-4 bg-gray-50 rounded-xl min-h-screen">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span>Institute</span>
          <span className="text-gray-400">&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Institute"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="48" height="48" fill="none" className="text-gray-400">
                    <circle cx="24" cy="24" r="24" fill="#e0e0e0" />
                    <path
                      d="M24 26c3.314 0 6-2.239 6-5s-2.686-5-6-5-6 2.239-6 5 2.686 5 6 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      fill="#bdbdbd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#1bb8a6] mr-2"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Upload
                  </button>
                </label>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                  disabled={!form.image}
                >
                  Reset
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-sm font-semibold text-gray-700">
                Institute
              </legend>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute Name
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Institute Name"
                    value={form.name}
                    required
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Pin Code"
                    value={form.pinCode}
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      handleChange("pinCode", onlyNums);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Address Line 1"
                    value={form.addressLine1}
                    required
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("addressLine1", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Address Line 2"
                    value={form.addressLine2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("addressLine2", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                    <span className="text-red-500"> *</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] bg-white"
                    value={form.stateId || ""}
                    required
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      handleChange("stateId", e.target.value);
                      const selected = states.find(
                        (state) => String(state.id) === String(e.target.value)
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
                    <span className="text-red-500"> *</span>
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.cityId || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange("cityId", e.target.value)
                    }
                    disabled={!form.stateId}
                  >
                    <option value="">Select</option>
                    {cities
                      .filter((city) => String(city.state) === String(selectedState))
                      .map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.city}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-6">
              <legend className="px-2 text-sm font-semibold text-gray-700">
                Contact
              </legend>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Telephone Number"
                    value={form.telephoneNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("telephoneNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website Link
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    placeholder="Website Link"
                    value={form.website}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("website", e.target.value)
                    }
                  />
                </div>
              </div>
            </fieldset>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30"
              >
                {isEdit ? "Update" : "Submit"}
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
  if (viewMode === "overview" && selectedInstitute) {
    const inst = selectedInstitute;
    const tabs = [
      { label: "Overview", icon: FiClock },
      { label: "Security", icon: FiLock },
      { label: "Statics", icon: FiBarChart2 },
      { label: "Branch", icon: FiBriefcase },
      { label: "Plans", icon: FiFileText },
      { label: "Invoice", icon: FiFileText },
      { label: "Bill", icon: FiDollarSign },
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
          <span>Institute</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1ecab8] font-medium">Overview</span>
        </div>

        {/* Institute Summary Card */}
        <div className="bg-white rounded-lg p-6 flex items-center mb-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-6 flex-shrink-0">
            <FiUser size={32} className="text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl text-gray-900 mb-2">
              {inst.name}
            </div>
            <div className="flex items-center gap-6 text-gray-600 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <FiMail size={16} className="text-gray-500" /> {inst.email || "-"}
              </span>
              <span className="flex items-center gap-1.5">
                <FiPhone size={16} className="text-gray-500" /> {inst.phoneNumber || inst.phone || "-"}
              </span>
              {inst.website && (
                <span className="flex items-center gap-1.5">
                  <FiGlobe size={16} className="text-gray-500" /> {inst.website}
                </span>
              )}
            </div>
          </div>
          <button
            className="bg-[#d4f4f0] border-2 border-[#1ecab8] rounded-lg px-4 py-2 text-[#1ecab8] font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:bg-[#c0ede8] hover:border-[#1bb8a6] flex-shrink-0"
            onClick={() => handleEdit(inst)}
          >
            <FiEdit size={16} /> Edit
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
          <div className="font-bold text-base text-gray-800 mb-5">
            Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="text-sm">
              <span className="text-gray-500">Institute Name</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.name}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Institute Code</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.code || inst.id || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Phone Number</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.phoneNumber || inst.phone || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Telephone Number</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.telephoneNumber || inst.telephone || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Address Line 1</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.addressLine1 || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Address Line 2</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.addressLine2 || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">City</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.city?.city || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">State</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.state?.state || "-"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Pin Code</span>
              <span className="text-gray-900 font-medium ml-2">
                : {inst.pinCode || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="p-4 bg-gray-50 rounded-xl min-h-screen">
      {/* Header with same design as Countries/State/City */}
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
          placeholder="Search institutes..."
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
              setSelectedState("");
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
                Institute Name
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Email ID
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
              paginated.map((inst) => (
                <tr key={inst.id}>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <div className="text-[#1ecab8] font-medium">{inst.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{inst.id}</div>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <div className="text-gray-700">{inst.email}</div>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <div className="text-gray-700">
                      {inst.phoneNumber || inst.phone}
                    </div>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-gray-600 whitespace-pre-line">
                    {[
                      inst.addressLine1,
                      inst.addressLine2,
                      inst.city?.city,
                      inst.state?.state,
                      inst.pinCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inst.status}
                        onChange={() => toggleStatus(inst)}
                        className="sr-only peer"
                      />
                      <span
                        className={`absolute cursor-pointer transition-all duration-[400ms] rounded-full top-0 left-0 right-0 bottom-0 before:content-[''] before:absolute before:h-3.5 before:w-3.5 before:left-0.5 before:bottom-0.5 before:bg-white before:transition-all before:duration-[400ms] before:rounded-full ${
                          inst.status
                            ? "bg-[#1ecab8] before:translate-x-4"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-transparent border-none cursor-pointer text-[#1ecab8] transition-all duration-200 hover:text-[#1bb8a6] hover:scale-110"
                        title="Edit"
                        onClick={() => handleEdit(inst)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="bg-transparent border-none cursor-pointer text-[#1ecab8] transition-all duration-200 hover:text-[#1bb8a6] hover:scale-110"
                        title="Overview"
                        onClick={() => handleOverview(inst)}
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        className="bg-transparent border-none cursor-pointer text-red-500 transition-all duration-200 hover:text-red-600 hover:scale-110"
                        title="Delete"
                        onClick={() => setDeleteConfirmId(inst.id)}
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
                  className="text-center text-gray-600 italic py-10 px-4"
                >
                  {searchTerm
                    ? "No matching institutes found"
                    : "No institutes available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <span className="text-sm text-gray-600">
          Showing {total === 0 ? 0 : startIdx + 1} to {endIdx} of {total}{" "}
          entries
        </span>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <button
            className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          <div className="flex items-center gap-2 mx-2">
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = page === pageNum;

              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1) ||
                (page === 1 && pageNum <= 3) ||
                (page === totalPages && pageNum >= totalPages - 2);

              if (!showPage) {
                // Show ellipsis
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={pageNum} className="text-gray-400 text-sm">
                      ...
                    </span>
                  );
                }
                return null;
              }

              if (isActive) {
                return (
                  <button
                    key={pageNum}
                    className="w-8 h-8 rounded-full bg-[#1ecab8] text-white flex items-center justify-center text-sm font-medium shadow-md cursor-pointer transition-all duration-200"
                  >
                    {pageNum}
                  </button>
                );
              }

              return (
                <span
                  key={pageNum}
                  className="text-gray-400 text-sm cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </span>
              );
            })}
          </div>
          <button
            className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in-overlay">
          <div className="bg-white p-0 w-[450px] max-w-[90vw] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-modal relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#1ecab8] before:via-[#1bb8a6] before:to-[#1ecab8]">
            <div className="p-6 text-gray-900">
              Are you sure you want to delete this institute?
            </div>
            <div className="flex justify-end gap-3 py-5 px-6 pb-6 bg-gray-50 border-t border-gray-200">
              <button
                className="py-3 px-5 text-sm font-medium border-2 border-gray-300 bg-white text-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="py-3 px-6 text-sm font-semibold border-none bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
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

export default Institute;

