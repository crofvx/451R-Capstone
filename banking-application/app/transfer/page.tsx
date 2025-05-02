"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Component } from "../components/budgetToolbar";

export default function Transfer() {
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  
  useEffect(() => {
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

    if (!token) {
      router.push('/');
    } else {
      setUserToken(token);
    }
  }, [router]);




  const [view, setView] = useState("transferMoney"); // "home", "payBills", "transferMoney"
  const [transferData, setTransferData] = useState({
    sender: "checking",
    receiver: "saving",
    amount: "",
  });
  const [modalTitle, setModalTitle] = useState("Transfer Failed");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (transferData.receiver === transferData.sender) {
      setModalTitle("Transfer Failed");
      setModalMessage("From account and to account must be different");
      setShowModal(true);
      return;
    }

    if (isNaN(+transferData.amount) || +transferData.amount <= 0) {
      setModalTitle("Transfer Failed");
      setModalMessage(`${transferData.amount} is an invalid amount`);
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          sender: transferData.sender,
          receiver: transferData.receiver,
          amount: transferData.amount,
        }),
      });

      const errorData = await response.json();

      if (response.ok) {
        console.log("Transferred funds!");
        setModalTitle("Transfer Successful");
        setModalMessage(`Transferred $${(+transferData.amount).toFixed(2)} from ${transferData.sender} to ${transferData.receiver}.`);
        setShowModal(true);
      } else {
        console.error("Transfer failed:", response.statusText, errorData);

        if (errorData?.message?.toLowerCase().includes("insufficient funds")) {
          setModalTitle("Transfer Failed");
          setModalMessage(`Insufficient funds in ${transferData.sender} account`);
        } else {
          setModalTitle("Transfer Failed");
          setModalMessage(errorData.message || response.statusText || "Transfer failed");
        }

        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalTitle("Transfer Failed");
      setModalMessage("An error occurred. Please try again.");
      setShowModal(true);
    }
  };

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
    <main className="w-screen h-screen flex items-center justify-center relative">
      <Component/>
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
            onSubmit={handleTransfer}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                From Account
              </label>
              <select
                name="sender"
                className="w-full mt-1 p-2 border rounded"
                required
                onChange={handleSelectChange}
              >
                <option value="checking">Checking</option>
                <option value="saving">Savings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                To Account
              </label>
              <select
                name="receiver"
                className="w-full mt-1 p-2 border rounded"
                required
                onChange={handleSelectChange}
              >
                <option value="saving">Savings</option>
                <option value="checking">Checking</option>
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
                onChange={handleInputChange}
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
}
