"use client";
import React, { useState, useEffect } from "react";

export default function Feemaster() {
     const [openFilter, setOpenFilter] = useState<"feesGroup" | "feesType" | "fineType" | "action" | "pagination" | "export" | null>(null);
     const [masters, setMasters] = useState<any[]>([]);
     const [groups, setGroups] = useState<any[]>([]);
     const [feeTypes, setFeeTypes] = useState<any[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [editingId, setEditingId] = useState<string | null>(null);

     const [formData, setFormData] = useState({
          fee_group: "",
          fee_type: "",
          due_date: "",
          amount: "",
          fine_type: "none" as "none" | "fixAmount" | "percentage" | "cumulative",
          fine_percentage: "",
          fine_amount: ""
     });

     const toggleFilter = (type: "feesGroup" | "feesType" | "fineType" | "action" | "pagination" | "export") => {
          setOpenFilter(openFilter === type ? null : type);
     };

     const fetchData = async () => {
          setLoading(true);
          try {
               const [mastersRes, groupsRes, typesRes] = await Promise.all([
                    fetch("/api/fees-master"),
                    fetch("/api/fees-group"),
                    fetch("/api/fees-type")
               ]);

               if (mastersRes.ok) setMasters(await mastersRes.json());
               if (groupsRes.ok) setGroups(await groupsRes.json());
               if (typesRes.ok) setFeeTypes(await typesRes.json());
          } catch (err) {
               setError("An error occurred while fetching data");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { id, name, value, type } = e.target;
          const field = id || name;
          setFormData({ ...formData, [field]: value });
     };

     const handleSave = async (e: React.FormEvent) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          try {
               const url = editingId ? `/api/fees-master/${editingId}` : "/api/fees-master";
               const method = editingId ? "PUT" : "POST";

               const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
               });

               if (res.ok) {
                    setFormData({
                         fee_group: "",
                         fee_type: "",
                         due_date: "",
                         amount: "",
                         fine_type: "none",
                         fine_percentage: "",
                         fine_amount: ""
                    });
                    setEditingId(null);
                    fetchData();
               } else {
                    const data = await res.json();
                    setError(data.error || "Failed to save record");
               }
          } catch (err) {
               setError("An error occurred while saving record");
          } finally {
               setLoading(false);
          }
     };

     const handleEdit = (master: any) => {
          setFormData({
               fee_group: master.fee_group?._id || master.fee_group,
               fee_type: master.fee_type?._id || master.fee_type,
               due_date: master.due_date ? new Date(master.due_date).toISOString().split("T")[0] : "",
               amount: master.amount.toString(),
               fine_type: master.fine_type,
               fine_percentage: master.fine_percentage?.toString() || "",
               fine_amount: master.fine_amount?.toString() || ""
          });
          setEditingId(master._id);
          window.scrollTo({ top: 0, behavior: "smooth" });
     };

     const handleDelete = async (id: string) => {
          if (!confirm("Are you sure you want to delete this record?")) return;
          setLoading(true);
          try {
               const res = await fetch(`/api/fees-master/${id}`, { method: "DELETE" });
               if (res.ok) {
                    fetchData();
               } else {
                    const data = await res.json();
                    setError(data.error || "Failed to delete record");
               }
          } catch (err) {
               setError("An error occurred while deleting record");
          } finally {
               setLoading(false);
          }
     };

     return (
          <>
               <div className="2xl:flex 2xl:space-x-12">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         <div className="flex items-start gap-6 lg:flex-row md:flex-row flex-col">
                              {/* Add Fees Master Form */}
                              <div className="w-full lg:max-w-[380px] py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <h3 className="text-xl font-bold text-bgray-900 dark:text-white mb-6">
                                        {editingId ? "Edit Fees Master" : "Add Fees Master"} : 2025-26
                                   </h3>
                                   <div className="flex flex-col space-y-5">
                                        {/* Fees Group */}
                                        <div className="w-full">
                                             <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Fees Group <span className="text-red-500">*</span>
                                             </label>
                                             <div className="relative">
                                                  <button
                                                       type="button"
                                                       className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 flex justify-between items-center border border-transparent focus:border-success-300"
                                                       onClick={() => toggleFilter("feesGroup")}
                                                  >
                                                       <span className={`text-base ${formData.fee_group ? "text-bgray-900 dark:text-white" : "text-bgray-500"}`}>
                                                            {groups.find(g => g._id === formData.fee_group)?.name || "Select"}
                                                       </span>
                                                       <span>
                                                            <svg
                                                                 width="21"
                                                                 height="21"
                                                                 viewBox="0 0 21 21"
                                                                 fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                 <path
                                                                      d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186"
                                                                      stroke="#A0AEC0"
                                                                      strokeWidth="2"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                 />
                                                            </svg>
                                                       </span>
                                                  </button>
                                                  <div
                                                       className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "feesGroup" ? "block" : "hidden"
                                                            }`}
                                                  >
                                                       <ul className="max-h-60 overflow-y-auto">
                                                            {groups.map((group) => (
                                                                 <li
                                                                      key={group._id}
                                                                      onClick={() => {
                                                                           setFormData({ ...formData, fee_group: group._id });
                                                                           setOpenFilter(null);
                                                                      }}
                                                                      className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold"
                                                                 >
                                                                      {group.name}
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Fees Type */}
                                        <div className="w-full">
                                             <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Fees Type <span className="text-red-500">*</span>
                                             </label>
                                             <div className="relative">
                                                  <button
                                                       type="button"
                                                       className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 flex justify-between items-center border border-transparent focus:border-success-300"
                                                       onClick={() => toggleFilter("feesType")}
                                                  >
                                                       <span className={`text-base ${formData.fee_type ? "text-bgray-900 dark:text-white" : "text-bgray-500"}`}>
                                                            {feeTypes.find(t => t._id === formData.fee_type)?.name || "Select"}
                                                       </span>
                                                       <span>
                                                            <svg
                                                                 width="21"
                                                                 height="21"
                                                                 viewBox="0 0 21 21"
                                                                 fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                 <path
                                                                      d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186"
                                                                      stroke="#A0AEC0"
                                                                      strokeWidth="2"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                 />
                                                            </svg>
                                                       </span>
                                                  </button>
                                                  <div
                                                       className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "feesType" ? "block" : "hidden"
                                                            }`}
                                                  >
                                                       <ul className="max-h-60 overflow-y-auto">
                                                            {feeTypes.map((type) => (
                                                                 <li
                                                                      key={type._id}
                                                                      onClick={() => {
                                                                           setFormData({ ...formData, fee_type: type._id });
                                                                           setOpenFilter(null);
                                                                      }}
                                                                      className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold"
                                                                 >
                                                                      {type.name}
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="w-full">
                                             <label htmlFor="due_date" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Due Date
                                             </label>
                                             <input
                                                  type="date"
                                                  id="due_date"
                                                  value={formData.due_date}
                                                  onChange={handleInputChange}
                                                  className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-transparent focus:border-success-300 focus:outline-none"
                                             />
                                        </div>

                                        {/* Amount */}
                                        <div className="w-full">
                                             <label htmlFor="amount" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Amount ($) <span className="text-red-500">*</span>
                                             </label>
                                             <input
                                                  type="number"
                                                  id="amount"
                                                  placeholder="0.00"
                                                  value={formData.amount}
                                                  onChange={handleInputChange}
                                                  className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-transparent focus:border-success-300 focus:outline-none placeholder:text-bgray-500"
                                             />
                                        </div>

                                        {/* Fine Type */}
                                        <div className="w-full">
                                             <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-3 block">
                                                  Fine Type
                                             </label>
                                             <div className="flex flex-col space-y-3">
                                                  <label className="flex items-center space-x-3 cursor-pointer">
                                                       <input
                                                            type="radio"
                                                            name="fineType"
                                                            value="none"
                                                            checked={formData.fine_type === "none"}
                                                            onChange={(e) => setFormData({ ...formData, fine_type: e.target.value as any })}
                                                            className="w-4 h-4 text-success-300 focus:ring-success-300 focus:ring-2"
                                                       />
                                                       <span className="text-sm text-bgray-900 dark:text-white font-medium">None</span>
                                                  </label>
                                                  <label className="flex items-center space-x-3 cursor-pointer">
                                                       <input
                                                            type="radio"
                                                            name="fineType"
                                                            value="fixAmount"
                                                            checked={formData.fine_type === "fixAmount"}
                                                            onChange={(e) => setFormData({ ...formData, fine_type: e.target.value as any })}
                                                            className="w-4 h-4 text-success-300 focus:ring-success-300 focus:ring-2"
                                                       />
                                                       <span className="text-sm text-bgray-900 dark:text-white font-medium">Fix Amount</span>
                                                  </label>
                                                  <label className="flex items-center space-x-3 cursor-pointer">
                                                       <input
                                                            type="radio"
                                                            name="fineType"
                                                            value="percentage"
                                                            checked={formData.fine_type === "percentage"}
                                                            onChange={(e) => setFormData({ ...formData, fine_type: e.target.value as any })}
                                                            className="w-4 h-4 text-success-300 focus:ring-success-300 focus:ring-2"
                                                       />
                                                       <span className="text-sm text-bgray-900 dark:text-white font-medium">Percentage</span>
                                                  </label>
                                                  <label className="flex items-center space-x-3 cursor-pointer">
                                                       <input
                                                            type="radio"
                                                            name="fineType"
                                                            value="cumulative"
                                                            checked={formData.fine_type === "cumulative"}
                                                            onChange={(e) => setFormData({ ...formData, fine_type: e.target.value as any })}
                                                            className="w-4 h-4 text-success-300 focus:ring-success-300 focus:ring-2"
                                                       />
                                                       <span className="text-sm text-bgray-900 dark:text-white font-medium">Cumulative</span>
                                                  </label>
                                             </div>
                                        </div>

                                        {/* Percentage and Fix Amount fields */}
                                        {(formData.fine_type === "percentage" || formData.fine_type === "fixAmount") && (
                                             <div className="w-full flex gap-4">
                                                  {formData.fine_type === "percentage" && (
                                                       <div className="w-full">
                                                            <label htmlFor="fine_percentage" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                                 Percentage (%) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="number"
                                                                 id="fine_percentage"
                                                                 placeholder="0"
                                                                 value={formData.fine_percentage}
                                                                 onChange={handleInputChange}
                                                                 className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-transparent focus:border-success-300 focus:outline-none placeholder:text-bgray-500"
                                                            />
                                                       </div>
                                                  )}
                                                  {formData.fine_type === "fixAmount" && (
                                                       <div className="w-full">
                                                            <label htmlFor="fine_amount" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                                 Fix Amount ($) <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                 type="number"
                                                                 id="fine_amount"
                                                                 placeholder="0.00"
                                                                 value={formData.fine_amount}
                                                                 onChange={handleInputChange}
                                                                 className="w-full h-12 rounded-lg bg-bgray-200 dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-transparent focus:border-success-300 focus:outline-none placeholder:text-bgray-500"
                                                            />
                                                       </div>
                                                  )}
                                             </div>
                                        )}

                                        {/* Save Button */}
                                        <div className="flex gap-4">
                                             {editingId && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            setEditingId(null);
                                                            setFormData({
                                                                 fee_group: "",
                                                                 fee_type: "",
                                                                 due_date: "",
                                                                 amount: "",
                                                                 fine_type: "none",
                                                                 fine_percentage: "",
                                                                 fine_amount: ""
                                                            });
                                                       }}
                                                       className="py-3.5 flex items-center justify-center text-bgray-900 dark:text-white font-bold bg-bgray-100 dark:bg-darkblack-500 hover:bg-bgray-200 dark:hover:bg-darkblack-400 transition-all rounded-lg flex-1"
                                                  >
                                                       Cancel
                                                  </button>
                                             )}
                                             <button
                                                  type="button"
                                                  onClick={handleSave}
                                                  disabled={loading}
                                                  className="py-3.5 flex items-center justify-center text-white font-bold bg-gray-500 dark:bg-gray-800 hover:bg-gray-800! dark:hover:bg-gray-600 transition-all rounded-lg flex-1 disabled:opacity-50"
                                             >
                                                  {loading ? "Saving..." : editingId ? "Update" : "Save"}
                                             </button>
                                        </div>
                                   </div>
                              </div>

                              {/* Fees Master List */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <h3 className="text-xl font-bold text-bgray-900 dark:text-white mb-6">
                                        Fees Master List : 2025-26
                                   </h3>
                                   <div className="flex flex-col space-y-5">
                                        {/* Search and Export */}
                                        <div className="w-full flex gap-4">
                                             <div className="w-full sm:block hidden border border-transparent focus-within:border-success-300 bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                                  <div className="flex w-full h-14 items-center space-x-[15px]">
                                                       <span>
                                                            <svg
                                                                 className="stroke-bgray-900 dark:stroke-white"
                                                                 width="21"
                                                                 height="22"
                                                                 viewBox="0 0 21 22"
                                                                 fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                 <circle
                                                                      cx="9.80204"
                                                                      cy="10.6761"
                                                                      r="8.98856"
                                                                      strokeWidth="1.5"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                 />
                                                                 <path
                                                                      d="M16.0537 17.3945L19.5777 20.9094"
                                                                      strokeWidth="1.5"
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                 />
                                                            </svg>
                                                       </span>
                                                       <label className="w-full">
                                                            <input
                                                                 type="text"
                                                                 placeholder="Search..."
                                                                 className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            />
                                                       </label>
                                                  </div>
                                             </div>

                                             {/* Export Icons */}
                                             <div className="flex items-center gap-3">
                                                  <button className="w-10 h-10 rounded-lg bg-bgray-200 dark:bg-darkblack-500 flex items-center justify-center hover:bg-bgray-300 dark:hover:bg-darkblack-400 transition-colors">
                                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 17C8 17 8 16 8 14C8 12 7 11 5 11H4M8 17V20M8 17H16M16 17C16 17 16 16 16 14C16 12 17 11 19 11H20M16 17V20M4 11V8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8V11M4 11H3M20 11H21" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                                  <button className="w-10 h-10 rounded-lg bg-bgray-200 dark:bg-darkblack-500 flex items-center justify-center hover:bg-bgray-300 dark:hover:bg-darkblack-400 transition-colors">
                                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                                  <button className="w-10 h-10 rounded-lg bg-bgray-200 dark:bg-darkblack-500 flex items-center justify-center hover:bg-bgray-300 dark:hover:bg-darkblack-400 transition-colors">
                                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                                  <button className="w-10 h-10 rounded-lg bg-bgray-200 dark:bg-darkblack-500 flex items-center justify-center hover:bg-bgray-300 dark:hover:bg-darkblack-400 transition-colors">
                                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7 21H17C18.1046 21 19 20.1046 19 19V9.41421C19 9.149 18.8946 8.89464 18.7071 8.70711L13.2929 3.29289C13.1054 3.10536 12.851 3 12.5858 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                                  <button className="w-10 h-10 rounded-lg bg-bgray-200 dark:bg-darkblack-500 flex items-center justify-center hover:bg-bgray-300 dark:hover:bg-darkblack-400 transition-colors">
                                                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L9 7M12 4L15 7" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                             </div>
                                        </div>

                                        {/* Table */}
                                        <div className="table-content w-full overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Fees Group</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Fees Code</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Amount</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Fine Type</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Due Date</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Per Day</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Days-Fine Amount</td>
                                                            <td className="py-5 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Action</td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {masters.length > 0 ? (
                                                            masters.map((master) => (
                                                                 <tr key={master._id} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                                      <td className="py-4 px-4 align-top">
                                                                           <p className="text-sm font-medium text-bgray-900 dark:text-white">
                                                                                {master.fee_group?.name || "N/A"}
                                                                           </p>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <div className="space-y-1">
                                                                                <p className="text-sm text-bgray-700 dark:text-bgray-300">
                                                                                     {master.fee_type?.name || "N/A"}
                                                                                </p>
                                                                           </div>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <p className="text-sm font-medium text-bgray-900 dark:text-white">${master.amount}</p>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <p className="text-sm text-bgray-700 dark:text-bgray-300">
                                                                                {master.fine_type === "none" ? "None" :
                                                                                     master.fine_type === "fixAmount" ? "Fix" :
                                                                                          master.fine_type === "percentage" ? "Percentage" : "Cumulative"}
                                                                           </p>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <p className="text-sm text-bgray-700 dark:text-bgray-300">
                                                                                {master.due_date ? new Date(master.due_date).toLocaleDateString() : "N/A"}
                                                                           </p>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <p className="text-sm text-bgray-700 dark:text-bgray-300">No</p>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <div className="space-y-1">
                                                                                {master.fine_type === "fixAmount" && (
                                                                                     <p className="text-sm text-bgray-700 dark:text-bgray-300">Fine: ${master.fine_amount}</p>
                                                                                )}
                                                                                {master.fine_type === "percentage" && (
                                                                                     <p className="text-sm text-bgray-700 dark:text-bgray-300">Fine: {master.fine_percentage}%</p>
                                                                                )}
                                                                                {master.fine_type === "cumulative" && (
                                                                                     <p className="text-sm text-bgray-700 dark:text-bgray-300">Cumulative</p>
                                                                                )}
                                                                                {master.fine_type === "none" && (
                                                                                     <p className="text-sm text-bgray-700 dark:text-bgray-300">N/A</p>
                                                                                )}
                                                                           </div>
                                                                      </td>
                                                                      <td className="py-4 px-4 align-top">
                                                                           <div className="flex items-center gap-3">
                                                                                <button onClick={() => handleEdit(master)} className="text-blue-500 hover:text-blue-600">
                                                                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                                <button onClick={() => handleDelete(master._id)} className="text-red-500 hover:text-red-600">
                                                                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M19 9L19 19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19L5 9M19 9L21 9M19 9L17 9M5 9L3 9M5 9L7 9M9 9V7C9 5.89543 9.89543 5 11 5H13C14.1046 5 15 5.89543 15 7V9M7 9L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                           </div>
                                                                      </td>
                                                                 </tr>
                                                            ))
                                                       ) : (
                                                            <tr>
                                                                 <td colSpan={8} className="py-10 text-center text-bgray-600 dark:text-bgray-50">
                                                                      {loading ? "Loading..." : "No Data Found"}
                                                                 </td>
                                                            </tr>
                                                       )}
                                                  </tbody>
                                             </table>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          </>
     );
}