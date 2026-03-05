"use client";
import React, { useEffect, useState } from "react";

interface Branch {
     _id: string;
     name: string;
     url: string;
}

interface Stats {
     totalStudents: number;
     onlineAdmissions: number;
     totalFees: number;
     paidFees: number;
}

export default function MultiBranchOverview() {
     const [branches, setBranches] = useState<Branch[]>([]);
     const [stats, setStats] = useState<Stats>({
          totalStudents: 0,
          onlineAdmissions: 0,
          totalFees: 0,
          paidFees: 0,
     });
     const [loading, setLoading] = useState(true);

     const fetchData = async () => {
          setLoading(true);
          try {
               const [branchRes, studentRes, paymentRes, onlineAdmRes] = await Promise.all([
                    fetch("/api/multibranch/branch"),
                    fetch("/api/students?limit=1"),
                    fetch("/api/fees-payment"),
                    fetch("/api/online-admission"),
               ]);

               if (branchRes.ok) {
                    const data = await branchRes.json();
                    setBranches(Array.isArray(data) ? data : []);
               }

               let totalStudents = 0;
               if (studentRes.ok) {
                    const data = await studentRes.json();
                    totalStudents = data.totalEntries ?? 0;
               }

               let totalFees = 0;
               let paidFees = 0;
               if (paymentRes.ok) {
                    const payments = await paymentRes.json();
                    if (Array.isArray(payments)) {
                         payments.forEach((p: any) => {
                              totalFees += Number(p.amount ?? 0);
                              paidFees += Number(p.paid_amount ?? p.amount ?? 0);
                         });
                    }
               }

               let onlineAdmissions = 0;
               if (onlineAdmRes.ok) {
                    const admissions = await onlineAdmRes.json();
                    onlineAdmissions = Array.isArray(admissions) ? admissions.length : 0;
               }

               setStats({ totalStudents, onlineAdmissions, totalFees, paidFees });
          } catch (e) {
               console.error(e);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => { fetchData(); }, []);

     const fmt = (n: number) =>
          new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

     const allBranches = [{ _id: "home", name: "Home Branch", url: "" }, ...branches];

     const TableSection = ({
          title,
          headers,
          rows,
     }: {
          title: string;
          headers: string[];
          rows: (string | number)[][];
     }) => (
          <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6">
               <div className="flex flex-col space-y-5">
                    <h3 className="text-lg font-semibold text-bgray-900 dark:text-white">{title}</h3>
                    <div className="table-content w-full overflow-x-auto">
                         <table className="w-full">
                              <thead>
                                   <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                        {headers.map((h) => (
                                             <td key={h} className="py-4 px-4 xl:px-0">
                                                  <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">{h}</span>
                                             </td>
                                        ))}
                                   </tr>
                              </thead>
                              <tbody>
                                   {loading ? (
                                        <tr>
                                             <td colSpan={headers.length} className="py-6 text-center text-sm text-bgray-500">
                                                  Loading...
                                             </td>
                                        </tr>
                                   ) : rows.length === 0 ? (
                                        <tr>
                                             <td colSpan={headers.length} className="py-6 text-center text-sm text-bgray-500">
                                                  No data available
                                             </td>
                                        </tr>
                                   ) : (
                                        rows.map((row, i) => (
                                             <tr key={i} className="border-b border-bgray-300 dark:border-darkblack-400">
                                                  {row.map((cell, j) => (
                                                       <td key={j} className="py-4 px-4 xl:px-0">
                                                            <p className={`text-sm ${j === 0 ? "font-medium text-bgray-900 dark:text-bgray-50" : "font-normal text-bgray-600 dark:text-bgray-300"}`}>
                                                                 {cell}
                                                            </p>
                                                       </td>
                                                  ))}
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>
          </div>
     );

     const currentYear = `${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(2)}`;

     const feesRows = allBranches.map((b) => [
          b.name,
          currentYear,
          b._id === "home" ? stats.totalStudents : "-",
          b._id === "home" ? fmt(stats.totalFees) : "-",
          b._id === "home" ? fmt(stats.paidFees) : "-",
          b._id === "home" ? fmt(stats.totalFees - stats.paidFees) : "-",
     ]);

     const admissionRows = allBranches.map((b) => [
          b.name,
          currentYear,
          b._id === "home" ? stats.totalStudents : "-",
          b._id === "home" ? stats.onlineAdmissions : "-",
     ]);

     return (
          <>
               <div className="2xl:flex 2xl:space-x-[48px]">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         {/* Header */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6 flex justify-between items-center">
                              <h2 className="text-xl font-bold text-bgray-900 dark:text-white">Overview</h2>
                              <button
                                   onClick={fetchData}
                                   className="px-4 py-2 rounded-lg bg-bgray-100 dark:bg-darkblack-500 hover:bg-bgray-200 dark:hover:bg-darkblack-400 transition-all"
                                   title="Refresh"
                              >
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 4V10H7" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6194 20.3413 15.909 20.7742 14.0064C21.2070 12.1037 21.0102 10.112 20.2126 8.33111C19.4150 6.55025 18.0605 5.07685 16.3528 4.13176C14.6451 3.18668 12.6769 2.82051 10.7447 3.09017C8.81245 3.35984 7.02091 4.25127 5.64 5.64L1 10" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                              </button>
                         </div>

                         <TableSection
                              title="Fees Details"
                              headers={["Branch", "Current Session", "Total Students", "Total Fees", "Total Paid Fees", "Total Balance Fees"]}
                              rows={feesRows}
                         />

                         <TableSection
                              title="Student Admission"
                              headers={["Branch", "Current Session", "Offline Admission", "Online Admission"]}
                              rows={admissionRows}
                         />

                         <TableSection
                              title="Library Details"
                              headers={["Branch", "Total Books", "Members", "Book Issued"]}
                              rows={allBranches.map((b) => [b.name, "-", "-", "-"])}
                         />

                         <TableSection
                              title="Alumni Students"
                              headers={["Branch", "Alumni Students"]}
                              rows={allBranches.map((b) => [b.name, "-"])}
                         />
                    </section>
               </div>
          </>
     );
}