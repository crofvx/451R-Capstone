"use client";

import { DarkThemeToggle, Card, createTheme, Button } from "flowbite-react";
import { Component } from "../components/budgetToolbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const newCardTheme = createTheme({
  card: {
    root: {
      base: "flex h-full flex-col justify-start rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      children: "flex h-full flex-col justify-start gap-4 p-6",
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row"
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700"
    },
    img: {
      base: "",
      horizontal: {
        off: "rounded-t-lg",
        on: "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
      }
    }
  }
});

export default function BudgetingHome() {
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
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Component />
      </div>

      <div className="flex items-center justify-center min-h-screen px-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-6 w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-[#1d4d34] dark:text-white w-full px-2 mb-4 text-left">
            Quick Navigation
          </h1>

          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
            {/* Monthly Expense Tracker Card */}
            <Card
              className="flex-1 min-h-[400px] cursor-pointer hover:shadow-lg transition"
              theme={newCardTheme.card}
              onClick={() => router.push("/budget_expenses")}
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Monthly Expense Tracker
                </h5>
                <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-400">
                Track your spending and view recent entries.
              </p>
            </Card>

            {/* Income vs Expenditure Card */}
            <Card
              className="flex-1 min-h-[400px] cursor-pointer hover:shadow-lg transition"
              theme={newCardTheme.card}
              onClick={() => router.push("/budget_insights")}
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Income vs Expenditure
                </h5>
                <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-400">
                View your financial insights for better planning.
              </p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
