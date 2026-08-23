import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { LayoutDashboard, Calendar, Car, ShieldCheck, DollarSign, Clock, XCircle, CheckCircle2, User, Phone, Mail, RefreshCw } from 'lucide-react';

const UserDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const res = await API.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        // Refresh bookings list
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setUpdatingProfile(true);
    const res = await updateProfile({ name: editName, phone: editPhone });
    setUpdatingProfile(false);
    if (res.success) {
      setProfileMsg('Profile details updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } else {
      setProfileMsg(res.message);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  // Calculate Metrics
  const totalSpent = bookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.totalPrice : sum, 0);
  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Profile Header Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO MEMBER
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-3 mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {user?.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-pink-400" /> {user?.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 border border-slate-700 hover:border-indigo-500/40 transition-colors w-max"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{bookings.length}</p>
            <p className="text-xs text-slate-400 font-medium">Total Reservations</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{activeBookingsCount}</p>
            <p className="text-xs text-slate-400 font-medium">Active Rentals</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">${totalSpent}</p>
            <p className="text-xs text-slate-400 font-medium">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Bookings History */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
              <span>Reservation History</span>
            </h2>

            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1">
              {['All', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card h-40 rounded-2xl animate-pulse p-4" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No {activeTab !== 'All' ? activeTab : ''} Reservations Found</h3>
              <p className="text-xs text-slate-400">You haven't made any vehicle reservations in this category yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div key={b._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
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
                            b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            b.status === 'Cancelled' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                            'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{b.vehicle?.title || 'Vehicle Listing'}</h4>
                        <p className="text-xs text-slate-400">{b.pickupLocation}</p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs text-slate-400">Total Price</p>
                      <p className="text-xl font-extrabold text-white">${b.totalPrice}</p>
                    </div>
                  </div>

                  {/* Dates & Action Row */}
                  <div className="flex flex-wrap items-center justify-between text-xs gap-3">
                    <div className="flex items-center space-x-4 text-slate-300">
                      <div>
                        <span className="text-slate-500">Pickup:</span>{' '}
                        <span className="font-semibold text-white">{new Date(b.startDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Return:</span>{' '}
                        <span className="font-semibold text-white">{new Date(b.endDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-normal">({b.totalDays} Days)</span>
                      </div>
                    </div>

                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right 4 Columns: Profile Settings */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Profile Settings</span>
            </h3>

            {profileMsg && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Account Email (ReadOnly)</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full btn-neon py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-indigo-500/20"
              >
                {updatingProfile ? 'Saving Changes...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserDashboard;
