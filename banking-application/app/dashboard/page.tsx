"use client";

import { DarkThemeToggle } from "flowbite-react";
import { Component } from "../components/budgetToolbar";
import { useEffect, useState } from "react";
import { Card, Button, createTheme } from 'flowbite-react';
import { useRouter } from "next/navigation";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetingHome() {
  const [balances, setBalances] = useState<{ checkingBalance: number; savingsBalance: number } | null>(null);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<{ id: string; name: string; value: number }[]>([]);
  const router = useRouter();

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

  const fetchExpenses = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/budgets`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch expenses");
        return;
      }

      const data = await response.json();
      const parsedExpenses = data.map((item: any) => ({
        id: item.budgetId,
        name: item.category,
        value: item.allocatedAmount,
      }));

      setExpenses(parsedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchBalance = async (token: string) => {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId = decodedPayload.userId;
  
      const response = await fetch(`http://localhost:8080/api/accounts/balances?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Failed to fetch balances");
        return;
      }
  
      const data = await response.json();
      setBalances({
        checkingBalance: data.checkingBalance,
        savingsBalance: data.savingsBalance,
      });
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };
  


  useEffect(() => {
    const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

    if (!token) {
      router.push('/');
    } else {
      setUserToken(token);
      setLoading(false);
      fetchExpenses(token);
      fetchBalance(token);
    }
  }, [router]);

  if (loading) {
    return null;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const total = expenses.reduce((sum, e) => sum + e.value, 0);

  const chartData = {
    labels: expenses.map((e) => e.name),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map((e) => e.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(234, 88, 12, 0.6)',
          'rgba(251, 191, 36, 1)',   // Vibrant amber
          'rgba(239, 68, 68, 1)',    // Strong red
          'rgba(132, 204, 22, 1)',   // Bright lime green
          'rgba(56, 189, 248, 1)',   // Sky blue
          'rgba(168, 85, 247, 1)'    // Vivid violet
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(251, 191, 36, 1)',   // Vibrant amber
          'rgba(239, 68, 68, 1)',    // Strong red
          'rgba(132, 204, 22, 1)',   // Bright lime green
          'rgba(56, 189, 248, 1)',   // Sky blue
          'rgba(168, 85, 247, 1)'    // Vivid violet
        ],
        borderWidth: 1,
        spacing: 5,
        borderRadius: 60,
        hoverOffset: 10,
        cutout: '75%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      animateRotate: true,
      easing: 'easeOutQuart',
      duration: 1400,
    },
    plugins: {
      tooltip: {
        position: 'nearest',
        intersect: true,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 7,
          boxHeight: 7,
        },
      },
    },
    elements: {
      arc: {
        borderRadius: 60,
        spacing: 5,
      },
    },
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Component />
      </div>

      <div className="pt-28 px-6 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold text-[#245C3E] dark:text-white text-left w-full max-w-5xl px-2 mb-4">
          {currentMonth} Overview
        </h1>


        {/* Second Row: Income + Expenses + Chart */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl items-stretch">
          {/* Income */}
          <Card
            className="flex-1 min-h-[350px] cursor-pointer hover:shadow-lg transition "
            theme={newCardTheme.card}
            onClick={() => router.push('/budget_expenses')}
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Monthly Income
              </h5>
              <svg className="w-5 h-5 text-gray-800 dark:text-white ml-2" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
            </div>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              View all sources of income for this month.
            </p>
          </Card>

          {/* Expenses */}
          <Card className="flex-1 min-h-[350px] cursor-pointer hover:shadow-lg transition relative"
            theme={newCardTheme.card}
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Monthly Expenses
              </h5>
              <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
            </div>
            <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">See where your money is going.</p>
            <div className="space-y-2">
              {expenses.length > 0 ? (
                expenses.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                    <span className="capitalize">{item.name}</span>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No expense data available.</p>
              )}
            </div>
            <div className="mt-4 font-semibold text-gray-900 dark:text-white">
              Total: {formatCurrency(total)}
            </div>
          </Card>

          {/* Chart */}
          <Card className="flex-1 min-h-[350px]"
            theme={newCardTheme.card}
          >
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Expense Chart</h5>
            {expenses.length > 0 ? (
              <div className="w-full h-64">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data to display in chart.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Divider Section */}
      <div className="w-full bg-[#016747] py-16 px-8 mt-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-white relative z-10">
          <div className="text-center md:text-left mb-6 md:mb-0 md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Have peace of mind.</h2>
            <p className="text-lg">Manage your income and account traffic anytime. Anywhere. </p>
          </div>
        </div>

        {/* Freely positioned image */}
        <img
          src="/images/online-banking-icon-clipart-lg.png"
          alt="Online Banking Icon"
          className="absolute top-0
           w-70 left-[60%]  h-64 object-contain z-0 opacity-90"
        />
      </div>

      {/* Account Balances + Transfer */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 px-6 py-20 flex items-center justify-center">
        <div className="h-[700px]"></div> {/* This adds vertical space */}

        <div className="w-full max-w-5xl flex flex-col items-center justify-center">
          <div className="w-full mb-6 text-left">
            <h2 className="text-3xl font-bold text-[#245C3E] dark:text-white">Accounts & Transfer</h2>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-6">
            {/* Account Balances */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[350px] h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Balances</h3>
                {balances ? (
                  <div className="space-y-3 mt-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Checking</p>
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">{formatCurrency(balances.checkingBalance)}</p>
                    </div>
                    <hr className="border-t border-gray-300 dark:border-gray-700" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Savings</p>
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">{formatCurrency(balances.savingsBalance)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading balances...</p>
                )}
              </div>
            </div>

            {/* Transfer Box */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[350px] h-full flex flex-col justify-between">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Transfer</h5>
                  <p className="mt-2 text-left text-gray-700 dark:text-gray-400">
                    Track your accounts -- move your money from place to place right here.
                  </p>
                </div>
                <div className="pt-4 text-left">
                  <Button className="bg-[#016747] hover:bg-green-600 text-white" onClick={() => router.push('/transfer')}>
                    Open Transfer Page
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}
