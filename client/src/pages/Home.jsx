import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/MatchCard';
import Spinner from '../components/Spinner';

const SPORTS = ['All', 'Football', 'Basketball', 'Tennis', 'Cricket', 'Volleyball', 'Rugby', 'Running', 'Cycling'];

export default function Home() {
  const { user } = useAuth();
  const [sportFilter, setSportFilter] = useState('');
  const { matches, loading, error } = useMatches(sportFilter ? { sport: sportFilter } : {});

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-900/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-pitch-500/10 border border-pitch-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-pitch-400 rounded-full animate-pulse" />
            <span className="text-pitch-400 text-sm font-medium">{matches.length} active matches near you</span>
          </div>
          <h1 className="font-display font-black text-6xl md:text-8xl uppercase tracking-tight mb-4">
            FIND YOUR<br />
            <span className="text-gradient">GAME</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Connect with local players, create matches, and never sit on the sidelines again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link to="/create-match" className="btn-primary text-base">
                + Create a Match
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base">Get Started Free</Link>
                <Link to="/login" className="btn-secondary text-base">Log In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sport filters */}
      <section className="px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport === 'All' ? '' : sport)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  (sport === 'All' && !sportFilter) || sport === sportFilter
                    ? 'bg-pitch-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl uppercase tracking-wide">
              {sportFilter ? `${sportFilter} Matches` : 'Upcoming Matches'}
            </h2>
            <span className="text-slate-500 text-sm">{matches.length} found</span>
          </div>

          {loading && <Spinner text="Loading matches..." />}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && matches.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏟️</div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">No Matches Found</h3>
              <p className="text-slate-500 mb-6">Be the first to create a match!</p>
              {user && <Link to="/create-match" className="btn-primary">Create Match</Link>}
            </div>
          )}
          {!loading && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => <MatchCard key={match._id} match={match} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
