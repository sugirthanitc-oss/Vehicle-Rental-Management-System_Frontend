import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Car,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Gauge,
  Key,
  Building2,
  FileText,
  DollarSign,
  User,
  Phone,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ totalFleet: 0, availableInGarage: 0, outOnRent: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'requests'

  // Register New Vehicle Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'EV',
    vehicleType: 'EV',
    dailyRate: '',
    location: '',
    city: 'San Francisco',
    transmission: 'Automatic',
    seating: 5,
    fuelType: 'Electric',
    engineNumber: '',
    chassisNumber: '',
    rcBookNumber: '',
    odometerReading: 12000,
    image: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch provider's fleet and metrics
      const fleetRes = await API.get('/vehicles/provider-fleet');
      if (fleetRes.data.success) {
        setVehicles(fleetRes.data.vehicles);
        setMetrics(fleetRes.data.metrics);
      }

      // Fetch provider's incoming booking requests
      const bookingsRes = await API.get('/bookings/provider-requests');
      if (bookingsRes.data.success) {
        setBookingRequests(bookingsRes.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!formData.title || !formData.brand || !formData.engineNumber || !formData.chassisNumber || !formData.rcBookNumber || !formData.dailyRate) {
      setRegError('Title, Brand, Engine No, Chassis No, RC Book No, and Daily Rate are required.');
      return;
    }

    try {
      setRegSubmitting(true);
      const res = await API.post('/vehicles/register', formData);
      if (res.data.success) {
        setRegSuccess('Vehicle registered successfully!');
        setTimeout(() => {
          setIsRegisterModalOpen(false);
          setRegSuccess('');
          setFormData({
            title: '',
            brand: '',
            category: 'EV',
            vehicleType: 'EV',
            dailyRate: '',
            location: '',
            city: 'San Francisco',
            transmission: 'Automatic',
            seating: 5,
            fuelType: 'Electric',
            engineNumber: '',
            chassisNumber: '',
            rcBookNumber: '',
            odometerReading: 12000,
            image: ''
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setRegError(err.response?.data?.message || 'Failed to register vehicle.');
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/approve`);
      if (res.data.success) {
        alert(`Reservation approved! Pickup Verification Code: ${res.data.booking.verificationCode}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Reject this booking request?')) return;
    try {
      const res = await API.put(`/bookings/${bookingId}/reject`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Provider Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-pink-500 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.shopName || user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase">
                VERIFIED PROVIDER
              </span>
            </div>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
              <span>Owner: <strong className="text-slate-200">{user?.name}</strong></span>
              <span>GST: <strong className="text-indigo-400 font-mono">{user?.gstNumber || '22AAAAA0000A1Z5'}</strong></span>
              <span>Mobile: <strong className="text-emerald-400 font-mono">+91 {user?.phone}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="btn-neon px-5 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Vehicle</span>
          </button>

          <button
            onClick={fetchData}
            className="glass-card p-3 rounded-xl text-slate-400 hover:text-white border border-slate-700"
            title="Refresh Fleet Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Fleet Status Tracker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{metrics.totalFleet}</p>
            <p className="text-xs text-slate-400 font-medium">Total Registered Fleet</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 flex items-center space-x-4 bg-emerald-500/5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-400">{metrics.availableInGarage}</p>
            <p className="text-xs text-slate-300 font-medium">Available in Garage</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-pink-500/30 flex items-center space-x-4 bg-pink-500/5">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-pink-400">{metrics.outOnRent}</p>
            <p className="text-xs text-slate-300 font-medium">Currently Out on Rent</p>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fleet'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          My Registered Fleet ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          <span>Incoming Customer Requests ({bookingRequests.length})</span>
          {bookingRequests.filter(b => b.approvalStatus === 'Waiting for Approval').length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-pink-500 text-white animate-pulse">
              {bookingRequests.filter(b => b.approvalStatus === 'Waiting for Approval').length} NEW
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Fleet Inventory List */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {vehicles.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Car className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Vehicles Registered Yet</h3>
              <p className="text-xs text-slate-400">Click "Register New Vehicle" above to add your first EV, SUV, or Sedan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div key={v._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 relative">
                  
                  <div className="relative h-40 rounded-xl overflow-hidden bg-slate-900">
                    <img src={v.image} alt={v.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      v.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    }`}>
                      {v.status === 'Available' ? 'In Garage' : 'Out on Rent'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{v.brand} • {v.category}</span>
                    <h3 className="text-base font-bold text-white">{v.title}</h3>
                    <p className="text-xs text-slate-400">${v.dailyRate}/day • {v.location}</p>
                  </div>

                  {/* Provider Private Specs Box */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Engine No:</span>
                      <span className="font-mono text-indigo-300">{v.engineNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Chassis No:</span>
                      <span className="font-mono text-pink-300">{v.chassisNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">RC Book No:</span>
                      <span className="font-mono text-cyan-300">{v.rcBookNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                      <span className="text-slate-500">Odometer:</span>
                      <span className="font-semibold text-emerald-400">{v.odometerReading} KM Driven</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Booking Approval Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {bookingRequests.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Incoming Booking Requests</h3>
              <p className="text-xs text-slate-400">Customer rental requests requiring your approval will appear here.</p>
            </div>
          ) : (
            bookingRequests.map((b) => (
              <div key={b._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-4">
                    <img
                      src={b.vehicle?.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=300'}
                      alt={b.vehicle?.title}
                      className="w-20 h-16 object-cover rounded-xl border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {b.bookingReference}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          b.approvalStatus === 'Waiting for Approval' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                          'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        }`}>
                          {b.approvalStatus}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{b.vehicle?.title}</h4>
                      <p className="text-xs text-slate-400">Customer: <strong className="text-slate-200">{b.user?.name}</strong> • Phone: <strong className="text-indigo-400">+91 {b.user?.phone}</strong></p>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1">
                    <p className="text-xs text-slate-400">Total Rental Value</p>
                    <p className="text-xl font-extrabold text-white">${b.totalPrice}</p>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      Paid Upfront: ${b.amountPaid} ({b.paymentType === 'Split' ? '50% Split Payment' : '100% Full'})
                    </span>
                  </div>
                </div>

                {/* Customer Verification & Route Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">Driving License No:</span>
                    <span className="font-mono font-bold text-pink-400">{b.drivingLicenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pickup Location ("From"):</span>
                    <span className="font-medium text-slate-200">{b.pickupLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Destination ("To"):</span>
                    <span className="font-medium text-slate-200">{b.destinationLocation}</span>
                  </div>
                </div>

                {/* Approval Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {b.verificationCode && (
                    <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium flex items-center space-x-2">
                      <Key className="w-4 h-4 text-indigo-400" />
                      <span>Pickup Verification Code: <strong className="font-mono text-white font-extrabold text-sm">{b.verificationCode}</strong></span>
                    </div>
                  )}

                  {b.approvalStatus === 'Waiting for Approval' && (
                    <div className="flex items-center space-x-3 ml-auto">
                      <button
                        onClick={() => handleReject(b._id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => handleApprove(b._id)}
                        className="btn-neon px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Generate Code</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* New Vehicle Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Car className="w-6 h-6 text-indigo-400" />
                <span>Register New Vehicle to Fleet</span>
              </h2>
              <p className="text-xs text-slate-400">Capture official credentials (Engine, Chassis, RC Book, Odometer km).</p>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300">Vehicle Title / Model Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Tesla Model 3 Long Range"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Tesla, Porsche, BMW"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Official Credentials Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div>
                  <label className="font-semibold text-indigo-400">Engine Number</label>
                  <input
                    type="text"
                    value={formData.engineNumber}
                    onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                    placeholder="ENG-98472918"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono mt-1 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-pink-400">Chassis Number</label>
                  <input
                    type="text"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    placeholder="CHS-88392019"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono mt-1 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-cyan-400">RC Book Number</label>
                  <input
                    type="text"
                    value={formData.rcBookNumber}
                    onChange={(e) => setFormData({ ...formData, rcBookNumber: e.target.value })}
                    placeholder="RC-77392019"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono mt-1 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1"
                  >
                    <option value="EV">EV (Electric)</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Supercar">Supercar</option>
                    <option value="Sports Bike">Sports Bike</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Daily Rental Rate ($)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    placeholder="189"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Odometer Reading (KM)</label>
                  <input
                    type="number"
                    value={formData.odometerReading}
                    onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                    placeholder="12000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={regSubmitting}
                className="w-full btn-neon py-3.5 rounded-xl text-xs font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2 pt-3"
              >
                {regSubmitting ? 'Registering Vehicle...' : 'Save & Add to Live Garage'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderDashboard;
