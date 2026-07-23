import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PortfolioModal, { ProjectData } from './PortfolioModal';

const projects: ProjectData[] = [
  {
    name: 'Fitness',
    category: 'Health & Wellness',
    description:
      'A high-conversion gym website with class schedules, membership sign-ups, and trainer profiles.',
    image: '/images/fitness.jpg',
    tech: ['Landing Page', 'Schedules', 'Memberships'],
    result: '2.4x sign-up rate',
    tier: 'Growth',
  },
  {
    name: 'Bakery',
    category: 'Food & Retail',
    description:
      'A full e-commerce storefront for an independent bakery brand — product filtering, cart, and order checkout.',
    image: '/images/bakery.jpg',
    tech: ['E-Commerce', 'Stripe', 'Automated Emails'],
    result: '₹68L first-year revenue',
    tier: 'Starter',
  },
  {
    name: 'Portfolio',
    category: 'Creative Design',
    description:
      'A luxurious portfolio website for a creative professional, with project galleries and a contact form.',
    image: '/images/portfolio.jpg',
    tech: ['Gallery', 'Contact Form', 'Responsive'],
    result: '3x project inquiries',
    tier: 'Pro',
  },
];

const tierColors: Record<string, string> = {
  Starter: 'bg-obsidian-700 text-obsidian-300',
  Pro: 'bg-gold-900/30 text-gold-400 border border-gold-600/30',
  Growth: 'bg-gold-gradient text-obsidian-900',
};

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  return (
    <>
      <section id="portfolio" className="py-28 bg-obsidian-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Our Work</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
              Proof in Every <span className="gold-text italic">Pixel</span>
            </h2>
            <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
              Real sites, real results. Here's a selection of businesses we've helped grow online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <div
                key={p.name}
                className={`group card-dark overflow-hidden hover:border-gold-600/50 transition-all duration-300 hover:shadow-gold cursor-pointer ${
                  i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                onClick={() => setActiveProject(p)}
                role="button"
                tabIndex={0}
                aria-label={`View ${p.name} case study`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveProject(p);
                  }
                }}
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/30 to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-obsidian-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-obsidian-800/90 backdrop-blur-sm border border-gold-600/50 text-gold-400 font-semibold px-5 py-2.5 rounded-sm text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      View Case Study
                    </div>
                  </div>

                  {/* Tier badge */}
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-sm ${tierColors[p.tier]}`}>
                    {p.tier} Plan
                  </span>

                  {/* Result */}
                  <div className="absolute bottom-3 right-3 bg-obsidian-900/80 backdrop-blur-sm border border-gold-600/30 px-3 py-2 rounded-sm">
                    <p className="text-gold-400 text-xs font-semibold">{p.result}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="section-label text-[10px] mb-1">{p.category}</p>
                      <h3 className="font-serif text-lg font-bold text-obsidian-50">{p.name}</h3>
                    </div>
                    <button
                      id={`portfolio-open-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={e => {
                        e.stopPropagation();
                        setActiveProject(p);
                      }}
                      aria-label={`Open ${p.name} case study`}
                      className="text-obsidian-500 hover:text-gold-400 transition-colors mt-1"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-obsidian-400 text-sm leading-relaxed mb-4">{p.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {p.tech.map(t => (
                      <span key={t} className="text-xs text-obsidian-400 bg-obsidian-700 px-2.5 py-1 rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Case Study Modal */}
      <PortfolioModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
