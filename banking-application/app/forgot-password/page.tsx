"use client";

import { useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sentStatusMessage, setSentStatusMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const checkEmailResponse = await fetch(`http://localhost:8080/api/users/check-email?email=${encodeURIComponent(email)}`);
      const data = await checkEmailResponse.json();
      
      // email address exists in database
      if (data.taken) {
        const sendEmailResponse = await fetch("http://localhost:8080/api/users/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email }),
        });

        if (sendEmailResponse.ok) {
          setSent(true);
          setSentStatusMessage("Password reset email sent!");
          console.log("Email sent!");
        } else {
          console.error("Email not sent");
        }
      } else {
        setSentStatusMessage("Email not found");
        console.error("Email not found");
      }
    } catch (error) {
      setSentStatusMessage("There was a problem sending the password reset email. Please check your input and try again.");
      console.error("Error sending email: ", error);
    }
  };

  return (
    <main className="box-border w-screen min-h-screen py-20 flex items-center justify-center bg-dark-green">
      <div className="w-[90vw] min-h-[85vh] md:w-[75vw] lg:w-[60vw] lg:grid lg:grid-cols-[1fr_3fr]">
        <div className="hidden bg-light-green lg:block lg:rounded-l-xl"></div>
        
        <div className="flex flex-col items-center gap-12 p-12 bg-white rounded-xl md:p-20 lg:rounded-l-none">
          <h1 className="font-bold text-xl">Forgot Password?</h1>
          <p className="w-3/4">Enter your email below, and we'll send you a link to reset your password</p>
          
          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleSend}>
            <div>
              <Label htmlFor="email" value="Email:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required onChange={handleEmailChange} />
            </div>
              
            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Send</Button>

            {sentStatusMessage && (
              <Alert color={sent ? "success" : "failure"}>
                <p className="font-medium">{sentStatusMessage}</p>
              </Alert>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
