"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Modal, Card, createTheme } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { Component } from "../components/budgetToolbar";

const newCardTheme = createTheme({
  card: {
    root: {
      base: "flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800",
      children: "flex flex-col gap-4 p-6",
    },
  },
});

export default function SettingsPage() {
  const [userToken, setUserToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    if (!token) {
      router.push("/");
    } else {
      setUserToken(token);
    }
  }, [router]);

  const [showContactForm, setShowContactForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [contactData, setContactData] = useState({ email: "", phone: "", address: "" });
  const [newPasswordData, setNewPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("Update Failed");
  const [modalMessage, setModalMessage] = useState("");

  const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=_~\`\\[\\]{}:;'"<,>.?/]).{12,}$`);

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordData({ ...newPasswordData, currentPassword: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, newPassword: value });
    setPasswordError(!passwordPattern.test(value) ? "Password does not meet requirements" : "");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPasswordData({ ...newPasswordData, confirmPassword: value });
    setConfirmPasswordError(value !== newPasswordData.newPassword ? "Passwords do not match" : "");
  };

  const handleContactFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        body: JSON.stringify(contactData),
      });

      const result = await response.json();
      setModalHeader(response.ok ? "Update Successful" : "Update Failed");
      setModalMessage(result.message || "Contact info update result unknown.");
      setShowModal(true);
    } catch {
      setModalHeader("Error");
      setModalMessage("Something went wrong. Please try again.");
      setShowModal(true);
    }
  };

  const handlePasswordFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordPattern.test(newPasswordData.newPassword)) {
      setPasswordError("Password does not meet requirements.");
      return;
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
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

      const result = await response.json();
      setModalHeader(response.ok ? "Update Successful" : "Update Failed");
      setModalMessage(result.message || "Password update result unknown.");
      setShowModal(true);
    } catch {
      setModalHeader("Error");
      setModalMessage("Something went wrong. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Component />
      </div>

      {/* Page Header */}
      <div className="pt-28 px-6 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold text-[#1d4d34] dark:text-white text-left w-full max-w-5xl px-2 mb-4">
          Settings
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 py-16 flex justify-center">
        <div className="w-full max-w-5xl space-y-6">

          {/* Contact Info Toggle */}
          <Card className="cursor-pointer hover:shadow-xl" theme={newCardTheme.card} onClick={() => setShowContactForm(!showContactForm)}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Contact Information</h2>
            {!showContactForm && (
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                Edit your Email, Phone Number, and Mailing Address
              </p>
            )}
          </Card>

          {showContactForm && (
            <Card theme={newCardTheme.card}>
              <form className="space-y-4" onSubmit={handleContactFormSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email Address</label>
                  <input type="email" name="email" id="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-md p-2" required onChange={handleContactInputChange} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Phone Number</label>
                  <input type="tel" name="phone" id="phone" placeholder="5551234567" pattern="^\d{10}$" className="w-full border border-gray-300 rounded-md p-2" required onChange={handleContactInputChange} />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Mailing Address</label>
                  <input type="text" name="address" id="address" placeholder="123 Main St" className="w-full border border-gray-300 rounded-md p-2" required onChange={handleContactInputChange} />
                </div>
                <Button type="submit" className="bg-[#245C3E] hover:bg-[#1d4d34] text-white">Save Changes</Button>
              </form>
            </Card>
          )}

          {/* Password Reset Toggle */}
          <Card className="cursor-pointer hover:shadow-xl" theme={newCardTheme.card} onClick={() => setShowPasswordForm(!showPasswordForm)}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reset Password</h2>
            {!showPasswordForm && (
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">Change your password securely</p>
            )}
          </Card>

          {showPasswordForm && (
            <Card theme={newCardTheme.card}>
              <form className="space-y-4" onSubmit={handlePasswordFormSubmit}>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Current Password</label>
                  <input type="password" id="currentPassword" name="currentPassword" className="w-full border border-gray-300 rounded-md p-2" required onChange={handleCurrentPasswordChange} />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">New Password</label>
                  <input type="password" id="newPassword" name="newPassword" className="w-full border border-gray-300 rounded-md p-2" required onChange={handlePasswordChange} />
                </div>
                {passwordError && (
                  <Alert color="failure">
                    <p className="font-medium">Password does not meet requirements</p>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      <li>At least 12 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </Alert>
                )}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Confirm New Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" className="w-full border border-gray-300 rounded-md p-2" required onChange={handleConfirmPasswordChange} />
                </div>
                {confirmPasswordError && (
                  <Alert color="failure">
                    <p className="font-medium">Passwords do not match</p>
                  </Alert>
                )}
                <Button type="submit" className="bg-[#245C3E] hover:bg-[#1d4d34] text-white">Reset Password</Button>
              </form>
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Body><p>{modalMessage}</p></Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="bg-blue-500 hover:bg-blue-600 text-white">OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
