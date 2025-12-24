import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface AcademicYear {
  id: number;
  year: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "upcoming";
  totalStudents: number;
  totalClasses: number;
}

const AcademicYear: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/academicyears`);
        if (response.data) {
          const transformedYears: AcademicYear[] = response.data.map(
            (y: any) => ({
              id: y.id,
              year: y.year || "",
              startDate: y.startDate || "",
              endDate: y.endDate || "",
              status: y.status
                ? "active"
                : ("inactive" as "active" | "inactive" | "upcoming"),
              totalStudents: y.totalStudents || 0,
              totalClasses: y.totalClasses || 0,
            })
          );
          setAcademicYears(transformedYears);
        }
      } catch (error) {
        console.error("Error fetching academic years:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicYears();
  }, []);

  const filteredAcademicYears = academicYears.filter(
    (year) =>
      year.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      year.endDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAcademicYears.length / pageSize);
  const paginatedAcademicYears = filteredAcademicYears.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Year
          </h1>
          <p className="text-gray-600">Manage academic year settings</p>
        </div>
        <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] flex items-center gap-2">
          <FiPlus size={18} />
          Add Academic Year
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search academic years..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          Loading academic years...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAcademicYears.map((year) => (
              <div
                key={year.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1ecab8] bg-opacity-10 flex items-center justify-center">
                      <FiCalendar className="text-[#1ecab8]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {year.year}
                      </h3>
                    </div>
                  </div>
                  {year.status === "active" && (
                    <FiCheckCircle className="text-green-600" size={24} />
                  )}
                </div>
                <div className="space-y-3 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Start Date: </span>
                    <span className="font-medium text-gray-900">
                      {year.startDate}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">End Date: </span>
                    <span className="font-medium text-gray-900">
                      {year.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-600">Students</div>
                      <div className="text-lg font-bold text-gray-900">
                        {year.totalStudents}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Classes</div>
                      <div className="text-lg font-bold text-gray-900">
                        {year.totalClasses}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      year.status
                    )}`}
                  >
                    {year.status.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-[#1ecab8] hover:bg-[#1ecab8] hover:bg-opacity-10 rounded-lg">
                      <FiEdit size={16} />
                    </button>
                    {year.status !== "active" && (
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, filteredAcademicYears.length)} of{" "}
                {filteredAcademicYears.length} academic years
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AcademicYear;
