import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { DashboardStats, Project, RiskAnalysis } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AlertTriangle,  Briefcase, TrendingUp, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [risks, setRisks] = useState<{ id: number; name: string; risk: RiskAnalysis }[]>([]);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const currentStats = DataService.getDashboardStats();
      const currentProjects = DataService.getProjects();
      
      const analyzedRisks = currentProjects.map(p => ({
        id: p.id,
        name: p.name,
        risk: DataService.calculateProjectRisk(p)
      }));

      setStats(currentStats);
      setProjects(currentProjects);
      setRisks(analyzedRisks);
    }, 300);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading Analytics...</p>
      </div>
    );
  }

  // Chart Data Preparation
  const budgetVsSpentData = projects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Budget: p.budget,
    Spent: p.spent,
  }));

  const riskDistributionData = [
    { name: 'Low', value: risks.filter(r => r.risk.riskLevel === 'Low').length, color: '#22c55e' },
    { name: 'Medium', value: risks.filter(r => r.risk.riskLevel === 'Medium').length, color: '#eab308' },
    { name: 'High', value: risks.filter(r => r.risk.riskLevel === 'High').length, color: '#f97316' },
    { name: 'Critical', value: risks.filter(r => r.risk.riskLevel === 'Critical').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Executive Overview</h2>
           <p className="text-slate-500 mt-2 text-lg">Financial health and risk assessment summary.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-2.5 rounded-xl shadow-sm text-slate-600 border border-slate-200/60 font-medium">
           <RefreshCw size={14} className="text-slate-400" />
           Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Invoiced"
          value={`${stats.totalRevenue.toLocaleString()}`}
          
          iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
          trend="+12% vs last month"
          trendColor="text-green-600"
        />
        <KPICard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={<Briefcase size={24} className="text-white" />}
          iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
          trend="2 completed recently"
          trendColor="text-blue-600"
        />
        <KPICard
          title="Total Spent"
          value={`${stats.totalSpent.toLocaleString()}`}
          icon={<TrendingUp size={24} className="text-white" />}
          iconBg="bg-gradient-to-br from-violet-500 to-purple-600"
          trend={`${((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of budget`}
          trendColor="text-purple-600"
        />
        <KPICard
          title="Critical Risks"
          value={stats.criticalRisks.toString()}
          icon={<AlertTriangle size={24} className="text-white" />}
          iconBg="bg-gradient-to-br from-red-500 to-rose-600"
          isAlert={stats.criticalRisks > 0}
          trend="Action required immediately"
          trendColor="text-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100/60">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-slate-800">Budget vs Actual Spend</h3>
             <select className="text-sm border-none bg-slate-50 text-slate-600 rounded-lg px-3 py-1 focus:ring-0 cursor-pointer">
                <option>This Year</option>
                <option>Last Year</option>
             </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsSpentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="name" 
                   tick={{ fontSize: 12, fill: '#64748b' }} 
                   axisLine={false} 
                   tickLine={false} 
                   dy={10}
                />
                <YAxis 
                   tickFormatter={(val) => `${val / 1000}k`} 
                   tick={{ fontSize: 12, fill: '#64748b' }} 
                   axisLine={false} 
                   tickLine={false} 
                   dx={-10}
                />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Total Budget" />
                <Bar dataKey="Spent" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} name="Amount Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Donut Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100/60 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Risk Distribution</h3>
          <div className="h-64 flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
             </ResponsiveContainer>
          </div>
          
          <div className="mt-6 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">High Attention Projects</h4>
            {risks.filter(r => r.risk.riskLevel === 'High' || r.risk.riskLevel === 'Critical').length === 0 ? (
               <div className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl">All projects stable.</div>
            ) : (
               risks.filter(r => r.risk.riskLevel === 'High' || r.risk.riskLevel === 'Critical').map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{r.name}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.risk.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {r.risk.riskLevel}
                    </span>
                  </div>
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, iconBg, trend, trendColor, isAlert }: any) => (
  <div className={`relative p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden`}>
    {isAlert && (
       <div className="absolute top-0 right-0 p-3">
         <span className="relative flex h-3 w-3">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
         </span>
       </div>
    )}
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-xl shadow-md ${iconBg} transform group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`text-xs font-medium mt-4 pt-4 border-t border-slate-50 flex items-center gap-1 ${trendColor || 'text-slate-400'}`}>
       {trendColor && <TrendingUp size={14} />}
       {trend}
    </div>
  </div>
);

export default Dashboard;