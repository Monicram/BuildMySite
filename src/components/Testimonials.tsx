import { Quote, Star } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    name: 'James Whitfield',
    role: 'Founder',
    company: 'Meridian Law Group',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'BuildMySite completely transformed how clients find us online. The team understood our brand from day one — professional, premium, and completely jargon-free throughout. Our enquiry volume tripled within 3 months of launch.',
  },
  {
    name: 'Priya Sharma',
    role: 'Owner',
    company: 'Luma Skin Studio',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'I had no idea where to start — they asked me just a handful of questions and within a week I had a stunning site that my clients constantly compliment. The online booking system alone has saved me hours every week.',
  },
  {
    name: 'Oliver Tracey',
    role: 'Co-founder',
    company: 'Nomad & Co.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'We went from selling at markets to ₹68 lakh online revenue in our first year — the site they built was a huge part of that. The e-commerce setup was seamless and the post-launch support was phenomenal.',
  },
  {
    name: 'Amara Osei',
    role: 'Operations Director',
    company: 'The Copper Kettle',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'Table reservations used to be a chaos of phone calls and lost bookings. Our new site handles it all automatically — and the design reflects the elegance of our restaurant perfectly. Worth every penny.',
  },
  {
    name: 'Daniel Krebs',
    role: 'CEO',
    company: 'Orion Analytics',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'As a SaaS founder I needed a landing page that converted — not just looked pretty. BuildMySite nailed both. Our trial sign-up rate more than doubled. The discovery call process set exactly the right expectations.',
  },
  {
    name: 'Hannah Cole',
    role: 'Personal Trainer & Coach',
    company: 'HC Fitness',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: "I was worried I'd be out of my depth dealing with a web agency. BuildMySite were the opposite of what I feared — patient, plain-speaking, and brilliant. My website genuinely feels like me, and bookings are up 80%.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

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
          <p className="text-obsidian-400 max-w-xl mx-auto text-lg leading-relaxed">
            Don't just take our word for it. Here's what our clients say after working with us.
          </p>
        </div>

        {/* Featured review */}
        <div className="card-dark border-gold-600/30 p-8 lg:p-12 mb-8 relative overflow-hidden">
          <Quote className="absolute top-6 right-8 w-20 h-20 text-gold-600/10" />
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
              <img
                src={reviews[active].avatar}
                alt={reviews[active].name}
                className="w-16 h-16 rounded-sm object-cover border-2 border-gold-600/40"
              />
              <div className="text-center md:text-left">
                <p className="font-semibold text-obsidian-100">{reviews[active].name}</p>
                <p className="text-obsidian-400 text-sm">{reviews[active].role}</p>
                <p className="text-gold-500 text-sm font-medium">{reviews[active].company}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(reviews[active].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
            </div>
            <blockquote className="flex-1">
              <p className="text-obsidian-200 text-lg lg:text-xl leading-relaxed font-light italic">
                "{reviews[active].quote}"
              </p>
            </blockquote>
          </div>
        </div>

        {/* Reviewer thumbnails */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-2 p-3 rounded-sm border transition-all duration-200 ${
                active === i
                  ? 'border-gold-500 bg-obsidian-800'
                  : 'border-obsidian-700 bg-obsidian-800/50 hover:border-gold-600/40'
              }`}
            >
              <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-sm object-cover" />
              <p className="text-obsidian-400 text-xs text-center leading-tight">{r.name.split(' ')[0]}</p>
            </button>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />)}
          </div>
          <span className="text-obsidian-300 text-sm">
            <span className="text-obsidian-50 font-semibold">5.0 / 5.0</span> — averaged across 200+ client projects
          </span>
        </div>
      </div>
    </section>
  );
}
