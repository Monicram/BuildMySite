import { Sparkles, Layers, Zap } from 'lucide-react';

const designPillars = [
  {
    icon: Sparkles,
    title: 'Premium First Impressions',
    description:
      'Every pixel is intentional. Our designs command attention and establish credibility within seconds because you never get a second chance.',
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
      'Fast, accessible, and SEO-ready. Every site is optimized for speed and built to rank well.',
  },
];

export default function MakeAnImpression() {
  return (
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
            Great design isn't decoration — it's your most powerful sales tool.
          </p>
        </div>

        {/* Design pillars */}
        <div className="grid md:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}

