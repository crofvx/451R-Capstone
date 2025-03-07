"use client";
import { useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import Link from 'next/link';

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

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
          <h1 className="font-bold text-xl">Create Banking App Account</h1>
          
          <form className="w-3/4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Label htmlFor="first-name" value="First Name*:" />
                <TextInput id="first-name" name="first-name" type="text" maxLength={50} required />
              </div>

              <div className="md:w-1/2">
                <Label htmlFor="last-name" value="Last Name*:" />
                <TextInput id="last-name" name="last-name" type="text" maxLength={50} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email" value="Email*:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required />
            </div>

            <div>
              <Label htmlFor="phone" value="Phone*:" />
              <TextInput id="phone" name="phone" type="tel" placeholder="5551234567" maxLength={10} required />
            </div>

            <div>
              <Label htmlFor="address" value="Address*:" />
              <TextInput id="address" name="address" type="text" placeholder="123 Main St, Apt 4B, City, State, ZIP" maxLength={150} required />
            </div>

            <div>
              <Label htmlFor="birthdate" value="Birthdate*:" />
              <TextInput id="birthdate" name="birthdate" type="date" max={today} required />
            </div>

            <div>
              <Label htmlFor="password" value="Password*:" />
              <TextInput id="password" name="password" type="password" maxLength={128} required onChange={handlePasswordChange} />
            </div>

            <div>
              <Label htmlFor="confirm-password" value="Confirm Password*:" />
              <TextInput id="confirm-password" name="confirm-password" type="password" maxLength={128} required onChange={handleConfirmPasswordChange} />
            </div>

            {error && 
              <Alert color="failure">
                <span className="font-medium">Passwords do not match</span>
              </Alert>
            }

            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Create Account</Button>

            <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:justify-center">
              Already have an account?
              <Link href="/" className="text-light-blue hover:underline">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
