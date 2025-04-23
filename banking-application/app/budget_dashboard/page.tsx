"use client";

import { DarkThemeToggle } from "flowbite-react"
import { Component } from "../components/budgetToolbar";


import { useRouter } from "next/navigation";

export default function BudgetingHome() {
  const router = useRouter();

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-dark-green">
      <Component/>
      <div className="flex flex-col gap-12">
        {/* Monthly Expense Tracker Button */}
        <button
          onClick={() => router.push("/budget_expenses")}
          className="w-80 h-48 bg-white rounded-2xl shadow-xl flex flex-col justify-between items-start px-6 py-6 hover:bg-gray-100 transition"
        >
          <h1 className="text-3xl font-extrabold text-green-900">
            Monthly Expense Tracker
          </h1>
          <div className="flex items-center justify-between w-full text-sm text-green-800">
            <span>Track your spending</span>
            <span className="text-xl">⮕</span>
          </div>
        </button>

        {/* Income v. Expenditure Button */}
        <button
          onClick={() => router.push("/budget_insights")}
          className="w-80 h-48 bg-white rounded-2xl shadow-xl flex flex-col justify-between items-start px-6 py-6 hover:bg-gray-100 transition"
        >
          <h1 className="text-3xl font-extrabold text-green-900">
            Income v. Expenditure
          </h1>
          <div className="flex items-center justify-between w-full text-sm text-green-800">
            <span>View your financial insights</span>
            <span className="text-xl">⮕</span>
          </div>
        </button>
      </div>
    </main>
  );
}