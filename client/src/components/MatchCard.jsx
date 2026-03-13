import { Link } from 'react-router-dom';

const SPORT_ICONS = {
  Football: '⚽', Soccer: '⚽', Basketball: '🏀', Tennis: '🎾',
  Cricket: '🏏', Baseball: '⚾', Volleyball: '🏐', Rugby: '🏉',
  Hockey: '🏒', Badminton: '🏸', Swimming: '🏊', Running: '🏃',
  Cycling: '🚴', Golf: '⛳', default: '🏅',
};

const LEVEL_COLORS = {
  'Beginner': 'bg-blue-500/20 text-blue-300',
  'Intermediate': 'bg-yellow-500/20 text-yellow-300',
  'Advanced': 'bg-red-500/20 text-red-300',
  'All Levels': 'bg-pitch-500/20 text-pitch-400',
};

export default function MatchCard({ match }) {
  const icon = SPORT_ICONS[match.sportName] || SPORT_ICONS.default;
  const spotsLeft = match.playersNeeded - match.participants.length;
  const isFull = spotsLeft <= 0;
  const date = new Date(match.date);

  return (
    <Link to={`/matches/${match._id}`} className="card group hover:border-pitch-500/40 hover:glow-green animate-slide-up block">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl group-hover:bg-slate-700 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white group-hover:text-pitch-400 transition-colors">
              {match.sportName}
            </h3>
            <p className="text-slate-500 text-sm">{match.createdBy?.name}</p>
          </div>
        </div>
        <span className={`badge ${LEVEL_COLORS[match.skillLevel] || LEVEL_COLORS['All Levels']}`}>
          {match.skillLevel}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span>📍</span>
          <span className="truncate">{match.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span>📅</span>
          <span>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className="text-slate-600">·</span>
          <span>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {match.description && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{match.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {match.participants.slice(0, 4).map((p, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-pitch-600 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-bold">
                {p.name?.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-slate-400 text-sm">
            <span className="text-white font-semibold">{match.participants.length}</span>/{match.playersNeeded}
          </span>
        </div>
        <span className={`badge font-semibold ${isFull ? 'bg-red-500/20 text-red-400' : 'bg-pitch-500/20 text-pitch-400'}`}>
          {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
        </span>
      </div>
    </Link>
  );
}
