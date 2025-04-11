"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        if (rememberMe) {
          localStorage.setItem('jwt', token);
        } else {
          sessionStorage.setItem('jwt', token);
        }

        console.log("Login successful!");
        router.push('/dashboard');
      } else {
        console.error("Login failed:", response.statusText);
        const errorData = await response.json();
        setModalMessage(errorData.message || response.statusText || "Incorrect username or password.");
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
          <h1 className="font-bold text-xl">Log In to Banking App</h1>

          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email" value="Email:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="password" value="Password:" />
              <TextInput id="password" name="password" type="password" maxLength={128} required onChange={handleInputChange} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" name="remember" onChange={handleCheckboxChange} />
              <Label htmlFor="remember">Remember Me</Label>
            </div>

            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Log In</Button>
            
            <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:justify-center">
              <Link href="/forgot-password" className="text-light-blue hover:underline">Forgot Password</Link>
              <span className="mx-2 hidden md:inline">|</span>
              <Link href="/register" className="text-light-blue hover:underline">Register</Link>
            </div>
          </form>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Login Failed</Modal.Header>

        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue" onClick={() => setShowModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
