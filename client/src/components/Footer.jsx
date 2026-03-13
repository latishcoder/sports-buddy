import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-pitch-500 rounded flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-white">SPORTS<span className="text-pitch-400">BUDDY</span></span>
        </div>
        <p className="text-slate-500 text-sm">Find your game. Find your people.</p>
        <div className="flex gap-4 text-sm text-slate-500">
          <Link to="/" className="hover:text-white transition-colors">Matches</Link>
          <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}
