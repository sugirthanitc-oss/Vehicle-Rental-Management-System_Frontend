import React, { useState, useEffect } from 'react';
import API from '../services/api';
import FilterBar from '../components/FilterBar';
import VehicleCard from '../components/VehicleCard';
import CheckoutModal from '../components/CheckoutModal';
import { Zap, ShieldCheck, Clock, Award, Sparkles, Car, ChevronRight } from 'lucide-react';

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState(['All', 'Electric', 'Luxury SUV', 'Sports Bike', 'Supercar', 'Sedan']);
  const [cities, setCities] = useState(['All Locations']);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Locations');
  const [sortOption, setSortOption] = useState('rating');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedVehicleForCheckout, setSelectedVehicleForCheckout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch live metadata and vehicles from backend API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await API.get('/vehicles/meta/options');
        if (res.data.success) {
          if (res.data.categories) setCategories(res.data.categories);
          if (res.data.cities) setCities(res.data.cities);
        }
      } catch (err) {
        console.warn('Metadata fetch warning:', err.message);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCity && selectedCity !== 'All Locations') params.append('city', selectedCity);
        if (sortOption) params.append('sort', sortOption);

        const res = await API.get(`/vehicles?${params.toString()}`);
        if (res.data.success) {
          setVehicles(res.data.vehicles);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedCategory, searchQuery, selectedCity, sortOption]);

  const handleBookNow = (vehicle) => {
    setSelectedVehicleForCheckout(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        
        {/* Neon Glow Backdrop Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/20 via-pink-500/20 to-cyan-500/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-card border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Next-Gen On-Demand Mobility System</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Drive the Future with <span className="gradient-text-neon">Unmatched Elegance</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Rent high-performance electric hypercars, luxury SUVs, and track-ready bikes with zero hassle. Seamless digital checkouts powered by JWT authentication and live MongoDB fleet management.
          </p>

          {/* Quick Metrics Badge */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-white">100%</p>
              <p className="text-[11px] text-slate-400">Verified Fleets</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-indigo-400">&lt; 2 Mins</p>
              <p className="text-[11px] text-slate-400">Instant Booking</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-pink-400">4.95 ★</p>
              <p className="text-[11px] text-slate-400">Rider Rating</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-cyan-400">$0</p>
              <p className="text-[11px] text-slate-400">Hidden Fees</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Fleet & Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Car className="w-7 h-7 text-indigo-400" />
              <span>Explore Fleet Catalog</span>
            </h2>
            <p className="text-xs text-slate-400">Select your preferred vehicle type, location, or sort option.</p>
          </div>
          
          <div className="text-xs text-slate-400">
            Showing <span className="text-indigo-400 font-bold">{vehicles.length}</span> active listings
          </div>
        </div>

        {/* Filter Toolbar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={cities}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {/* Vehicle Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-80 rounded-2xl animate-pulse p-4 space-y-4">
                <div className="h-40 bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No vehicles found matching filters</h3>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or resetting filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedCity('All Locations');
              }}
              className="btn-neon px-5 py-2.5 rounded-xl text-xs font-bold text-white"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}

      </section>

      {/* How It Works & Platform Perks Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">Simplified Workflow</span>
          <h2 className="text-3xl font-extrabold text-white">How DrivePulse Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-extrabold text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-white">Select Your Fleet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse curated high-performance vehicles, inspect live specifications, and pick your preferred location.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-pink-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-extrabold text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-white">Instant JWT Reservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your rental dates, review the automated price breakdown, and confirm your booking securely.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-extrabold text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-white">Hit the Open Road</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track your reservation status live in your User Dashboard, manage bookings, and enjoy contactless key pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {selectedVehicleForCheckout && (
        <CheckoutModal
          vehicle={selectedVehicleForCheckout}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};

export default Home;
