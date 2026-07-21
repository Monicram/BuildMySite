// ============================================================
// BuildMySite Admin — Projects Page
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Plus } from 'lucide-react';
import { getStatusColor, capitalize, formatDate } from '../utils';
import type { Project, ProjectStatus } from '../types';

const STATUSES: ProjectStatus[] = ['discovery', 'design', 'development', 'review', 'launched'];

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Luxe Interiors Website', client: 'Sophie Carter', email: 'sophie@luxeinteriors.com', status: 'development', budget: '£3,500', startDate: '2024-11-01', dueDate: '2024-12-15', progress: 65, tech: ['React', 'Tailwind', 'Framer Motion'], description: 'Premium interior design agency website' },
  { id: 2, name: 'FitLife Coach Portal', client: 'James Reid', email: 'james@fitlife.co', status: 'design', budget: '£2,200', startDate: '2024-11-10', dueDate: '2024-12-20', progress: 30, tech: ['Next.js', 'PostgreSQL'], description: 'Online coaching platform with booking' },
  { id: 3, name: 'GreenByte Tech', client: 'Aisha Patel', email: 'aisha@greenbyte.io', status: 'review', budget: '£5,000', startDate: '2024-10-15', dueDate: '2024-12-01', progress: 90, tech: ['React', 'Node.js', 'AWS'], description: 'SaaS dashboard for energy monitoring' },
  { id: 4, name: 'Bloom Bakery', client: 'Emma Walsh', email: 'emma@bloombakery.ie', status: 'launched', budget: '£1,800', startDate: '2024-09-01', dueDate: '2024-10-15', progress: 100, tech: ['HTML', 'CSS', 'JS'], description: 'E-commerce bakery website with Stripe' },
  { id: 5, name: 'NovaMed Clinic', client: 'Dr. Raj Sharma', email: 'raj@novamed.uk', status: 'discovery', budget: '£4,500', startDate: '2024-11-20', dueDate: '2025-01-30', progress: 10, tech: ['React', 'Node.js'], description: 'Private medical clinic booking system' },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-obsidian-900 border border-obsidian-700/60 rounded-xl p-4 hover:border-obsidian-600 transition-all group"
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="min-w-0">
        <p className="font-semibold text-obsidian-100 text-sm truncate">{project.name}</p>
        <p className="text-xs text-obsidian-500 truncate">{project.client}</p>
      </div>
      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
        {capitalize(project.status)}
      </span>
    </div>
    <div className="mb-3">
      <div className="flex justify-between text-xs text-obsidian-500 mb-1">
        <span>Progress</span><span className="text-gold-400 font-medium">{project.progress}%</span>
      </div>
      <div className="h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gold-gradient rounded-full"
        />
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-obsidian-500">
      <span className="text-gold-500 font-semibold">{project.budget}</span>
      <span>Due {formatDate(project.dueDate)}</span>
    </div>
    <div className="flex flex-wrap gap-1 mt-3">
      {project.tech.map(t => (
        <span key={t} className="px-1.5 py-0.5 bg-obsidian-800 border border-obsidian-700 rounded text-[10px] text-obsidian-400">{t}</span>
      ))}
    </div>
  </motion.div>
);

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? MOCK_PROJECTS
    : MOCK_PROJECTS.filter(p => p.status === activeFilter);

  const countByStatus = (s: ProjectStatus) => MOCK_PROJECTS.filter(p => p.status === s).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <FolderKanban size={22} className="text-gold-400" /> Projects
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">{MOCK_PROJECTS.length} active projects</p>
        </div>
        <button className="gold-btn flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setActiveFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeFilter === s
                ? 'bg-gold-500/15 border-gold-500/30 text-gold-400'
                : 'border-obsidian-700 text-obsidian-400 hover:border-obsidian-600 hover:text-obsidian-200'
            }`}>
            {s === 'all' ? `All (${MOCK_PROJECTS.length})` : `${capitalize(s)} (${countByStatus(s)})`}
          </button>
        ))}
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-obsidian-500">No projects in this stage.</div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUSES.map(s => (
          <div key={s} className="bg-obsidian-800/60 border border-obsidian-700/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-obsidian-100">{countByStatus(s)}</p>
            <p className="text-xs text-obsidian-500 mt-1 capitalize">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
