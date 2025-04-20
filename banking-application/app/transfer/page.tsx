"use client";

import { useState } from "react";
import Image from "next/image";

export default function Transfer() {
  const [view, setView] = useState("home"); // "home", "payBills", "transferMoney"

  // Go back button
  const BackButton = () => (
    <button
      className="absolute top-6 left-6 bg-white text-green-800 px-4 py-2 rounded shadow hover:bg-gray-100"
      onClick={() => setView("home")}
    >
      ⬅ Back
    </button>
  );

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-dark-green relative">
      {view === "home" && (
        <div className="flex flex-wrap justify-center gap-16">
          {/* 
          // Pay Bills Card 
          <div
            className="w-64 h-64 bg-yellow-400 rounded-xl shadow-lg cursor-pointer"
            onClick={() => setView("payBills")}
          >
            <div className="h-[150px] w-full rounded-t-[13px] overflow-hidden">
              <Image
                src="/pay.jpg"
                alt="Pay Bills"
                width={256}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white h-[119px] rounded-b-[13px] flex items-center justify-center">
              <h2 className="text-green-900 font-bold text-2xl">Pay Bills</h2>
            </div>
          </div>
          */}

          {/* Transfer Money Card */}
          <div
            className="w-64 h-64 bg-yellow-400 rounded-xl shadow-lg cursor-pointer"
            onClick={() => setView("transferMoney")}
          >
            <div className="h-[150px] w-full rounded-t-[13px] overflow-hidden">
              <Image
                src="/transfer.jpg"
                alt="Transfer"
                width={192}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white h-[119px] rounded-b-[13px] flex items-center justify-center">
              <h2 className="text-green-900 font-bold text-2xl">Transfer</h2>
            </div>
          </div>
        </div>
      )}

      {/* Pay Bills Form 
      {view === "payBills" && (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <BackButton />
          <h1 className="text-2xl font-bold text-center text-green-900 mb-6">Pay Your Bills</h1>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bill Type</label>
              <select className="w-full mt-1 p-2 border rounded">
                <option>Electricity</option>
                <option>Water</option>
                <option>Internet</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input type="text" className="w-full mt-1 p-2 border rounded" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" className="w-full mt-1 p-2 border rounded" />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
            >
              Pay Now
            </button>
          </form>
        </div>
      )}
      */}

      {view === "transferMoney" && (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <BackButton />
          <h1 className="text-2xl font-bold text-center text-green-900 mb-6">
            Transfer Between Accounts
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const from = (form.elements.namedItem("fromAccount") as HTMLSelectElement).value;
              const to = (form.elements.namedItem("toAccount") as HTMLSelectElement).value;
              const amount = parseFloat(
                (form.elements.namedItem("amount") as HTMLInputElement).value
              );

              if (from === to) {
                alert("Source and destination accounts must be different.");
                return;
              }

              if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
              }

              alert(`Transferred $${amount.toFixed(2)} from ${from} to ${to}.`);
              setView("home");
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                From Account
              </label>
              <select
                name="fromAccount"
                className="w-full mt-1 p-2 border rounded"
                required
              >
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                To Account
              </label>
              <select
                name="toAccount"
                className="w-full mt-1 p-2 border rounded"
                required
              >
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-5 px-8 text-xl font-bold rounded-2xl shadow-lg hover:bg-green-800 transition duration-200"
              >
              Transfer Money
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
