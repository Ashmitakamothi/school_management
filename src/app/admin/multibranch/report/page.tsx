"use client";
import React, { useState, useEffect } from "react";

type ReportType = "daily-collection" | "payroll" | "income" | "expense" | "user-log";

interface PaymentRow {
     date: string;
     transactions: number;
     amount: number;
}

const REPORT_ICONS: Record<ReportType, string> = {
     "daily-collection": "Daily Collection Report",
     payroll: "Payroll Report",
     income: "Income Report",
     expense: "Expense Report",
     "user-log": "User Log Report",
};

export default function MultiBranchReport() {
     const [activeReport, setActiveReport] = useState<ReportType>("daily-collection");
     const [dateFrom, setDateFrom] = useState(() => {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          return d.toISOString().split("T")[0];
     });
     const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);
     const [data, setData] = useState<PaymentRow[]>([]);
     const [loading, setLoading] = useState(false);
     const [search, setSearch] = useState("");

     const fetchReport = async () => {
          if (activeReport !== "daily-collection") {
               setData([]);
               return;
          }
          setLoading(true);
          try {
               const res = await fetch("/api/fees-payment");
               if (!res.ok) throw new Error();
               const payments: any[] = await res.json();

               const from = new Date(dateFrom);
               const to = new Date(dateTo);
               to.setHours(23, 59, 59, 999);

               // Group by date
               const grouped: Record<string, { transactions: number; amount: number }> = {};
               const d = new Date(from);
               while (d <= to) {
                    const key = d.toLocaleDateString("en-US");
                    grouped[key] = { transactions: 0, amount: 0 };
                    d.setDate(d.getDate() + 1);
               }

               payments.forEach((p: any) => {
                    const paid = new Date(p.payment_date || p.createdAt);
                    if (paid >= from && paid <= to) {
                         const key = paid.toLocaleDateString("en-US");
                         if (grouped[key]) {
                              grouped[key].transactions += 1;
                              grouped[key].amount += Number(p.amount ?? 0);
                         }
                    }
               });

               setData(
                    Object.entries(grouped).map(([date, val]) => ({
                         date,
                         transactions: val.transactions,
                         amount: val.amount,
                    }))
               );
          } catch (e) {
               console.error(e);
               setData([]);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => { fetchReport(); }, [activeReport, dateFrom, dateTo]);

     const fmt = (n: number) =>
          new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

     const filtered = data.filter((r) =>
          r.date.toLowerCase().includes(search.toLowerCase())
     );

     const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);
     const totalTransactions = filtered.reduce((sum, r) => sum + r.transactions, 0);

     const downloadCSV = () => {
          const header = "Date,Total Transactions,Amount";
          const rows = filtered.map((r) => `${r.date},${r.transactions},${r.amount.toFixed(2)}`);
          const csv = [header, ...rows].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${activeReport}-report.csv`;
          a.click();
          URL.revokeObjectURL(url);
     };

     const reportButtons: { key: ReportType; label: string }[] = [
          { key: "daily-collection", label: "Daily Collection Report" },
          { key: "payroll", label: "Payroll Report" },
          { key: "income", label: "Income Report" },
          { key: "expense", label: "Expense Report" },
          { key: "user-log", label: "User Log Report" },
     ];

     return (
          <>
               <div className="2xl:flex 2xl:space-x-[48px]">
                    <section className="2xl:flex-1 2xl:mb-0 mb-6">
                         {/* Header */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6">
                              <h2 className="text-xl font-bold text-bgray-900 dark:text-white">Multi Branch Report</h2>
                         </div>

                         {/* Report Type Buttons */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6">
                              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                                   {reportButtons.map(({ key, label }) => (
                                        <button
                                             key={key}
                                             type="button"
                                             onClick={() => setActiveReport(key)}
                                             className={`flex items-center gap-3 px-6 py-4 rounded-lg border transition-all ${activeReport === key
                                                       ? "bg-success-50 border-success-300 dark:bg-darkblack-500"
                                                       : "bg-bgray-100 border-bgray-200 dark:bg-darkblack-500 dark:border-darkblack-400 hover:border-success-300"
                                                  }`}
                                        >
                                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                  <path d="M9 11H7C6.46957 11 5.96086 11.2107 5.58579 11.5858C5.21071 11.9609 5 12.4696 5 13V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H9C9.53043 19 10.0391 18.7893 10.4142 18.4142C10.7893 18.0391 11 17.5304 11 17V13C11 12.4696 10.7893 11.9609 10.4142 11.5858C10.0391 11.2107 9.53043 11 9 11Z" stroke={activeReport === key ? "#22C55E" : "#718096"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M17 11H15C14.4696 11 13.9609 11.2107 13.5858 11.5858C13.2107 11.9609 13 12.4696 13 13V17C13 17.5304 13.2107 18.0391 13.5858 18.4142C13.9609 18.7893 14.4696 19 15 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V13C19 12.4696 18.7893 11.9609 18.4142 11.5858C18.0391 11.2107 17.5304 11 17 11Z" stroke={activeReport === key ? "#22C55E" : "#718096"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  <path d="M5 11V7C5 6.46957 5.21071 5.96086 5.58579 5.58579C5.96086 5.21071 6.46957 5 7 5H17C17.5304 5 18.0391 5.21071 18.4142 5.58579C18.7893 5.96086 19 6.46957 19 7V11" stroke={activeReport === key ? "#22C55E" : "#718096"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                             </svg>
                                             <span className={`text-sm font-semibold ${activeReport === key ? "text-success-300" : "text-bgray-600 dark:text-bgray-50"}`}>
                                                  {label}
                                             </span>
                                        </button>
                                   ))}
                              </div>
                         </div>

                         {/* Select Criteria */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600 mb-6">
                              <h3 className="text-lg font-semibold text-bgray-900 dark:text-white mb-4">Select Criteria</h3>
                              <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                                   <div>
                                        <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                             Date From <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                             type="date"
                                             value={dateFrom}
                                             onChange={(e) => setDateFrom(e.target.value)}
                                             className="w-full px-4 py-3 bg-bgray-100 dark:bg-darkblack-500 rounded-lg border border-transparent focus:border-success-300 focus:outline-none text-sm text-bgray-900 dark:text-white"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium text-bgray-600 dark:text-bgray-50 mb-2 block">
                                             Date To <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                             type="date"
                                             value={dateTo}
                                             onChange={(e) => setDateTo(e.target.value)}
                                             className="w-full px-4 py-3 bg-bgray-100 dark:bg-darkblack-500 rounded-lg border border-transparent focus:border-success-300 focus:outline-none text-sm text-bgray-900 dark:text-white"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Data Table */}
                         <div className="w-full py-[20px] px-[24px] rounded-lg bg-white dark:bg-darkblack-600">
                              <div className="flex flex-col space-y-5">
                                   <div className="flex justify-between items-center flex-wrap gap-3">
                                        <h3 className="text-lg font-semibold text-bgray-900 dark:text-white">
                                             {REPORT_ICONS[activeReport]}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                             {/* CSV download */}
                                             <button
                                                  onClick={downloadCSV}
                                                  disabled={filtered.length === 0}
                                                  className="p-2 rounded-lg bg-bgray-100 dark:bg-darkblack-500 hover:bg-bgray-200 dark:hover:bg-darkblack-400 transition-all disabled:opacity-50"
                                                  title="Download CSV"
                                             >
                                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       <polyline points="7 10 12 15 17 10" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                       <line x1="12" y1="15" x2="12" y2="3" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" />
                                                  </svg>
                                             </button>
                                        </div>
                                   </div>

                                   {/* Search */}
                                   <div className="w-full max-w-xs border border-transparent focus-within:border-success-300 h-10 bg-bgray-100 dark:bg-darkblack-500 rounded-lg px-4 flex items-center gap-2">
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

                                   {/* Table */}
                                   {loading ? (
                                        <div className="text-center py-8 text-bgray-500">Loading...</div>
                                   ) : activeReport !== "daily-collection" ? (
                                        <div className="text-center py-8 text-bgray-500">
                                             This report type is coming soon.
                                        </div>
                                   ) : filtered.length === 0 ? (
                                        <div className="text-center py-8 text-bgray-500">No records found for this date range.</div>
                                   ) : (
                                        <div className="table-content w-full overflow-x-auto">
                                             <table className="w-full">
                                                  <thead>
                                                       <tr className="border-b border-bgray-300 dark:border-darkblack-400">
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">Date</span>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">Total Transactions</span>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <span className="text-sm font-semibold text-bgray-600 dark:text-bgray-50">Amount ($)</span>
                                                            </td>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {filtered.map((row, i) => (
                                                            <tr key={i} className="border-b border-bgray-300 dark:border-darkblack-400 hover:bg-bgray-50 dark:hover:bg-darkblack-500 transition-colors">
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <p className="font-medium text-sm text-bgray-900 dark:text-bgray-50">{row.date}</p>
                                                                 </td>
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <p className="font-normal text-sm text-bgray-600 dark:text-bgray-300">{row.transactions}</p>
                                                                 </td>
                                                                 <td className="py-4 px-4 xl:px-0">
                                                                      <p className="font-normal text-sm text-bgray-600 dark:text-bgray-300">{fmt(row.amount)}</p>
                                                                 </td>
                                                            </tr>
                                                       ))}
                                                       {/* Totals Row */}
                                                       <tr className="bg-bgray-100 dark:bg-darkblack-500">
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <p className="font-bold text-sm text-bgray-900 dark:text-white">Total ({totalTransactions} transactions)</p>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <p className="font-bold text-sm text-bgray-900 dark:text-white">{totalTransactions}</p>
                                                            </td>
                                                            <td className="py-4 px-4 xl:px-0">
                                                                 <p className="font-bold text-sm text-bgray-900 dark:text-white">{fmt(totalAmount)}</p>
                                                            </td>
                                                       </tr>
                                                  </tbody>
                                             </table>
                                        </div>
                                   )}

                                   {/* Footer */}
                                   {!loading && filtered.length > 0 && (
                                        <div className="flex justify-between items-center text-sm text-bgray-500">
                                             <span>Records: {filtered.length}</span>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </section>
               </div>
          </>
     );
}