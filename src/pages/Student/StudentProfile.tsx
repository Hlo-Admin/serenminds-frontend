import React, { useState } from "react";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

// TypeScript interfaces
interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Guardian {
  name: string;
  relationship: string;
  mobile: string;
  email: string;
  occupation: string;
}

interface GuardianData {
  primary: Guardian;
  secondary: Guardian;
}

const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "Sarah",
    middleName: "Marie",
    lastName: "Johnson",
    dob: "2008-05-15",
    gender: "Female",
    mobile: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Maple Street, Springfield, IL 62701",
    city: "Springfield",
    state: "Illinois",
    country: "United States",
    zipCode: "62701",
  });

  const guardianData: GuardianData = {
    primary: {
      name: "Michael Johnson",
      relationship: "Father",
      mobile: "+1 (555) 987-6543",
      email: "michael.johnson@email.com",
      occupation: "Software Engineer",
    },
    secondary: {
      name: "Emily Johnson",
      relationship: "Mother",
      mobile: "+1 (555) 876-5432",
      email: "emily.johnson@email.com",
      occupation: "Teacher",
    },
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
          {formData.firstName.charAt(0)}
          {formData.lastName.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {formData.firstName} {formData.middleName} {formData.lastName}
          </h2>
          <p className="text-slate-600">{formData.email}</p>
          <p className="text-sm text-slate-500 mt-1">
            Student ID: <strong>STU-2024-0156</strong>
          </p>
        </div>
        {!isEditing ? (
          <button
            className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <FiEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2"
              onClick={handleSave}
            >
              <FiSave /> Save
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              onClick={handleCancel}
            >
              <FiX /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80">
        <div className="text-lg font-semibold text-slate-900 mb-6">
          Personal Information
        </div>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">First Name</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.firstName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Middle Name</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.middleName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Last Name</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.lastName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Date of Birth</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.dob}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Gender</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.gender}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Mobile Number</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.mobile}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Email Address</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.email}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Address</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.address}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">City</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.city}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">State</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.state}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Country</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.country}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 mb-1">Zip Code</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.zipCode}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Guardian Information - Primary */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80">
        <div className="text-lg font-semibold text-slate-900 mb-6">
          Primary Guardian / Parent Contact
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Name</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.primary.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Relationship</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.primary.relationship}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Mobile Number</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.primary.mobile}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Email Address</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.primary.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Occupation</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.primary.occupation}
            </span>
          </div>
        </div>
      </div>

      {/* Guardian Information - Secondary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
        <div className="text-lg font-semibold text-slate-900 mb-6">
          Secondary Guardian / Parent Contact
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Name</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.secondary.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Relationship</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.secondary.relationship}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Mobile Number</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.secondary.mobile}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Email Address</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.secondary.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Occupation</span>
            <span className="text-sm font-semibold text-slate-900">
              {guardianData.secondary.occupation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

