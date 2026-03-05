"use client";
import React, { useEffect, useState } from "react";

export default function StudentCategory() {
     const [categories, setCategories] = useState<any[]>([]);
     const [newCategory, setNewCategory] = useState("");
     const [editingId, setEditingId] = useState<string | null>(null);
     const [editValue, setEditValue] = useState("");
     const [openFilter, setOpenFilter] = useState<string | null>(null);

     const fetchCategories = async () => {
          const res = await fetch("/api/student-categories");
          if (res.ok) setCategories(await res.json());
     };

     useEffect(() => {
          fetchCategories();
     }, []);

     const handleDelete = async (category: string) => {
          if (confirm("Are you sure you want to delete this category?")) {
               try {
                    await fetch(`/api/student-categories/${encodeURIComponent(category)}`, { method: "DELETE" });
                    fetchCategories();
               } catch (error) {
                    console.error("Error deleting category:", error);
               }
          }
     };

     const toggleFilter = (type: string) => {
          setOpenFilter(openFilter === type ? null : type);
     };

     const handleAddCategory = async () => {
          if (!newCategory) return;
          const res = await fetch("/api/student-categories", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ category: newCategory })
          });
          if (res.ok) {
               setNewCategory("");
               fetchCategories();
          }
     };

     const handleEditClick = (cat: any) => {
          setEditingId(cat._id);
          setEditValue(cat.category);
          setOpenFilter(null);
     };

     const handleUpdateCategory = async () => {
          if (!editingId || !editValue) return;
          const originalCategory = categories.find(c => c._id === editingId)?.category;
          const res = await fetch(`/api/student-categories/${encodeURIComponent(originalCategory)}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ category: editValue })
          });
          if (res.ok) {
               setEditingId(null);
               setEditValue("");
               fetchCategories();
          }
     };

     return (
          <>
               <div className="2xl:flex 2xl:space-x-12">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         <div className="flex items-start gap-6 lg:flex-row md:flex-row flex-col">
                              {/* Left Side: Add Category Form */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600 max-w-[320px]">
                                   <div className="flex flex-col space-y-5">
                                        <h3 className="text-lg font-bold text-bgray-900 dark:text-white">
                                             {editingId ? "Edit Category" : "Add Category"}
                                        </h3>
                                        <div className="w-full space-y-4">
                                             <div className="w-full border border-transparent focus-within:border-success-300 bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                                  <div className="flex w-full h-[50px] items-center space-x-[15px]">
                                                       <span>
                                                            <svg className="stroke-bgray-900 dark:stroke-white" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                 <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                 <path d="M12 8V16M8 12H16" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                       </span>
                                                       <label className="w-full">
                                                            <input
                                                                 type="text"
                                                                 placeholder="Category Name"
                                                                 value={editingId ? editValue : newCategory}
                                                                 onChange={(e) => editingId ? setEditValue(e.target.value) : setNewCategory(e.target.value)}
                                                                 className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            />
                                                       </label>
                                                  </div>
                                             </div>
                                             <div className="flex gap-2">
                                                  {editingId && (
                                                       <button
                                                            type="button"
                                                            onClick={() => { setEditingId(null); setEditValue(""); }}
                                                            className="py-3 px-4 flex items-center justify-center text-bgray-600 font-bold bg-bgray-100 hover:bg-bgray-200 transition-all rounded-lg w-full"
                                                       >
                                                            Cancel
                                                       </button>
                                                  )}
                                                  <button
                                                       type="button"
                                                       onClick={editingId ? handleUpdateCategory : handleAddCategory}
                                                       className="py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full"
                                                  >
                                                       {editingId ? "Update" : "Add Category"}
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Right Side: Category List Table */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <div className="flex flex-col space-y-5">
                                        <div className="w-full flex h-14 space-x-4 items-center justify-between">
                                             <div className="relative flex-1 max-w-[400px]">
                                                  <div className="w-full border border-transparent focus-within:border-success-300 h-10 bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                                       <div className="flex w-full h-full items-center space-x-[15px]">
                                                            <span>
                                                                 <svg className="stroke-bgray-900 dark:stroke-white" width="18" height="18" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                      <circle cx="9.80204" cy="10.6761" r="8.98856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                      <path d="M16.0537 17.3945L19.5777 20.9094" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                 </svg>
                                                            </span>
                                                            <label className="w-full">
                                                                 <input
                                                                      type="text"
                                                                      placeholder="Search Categories..."
                                                                      className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 dark:bg-darkblack-500 dark:text-white"
                                                                 />
                                                            </label>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="relative">
                                                  <button
                                                       type="button"
                                                       className="h-10 rounded-lg bg-bgray-200 px-4 flex justify-between items-center relative dark:bg-darkblack-500"
                                                       onClick={() => toggleFilter("export")}
                                                  >
                                                       <span className="text-base text-bgray-500 mr-2">Export</span>
                                                       <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                                                            <path d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>
                                                  <div className={`rounded-lg w-[120px] shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-12 overflow-hidden transition-all ${openFilter === "export" ? "block" : "hidden"}`}>
                                                       <ul>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 dark:hover:bg-darkblack-600 font-semibold">Excel</li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 dark:hover:bg-darkblack-600 font-semibold">PDF</li>
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="table-content w-full min-h-[40vh] overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <th className="py-5 px-6 xl:px-0 text-left text-base font-semibold text-bgray-600 dark:text-bgray-50">Category Name</th>
                                                            <th className="py-5 px-6 xl:px-0 text-right text-base font-semibold text-bgray-600 dark:text-bgray-50 pr-4">Action</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {categories.length === 0 ? (
                                                            <tr>
                                                                 <td colSpan={2} className="text-center py-10 text-bgray-500">No categories found.</td>
                                                            </tr>
                                                       ) : categories.map((cat, idx) => (
                                                            <tr key={cat._id || idx} className="border-b border-bgray-300 dark:border-darkblack-400 hover:bg-bgray-50 dark:hover:bg-darkblack-500 transition-all">
                                                                 <td className="py-5 px-6 xl:px-0">
                                                                      <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                                           {cat.category}
                                                                      </p>
                                                                 </td>
                                                                 <td className="py-5 px-6 xl:px-0 text-right">
                                                                      <div className="relative inline-block pr-4">
                                                                           <button type="button" onClick={() => toggleFilter(`action-${cat._id || idx}`)}>
                                                                                <svg width="18" height="4" viewBox="0 0 18 4" fill="none">
                                                                                     <circle cx="2" cy="2" r="2" fill="#A0AEC0" />
                                                                                     <circle cx="9" cy="2" r="2" fill="#A0AEC0" />
                                                                                     <circle cx="16" cy="2" r="2" fill="#A0AEC0" />
                                                                                </svg>
                                                                           </button>
                                                                           <div className={`rounded-lg shadow-lg bg-white dark:bg-darkblack-500 min-w-[120px] absolute right-0 z-10 top-8 overflow-hidden transition-all ${openFilter === `action-${cat._id || idx}` ? "block" : "hidden"}`}>
                                                                                <ul>
                                                                                     <li
                                                                                          onClick={() => handleEditClick(cat)}
                                                                                          className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 dark:hover:bg-darkblack-600 font-semibold"
                                                                                     >
                                                                                          Edit
                                                                                     </li>
                                                                                     <li
                                                                                          onClick={() => handleDelete(cat.category)}
                                                                                          className="text-sm text-red-500 cursor-pointer px-5 py-2 hover:bg-bgray-100 dark:hover:bg-darkblack-600 font-semibold"
                                                                                     >
                                                                                          Delete
                                                                                     </li>
                                                                                </ul>
                                                                           </div>
                                                                      </div>
                                                                 </td>
                                                            </tr>
                                                       ))}
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
