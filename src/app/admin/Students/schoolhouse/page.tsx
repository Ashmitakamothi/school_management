"use client";
import React, { useEffect, useState } from "react";

export default function SchoolHouse() {
     const [houses, setHouses] = useState<any[]>([]);
     const [newHouse, setNewHouse] = useState({ house_name: "", description: "" });
     const [editingId, setEditingId] = useState<string | null>(null);
     const [editValue, setEditValue] = useState({ house_name: "", description: "" });
     const [openFilter, setOpenFilter] = useState<string | null>(null);

     const fetchHouses = async () => {
          try {
               const res = await fetch("/api/student-houses");
               if (res.ok) setHouses(await res.json());
          } catch (error) {
               console.error("Error fetching houses:", error);
          }
     };

     const handleDelete = async (houseName: string) => {
          if (confirm("Are you sure you want to delete this house?")) {
               try {
                    await fetch(`/api/student-houses/${encodeURIComponent(houseName)}`, { method: "DELETE" });
                    fetchHouses();
               } catch (error) {
                    console.error("Error deleting house:", error);
               }
          }
     };

     const toggleFilter = (type: string) => {
          setOpenFilter(openFilter === type ? null : type);
     };

     useEffect(() => {
          fetchHouses();
     }, []);

     const handleAddHouse = async () => {
          if (!newHouse.house_name) return;
          try {
               const res = await fetch("/api/student-houses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newHouse)
               });
               if (res.ok) {
                    setNewHouse({ house_name: "", description: "" });
                    fetchHouses();
               } else {
                    const errData = await res.json();
                    alert(errData.error || "Failed to add house");
               }
          } catch (error) {
               console.error("Error adding house:", error);
          }
     };

     const handleEditClick = (house: any) => {
          setEditingId(house._id);
          setEditValue({ house_name: house.house_name, description: house.description || "" });
          setOpenFilter(null);
     };

     const handleUpdateHouse = async () => {
          if (!editingId || !editValue.house_name) return;
          const originalHouse = houses.find(h => h._id === editingId)?.house_name;
          try {
               const res = await fetch(`/api/student-houses/${encodeURIComponent(originalHouse)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editValue)
               });
               if (res.ok) {
                    setEditingId(null);
                    setEditValue({ house_name: "", description: "" });
                    fetchHouses();
               } else {
                    const errData = await res.json();
                    alert(errData.error || "Failed to update house");
               }
          } catch (error) {
               console.error("Error updating house:", error);
          }
     };
     return (
          <>
               <div className="2xl:flex 2xl:space-x-12">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">

                         <div className="flex items-start gap-6 lg:flex-row md:flex-row flex-col">
                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600 max-w-[320px]">
                                   <div className="flex flex-col space-y-5">
                                        <h3 className="text-lg font-bold text-bgray-900 dark:text-white">
                                             {editingId ? "Edit School House" : "Add School House"}
                                        </h3>
                                        <div className="w-full space-y-4">
                                             <div
                                                  className="w-full sm:block hidden border border-transparent focus-within:border-success-300 bg-bgray-200 dark:bg-darkblack-500 rounded-lg"
                                             >
                                                  <div
                                                       className="flex w-full h-full items-center space-x-[15px] px-4"
                                                  >
                                                       <label className="w-full">
                                                            <input
                                                                 type="text"
                                                                 placeholder="House Name"
                                                                 value={editingId ? editValue.house_name : newHouse.house_name}
                                                                 onChange={(e) => editingId ? setEditValue({ ...editValue, house_name: e.target.value }) : setNewHouse({ ...newHouse, house_name: e.target.value })}
                                                                 className="search-input w-full h-[50px] bg-bgray-200 border-none focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            />
                                                       </label>
                                                  </div>
                                             </div>
                                             <div
                                                  className="w-full sm:block hidden border border-transparent focus-within:border-success-300 bg-bgray-200 dark:bg-darkblack-500 rounded-lg"
                                             >
                                                  <div
                                                       className="flex w-full h-full items-center space-x-[15px] px-4 py-2"
                                                  >
                                                       <label className="w-full">
                                                            <textarea
                                                                 placeholder="Description"
                                                                 rows={3}
                                                                 value={editingId ? editValue.description : newHouse.description}
                                                                 onChange={(e) => editingId ? setEditValue({ ...editValue, description: e.target.value }) : setNewHouse({ ...newHouse, description: e.target.value })}
                                                                 className="search-input w-full bg-bgray-200 border-none focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white resize-none"
                                                            />
                                                       </label>
                                                  </div>
                                             </div>
                                             <div className="flex gap-2">
                                                  {editingId && (
                                                       <button
                                                            type="button"
                                                            onClick={() => { setEditingId(null); setEditValue({ house_name: "", description: "" }); }}
                                                            className="py-3 px-4 flex items-center justify-center text-bgray-600 font-bold bg-bgray-100 hover:bg-bgray-200 transition-all rounded-lg w-full"
                                                       >
                                                            Cancel
                                                       </button>
                                                  )}
                                                  <button
                                                       type="button"
                                                       onClick={editingId ? handleUpdateHouse : handleAddHouse}
                                                       className="py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full"
                                                  >
                                                       {editingId ? "Update" : "Add School House"}
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              <div className="w-full py-5 px-6 rounded-lg bg-white dark:bg-darkblack-600">
                                   <div className="flex flex-col space-y-5">
                                        <div className="w-full flex h-14 space-x-4">
                                             <div
                                                  className="w-full sm:block hidden border border-transparent focus-within:border-success-300 h-full bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]"
                                             >
                                                  <div
                                                       className="flex w-full h-full items-center space-x-[15px]"
                                                  >
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
                                                                 id="listSearch"
                                                                 placeholder="Search Students..."
                                                                 className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            />
                                                       </label>
                                                  </div>

                                             </div>

                                             <div className="relative">
                                                  <button
                                                       type="button"
                                                       className="w-full h-full rounded-lg bg-bgray-200 px-4 flex justify-between items-center relative dark:bg-darkblack-500"
                                                       onClick={() => toggleFilter("export")}
                                                  >
                                                       <span className="text-base text-bgray-500 text-nowrap">Export</span>
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
                                                       className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "export" ? "block" : "hidden"
                                                            }`}
                                                  >
                                                       <ul>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold">Coppy</li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold">Excel</li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold">CSV</li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold">PDF</li>
                                                            <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold">Print</li>
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="table-content w-full min-h-[52vh] overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td
                                                                 className="py-5 px-6 xl:px-0 w-[250px] lg:w-auto inline-block"
                                                            >
                                                                 <div className="w-full flex space-x-2.5 items-center">
                                                                      <span
                                                                           className="text-base font-medium text-bgray-600 dark:text-bgray-50"
                                                                      >Name</span>
                                                                      <span>
                                                                           <svg
                                                                                width="14"
                                                                                height="15"
                                                                                viewBox="0 0 14 15"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                           >
                                                                                <path
                                                                                     d="M10.332 1.31567V13.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M3.66602 13.3157V1.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                           </svg>
                                                                      </span>
                                                                 </div>
                                                            </td>
                                                            <td className="py-5 px-6 xl:px-0">
                                                                 <div className="w-full flex space-x-2.5 items-center">
                                                                      <span className="text-base font-medium text-bgray-600 dark:text-bgray-50"
                                                                      >Description</span
                                                                      >
                                                                      <span>
                                                                           <svg
                                                                                width="14"
                                                                                height="15"
                                                                                viewBox="0 0 14 15"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                           >
                                                                                <path
                                                                                     d="M10.332 1.31567V13.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M3.66602 13.3157V1.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                           </svg>
                                                                      </span>
                                                                 </div>
                                                            </td>
                                                            <td className="py-5 px-6 xl:px-0">
                                                                 <div className="flex space-x-2.5 items-center">
                                                                      <span
                                                                           className="text-base font-medium text-bgray-600 dark:text-gray-50"
                                                                      >
                                                                           House ID</span
                                                                      >
                                                                      <span>
                                                                           <svg
                                                                                width="14"
                                                                                height="15"
                                                                                viewBox="0 0 14 15"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                           >
                                                                                <path
                                                                                     d="M10.332 1.31567V13.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M5.66602 11.3157L3.66602 13.3157L1.66602 11.3157"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M3.66602 13.3157V1.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                                <path
                                                                                     d="M12.332 3.31567L10.332 1.31567L8.33203 3.31567"
                                                                                     stroke="#718096"
                                                                                     strokeWidth="1.5"
                                                                                     strokeLinecap="round"
                                                                                     strokeLinejoin="round"
                                                                                />
                                                                           </svg>
                                                                      </span>
                                                                 </div>
                                                            </td>
                                                            <td className="py-5 px-6 xl:px-0">
                                                                 <div className="flex space-x-2.5 items-center">
                                                                      <span
                                                                           className="text-base font-medium text-bgray-600 dark:text-gray-50"
                                                                      >
                                                                           Action</span
                                                                      >
                                                                 </div>
                                                            </td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {houses.map((house, idx) => (
                                                            <tr key={house._id || idx} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                                 <td className="py-5 px-6 xl:px-0">
                                                                      <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                                           {house.house_name}
                                                                      </p>
                                                                 </td>
                                                                 <td className="py-5 px-6 xl:px-0">
                                                                      <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                                           {house.description}
                                                                      </p>
                                                                 </td>
                                                                 <td className="py-5 px-6 xl:px-0">
                                                                      <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                                           {house._id}
                                                                      </p>
                                                                 </td>
                                                                 <td className="py-5 px-6 xl:px-0">
                                                                      <div className="relative">
                                                                           <button
                                                                                type="button"
                                                                                onClick={() => toggleFilter(`action-${house.house_name}`)}
                                                                           >
                                                                                <svg
                                                                                     width="18"
                                                                                     height="4"
                                                                                     viewBox="0 0 18 4"
                                                                                     fill="none"
                                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                                >
                                                                                     <path
                                                                                          d="M8 2.00024C8 2.55253 8.44772 3.00024 9 3.00024C9.55228 3.00024 10 2.55253 10 2.00024C10 1.44796 9.55228 1.00024 9 1.00024C8.44772 1.00024 8 1.44796 8 2.00024Z"
                                                                                          stroke="#A0AEC0"
                                                                                          strokeWidth="2"
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                     />
                                                                                     <path
                                                                                          d="M1 2.00024C1 2.55253 1.44772 3.00024 2 3.00024C2.55228 3.00024 3 2.55253 3 2.00024C3 1.44796 2.55228 1.00024 2 1.00024C1.44772 1.00024 1 1.44796 1 2.00024Z"
                                                                                          stroke="#A0AEC0"
                                                                                          strokeWidth="2"
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                     />
                                                                                     <path
                                                                                          d="M15 2.00024C15 2.55253 15.4477 3.00024 16 3.00024C16.5523 3.00024 17 2.55253 17 2.00024C17 1.44796 16.5523 1.00024 16 1.00024C15.4477 1.00024 15 1.44796 15 2.00024Z"
                                                                                          stroke="#A0AEC0"
                                                                                          strokeWidth="2"
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                     />
                                                                                </svg>
                                                                           </button>
                                                                           <div
                                                                                className={`rounded-lg shadow-lg bg-white dark:bg-darkblack-500 min-w-[150px] absolute right-0 z-10 top-8 overflow-hidden transition-all ${openFilter === `action-${house.house_name}` ? "block" : "hidden"
                                                                                     }`}
                                                                           >
                                                                                <ul>
                                                                                     <li className="text-nowrap text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold text-left">View</li>
                                                                                     <li onClick={() => handleEditClick(house)} className="text-nowrap text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold text-left">Edit</li>
                                                                                     <li
                                                                                          onClick={() => handleDelete(house.house_name)}
                                                                                          className="text-nowrap text-sm text-red-500 cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold text-left"
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
                                        <div className="pagination-content w-full">
                                             <div
                                                  className="w-full flex lg:justify-between justify-center items-center"
                                             >
                                                  <div className="lg:flex hidden space-x-4 items-center">
                                                       <span className="text-bgray-600 dark:text-bgray-50 text-sm font-semibold"
                                                       >Show result:</span
                                                       >
                                                       <div className="relative">
                                                            <button
                                                                 type="button"
                                                                 className="px-2.5 py-[14px] border rounded-lg border-bgray-300 dark:border-darkblack-400 flex space-x-6 items-center"
                                                                 onClick={() => toggleFilter("pagination")}
                                                            >
                                                                 <span className="text-sm font-semibold text-bgray-900 dark:text-bgray-50"
                                                                 >3</span
                                                                 >
                                                                 <span>
                                                                      <svg
                                                                           width="17"
                                                                           height="17"
                                                                           viewBox="0 0 17 17"
                                                                           fill="none"
                                                                           xmlns="http://www.w3.org/2000/svg"
                                                                      >
                                                                           <path
                                                                                d="M4.03516 6.03271L8.03516 10.0327L12.0352 6.03271"
                                                                                stroke="#A0AEC0"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                           />
                                                                      </svg>
                                                                 </span>
                                                            </button>
                                                            <div
                                                                 id="result-filter"
                                                                 className={`rounded-lg w-full shadow-lg bg-white absolute right-0 z-10 top-14 overflow-hidden hidden ${openFilter === "pagination" ? "block" : "hidden"
                                                                      }`}
                                                            >
                                                                 <ul>
                                                                      <li
                                                                           className="text-sm font-medium text-bgray-90 cursor-pointer px-5 py-2 hover:bg-bgray-100 "
                                                                      >
                                                                           1
                                                                      </li>
                                                                      <li
                                                                           className="text-sm font-medium text-bgray-900 cursor-pointer px-5 py-2 hover:bg-bgray-100 "
                                                                      >
                                                                           2
                                                                      </li>

                                                                      <li
                                                                           className="text-sm font-medium text-bgray-900 cursor-pointer px-5 py-2 hover:bg-bgray-100 "
                                                                      >
                                                                           3
                                                                      </li>
                                                                 </ul>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div
                                                       className="flex sm:space-x-[35px] space-x-5 items-center"
                                                  >
                                                       <button type="button">
                                                            <span>
                                                                 <svg
                                                                      width="21"
                                                                      height="21"
                                                                      viewBox="0 0 21 21"
                                                                      fill="none"
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                 >
                                                                      <path
                                                                           d="M12.7217 5.03271L7.72168 10.0327L12.7217 15.0327"
                                                                           stroke="#A0AEC0"
                                                                           strokeWidth="2"
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                      />
                                                                 </svg>
                                                            </span>
                                                       </button>
                                                       <div className="flex items-center">
                                                            <button
                                                                 type="button"
                                                                 className="rounded-lg text-success-300 lg:text-sm text-xs font-bold lg:px-6 lg:py-2.5 px-4 py-1.5 bg-success-50 dark:bg-darkblack-500 dark:text-bgray-50"
                                                            >
                                                                 1
                                                            </button>
                                                            <button
                                                                 type="button"
                                                                 className="rounded-lg text-bgray-500 lg:text-sm text-xs font-bold lg:px-6 lg:py-2.5 px-4 py-1.5 hover:bg-success-50 hover:text-success-300 transition duration-300 ease-in-out dark:hover:bg-darkblack-500"
                                                            >
                                                                 2
                                                            </button>

                                                            <span className="text-bgray-500 text-sm">. . . .</span>
                                                            <button
                                                                 type="button"
                                                                 className="rounded-lg text-bgray-500 lg:text-sm text-xs font-bold lg:px-6 lg:py-2.5 px-4 py-1.5 hover:bg-success-50 hover:text-success-300 transition duration-300 ease-in-out dark:hover:bg-darkblack-500"
                                                            >
                                                                 20
                                                            </button>
                                                       </div>
                                                       <button type="button">
                                                            <span>
                                                                 <svg
                                                                      width="21"
                                                                      height="21"
                                                                      viewBox="0 0 21 21"
                                                                      fill="none"
                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                 >
                                                                      <path
                                                                           d="M7.72168 5.03271L12.7217 10.0327L7.72168 15.0327"
                                                                           stroke="#A0AEC0"
                                                                           strokeWidth="2"
                                                                           strokeLinecap="round"
                                                                           strokeLinejoin="round"
                                                                      />
                                                                 </svg>
                                                            </span>
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          </>
     );
}
