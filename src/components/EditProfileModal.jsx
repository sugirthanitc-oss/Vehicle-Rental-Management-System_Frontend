import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Phone, Mail, Building2, FileText, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setShopName(user.shopName || '');
      setGstNumber(user.gstNumber || '');
      setDrivingLicenseNumber(user.drivingLicenseNumber || '');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isProvider = user.role === 'provider';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setErrorMsg('Mobile number must be strictly 10 digits.');
      return;
    }

    if (isProvider) {
      if (!email) {
        setErrorMsg('Email address is mandatory for Vehicle Providers.');
        return;
      }
      if (!shopName) {
        setErrorMsg('Shop/Business Name is required.');
        return;
      }
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      const formattedGst = gstNumber.trim().toUpperCase();
      if (!gstRegex.test(formattedGst)) {
        setErrorMsg('Invalid GST Number format (e.g. 22AAAAA0000A1Z5 - 15 characters).');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await updateProfile({
        name,
        phone: cleanPhone,
        email,
        shopName: isProvider ? shopName : undefined,
        gstNumber: isProvider ? gstNumber.trim().toUpperCase() : undefined,
        drivingLicenseNumber: !isProvider ? drivingLicenseNumber.trim().toUpperCase() : undefined
      });

      if (res.success) {
        setSuccessMsg('Profile details updated successfully!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white">Edit Profile Details</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isProvider ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {isProvider ? 'PROVIDER' : 'CUSTOMER'}
            </span>
          </div>
          <p className="text-xs text-slate-400">Update your verified account credentials and business/license details.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Name / Representative Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>10-Digit Mobile Number</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span>Email Address {isProvider && <span className="text-pink-400">*</span>}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={isProvider}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500"
            />
          </div>

          {/* Provider Specific Fields */}
          {isProvider && (
            <>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Shop / Business Name</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>GST Registration Number (15 Characters)</span>
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  maxLength={15}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Customer Specific Fields */}
          {!isProvider && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Driving License Number (Optional / Pre-fill)</span>
              </label>
              <input
                type="text"
                value={drivingLicenseNumber}
                onChange={(e) => setDrivingLicenseNumber(e.target.value.toUpperCase())}
                placeholder="DL-984719283471"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-neon py-3 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/25"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
