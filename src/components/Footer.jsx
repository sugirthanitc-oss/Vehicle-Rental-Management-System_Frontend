import React from 'react';
import { Zap, ShieldCheck, Heart, Github, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070A12] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DrivePulse</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation on-demand vehicle rental platform designed with RTCROS minimal vibe, real-time Mongo APIs, and JWT authentication.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-max">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Ready Architecture</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fleet Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Electric Hypercars</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Luxury Executive SUVs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Superbikes & Track Bikes</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Convertible Sport Coupes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Major Cities</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">San Francisco, CA</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Los Angeles, LA</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">New York City, NY</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Miami Beach, FL</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Project Specs</h4>
            <p className="text-xs text-slate-400 mb-2">Final Year B.Tech IT Major Project</p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Stack:</span>
                <span className="text-indigo-400 font-semibold">MERN + Tailwind</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auth:</span>
                <span className="text-pink-400 font-semibold">JWT + Bcrypt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Theme:</span>
                <span className="text-cyan-400 font-semibold">RTCROS Vibrant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DrivePulse Mobility Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for B.Tech IT
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
