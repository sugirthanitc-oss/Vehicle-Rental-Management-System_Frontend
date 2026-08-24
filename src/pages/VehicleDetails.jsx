import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import CheckoutModal from '../components/CheckoutModal';
import { Star, MapPin, Gauge, Fuel, Users, Zap, ShieldCheck, ArrowLeft, Phone, Calendar, Lock, CheckCircle2 } from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/vehicles/${id}`);
        if (res.data.success) {
          setVehicle(res.data.vehicle);
          setActiveImage(res.data.vehicle.image);
        }
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-xs text-slate-400">The vehicle listing you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-neon px-6 py-2.5 rounded-xl text-xs font-bold text-white inline-block">
          Return to Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fleet Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="space-y-4">
            <div className="h-96 md:h-[450px] rounded-3xl overflow-hidden glass-card relative border border-slate-800">
              <img src={activeImage} alt={vehicle.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-indigo-400">
                {vehicle.category}
              </div>
            </div>

            {vehicle.gallery && vehicle.gallery.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {vehicle.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{vehicle.brand}</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{vehicle.title}</h1>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>{vehicle.location}</span>
                </div>
              </div>

              <div className="glass-card px-4 py-2 rounded-2xl border border-amber-400/20 text-center">
                <div className="flex items-center space-x-1 text-amber-300 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{vehicle.rating || 4.9}</span>
                </div>
                <span className="text-[10px] text-slate-400">Verified Rating</span>
              </div>
            </div>
          </div>

          {/* Security & Privacy Masking Rule Section */}
          <div className="p-5 rounded-3xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-400" />
                <span>Verified Vehicle Official Credentials (Privacy Masked)</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Last 4 Digits Display Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Engine Number</span>
                <span className="font-mono font-bold text-indigo-300">{vehicle.maskedEngineNumber || '••••8912'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Chassis Number</span>
                <span className="font-mono font-bold text-pink-300">{vehicle.maskedChassisNumber || '••••4567'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">RC Book Number</span>
                <span className="font-mono font-bold text-cyan-300">{vehicle.maskedRcNumber || '••••1234'}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Performance Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <Gauge className="w-5 h-5 text-indigo-400 mx-auto" />
                <p className="text-lg font-extrabold text-white">{vehicle.horsepower || 300} HP</p>
                <p className="text-[10px] text-slate-400">Peak Output</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <Zap className="w-5 h-5 text-pink-400 mx-auto" />
                <p className="text-lg font-extrabold text-white">{vehicle.zeroToSixty || '3.5s'}</p>
                <p className="text-[10px] text-slate-400">0-60 MPH</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <Fuel className="w-5 h-5 text-cyan-400 mx-auto" />
                <p className="text-lg font-extrabold text-white">{vehicle.fuelType}</p>
                <p className="text-[10px] text-slate-400">Powertrain</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-1">
                <Users className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-lg font-extrabold text-white">{vehicle.seating} Seats</p>
                <p className="text-[10px] text-slate-400">Seating Capacity</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sticky Reservation Card */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-700/80 sticky top-28 space-y-6 shadow-2xl">
            
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white">${vehicle.dailyRate}</span>
                <span className="text-xs text-indigo-400 font-medium"> / day</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Available
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Driving License Verification</span>
                <span className="font-semibold text-pink-400">Mandatory</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Flexible Payment</span>
                <span className="font-semibold text-cyan-400">50% Split / Full</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Provider Approval</span>
                <span className="font-semibold text-amber-400">Pickup Code Required</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full btn-neon py-3.5 rounded-xl text-sm font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve & Pay (Split / Full)</span>
            </button>

          </div>
        </div>

      </div>

      {vehicle && (
        <CheckoutModal
          vehicle={vehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};

export default VehicleDetails;
