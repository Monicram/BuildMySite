import { useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';

export interface TemplateData {
  name: string;
  category: string;
  description: string;
  image: string;
  pages: string;
  highlight: string | null;
}

interface TemplateModalProps {
  template: TemplateData | null;
  onClose: () => void;
}

const templateDetails: Record<string, {
  longDescription: string;
  features: string[];
  pages: string[];
  bestFor: string[];
  accentColor: string;
  previewImages: string[];
}> = {
  Prestige: {
    longDescription:
      'Prestige is engineered for authority. Its structured grid layout, commanding typography, and restrained colour palette project professionalism from the first pixel. Built to convert high-value clients through trust signals, team bios, and a seamless consultation booking flow.',
    features: [
      'Multi-level navigation with mega menus',
      'Team profiles with individual bio pages',
      'Case study showcase section',
      'Consultation booking system',
      'Trust badges & credential display',
      'Legal compliance footer',
      'SEO-optimised blog',
      'Client portal login integration',
    ],
    pages: ['Home', 'About & Team', 'Services', 'Case Studies', 'Blog', 'Contact', 'Book a Consultation'],
    bestFor: ['Law Firms', 'Consultancies', 'Financial Services', 'Accountants', 'HR Agencies'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  Bloom: {
    longDescription:
      'Bloom breathes elegance. Designed for wellness and beauty brands, it leads with stunning photography, whisper-soft typography, and a frictionless online booking journey. Every scroll feels like a step into your sanctuary.',
    features: [
      'Online appointment booking with calendar',
      'Service menu with pricing tiers',
      'Before & after photo gallery',
      'Team & therapist profiles',
      'Gift voucher purchasing',
      'WhatsApp chat integration',
      'Google Reviews showcase',
      'Loyalty programme landing page',
    ],
    pages: ['Home', 'Services', 'Gallery', 'Our Team', 'Book Now', 'Gift Vouchers'],
    bestFor: ['Spas & Salons', 'Yoga Studios', 'Nutritionists', 'Aesthetics Clinics', 'Wellness Coaches'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  Commerce: {
    longDescription:
      'Commerce is a revenue-first storefront. Product discovery, filtering, cart management, and a streamlined Stripe checkout are all battle-tested for conversion. Includes automated order confirmation emails and inventory management hooks.',
    features: [
      'Full product catalogue with filters',
      'Shopping cart & wishlist',
      'Stripe / Razorpay checkout',
      'Order confirmation & shipping emails',
      'Customer account dashboard',
      'Discount codes & promotions',
      'Product review system',
      'Inventory management integration',
    ],
    pages: [
      'Home', 'Shop', 'Product Detail', 'Cart', 'Checkout', 'Order Confirmation',
      'My Account', 'About', 'Contact', 'FAQs',
    ],
    bestFor: ['Retail Brands', 'Fashion', 'Artisan Goods', 'Electronics', 'Food & Beverage'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  Folio: {
    longDescription:
      'Folio lets your work do the talking. Full-viewport imagery, smooth scroll transitions, and a case-study layout that turns every project into a story. Minimal UI, maximum impact — designed for creatives who live by aesthetics.',
    features: [
      'Full-screen hero with parallax',
      'Masonry or grid project gallery',
      'Individual case study pages',
      'Client testimonials carousel',
      'Award & recognition badges',
      'Process timeline section',
      'Contact & commission form',
      'Social media feed integration',
    ],
    pages: ['Home', 'Portfolio', 'Case Study', 'About', 'Contact'],
    bestFor: ['Photographers', 'Graphic Designers', 'Architects', 'Illustrators', 'Videographers'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  Reserve: {
    longDescription:
      'Reserve is built for hospitality. A cinematic hero, an interactive reservation widget, and a full seasonal menu system make Reserve the definitive template for restaurants, boutique hotels, and event spaces that refuse to compromise on experience.',
    features: [
      'Table reservation widget',
      'Interactive seasonal menu',
      'Events & private dining page',
      'Photo gallery with lightbox',
      'Gift voucher sales',
      'Google Maps & directions',
      'Press & awards section',
      'Chef & story section',
    ],
    pages: ['Home', 'Menus', 'Reservations', 'Events', 'Gallery', 'Our Story'],
    bestFor: ['Restaurants', 'Hotels', 'Event Venues', 'Bars & Clubs', 'Bakeries'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  Launch: {
    longDescription:
      'Launch is optimised for one thing: sign-ups. Feature showcase, social proof, pricing tiers, and a frictionless CTA flow — every element is purpose-built to convert visitors into trial users and trial users into paying customers.',
    features: [
      'Animated feature showcase',
      'Pricing tiers with toggle (monthly/annual)',
      'Social proof & logo wall',
      'FAQ accordion',
      'Video explainer embed',
      'Live chat / Intercom integration',
      'Trial sign-up form',
      'Affiliate / referral landing page',
    ],
    pages: ['Landing Page', 'Pricing', 'Features', 'Changelog'],
    bestFor: ['SaaS Products', 'Apps', 'Digital Tools', 'Online Courses', 'Marketplaces'],
    accentColor: '#D4AF37',
    previewImages: [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
};

export default function TemplateModal({ template, onClose }: TemplateModalProps) {
  const detail = template ? templateDetails[template.name] : null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (template) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [template]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!template || !detail) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} template preview`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-5xl mx-auto my-8 px-4 animate-modal-up">
        <div className="bg-obsidian-900 border border-obsidian-700 rounded-sm shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Close button */}
          <button
            id="template-modal-close"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-sm bg-obsidian-800 border border-obsidian-600 text-obsidian-300 hover:text-gold-400 hover:border-gold-600/40 transition-all duration-200"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero image */}
          <div className="relative overflow-hidden h-64 sm:h-80 lg:h-96">
            <img
              src={detail.previewImages[0]}
              alt={`${template.name} template preview`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent" />

            {/* Template name overlay */}
            <div className="absolute bottom-6 left-8">
              {template.highlight && (
                <span className="inline-block bg-gold-gradient text-obsidian-900 text-xs font-bold px-3 py-1 rounded-sm mb-3">
                  {template.highlight}
                </span>
              )}
              <p className="section-label mb-1">{template.category}</p>
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50">
                {template.name}
              </h2>
            </div>

            {/* Device icons */}
            <div className="absolute bottom-6 right-8 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-obsidian-800/80 backdrop-blur-sm border border-obsidian-700 px-3 py-1.5 rounded-sm">
                <Monitor className="w-3.5 h-3.5 text-gold-500" />
                <Tablet className="w-3 h-3 text-gold-400" />
                <Smartphone className="w-2.5 h-2.5 text-gold-400" />
                <span className="text-obsidian-400 text-xs ml-1">Responsive</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-10">
            <div className="grid lg:grid-cols-3 gap-10">

              {/* Left — description + features */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <p className="section-label mb-3">About This Template</p>
                  <p className="text-obsidian-300 leading-relaxed">{detail.longDescription}</p>
                </div>

                {/* Features */}
                <div>
                  <p className="section-label mb-4">What's Included</p>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {detail.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="text-obsidian-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pages */}
                <div>
                  <p className="section-label mb-3">Pages Included</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.pages.map(p => (
                      <span
                        key={p}
                        className="text-xs text-obsidian-300 bg-obsidian-800 border border-obsidian-600 px-3 py-1.5 rounded-sm"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preview images strip */}
                <div>
                  <p className="section-label mb-3">More Views</p>
                  <div className="grid grid-cols-2 gap-3">
                    {detail.previewImages.slice(1).map((img, i) => (
                      <div key={i} className="relative overflow-hidden rounded-sm aspect-video border border-obsidian-700">
                        <img
                          src={img}
                          alt={`${template.name} view ${i + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — sidebar */}
              <div className="space-y-6">
                {/* Stats card */}
                <div className="card-dark p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-obsidian-400 text-sm">Page Count</span>
                    <span className="text-gold-400 font-semibold text-sm">{template.pages}</span>
                  </div>
                  <div className="divider-gold mb-4" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-obsidian-400 text-sm">Mobile Ready</span>
                    <span className="text-green-400 font-semibold text-sm">✓ Yes</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-obsidian-400 text-sm">SEO Optimised</span>
                    <span className="text-green-400 font-semibold text-sm">✓ Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-obsidian-400 text-sm">CMS Ready</span>
                    <span className="text-green-400 font-semibold text-sm">✓ Yes</span>
                  </div>
                </div>

                {/* Best For */}
                <div className="card-dark p-6">
                  <p className="section-label mb-3">Best For</p>
                  <ul className="space-y-2">
                    {detail.bestFor.map(b => (
                      <li key={b} className="flex items-center gap-2 text-sm text-obsidian-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <a
                    id={`template-use-${template.name.toLowerCase()}`}
                    href="#plan"
                    onClick={onClose}
                    className="gold-btn w-full flex items-center justify-center gap-2 text-sm"
                  >
                    Use This Template
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    id={`template-enquire-${template.name.toLowerCase()}`}
                    href="#book"
                    onClick={onClose}
                    className="ghost-btn w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Discuss This Design
                  </a>
                </div>

                {/* Note */}
                <p className="text-obsidian-500 text-xs leading-relaxed text-center">
                  All templates are fully customised to your brand, content, and business goals. No two builds are ever identical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
