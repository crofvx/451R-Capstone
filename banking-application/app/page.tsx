"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="box-border w-screen min-h-screen py-20 flex items-center justify-center bg-dark-green">
      <div className="w-[90vw] min-h-[85vh] md:w-[75vw] lg:w-[60vw] lg:grid lg:grid-cols-[1fr_3fr]">
        <div className="hidden bg-light-green lg:block lg:rounded-l-xl"></div>
        
        <div className="flex flex-col items-center gap-12 p-12 bg-white rounded-xl md:p-20 lg:rounded-l-none">
          <h1 className="font-bold text-xl">Log In to Banking App</h1>

          <form className="w-3/4 flex flex-col gap-4">
            <div>
              <Label htmlFor="email" value="Email:" />
              <TextInput id="email" name="email" type="email" maxLength={254} required />
            </div>

            <div>
              <Label htmlFor="password" value="Password:" />
              <TextInput id="password" name="password" type="password" maxLength={128} required />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" name="remember" />
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
    </main>
  );
}
