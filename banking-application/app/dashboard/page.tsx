'use client';
import { DarkThemeToggle } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Component } from "../components/budgetToolbar";

export default function Page() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  
    if (!token) {
      router.push('/');
    } else {
      setUserToken(token);
      setLoading(false);
    }
  }, [router]);
  
  if (loading) {
    return null;
  }
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <Component/>
      <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle />
      <h1 className="text-2xl dark:text-white">Dashboard Page</h1>
    </main>
  );
}
