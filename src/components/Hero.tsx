import { ArrowRight, Star, CheckCircle } from 'lucide-react';

const stats = [
  { value: '200+', label: 'Sites Delivered' },
  { value: '98%',  label: 'Client Satisfaction' },
  { value: '7-Day', label: 'MVP Launch' },
  { value: '24/7', label: 'Support Available' },
];

const badges = [
  'No Technical Knowledge Needed',
  'Fixed Pricing — No Surprises',
  'Mobile-First by Default',
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-obsidian-950 bg-grid-pattern"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold-600/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-700/8 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <span className="text-obsidian-400 text-sm">Trusted by 200+ businesses</span>
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6">
              Your Vision,
              <br />
              <span className="gold-text">Beautifully</span>
              <br />
              <span className="italic font-normal">Built.</span>
            </h1>

            <p className="text-obsidian-300 text-lg leading-relaxed mb-8 max-w-lg">
              We craft bespoke websites for solo founders, small businesses, and ambitious startups — with clear pricing, no jargon, and a launch guarantee.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="#plan" className="gold-btn flex items-center justify-center gap-2">
                Plan My Website
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#book" className="ghost-btn flex items-center justify-center gap-2">
                Book a Discovery Call
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              {badges.map(b => (
                <div key={b} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-obsidian-300 text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock browser preview */}
          <div className="relative hidden lg:block">
            <div className="animate-float">
              <div className="rounded-sm overflow-hidden shadow-gold-lg border border-gold-600/30">
                {/* Browser chrome */}
                <div className="bg-obsidian-800 px-4 py-3 flex items-center gap-2 border-b border-obsidian-700">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-4 bg-obsidian-700 rounded px-3 py-1 text-xs text-obsidian-400 text-center">
                    www.yourbusiness.com
                  </div>
                </div>
                {/* Fake site preview */}
                <div className="bg-obsidian-900 p-0 aspect-[16/10]">
                  <img
                    src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Website preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-8 bg-obsidian-800 border border-gold-600/40 rounded-sm px-5 py-4 shadow-card">
                <div className="text-xs text-obsidian-400 mb-1">New enquiry received</div>
                <div className="text-sm font-medium text-obsidian-100">Sarah — Spa & Wellness</div>
                <div className="text-xs text-gold-500 mt-1">Discovery call booked ✓</div>
              </div>

              <div className="absolute -top-4 -right-4 bg-obsidian-800 border border-gold-600/40 rounded-sm px-5 py-4 shadow-card">
                <div className="text-xs text-obsidian-400 mb-1">Site launched</div>
                <div className="text-2xl font-bold gold-text">7 days</div>
                <div className="text-xs text-obsidian-400">avg. delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 pt-10 border-t border-obsidian-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-3xl font-bold gold-text mb-1">{s.value}</div>
                <div className="text-obsidian-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
