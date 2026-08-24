import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { LayoutDashboard, Calendar, Car, ShieldCheck, DollarSign, Clock, CheckCircle2, User, Phone, Mail, RefreshCw, Key, CreditCard, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [payingRemaining, setPayingRemaining] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSendRemainingAmount = async (bookingId, amount) => {
    if (!window.confirm(`Send remaining balance of $${amount} to complete 100% payment for this rental?`)) return;

    try {
      setPayingRemaining(true);
      const res = await API.put(`/bookings/${bookingId}/pay-remaining`);
      if (res.data.success) {
        alert(res.data.message);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPayingRemaining(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.approvalStatus === activeTab;
  });

  const totalSpent = bookings.reduce((sum, b) => b.approvalStatus !== 'Cancelled' ? sum + b.amountPaid : sum, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Customer Header Banner */}
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                CUSTOMER RENTER
              </span>
            </div>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
              <span>Mobile: <strong className="text-indigo-400 font-mono">+91 {user?.phone}</strong></span>
              {user?.email && <span>Email: <strong className="text-slate-200">{user?.email}</strong></span>}
            </p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 border border-slate-700 w-max"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{bookings.length}</p>
            <p className="text-xs text-slate-400 font-medium">Total Bookings</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">
              {bookings.filter(b => b.approvalStatus === 'Approved').length}
            </p>
            <p className="text-xs text-slate-400 font-medium">Approved Rentals</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">${totalSpent}</p>
            <p className="text-xs text-slate-400 font-medium">Total Amount Paid</p>
          </div>
        </div>
      </div>

      {/* Main Bookings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            <span>My Rental Bookings & Approval Status</span>
          </h2>

          <div className="flex items-center space-x-1">
            {['All', 'Waiting for Approval', 'Approved', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
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
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-slate-400">You haven't placed any rental bookings in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          b.approvalStatus === 'Waiting for Approval' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                          'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        }`}>
                          {b.approvalStatus}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">{b.vehicle?.title}</h4>
                      <p className="text-xs text-slate-400">{b.pickupLocation} → {b.destinationLocation}</p>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1">
                    <p className="text-xs text-slate-400">Total Rental Cost</p>
                    <p className="text-xl font-extrabold text-white">${b.totalPrice}</p>
                    <p className={`text-[11px] font-semibold ${b.paymentStatus === 'Fully Paid' ? 'text-emerald-400' : 'text-pink-400'}`}>
                      {b.paymentStatus} (Paid: ${b.amountPaid})
                    </p>
                  </div>
                </div>

                {/* Driving License & Pickup Code Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">Driving License Verification:</span>
                    <span className="font-mono font-bold text-indigo-300">{b.drivingLicenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rental Dates:</span>
                    <span className="font-semibold text-slate-200">
                      {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()} ({b.totalDays} Days)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pickup Verification Code:</span>
                    {b.verificationCode ? (
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">{b.verificationCode}</span>
                    ) : (
                      <span className="text-amber-400 italic">Generates upon Provider Approval</span>
                    )}
                  </div>
                </div>

                {/* Split Payment Action: "Send Remaining Amount" */}
                {b.paymentType === 'Split' && b.remainingAmount > 0 && (
                  <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-pink-300 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-pink-400" />
                        <span>Split Payment Action Required: Send Remaining Amount</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        You have paid 50% upfront (${b.amountPaid}). Outstanding balance: <strong className="text-white">${b.remainingAmount}</strong>.
                      </p>
                    </div>

                    <button
                      onClick={() => handleSendRemainingAmount(b._id, b.remainingAmount)}
                      disabled={payingRemaining}
                      className="btn-neon px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-pink-500/25 shrink-0 flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Send Remaining Amount (${b.remainingAmount})</span>
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;
