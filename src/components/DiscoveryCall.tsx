import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Phone, Mail, Calendar, ChevronDown } from 'lucide-react';
import { submitBooking, fetchAvailableSlots, DiscoveryBooking, AvailableSlot } from '../lib/api';
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

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchAvail = () => {
      if (form.preferred_date) {
        setLoadingAvailability(true);
        fetchAvailableSlots(form.preferred_date)
          .then(data => {
            setAvailableSlots(data);
            setSlotsLoaded(true);
            if (form.preferred_time && !data.find(s => s.start_time === form.preferred_time)) {
              setForm(p => ({ ...p, preferred_time: '' }));
            }
          })
          .catch(() => {
            setAvailableSlots([]);
            setSlotsLoaded(true);
          })
          .finally(() => setLoadingAvailability(false));
      } else {
        setAvailableSlots([]);
        setSlotsLoaded(false);
      }
    };
    
    fetchAvail();
    
    // Poll every 10 seconds to keep live data
    if (form.preferred_date) {
      interval = setInterval(fetchAvail, 10000);
    }
    
    return () => clearInterval(interval);
  }, [form.preferred_date, form.preferred_time]);

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      if (k === 'preferred_time') setError('');
    };

  const validateTime = (time: string, slots: AvailableSlot[]): string | null => {
    if (!time) return 'Please select a time slot.';
    const slot = slots.find(s => s.start_time === time);
    if (!slot) return 'The selected time slot is no longer available.';
    if (slot.remaining_capacity <= 0) return 'This slot is fully booked.';
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

    const timeError = validateTime(form.preferred_time, availableSlots);
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                        {loadingAvailability && !slotsLoaded ? (
                          <div className="col-span-1 sm:col-span-2 text-center py-4 text-obsidian-400 text-sm border border-obsidian-800 rounded-lg">Loading slots...</div>
                        ) : slotsLoaded && availableSlots.length === 0 ? (
                          <div className="col-span-1 sm:col-span-2 text-center py-4 text-obsidian-400 text-sm border border-obsidian-800 rounded-lg">
                            No slots are available for the selected date.
                          </div>
                        ) : (
                          availableSlots.map(slot => {
                            const isSelected = form.preferred_time === slot.start_time;
                            const formatTime = (t24: string) => {
                               let [h, m] = t24.split(':');
                               let hNum = parseInt(h, 10);
                               const p = hNum >= 12 ? 'PM' : 'AM';
                               if (hNum === 0) hNum = 12;
                               if (hNum > 12) hNum -= 12;
                               return `${hNum.toString().padStart(2, '0')}:${m} ${p}`;
                            };
                            const capacityText = slot.remaining_capacity > 1 
                              ? `${slot.remaining_capacity} slots remaining` 
                              : slot.remaining_capacity === 1 && slot.max_bookings > 1 
                                 ? `1 slot remaining`
                                 : `Available`;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => { setForm(p => ({ ...p, preferred_time: slot.start_time })); setError(''); }}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                  isSelected 
                                    ? 'bg-gold-500/10 border-gold-500 text-gold-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]' 
                                    : 'bg-obsidian-900 border-obsidian-700 text-obsidian-300 hover:border-gold-500/50 hover:text-obsidian-100'
                                }`}
                              >
                                <span className="font-medium text-sm">
                                  {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                </span>
                                <span className={`text-xs mt-1 ${isSelected ? 'text-gold-500/80' : 'text-obsidian-500'}`}>
                                  {capacityText}
                                </span>
                              </button>
                            )
                          })
                        )}
                      </div>
                      
                      <style dangerouslySetInnerHTML={{__html: `
                        .pr-1::-webkit-scrollbar {
                          width: 4px;
                        }
                        .pr-1::-webkit-scrollbar-track {
                          background: rgba(15, 15, 15, 0.5);
                          border-radius: 4px;
                        }
                        .pr-1::-webkit-scrollbar-thumb {
                          background: rgba(234, 179, 8, 0.3);
                          border-radius: 4px;
                        }
                      `}} />
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
                  disabled={loading || (slotsLoaded && availableSlots.length === 0)}
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
