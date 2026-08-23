import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { X, Calendar, ShieldCheck, CreditCard, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const CheckoutModal = ({ vehicle, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Default dates: tomorrow and +3 days
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() + 1);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const formatDateInput = (date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateInput(defaultStart));
  const [endDate, setEndDate] = useState(formatDateInput(defaultEnd));
  const [paymentMethod, setPaymentMethod] = useState('Visa ending 4242');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Financial calculations
  const calculateDays = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || e <= s) return 1;
    const diff = Math.abs(e - s);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const totalDays = calculateDays();
  const dailyRate = vehicle?.dailyRate || 0;
  const subtotal = dailyRate * totalDays;
  const serviceFee = Math.round(subtotal * 0.08);
  const insuranceFee = 25 * totalDays;
  const totalPrice = subtotal + serviceFee + insuranceFee;

  useEffect(() => {
    setSuccessBooking(null);
    setErrorMsg('');
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMsg('Return date must be after start date.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await API.post('/bookings', {
        vehicleId: vehicle._id,
        startDate,
        endDate,
        paymentMethod: `Credit Card (${paymentMethod})`
      });

      if (res.data.success) {
        setSuccessBooking(res.data.booking);
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {successBooking ? (
          /* Confirmation Celebration Screen */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                RESERVATION CONFIRMED
              </span>
              <h2 className="text-2xl font-extrabold text-white">Your Trip is Ready to Go!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Booking Ref: <span className="font-mono text-indigo-400 font-bold">{successBooking.bookingReference}</span>. A detailed receipt and pickup instructions have been saved to your profile.
              </p>
            </div>

            {/* Vehicle Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4 text-left">
              <img
                src={vehicle.image}
                alt={vehicle.title}
                className="w-20 h-16 object-cover rounded-xl border border-slate-700"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{vehicle.title}</h4>
                <p className="text-xs text-slate-400">{vehicle.location}</p>
                <div className="text-[11px] text-indigo-400 mt-1">
                  {totalDays} Days ({startDate} to {endDate})
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Paid</p>
                <p className="text-lg font-extrabold text-emerald-400">${totalPrice}</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="btn-neon px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
              >
                <span>View Dashboard Bookings</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Date & Calculation Form */
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Header Header */}
            <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
              <img
                src={vehicle.image}
                alt={vehicle.title}
                className="w-16 h-14 object-cover rounded-xl border border-slate-700"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{vehicle.brand}</span>
                <h3 className="text-lg font-bold text-white">{vehicle.title}</h3>
                <p className="text-xs text-slate-400">${vehicle.dailyRate}/day • {vehicle.location}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-6">
              
              {/* Date Selector Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={formatDateInput(new Date())}
                    required
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Return Date</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    required
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Payment Method</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Visa ending 4242">Visa ending 4242 (Instant Approval Demo)</option>
                  <option value="MasterCard ending 8819">MasterCard ending 8819</option>
                  <option value="Apple Pay">Apple Pay Digital Wallet</option>
                </select>
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>${dailyRate} × {totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                  <span className="font-semibold text-slate-200">${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform Service Fee (8%)</span>
                  <span className="font-semibold text-slate-200">${serviceFee}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Premium Collision Insurance ($25/day)</span>
                  <span className="font-semibold text-slate-200">${insuranceFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Amount Due</span>
                  <span className="text-xl text-emerald-400 font-extrabold">${totalPrice}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-neon py-3.5 rounded-xl text-sm font-bold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay ${totalPrice}</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
