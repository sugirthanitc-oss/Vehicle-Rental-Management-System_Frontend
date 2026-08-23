import React from 'react';
import { Search, MapPin, SlidersHorizontal, Zap } from 'lucide-react';

const FilterBar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  cities,
  sortOption,
  setSortOption
}) => {
  return (
    <div className="space-y-6">
      
      {/* Category Pills Header */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 ${
                active
                  ? 'bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : 'glass-card text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              {cat === 'Electric' && <Zap className={`w-3.5 h-3.5 ${active ? 'fill-white' : 'text-cyan-400'}`} />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Input Search Controls Row */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-3 border border-slate-800">
        
        {/* Search Query Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by brand, model or keyword (e.g. Tesla, GT3)..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Location Dropdown */}
        <div className="md:col-span-4 relative">
          <MapPin className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-all cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city} className="bg-[#131B2E] text-slate-200">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Option */}
        <div className="md:col-span-3 relative">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-all cursor-pointer"
          >
            <option value="rating" className="bg-[#131B2E]">Sort: Top Rated</option>
            <option value="price-low" className="bg-[#131B2E]">Sort: Price Low → High</option>
            <option value="price-high" className="bg-[#131B2E]">Sort: Price High → Low</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
