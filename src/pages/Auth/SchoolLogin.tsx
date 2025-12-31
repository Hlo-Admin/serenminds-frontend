import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

const SchoolLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const SERVER_URL = `${API_BASE_URL}/school-auth/login`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the login function from AuthContext
        login(data.data.user, data.data.token);

        // Redirect to school dashboard - school users should only access school routes
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
        
        // Only allow redirect to school routes
        if (from && !from.startsWith("/school")) {
          navigate("/school/dashboard", { replace: true });
        } else {
          navigate(from || "/school/dashboard", { replace: true });
        }
      } else {
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
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
          alt="Login Illustration"
          className="max-w-[70%] h-auto rounded-xl"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center bg-white shadow-[0_2px_24px_0_rgba(0,0,0,0.04)] rounded-r-[18px] lg:rounded-l-none rounded-[18px] lg:rounded-r-[18px] p-10 lg:p-8 min-w-[320px] w-full lg:w-auto">
        <div className="text-xl font-bold text-gray-400 mb-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Serene Minds Logo"
            className="h-8 align-middle"
          />
        </div>
        <h2 className="m-0 mb-2 text-xl text-gray-900 font-semibold tracking-tight">
          School Login{" "}
          <span role="img" aria-label="wave">
            🏫
          </span>
        </h2>
        <p className="text-gray-500 mb-6 text-base font-normal">
          Sign in to manage your school
        </p>

        <form className="w-full max-w-[320px] flex flex-col gap-3 bg-transparent shadow-none" onSubmit={handleSubmit}>
          <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Email</label>
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

          <div className="flex justify-between items-center mb-0.5">
            <label className="mb-1 text-gray-700 text-[0.97rem] font-medium">Password</label>
            <Link to="/forgot-password" className="text-[#1cc5b7] no-underline text-sm transition-colors font-medium hover:text-[#179e91] hover:underline">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
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

          <div className="flex justify-between items-center mb-0.5">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
              />{" "}
              Remember Me
            </label>
          </div>

          {errors.submit && (
            <span className="text-red-500 text-sm mb-0.5 block">{errors.submit}</span>
          )}

          <button
            type="submit"
            className="bg-[#1cc5b7] text-white border-none rounded-lg py-3 text-lg font-semibold cursor-pointer mt-2 mb-4 transition-colors hover:bg-[#179e91] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-none"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="text-center text-[0.97rem] text-gray-500 mt-5 font-normal">
          <span className="mr-2">New school?</span>
          <Link to="/school/register" className="text-[#1cc5b7] no-underline text-sm transition-colors font-medium hover:text-[#179e91] hover:underline">
            Register your school
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;



