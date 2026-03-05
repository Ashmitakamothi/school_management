"use client";
import React, { useEffect, useState } from "react";

interface Branch {
     _id: string;
     name: string;
     url: string;
}

export default function MultiBranchSettings() {
     const [branches, setBranches] = useState<Branch[]>([]);
     const [loading, setLoading] = useState(true);
     const [search, setSearch] = useState("");
     const [showModal, setShowModal] = useState(false);
     const [editBranch, setEditBranch] = useState<Branch | null>(null);
     const [form, setForm] = useState({ name: "", url: "" });
     const [saving, setSaving] = useState(false);

     const fetchBranches = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/multibranch/branch");
               if (res.ok) {
                    const data = await res.json();
                    setBranches(data);
               }
          } catch (e) {
               console.error(e);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => { fetchBranches(); }, []);

     const openAdd = () => {
          setEditBranch(null);
          setForm({ name: "", url: "" });
          setShowModal(true);
     };

     const openEdit = (branch: Branch) => {
          setEditBranch(branch);
          setForm({ name: branch.name, url: branch.url });
          setShowModal(true);
     };

     const handleSave = async () => {
          setSaving(true);
          try {
               const method = editBranch ? "PUT" : "POST";
               const url = editBranch ? `/api/multibranch/branch/${editBranch._id}` : "/api/multibranch/branch";
               const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
               });
               if (res.ok) {
                    setShowModal(false);
                    fetchBranches();
               }
          } catch (e) {
               console.error(e);
          } finally {
               setSaving(false);
          }
     };

     const handleDelete = async (id: string) => {
          if (!confirm("Are you sure you want to delete this branch?")) return;
          try {
               await fetch(`/api/multibranch/branch/${id}`, { method: "DELETE" });
               fetchBranches();
          } catch (e) {
               console.error(e);
          }
     };

     const filtered = branches.filter(
          (b) =>
               b.name.toLowerCase().includes(search.toLowerCase()) ||
               b.url.toLowerCase().includes(search.toLowerCase())
     );

     return (
          <>
               <div className="2xl:flex 2xl:space-x-[48px]">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         {/* Header */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6">
                              <h2 className="text-xl font-bold text-bgray-900 dark:text-white">Setting</h2>
                         </div>

                         {/* Table Card */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600">
                              <div className="flex flex-col space-y-5">
                                   {/* Top Bar */}
                                   <div className="flex justify-between items-center flex-wrap gap-4">
                                        {/* Search */}
                                        <div className="flex-1 max-w-xs border border-transparent focus-within:border-success-300 h-10 bg-bgray-100 dark:bg-darkblack-500 rounded-lg px-4 flex items-center gap-2">
                                             <svg className="stroke-bgray-500 flex-shrink-0" width="16" height="16" viewBox="0 0 21 22" fill="none">
                                                  <circle cx="9.80204" cy="10.6761" r="8.98856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M16.0537 17.3945L19.5777 20.9094" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                             </svg>
                                             <input
                                                  type="text"
                                                  value={search}
                                                  onChange={(e) => setSearch(e.target.value)}
                                                  placeholder="Search..."
                                                  className="w-full bg-transparent border-none focus:outline-none text-sm text-bgray-900 dark:text-white placeholder:text-bgray-500"
                                             />
                                        </div>

                                        {/* Right actions */}
                                        <div className="flex items-center gap-2">
                                             <button onClick={openAdd} className="px-4 py-2 flex items-center gap-2 text-white font-semibold bg-success-300 hover:bg-success-400 transition-all rounded-lg text-sm">
                                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                       <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                                  Add New
                                             </button>
                                        </div>
                                   </div>

                                   {/* Table */}
                                   {loading ? (
                                        <div className="text-center py-8 text-bgray-500">Loading...</div>
                                   ) : filtered.length === 0 ? (
                                        <div className="text-center py-8 text-bgray-500">No branches found. Add one to get started.</div>
                                   ) : (
                                        <div className="table-content w-full overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">Branch</span>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">URL</span>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0 text-right">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">Action</span>
                                                            </td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {filtered.map((branch) => (
                                                            <tr key={branch._id} className="border-b border-bgray-300 dark:border-darkblack-400 hover:bg-bgray-50 dark:hover:bg-darkblack-500 transition-colors">
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <p className="font-medium text-sm text-bgray-900 dark:text-bgray-50">{branch.name}</p>
                                                                 </td>
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <p className="font-normal text-sm text-bgray-600 dark:text-bgray-300">{branch.url}</p>
                                                                 </td>
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <div className="flex justify-end gap-2">
                                                                           <button onClick={() => openEdit(branch)} className="p-2 hover:bg-bgray-100 dark:hover:bg-darkblack-500 rounded transition-all">
                                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                                                     <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                           </button>
                                                                           <button onClick={() => handleDelete(branch._id)} className="p-2 hover:bg-bgray-100 dark:hover:bg-darkblack-500 rounded transition-all">
                                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                                                     <path d="M6 18L18 6M6 6L18 18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                           </button>
                                                                      </div>
                                                                 </td>
                                                            </tr>
                                                       ))}
                                                  </tbody>
                                             </table>
                                        </div>
                                   )}

                                   {/* Footer */}
                                   <div className="flex justify-between items-center">
                                        <span className="text-sm text-bgray-600 dark:text-bgray-300">
                                             Records: {filtered.length} of {branches.length}
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>

               {/* Add/Edit Modal */}
               {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                         <div className="bg-white dark:bg-darkblack-600 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                              <h3 className="text-lg font-bold text-bgray-900 dark:text-white mb-5">
                                   {editBranch ? "Edit Branch" : "Add New Branch"}
                              </h3>
                              <div className="space-y-4">
                                   <div>
                                        <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-1 block">Branch Name *</label>
                                        <input
                                             type="text"
                                             value={form.name}
                                             onChange={(e) => setForm({ ...form, name: e.target.value })}
                                             placeholder="e.g. Mount Carmel School 1"
                                             className="w-full px-4 py-3 bg-bgray-100 dark:bg-darkblack-500 rounded-lg border border-transparent focus:border-success-300 focus:outline-none text-sm text-bgray-900 dark:text-white"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-1 block">Branch URL *</label>
                                        <input
                                             type="text"
                                             value={form.url}
                                             onChange={(e) => setForm({ ...form, url: e.target.value })}
                                             placeholder="https://yourdomain.com/branch1/"
                                             className="w-full px-4 py-3 bg-bgray-100 dark:bg-darkblack-500 rounded-lg border border-transparent focus:border-success-300 focus:outline-none text-sm text-bgray-900 dark:text-white"
                                        />
                                   </div>
                              </div>
                              <div className="flex justify-end gap-3 mt-6">
                                   <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-bgray-300 dark:border-darkblack-400 text-sm text-bgray-600 dark:text-bgray-50 hover:bg-bgray-100 dark:hover:bg-darkblack-500 transition-all">
                                        Cancel
                                   </button>
                                   <button
                                        onClick={handleSave}
                                        disabled={saving || !form.name || !form.url}
                                        className="px-5 py-2.5 rounded-lg bg-success-300 hover:bg-success-400 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                        {saving ? "Saving..." : editBranch ? "Update" : "Add Branch"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
}