import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Project, RiskAnalysis } from '../types';
import { AlertCircle, Plus, Search, Calendar, Activity, ArrowUpRight } from 'lucide-react';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '', budget: 0, startDate: '', endDate: '', progress: 0, status: 'Active', spent: 0
  });

  useEffect(() => {
    setProjects(DataService.getProjects());
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.budget) {
      DataService.addProject(newProject as Project);
      setProjects(DataService.getProjects());
      setShowModal(false);
      setNewProject({ name: '', budget: 0, startDate: '', endDate: '', progress: 0, status: 'Active', spent: 0 });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Projects</h2>
          <p className="text-slate-500 text-lg mt-1">Manage active sites and monitor performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg shadow-blue-600/20 font-medium whitespace-nowrap hover:-translate-y-0.5"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
           <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Search size={32} className="opacity-40" />
             </div>
             <p className="text-lg font-medium">No projects found matching "{searchTerm}"</p>
             <button onClick={() => setSearchTerm('')} className="text-blue-600 font-medium mt-2 hover:underline">Clear Search</button>
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800">Create New Project</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Riverside Commercial Complex"
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget ($)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select 
                    className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-slate-600"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                    <input 
                      type="date" 
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-slate-600"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
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
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const riskAnalysis = DataService.calculateProjectRisk(project);
  const spentPercentage = Math.min((project.spent / project.budget) * 100, 100);

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full mb-3 ${
               project.status === 'Active' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {project.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>}
              {project.status}
            </span>
            <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{project.name}</h3>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 shadow-sm ${getRiskColor(riskAnalysis.riskLevel)}`}>
             <Activity size={14} />
             {riskAnalysis.riskLevel}
          </div>
        </div>

        <div className="space-y-6 mb-6">
          <div className="flex justify-between text-sm text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400"/> Deadline</span>
            <span className="font-semibold text-slate-700">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not Set'}</span>
          </div>

          <div>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-slate-500 font-medium">Budget Consumed</span>
               <span className="font-bold text-slate-800">{spentPercentage.toFixed(0)}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${spentPercentage > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`} 
                  style={{ width: `${spentPercentage}%` }}
                ></div>
             </div>
             <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                <span>{project.spent.toLocaleString()} spent</span>
                <span>{project.budget.toLocaleString()} total</span>
             </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
               <span className="text-slate-500 font-medium">Completion Status</span>
               <span className="font-bold text-slate-800">{project.progress}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex gap-3 transition-colors ${
        riskAnalysis.riskLevel === 'Low' ? 'bg-slate-50 border-slate-100' : 'bg-red-50/50 border-red-100'
      }`}>
        <div className={`p-1.5 rounded-full h-fit ${
          riskAnalysis.riskLevel === 'Low' ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-500'
        }`}>
           <AlertCircle size={16} />
        </div>
        <div>
           <p className="text-xs font-bold text-slate-700 mb-0.5 uppercase tracking-wide">AI Analysis</p>
           <p className="text-xs text-slate-600 leading-relaxed">{riskAnalysis.reason}</p>
        </div>
      </div>
    </div>
  );
};

export default Projects;