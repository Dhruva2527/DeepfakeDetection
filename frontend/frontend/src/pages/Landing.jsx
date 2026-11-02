import HeroSection from '@/components/home/HeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import TechSection from '@/components/home/TechSection';

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <FeatureCards />
      <TechSection />
    </div>
  );
}