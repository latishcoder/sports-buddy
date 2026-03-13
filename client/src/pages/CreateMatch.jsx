import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/api';

const SPORTS = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Volleyball', 'Rugby', 'Baseball', 'Hockey', 'Badminton', 'Swimming', 'Running', 'Cycling', 'Golf', 'Other'];
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CreateMatch() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sportName: '', location: '', date: '', time: '',
    playersNeeded: '', description: '', skillLevel: 'All Levels',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sportName || !form.location || !form.date || !form.time || !form.playersNeeded) {
      return setError('Please fill in all required fields');
    }
    if (Number(form.playersNeeded) < 2) return setError('Need at least 2 players');

    const dateTime = new Date(`${form.date}T${form.time}`);
    if (dateTime < new Date()) return setError('Match date must be in the future');

    setLoading(true);
    setError('');
    try {
      const { data } = await matchService.create({
        ...form,
        date: dateTime.toISOString(),
        playersNeeded: Number(form.playersNeeded),
      });
      navigate(`/matches/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-black text-5xl uppercase tracking-tight mb-2">
          CREATE A <span className="text-gradient">MATCH</span>
        </h1>
        <p className="text-slate-400">Set up your match and invite players to join</p>
      </div>

      <div className="card">
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Sport <span className="text-red-400">*</span></label>
            <select name="sportName" value={form.sportName} onChange={handleChange} className="input-field">
              <option value="">Select a sport</option>
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Location <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Central Park, New York"
              className="input-field"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                name="date"
                value={form.date}
                min={today}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Time <span className="text-red-400">*</span></label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Players & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Players Needed <span className="text-red-400">*</span></label>
              <input
                type="number"
                name="playersNeeded"
                value={form.playersNeeded}
                onChange={handleChange}
                min="2"
                max="100"
                placeholder="e.g. 10"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Skill Level</label>
              <select name="skillLevel" value={form.skillLevel} onChange={handleChange} className="input-field">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description <span className="text-slate-500">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add any extra details about the match, rules, or requirements..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
