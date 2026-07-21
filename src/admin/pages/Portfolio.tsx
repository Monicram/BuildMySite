// ============================================================
// BuildMySite Admin — Portfolio Page
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ExternalLink, Star, X } from 'lucide-react';
import type { PortfolioItem } from '../types';

const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: 1, title: 'Luxe Interiors', client: 'Sophie Carter', category: 'Corporate', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', url: 'https://example.com', tech: ['React', 'Tailwind', 'Framer'], featured: true, description: 'Premium interior design agency with glassmorphism effects.', completedAt: '2024-10' },
  { id: 2, title: 'FitLife Coach', client: 'James Reid', category: 'Health', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', url: 'https://example.com', tech: ['Next.js', 'PostgreSQL'], featured: false, description: 'Fitness coaching portal with appointment booking.', completedAt: '2024-09' },
  { id: 3, title: 'Bloom Bakery', client: 'Emma Walsh', category: 'E-Commerce', image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&h=400&fit=crop', url: 'https://example.com', tech: ['HTML', 'CSS', 'Stripe'], featured: true, description: 'E-commerce bakery with online ordering and Stripe checkout.', completedAt: '2024-10' },
  { id: 4, title: 'NovaMed Clinic', client: 'Dr. Raj Sharma', category: 'Healthcare', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop', url: 'https://example.com', tech: ['React', 'Node.js'], featured: false, description: 'Private clinic website with patient enquiry forms.', completedAt: '2024-11' },
];

const categories = ['all', ...Array.from(new Set(MOCK_PORTFOLIO.map(p => p.category)))];

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filtered = filter === 'all' ? MOCK_PORTFOLIO : MOCK_PORTFOLIO.filter(p => p.category === filter);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Image size={22} className="text-gold-400" /> Portfolio
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">{MOCK_PORTFOLIO.length} completed projects</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition-all ${
              filter === c ? 'bg-gold-500/15 border-gold-500/30 text-gold-400' : 'border-obsidian-700 text-obsidian-400 hover:text-obsidian-200'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="bg-obsidian-800/60 border border-obsidian-700/50 rounded-2xl overflow-hidden group cursor-pointer hover:border-gold-500/30 transition-all"
            onClick={() => setSelected(item)}>
            <div className="relative h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 to-transparent" />
              {item.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-gold-500/90 rounded-lg text-obsidian-900 text-xs font-bold">
                  <Star size={11} /> Featured
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-obsidian-900/80 border border-obsidian-700 rounded-lg text-xs text-obsidian-300">{item.category}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-obsidian-100">{item.title}</p>
                {item.url && <ExternalLink size={14} className="text-obsidian-500 hover:text-gold-400 transition-colors shrink-0 mt-0.5" />}
              </div>
              <p className="text-xs text-obsidian-500 mb-2">{item.client} · {item.completedAt}</p>
              <div className="flex flex-wrap gap-1">
                {item.tech.map(t => (
                  <span key={t} className="px-1.5 py-0.5 bg-obsidian-700 rounded text-[10px] text-obsidian-400">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <img src={selected.image} alt={selected.title} className="w-full h-56 object-cover" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-obsidian-900/80 text-obsidian-300 hover:text-obsidian-100 transition-colors">
                <X size={18} />
              </button>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-obsidian-100">{selected.title}</h2>
                    <p className="text-sm text-obsidian-400">{selected.client}</p>
                  </div>
                  <span className="px-2 py-1 bg-obsidian-800 border border-obsidian-700 rounded-lg text-xs text-obsidian-300">{selected.category}</span>
                </div>
                <p className="text-sm text-obsidian-300 mb-4 leading-relaxed">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selected.tech.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-gold-500/10 border border-gold-500/20 rounded-lg text-xs text-gold-400">{t}</span>
                  ))}
                </div>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                    <ExternalLink size={14} /> Visit Live Site
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
