import { useState } from 'react';
import { ArrowRight, Eye, Sparkles, Layers, Zap } from 'lucide-react';
import TemplateModal, { TemplateData } from './TemplateModal';

const showcaseTemplates: TemplateData[] = [
  {
    name: 'Prestige',
    category: 'Corporate & Professional',
    description:
      'Commanding, structured layout ideal for law firms, consultancies, and financial services. Exudes authority and trust.',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pages: '7 pages',
    highlight: 'Most Popular',
  },
  {
    name: 'Bloom',
    category: 'Health, Beauty & Wellness',
    description:
      'Soft, elevated design for spas, salons, and wellness brands. Prioritises appointment booking and photography.',
    image:
      'https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pages: '6 pages',
    highlight: null,
  },
  {
    name: 'Commerce',
    category: 'E-Commerce & Retail',
    description:
      'Conversion-focused storefront with product grids, cart, checkout, and integrated payment flows.',
    image:
      'https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1200',
    pages: '10+ pages',
    highlight: 'Best for Retail',
  },
];

const designPillars = [
  {
    icon: Sparkles,
    title: 'Premium First Impressions',
    description:
      'Every pixel is intentional. Our designs command attention and establish credibility within seconds — because you never get a second chance.',
  },
  {
    icon: Layers,
    title: 'Brand-Perfect Customisation',
    description:
      'Templates are starting points. We adapt every colour, font, layout, and interaction to feel uniquely yours.',
  },
  {
    icon: Zap,
    title: 'Performance by Default',
    description:
      'Fast, accessible, and SEO-ready. Every site scores 90+ on Google PageSpeed and is built to rank.',
  },
];

export default function MakeAnImpression() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <section id="impression" className="py-28 bg-obsidian-950 bg-grid-pattern relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/4 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-gold-700/5 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="section-label mb-4">Design Excellence</p>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
              Make an <span className="gold-text italic">Impression</span>
            </h2>
            <p className="text-obsidian-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Great design isn't decoration — it's your most powerful sales tool. Explore our showcase and see why clients choose BuildMySite to represent their brand online.
            </p>
          </div>

          {/* Design pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {designPillars.map(pillar => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="card-dark p-7 hover:border-gold-600/40 hover:shadow-gold transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-sm bg-obsidian-700 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-obsidian-50 mb-3">{pillar.title}</h3>
                  <p className="text-obsidian-400 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>

          {/* Featured showcase — large interactive cards */}
          <div className="mb-8">
            <p className="section-label mb-6 text-center">Featured Designs</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-14">
            {showcaseTemplates.map((t, i) => (
              <div
                key={t.name}
                className={`group relative overflow-hidden rounded-sm border transition-all duration-500 cursor-pointer ${
                  hoveredIndex === i
                    ? 'border-gold-500 shadow-gold-lg scale-[1.02]'
                    : 'border-obsidian-700 hover:border-gold-600/50'
                } ${i === 0 ? 'lg:row-span-1' : ''}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setActiveTemplate(t)}
                role="button"
                tabIndex={0}
                aria-label={`Preview ${t.name} design`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTemplate(t);
                  }
                }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredIndex === i ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent" />

                  {/* Hover CTA */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredIndex === i ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      id={`impression-preview-${t.name.toLowerCase()}`}
                      onClick={e => {
                        e.stopPropagation();
                        setActiveTemplate(t);
                      }}
                      className="flex items-center gap-2 bg-gold-gradient text-obsidian-900 font-bold px-6 py-3 rounded-sm shadow-gold text-sm hover:shadow-gold-lg transition-shadow duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Preview
                    </button>
                  </div>

                  {t.highlight && (
                    <span className="absolute top-4 right-4 bg-gold-gradient text-obsidian-900 text-xs font-bold px-3 py-1 rounded-sm">
                      {t.highlight}
                    </span>
                  )}
                </div>

                {/* Card footer */}
                <div className="bg-obsidian-900 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gold-500 font-semibold tracking-widest uppercase mb-1">
                      {t.category}
                    </p>
                    <h3 className="font-serif text-xl font-bold text-obsidian-50">{t.name}</h3>
                    <p className="text-obsidian-400 text-xs mt-1">{t.pages}</p>
                  </div>
                  <button
                    id={`impression-open-${t.name.toLowerCase()}`}
                    onClick={e => {
                      e.stopPropagation();
                      setActiveTemplate(t);
                    }}
                    aria-label={`Open ${t.name} details`}
                    className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-all duration-300 ${
                      hoveredIndex === i
                        ? 'border-gold-500 bg-gold-gradient text-obsidian-900'
                        : 'border-obsidian-600 text-obsidian-400'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div className="relative card-dark p-10 lg:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-600/5 to-transparent" />
            </div>
            <div className="relative">
              <p className="section-label mb-4">Ready to Stand Out?</p>
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-obsidian-50 mb-5">
                Your brand deserves a site that{' '}
                <span className="gold-text italic">commands the room.</span>
              </h3>
              <p className="text-obsidian-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Every template is a launchpad. We take your brief, your brand, and your ambition — and build something that makes your competitors nervous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  id="impression-browse-templates"
                  href="#templates"
                  className="gold-btn flex items-center justify-center gap-2"
                >
                  Browse All Templates
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  id="impression-get-started"
                  href="#plan"
                  className="ghost-btn flex items-center justify-center gap-2"
                >
                  Get Started Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Template Modal */}
      <TemplateModal
        template={activeTemplate}
        onClose={() => setActiveTemplate(null)}
      />
    </>
  );
}
