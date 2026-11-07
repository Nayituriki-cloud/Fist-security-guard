import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  FileText,
  Download,
  CheckCircle2,
  TrendingUp,
  Receipt,
  CreditCard,
  Printer,
  X,
} from 'lucide-react';
import { PayrollRecord, ClientInvoice } from '../../types';

export const PayrollFinanceView: React.FC = () => {
  const { payroll, invoices } = useApp();

  const [currency, setCurrency] = useState<'RWF' | 'USD'>('RWF');
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
  const [selectedPaySlip, setSelectedPaySlip] = useState<PayrollRecord | null>(null);
  const [exportNotice, setExportNotice] = useState(false);

  const fxRate = 1350; // 1 USD = 1,350 RWF approx

  const totalPayrollRWF = payroll.reduce((sum, p) => sum + p.grossPayRWF, 0);
  const totalInvoicedRWF = invoices.reduce((sum, i) => sum + i.totalRWF, 0);
  const totalVatRWF = invoices.reduce((sum, i) => sum + i.vatRWF, 0);

  const formatAmount = (rwf: number) => {
    if (currency === 'USD') {
      return `$${Math.round(rwf / fxRate).toLocaleString()} USD`;
    }
    return `${rwf.toLocaleString()} RWF`;
  };

  const handleExportFinance = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Payroll, Invoicing & Financial Operations</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Automated monthly salary computations, RSSB pension & RAMA health deductions, overtime billing, and client tax invoices
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Currency Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setCurrency('RWF')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currency === 'RWF'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RWF (Francs)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currency === 'USD'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>

          <button
            onClick={handleExportFinance}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>FIST GUARD corporate payroll ledger exported to Excel/CSV format!</span>
        </div>
      )}

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Billed Contract Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            {formatAmount(totalInvoicedRWF)}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
            Includes {formatAmount(totalVatRWF)} RRA 18% VAT
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Guards Gross Payroll Outlay</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1.5">
            {formatAmount(totalPayrollRWF)}
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-0.5">
            Includes overtime & night allowances
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Operating Security Margin</span>
            <Receipt className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1.5">
            {formatAmount(totalInvoicedRWF - totalPayrollRWF - totalVatRWF)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Post-tax operating contribution
          </div>
        </div>
      </div>

      {/* Guard Monthly Payroll Register */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Guard Payroll Ledger & Statutory RSSB Deductions</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Complies with Rwandan Pension (3%) and RAMA Medical Scheme (3.75%)
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400">October 2026 Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Guard Name</th>
                <th className="py-3 px-3">Base Pay</th>
                <th className="py-3 px-3">Overtime & Stipend</th>
                <th className="py-3 px-3">Gross Pay</th>
                <th className="py-3 px-3">RSSB / RAMA</th>
                <th className="py-3 px-3">PAYE Tax</th>
                <th className="py-3 px-3">Net Take-Home</th>
                <th className="py-3 px-3 text-right">Pay Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {payroll.map((p) => (
                <tr key={p.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-white">{p.guardName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {p.bankName} · {p.accountNumber}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-300">{formatAmount(p.baseSalaryRWF)}</td>

                  <td className="py-3 px-3 text-amber-400">
                    +{formatAmount(p.overtimePayRWF + p.nightAllowanceRWF + p.transportStipendRWF)}
                  </td>

                  <td className="py-3 px-3 font-bold text-white">
                    {formatAmount(p.grossPayRWF)}
                  </td>

                  <td className="py-3 px-3 text-rose-400">
                    -{formatAmount(p.rssbDeductionRWF + p.ramaHealthDeductionRWF)}
                  </td>

                  <td className="py-3 px-3 text-rose-400">-{formatAmount(p.payeTaxRWF)}</td>

                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {formatAmount(p.netSalaryRWF)}
                  </td>

                  <td className="py-3 px-3 font-sans text-right">
                    <button
                      onClick={() => setSelectedPaySlip(p)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Billing Invoices Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Client Invoicing & Contract Revenue Ledger</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Hourly billing rate computations and VAT reconciliation for commercial accounts
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {invoices.length} Client Statements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Guards Billed</th>
                <th className="py-3 px-3">Subtotal</th>
                <th className="py-3 px-3">VAT (18%)</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">{inv.invoiceNumber}</td>

                  <td className="py-3 px-3 font-sans text-white font-medium">{inv.clientName}</td>

                  <td className="py-3 px-3 text-slate-400 text-[11px]">{inv.billingPeriod}</td>

                  <td className="py-3 px-3 text-slate-300">
                    {inv.totalGuardsBilled} Officers ({inv.dayGuardHours + inv.nightGuardHours} hrs)
                  </td>

                  <td className="py-3 px-3 text-slate-300">{formatAmount(inv.subtotalRWF)}</td>

                  <td className="py-3 px-3 text-slate-400">{formatAmount(inv.vatRWF)}</td>

                  <td className="py-3 px-3 font-bold text-emerald-400">
                    {formatAmount(inv.totalRWF)}
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400">OFFICIAL TAX INVOICE</span>
                <h2 className="text-lg font-bold text-white">{selectedInvoice.invoiceNumber}</h2>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Issuer:</span>
                <span className="font-semibold text-white">FIST GUARD Security Ltd (Kigali, Rwanda)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billed To:</span>
                <span className="font-semibold text-white">{selectedInvoice.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing Period:</span>
                <span className="font-mono text-slate-200">{selectedInvoice.billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal:</span>
                <span className="font-mono text-slate-200">{formatAmount(selectedInvoice.subtotalRWF)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rwanda Revenue Authority VAT (18%):</span>
                <span className="font-mono text-slate-200">{formatAmount(selectedInvoice.vatRWF)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-emerald-400">
                <span>Total Amount Due:</span>
                <span className="font-mono">{formatAmount(selectedInvoice.totalRWF)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => alert('Printing tax invoice statement...')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Slip Modal Preview */}
      {selectedPaySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400">OFFICIAL SALARY PAY SLIP</span>
                <h2 className="text-base font-bold text-white">{selectedPaySlip.guardName}</h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  National ID: {selectedPaySlip.nationalId}
                </div>
              </div>
              <button
                onClick={() => setSelectedPaySlip(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Base Monthly Salary:</span>
                <span className="text-white">{formatAmount(selectedPaySlip.baseSalaryRWF)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Overtime ({selectedPaySlip.overtimeHours}h):</span>
                <span className="text-emerald-400">+{formatAmount(selectedPaySlip.overtimePayRWF)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Night Duty Allowance:</span>
                <span className="text-emerald-400">+{formatAmount(selectedPaySlip.nightAllowanceRWF)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Transport Allowance:</span>
                <span className="text-emerald-400">+{formatAmount(selectedPaySlip.transportStipendRWF)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span className="font-sans">Gross Salary:</span>
                <span>{formatAmount(selectedPaySlip.grossPayRWF)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="font-sans">RSSB Pension (3%):</span>
                <span>-{formatAmount(selectedPaySlip.rssbDeductionRWF)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="font-sans">RAMA Medical (3.75%):</span>
                <span>-{formatAmount(selectedPaySlip.ramaHealthDeductionRWF)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="font-sans">PAYE Tax:</span>
                <span>-{formatAmount(selectedPaySlip.payeTaxRWF)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
                <span className="font-sans">Net Take-Home Pay:</span>
                <span>{formatAmount(selectedPaySlip.netSalaryRWF)}</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedPaySlip(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Close Pay Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
