'use client';

/*
import DonutChart from '../components/donutChart';
import { Component } from '../components/budgetToolbar';

import {
  Button,
  Checkbox,
  Dropdown,
  Tooltip,
} from 'flowbite-react';

import { HiInformationCircle, HiOutlineDownload, HiChevronDown } from 'react-icons/hi';
//  import { main } from 'framer-motion/client';

export default function expensesDonut() {
  return (
    <main>
          <div className=" max-w-sm w-full bg-white rounded-lg shadow-lg dark:bg-gray-800 p-4 md:p-6">
              <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
                          Top Transactions
                      </h5>
                      <Tooltip content="Activity growth - Incremental. Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend.">
                          <HiInformationCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" />
                      </Tooltip>
                  </div>
                  <div>
                      <Tooltip content="Download CSV">
                          <Button
                              size="xs"
                              color="gray"
                              className="hidden sm:inline-flex items-center justify-center w-8 h-8 p-1"
                          >
                              <HiOutlineDownload className="w-4 h-4" />
                              <span className="sr-only">Download data</span>
                          </Button>
                      </Tooltip>
                  </div>
              </div>


              <div className="py-6">
                  <DonutChart />
              </div>

              <div className="grid grid-cols-1 items-center border-t border-gray-200 dark:border-gray-700 pt-5">
                  <div className="flex justify-between items-center">
                      <Dropdown
                          label="Last 7 days"
                          inline
                          renderTrigger={() => (
                              <button
                                  type="button"
                                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center"
                              >
                                  Last 7 days
                                  <HiChevronDown className="w-3 h-3 ms-1" />
                              </button>
                          )}
                      >
                          <Dropdown.Item>Yesterday</Dropdown.Item>
                          <Dropdown.Item>Today</Dropdown.Item>
                          <Dropdown.Item>Last 7 days</Dropdown.Item>
                          <Dropdown.Item>Last 30 days</Dropdown.Item>
                          <Dropdown.Item>Last 90 days</Dropdown.Item>
                      </Dropdown>

                      <a
                          href="#"
                          className="uppercase text-sm font-semibold inline-flex items-center text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg"
                      >
                          Expense analysis
                          <svg
                              className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 6 10"
                          >
                              <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 9 4-4-4-4"
                              />
                          </svg>
                      </a>
                  </div>
              </div>
          </div>

    </main>

  );
}
*/




import { useState, useEffect, SetStateAction } from "react";
import { Component } from "../components/budgetToolbar";
import { Label, Select, TextInput, Button} from "flowbite-react";
import { useRouter } from "next/navigation";


import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";




const ExpensesPage = () => {

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

    const COLORS = ["#4CAF50", "#81C784", "#388E3C", "#A5D6A7", "#2E7D32"];
    const LOCAL_STORAGE_KEY = "budget_expenses";

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [expenses, setExpenses] = useState<{ name: string; value: number }[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedCategory, setEditedCategory] = useState("");
    const [editedAmount, setEditedAmount] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            setExpenses(JSON.parse(saved));
        } else {
            setExpenses([
                { name: "Rent", value: 1000 },
                { name: "Groceries", value: 300 },
                { name: "Utilities", value: 150 },
            ]);
        }
    }, []);

    // Save to localStorage whenever expenses change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
    }, [expenses]);

    const handleAddExpense = () => {
        if (!newCategory || !newAmount) return;
        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount <= 0) return;
        setExpenses((prev) => [...prev, { name: newCategory, value: amount }]);
        setNewCategory("");
        setNewAmount("");
    };

    const handleCategoryChange = (text: { target: { value: SetStateAction<string>; }; }) => {
        setNewCategory(text.target.value);
    };

    const handleAmountChange = (number: { target: { value: SetStateAction<string>; }; }) =>{
        setNewAmount(number.target.value)
    }

    const handleDeleteExpense = (index: number) => {
        setExpenses((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEditExpense = (index: number) => {
        const expenseToEdit = expenses[index];
        setEditingIndex(index);
        setEditedCategory(expenseToEdit.name);
        setEditedAmount(expenseToEdit.value.toString());
    };

    const handleSaveEdit = () => {
        if (editingIndex === null) return;
        const amount = parseFloat(editedAmount);
        if (isNaN(amount) || amount <= 0) return;

        const updatedExpenses = [...expenses];
        updatedExpenses[editingIndex] = {
            name: editedCategory,
            value: amount,
        };

        setExpenses(updatedExpenses);
        setEditingIndex(null);
        setEditedCategory("");
        setEditedAmount("");
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    const total = expenses.reduce((sum, e) => sum + e.value, 0);

    const BackButton = () => (
        <button
            className=" relative top-16  bg-white text-green-800 px-4 py-2 rounded-2xl shadow hover:bg-gray-200"
            onClick={() => router.push("/budget_dashboard")}
        >
            ⬅ Back
        </button>
    );

    if (!isClient) return null;

    return (
        <main className="min-h-screen flex flex-col">
            <Component />
            <div className="max-w-5xl w-full mx-auto  mt-4">
                <BackButton />
            </div>



            <div className="flex-1 flex items-center justify-center px-6 pb-6">
                <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-dark-green mb-6">Monthly Expenses</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenses}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {expenses.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-dark-green mb-2">
                                    Add New Budget Category
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Select id="categories" value={newCategory} onChange={handleCategoryChange} required>
                                        <option disabled selected value="">
                                            -- Select a category --
                                        </option>
                                        <option>Housing/Utilities</option>
                                        <option>Transportation</option>
                                        <option>Food</option>
                                        <option>Healthcare</option>
                                        <option>Debt</option>
                                        <option>Savings</option>
                                        <option>Personal</option>    
                                        <option>Miscellaneous</option>   
                                    </Select>
                                    {/**                                     <input
                                        type="text"
                                        placeholder="Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="p-2 border rounded-md flex-1"
                                    />
*/}
                                    <TextInput id="amount" type="number" placeholder="Amount" value={newAmount} min= "0" onChange={handleAmountChange}required />

                                    {/*                                 <input
                                        type="number"
                                        min="0"
                                        placeholder="Amount"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                        className="p-2 border rounded-md flex-1"
                                    />*/}
   
                                    <Button
                                        onClick={handleAddExpense}
                                        className=" text-white px-4 py-2 rounded-md"
                                    >
                                        Add
                                    </Button>
                                 </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-dark-green mb-2">Breakdown</h3>
                                <ul className="space-y-2">
                                    {expenses.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center border-b pb-1 text-blue-gray"
                                        >
                                            {editingIndex === index ? (
                                                <div className="flex gap-2 w-full">
                                                    <input
                                                        type="text"
                                                        value={editedCategory}
                                                        onChange={(e) => setEditedCategory(e.target.value)}
                                                        className="p-2 border rounded-md flex-1"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={editedAmount}
                                                        onChange={(e) => setEditedAmount(e.target.value)}
                                                        className="p-2 border rounded-md w-24"
                                                    />
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="bg-dark-green text-white px-3 py-1 rounded-md hover:bg-green-800"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="inline-block w-[120px]">{item.name}</span>
                                                    <span>{formatCurrency(item.value)}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditExpense(index)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExpense(index)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 text-dark-green font-semibold">
                                    Total: {formatCurrency(total)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>

    );
};

export default ExpensesPage;
