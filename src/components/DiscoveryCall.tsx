import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Phone, Mail, Calendar, ChevronDown, AlertCircle } from 'lucide-react';
import { submitBooking, fetchAvailability, DiscoveryBooking, AvailabilityResponse } from '../lib/api';
import {
  CALL_DURATION,
  minutesToTime,
  timeToMinutes,
  rangesOverlap,
  validateBookingTime,
} from '../lib/availabilityUtils';
import TimeScroller from './TimeScroller';
import DatePicker from './DatePicker';

const budgetRanges = [
  'Under ₹20,000',
  '₹20,000–₹40,000',
  '₹40,000–₹80,000',
  '₹80,000–₹2,00,000',
  '₹2,00,000+',
  'Not sure yet',
];

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
  budget_range: '', preferred_date: '',
  preferred_time: '',
  notes: '',
};

const steps = [
  { step: '01', title: 'Book Your Slot',    desc: 'Pick a date and time that suits you using the form below.' },
  { step: '02', title: '60-Min Call',       desc: 'We listen, ask the right questions, and understand your goals.' },
  { step: '03', title: 'Bespoke Proposal',  desc: 'Receive a clear, fixed-price quote within 48 hours.' },
  { step: '04', title: 'We Build',          desc: 'You approve the plan and we get to work — on time, as promised.' },
];

export default function DiscoveryCall() {
  const [form, setForm]         = useState<Form>(initial);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchAvail = () => {
      if (form.preferred_date) {
        setLoadingAvailability(true);
        fetchAvailability(form.preferred_date)
          .then(data => setAvailability(data))
          .catch(() => setAvailability(null))
          .finally(() => setLoadingAvailability(false));
      } else {
        setAvailability(null);
      }
    };
    
    fetchAvail();
    
    // Poll every 10 seconds to keep live data
    if (form.preferred_date) {
      interval = setInterval(fetchAvail, 10000);
    }
    
    return () => clearInterval(interval);
  }, [form.preferred_date]);

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      if (k === 'preferred_time') setError('');
    };

  const validateTime = (time: string, avail: AvailabilityResponse | null): string | null => {
    const baseError = validateBookingTime(time);
    if (baseError) return baseError;

    if (avail) {
      if (avail.dayDisabled) {
        return 'This date is fully disabled. Please choose another date.';
      }

      const timeStr = time.substring(0, 5);
      const endTime = minutesToTime(timeToMinutes(timeStr) + CALL_DURATION);

      if (rangesOverlap(timeStr, endTime, avail.disabledRanges)) {
        return 'This time overlaps a disabled period. Please choose another time.';
      }
      if (rangesOverlap(timeStr, endTime, avail.bookedRanges)) {
        return 'This time overlaps an existing booking. Please choose another time.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in name, email, and phone.');
      return;
    }
    if (!form.preferred_date || !form.preferred_time) {
      setError('Please select a date and time.');
      return;
    }
    
    const parsedDate = new Date(form.preferred_date);
    if (parsedDate.getDay() === 0 || parsedDate.getDay() === 6) {
      setError('Bookings are available only from Monday to Friday.');
      return;
    }

    const timeError = validateTime(form.preferred_time, availability);
    if (timeError) {
      setError(timeError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload: DiscoveryBooking = {
        name:               form.name,
        email:              form.email,
        phone:              form.phone,
        company:            form.company            || undefined,
        budget_range:       form.budget_range       || undefined,
        preferred_date:     form.preferred_date,
        preferred_time:     form.preferred_time,
        notes:              form.notes              || undefined,
      };
      await submitBooking(payload);
      setSuccess(true);
      setForm(initial);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
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
            A free 60-minute conversation. Pick any available time that works for you.
          </p>
        </div>

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
          <div>
            <div className="card-dark p-8 mb-6">
              <h3 className="font-serif text-2xl font-bold text-obsidian-50 mb-6">What to Expect</h3>
              <div className="space-y-5">
                {[
                  { icon: Phone,    title: 'Video or Phone Call',   desc: 'We meet via Google Meet, Zoom, or by phone — whichever you prefer.' },
                  { icon: Calendar, title: '60 Minutes, Well Spent', desc: 'We cover your goals, existing brand, timeline, and budget — no fluff.' },
                  { icon: Mail,     title: 'Proposal in 48 Hours',  desc: "After the call you'll receive a fixed-price quote, timeline, and scope document." },
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
                    <label className="block text-obsidian-300 text-sm mb-2">Preferred Date <span className="text-gold-500">*</span></label>
                    <DatePicker
                      value={form.preferred_date}
                      onChange={(val) => {
                        setForm(p => ({ ...p, preferred_date: val }));
                        setError('');
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                      disabledDays={(d) => d.getDay() === 0 || d.getDay() === 6}
                    />
                  </div>
                  <div>
                    <label className="block text-obsidian-300 text-sm mb-2 flex items-center justify-between">
                      <span>Preferred Time <span className="text-gold-500">*</span></span>
                      {loadingAvailability && <Loader2 className="w-3 h-3 text-obsidian-400 animate-spin" />}
                    </label>
                    <div className="mt-2">
                      <TimeScroller 
                        availability={availability}
                        value={form.preferred_time}
                        onChange={(val) => setForm(p => ({...p, preferred_time: val}))}
                        disabled={!form.preferred_date || loadingAvailability || availability?.dayDisabled}
                      />
                    </div>
                  </div>
                </div>

                {form.preferred_date && availability && !loadingAvailability && (
                  <div className="bg-obsidian-800/50 rounded-lg p-3 text-sm">
                    {availability.dayDisabled ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>This date is fully unavailable. Please choose another date.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Select from the available times above.</span>
                      </div>
                    )}
                  </div>
                )}

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
                  disabled={loading || (availability?.dayDisabled ?? false)}
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
