"use client";
import { useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && value !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <main className="box-border w-screen min-h-screen py-20 flex items-center justify-center bg-dark-green">
      <div className="w-[90vw] min-h-[85vh] md:w-[75vw] lg:w-[60vw] lg:grid lg:grid-cols-[1fr_3fr]">
        <div className="hidden bg-light-green lg:block lg:rounded-l-xl"></div>
        
        <div className="flex flex-col items-center gap-12 p-12 bg-white rounded-xl md:p-20 lg:rounded-l-none">
          <h1 className="font-bold text-xl">Reset Password</h1>
          
          <form className="w-3/4 flex flex-col gap-4">
            <div>
              <Label htmlFor="new-password" value="New Password:" />
              <TextInput id="new-password" name="new-password" type="password" maxLength={128} required onChange={handlePasswordChange} />
            </div>
            
            <div>
              <Label htmlFor="confirm-new-password" value="Confirm New Password:" />
              <TextInput id="confirm-new-password" name="confirm-new-password" type="password" maxLength={128} required onChange={handleConfirmPasswordChange} />
            </div>

            {error && 
              <Alert color="failure">
                <span className="font-medium">Passwords do not match</span>
              </Alert>
            }

            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Reset</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
