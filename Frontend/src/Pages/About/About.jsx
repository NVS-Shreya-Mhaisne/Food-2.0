import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Zap, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Utensils, 
  Phone, 
  Mail, 
  Clock, 
  Tag, 
  CreditCard,
  Leaf,
  ChevronRight,
  Star,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-text-dark dark:text-[#e5e0d8] font-sans">
      
      {/* 1. HEADER TITLE & SHORT OVERVIEW */}
      <header className="border-b border-gray-200 dark:border-[#3a2b27] pb-6 space-y-3">
        <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-widest">
          <Building2 className="w-4 h-4" />
          <span>COMPANY PROFILE</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-black text-text-dark dark:text-[#f4f1ea] tracking-tight">
          About Cravely
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-[#b0aaa0] font-medium leading-relaxed max-w-2xl">
          Cravely Technologies Inc. (Est. 2024, New York) is a hyper-local foodtech platform connecting food lovers with 500+ top neighborhood bistros via 20-minute thermal delivery and AI taste matching.
        </p>
      </header>

      {/* 2. QUICK FACTS TABLE (CLEAN SEMANTIC TABLE, NO NESTED BOXES) */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea] flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Company At a Glance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100 dark:border-[#2d211d]">
                <td className="py-2.5 font-bold font-mono text-gray-500 dark:text-[#a09a8e] w-44">Legal Entity</td>
                <td className="py-2.5 font-semibold text-text-dark dark:text-[#f4f1ea]">Cravely Technologies Inc.</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-[#2d211d]">
                <td className="py-2.5 font-bold font-mono text-gray-500 dark:text-[#a09a8e]">Headquarters</td>
                <td className="py-2.5 font-semibold text-text-dark dark:text-[#f4f1ea]">New York, NY 10018, USA</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-[#2d211d]">
                <td className="py-2.5 font-bold font-mono text-gray-500 dark:text-[#a09a8e]">Network Size</td>
                <td className="py-2.5 font-semibold text-text-dark dark:text-[#f4f1ea]">500+ Verified Partner Bistros & Kitchens</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-[#2d211d]">
                <td className="py-2.5 font-bold font-mono text-gray-500 dark:text-[#a09a8e]">Delivery Speed SLA</td>
                <td className="py-2.5 font-semibold text-primary font-mono font-bold">18 – 22 Minutes (Express Thermal Delivery)</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-[#2d211d]">
                <td className="py-2.5 font-bold font-mono text-gray-500 dark:text-[#a09a8e]">Customer Satisfaction</td>
                <td className="py-2.5 font-semibold text-amber-500 font-bold">4.9 ★ Rating (80,000+ Reviews)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. WHAT CRAVELY DOES (SHORT CONCISE BULLET LIST, NO BOXED DIVS) */}
      <section className="space-y-4 pt-2">
        <h2 className="font-serif text-xl font-bold text-text-dark dark:text-[#f4f1ea] flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          What Cravely Does
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-[#c5c0b5] font-medium leading-relaxed">
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Smart Food Ordering:</strong> Instant access to 500+ local bistros, bakery gems, and fine dining menus.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>AI Food Assistant:</strong> Personalized dish recommendations tailored to your mood, weather, and taste.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>20-Minute Express Delivery:</strong> Temperature-locked thermal bags ensuring food arrives piping hot.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Live GPS Telemetry:</strong> Interactive real-time order tracking from kitchen prep to your door with courier chat.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Smart Savings:</strong> Automated promo code applicability, seasonal deals, and instant Cravely reward perks.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Dietary Filtering:</strong> Instant search for Vegan, Gluten-Free, Organic, Keto, Halal, & Chef Recommended dishes.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Secure Multi-Payment:</strong> Support for Credit/Debit Cards, Stripe, UPI, Apple Pay, and Cash on Delivery.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span><strong>Eco Thermal Packaging:</strong> 100% biodegradable, plastic-free thermal containers across all partner kitchens.</span>
          </li>
        </ul>
      </section>

      {/* 4. CORPORATE CONTACT INFO (SHORT & SIMPLE) */}
      <footer className="border-t border-gray-200 dark:border-[#3a2b27] pt-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-text-dark dark:text-[#f4f1ea]">
          Corporate Contact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-[#a09a8e] font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>450 5th Ave, New York, NY 10018</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>+1 (234) 244-2330</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span>support@cravely.com</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">Daily Hours: 10:00 AM – 11:00 PM</span>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('explore-menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Menu & Order</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

    </main>
  );
};

export default About;
