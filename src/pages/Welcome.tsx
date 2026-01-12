import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiUsers, FiBook, FiHeart } from "react-icons/fi";

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
      case "parent":
        navigate("/parent/login");
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
          <div className="grid grid-cols-2 gap-4">
            {/* Admin Card */}
            <div
              onClick={() => handleRoleSelection("admin")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white flex flex-col items-center text-center h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                <FiShield className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Master Admin
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                System administration and management
              </p>
            </div>

            {/* School Card */}
            <div
              onClick={() => handleRoleSelection("school")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white flex flex-col items-center text-center h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                <FiUsers className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                School User
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Manage your school and students
              </p>
            </div>

            {/* Student Card */}
            <div
              onClick={() => handleRoleSelection("student")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white flex flex-col items-center text-center h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                <FiBook className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Student
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Track your mood and progress
              </p>
            </div>

            {/* Parent Card */}
            <div
              onClick={() => handleRoleSelection("parent")}
              className="group relative border-2 border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#1cc5b7] hover:shadow-lg bg-white flex flex-col items-center text-center h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1cc5b7] to-[#179e91] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                <FiHeart className="text-white text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Parent
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Monitor your children's wellbeing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
