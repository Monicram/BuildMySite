import { useEffect } from 'react';
import { X, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';

export interface ProjectData {
  name: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  result: string;
  tier: string;
}

interface PortfolioModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const projectDetails: Record<string, {
  challenge: string;
  solution: string;
  outcomes: string[];
  images: string[];
  testimonial?: { quote: string; author: string; role: string };
}> = {
  'Meridian Law Group': {
    challenge:
      'Meridian had an outdated static site that made them invisible on Google and failed to communicate their 20+ years of specialist expertise to high-value corporate clients.',
    solution:
      'We built a commanding Prestige-template site with structured service pages, a case study showcase, and an integrated consultation booking widget — all fully SEO-optimised for high-intent legal queries.',
    outcomes: [
      '+340% organic enquiry volume within 6 months',
      'First-page Google ranking for 12 target keywords',
      'Consultation bookings up 5× versus the old contact form',
      '40% reduction in time spent fielding initial questions',
    ],
    images: [
      'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    testimonial: {
      quote:
        'BuildMySite transformed how prospective clients find and perceive us. The quality of enquiries we receive now is in a completely different league.',
      author: 'James Whitfield',
      role: 'Senior Partner, Meridian Law Group',
    },
  },
  'Luma Skin Studio': {
    challenge:
      'Luma was running a fully manual booking process via phone and Instagram DMs, losing clients to competitors who offered instant online booking.',
    solution:
      'We built a luxurious Bloom-template site centred on their appointment booking system, a before/after gallery with lightbox, automated WhatsApp reminders, and an in-depth treatment menu.',
    outcomes: [
      '3× appointment volume within the first quarter',
      '85% reduction in no-shows via automated reminders',
      'Average session value increased by 28%',
      'Instagram enquiries converted to bookings at 4× the previous rate',
    ],
    images: [
      'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    testimonial: {
      quote:
        'I genuinely did not expect the difference a great website would make. My diary is fully booked three weeks out now — something that never happened before.',
      author: 'Priya Mehta',
      role: 'Founder, Luma Skin Studio',
    },
  },
  'Nomad & Co.': {
    challenge:
      'Nomad & Co. were selling exclusively through Instagram and Etsy with no control over their brand experience, no customer data, and paying significant platform fees on every transaction.',
    solution:
      'A full Commerce-template e-commerce build: custom product pages, collection filtering, cart and wishlist, Stripe + Razorpay integration, and automated order/shipping email flows.',
    outcomes: [
      '₹68 lakh in first-year direct revenue',
      '0% platform commission — full margin retained',
      'Cart abandonment recaptured via automated emails',
      'Repeat purchase rate of 38% within 90 days',
    ],
    images: [
      'https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    testimonial: {
      quote:
        'Moving off Etsy was the best business decision I made last year. The website paid for itself within the first month.',
      author: 'Anika Sharma',
      role: 'Creative Director, Nomad & Co.',
    },
  },
  'The Copper Kettle': {
    challenge:
      "The Copper Kettle's dining room was 30% below capacity on weekdays, and a phone-only reservation system was creating friction that drove guests to competitors with easier online booking.",
    solution:
      'A Reserve-template site with an embedded real-time table reservation widget, seasonal menu CMS, events calendar, and gift voucher e-commerce — all designed to drive pre-visit commitment.',
    outcomes: [
      '60% reduction in no-shows after automated reminder emails',
      'Weekday covers increased by 45% within 3 months',
      '£8,200 in gift voucher sales in the first Christmas season',
      'Average booking lead time increased from 1 to 4 days',
    ],
    images: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    testimonial: {
      quote:
        'The online reservations system alone has been transformational. We have visibility weeks out and our team spends far less time on the phone.',
      author: 'Tom & Ellie Hargreaves',
      role: 'Owners, The Copper Kettle',
    },
  },
  'Orion Analytics': {
    challenge:
      'Orion had a developer-built MVP landing page with zero visual appeal that was failing to convert free trial sign-ups despite strong product-market fit.',
    solution:
      'A Launch-template overhaul with animated feature sections, a toggle pricing table, social proof wall, and a streamlined trial sign-up flow — plus live chat and Google Analytics integration.',
    outcomes: [
      '2.4× trial sign-up conversion rate improvement',
      'Time-on-page increased from 45 seconds to 3.2 minutes',
      'Paid plan conversion from trial improved by 18%',
      'Churn reduced via improved onboarding email sequence',
    ],
    images: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    testimonial: {
      quote:
        "We went from embarrassed to show the site to VCs to using it as a core part of our pitch. The ROI was immediate and measurable.",
      author: 'Rohan Gupta',
      role: 'CEO, Orion Analytics',
    },
  },
};

const tierColors: Record<string, string> = {
  Starter: 'bg-obsidian-700 text-obsidian-300',
  Pro: 'bg-gold-900/30 text-gold-400 border border-gold-600/30',
  Growth: 'bg-gold-gradient text-obsidian-900',
};

export default function PortfolioModal({ project, onClose }: PortfolioModalProps) {
  const detail = project ? projectDetails[project.name] : null;

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project || !detail) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-4xl mx-auto my-8 px-4 animate-modal-up">
        <div className="bg-obsidian-900 border border-obsidian-700 rounded-sm shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Close */}
          <button
            id="portfolio-modal-close"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-sm bg-obsidian-800 border border-obsidian-600 text-obsidian-300 hover:text-gold-400 hover:border-gold-600/40 transition-all duration-200"
            aria-label="Close case study"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero */}
          <div className="relative overflow-hidden h-56 sm:h-72">
            <img
              src={detail.images[0]}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/50 to-transparent" />

            <div className="absolute bottom-6 left-8">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-sm ${tierColors[project.tier]}`}>
                  {project.tier} Plan
                </span>
                <span className="text-gold-400 font-bold text-sm bg-obsidian-900/70 px-3 py-1 rounded-sm backdrop-blur-sm flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {project.result}
                </span>
              </div>
              <p className="section-label mb-1">{project.category}</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-obsidian-50">{project.name}</h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 lg:p-10 space-y-8">

            {/* Challenge + Solution */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card-dark p-6">
                <p className="section-label mb-3">The Challenge</p>
                <p className="text-obsidian-300 text-sm leading-relaxed">{detail.challenge}</p>
              </div>
              <div className="card-dark p-6">
                <p className="section-label mb-3">Our Solution</p>
                <p className="text-obsidian-300 text-sm leading-relaxed">{detail.solution}</p>
              </div>
            </div>

            {/* Outcomes */}
            <div>
              <p className="section-label mb-4">Results Delivered</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {detail.outcomes.map(o => (
                  <div key={o} className="flex items-start gap-2.5 bg-obsidian-800/60 border border-obsidian-700 rounded-sm p-3">
                    <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-obsidian-200 text-sm">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <p className="section-label mb-3">Technologies & Features</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="text-xs text-obsidian-300 bg-obsidian-800 border border-obsidian-600 px-3 py-1.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Second image */}
            {detail.images[1] && (
              <div className="overflow-hidden rounded-sm border border-obsidian-700 aspect-video">
                <img
                  src={detail.images[1]}
                  alt={`${project.name} detail`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Testimonial */}
            {detail.testimonial && (
              <div className="card-dark border-gold-600/30 p-6 lg:p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold-500 text-lg">★</span>
                  ))}
                </div>
                <blockquote className="font-serif text-lg text-obsidian-100 leading-relaxed mb-4 italic">
                  "{detail.testimonial.quote}"
                </blockquote>
                <div>
                  <p className="text-obsidian-100 font-semibold text-sm">{detail.testimonial.author}</p>
                  <p className="text-obsidian-400 text-xs">{detail.testimonial.role}</p>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                id={`portfolio-cta-plan-${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                href="#plan"
                onClick={onClose}
                className="gold-btn flex-1 flex items-center justify-center gap-2 text-sm"
              >
                Start a Similar Project
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                id={`portfolio-cta-call-${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                href="#book"
                onClick={onClose}
                className="ghost-btn flex-1 flex items-center justify-center gap-2 text-sm"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
