import { useState } from 'react';
import { CheckCircle, Loader2, Phone, Mail, Calendar, ChevronDown } from 'lucide-react';
import { submitBooking, DiscoveryBooking } from '../lib/api';

const budgetRanges = [
  'Under ₹40,000',
  '₹40,000–₹80,000',
  '₹80,000–₹2,00,000',
  '₹2,00,000–₹4,00,000',
  '₹4,00,000+',
  'Not sure yet',
];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

type Form = {
  name: string;
  company: string;
  phone: string;
  email: string;
  budget_range: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
};

const initial: Form = {
  name: '', company: '', phone: '', email: '',
  budget_range: '', preferred_date: '', preferred_time: '', notes: '',
};

const steps = [
  { step: '01', title: 'Book Your Slot', desc: 'Pick a date and time that suits you using the form below.' },
  { step: '02', title: '30-Min Call', desc: 'We listen, ask the right questions, and understand your goals.' },
  { step: '03', title: 'Bespoke Proposal', desc: 'Receive a clear, fixed-price quote within 48 hours.' },
  { step: '04', title: 'We Build', desc: 'You approve the plan and we get to work — on time, as promised.' },
];

export default function DiscoveryCall() {
  const [form, setForm]       = useState<Form>(initial);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in name, email, and phone.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: DiscoveryBooking = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company || undefined,
        budget_range: form.budget_range || undefined,
        preferred_date: form.preferred_date || undefined,
        preferred_time: form.preferred_time || undefined,
        notes: form.notes || undefined,
      };
      await submitBooking(payload);
      setSuccess(true);
      setForm(initial);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="py-28 bg-obsidian-950 bg-grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold-600/4 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Free Consultation</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
            Book a <span className="gold-text italic">Discovery Call</span>
          </h2>
          <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
            A free 30-minute conversation. No commitment, no jargon — just clarity on what's possible for your business.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {steps.map((p, i) => (
            <div key={p.step} className="relative card-dark p-6 hover:border-gold-600/40 transition-all duration-300">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gold-600/30" />
              )}
              <div className="text-gold-600/40 font-serif text-4xl font-bold mb-3 leading-none">{p.step}</div>
              <h4 className="font-semibold text-obsidian-100 mb-2">{p.title}</h4>
              <p className="text-obsidian-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left — info */}
          <div>
            <div className="card-dark p-8 mb-6">
              <h3 className="font-serif text-2xl font-bold text-obsidian-50 mb-6">What to Expect</h3>
              <div className="space-y-5">
                {[
                  { icon: Phone, title: 'Video or Phone Call', desc: 'We meet via Google Meet, Zoom, or by phone — whichever you prefer.' },
                  { icon: Calendar, title: '30 Minutes, Well Spent', desc: 'We cover your goals, existing brand, timeline, and budget — no fluff.' },
                  { icon: Mail, title: 'Proposal in 48 Hours', desc: "After the call you'll receive a fixed-price quote, timeline, and scope document." },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-sm bg-obsidian-700 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <h4 className="text-obsidian-100 font-medium mb-1">{item.title}</h4>
                      <p className="text-obsidian-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-dark p-6 border-gold-600/30">
              <p className="text-obsidian-400 text-sm leading-relaxed">
                <span className="text-gold-400 font-semibold">Privacy Notice:</span> Information you submit is stored securely on our servers and used only to prepare for your discovery call. We will never share your details with third parties or add you to any mailing list without your consent.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {success ? (
              <div className="card-dark p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-obsidian-900" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-obsidian-50 mb-3">Call Requested!</h3>
                <p className="text-obsidian-400">
                  We'll confirm your slot by email within a few hours. We look forward to speaking with you.
                </p>
              </div>
            ) : (
              <form id="discovery-form" onSubmit={handleSubmit} className="card-dark p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Full Name <span className="text-gold-500">*</span></label>
                    <input id="booking-name" className="input-dark" placeholder="Your name" value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Company / Business</label>
                    <input id="booking-company" className="input-dark" placeholder="Your company" value={form.company} onChange={set('company')} />
                  </div>
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Phone <span className="text-gold-500">*</span></label>
                    <input id="booking-phone" className="input-dark" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                  </div>
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Email <span className="text-gold-500">*</span></label>
                    <input id="booking-email" className="input-dark" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>

                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Budget Range</label>
                  <div className="relative">
                    <select id="booking-budget" className="select-dark" value={form.budget_range} onChange={set('budget_range')}>
                      <option value="">Select a range...</option>
                      {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Preferred Date</label>
                    <input
                      id="booking-date"
                      className="input-dark"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.preferred_date}
                      onChange={set('preferred_date')}
                    />
                  </div>
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2">Preferred Time (IST)</label>
                    <div className="relative">
                      <select id="booking-time" className="select-dark" value={form.preferred_time} onChange={set('preferred_time')}>
                        <option value="">Select time...</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-obsidian-300 text-sm mb-2">Anything you'd like us to know</label>
                  <textarea
                    id="booking-notes"
                    className="input-dark resize-none"
                    rows={3}
                    placeholder="Your industry, current site, urgent deadline, etc."
                    value={form.notes}
                    onChange={set('notes')}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-sm">{error}</p>
                )}

                <button
                  type="submit"
                  id="booking-submit"
                  disabled={loading}
                  className="gold-btn w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Booking...' : 'Request My Discovery Call'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
