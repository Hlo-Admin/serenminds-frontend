import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiUsers, FiBook } from "react-icons/fi";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case "admin":
        navigate("/login");
        break;
      case "student":
        navigate("/student/login");
        break;
      case "school":
        navigate("/school/login");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Side - Minimalist Design */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <img
              src="/logo.png"
              alt="Serene Minds Logo"
              className="h-12 mb-6"
            />
            <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
              Welcome to
            </h1>
            <h2 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Serene Minds
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your comprehensive platform for mental wellness and academic management
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Role Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              Select your role
            </h3>
            <p className="text-gray-500 text-sm">
              Choose how you'd like to access the platform
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Admin Card */}
            <div
              onClick={() => handleRoleSelection("admin")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiShield className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Master Admin
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    System administration and management
                  </p>
                  <div className="flex items-center text-[#1cc5b7] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Continue</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* School Card */}
            <div
              onClick={() => handleRoleSelection("school")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiUsers className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    School User
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Manage your school and students
                  </p>
                  <div className="flex items-center text-[#1cc5b7] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Continue</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Card */}
            <div
              onClick={() => handleRoleSelection("student")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiBook className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Student
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Track your mood and progress
                  </p>
                  <div className="flex items-center text-[#1cc5b7] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Continue</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
