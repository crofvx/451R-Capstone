"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parse, format } from "date-fns";
import { Component } from "../components/budgetToolbar";
import { useEffect } from "react";

export default function InsightsPage() {
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

  const [cards, setCards] = useState([
    {
      id: 1,
      title: "Shopping",
      date: "10 Jan 2025",
      amount: 54417.8,
      method: "In Cash",
      color: "bg-green-700",
      isEditing: false,
    },
    {
      id: 2,
      title: "Groceries",
      date: "15 Jan 2025",
      amount: 12200,
      method: "Online",
      color: "bg-green-800",
      isEditing: false,
    },
  ]);

  const updateCard = (id: number, field: string, value: string | number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const toggleEdit = (id: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isEditing: !card.isEditing } : card
      )
    );
  };

  const deleteCard = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        date: "",
        amount: 0,
        method: "In Cash",
        color: "bg-green-500",
        isEditing: true,
      },
    ]);
  };

  // Generate chart data from the cards
  const generateChartData = () => {
    const monthMap: { [key: string]: number } = {};

    // Loop through cards to aggregate amounts per month
    cards.forEach((card) => {
      try {
        const parsedDate = parse(card.date, "dd MMM yyyy", new Date());
        const month = format(parsedDate, "MMM yyyy"); // Format to month-year to group properly
        monthMap[month] = (monthMap[month] || 0) + card.amount;
      } catch {
        // Skip invalid dates
      }
    });

    // Convert monthMap to an array sorted by date
    return Object.entries(monthMap)
      .sort((a, b) =>
        new Date(`${a[0]} 1`).getTime() - new Date(`${b[0]} 1`).getTime()
      )
      .map(([month, value]) => ({ name: month, value }));
  };

  const totalAmount = cards.reduce((sum, card) => sum + card.amount, 0);

  return (
    <main className="w-full min-h-screen bg-white px-10 py-12 relative">
      <Component />
      {/* Back button */}
      <button
        className="absolute top-6 left-6 bg-white text-green-800 px-4 py-2 rounded shadow hover:bg-gray-100"
        onClick={() => router.push("/budget_dashboard")}
      >
        ⬅ Back
      </button>

      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Line Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#4A7B41",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
                labelFormatter={() => ""}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4A7B41"
                strokeWidth={2}
                dot={{ fill: "#4A7B41", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Progress Bar */}
        <div className="bg-green-700 text-white px-6 py-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm">Budget Overview</p>
            <div className="mt-2 bg-white rounded-full h-2 w-64">
              <div className="bg-green-900 h-2 rounded-full" style={{ width: "66%" }} />
            </div>
          </div>
          <p className="text-2xl font-semibold">${totalAmount.toLocaleString()}</p>
        </div>

        {/* Budget Cards */}
        <div className="flex items-center justify-between mt-6">
          <h2 className="text-3xl font-bold text-gray-900">Your Budget</h2>
          <button
            onClick={addCard}
            className="text-green-800 border border-green-800 px-3 py-1 rounded hover:bg-green-50"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col gap-2 bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${card.color}`} />
                  <div className="flex flex-col text-sm text-gray-800">
                    {card.isEditing ? (
                      <>
                        <input
                          value={card.title}
                          onChange={(e) => updateCard(card.id, "title", e.target.value)}
                          className="text-sm font-semibold border rounded px-1"
                        />
                        <input
                          value={card.date}
                          onChange={(e) => updateCard(card.id, "date", e.target.value)}
                          className="text-xs text-gray-500 border rounded px-1 mt-1"
                        />
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{card.title}</span>
                        <span className="text-xs text-gray-500">{card.date}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right text-sm">
                  {card.isEditing ? (
                    <>
                      <input
                        type="number"
                        value={card.amount}
                        onChange={(e) =>
                          updateCard(card.id, "amount", parseFloat(e.target.value))
                        }
                        className="w-24 border rounded px-1 mb-1"
                      />
                      <select
                        value={card.method}
                        onChange={(e) => updateCard(card.id, "method", e.target.value)}
                        className="w-24 border rounded px-1"
                      >
                        <option>In Cash</option>
                        <option>Online</option>
                        <option>Card</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg text-gray-900">
                        ${card.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{card.method}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                {card.isEditing ? (
                  <button
                    onClick={() => toggleEdit(card.id)}
                    className="text-green-700 text-sm"
                  >
                    ✅ Save
                  </button>
                ) : (
                  <button
                    onClick={() => toggleEdit(card.id)}
                    className="text-blue-700 text-sm"
                  >
                    ✏️ Edit
                  </button>
                )}
                <button
                  onClick={() => deleteCard(card.id)}
                  className="text-red-600 text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
