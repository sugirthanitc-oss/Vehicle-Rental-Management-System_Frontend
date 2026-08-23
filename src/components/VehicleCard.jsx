import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Gauge, Fuel, Users, Zap, ArrowUpRight } from 'lucide-react';

const VehicleCard = ({ vehicle, onBookNow }) => {
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Electric':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Supercar':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Luxury SUV':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Sports Bike':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group">
      
      {/* Top Image Section */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={vehicle.image}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80" />

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-1 ${getCategoryBadgeClass(vehicle.category)}`}>
            {vehicle.category === 'Electric' && <Zap className="w-3 h-3 fill-cyan-400" />}
            {vehicle.category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 glass-card px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 flex items-center space-x-1 border border-amber-400/20">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{vehicle.rating}</span>
          <span className="text-slate-400 font-normal">({vehicle.reviewsCount})</span>
        </div>

        {/* Location Subtitle overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-1 text-slate-300 text-xs truncate">
          <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="truncate">{vehicle.location}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-indigo-400 uppercase">
            {vehicle.brand}
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {vehicle.title}
          </h3>
        </div>

        {/* Key Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate">{vehicle.horsepower} HP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>{vehicle.seating} Seats</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Fuel className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-normal">Rate per day</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-white">${vehicle.dailyRate}</span>
              <span className="text-xs text-indigo-400 font-medium">/day</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/vehicle/${vehicle._id}`}
              className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              title="View Specifications"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onBookNow(vehicle)}
              className="btn-neon px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-500/20"
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleCard;
