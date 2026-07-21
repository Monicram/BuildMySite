import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const links = [
  { label: 'Templates',   href: '#templates' },
  { label: 'Impression',  href: '#impression' },
  { label: 'Pricing',     href: '#pricing' },
  { label: 'Portfolio',   href: '#portfolio' },
  { label: 'Reviews',     href: '#reviews' },
  { label: 'Contact',     href: '#plan' },
];

export default function Nav() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian-900/95 backdrop-blur-md border-b border-gold-600/20 shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-sm bg-gold-gradient flex items-center justify-center">
            <Globe className="w-4 h-4 text-obsidian-900" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-xl font-bold tracking-wide">
            <span className="gold-text">Build</span>
            <span className="text-obsidian-100">MySite</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-obsidian-300 hover:text-gold-400 transition-colors duration-200 tracking-wide"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <a href="#book" className="gold-btn text-sm py-2.5 px-6">
            Book a Call
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setOpen(o => !o)}
            className="text-obsidian-300 hover:text-gold-400 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-obsidian-900/98 backdrop-blur-md border-t border-gold-600/20 px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-obsidian-300 hover:text-gold-400 transition-colors text-lg"
            >
              {l.label}
            </a>
          ))}
          <a href="#book" onClick={() => setOpen(false)} className="gold-btn text-center mt-2">
            Book a Discovery Call
          </a>
        </div>
      )}
    </header>
  );
}
