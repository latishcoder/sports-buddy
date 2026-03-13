import { useAuth } from '../context/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { matches, loading } = useMatches({ limit: 100 });

  const myMatches = matches.filter((m) => m.createdBy?._id === user._id);
  const joinedMatches = matches.filter(
    (m) => m.participants?.some((p) => p._id === user._id) && m.createdBy?._id !== user._id
  );
  const sports = [...new Set([...myMatches, ...joinedMatches].map((m) => m.sportName))];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display font-black text-5xl uppercase tracking-tight mb-8">
        MY <span className="text-gradient">PROFILE</span>
      </h1>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-pitch-600 flex items-center justify-center text-white font-display font-black text-4xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-3xl text-white">{user.name}</h2>
            <p className="text-slate-400">{user.email}</p>
            <p className="text-slate-500 text-sm mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          {[
            { label: 'Created', value: myMatches.length },
            { label: 'Joined', value: joinedMatches.length },
            { label: 'Sports', value: sports.length },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl text-white">{loading ? '-' : s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports played */}
      {sports.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-display font-bold text-lg uppercase tracking-wide mb-3 text-slate-300">Sports Played</h3>
          <div className="flex flex-wrap gap-2">
            {sports.map((s) => (
              <span key={s} className="badge bg-pitch-500/20 text-pitch-400 text-sm px-3 py-1.5">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/dashboard" className="btn-secondary flex-1 text-center">View Dashboard</Link>
        <button onClick={logout} className="btn-danger flex-1">Logout</button>
      </div>
    </div>
  );
}
