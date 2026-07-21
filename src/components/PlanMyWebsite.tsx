import { useState } from 'react';
import { CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import { submitEnquiry, WebsiteEnquiry } from '../lib/api';

const featureOptions = [
  'Booking / Appointment System',
  'E-Commerce / Online Shop',
  'Blog or News Section',
  'Automated Emails',
  'Live Chat Widget',
  'WhatsApp Button',
  'Gallery / Portfolio',
  'Video Integration',
  'Membership / Login Area',
  'Multi-Language Support',
];

const pageOptions = ['1–3', '4–6', '7–10', '10+', "I'm not sure"];
const budgetOptions = [
  'Under ₹20,000',
  '₹20,000–₹40,000',
  '₹40,000–₹80,000',
  '₹80,000–₹2,00,000',
  '₹2,00,000+',
  "I'm not sure yet",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  pages: string;
  features: string[];
  hosting: string;
  maintenance: string;
  seo: string;
  budget: string;
  notes: string;
};

const initial: FormState = {
  name: '', email: '', phone: '', pages: '', features: [],
  hosting: '', maintenance: '', seo: '', budget: '', notes: '',
};

export default function PlanMyWebsite() {
  const [form, setForm]       = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const toggle = (f: string) =>
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Please fill in your name and email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: WebsiteEnquiry = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        pages: form.pages || undefined,
        features: form.features,
        support_needs: {
          hosting: form.hosting,
          maintenance: form.maintenance,
          seo: form.seo,
        },
        budget: form.budget || undefined,
        notes: form.notes || undefined,
      };
      await submitEnquiry(payload);
      setSuccess(true);
      setForm(initial);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="plan" className="py-28 bg-obsidian-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="section-label mb-4">Requirements Capture</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
            Plan My <span className="gold-text italic">Website</span>
          </h2>
          <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
            Tell us what you need and we'll come back with a tailored proposal — usually within one business day.
          </p>
        </div>

        {success ? (
          <div className="card-dark border-gold-500/40 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-obsidian-900" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-obsidian-50 mb-3">Enquiry Received!</h3>
            <p className="text-obsidian-400 mb-6">
              Thank you, {form.name || 'there'}. We'll review your requirements and get back to you within one working day.
            </p>
            <a href="#book" className="gold-btn inline-block">
              Also Book a Discovery Call
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-dark p-8 lg:p-12 space-y-8">
            {/* Contact */}
            <div>
              <h3 className="font-serif text-lg font-bold text-obsidian-50 mb-5 pb-3 border-b border-obsidian-700">
                1. Your Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Full Name <span className="text-gold-500">*</span></label>
                  <input
                    id="enquiry-name"
                    className="input-dark"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Email Address <span className="text-gold-500">*</span></label>
                  <input
                    id="enquiry-email"
                    className="input-dark"
                    type="email"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Phone Number</label>
                  <input
                    id="enquiry-phone"
                    className="input-dark"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Approximate Number of Pages</label>
                  <div className="relative">
                    <select
                      id="enquiry-pages"
                      className="select-dark"
                      value={form.pages}
                      onChange={e => setForm(p => ({ ...p, pages: e.target.value }))}
                    >
                      <option value="">Select...</option>
                      {pageOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-serif text-lg font-bold text-obsidian-50 mb-2 pb-3 border-b border-obsidian-700">
                2. Feature Needs
              </h3>
              <p className="text-obsidian-400 text-sm mb-5">Select everything you'd like on your site:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {featureOptions.map(f => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="checkbox-gold flex-shrink-0"
                      checked={form.features.includes(f)}
                      onChange={() => toggle(f)}
                    />
                    <span className="text-obsidian-300 text-sm group-hover:text-obsidian-100 transition-colors">{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-serif text-lg font-bold text-obsidian-50 mb-5 pb-3 border-b border-obsidian-700">
                3. Support &amp; Hosting
              </h3>
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Hosting Needed?</label>
                  <div className="relative">
                    <select id="enquiry-hosting" className="select-dark" value={form.hosting} onChange={e => setForm(p => ({ ...p, hosting: e.target.value }))}>
                      <option value="">Select...</option>
                      <option>Yes — include it</option>
                      <option>No — I have hosting</option>
                      <option>Not sure</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Maintenance Frequency</label>
                  <div className="relative">
                    <select id="enquiry-maintenance" className="select-dark" value={form.maintenance} onChange={e => setForm(p => ({ ...p, maintenance: e.target.value }))}>
                      <option value="">Select...</option>
                      <option>Monthly updates</option>
                      <option>Quarterly updates</option>
                      <option>Ad-hoc only</option>
                      <option>I'll manage it myself</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">SEO Level</label>
                  <div className="relative">
                    <select id="enquiry-seo" className="select-dark" value={form.seo} onChange={e => setForm(p => ({ ...p, seo: e.target.value }))}>
                      <option value="">Select...</option>
                      <option>Basic (on-page)</option>
                      <option>Standard (+ Google setup)</option>
                      <option>Advanced (ongoing)</option>
                      <option>Not sure yet</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget & Notes */}
            <div>
              <h3 className="font-serif text-lg font-bold text-obsidian-50 mb-5 pb-3 border-b border-obsidian-700">
                4. Budget &amp; Anything Else
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Budget Range</label>
                  <div className="flex flex-wrap gap-3">
                    {budgetOptions.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, budget: b }))}
                        className={`text-sm px-4 py-2.5 rounded-sm border transition-all duration-200 ${
                          form.budget === b
                            ? 'border-gold-500 bg-gold-600/10 text-gold-400'
                            : 'border-obsidian-600 text-obsidian-400 hover:border-gold-600/40 hover:text-obsidian-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Additional Notes or Context</label>
                  <textarea
                    id="enquiry-notes"
                    className="input-dark resize-none"
                    rows={4}
                    placeholder="Tell us anything else — your industry, inspiration sites you love, or key goals."
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-sm">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <p className="text-obsidian-500 text-xs max-w-xs">
                By submitting you agree to our privacy policy. Your data is stored securely and never sold.
              </p>
              <button
                type="submit"
                id="enquiry-submit"
                disabled={loading}
                className="gold-btn flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px] justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Submit My Requirements'}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-obsidian-700">
              <p className="text-obsidian-400 text-sm mb-3">Not ready to fill this in?</p>
              <a href="#book" className="ghost-btn inline-block text-sm py-2.5 px-6">
                I don't know where to start — just book a discovery call
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
