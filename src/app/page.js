import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Interface from './components/Interface/Interface';
import Testimonials from './components/Testimonials/Testimonials';
import AdminTools from './components/AdminTools/AdminTools';
import Pricing from './components/Pricing/Pricing';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Interface />
      <Testimonials />
      <AdminTools />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
