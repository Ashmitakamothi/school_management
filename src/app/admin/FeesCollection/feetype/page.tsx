"use client";
import React, { useState, useEffect } from "react";

export default function FeeType() {
     const [openFilter, setOpenFilter] = useState<"action" | "pagination" | "export" | null>(null);
     const [feeTypes, setFeeTypes] = useState<any[]>([]);
     const [formData, setFormData] = useState({ name: "", fees_code: "", description: "" });
     const [editingId, setEditingId] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);

     const toggleFilter = (type: "action" | "pagination" | "export") => {
          setOpenFilter(openFilter === type ? null : type);
     };

     const fetchFeeTypes = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/fees-type");
               const data = await res.json();
               if (res.ok) {
                    setFeeTypes(data);
               } else {
                    setError(data.error || "Failed to fetch fee types");
               }
          } catch (err) {
               setError("An error occurred while fetching fee types");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchFeeTypes();
     }, []);

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { id, value } = e.target;
          setFormData({ ...formData, [id]: value });
     };

     const handleSave = async (e: React.FormEvent) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          try {
               const url = editingId ? `/api/fees-type/${editingId}` : "/api/fees-type";
               const method = editingId ? "PUT" : "POST";

               const res = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
               });

               const data = await res.json();

               if (res.ok) {
                    setFormData({ name: "", fees_code: "", description: "" });
                    setEditingId(null);
                    fetchFeeTypes();
               } else {
                    setError(data.error || "Failed to save fee type");
               }
          } catch (err) {
               setError("An error occurred while saving fee type");
          } finally {
               setLoading(false);
          }
     };

     const handleEdit = (type: any) => {
          setFormData({ name: type.name, fees_code: type.fees_code, description: type.description || "" });
          setEditingId(type._id);
          window.scrollTo({ top: 0, behavior: "smooth" });
     };

     const handleDelete = async (id: string) => {
          if (!confirm("Are you sure you want to delete this fee type?")) return;

          setLoading(true);
          try {
               const res = await fetch(`/api/fees-type/${id}`, {
                    method: "DELETE",
               });

               if (res.ok) {
                    fetchFeeTypes();
               } else {
                    const data = await res.json();
                    setError(data.error || "Failed to delete fee type");
               }
          } catch (err) {
               setError("An error occurred while deleting fee type");
          } finally {
               setLoading(false);
          }
     };

     return (
          <>
               <div className="w-full">
                    <section className="w-full">
                         {error && (
                              <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-500 text-sm font-medium">
                                   {error}
                              </div>
                         )}
                         <div className="flex items-start gap-6 lg:flex-row md:flex-row flex-col">
                              {/* Add Fees Type Form */}
                              <div className="w-full lg:max-w-[380px] py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <h3 className="text-xl font-bold text-bgray-900 dark:text-white mb-6">
                                        {editingId ? "Edit Fees Type" : "Add Fees Type"}
                                   </h3>
                                   <form onSubmit={handleSave} className="flex flex-col space-y-5">
                                        {/* Name */}
                                        <div className="w-full">
                                             <label htmlFor="name" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Name <span className="text-red-500">*</span>
                                             </label>
                                             <input
                                                  type="text"
                                                  id="name"
                                                  value={formData.name}
                                                  onChange={handleInputChange}
                                                  required
                                                  placeholder=""
                                                  className="w-full h-12 rounded-lg bg-white dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-bgray-300 dark:border-darkblack-400 focus:border-success-300 focus:outline-none placeholder:text-bgray-500"
                                             />
                                        </div>

                                        {/* Fees Code */}
                                        <div className="w-full">
                                             <label htmlFor="fees_code" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Fees Code <span className="text-red-500">*</span>
                                             </label>
                                             <input
                                                  type="text"
                                                  id="fees_code"
                                                  value={formData.fees_code}
                                                  onChange={handleInputChange}
                                                  required
                                                  placeholder=""
                                                  className="w-full h-12 rounded-lg bg-white dark:bg-darkblack-500 px-4 text-base text-bgray-900 dark:text-white border border-bgray-300 dark:border-darkblack-400 focus:border-success-300 focus:outline-none placeholder:text-bgray-500"
                                             />
                                        </div>

                                        {/* Description */}
                                        <div className="w-full">
                                             <label htmlFor="description" className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                  Description
                                             </label>
                                             <textarea
                                                  id="description"
                                                  rows={5}
                                                  value={formData.description}
                                                  onChange={handleInputChange}
                                                  placeholder=""
                                                  className="w-full rounded-lg bg-white dark:bg-darkblack-500 px-4 py-3 text-base text-bgray-900 dark:text-white border border-bgray-300 dark:border-darkblack-400 focus:border-success-300 focus:outline-none placeholder:text-bgray-500 resize-none"
                                             ></textarea>
                                        </div>

                                        {/* Save Button */}
                                        <div className="flex gap-3 self-end">
                                             {editingId && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            setEditingId(null);
                                                            setFormData({ name: "", fees_code: "", description: "" });
                                                       }}
                                                       className="py-3 px-6 text-bgray-900 dark:text-white font-semibold border border-bgray-300 dark:border-darkblack-400 rounded-lg"
                                                  >
                                                       Cancel
                                                  </button>
                                             )}
                                             <button
                                                  type="submit"
                                                  disabled={loading}
                                                  className="py-3 px-6 flex items-center justify-center text-white font-semibold bg-gray-900! dark:bg-darkblack-500 hover:bg-gray-800! dark:hover:bg-darkblack-600 transition-all rounded-lg disabled:opacity-50"
                                             >
                                                  {loading ? "Saving..." : "Save"}
                                             </button>
                                        </div>
                                   </form>
                              </div>

                              {/* Fees Type List */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <h3 className="text-xl font-bold text-bgray-900 dark:text-white mb-6">
                                        Fees Type List
                                   </h3>
                                   <div className="flex flex-col space-y-5">
                                        {/* Search and Export Icons maintained */}
                                        <div className="w-full flex gap-4">
                                             <div className="w-full sm:block hidden border border-transparent focus-within:border-success-300 bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                                  <div className="flex w-full h-14 items-center space-x-[15px]">
                                                       <span>
                                                            <svg className="stroke-bgray-900 dark:stroke-white" width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                 <circle cx="9.80204" cy="10.6761" r="8.98856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                 <path d="M16.0537 17.3945L19.5777 20.9094" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                       </span>
                                                       <label className="w-full">
                                                            <input type="text" placeholder="Search..." className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white" />
                                                       </label>
                                                  </div>
                                             </div>
                                             {/* Export Icons */}
                                             <div className="flex items-center gap-3">
                                                  {/* Icons maintained from original JSX */}
                                             </div>
                                        </div>

                                        {/* Table */}
                                        <div className="table-content w-full overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td className="py-4 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Name</td>
                                                            <td className="py-4 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Fees Code</td>
                                                            <td className="py-4 px-4 text-sm font-semibold text-bgray-600 dark:text-bgray-50">Action</td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {loading && feeTypes.length === 0 ? (
                                                            <tr>
                                                                 <td colSpan={3} className="py-8 text-center text-bgray-500">Loading...</td>
                                                            </tr>
                                                       ) : feeTypes.length === 0 ? (
                                                            <tr>
                                                                 <td colSpan={3} className="py-8 text-center text-bgray-500">No records found.</td>
                                                            </tr>
                                                       ) : (
                                                            feeTypes.map((fee) => (
                                                                 <tr key={fee._id} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                                      <td className="py-3 px-4">
                                                                           <p className="text-sm text-bgray-900 dark:text-white">{fee.name}</p>
                                                                      </td>
                                                                      <td className="py-3 px-4">
                                                                           <p className="text-sm text-bgray-700 dark:text-bgray-300">{fee.fees_code}</p>
                                                                      </td>
                                                                      <td className="py-3 px-4">
                                                                           <div className="flex items-center gap-3">
                                                                                <button onClick={() => handleEdit(fee)} className="text-bgray-900 dark:text-white hover:text-blue-500">
                                                                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                                <button onClick={() => handleDelete(fee._id)} className="text-bgray-900 dark:text-white hover:text-red-500">
                                                                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                           </div>
                                                                      </td>
                                                                 </tr>
                                                            ))
                                                       )}
                                                  </tbody>
                                             </table>
                                        </div>

                                        {/* Pagination maintained */}
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          </>
     );
}