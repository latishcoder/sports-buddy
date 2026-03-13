import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../services/api';
import MatchCard from '../components/MatchCard';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('joined');
  const [deleteId, setDeleteId] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data } = await matchService.getAll({ limit: 100 });
      setAllMatches(data.matches);
    } catch {
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const myMatches = allMatches.filter((m) => m.createdBy?._id === user._id);
  const joinedMatches = allMatches.filter(
    (m) => m.participants?.some((p) => p._id === user._id) && m.createdBy?._id !== user._id
  );

  const handleDelete = async (id) => {
    try {
      await matchService.delete(id);
      setAllMatches((prev) => prev.filter((m) => m._id !== id));
      setDeleteId(null);
    } catch {
      alert('Failed to delete match');
    }
  };

  const tabData = tab === 'created' ? myMatches : joinedMatches;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl uppercase tracking-wide">
            Hey, <span className="text-gradient">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">Manage your sports activity</p>
        </div>
        <Link to="/create-match" className="btn-primary flex-shrink-0">+ Create Match</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Created', value: myMatches.length, icon: '🏟️' },
          { label: 'Joined', value: joinedMatches.length, icon: '🤝' },
          { label: 'Total Players', value: myMatches.reduce((a, m) => a + m.participants.length, 0), icon: '👥' },
          { label: 'Sports Played', value: new Set([...myMatches, ...joinedMatches].map(m => m.sportName)).size, icon: '🏅' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-display font-bold text-3xl text-white">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 rounded-lg p-1 w-fit mb-6 border border-slate-800">
        {['joined', 'created'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
              tab === t ? 'bg-pitch-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t} ({t === 'created' ? myMatches.length : joinedMatches.length})
          </button>
        ))}
      </div>

      {loading && <Spinner text="Loading your matches..." />}
      {error && <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">{error}</div>}

      {!loading && tabData.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">{tab === 'created' ? '🏟️' : '🤝'}</div>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {tab === 'created' ? 'No matches created yet' : 'You haven\'t joined any matches'}
          </h3>
          <p className="text-slate-500 mb-4">
            {tab === 'created' ? 'Start by creating your first match!' : 'Browse available matches and join one!'}
          </p>
          <Link to={tab === 'created' ? '/create-match' : '/'} className="btn-primary">
            {tab === 'created' ? '+ Create Match' : 'Browse Matches'}
          </Link>
        </div>
      )}

      {!loading && tabData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tabData.map((match) => (
            <div key={match._id} className="relative group">
              <MatchCard match={match} />
              {tab === 'created' && (
                <button
                  onClick={() => setDeleteId(match._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-md"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-display font-bold text-xl text-white mb-2">Delete Match?</h3>
            <p className="text-slate-400 mb-6 text-sm">This action cannot be undone. All participants will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
