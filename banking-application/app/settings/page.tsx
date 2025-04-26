"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Alert, Button, Modal } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { Component } from "../components/budgetToolbar";

export default function SettingsPage() {
  const [userToken, setUserToken] = useState("");
  
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
    if (!token) {
      router.push('/');
    } else {
      setUserToken(token);
    }
  }, [router]);


  const [showContactForm, setShowContactForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    address: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const [newPasswordData, setNewPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=_~\`\\[\\]{}:;'"<,>.?/]).{12,}$`);

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, currentPassword: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, newPassword: value });
 
    if (value && !passwordPattern.test(value)) {
      setPasswordError("Password does not meet requirements");
    } else {
      setPasswordError("");
    }
  };
 
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, confirmPassword: value });
 
    if (value && value !== newPasswordData.newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleContactFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Basic validation (you can expand this if needed)
    if (!contactData.email || !contactData.phone || !contactData.address) {
      setModalMessage("Please complete all required contact fields.");
      setShowModal(true);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/users/update-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          email: contactData.email,
          phone: contactData.phone,
          address: contactData.address,
        }),
      });
  
      if (response.ok) {
        console.log("Contact info updated successfully!");
        setModalMessage("Contact info updated successfully.");
        setShowModal(true);
      } else {
        console.error("Contact update failed:", response.statusText);
        const errorData = await response.json();
        setModalMessage(errorData.message || response.statusText || "Contact update failed.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("Something went wrong. Please try again.");
      setShowModal(true);
    }
  };
  
  const handlePasswordFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordPattern.test(newPasswordData.newPassword)) {
      setPasswordError("Password must be at least 8 characters, with a number and special character.");
      return;
    }
  
    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          currentPassword: newPasswordData.currentPassword,
          newPassword: newPasswordData.newPassword,
        }),
      });
  
      if (response.ok) {
        console.log("Password updated successfully!");
        setModalMessage("Password updated successfully.");
        setShowModal(true);
      } else {
        console.error("Password update failed:", response.statusText);
        const errorData = await response.json();
        setModalMessage(errorData.message || response.statusText || "Password update failed.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("Something went wrong. Please try again.");
      setShowModal(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* ✅ Top Navigation Bar */}
      <nav className="w-full py-4 px-8">
        <Component/>
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
              <form className="space-y-4" onSubmit={handleContactFormSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    onChange={handleContactInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="5551234567"
                    maxLength={10}
                    pattern="^\d+$"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    onChange={handleContactInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, State"
                    maxLength={150}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    onChange={handleContactInputChange}
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
              <form className="space-y-4" onSubmit={handlePasswordFormSubmit}>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    onChange={handleCurrentPasswordChange}
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
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
                    name="confirmPassword"
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

          <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Header>Update Settings</Modal.Header>
          
                    <Modal.Body>
                      <p>{modalMessage}</p>
                    </Modal.Body>
          
                    <Modal.Footer>
                      <Button className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue" onClick={() => setShowModal(false)}>OK</Button>
                    </Modal.Footer>
                  </Modal>

      </div>
    </div>
  );
}