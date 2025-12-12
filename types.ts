export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Manager';
  token: string;
}

export interface Project {
  id: number;
  name: string;
  budget: number;
  spent: number;
  progress: number; // 0 to 100
  status: 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
}

export interface Invoice {
  id: number;
  projectId: number;
  amount: number;
  description: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface RiskAnalysis {
  projectId: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reason: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeProjects: number;
  totalBudget: number;
  totalSpent: number;
  criticalRisks: number;
}