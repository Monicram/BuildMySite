import { CheckCircle, Zap, Star, Crown } from 'lucide-react';

const tiers = [
  {
    icon: Zap,
    name: 'Starter',
    tagline: 'Launch fast, look great.',
    price: '₹19,999',
    period: 'one-time',
    monthlyNote: '+ ₹2,499/mo hosting & maintenance',
    description: 'Perfect for solo founders and small businesses launching their first professional web presence.',
    pages: 'Up to 4 pages',
    features: [
      'Custom designed to your brand',
      'Mobile-first responsive build',
      'Contact form & WhatsApp button',
      'Google Maps integration',
      'Basic SEO setup',
      'Fast hosting included (1st month)',
      '7-day launch guarantee',
      '14-day post-launch support',
    ],
    cta: 'Get Started',
    highlight: false,
    badge: null,
  },
  {
    icon: Star,
    name: 'Pro',
    tagline: 'More pages, more power.',
    price: '₹39,999',
    period: 'one-time',
    monthlyNote: '+ ₹3,999/mo hosting & maintenance',
    description: 'Ideal for growing businesses that need booking systems, blog, and richer customer journeys.',
    pages: 'Up to 8 pages',
    features: [
      'Everything in Starter',
      'Online booking / appointment system',
      'Blog or news section',
      'Automated email confirmations',
      'Live chat widget setup',
      'Google Analytics & Search Console',
      'Advanced SEO optimisation',
      '3-month priority support',
      'Social media meta tags',
    ],
    cta: 'Choose Pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    icon: Crown,
    name: 'Growth',
    tagline: 'Scale without limits.',
    price: '₹69,999',
    period: 'one-time',
    monthlyNote: '+ ₹5,999/mo managed support',
    description: 'For ambitious businesses needing e-commerce, custom integrations, and full-service management.',
    pages: '10+ pages',
    features: [
      'Everything in Pro',
      'E-commerce / online store',
      'Payment gateway integration',
      'Custom CMS for self-editing',
      'Multi-language support',
      'Advanced automation (Zapier/Make)',
      'Priority design revisions (unlimited)',
      '12-month managed maintenance',
      'Monthly performance reports',
      'Dedicated account manager',
    ],
    cta: 'Go Growth',
    highlight: false,
    badge: 'Best Value',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-obsidian-950 bg-grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-600/4 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">Transparent Pricing</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
            Investment That <span className="gold-text italic">Delivers</span>
          </h2>
          <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
            No hidden fees. No hourly surprises. A fixed price that covers everything from first design to launch day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map(tier => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-sm transition-all duration-300 hover:translate-y-[-4px] ${
                  tier.highlight
                    ? 'bg-obsidian-800 border-2 border-gold-500 shadow-gold-lg'
                    : 'card-dark hover:border-gold-600/40 hover:shadow-gold'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-gradient text-obsidian-900 text-xs font-bold px-4 py-1.5 rounded-sm whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                      tier.highlight ? 'bg-gold-gradient' : 'bg-obsidian-700'
                    }`}>
                      <Icon className={`w-5 h-5 ${tier.highlight ? 'text-obsidian-900' : 'text-gold-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-obsidian-50">{tier.name}</h3>
                      <p className="text-obsidian-400 text-xs">{tier.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className={`font-serif text-5xl font-bold ${tier.highlight ? 'gold-text' : 'text-obsidian-50'}`}>
                      {tier.price}
                    </span>
                    <span className="text-obsidian-400 text-sm ml-2">{tier.period}</span>
                  </div>
                  <p className="text-obsidian-500 text-xs mb-5">{tier.monthlyNote}</p>

                  <div className="divider-gold mb-5" />

                  <p className="text-obsidian-300 text-sm leading-relaxed mb-6">{tier.description}</p>
                  <p className="text-gold-500 text-sm font-semibold mb-4">{tier.pages}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="text-obsidian-300 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#book"
                    className={`text-center py-3.5 rounded-sm font-semibold text-sm transition-all duration-300 ${
                      tier.highlight ? 'gold-btn' : 'ghost-btn block'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add-ons note */}
        <div className="mt-14 text-center card-dark p-8 rounded-sm">
          <p className="text-obsidian-300 text-sm mb-2">
            Need something specific? Add-ons available: extra pages from <span className="text-gold-400">₹6,299</span>,
            logo design from <span className="text-gold-400">₹12,499</span>,
            WhatsApp business automation from <span className="text-gold-400">₹7,999</span>,
            and priority 48-hour builds from <span className="text-gold-400">₹16,999</span>.
          </p>
          <a href="#book" className="text-gold-400 hover:text-gold-300 text-sm font-medium underline underline-offset-2 transition-colors">
            Talk to us about a fully custom quote →
          </a>
        </div>
      </div>
    </section>
  );
}
