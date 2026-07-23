import { Quote, Star, Loader2, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../lib/api';

type Review = {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  rating: number;
  message: string;
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: '', company: '', role: '', rating: 5, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/reviews')
      .then(res => {
        setReviews(res.data.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      setError('Name and message are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reviews', form);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setForm({ name: '', company: '', role: '', rating: 5, message: '' });
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="py-28 bg-obsidian-950 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </section>
    );
  }

  return (
    <section id="reviews" className="py-28 bg-obsidian-950 bg-grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-600/5 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Client Stories</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-obsidian-50 mb-5">
            Trusted by <span className="gold-text italic">Real Businesses</span>
          </h2>
          <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed mb-6">
            Don't just take our word for it. Here's what our clients say after working with us.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold-600/40 text-gold-400 hover:bg-gold-600/10 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Share Your Experience
          </button>
        </div>

        {reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="card-dark border-gold-600/20 p-8 flex flex-col h-full hover:border-gold-600/40 transition-colors relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-gold-600/10" />
                  
                  <div className="flex gap-1 justify-center mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>

                  <blockquote className="flex-1 text-center mb-8">
                    <p className="text-obsidian-200 text-base leading-relaxed font-light italic">
                      "{review.message}"
                    </p>
                  </blockquote>

                  <div className="text-center mt-auto pt-6 border-t border-obsidian-800">
                    <p className="font-semibold text-obsidian-100">{review.name}</p>
                    {(review.role || review.company) && (
                      <p className="text-obsidian-400 text-sm mt-1">
                        {review.role}{review.role && review.company ? ', ' : ''}{review.company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />)}
              </div>
              <span className="text-obsidian-300 text-sm">
                <span className="text-obsidian-50 font-semibold">5.0 / 5.0</span> — averaged across {reviews.length}+ client projects
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-6 card-dark border-gold-600/20 max-w-2xl mx-auto">
            <Star className="w-12 h-12 text-gold-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-obsidian-100 mb-2">Be Our First Success Story</h3>
            <p className="text-obsidian-400 mb-6 max-w-md mx-auto">
              We're building something special and would love for you to be part of our journey. Start your project with us today!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-btn text-sm font-medium transition-transform hover:scale-105"
            >
              <Plus size={16} /> Share Your Experience
            </button>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-obsidian-900 border border-obsidian-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-obsidian-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-obsidian-50 mb-2">Leave a Review</h2>
            <p className="text-sm text-obsidian-400 mb-6">How was your experience working with us?</p>
            
            {submitSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-emerald-400 fill-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-obsidian-50">Thank You!</h3>
                <p className="text-obsidian-400">Your review has been submitted and is pending approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-obsidian-400 mb-1.5">Name *</label>
                    <input required className="input-dark w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-obsidian-400 mb-1.5">Role (Optional)</label>
                    <input className="input-dark w-full" placeholder="e.g. CEO" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-obsidian-400 mb-1.5">Company (Optional)</label>
                    <input className="input-dark w-full" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-obsidian-400 mb-1.5">Rating</label>
                    <select className="select-dark w-full" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})}>
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Terrible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-obsidian-400 mb-1.5">Your Experience *</label>
                  <textarea required className="input-dark w-full resize-none h-24" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="gold-btn w-full flex justify-center items-center py-3 mt-4">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
