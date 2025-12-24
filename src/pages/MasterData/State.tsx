import React, { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  FiDownload,
  FiMaximize2,
  FiFilter,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import API_BASE_URL from "../../config/api";
import { Country as CountryData, State as StateData } from "country-state-city";

const SERVER_URL = `${API_BASE_URL}/states`;

// TypeScript interfaces
interface State {
  id: number;
  state: string;
  country: string;
  status: boolean;
}

interface StateForm {
  name: string;
  countryId: string;
}

interface CountryListItem {
  isoCode: string;
  name: string;
  [key: string]: any;
}

interface StateListItem {
  isoCode: string;
  name: string;
  [key: string]: any;
}

const States: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<StateForm>({ name: "", countryId: "" });

  const [countryStates, setCountryStates] = useState<StateListItem[]>([]);
  const [countries, setCountries] = useState<CountryListItem[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [allStates, setAllStates] = useState<State[]>([]);

  const fetchCountries = async (): Promise<void> => {
    try {
      const res = CountryData.getAllCountries() as CountryListItem[];
      setCountries(res);
    } catch (err) {
      setError("Failed to fetch countries");
      console.error("Error fetching countries:", err);
    }
  };

  const fetchStates = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get<State[]>(SERVER_URL);
      setAllStates(res.data);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to fetch states");
      console.error("Error fetching states:", axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const handleCreateOrUpdate = async (): Promise<void> => {
    const selectedCountryObj = countries.find(
      (c) => c.isoCode === selectedCountry
    );

    if (!selectedCountryObj || !selectedState) {
      setError("Please select both country and state.");
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put<State>(`${SERVER_URL}/${editingId}`, {
          country: selectedCountryObj.name,
          state: selectedState,
        });
      } else {
        await axios.post<State>(SERVER_URL, {
          country: selectedCountryObj.name,
          state: selectedState,
        });
      }

      await fetchStates();
      setShowModal(false);
      setForm({ name: "", countryId: "" });
      setSelectedCountry("");
      setSelectedState("");
      setEditingId(null);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to save state");
      console.error("Error saving state:", axiosError.message);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    try {
      await axios.delete(`${SERVER_URL}/${id}`);
      await fetchStates();
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to delete state");
      console.error("Error deleting state:", axiosError.message);
    }
  };

  const toggleStatus = async (state: State): Promise<void> => {
    try {
      const res = await axios.patch<State>(
        `${SERVER_URL}/${state.id}/toggle-status`
      );
      const data = res.data;

      setAllStates((prev: State[]) =>
        prev.map((p) => (p.id === state.id ? data : p))
      );

      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to toggle status");
      console.error("Error toggling status:", axiosError.message);
    }
  };

  const startEditing = (state: State): void => {
    // Find the country ISO code from the country name
    const country = countries.find((c) => c.name === state.country);
    const countryId = country?.isoCode || "";

    setForm({
      name: state.state,
      countryId: countryId,
    });
    setSelectedCountry(countryId);
    setSelectedState(state.state);
    setEditingId(state.id);

    // Load states for the selected country
    if (countryId) {
      const states = StateData.getStatesOfCountry(countryId) as StateListItem[];
      setCountryStates(states);
    }

    setShowModal(true);
  };

  const filteredStates: State[] = allStates.filter(
    (state) =>
      state.country &&
      state.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntries: number = filteredStates.length;
  const totalPages: number = Math.ceil(totalEntries / pageSize);
  const paginatedStates: State[] = filteredStates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl min-h-screen">
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in-overlay">
          <div className="bg-white p-0 w-[450px] max-w-[90vw] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-modal relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#1ecab8] before:via-[#1bb8a6] before:to-[#1ecab8]">
            <h3 className="text-xl font-bold text-center text-gray-900 m-0 py-6 px-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
              {editingId !== null ? "Edit State" : "Add New State"}
            </h3>

            {/* Country dropdown */}
            <select
              className="py-3.5 px-4 text-[15px] border-2 border-gray-200 rounded-lg my-1.5 mx-6 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#1ecab8] focus:bg-white focus:ring-4 focus:ring-[#1ecab8]/10"
              name="country"
              value={form.countryId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const countryId = e.target.value;
                setSelectedCountry(countryId);
                setForm({ ...form, countryId, name: "" });
                setSelectedState("");
                if (countryId) {
                  const states = StateData.getStatesOfCountry(
                    countryId
                  ) as StateListItem[];
                  setCountryStates(states);
                } else {
                  setCountryStates([]);
                }
              }}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name && country.name.trim() !== ""
                    ? country.name
                    : "(Unnamed Country)"}
                </option>
              ))}
            </select>

            {/* States dropdown */}
            <select
              className="py-3.5 px-4 text-[15px] border-2 border-gray-200 rounded-lg my-1.5 mx-6 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#1ecab8] focus:bg-white focus:ring-4 focus:ring-[#1ecab8]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              value={form.name}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setForm({ ...form, name: e.target.value });
                setSelectedState(e.target.value);
              }}
              required
              disabled={countryStates.length === 0}
            >
              <option value="">Select State</option>
              {countryStates.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 py-5 px-6 pb-6 bg-gray-50 border-t border-gray-200">
              <button
                className="py-3 px-5 text-sm font-medium border-2 border-gray-300 bg-white text-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  setForm({ name: "", countryId: "" });
                  setSelectedCountry("");
                  setSelectedState("");
                  setCountryStates([]);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="py-3 px-6 text-sm font-semibold border-none bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white rounded-lg cursor-pointer transition-all duration-200 shadow-md shadow-[#1ecab8]/20 hover:from-[#1bb8a6] hover:to-[#1aa695] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1ecab8]/30 active:translate-y-0 active:shadow-md active:shadow-[#1ecab8]/20"
                onClick={handleCreateOrUpdate}
              >
                {editingId !== null ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with same design as Countries */}
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
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] transition-all flex-1 min-w-[200px]"
          placeholder="Search states..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            className="bg-[#1ecab8] text-white border-none px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-[#1bb8a6] shadow-sm hover:shadow-md flex items-center gap-1.5"
            onClick={() => {
              setForm({ name: "", countryId: "" });
              setSelectedCountry("");
              setSelectedState("");
              setCountryStates([]);
              setEditingId(null);
              setShowModal(true);
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
      {loading ? (
        <div className="flex justify-center items-center h-[200px] text-base text-gray-600">
          Loading...
        </div>
      ) : (
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                State Name
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Country Name
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
            {paginatedStates.length > 0 ? (
              paginatedStates.map((state) => (
                <tr key={state.id}>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-[#1ecab8] font-medium">
                    {state.state}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-gray-600">
                    {state.country}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.status}
                        onChange={() => toggleStatus(state)}
                        className="sr-only peer"
                      />
                      <span
                        className={`absolute cursor-pointer transition-all duration-[400ms] rounded-full top-0 left-0 right-0 bottom-0 before:content-[''] before:absolute before:h-3.5 before:w-3.5 before:left-0.5 before:bottom-0.5 before:bg-white before:transition-all before:duration-[400ms] before:rounded-full ${
                          state.status
                            ? "bg-[#1ecab8] before:translate-x-4"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <button
                      className="bg-transparent border-none cursor-pointer text-[#1ecab8] transition-all duration-200 hover:text-[#1bb8a6] hover:scale-110"
                      onClick={() => startEditing(state)}
                      title="Edit state"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="bg-transparent border-none cursor-pointer text-red-500 transition-all duration-200 hover:text-red-600 hover:scale-110 ml-2"
                      onClick={() => handleDelete(state.id)}
                      title="Delete state"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-600 italic py-10 px-4"
                >
                  {searchTerm
                    ? "No matching states found"
                    : "No states available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <span className="text-sm text-gray-600">
          {`Showing ${totalEntries === 0 ? 0 : (page - 1) * pageSize + 1} to ${
            page * pageSize > totalEntries ? totalEntries : page * pageSize
          } of ${totalEntries} entries`}
        </span>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <button
            className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default States;

