import { Navbar } from '@/components/homepage/Navbar';
import { Hero } from '@/components/homepage/Hero';
import { Features } from '@/components/homepage/Features';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Stats } from '@/components/homepage/Stats';
import { FAQ } from '@/components/homepage/FAQ';
import { CTA } from '@/components/homepage/CTA';
import { Footer } from '@/components/homepage/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col selection:bg-blue-500/20">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
