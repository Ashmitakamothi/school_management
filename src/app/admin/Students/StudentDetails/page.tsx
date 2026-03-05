"use client";
import React, { useEffect, useState } from "react";
import { Student, CLASSES, SECTIONS, GENDERS, CATEGORIES, BLOOD_GROUPS, STUDENT_HOUSES } from "@/constants/student-constants";
import Pagination from "../../components/Pagination";

export default function StudenDetails() {
     const [openFilter, setOpenFilter] = useState<"class" | "section" | "pagination" | "export" | null>(null);
     const [activeActionId, setActiveActionId] = useState<string | null>(null);
     const [students, setStudents] = useState<Student[]>([]);
     const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
     const [searchTerm, setSearchTerm] = useState("");
     const [selectedClass, setSelectedClass] = useState("Select Class");
     const [selectedSection, setSelectedSection] = useState("Select Section");

     const [currentPage, setCurrentPage] = useState(1);
     const [limit, setLimit] = useState(10);
     const [totalPages, setTotalPages] = useState(0);
     const [totalEntries, setTotalEntries] = useState(0);

     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Modals
     const [viewStudent, setViewStudent] = useState<Student | null>(null);
     const [editStudent, setEditStudent] = useState<Student | null>(null);
     const [disableStudent, setDisableStudent] = useState<Student | null>(null);
     const [disableReasons, setDisableReasons] = useState<any[]>([]);
     const [selectedReason, setSelectedReason] = useState("");


     useEffect(() => {
          const fetchReasons = async () => {
               try {
                    const res = await fetch("/api/disable-reasons");
                    if (res.ok) setDisableReasons(await res.json());
               } catch (err) { console.error(err); }
          };
          fetchReasons();
     }, []);

     // Load students from API
     const fetchStudents = async () => {
          try {
               setLoading(true);
               let url = `/api/students?page=${currentPage}&limit=${limit}`;
               if (selectedClass && selectedClass !== "Select Class") url += `&class=${selectedClass}`;
               if (selectedSection && selectedSection !== "Select Section") url += `&section=${selectedSection}`;
               if (searchTerm) url += `&search=${searchTerm}`;

               const res = await fetch(url);
               if (res.ok) {
                    const result = await res.json();
                    setStudents(result.data || []);
                    setFilteredStudents(result.data || []);
                    setTotalPages(result.totalPages || 0);
                    setTotalEntries(result.totalEntries || 0);
               } else {
                    setError("Failed to fetch students");
               }
          } catch (err) {
               setError("An error occurred while fetching students");
               console.error(err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchStudents();
     }, [currentPage, limit, selectedClass, selectedSection, searchTerm]);

     const handleFilterChange = (type: string, value: string) => {
          if (type === "class") setSelectedClass(value);
          if (type === "section") setSelectedSection(value);
          setCurrentPage(1);
          setOpenFilter(null);
     };

     const handleCopy = () => {
          const tableData = filteredStudents.map(s => `${s.admission_no}\t${s.fname} ${s.lname}\t${s.class}\t${s.father_name}\t${s.dob}\t${s.gender}\t${s.mobile}`).join("\n");
          navigator.clipboard.writeText(`Admission No\tStudent Name\tClass\tFather Name\tDOB\tGender\tMobile\n${tableData}`);
          alert("Copied to clipboard");
     };

     const handleExportCSV = () => {
          const headers = ["Admission No", "Student Name", "Class", "Father Name", "DOB", "Gender", "Mobile"];
          const csvContent = [
               headers.join(","),
               ...filteredStudents.map(s => [
                    s.admission_no,
                    `"${s.fname} ${s.lname}"`,
                    s.class,
                    `"${s.father_name}"`,
                    s.dob,
                    s.gender,
                    s.mobile
               ].join(","))
          ].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "students.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
     };

     const handlePrint = () => {
          window.print();
     };

     const toggleFilter = (type: "class" | "section" | "pagination" | "export") => {
          setOpenFilter(openFilter === type ? null : type);
          setActiveActionId(null);
     };

     const toggleAction = (id: string) => {
          setActiveActionId(activeActionId === id ? null : id);
          setOpenFilter(null);
     };

     const handleDelete = async (id: string) => {
          if (confirm("Are you sure you want to delete this student record?")) {
               try {
                    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
                    if (res.ok) {
                         const updatedList = students.filter(s => s.admission_no !== id);
                         setStudents(updatedList);
                         setFilteredStudents(updatedList);
                         setActiveActionId(null);
                    } else {
                         alert("Failed to delete student: " + res.statusText);
                    }
               } catch (err) {
                    alert("Failed to delete student");
                    console.error("Error deleting student:", err);
               }
          }
     };

     const handleDisableSave = async () => {
          if (!disableStudent || !selectedReason) return;

          try {
               const res = await fetch(`/api/students/${disableStudent.admission_no}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Disabled", disable_reason: selectedReason })
               });

               if (res.ok) {
                    const updatedList = students.filter(s => s.admission_no !== disableStudent.admission_no);
                    setStudents(updatedList);
                    setFilteredStudents(updatedList);
                    setDisableStudent(null);
                    setSelectedReason("");
               } else {
                    alert("Failed to disable student");
               }
          } catch (err) {
               console.error(err);
               alert("An error occurred");
          }
     };

     const handleEditSave = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!editStudent) return;

          try {
               const res = await fetch(`/api/students/${editStudent.admission_no}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editStudent)
               });

               if (res.ok) {
                    const updatedStudent = await res.json();
                    const updatedList = students.map(s => s.admission_no === editStudent.admission_no ? updatedStudent : s);
                    setStudents(updatedList);
                    setFilteredStudents(updatedList);
                    setEditStudent(null);
               } else {
                    const errorData = await res.json();
                    alert("Failed to update student: " + (errorData.error || res.statusText));
               }
          } catch (err) {
               alert("An error occurred while updating the student");
               console.error(err);
          }
     };

     return (
          <>
               <div className="2xl:flex 2xl:space-x-[48px] relative">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600">
                              <div className="flex flex-col space-y-5">
                                   <div className="w-full flex h-14 space-x-4">
                                        <div className="w-full sm:block hidden border border-transparent focus-within:border-success-300 h-full bg-bgray-200 dark:bg-darkblack-500 rounded-lg px-[18px]">
                                             <div className="flex w-full h-full items-center space-x-[15px]">
                                                  <span>
                                                       <svg className="stroke-bgray-900 dark:stroke-white" width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="9.80204" cy="10.6761" r="8.98856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M16.0537 17.3945L19.5777 20.9094" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       </svg>
                                                  </span>
                                                  <label className="w-full">
                                                       <input
                                                            type="text"
                                                            placeholder="Search Students..."
                                                            className="search-input w-full bg-bgray-200 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500 dark:bg-darkblack-500 dark:text-white"
                                                            value={searchTerm}
                                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                                       />
                                                  </label>
                                             </div>
                                        </div>

                                        <div className="relative">
                                             <button
                                                  type="button"
                                                  className="w-full h-full rounded-lg bg-bgray-200 px-4 flex justify-between items-center relative dark:bg-darkblack-500 min-w-[140px]"
                                                  onClick={() => toggleFilter("class")}
                                             >
                                                  <span className="text-base text-bgray-500 text-nowrap">{selectedClass}</span>
                                                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                       <path d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                             </button>
                                             <div className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "class" ? "block" : "hidden"}`}>
                                                  <ul>
                                                       {["Select Class", ...CLASSES.slice(0, 6)].map(c => (
                                                            <li key={c} className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={() => handleFilterChange("class", c)}>{c}</li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>

                                        <div className="relative">
                                             <button
                                                  type="button"
                                                  className="w-full h-full rounded-lg bg-bgray-200 px-4 flex justify-between items-center relative dark:bg-darkblack-500 min-w-[140px]"
                                                  onClick={() => toggleFilter("section")}
                                             >
                                                  <span className="text-base text-bgray-500 text-nowrap">{selectedSection}</span>
                                                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                       <path d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                             </button>
                                             <div className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "section" ? "block" : "hidden"}`}>
                                                  <ul>
                                                       {["Select Section", ...SECTIONS].map(s => (
                                                            <li key={s} className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={() => handleFilterChange("section", s)}>{s}</li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>

                                        <div className="relative">
                                             <button
                                                  type="button"
                                                  className="w-full h-full rounded-lg bg-bgray-200 px-4 flex justify-between items-center relative dark:bg-darkblack-500 min-w-[140px]"
                                                  onClick={() => toggleFilter("export")}
                                             >
                                                  <span className="text-base text-bgray-500 text-nowrap">Export</span>
                                                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                       <path d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                             </button>
                                             <div className={`rounded-lg w-full shadow-lg bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-14 overflow-hidden transition-all ${openFilter === "export" ? "block" : "hidden"}`}>
                                                  <ul>
                                                       <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={handleCopy}>Copy</li>
                                                       <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={handleExportCSV}>Excel</li>
                                                       <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={handleExportCSV}>CSV</li>
                                                       <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={handlePrint}>PDF</li>
                                                       <li className="text-sm text-bgray-900 dark:text-white cursor-pointer px-5 py-2 hover:bg-bgray-100 hover:dark:bg-darkblack-600 font-semibold" onClick={handlePrint}>Print</li>
                                                  </ul>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="table-content w-full min-h-[52vh] overflow-x-auto">
                                        <table className="w-full">
                                             <thead>
                                                  <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                       <td className="py-5 px-6 xl:px-0">Admission No</td>
                                                       <td className="py-5 px-6 xl:px-0">Student Name</td>
                                                       <td className="py-5 px-6 xl:px-0">Class</td>
                                                       <td className="py-5 px-6 xl:px-0">Father Name</td>
                                                       <td className="py-5 px-6 xl:px-0">Date of Birth</td>
                                                       <td className="py-5 px-6 xl:px-0">Gender</td>
                                                       <td className="py-5 px-6 xl:px-0">Mobile Number</td>
                                                       <td className="py-5 px-6 xl:px-0 text-center">Action</td>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {filteredStudents.length > 0 ? (
                                                       filteredStudents.map((student, idx) => (
                                                            <tr key={idx} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.admission_no}</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.fname} {student.lname}</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.class} ({student.section})</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.father_name}</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.dob}</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.gender}</td>
                                                                 <td className="py-5 px-6 xl:px-0 font-medium text-bgray-900 dark:text-bgray-50">{student.mobile}</td>
                                                                 <td className="py-5 px-6 xl:px-0 text-center relative">
                                                                      <button onClick={() => toggleAction(student.admission_no)} className="p-2 hover:bg-gray-100 dark:hover:bg-darkblack-500 rounded-full transition-colors">
                                                                           <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M8 2C8 2.55228 8.44772 3 9 3C9.55228 3 10 2.55228 10 2C10 1.44772 9.55228 1 9 1C8.44772 1 8 1.44772 8 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M15 2C15 2.55228 15.4477 3 16 3C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1C15.4477 1 15 1.44772 15 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                           </svg>
                                                                      </button>

                                                                      {activeActionId === student.admission_no && (
                                                                           <div className="absolute right-0 top-10 mt-2 w-48 bg-white dark:bg-darkblack-500 rounded-lg shadow-xl border border-bgray-300 dark:border-darkblack-400 z-50 overflow-hidden">
                                                                                <button onClick={() => { setViewStudent(student); setActiveActionId(null); }} className="w-full text-left px-5 py-3 text-sm font-semibold text-bgray-900 dark:text-white hover:bg-bgray-100 dark:hover:bg-darkblack-600 border-b border-bgray-200 dark:border-darkblack-400">View Details</button>
                                                                                <button onClick={() => { setEditStudent(student); setActiveActionId(null); }} className="w-full text-left px-5 py-3 text-sm font-semibold text-bgray-900 dark:text-white hover:bg-bgray-100 dark:hover:bg-darkblack-600 border-b border-bgray-200 dark:border-darkblack-400">Edit Student</button>
                                                                                <button onClick={() => { setDisableStudent(student); setActiveActionId(null); }} className="w-full text-left px-5 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-b border-bgray-200 dark:border-darkblack-400">Disable Student</button>
                                                                                <button onClick={() => handleDelete(student.admission_no)} className="w-full text-left px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete Record</button>
                                                                           </div>
                                                                      )}
                                                                 </td>
                                                            </tr>
                                                       ))
                                                  ) : (
                                                       <tr><td colSpan={8} className="py-10 text-center text-bgray-500">No students found.</td></tr>
                                                  )}
                                             </tbody>
                                        </table>
                                   </div>
                                   <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        limit={limit}
                                        onLimitChange={setLimit}
                                        totalEntries={totalEntries}
                                   />
                              </div>
                         </div>
                    </section>
               </div>

               {/* View Modal */}
               {viewStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                         <div className="bg-white dark:bg-darkblack-600 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                              <div className="p-8 border-b border-bgray-200 dark:border-darkblack-400 flex justify-between items-center">
                                   <h3 className="text-2xl font-bold dark:text-white">Student Details</h3>
                                   <button onClick={() => setViewStudent(null)} className="text-bgray-500 hover:text-bgray-900 dark:hover:text-white text-2xl">&times;</button>
                              </div>
                              <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                                   {Object.entries(viewStudent).map(([key, value]) => (
                                        <div key={key}>
                                             <label className="text-xs uppercase tracking-wider text-bgray-500 font-bold mb-1 block">{key.replace('_', ' ')}</label>
                                             <p className="text-lg font-medium text-bgray-900 dark:text-white">{String(value) || "N/A"}</p>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               )}

               {/* Edit Modal */}
               {editStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                         <div className="bg-white dark:bg-darkblack-600 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                              <form onSubmit={handleEditSave}>
                                   <div className="p-8 border-b border-bgray-200 dark:border-darkblack-400 flex justify-between items-center">
                                        <h3 className="text-2xl font-bold dark:text-white">Edit Student: {editStudent.fname}</h3>
                                        <button type="button" onClick={() => setEditStudent(null)} className="text-bgray-500 hover:text-bgray-900 dark:hover:text-white text-2xl">&times;</button>
                                   </div>
                                   <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                                        <div className="flex flex-col gap-2">
                                             <label className="text-sm font-bold dark:text-white">First Name</label>
                                             <input className="bg-bgray-100 dark:bg-darkblack-500 p-3 rounded-lg border border-bgray-300 dark:border-darkblack-400 dark:text-white" value={editStudent.fname} onChange={(e) => setEditStudent({ ...editStudent, fname: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                             <label className="text-sm font-bold dark:text-white">Last Name</label>
                                             <input className="bg-bgray-100 dark:bg-darkblack-500 p-3 rounded-lg border border-bgray-300 dark:border-darkblack-400 dark:text-white" value={editStudent.lname} onChange={(e) => setEditStudent({ ...editStudent, lname: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                             <label className="text-sm font-bold dark:text-white">Class</label>
                                             <select className="bg-bgray-100 dark:bg-darkblack-500 p-3 rounded-lg border border-bgray-300 dark:border-darkblack-400 dark:text-white" value={editStudent.class} onChange={(e) => setEditStudent({ ...editStudent, class: e.target.value })}>
                                                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                             </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                             <label className="text-sm font-bold dark:text-white">Section</label>
                                             <select className="bg-bgray-100 dark:bg-darkblack-500 p-3 rounded-lg border border-bgray-300 dark:border-darkblack-400 dark:text-white" value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })}>
                                                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                             </select>
                                        </div>
                                   </div>
                                   <div className="p-8 border-t border-bgray-200 dark:border-darkblack-400 flex justify-end gap-4">
                                        <button type="button" onClick={() => setEditStudent(null)} className="px-6 py-2 rounded-lg font-bold text-bgray-600 hover:bg-bgray-100">Cancel</button>
                                        <button type="submit" className="px-8 py-2 bg-success-300 text-white rounded-lg font-bold hover:bg-success-400">Save Changes</button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}

               {/* Disable Modal */}
               {disableStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                         <div className="bg-white dark:bg-darkblack-600 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                              <div className="p-8 border-b border-bgray-200 dark:border-darkblack-400 flex justify-between items-center">
                                   <h3 className="text-2xl font-bold dark:text-white">Disable Student</h3>
                                   <button onClick={() => setDisableStudent(null)} className="text-bgray-500 hover:text-bgray-900 dark:hover:text-white text-2xl">&times;</button>
                              </div>
                              <div className="p-8 space-y-4">
                                   <p className="text-bgray-600 dark:text-bgray-50">
                                        Are you sure you want to disable <b>{disableStudent.fname} {disableStudent.lname}</b>?
                                   </p>
                                   <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold dark:text-white">Select Reason</label>
                                        <select
                                             className="bg-bgray-100 dark:bg-darkblack-500 p-3 rounded-lg border border-bgray-300 dark:border-darkblack-400 dark:text-white"
                                             value={selectedReason}
                                             onChange={(e) => setSelectedReason(e.target.value)}
                                        >
                                             <option value="">Choose a reason...</option>
                                             {disableReasons.map((r, i) => (
                                                  <option key={i} value={r.reason}>{r.reason}</option>
                                             ))}
                                        </select>
                                   </div>
                              </div>
                              <div className="p-8 border-t border-bgray-200 dark:border-darkblack-400 flex justify-end gap-4">
                                   <button onClick={() => setDisableStudent(null)} className="px-6 py-2 rounded-lg font-bold text-bgray-600 hover:bg-bgray-100">Cancel</button>
                                   <button
                                        onClick={handleDisableSave}
                                        disabled={!selectedReason}
                                        className={`px-8 py-2 rounded-lg font-bold text-white transition-colors ${selectedReason ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                   >
                                        Disable
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
}





