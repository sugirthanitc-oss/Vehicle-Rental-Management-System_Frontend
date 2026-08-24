import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Zap, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Check, KeyRound, Building2, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dual Role State: 'customer' vs 'provider'
  const [role, setRole] = useState('customer');
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpMsg, setOtpMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const from = location.state?.from?.pathname || (role === 'provider' ? '/provider-dashboard' : '/dashboard');

  const handleSendOTP = async () => {
    setErrorMsg('');
    setOtpMsg('');
    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/send-otp', { phone: phone.trim() });
      if (res.data.success) {
        setOtpSent(true);
        setOtpMsg(res.data.message);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phone || !otp) {
      setErrorMsg('Please enter mobile number and OTP (Demo: 123456)');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/verify-otp-login', { phone: phone.trim(), otp: otp.trim(), role });
      if (res.data.success) {
        localStorage.setItem('drivepulse_token', res.data.token);
        localStorage.setItem('drivepulse_user', JSON.stringify(res.data.user));
        window.location.href = res.data.user.role === 'provider' ? '/provider-dashboard' : '/dashboard';
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(phone.trim(), password);
    setLoading(false);

    if (res.success) {
      const user = JSON.parse(localStorage.getItem('drivepulse_user') || '{}');
      if (user.role === 'provider') {
        navigate('/provider-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetPhone || !newPassword) {
      setResetMsg('Please provide mobile number and new password');
      return;
    }

    try {
      const res = await API.post('/auth/reset-password', { phone: resetPhone.trim(), newPassword });
      if (res.data.success) {
        setResetMsg('Password reset successfully! Log in below.');
        setTimeout(() => setShowResetModal(false), 1500);
      }
    } catch (err) {
      setResetMsg(err.response?.data?.message || 'Password reset failed');
    }
  };

  const fillCustomerDemo = () => {
    setRole('customer');
    setPhone('9876543210');
    setOtp('123456');
    setPassword('password123');
    setErrorMsg('');
  };

  const fillProviderDemo = () => {
    setRole('provider');
    setPhone('9123456789');
    setOtp('123456');
    setPassword('password123');
    setErrorMsg('');
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
          <h2 className="text-2xl font-extrabold text-white">Sign In to DrivePulse</h2>
          <p className="text-xs text-slate-400">Mobile-First Authentication via 10-Digit Phone & OTP.</p>
        </div>

        {/* Dual Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setRole('customer')}
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
            onClick={() => setRole('provider')}
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

        {/* Quick Demo Credentials Helper */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Quick Demo Tester
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fillCustomerDemo}
              type="button"
              className="flex-1 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] border border-indigo-500/20"
            >
              Fill Customer (9876543210)
            </button>
            <button
              onClick={fillProviderDemo}
              type="button"
              className="flex-1 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-semibold text-[11px] border border-pink-500/20"
            >
              Fill Provider (9123456789)
            </button>
          </div>
        </div>

        {/* Method Toggle: Mobile OTP vs Password */}
        <div className="flex justify-end text-xs space-x-4">
          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`font-semibold ${authMethod === 'otp' ? 'text-indigo-400 underline' : 'text-slate-400'}`}
          >
            Sign in via Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`font-semibold ${authMethod === 'password' ? 'text-indigo-400 underline' : 'text-slate-400'}`}
          >
            Sign in via Password
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {otpMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{otpMsg}</span>
          </div>
        )}

        {authMethod === 'otp' ? (
          /* Mobile OTP Form */
          <form onSubmit={handleOTPLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">10-Digit Mobile Number</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    required
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-400 border border-slate-700 whitespace-nowrap"
                >
                  Get OTP
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Enter OTP (Demo OTP: 123456)</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-center tracking-widest text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 pt-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify OTP & Log In ({role.toUpperCase()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Password Login Form */
          <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">10-Digit Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
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
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] text-pink-400 hover:text-pink-300 font-medium"
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
              className="w-full btn-neon py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 pt-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In with Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold">
            Sign Up as {role === 'provider' ? 'Provider' : 'Customer'}
          </Link>
        </div>

      </div>

      {/* Forgot / Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Reset Password Recovery</h3>
            <p className="text-xs text-slate-400">Provide your registered 10-digit mobile number and set a new password.</p>

            {resetMsg && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                {resetMsg}
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300">10-Digit Mobile Number</label>
                <input
                  type="tel"
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono mt-1"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-neon py-2 rounded-xl text-white font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
