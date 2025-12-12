import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Invoice, Project } from '../types';
import { Plus, Search, FileText, CheckCircle, Clock, Filter, ChevronDown } from 'lucide-react';

const Finance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Invoice State
  const [projectId, setProjectId] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setInvoices(DataService.getInvoices());
    setProjects(DataService.getProjects());
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectId && amount) {
      DataService.addInvoice({
        projectId,
        amount: Number(amount),
        description,
        date,
        status: 'Pending'
      });
      refreshData();
      setShowModal(false);
      // Reset form
      setAmount('');
      setDescription('');
      setProjectId(0);
    }
  };

  const getProjectName = (id: number) => projects.find(p => p.id === id)?.name || 'Unknown Project';

  const filteredInvoices = invoices.filter(inv => 
    inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(inv.projectId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Finance</h2>
          <p className="text-slate-500 text-lg mt-1">Invoice history and general ledger.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-lg shadow-indigo-500/30 font-medium hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Record Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search invoices by project or description..." 
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none text-sm transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter size={16} /> Filter <ChevronDown size={14} />
             </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500 font-medium group-hover:text-indigo-600 transition-colors">
                    #INV-{inv.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{getProjectName(inv.projectId)}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.description}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      inv.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : inv.status === 'Overdue' 
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center text-slate-400 bg-slate-50/30">
                    <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-3">
                      <FileText size={32} className="opacity-30" />
                    </div>
                    <p className="font-medium">No invoices found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
            <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-t-2xl border-b border-indigo-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-indigo-950">Record New Invoice</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Project</label>
                <select 
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                  value={projectId}
                  onChange={(e) => setProjectId(Number(e.target.value))}
                >
                  <option value={0}>-- Select Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Concrete Pouring Phase 1"
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
                   <input 
                     type="number" 
                     required
                     className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Invoice Date</label>
                   <input 
                     type="date" 
                     required
                     className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all text-slate-600"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                   />
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 font-medium transition-all transform active:scale-95"
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;