import { useLiveData } from './hooks/useLiveData.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ParticleField from './components/ParticleField.jsx';
import MatchesSection from './components/MatchesSection.jsx';
import TournamentsSection from './components/TournamentsSection.jsx';
import TransfersSection from './components/TransfersSection.jsx';
import NewsSection from './components/NewsSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { data, status, lastUpdated, refresh } = useLiveData();

  return (
    <div className="relative min-h-screen">
      <ParticleField />

      {/* fixed page-top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-valorant-red via-valorant-red-light to-valorant-red bg-[length:200%_100%] animate-gradient-shift z-[60]" />

      <Navbar status={status} lastUpdated={lastUpdated} onRefresh={refresh} />

      <main className="relative z-10">
        <Hero
          matchCount={data.matches.length}
          tournamentCount={data.tournaments.length}
        />

        <SectionWipe />
        <MatchesSection matches={data.matches} />

        <SectionWipe />
        <TournamentsSection tournaments={data.tournaments} />

        <SectionWipe />
        <TransfersSection transfers={data.transfers} />

        <SectionWipe />
        <NewsSection news={data.news} />
      </main>

      <Footer />

      {/* vignette */}
      <div className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}

function SectionWipe() {
  return (
    <div className="relative h-px max-w-7xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-valorant-red/30 to-transparent" />
    </div>
  );
}
