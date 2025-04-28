"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
    
  useEffect(() => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmPasswordError] = useState("");
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=_~\`\\[\\]{}:;'"<,>.?/]).{12,}$`);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResetPasswordData({ ...resetPasswordData, newPassword: value });

    if (value && !passwordPattern.test(value)) {
      setNewPasswordError("Password does not meet requirements");
    } else {
      setNewPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResetPasswordData({ ...resetPasswordData, confirmNewPassword: value });

    if (value && value !== resetPasswordData.newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordPattern.test(resetPasswordData.newPassword)) {
      setNewPasswordError("Password does not meet requirements");
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          newPassword: resetPasswordData.newPassword,
        }),
      });

      if (response.ok) {
        console.log("Password reset successfully!");
        router.push('/');
      } else {
        console.error("Password reset failed:", response.statusText);
        const errorData = await response.json();
        setModalMessage(errorData.message || response.statusText || "There was a problem resetting your password. Please check your input and try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="box-border w-screen min-h-screen py-20 flex items-center justify-center bg-dark-green">
      <div className="w-[90vw] min-h-[85vh] md:w-[75vw] lg:w-[60vw] lg:grid lg:grid-cols-[1fr_3fr]">
        <div className="hidden bg-light-green lg:block lg:rounded-l-xl"></div>
        
        <div className="flex flex-col items-center gap-12 p-12 bg-white rounded-xl md:p-20 lg:rounded-l-none">
          <h1 className="font-bold text-xl">Reset Password</h1>
          
          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleReset}>
            <div>
              <Label htmlFor="new-password" value="New Password:" />
              <TextInput id="new-password" name="new-password" type="password" maxLength={128} required onChange={handlePasswordChange} />
            </div>

            {newPasswordError && 
              <Alert color="failure">
                <p className="font-medium">{newPasswordError}</p>
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
              <Label htmlFor="confirm-new-password" value="Confirm New Password:" />
              <TextInput id="confirm-new-password" name="confirm-new-password" type="password" maxLength={128} required onChange={handleConfirmPasswordChange} />
            </div>

            {confirmNewPasswordError && 
              <Alert color="failure">
                <p className="font-medium">{confirmNewPasswordError}</p>
              </Alert>
            }

            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Reset</Button>
          </form>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Password Reset Failed</Modal.Header>

          <Modal.Body>
            <p>{modalMessage}</p>
          </Modal.Body>

          <Modal.Footer>
            <Button className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue" onClick={() => setShowModal(false)}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </main>
  );
}
