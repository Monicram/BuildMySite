import { useState } from 'react';
import { ExternalLink, ArrowRight, Eye } from 'lucide-react';
import TemplateModal, { TemplateData } from './TemplateModal';

const templates: TemplateData[] = [
  {
    name: 'Fitness',
    category: 'Health & Wellness',
    description:
      'Clean, energetic design for gyms, personal trainers, and fitness studios.',
    image: '/images/fitness.jpg',
    pages: '6 pages',
    highlight: 'Most Popular',
  },
  {
    name: 'Bakery',
    category: 'Food & Retail',
    description:
      'Warm, inviting storefront for bakeries, cafes, and local food businesses.',
    image: '/images/bakery.jpg',
    pages: '10+ pages',
    highlight: 'Best for Retail',
  },
  {
    name: 'Restaurant',
    category: 'Hospitality & Dining',
    description:
      'Elegant booking-first template for restaurants, complete with menus and reservations.',
    image: '/images/restaurant.jpg',
    pages: '6 pages',
    highlight: null,
  },
  {
    name: 'Portfolio',
    category: 'Creative & Personal',
    description:
      'Immersive full-screen portfolio for showcasing your best work.',
    image: '/images/portfolio.jpg',
    pages: '5 pages',
    highlight: null,
  },
  {
    name: 'Business',
    category: 'Corporate & Professional',
    description:
      'Commanding, structured layout ideal for corporate offices and consulting firms.',
    image: '/images/business.jpg',
    pages: '7 pages',
    highlight: null,
  },
  {
    name: 'School',
    category: 'Education',
    description:
      'Clean, informative website for a local school, featuring notice boards, admission details, and galleries.',
    image: '/images/school.jpg',
    pages: '4 pages',
    highlight: 'Fastest Build',
  },
];

export default function Templates() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateData | null>(null);

  return (
    <>
      <section id="templates" className="py-28 bg-obsidian-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="section-label mb-4">Template Gallery</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
              Designs That Make <span className="gold-text italic">Impressions</span>
            </h2>
            <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
              Each template is a starting point — fully customised to match your brand, content, and goals.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(t => (
              <div
                key={t.name}
                className="group card-dark overflow-hidden hover:border-gold-600/50 transition-all duration-300 hover:shadow-gold cursor-pointer"
                onClick={() => setActiveTemplate(t)}
                role="button"
                tabIndex={0}
                aria-label={`Preview ${t.name} template`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTemplate(t);
                  }
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 to-transparent" />

                  {/* Hover overlay — "View Preview" */}
                  <div className="absolute inset-0 flex items-center justify-center bg-obsidian-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-gold-gradient text-obsidian-900 font-semibold px-5 py-2.5 rounded-sm text-sm shadow-gold">
                      <Eye className="w-4 h-4" />
                      View Preview
                    </div>
                  </div>

                  {t.highlight && (
                    <span className="absolute top-3 right-3 bg-gold-gradient text-obsidian-900 text-xs font-bold px-3 py-1 rounded-sm">
                      {t.highlight}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs text-gold-400 bg-obsidian-900/70 px-2 py-1 rounded-sm backdrop-blur-sm">
                      {t.pages}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="section-label mb-2 text-[10px]">{t.category}</p>
                  <h3 className="font-serif text-xl font-bold text-obsidian-50 mb-2">{t.name}</h3>
                  <p className="text-obsidian-400 text-sm leading-relaxed mb-5">{t.description}</p>

                  <div className="flex items-center gap-3">
                    <button
                      id={`template-use-btn-${t.name.toLowerCase()}`}
                      onClick={e => {
                        e.stopPropagation();
                        window.location.hash = '#plan';
                      }}
                      className="flex-1 text-center gold-btn text-sm py-2.5 px-4"
                    >
                      Use This Template
                    </button>
                    <button
                      id={`template-preview-btn-${t.name.toLowerCase()}`}
                      onClick={e => {
                        e.stopPropagation();
                        setActiveTemplate(t);
                      }}
                      aria-label={`Open full preview of ${t.name}`}
                      className="border border-obsidian-600 text-obsidian-400 hover:text-gold-400 hover:border-gold-600/40 p-2.5 rounded-sm transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#plan" className="ghost-btn inline-flex items-center gap-2">
              Don't see what you need? Let's build something custom
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      <TemplateModal
        template={activeTemplate}
        onClose={() => setActiveTemplate(null)}
      />
    </>
  );
}
