

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
import { Label, Select, TextInput, Button, Modal} from "flowbite-react";
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
    const [expenses, setExpenses] = useState<{ id: string; name: string; value: number }[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedCategory, setEditedCategory] = useState("");
    const [editedAmount, setEditedAmount] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const COLORS = ["#4CAF50", "#81C784", "#388E3C", "#A5D6A7", "#2E7D32"];
    const LOCAL_STORAGE_KEY = "budget_expenses";

    const [isClient, setIsClient] = useState(false);

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
            console.log("Fetched budgets:", data); // DEBUG: See what backend sends
    
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


    useEffect(() => {
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

        if (!token) {
            router.push('/');
        } else {
            setUserToken(token);
            setLoading(false);
            fetchExpenses(token);
        }
    }, [router]);

    
    useEffect(() => {
        setIsClient(true);
    }, []);


    // Save to localStorage whenever expenses change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
    }, [expenses]);

    const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newCategory || !newAmount || !userToken) {
            console.error("Missing category, amount, or userToken");
            return;
        }
    
        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount <= 0) {
            console.error("Invalid amount entered");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/budgets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    category: newCategory.toLowerCase(), 
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                    allocatedAmount: amount
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                setModalTitle("Budget Creation Failed");
                setModalMessage(errorData.message || response.statusText || "Failed to create budget. Please try again.");
                setShowModal(true);
                throw new Error("Failed to save budget");
            }
    
            console.log("Budget added successfully!");

            await fetchExpenses(userToken);
    
            // Update local state with the newly created budget
            setNewCategory("");
            setNewAmount("");
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };
    
    

    const handleCategoryChange = (text: { target: { value: SetStateAction<string>; }; }) => {
        setNewCategory(text.target.value);
    };

    const handleAmountChange = (number: { target: { value: SetStateAction<string>; }; }) =>{
        setNewAmount(number.target.value)
    }

    const handleDeleteExpense = async (index: number) => {
        if (!userToken) return;
    
        const budgetToDelete = expenses[index];
    
        try {
            const response = await fetch(`http://localhost:8080/api/budgets/${budgetToDelete.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${userToken}`,
                },
            });
    
            if (!response.ok) {
                setModalTitle("Budget Deletion Failed");
                setModalMessage(response.statusText || "Failed to delete budget. Please try again.");
                setShowModal(true);
                throw new Error("Failed to delete budget");
            }
    
            // After success, re-fetch budgets
            fetchExpenses(userToken);
    
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    const handleEditExpense = (index: number) => {
        const expenseToEdit = expenses[index];
        setEditingIndex(index);
        setEditedCategory(expenseToEdit.name);
        setEditedAmount(expenseToEdit.value.toString());
    };

    const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingIndex === null || !userToken) return;
        const amount = parseFloat(editedAmount);
        if (isNaN(amount) || amount <= 0) return;
    
        const budgetToUpdate = expenses[editingIndex];
    
        try {
            const response = await fetch(`http://localhost:8080/api/budgets/${budgetToUpdate.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    allocatedAmount: amount,
                    category: editedCategory,
                }),
            });
    
            if (!response.ok) {
                setModalTitle("Budget Update Failed");
                setModalMessage(response.statusText || "Failed to update budget. Please try again.");
                setShowModal(true);
                throw new Error("Failed to update budget");
            }
    
            // After success, re-fetch budgets from server
            fetchExpenses(userToken);
    
            // Reset editing state
            setEditingIndex(null);
            setEditedCategory("");
            setEditedAmount("");
    
        } catch (error) {
            console.error("Error saving budget:", error);
        }
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
          
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleAddExpense}>
                                    <Select id="categories" value={newCategory} onChange={handleCategoryChange} required>
                                        <option disabled value="">
                                            -- Select a category --
                                        </option>
                                        <option value= "housing">Housing/Utilities</option>
                                        <option value = "transportation">Transportation</option>
                                        <option value = "food">Food</option>
                                        <option value = "healthcare">Healthcare</option>
                                        <option value = "debt">Debt</option>
                                        <option value = "savings">Savings</option>
                                        <option value = "personal">Personal</option>
                                        <option value = "miscellaneous">Miscellaneous</option>
                                    </Select>
                                    {/**                                     <input
                                        type="text"
                                        placeholder="Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="p-2 border rounded-md flex-1"
                                    />
                                */}
                                    <TextInput id="amount" type="number" placeholder="Amount" value={newAmount} min= "0.01" step="0.01" onChange={handleAmountChange}required />
                                    {/*                                 <input
                                        type="number"
                                        min="0"
                                        placeholder="Amount"
                                        value={newAmount}
                                        onChange={(e) => setNewAmount(e.target.value)}
                                        className="p-2 border rounded-md flex-1"
                                    />*/}
                                    <Button
                                        type="submit"
                                        className=" text-white px-4 py-2 rounded-md"
                                    >
                                        Add
                                    </Button>
                                </form>
                                
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
                                                <form className="flex gap-2 w-full" onSubmit={handleSaveEdit}>
                                                    <input
                                                        type="text"
                                                        value={editedCategory}
                                                        readOnly
                                                        className="p-2 border rounded-md flex-1 bg-gray-100 cursor-not-allowed"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={editedAmount}
                                                        min="0.01"
                                                        step="0.01"
                                                        onChange={(e) => setEditedAmount(e.target.value)}
                                                        className="p-2 border rounded-md w-24"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-dark-green text-white px-3 py-1 rounded-md hover:bg-green-800"
                                                    >
                                                        Save
                                                    </button>
                                                </form>
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

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>{modalTitle}</Modal.Header>
        
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
        
                <Modal.Footer>
                    <Button className="bg-blue-gray font-bold hover:!bg-light-blue active:!bg-light-blue" onClick={() => setShowModal(false)}>OK</Button>
                </Modal.Footer>
            </Modal>
        </main>

    );
};

export default ExpensesPage;
