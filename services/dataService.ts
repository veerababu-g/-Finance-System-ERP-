import { Project, Invoice, User, RiskAnalysis, DashboardStats } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'erp_projects',
  INVOICES: 'erp_invoices',
  USER: 'erp_user',
};

// Initial Seed Data
const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    const projects: Project[] = [
      { id: 1, name: 'Skyline Apartments', budget: 500000, spent: 120000, progress: 25, status: 'Active', startDate: '2023-01-15', endDate: '2024-06-30' },
      { id: 2, name: 'Downtown Plaza Reno', budget: 150000, spent: 140000, progress: 60, status: 'Active', startDate: '2023-05-01', endDate: '2023-12-01' },
      { id: 3, name: 'Westside Bridge', budget: 1200000, spent: 400000, progress: 30, status: 'Active', startDate: '2022-11-20', endDate: '2025-01-15' },
    ];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    const invoices: Invoice[] = [
      { id: 1, projectId: 1, amount: 50000, description: 'Initial Material Order', date: '2023-02-10', status: 'Paid' },
      { id: 2, projectId: 2, amount: 75000, description: 'Subcontractor Phase 1', date: '2023-06-15', status: 'Paid' },
      { id: 3, projectId: 1, amount: 25000, description: 'Plumbing Rough-in', date: '2023-08-20', status: 'Pending' },
    ];
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }
};

// Initialize
seedData();

export const AuthService = {
  login: async (username: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: User = {
      id: 'u_123',
      username,
      role: 'Admin',
      token: 'mock-jwt-token-' + Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(STORAGE_KEYS.USER);
    return u ? JSON.parse(u) : null;
  }
};

export const DataService = {
  getProjects: (): Project[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  },

  addProject: (project: Omit<Project, 'id'>) => {
    const projects = DataService.getProjects();
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const newProject = { ...project, id: newId };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },

  getInvoices: (): Invoice[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES) || '[]');
  },

  addInvoice: (invoice: Omit<Invoice, 'id'>) => {
    const invoices = DataService.getInvoices();
    const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1;
    const newInvoice = { ...invoice, id: newId };
    invoices.push(newInvoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));

    // Update Project Spent Amount (Business Logic)
    const projects = DataService.getProjects();
    const projectIndex = projects.findIndex(p => p.id === invoice.projectId);
    if (projectIndex > -1) {
      projects[projectIndex].spent += Number(invoice.amount);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }

    return newInvoice;
  },

  // The "AI" Logic from the requirements
  calculateProjectRisk: (project: Project): RiskAnalysis => {
    let riskScore = 0;
    let riskLevel: RiskAnalysis['riskLevel'] = "Low";
    let reason = "Project is on track.";

    const budgetUsedPercent = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;

    // Logic: If we spent X% of money but only finished Y% of work
    // Threshold: Spent > Progress + 20%
    if (budgetUsedPercent > project.progress + 20) {
      riskScore += 50;
      reason = `Spending (${budgetUsedPercent.toFixed(1)}%) significantly exceeds progress (${project.progress}%).`;
    }

    // Logic 2: Near budget limit
    if (budgetUsedPercent > 90) {
      riskScore += 30;
      reason = riskScore > 50 ? reason + " Also near budget limit." : "Project is nearing total budget.";
    }

    if (riskScore > 60) riskLevel = "Critical";
    else if (riskScore > 30) riskLevel = "High";
    else if (riskScore > 10) riskLevel = "Medium";

    return {
      projectId: project.id,
      riskScore,
      riskLevel,
      reason
    };
  },

  getDashboardStats: (): DashboardStats => {
    const projects = DataService.getProjects();
    const invoices = DataService.getInvoices();

    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const totalSpent = projects.reduce((acc, curr) => acc + curr.spent, 0);
    
    let criticalRisks = 0;
    projects.forEach(p => {
      const risk = DataService.calculateProjectRisk(p);
      if (risk.riskLevel === 'High' || risk.riskLevel === 'Critical') criticalRisks++;
    });

    return {
      totalRevenue,
      activeProjects: projects.filter(p => p.status === 'Active').length,
      totalBudget,
      totalSpent,
      criticalRisks
    };
  }
};