"use client";
import { Button, Label, TextInput } from "flowbite-react";

export default function ForgotPassword() {
  return (
    <main className="box-border w-screen min-h-screen py-20 flex items-center justify-center bg-dark-green">
      <div className="w-[90vw] min-h-[85vh] md:w-[75vw] lg:w-[60vw] lg:grid lg:grid-cols-[1fr_3fr]">
        <div className="hidden bg-light-green lg:block lg:rounded-l-xl"></div>
        
        <div className="flex flex-col items-center gap-12 p-12 bg-white rounded-xl md:p-20 lg:rounded-l-none">
          <h1 className="font-bold text-xl">Forgot Password?</h1>
          <p className="w-3/4">Enter your email below, and we'll send you a link to reset your password</p>
          
          <form className="w-3/4 flex flex-col gap-4">
          <div>
              <Label htmlFor="email" value="Email:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required />
            </div>
            
            <Button type="submit" className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue">Send</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
