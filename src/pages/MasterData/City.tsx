import React, { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  FiEdit,
  FiDownload,
  FiMaximize2,
  FiFilter,
  FiTrash2,
} from "react-icons/fi";
import API_BASE_URL from "../../config/api";
import {
  Country as CountryData,
  State as StateData,
  City as CityData,
} from "country-state-city";

const SERVER_URL = `${API_BASE_URL}/cities`;

// TypeScript interfaces
interface City {
  id: number;
  city: string;
  state: string;
  country: string;
  status: boolean;
  cityName?: string;
  stateId?: string;
  countryId?: string;
}

interface CityForm {
  cityName: string;
  stateId: string;
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

interface CityListItem {
  name: string;
  [key: string]: any;
}

const Cities: React.FC = () => {
  const [countries, setCountries] = useState<CountryListItem[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<CityForm>({
    cityName: "",
    stateId: "",
    countryId: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [stateCities, setStateCities] = useState<CityListItem[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [countryStates, setCountryStates] = useState<StateListItem[]>([]);

  const selectedCountryObj = countries.find(
    (c) => c.isoCode === form.countryId
  );
  const selectedStateObj = countryStates.find(
    (s) => s.isoCode === form.stateId
  );
  const selectedCityObj = stateCities.find((c) => c.name === form.cityName);

  const countryName = selectedCountryObj ? selectedCountryObj.name : "";
  const stateName = selectedStateObj ? selectedStateObj.name : "";
  const cityName = selectedCityObj ? selectedCityObj.name : "";

  const fetchCities = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios.get<City[]>(SERVER_URL);
      setCities(res.data);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to fetch cities");
      console.error("Error fetching cities:", axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async (): Promise<void> => {
    try {
      const res = CountryData.getAllCountries() as CountryListItem[];
      setCountries(res);
    } catch (err) {
      setError("Failed to fetch countries");
      console.error("Error fetching countries:", err);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  const handleCreateOrUpdate = async (): Promise<void> => {
    if (!form.cityName || !form.stateId || !form.countryId) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put<City>(`${SERVER_URL}/${editingId}`, {
          country: countryName,
          state: stateName,
          city: cityName,
        });
      } else {
        await axios.post<City>(SERVER_URL, {
          country: countryName,
          state: stateName,
          city: cityName,
        });
      }
      await fetchCities();
      setShowModal(false);
      setForm({ cityName: "", stateId: "", countryId: "" });
      setSelectedCountry("");
      setSelectedState("");
      setCountryStates([]);
      setStateCities([]);
      setEditingId(null);
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data && typeof axiosError.response.data === "object"
          ? (axiosError.response.data as { error?: string }).error ||
            axiosError.message
          : axiosError.message;
      setError("Failed to save city: " + errorMessage);
      console.error("Save city error:", axiosError);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await axios.delete(`${SERVER_URL}/${id}`);
      await fetchCities();
      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to delete city");
      console.error("Error deleting city:", axiosError.message);
    }
  };

  const toggleStatus = async (city: City): Promise<void> => {
    try {
      const res = await axios.patch<City>(
        `${SERVER_URL}/${city.id}/toggle-status`
      );
      const data = res.data;

      setCities((prev: City[]) =>
        prev.map((p) => (p.id === city.id ? data : p))
      );

      setError("");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError("Failed to toggle status");
      console.error("Error toggling status:", axiosError.message);
    }
  };

  const startEditing = (city: City): void => {
    // Find country and state ISO codes
    const country = countries.find((c) => c.name === city.country);
    const countryId = country?.isoCode || "";

    let stateId = "";
    let state: StateListItem | undefined;

    if (countryId) {
      const states = StateData.getStatesOfCountry(countryId) as StateListItem[];
      setCountryStates(states);
      state = states.find((s) => s.name === city.state);
      stateId = state?.isoCode || "";

      if (stateId) {
        const cities = CityData.getCitiesOfState(
          countryId,
          stateId
        ) as CityListItem[];
        setStateCities(cities);
      }
    }

    setForm({
      cityName: city.city,
      stateId: stateId,
      countryId: countryId,
    });
    setSelectedCountry(countryId);
    setSelectedState(stateId);
    setEditingId(city.id);
    setShowModal(true);
  };

  const filteredCities: City[] = cities.filter(
    (city) =>
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.state &&
        city.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (city.country &&
        city.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEntries: number = filteredCities.length;
  const totalPages: number = Math.ceil(totalEntries / pageSize);
  const paginatedCities: City[] = filteredCities.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl min-h-screen">
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in-overlay">
          <div className="bg-white p-0 w-[450px] max-w-[90vw] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-modal relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[#1ecab8] before:via-[#1bb8a6] before:to-[#1ecab8]">
            <h3 className="text-xl font-bold text-center text-gray-900 m-0 py-6 px-6 pb-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
              {editingId !== null ? "Edit City" : "Add New City"}
            </h3>

            {/* Country dropdown */}
            <select
              className="py-3.5 px-4 text-[15px] border-2 border-gray-200 rounded-lg my-1.5 mx-6 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#1ecab8] focus:bg-white focus:ring-4 focus:ring-[#1ecab8]/10"
              name="country"
              value={form.countryId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const countryId = e.target.value;
                setSelectedCountry(countryId);
                setForm({ ...form, countryId, stateId: "", cityName: "" });
                setSelectedState("");
                setStateCities([]);
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

            {/* State dropdown */}
            <select
              className="py-3.5 px-4 text-[15px] border-2 border-gray-200 rounded-lg my-1.5 mx-6 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#1ecab8] focus:bg-white focus:ring-4 focus:ring-[#1ecab8]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              name="state"
              value={form.stateId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const stateId = e.target.value;
                setForm({ ...form, stateId, cityName: "" });
                setSelectedState(stateId);
                if (stateId) {
                  const selectedStateObj = countryStates.find(
                    (state) => state.isoCode === stateId
                  );
                  if (selectedStateObj) {
                    const cities = CityData.getCitiesOfState(
                      selectedCountry,
                      selectedStateObj.isoCode
                    ) as CityListItem[];
                    setStateCities(cities);
                  } else {
                    setStateCities([]);
                  }
                } else {
                  setStateCities([]);
                }
              }}
              required
              disabled={countryStates.length === 0}
            >
              <option value="">Select State</option>
              {countryStates.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>

            {/* City dropdown */}
            <select
              className="py-3.5 px-4 text-[15px] border-2 border-gray-200 rounded-lg my-1.5 mx-6 transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#1ecab8] focus:bg-white focus:ring-4 focus:ring-[#1ecab8]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              name="city"
              value={form.cityName}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, cityName: e.target.value })
              }
              required
              disabled={stateCities.length === 0}
            >
              <option value="">Select City</option>
              {stateCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            {error && (
              <div className="mx-6 mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 py-5 px-6 pb-6 bg-gray-50 border-t border-gray-200">
              <button
                className="py-3 px-5 text-sm font-medium border-2 border-gray-300 bg-white text-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  setForm({ cityName: "", stateId: "", countryId: "" });
                  setSelectedCountry("");
                  setSelectedState("");
                  setCountryStates([]);
                  setStateCities([]);
                  setEditingId(null);
                  setError("");
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

      {/* Header with same design as Countries/State */}
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
          placeholder="Search cities..."
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
              setForm({ cityName: "", stateId: "", countryId: "" });
              setSelectedCountry("");
              setSelectedState("");
              setCountryStates([]);
              setStateCities([]);
              setEditingId(null);
              setShowModal(true);
              setError("");
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

      {error && !showModal && (
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
                City Name
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                State
              </th>
              <th className="p-4 text-left border-b border-gray-200 text-sm bg-gray-50 font-semibold text-gray-700">
                Country
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
            {paginatedCities.length > 0 ? (
              paginatedCities.map((city) => (
                <tr key={city.id}>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-[#1ecab8] font-medium">
                    {city.city}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-gray-600">
                    {city.state}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm text-gray-600">
                    {city.country}
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <label className="relative inline-block w-9 h-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={city.status}
                        onChange={() => toggleStatus(city)}
                        className="sr-only peer"
                      />
                      <span
                        className={`absolute cursor-pointer transition-all duration-[400ms] rounded-full top-0 left-0 right-0 bottom-0 before:content-[''] before:absolute before:h-3.5 before:w-3.5 before:left-0.5 before:bottom-0.5 before:bg-white before:transition-all before:duration-[400ms] before:rounded-full ${
                          city.status
                            ? "bg-[#1ecab8] before:translate-x-4"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className="p-4 text-left border-b border-gray-200 text-sm">
                    <button
                      className="bg-transparent border-none cursor-pointer text-[#1ecab8] transition-all duration-200 hover:text-[#1bb8a6] hover:scale-110"
                      onClick={() => startEditing(city)}
                      title="Edit city"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="bg-transparent border-none cursor-pointer text-red-500 transition-all duration-200 hover:text-red-600 hover:scale-110 ml-2"
                      onClick={() => handleDelete(city.id)}
                      title="Delete city"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-600 italic py-10 px-4"
                >
                  {searchTerm
                    ? "No matching cities found"
                    : "No cities available"}
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

export default Cities;

