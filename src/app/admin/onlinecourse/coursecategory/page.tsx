"use client";
import React, { useEffect, useState } from "react";

export default function AddCategory() {
     const [openFilter, setOpenFilter] = useState<"action" | "pagination" | "export" | null>(null);
     const [categoryName, setCategoryName] = useState("");
     const [categories, setCategories] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);
     const [editingId, setEditingId] = useState<string | null>(null);

     const fetchCategories = async () => {
          setLoading(true);
          try {
               const res = await fetch("/api/online-course/category");
               if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
               }
          } catch (error) {
               console.error("Failed to fetch categories");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchCategories();
     }, []);

     const toggleFilter = (type: "action" | "pagination" | "export") => {
          setOpenFilter(openFilter === type ? null : type);
     };

     const handleSaveCategory = async () => {
          if (!categoryName.trim()) return;
          try {
               const method = editingId ? "PUT" : "POST";
               const body = editingId ? { _id: editingId, name: categoryName } : { name: categoryName };
               const res = await fetch("/api/online-course/category", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
               });
               if (res.ok) {
                    setCategoryName("");
                    setEditingId(null);
                    fetchCategories();
               }
          } catch (error) {
               console.error("Failed to save category");
          }
     };

     const handleEditCategory = (category: any) => {
          setEditingId(category._id);
          setCategoryName(category.name);
     };

     const handleDeleteCategory = async (id: string) => {
          if (confirm("Are you sure you want to delete this category?")) {
               try {
                    const res = await fetch(`/api/online-course/category?id=${id}`, {
                         method: "DELETE"
                    });
                    if (res.ok) {
                         fetchCategories();
                    }
               } catch (error) {
                    console.error("Failed to delete category");
               }
          }
     };

     return (
          <>
               <div className="2xl:flex 2xl:space-x-12">
                    <section className="2xl:flex-1">
                         <div className="flex items-start gap-6 lg:flex-row md:flex-row flex-col">
                              {/* Add Category Section */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600 lg:max-w-[400px]">
                                   <h2 className="text-xl font-bold text-bgray-900 dark:text-white mb-5">{editingId ? "Edit Category" : "Add Category"}</h2>
                                   <div className="flex flex-col space-y-5">
                                        <div className="w-full space-y-4">
                                             <div className="w-full">
                                                  <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                                       Category Name <span className="text-red-500">*</span>
                                                  </label>
                                                  <input
                                                       type="text"
                                                       value={categoryName}
                                                       onChange={(e) => setCategoryName(e.target.value)}
                                                       placeholder="Enter category name"
                                                       className="w-full px-4 py-3 border border-bgray-300 dark:border-darkblack-400 rounded-lg focus:outline-none focus:border-success-300 bg-white dark:bg-darkblack-500 text-bgray-900 dark:text-white"
                                                  />
                                             </div>
                                             <div className="flex gap-2">
                                                  {editingId && (
                                                       <button
                                                            type="button"
                                                            onClick={() => { setEditingId(null); setCategoryName(""); }}
                                                            className="py-3 px-4 flex items-center justify-center text-bgray-600 font-bold bg-bgray-100 hover:bg-bgray-200 transition-all rounded-lg w-full"
                                                       >
                                                            Cancel
                                                       </button>
                                                  )}
                                                  <button
                                                       type="button"
                                                       onClick={handleSaveCategory}
                                                       className="py-3.5 flex items-center justify-center text-white font-bold bg-bgray-900 hover:bg-bgray-800 transition-all rounded-lg w-full dark:bg-darkblack-500 dark:hover:bg-darkblack-400"
                                                  >
                                                       {editingId ? "Update" : "Save"}
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Category List Section */}
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <h2 className="text-xl font-bold text-bgray-900 dark:text-white mb-5">Category List</h2>
                                   <div className="flex flex-col space-y-5">
                                        <div className="w-full flex h-14 space-x-4">
                                             <div className="w-full sm:block hidden border border-transparent focus-within:border-success-300 h-full bg-bgray-100 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                                  <div className="flex w-full h-full items-center space-x-[15px]">
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
                                                                 className="search-input w-full bg-bgray-100 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            />
                                                       </label>
                                                  </div>
                                             </div>

                                             <div className="relative">
                                                  <button
                                                       type="button"
                                                       className="h-full rounded-lg bg-bgray-100 px-4 flex justify-between items-center gap-2 dark:bg-darkblack-500"
                                                       onClick={() => toggleFilter("export")}
                                                  >
                                                       Filter
                                                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13 11H18L12 3V8C12 9.65685 13.3431 11 15 11H13Z" className="stroke-bgray-900 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M13 11C13 9.34315 14.3431 8 16 8H18" className="stroke-bgray-900 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M19 9L12 16L5 9" className="stroke-bgray-900 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </button>

                                                  <div
                                                       className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all min-w-[120px] ${openFilter === "export" ? "block" : "hidden"}`}
                                                  >
                                                       <ul>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold flex items-center gap-2">
                                                                 Copy
                                                            </li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold flex items-center gap-2">
                                                                 Excel
                                                            </li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold flex items-center gap-2">
                                                                 CSV
                                                            </li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold flex items-center gap-2">
                                                                 PDF
                                                            </li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold flex items-center gap-2">
                                                                 Print
                                                            </li>
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="table-content w-full min-h-[52vh] overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td className="py-5 px-6 xl:px-0">
                                                                 <div className="w-full flex space-x-2.5 items-center">
                                                                      <span className="text-base font-semibold text-bgray-600 dark:text-bgray-50">Category Name</span>
                                                                 </div>
                                                            </td>
                                                            <td className="py-5 px-6 xl:px-0 text-right pr-6">
                                                                 <span className="text-base font-semibold text-bgray-600 dark:text-bgray-50">Action</span>
                                                            </td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {loading ? (
                                                            <tr><td colSpan={2} className="py-10 text-center text-bgray-600 dark:text-bgray-50">Loading categories...</td></tr>
                                                       ) : categories.length > 0 ? (
                                                            categories.map((category) => (
                                                                 <tr key={category._id} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                                      <td className="py-5 px-6 xl:px-0">
                                                                           <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                                                {category.name}
                                                                           </p>
                                                                      </td>
                                                                      <td className="py-5 px-6 xl:px-0 text-right pr-6">
                                                                           <div className="flex justify-end gap-3">
                                                                                <button
                                                                                     type="button"
                                                                                     onClick={() => handleEditCategory(category)}
                                                                                     className="hover:text-success-300 transition-colors"
                                                                                     title="Edit"
                                                                                >
                                                                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" className="stroke-bgray-900 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" className="stroke-bgray-900 dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                                <button
                                                                                     type="button"
                                                                                     onClick={() => handleDeleteCategory(category._id)}
                                                                                     className="hover:text-red-500 transition-colors"
                                                                                     title="Delete"
                                                                                >
                                                                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                          <path d="M18 6L6 18M6 6l12 12" className="stroke-red-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                     </svg>
                                                                                </button>
                                                                           </div>
                                                                      </td>
                                                                 </tr>
                                                            ))
                                                       ) : (
                                                            <tr><td colSpan={2} className="py-10 text-center text-bgray-500">No categories found.</td></tr>
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