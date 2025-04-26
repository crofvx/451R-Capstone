"use client";

import { useState } from "react";
import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const today = new Date();
  const minAgeBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0];

  const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-+=_~\`\\[\\]{}:;'"<,>.?/]).{12,}$`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailBlur = async () => {
    if (formData.email) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/check-email?email=${encodeURIComponent(formData.email)}`);
        const data = await response.json();
        
        // email address already used
        if (data.taken) {
          setEmailError("Email address is already taken.");
        } else {
          setEmailError("");
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailError("An error occurred. Please try again.");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    if (value && !passwordPattern.test(value)) {
      setPasswordError("Password does not meet requirements");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });

    if (value && value !== formData.password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordPattern.test(formData.password)) {
      setPasswordError("Password does not meet requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate,
          password: formData.password,
        }),
      });

      if (response.ok) {
        console.log("User registered successfully!");
        router.push('/dashboard');
      } else {
        console.error("Registration failed:", response.statusText);
        const errorData = await response.json();
        setModalMessage(errorData.message || response.statusText || "There was a problem creating your account. Please check your input and try again.");
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
          <h1 className="font-bold text-2xl">
            Manage monies{" "}
            <span className="font-extrabold text-green-800">your way.</span>
            </h1>
          
          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Label htmlFor="first-name" value="First Name*:" />
                <TextInput id="first-name" name="firstName" type="text" maxLength={50} required onChange={handleInputChange} />
              </div>

              <div className="md:w-1/2">
                <Label htmlFor="last-name" value="Last Name*:" />
                <TextInput id="last-name" name="lastName" type="text" maxLength={50} required onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="email" value="Email*:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required onChange={handleInputChange} onBlur={handleEmailBlur} />
            </div>

            {emailError && 
              <Alert color="failure">
                <p className="font-medium">{emailError}</p>
              </Alert>
            }

            <div>
              <Label htmlFor="phone" value="Phone*:" />
              <TextInput id="phone" name="phone" type="tel" placeholder="5551234567" maxLength={10} pattern="^\d+$" required onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="address" value="Address*:" />
              <TextInput id="address" name="address" type="text" placeholder="123 Main St, Apt 4B, City, State, ZIP" maxLength={150} required onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="birthdate" value="Birthdate*:" />
              <TextInput id="birthdate" name="birthDate" type="date" max={minAgeBirthDate} required onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="password" value="Password*:" />
              <TextInput id="password" name="password" type="password" maxLength={128} required onChange={handlePasswordChange} />
            </div>

            {passwordError && 
              <Alert color="failure">
                <p className="font-medium">{passwordError}</p>
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
              <Label htmlFor="confirm-password" value="Confirm Password*:" />
              <TextInput id="confirm-password" name="confirmPassword" type="password" maxLength={128} required onChange={handleConfirmPasswordChange} />
            </div>

            {confirmPasswordError && 
              <Alert color="failure">
                <p className="font-medium">{confirmPasswordError}</p>
              </Alert>
            }

            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Create Account</Button>

            <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:justify-center">
              Already have an account?
              <Link href="/" className="text-light-blue hover:underline">Log in</Link>
            </div>
          </form>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Account Creation Failed</Modal.Header>

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
