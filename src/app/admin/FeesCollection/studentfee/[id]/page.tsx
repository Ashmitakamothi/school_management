"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StudentFeeDetail() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [note, setNote] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/student-fees/${id}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                setError("Failed to fetch fee details");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const handleCollectPayment = async () => {
        if (!selectedMaster || paymentAmount <= 0) return;

        try {
            const res = await fetch("/api/fees-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student: id,
                    fee_master: selectedMaster._id,
                    amount_paid: paymentAmount,
                    payment_mode: paymentMode,
                    date: new Date().toISOString().split("T")[0],
                    note: note
                })
            });

            if (res.ok) {
                setShowPaymentModal(false);
                fetchData(); // Refresh data
                alert("Payment recorded successfully!");
            }
        } catch (err) {
            alert("Failed to record payment");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Fee Details...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    const student = data?.student;
    const masters = data?.masters || [];
    const payments = data?.payments || [];

    // Calculate Paid vs Remaining for each master
    const getMasterStatus = (masterId: string) => {
        const totalPaid = payments
            .filter((p: any) => p.fee_master === masterId)
            .reduce((sum: number, p: any) => sum + p.amount_paid, 0);
        return totalPaid;
    };

    return (
        <div className="p-6 bg-white dark:bg-darkblack-600 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-bgray-900 dark:text-white">
                    Collect Fees: {student?.fname} {student?.lname}
                </h2>
                <div className="text-sm text-bgray-600 dark:text-bgray-50">
                    Admission No: <span className="font-bold">{student?.admission_no}</span> |
                    Class: <span className="font-bold">{student?.class} ({student?.section})</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50">Fees Group</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50">Fees Type</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50">Due Date</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50 text-right">Amount (₹)</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50 text-right">Paid (₹)</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50 text-right">Balance (₹)</th>
                            <th className="py-4 px-2 text-bgray-600 dark:text-bgray-50">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {masters.map((master: any) => {
                            const paid = getMasterStatus(master._id);
                            const balance = master.amount - paid;
                            return (
                                <tr key={master._id} className="border-b border-bgray-300 dark:border-darkblack-400 hover:bg-bgray-50 dark:hover:bg-darkblack-500">
                                    <td className="py-4 px-2 font-medium">{master.fee_group?.name}</td>
                                    <td className="py-4 px-2">{master.fee_type?.name}</td>
                                    <td className="py-4 px-2">{master.due_date}</td>
                                    <td className="py-4 px-2 text-right">₹{master.amount.toFixed(2)}</td>
                                    <td className="py-4 px-2 text-right text-success-300">₹{paid.toFixed(2)}</td>
                                    <td className="py-4 px-2 text-right text-red-500 font-bold">₹{balance.toFixed(2)}</td>
                                    <td className="py-4 px-2">
                                        {balance > 0 ? (
                                            <button
                                                onClick={() => {
                                                    setSelectedMaster(master);
                                                    setPaymentAmount(balance);
                                                    setShowPaymentModal(true);
                                                }}
                                                className="bg-success-300 text-white px-3 py-1 rounded text-sm hover:bg-success-400"
                                            >
                                                + Collect
                                            </button>
                                        ) : (
                                            <span className="text-success-300 text-sm font-bold">Paid</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Simple Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-darkblack-600 p-8 rounded-lg w-[400px]">
                        <h3 className="text-xl font-bold mb-4">Record Payment</h3>
                        <p className="text-sm text-bgray-600 mb-4">
                            Collecting for: <span className="font-bold">{selectedMaster?.fee_group?.name} - {selectedMaster?.fee_type?.name}</span>
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount to Pay</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    className="w-full p-2 border rounded dark:bg-darkblack-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                                <select
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-darkblack-500"
                                >
                                    <option>Cash</option>
                                    <option>Cheque</option>
                                    <option>Online</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Note</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full p-2 border rounded dark:bg-darkblack-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-bgray-600">Cancel</button>
                            <button onClick={handleCollectPayment} className="px-4 py-2 bg-success-300 text-white rounded">Submit Payment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
