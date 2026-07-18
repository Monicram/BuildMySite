import { Globe, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const nav = [
  { label: 'Templates',          href: '#templates' },
  { label: 'Make an Impression', href: '#impression' },
  { label: 'Pricing',            href: '#pricing' },
  { label: 'Portfolio',          href: '#portfolio' },
  { label: 'Reviews',            href: '#reviews' },
  { label: 'Plan My Website',    href: '#plan' },
  { label: 'Book a Call',        href: '#book' },
];

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 border-t border-obsidian-800">
      {/* CTA strip */}
      <div className="bg-gold-gradient py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-obsidian-900 mb-4">
            Ready to Build Something Exceptional?
          </h2>
          <p className="text-obsidian-700 mb-8 text-lg">
            Join 200+ businesses who launched with BuildMySite. Your site, your brand, our expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#plan"
              className="bg-obsidian-900 text-gold-400 font-semibold px-8 py-3.5 rounded-sm hover:bg-obsidian-800 transition-colors duration-200"
            >
              Plan My Website
            </a>
            <a
              href="#book"
              className="border-2 border-obsidian-900 text-obsidian-900 font-semibold px-8 py-3.5 rounded-sm hover:bg-obsidian-900/10 transition-colors duration-200"
            >
              Book a Free Call
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-sm bg-gold-gradient flex items-center justify-center">
                <Globe className="w-4 h-4 text-obsidian-900" strokeWidth={2.5} />
              </div>
              <span className="font-serif text-xl font-bold tracking-wide">
                <span className="gold-text">Build</span>
                <span className="text-obsidian-100">MySite</span>
              </span>
            </a>
            <p className="text-obsidian-400 text-sm leading-relaxed max-w-sm mb-6">
              Bespoke websites for businesses that refuse to blend in. We make the complex feel effortless — from first call to launch day.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-sm border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:text-gold-400 hover:border-gold-600/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-obsidian-100 font-semibold mb-5">Navigation</h4>
            <ul className="space-y-3">
              {nav.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="text-obsidian-400 text-sm hover:text-gold-400 transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-obsidian-100 font-semibold mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-obsidian-400 text-sm">2006monica14@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-obsidian-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-obsidian-400 text-sm">Coimbatore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-obsidian-800 px-6 lg:px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-obsidian-500 text-sm">
            &copy; {new Date().getFullYear()} BuildMySite. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="text-obsidian-500 text-xs hover:text-gold-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
