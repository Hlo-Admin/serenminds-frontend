import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  schoolId: string;
  role: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  schoolId?: string;
  submit?: string;
}

interface School {
  id: number;
  name: string;
}

const SchoolRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    schoolId: "",
    role: "school_admin",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState<boolean>(true);

  const SERVER_URL = `${API_BASE_URL}/school-auth/register`;

  // Fetch schools for dropdown
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!formData.schoolId) {
      newErrors.schoolId = "Please select a school";
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
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          schoolId: parseInt(formData.schoolId),
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.user, data.data.token);
        navigate("/school/dashboard");
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
    <div className="flex min-h-screen bg-gray-50 justify-center items-center">
      <div className="hidden lg:flex flex-[1.5] items-center justify-center bg-gray-50 rounded-l-[18px]">
        <img
          src="/login.jpg"
          alt="Register Illustration"
          className="max-w-[70%] h-auto rounded-xl"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center bg-white shadow-[0_2px_24px_0_rgba(0,0,0,0.04)] rounded-r-[18px] lg:rounded-l-none rounded-[18px] lg:rounded-r-[18px] p-10 lg:p-8 min-w-[320px] w-full lg:w-auto max-h-[90vh] overflow-y-auto">
        <div className="text-xl font-bold text-gray-400 mb-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Serene Minds Logo"
            className="h-8 align-middle"
          />
        </div>
        <h2 className="m-0 mb-2 text-xl text-gray-900 font-semibold tracking-tight">
          School Registration{" "}
          <span role="img" aria-label="school">
            🏫
          </span>
        </h2>
        <p className="text-gray-500 mb-6 text-base font-normal">
          Create an account for your school
        </p>

        <form className="w-full max-w-[320px] flex flex-col gap-3 bg-transparent shadow-none" onSubmit={handleSubmit}>
          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.name
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.name && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.name}</span>
          )}

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="school@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.email
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.email}</span>
          )}

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.phone
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.phone}</span>
          )}

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">School *</label>
          <select
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.schoolId
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
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
            <span className="text-red-500 text-sm mb-0.5 block">{errors.schoolId}</span>
          )}

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="py-2.5 px-4 mb-0.5 border border-gray-300 rounded-lg text-base bg-gray-50 outline-none transition-colors focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            required
          >
            <option value="school_admin">School Admin</option>
            <option value="school_staff">School Staff</option>
            <option value="school_teacher">School Teacher</option>
          </select>

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.password
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.password && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.password}</span>
          )}

          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`py-2.5 px-4 mb-0.5 border rounded-lg text-base bg-gray-50 outline-none transition-colors ${
              errors.confirmPassword
                ? "border-red-500 bg-red-50 focus:border-red-500"
                : "border-gray-300 focus:border-[#1cc5b7] focus:bg-white focus:border-[1.5px]"
            }`}
            required
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.confirmPassword}</span>
          )}

          {errors.submit && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.submit}</span>
          )}

          <button
            type="submit"
            className="bg-[#1cc5b7] text-white border-none rounded-lg py-3 text-lg font-semibold cursor-pointer mt-2 mb-4 transition-colors hover:bg-[#179e91] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-none"
            disabled={loading || loadingSchools}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center text-[0.97rem] text-gray-500 mt-5 font-normal">
          <span className="mr-2">Already have an account?</span>
          <Link to="/school/login" className="text-[#1cc5b7] no-underline text-sm transition-colors font-medium hover:text-[#179e91] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;



