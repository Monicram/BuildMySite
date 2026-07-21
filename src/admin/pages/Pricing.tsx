// ============================================================
// BuildMySite Admin — Pricing Page
// ============================================================
import { motion } from 'framer-motion';
import { DollarSign, Check } from 'lucide-react';
import type { PricingPlan } from '../types';

const PLANS: PricingPlan[] = [
  {
    id: 1, name: 'Starter', price: '£999', period: 'one-time', badge: undefined,
    description: 'Perfect for small businesses getting started online.',
    highlighted: false,
    features: ['Up to 5 pages', 'Mobile responsive', 'Contact form', 'Basic SEO', '1 month support', 'Hosting setup guide'],
  },
  {
    id: 2, name: 'Professional', price: '£2,499', period: 'one-time', badge: 'Most Popular',
    description: 'Full-featured website for growing businesses.',
    highlighted: true,
    features: ['Up to 15 pages', 'Custom animations', 'Blog / CMS', 'Advanced SEO', 'Google Analytics', '3 months support', 'Performance optimised', 'Social integrations'],
  },
  {
    id: 3, name: 'Enterprise', price: '£4,999+', period: 'one-time', badge: undefined,
    description: 'Bespoke solution for established businesses.',
    highlighted: false,
    features: ['Unlimited pages', 'E-commerce / Stripe', 'Custom dashboard', 'API integrations', 'Priority support 12 months', 'Dedicated project manager', 'SLA guarantee', 'White-glove onboarding'],
  },
];

const Pricing = () => (
  <div className="space-y-8 max-w-[1400px] mx-auto">
    <div>
      <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
        <DollarSign size={22} className="text-gold-400" /> Pricing Plans
      </h1>
      <p className="text-sm text-obsidian-400 mt-0.5">Manage your service offerings</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLANS.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative rounded-2xl p-6 flex flex-col ${
            plan.highlighted
              ? 'bg-obsidian-800 border-2 border-gold-500/50 shadow-gold'
              : 'bg-obsidian-800/60 border border-obsidian-700/50'
          }`}
        >
          {plan.badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-gradient rounded-full text-obsidian-900 text-xs font-bold">
              {plan.badge}
            </div>
          )}
          <div className="mb-6">
            <p className="text-sm font-semibold text-obsidian-400 uppercase tracking-wider mb-2">{plan.name}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`text-3xl font-bold ${plan.highlighted ? 'gold-text' : 'text-obsidian-100'}`}>{plan.price}</span>
              <span className="text-obsidian-500 text-sm">{plan.period}</span>
            </div>
            <p className="text-sm text-obsidian-400">{plan.description}</p>
          </div>
          <ul className="space-y-2.5 flex-1 mb-6">
            {plan.features.map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-obsidian-300">
                <Check size={14} className={plan.highlighted ? 'text-gold-400' : 'text-green-400'} />
                {f}
              </li>
            ))}
          </ul>
          <button className={plan.highlighted ? 'gold-btn w-full text-sm py-2.5' : 'ghost-btn w-full text-sm py-2.5'}>
            Edit Plan
          </button>
        </motion.div>
      ))}
    </div>

    <div className="bg-obsidian-800/40 border border-obsidian-700/50 rounded-2xl p-6">
      <h3 className="font-semibold text-obsidian-100 mb-1">Add-On Services</h3>
      <p className="text-sm text-obsidian-400 mb-4">Additional services available for all plans</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[['Monthly Maintenance', '£99/mo'], ['SEO Package', '£299'], ['Logo Design', '£199'], ['Copywriting', '£149/page']].map(([name, price]) => (
          <div key={name} className="bg-obsidian-900 border border-obsidian-700 rounded-xl p-4 text-center">
            <p className="text-sm font-medium text-obsidian-200">{name}</p>
            <p className="text-gold-400 font-bold mt-1">{price}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Pricing;
