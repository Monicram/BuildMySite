import Nav from './components/Nav';
import Hero from './components/Hero';
import Templates from './components/Templates';
import MakeAnImpression from './components/MakeAnImpression';
import Pricing from './components/Pricing';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import PlanMyWebsite from './components/PlanMyWebsite';
import DiscoveryCall from './components/DiscoveryCall';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <Nav />
      <Hero />
      <Templates />
      <MakeAnImpression />
      <Pricing />
      <Portfolio />
      <Testimonials />
      <PlanMyWebsite />
      <DiscoveryCall />
      <Footer />
    </div>
  );
}
