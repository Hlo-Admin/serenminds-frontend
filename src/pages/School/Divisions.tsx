import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiSearch } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface Division {
  id: number;
  divisionName: string;
  className: string;
  classCode: string;
  totalStudents: number;
  classTeacher: string;
  status: string;
}

const Divisions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/divisions`);
        if (response.data) {
          const transformedDivisions: Division[] = response.data.map((d: any) => ({
            id: d.id,
            divisionName: d.name || "",
            className: d.class || "",
            classCode: d.classCode || "",
            totalStudents: d.totalStudents || 0,
            classTeacher: "", // Would need teacher assignment
            status: d.status ? "active" : "inactive",
          }));
          setDivisions(transformedDivisions);
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, []);

  const filteredDivisions = divisions.filter(
    (div) =>
      div.divisionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      div.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDivisions.length / pageSize);
  const paginatedDivisions = filteredDivisions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Divisions</h1>
          <p className="text-gray-600">Manage class divisions</p>
        </div>
        <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] flex items-center gap-2">
          <FiPlus size={18} />
          Add Division
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search divisions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          Loading divisions...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDivisions.map((division) => (
          <div key={division.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{division.divisionName}</h3>
                <p className="text-sm text-gray-500">{division.className}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {division.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers size={16} />
                <span className="text-sm">{division.totalStudents} Students</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Class Teacher: </span>
                <span className="font-medium text-gray-900">{division.classTeacher}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 border border-[#1ecab8] text-[#1ecab8] rounded-lg hover:bg-[#1ecab8] hover:bg-opacity-10 flex items-center justify-center gap-2">
                <FiEdit size={16} />
                Edit
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, filteredDivisions.length)} of{" "}
                {filteredDivisions.length} divisions
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

export default Divisions;

