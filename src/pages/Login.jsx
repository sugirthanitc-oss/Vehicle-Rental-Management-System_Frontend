import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Zap, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Check, KeyRound, Building2, User, HelpCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role Tab: 'customer' vs 'provider'
  const [role, setRole] = useState('customer');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password OTP Recovery Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.trim();
    if (!cleanPhone || !/^[0-9]{10}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/login', { phone: cleanPhone, password, role });
      if (res.data.success) {
        localStorage.setItem('drivepulse_token', res.data.token);
        localStorage.setItem('drivepulse_user', JSON.stringify(res.data.user));
        window.location.href = res.data.user.role === 'provider' ? '/provider-dashboard' : '/dashboard';
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMsg('');

    if (!resetPhone || !/^[0-9]{10}$/.test(resetPhone.trim())) {
      setResetError('Please enter your registered 10-digit mobile number.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await API.post('/auth/send-otp', { phone: resetPhone.trim() });
      if (res.data.success) {
        setResetStep(2);
        setResetMsg(res.data.message);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'No registered account found with this mobile number.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMsg('');

    if (!resetOtp || !newPassword) {
      setResetError('Please enter OTP and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await API.post('/auth/reset-password', {
        phone: resetPhone.trim(),
        otp: resetOtp.trim(),
        newPassword
      });

      if (res.data.success) {
        setResetMsg('Password reset successfully! You can now sign in.');
        setTimeout(() => {
          setShowResetModal(false);
          setResetStep(1);
          setResetPhone('');
          setResetOtp('');
          setNewPassword('');
          setResetMsg('');
        }, 1500);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background Aura */}
      <div className="absolute w-96 h-96 bg-gradient-to-r from-indigo-600/20 via-pink-500/20 to-cyan-500/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-pink-500 to-cyan-400 p-[2px] mx-auto">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to DrivePulse Pro</h2>
          <p className="text-xs text-slate-400">Direct Login via 10-Digit Mobile Number & Password.</p>
        </div>

        {/* Dual Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setRole('customer'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'customer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Renter</span>
          </button>

          <button
            type="button"
            onClick={() => { setRole('provider'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'provider'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Vehicle Provider</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Direct Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">10-Digit Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile (e.g. 9876543210)"
                maxLength={10}
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => { setShowResetModal(true); setResetStep(1); setResetError(''); setResetMsg(''); }}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-neon py-3.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 pt-3"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {role === 'provider' ? 'Vehicle Provider' : 'Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold">
            Sign Up as {role === 'provider' ? 'Provider' : 'Customer'}
          </Link>
        </div>

      </div>

      {/* Forgot Password OTP Recovery Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-700 space-y-4">
            
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <span>Forgot Password Recovery</span>
              </h3>
              <p className="text-xs text-slate-400">
                {resetStep === 1
                  ? 'Enter your registered 10-digit mobile number to receive a verification OTP.'
                  : 'Enter the verification OTP sent to your mobile and set your new password.'}
              </p>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{resetMsg}</span>
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSendResetOTP} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300">Registered 10-Digit Mobile Number</label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={resetPhone}
                      onChange={(e) => setResetPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 btn-neon py-2.5 rounded-xl text-white font-bold"
                  >
                    {resetLoading ? 'Sending OTP...' : 'Send Reset OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300">Enter OTP (Demo OTP: 123456)</label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-center text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white mt-1"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 btn-neon py-2.5 rounded-xl text-white font-bold"
                  >
                    {resetLoading ? 'Updating...' : 'Confirm Reset Password'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
