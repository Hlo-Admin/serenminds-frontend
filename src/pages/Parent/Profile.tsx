import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX } from "react-icons/fi";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Parent",
    email: "parent@demo.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    // Show success message
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: "John Parent",
      email: "parent@demo.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    });
    setIsEditing(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      <div className="max-w-3xl">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/80 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1ecab8] to-[#1bb8a6] flex items-center justify-center text-white text-3xl font-semibold">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                <p className="text-slate-600">Parent Account</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
              >
                <FiEdit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
                >
                  <FiSave size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  <FiX size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                />
              ) : (
                <p className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {profileData.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiMail className="inline mr-2" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                />
              ) : (
                <p className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {profileData.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                />
              ) : (
                <p className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {profileData.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiMapPin className="inline mr-2" />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8] mb-2"
                />
              ) : (
                <p className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 mb-2">
                  {profileData.address}
                </p>
              )}
              {isEditing && (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                  />
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1ecab8]"
                  />
                </div>
              )}
              {!isEditing && (
                <p className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {profileData.city}, {profileData.state} {profileData.zipCode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/80">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Change Password</p>
                <p className="text-sm text-slate-600">Update your account password</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Notification Preferences</p>
                <p className="text-sm text-slate-600">Manage how you receive notifications</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

