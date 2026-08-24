import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { X, Calendar, ShieldCheck, CreditCard, Sparkles, CheckCircle2, AlertCircle, FileCheck, MapPin } from 'lucide-react';

const CheckoutModal = ({ vehicle, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() + 1);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const formatDateInput = (date) => date.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateInput(defaultStart));
  const [endDate, setEndDate] = useState(formatDateInput(defaultEnd));
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('DL-984719283471');
  const [pickupLocation, setPickupLocation] = useState(vehicle?.location || 'Downtown Hub');
  const [destinationLocation, setDestinationLocation] = useState('Local City Circuit');
  const [paymentType, setPaymentType] = useState('Split'); // 'Full' | 'Split'
  const [paymentMethod, setPaymentMethod] = useState('Visa ending 4242');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

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

  // Split calculations (50% upfront)
  const isSplit = paymentType === 'Split';
  const amountToPayNow = isSplit ? Math.round(totalPrice / 2) : totalPrice;
  const remainingAmount = isSplit ? totalPrice - amountToPayNow : 0;

  useEffect(() => {
    setSuccessBooking(null);
    setErrorMsg('');
    if (vehicle?.location) setPickupLocation(vehicle.location);
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!drivingLicenseNumber || drivingLicenseNumber.trim().length < 5) {
      setErrorMsg('Please enter a valid Driving License Number.');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMsg('Return date must be after pickup date.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await API.post('/bookings', {
        vehicleId: vehicle._id,
        startDate,
        endDate,
        drivingLicenseNumber,
        pickupLocation,
        destinationLocation,
        paymentType,
        paymentMethod: `Credit Card (${paymentMethod})`
      });

      if (res.data.success) {
        setSuccessBooking(res.data.booking);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit booking reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {successBooking ? (
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                WAITING FOR PROVIDER APPROVAL
              </span>
              <h2 className="text-2xl font-extrabold text-white">Booking Request Submitted!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Booking Ref: <span className="font-mono text-indigo-400 font-bold">{successBooking.bookingReference}</span>. Once approved by the vehicle provider, your unique Pickup Verification Code will appear in your dashboard.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4 text-left">
              <img src={vehicle.image} alt={vehicle.title} className="w-20 h-16 object-cover rounded-xl border border-slate-700" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{vehicle.title}</h4>
                <p className="text-xs text-slate-400">{pickupLocation} → {destinationLocation}</p>
                <div className="text-[11px] text-indigo-400 mt-1">
                  License: {drivingLicenseNumber}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Paid Now</p>
                <p className="text-lg font-extrabold text-emerald-400">${amountToPayNow}</p>
                {isSplit && (
                  <p className="text-[10px] text-pink-400">Due at pickup: ${remainingAmount}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => { onClose(); navigate('/dashboard'); }}
              className="btn-neon px-6 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 mx-auto"
            >
              <span>View Customer Dashboard</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
              <img src={vehicle.image} alt={vehicle.title} className="w-16 h-14 object-cover rounded-xl border border-slate-700" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{vehicle.brand} • {vehicle.category}</span>
                <h3 className="text-lg font-bold text-white">{vehicle.title}</h3>
                <p className="text-xs text-slate-400">${vehicle.dailyRate}/day • Masked Engine: {vehicle.maskedEngineNumber || '••••8912'}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              
              {/* Mandatory Driving License Number */}
              <div>
                <label className="font-semibold text-pink-400 flex items-center space-x-1.5 mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span>Mandatory Driving License Number</span>
                </label>
                <input
                  type="text"
                  value={drivingLicenseNumber}
                  onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                  placeholder="DL-984719283471"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:border-indigo-500"
                />
              </div>

              {/* From (Pickup) & To (Destination) Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pickup Location ("From")</span>
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Downtown SF Airport Hub"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    <span>Destination ("To")</span>
                  </label>
                  <input
                    type="text"
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    placeholder="e.g. Napa Valley Resort"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={formatDateInput(new Date())}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 flex items-center space-x-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Return Date</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Flexible Split-Payment Gateway Selector */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <label className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>Select Payment Gateway Option</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType('Split')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentType === 'Split'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-bold text-xs text-indigo-300">Split Payment (50% Upfront)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pay 50% now, send remaining at pickup.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('Full')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentType === 'Full'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <p className="font-bold text-xs text-emerald-300">Full Payment (100%)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pay total amount upfront now.</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>${dailyRate} × {totalDays} Days</span>
                  <span className="font-semibold text-slate-200">${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Fee (8%) + Insurance</span>
                  <span className="font-semibold text-slate-200">${serviceFee + insuranceFee}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total Rental Amount</span>
                  <span className="text-lg text-white font-extrabold">${totalPrice}</span>
                </div>
                {isSplit && (
                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 flex justify-between text-pink-300 font-bold">
                    <span>Due Now (50% Upfront):</span>
                    <span>${amountToPayNow}</span>
                  </div>
                )}
              </div>

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
                    <span>Confirm & Pay ${amountToPayNow} Now</span>
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
