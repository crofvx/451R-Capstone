"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "flowbite-react";

export default function SettingsPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [newPasswordData, setNewPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=_~\`\\[\\]{}:;'"<,>.?/]).{12,}$`);
 
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, password: value });
 
    if (value && !passwordPattern.test(value)) {
      setPasswordError("Password does not meet requirements");
    } else {
      setPasswordError("");
    }
  };
 
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, confirmPassword: value });
 
    if (value && value !== newPasswordData.password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* ✅ Top Navigation Bar */}
      <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
        {/* Left Logo */}
        <div className="text-2xl font-bold text-black">App Name(TBD)</div>

        {/* Center Nav Links */}
        <div className="space-x-8 text-[16px] font-medium text-black">
          <Link
            href="/dashboard"
            className="underline underline-offset-4 decoration-2 decoration-black hover:text-[#245C3E]"
          >
            Dashboard
          </Link>
          <Link
            href="/budgeting"
            className="underline underline-offset-4 decoration-2 decoration-black hover:text-[#245C3E]"
          >
            Budgeting
          </Link>
        </div>

        {/* Right Button (Settings) */}
        <Link
          href="/settings"
          className="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
        >
          Settings
        </Link>
      </nav>

      {/* ✅ Header Section */}
      <div className="bg-gray-100 py-12 px-8">
        <h1 className="text-5xl font-bold text-[#245C3E]">Settings</h1>
      </div>

      {/* ✅ Settings Content Area */}
      <div className="flex justify-center bg-[#245C3E] py-16 px-4">
        <div className="w-full max-w-3xl space-y-6">

          {/* 🔽 Contact Info Dropdown Toggle */}
          <div
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
            onClick={() => setShowContactForm(!showContactForm)}
          >
            <h2 className="text-xl font-semibold text-black">
              {showContactForm ? "Update" : "Update"} Contact Information
            </h2>
            {!showContactForm && (
              <p className="text-gray-700 mt-2 text-sm">
                Edit your Email, Phone Number, and Billing Address
              </p>
            )}
          </div>

          {/* 📄 Contact Info Form */}
          {showContactForm && (
            <div className="bg-white rounded-xl shadow-inner p-6 border border-gray-200">
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="5551234567"
                    maxLength={10}
                    pattern="^\d+$"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="123 Main St, City, State"
                    maxLength={150}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#245C3E] text-white px-6 py-2 rounded-md hover:bg-[#1d4d34] transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* 🔽 Password Reset Toggle */}
          <div
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <h2 className="text-xl font-semibold text-black">
              {showPasswordForm ? "Reset" : "Reset"} Password
            </h2>
            {!showPasswordForm && (
              <p className="text-gray-700 mt-2 text-sm">
                Change your password securely
              </p>
            )}
          </div>

          {/* 🔐 Password Reset Form */}
          {showPasswordForm && (
            <div className="bg-white rounded-xl shadow-inner p-6 border border-gray-200">
              <form className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={handlePasswordChange}
                    maxLength={128}
                    required
                  />
                </div>

                {passwordError &&
              <Alert color="failure">
                <p className="font-medium">Password does not meet requirements</p>
                <br></br>
                <p>Password Requirements:</p>
                <ul className="list-disc list-inside">
                  <li>At least 12 characters</li>
                  <li>An uppercase letter</li>
                  <li>A lowercase letter</li>
                  <li>A number</li>
                  <li>A special character</li>
                </ul>
              </Alert>
            }

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Re-enter new password"
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={handleConfirmPasswordChange}
                    maxLength={128}
                    required
                  />
                </div>

                {confirmPasswordError &&
              <Alert color="failure">
                <p className="font-medium">Passwords do not match</p>
              </Alert>
            }

                <button
                  type="submit"
                  className="bg-[#245C3E] text-white px-6 py-2 rounded-md hover:bg-[#1d4d34] transition"
                >
                  Reset Password
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
