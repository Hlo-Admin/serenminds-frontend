import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";
import axios from "axios";

interface FormData {
  name: string;
  studentId: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  schoolId: string;
  classId: string;
  divisionId: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  schoolId?: string;
  classId?: string;
  divisionId?: string;
  submit?: string;
}

interface School {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
  code?: string;
}

interface Division {
  id: number;
  name: string;
  class?: string;
  classCode?: string;
}

const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    schoolId: "",
    classId: "",
    divisionId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [allDivisions, setAllDivisions] = useState<Division[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [loadingSchools, setLoadingSchools] = useState<boolean>(true);
  const [loadingClasses, setLoadingClasses] = useState<boolean>(false);
  const [loadingDivisions, setLoadingDivisions] = useState<boolean>(false);

  const SERVER_URL = `${API_BASE_URL}/student-auth/register`;

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response = await axios.get(`${API_BASE_URL}/schools`);
        if (response.data) {
          setSchools(response.data);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await axios.get(`${API_BASE_URL}/classes`);
        if (response.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        setLoadingDivisions(true);
        const response = await axios.get(`${API_BASE_URL}/divisions`);
        if (response.data) {
          setAllDivisions(response.data);
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      } finally {
        setLoadingDivisions(false);
      }
    };

    fetchDivisions();
  }, []);

  // Filter divisions based on selected class
  useEffect(() => {
    if (formData.classId) {
      // Find the selected class to get its name and code
      const selectedClass = classes.find((c) => c.id.toString() === formData.classId);
      if (selectedClass) {
        // Filter divisions by matching class name or classCode
        const filtered = allDivisions.filter(
          (div) =>
            div.class === selectedClass.name || div.classCode === selectedClass.code
        );
        setFilteredDivisions(filtered);
        
        // Reset division if current selection is not in filtered list
        if (formData.divisionId && !filtered.find(d => d.id.toString() === formData.divisionId)) {
          setFormData(prev => ({ ...prev, divisionId: "" }));
        }
      } else {
        setFilteredDivisions([]);
      }
    } else {
      setFilteredDivisions([]);
      setFormData(prev => ({ ...prev, divisionId: "" }));
    }
  }, [formData.classId, allDivisions, classes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If class is changed, reset division
    if (name === "classId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        divisionId: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          studentId: formData.studentId,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          schoolId: formData.schoolId ? parseInt(formData.schoolId) : null,
          classId: formData.classId ? parseInt(formData.classId) : null,
          divisionId: formData.divisionId ? parseInt(formData.divisionId) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.user, data.data.token);
        navigate("/student/dashboard");
      } else {
        setErrors({ submit: data.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 justify-center items-center">
      <div className="hidden lg:flex flex-[1.5] items-center justify-center bg-gray-50 rounded-l-[18px] h-full">
        <img
          src="/student-login.png"
          alt="Register Illustration"
          className="max-w-[70%] h-auto rounded-xl"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center bg-white shadow-[0_2px_24px_0_rgba(0,0,0,0.04)] rounded-r-[18px] lg:rounded-l-none rounded-[18px] lg:rounded-r-[18px] p-4 lg:p-6 min-w-[320px] w-full lg:w-auto h-full overflow-y-auto">
        <div className="text-lg font-bold text-gray-400 mb-2 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Serene Minds Logo"
            className="h-7 align-middle"
          />
        </div>
        <h2 className="m-0 mb-1 text-lg text-gray-900 font-semibold tracking-tight">
          Student Registration{" "}
          <span role="img" aria-label="student">
            🎓
          </span>
        </h2>
        <p className="text-gray-500 mb-3 text-xs font-normal">
          Create your student account and start tracking your mood
        </p>

        <form className="w-full max-w-[600px] grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 bg-transparent shadow-none" onSubmit={handleSubmit}>
          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.name
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.name && <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.name}</span>}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Student ID *</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter your student ID"
            value={formData.studentId}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.studentId
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.studentId && <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.studentId}</span>}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.email
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.email}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.phone
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
          />
          {errors.phone && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.phone}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">School</label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.schoolId
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            disabled={loadingSchools}
          >
            <option value="">Select a School</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.schoolId}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.classId
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            disabled={loadingClasses}
          >
            <option value="">Select a Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name} {classItem.code ? `(${classItem.code})` : ""}
              </option>
            ))}
          </select>
          {errors.classId && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.classId}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Division</label>
          <select
            name="divisionId"
            value={formData.divisionId}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.divisionId
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            disabled={loadingDivisions || !formData.classId}
          >
            <option value="">Select a Division</option>
            {filteredDivisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
          {errors.divisionId && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.divisionId}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.password
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.password && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.password}</span>
          )}

          <label className="mb-0.5 text-gray-700 text-[0.85rem] font-medium">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`py-1.5 px-3 mb-0 border rounded-md text-sm bg-gray-50 outline-none transition-colors ${
              errors.confirmPassword
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.confirmPassword}</span>
          )}

          {errors.submit && (
            <span className="text-red-500 text-xs mb-0 block col-span-2">{errors.submit}</span>
          )}

          <button
            type="submit"
            className="bg-[#1cc5b7] text-white border-none rounded-md py-2 text-sm font-semibold cursor-pointer mt-2 mb-2 transition-colors hover:bg-[#179e91] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-none col-span-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 mt-2 font-normal">
          <span className="mr-2">Already have an account?</span>
          <Link to="/student/login" className="text-[#1cc5b7] no-underline text-xs transition-colors font-medium hover:text-[#179e91] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;

