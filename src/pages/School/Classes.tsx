import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiBook, FiX, FiEye, FiSearch } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface ClassData {
  id: number;
  className: string;
  classCode: string;
  totalStudents: number;
  totalDivisions: number;
  classTeacher: string;
  status: string;
}

const getInitialClasses = (): ClassData[] => [
  {
    id: 1,
    className: "Class 9",
    classCode: "CLS009",
    totalStudents: 120,
    totalDivisions: 4,
    classTeacher: "Mrs. Smith",
    status: "active",
  },
  {
    id: 2,
    className: "Class 10",
    classCode: "CLS010",
    totalStudents: 145,
    totalDivisions: 5,
    classTeacher: "Mr. Johnson",
    status: "active",
  },
  {
    id: 3,
    className: "Class 11",
    classCode: "CLS011",
    totalStudents: 138,
    totalDivisions: 5,
    classTeacher: "Ms. Williams",
    status: "active",
  },
  {
    id: 4,
    className: "Class 12",
    classCode: "CLS012",
    totalStudents: 132,
    totalDivisions: 4,
    classTeacher: "Mr. Brown",
    status: "active",
  },
];

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    school: "",
    schoolCode: "",
    status: true,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/classes`);
        if (response.data) {
          const transformedClasses: ClassData[] = response.data.map((c: any) => ({
            id: c.id,
            className: c.name,
            classCode: c.code || "",
            totalStudents: c.totalStudents || 0,
            totalDivisions: c.totalDivisions || 0,
            classTeacher: "", // Would need teacher assignment
            status: c.status ? "active" : "inactive",
          }));
          setClasses(transformedClasses);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.classCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / pageSize);
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAdd = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      code: `CLS${String(classes.length + 1).padStart(3, "0")}`,
      school: "",
      schoolCode: "",
      status: true,
    });
    setShowForm(true);
  };

  const handleEdit = (classItem: ClassData) => {
    setIsEdit(true);
    setSelectedClass(classItem);
    setFormData({
      name: classItem.className,
      code: classItem.classCode,
      school: "",
      schoolCode: "",
      status: classItem.status === "active",
    });
    setShowForm(true);
  };

  const handleView = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setShowView(true);
  };

  const handleDelete = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedClass) {
      try {
        await axios.delete(`${API_BASE_URL}/classes/${selectedClass.id}`);
        setClasses(classes.filter((c) => c.id !== selectedClass.id));
        setShowDeleteConfirm(false);
        setSelectedClass(null);
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selectedClass) {
        const response = await axios.put(`${API_BASE_URL}/classes/${selectedClass.id}`, formData);
        if (response.data) {
          const updatedClass: ClassData = {
            id: response.data.id,
            className: response.data.name,
            classCode: response.data.code || "",
            totalStudents: 0,
            totalDivisions: 0,
            classTeacher: "",
            status: response.data.status ? "active" : "inactive",
          };
          setClasses(classes.map((c) => (c.id === selectedClass.id ? updatedClass : c)));
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/classes`, formData);
        if (response.data) {
          const newClass: ClassData = {
            id: response.data.id,
            className: response.data.name,
            classCode: response.data.code || "",
            totalStudents: 0,
            totalDivisions: 0,
            classTeacher: "",
            status: response.data.status ? "active" : "inactive",
          };
          setClasses([...classes, newClass]);
        }
      }
      setShowForm(false);
      setFormData({
        name: "",
        code: "",
        school: "",
        schoolCode: "",
        status: true,
      });
      setSelectedClass(null);
    } catch (error) {
      console.error("Error saving class:", error);
      alert("Failed to save class. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
          <p className="text-gray-600">Manage school classes and divisions</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] flex items-center gap-2"
        >
          <FiPlus size={18} />
          Add Class
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes by name or code..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          Loading classes...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedClasses.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{classItem.className}</h3>
                <p className="text-sm text-gray-500">{classItem.classCode}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {classItem.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUsers size={18} />
                <span className="text-sm">{classItem.totalStudents} Students</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiBook size={18} />
                <span className="text-sm">{classItem.totalDivisions} Divisions</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Class Teacher: </span>
                <span className="text-sm font-medium text-gray-900">{classItem.classTeacher}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleView(classItem)}
                className="flex-1 px-4 py-2 border border-[#1ecab8] text-[#1ecab8] rounded-lg hover:bg-[#1ecab8] hover:bg-opacity-10 flex items-center justify-center gap-2"
              >
                <FiEye size={16} />
                View
              </button>
              <button
                onClick={() => handleEdit(classItem)}
                className="flex-1 px-4 py-2 border border-[#1ecab8] text-[#1ecab8] rounded-lg hover:bg-[#1ecab8] hover:bg-opacity-10 flex items-center justify-center gap-2"
              >
                <FiEdit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(classItem)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
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
                {Math.min(page * pageSize, filteredClasses.length)} of{" "}
                {filteredClasses.length} classes
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Class" : "Add New Class"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Code *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8] disabled:bg-gray-50"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8]/20 focus:border-[#1ecab8]"
                    value={formData.status ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === "active" })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] font-medium"
                >
                  {isEdit ? "Update" : "Add"} Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Class Details</h2>
              <button
                onClick={() => {
                  setShowView(false);
                  setSelectedClass(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Class Name</label>
                <div className="font-medium text-gray-900">{selectedClass.className}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Class Code</label>
                <div className="font-medium text-gray-900">{selectedClass.classCode}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Total Students</label>
                <div className="font-medium text-gray-900">{selectedClass.totalStudents}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Total Divisions</label>
                <div className="font-medium text-gray-900">{selectedClass.totalDivisions}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Class Teacher</label>
                <div className="font-medium text-gray-900">{selectedClass.classTeacher}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {selectedClass.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleEdit(selectedClass);
                  setShowView(false);
                }}
                className="flex-1 px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowView(false);
                  setSelectedClass(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Class</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedClass.className}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedClass(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;

