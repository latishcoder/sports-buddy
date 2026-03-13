import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchService } from '../services/api';
import Spinner from '../components/Spinner';

const SPORT_ICONS = {
  Football: '⚽', Soccer: '⚽', Basketball: '🏀', Tennis: '🎾', Cricket: '🏏',
  Baseball: '⚾', Volleyball: '🏐', Rugby: '🏉', Hockey: '🏒', Badminton: '🏸',
  Swimming: '🏊', Running: '🏃', Cycling: '🚴', Golf: '⛳', default: '🏅',
};

export default function MatchDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data } = await matchService.getOne(id);
        setMatch(data);
      } catch {
        setError('Match not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10"><Spinner text="Loading match..." /></div>;
  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display font-bold text-2xl mb-2">Match Not Found</h2>
      <Link to="/" className="btn-primary mt-4 inline-block">Back to Matches</Link>
    </div>
  );

  const isCreator = user && match.createdBy?._id === user._id;
  const isParticipant = user && match.participants?.some((p) => p._id === user._id);
  const isFull = match.participants.length >= match.playersNeeded;
  const spotsLeft = match.playersNeeded - match.participants.length;
  const isPast = new Date(match.date) < new Date();
  const icon = SPORT_ICONS[match.sportName] || SPORT_ICONS.default;

  const handleJoin = async () => {
    if (!user) return navigate('/login');
    setActionLoading(true);
    try {
      const { data } = await matchService.join(id);
      setMatch(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join match');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      const { data } = await matchService.leave(id);
      setMatch(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave match');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this match? This cannot be undone.')) return;
    try {
      await matchService.delete(id);
      navigate('/dashboard');
    } catch {
      alert('Failed to delete match');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
        ← Back to matches
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
              {icon}
            </div>
            <div>
              <h1 className="font-display font-black text-4xl uppercase tracking-wide text-white">
                {match.sportName}
              </h1>
              <p className="text-slate-400">Hosted by <span className="text-white font-medium">{match.createdBy?.name}</span></p>
            </div>
          </div>
          {isPast && <span className="badge bg-slate-700 text-slate-400">Past</span>}
          {!isPast && isFull && <span className="badge bg-red-500/20 text-red-400">Full</span>}
          {!isPast && !isFull && <span className="badge bg-pitch-500/20 text-pitch-400 font-semibold">{spotsLeft} spots left</span>}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Location', value: match.location, icon: '📍' },
            { label: 'Date & Time', value: new Date(match.date).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: '📅' },
            { label: 'Skill Level', value: match.skillLevel, icon: '🎯' },
            { label: 'Players', value: `${match.participants.length} / ${match.playersNeeded}`, icon: '👥' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-500 mb-0.5">{item.icon} {item.label}</div>
              <div className="text-white text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Players bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Players joined</span>
            <span>{match.participants.length}/{match.playersNeeded}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-pitch-500 rounded-full transition-all duration-500"
              style={{ width: `${(match.participants.length / match.playersNeeded) * 100}%` }}
            />
          </div>
        </div>

        {match.description && (
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-xs text-slate-500 mb-1">📝 Description</h3>
            <p className="text-slate-300 text-sm">{match.description}</p>
          </div>
        )}

        {/* Actions */}
        {!isPast && (
          <div className="flex gap-3">
            {!user && (
              <Link to="/login" className="btn-primary flex-1 text-center">Login to Join</Link>
            )}
            {user && !isCreator && !isParticipant && !isFull && (
              <button onClick={handleJoin} disabled={actionLoading} className="btn-primary flex-1">
                {actionLoading ? 'Joining...' : '✋ Join Match'}
              </button>
            )}
            {user && !isCreator && isParticipant && (
              <button onClick={handleLeave} disabled={actionLoading} className="btn-secondary flex-1">
                {actionLoading ? 'Leaving...' : 'Leave Match'}
              </button>
            )}
            {user && isFull && !isParticipant && (
              <div className="flex-1 bg-slate-800 rounded-lg px-4 py-3 text-center text-slate-500 text-sm">Match is full</div>
            )}
            {isCreator && (
              <button onClick={handleDelete} className="btn-danger">Delete Match</button>
            )}
          </div>
        )}
        {isParticipant && !isCreator && (
          <div className="mt-3 text-center text-pitch-400 text-sm">✅ You're in this match!</div>
        )}
        {isCreator && (
          <div className="mt-3 text-center text-pitch-400 text-sm">🏟️ You created this match</div>
        )}
      </div>

      {/* Participants */}
      <div className="card">
        <h2 className="font-display font-bold text-xl uppercase tracking-wide mb-4">
          Players ({match.participants.length})
        </h2>
        {match.participants.length === 0 ? (
          <p className="text-slate-500 text-sm">No players yet. Be the first to join!</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {match.participants.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3">
                <div className="w-9 h-9 rounded-full bg-pitch-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">{p.name}</div>
                  {i === 0 && <div className="text-pitch-400 text-xs">Host</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
