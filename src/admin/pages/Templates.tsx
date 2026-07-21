// ============================================================
// BuildMySite Admin — Templates Page
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Star, Search } from 'lucide-react';
import type { Template } from '../types';

const MOCK_TEMPLATES: Template[] = [
  { id: 1, name: 'Prestige Business', category: 'Corporate', price: '£499', preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=250&fit=crop', tags: ['Dark', 'Minimal', 'Professional'], featured: true, description: 'Sleek dark corporate website for high-end businesses' },
  { id: 2, name: 'Elite Portfolio', category: 'Portfolio', price: '£349', preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop', tags: ['Gallery', 'Creative', 'Animations'], featured: false, description: 'Creative portfolio with stunning gallery layouts' },
  { id: 3, name: 'Gold Commerce', category: 'E-Commerce', price: '£699', preview: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop', tags: ['Shop', 'Stripe', 'Dark'], featured: true, description: 'Premium e-commerce template with Stripe integration' },
  { id: 4, name: 'Studio Noir', category: 'Agency', price: '£549', preview: 'https://images.unsplash.com/photo-1509395062183-a6c60f33d0be?w=400&h=250&fit=crop', tags: ['Agency', 'Bold', 'Creative'], featured: false, description: 'Bold creative agency website with animations' },
  { id: 5, name: 'Wellness Pro', category: 'Health', price: '£399', preview: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=250&fit=crop', tags: ['Health', 'Booking', 'Clean'], featured: false, description: 'Wellness & coaching website with booking system' },
  { id: 6, name: 'SaaS Launch', category: 'SaaS', price: '£799', preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop', tags: ['SaaS', 'Dashboard', 'Tech'], featured: true, description: 'Full SaaS landing page with pricing and dashboards' },
];

const Templates = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(MOCK_TEMPLATES.map(t => t.category)))];
  const filtered = MOCK_TEMPLATES.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <Layers size={22} className="text-gold-400" /> Templates
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">{MOCK_TEMPLATES.length} website templates</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500" />
          <input type="text" placeholder="Search templates…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded-xl text-sm text-obsidian-100 placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors" />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
              category === c ? 'bg-gold-500/15 border-gold-500/30 text-gold-400' : 'border-obsidian-700 text-obsidian-400 hover:text-obsidian-200 hover:border-obsidian-600'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-obsidian-800/60 border border-obsidian-700/50 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all group">
            <div className="relative overflow-hidden h-44">
              <img src={t.preview} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 to-transparent" />
              {t.featured && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-gold-500/90 rounded-lg text-obsidian-900 text-xs font-bold">
                  <Star size={11} /> Featured
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-0.5 bg-obsidian-900/80 border border-obsidian-700 rounded-lg text-xs text-obsidian-300">{t.category}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-obsidian-100">{t.name}</p>
                <span className="text-gold-400 font-bold text-sm shrink-0">{t.price}</span>
              </div>
              <p className="text-xs text-obsidian-400 mb-3 leading-relaxed">{t.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-obsidian-700 rounded text-[10px] text-obsidian-400">{tag}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-xl border border-obsidian-600 text-obsidian-300 text-xs hover:bg-obsidian-700 transition-colors">Preview</button>
                <button className="flex-1 gold-btn py-2 text-xs">Use Template</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
