// ============================================================
// BuildMySite Admin — Profile Page (Premium UI)
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Save, Lock, Eye, EyeOff, Camera, Trash2, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils';

interface ProfileFormInput {
  name: string;
  email: string;
  phone: string;
}

interface PasswordFormInput {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile = () => {
  const { admin, updateAdmin } = useAuth();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: submitProfile,
    setValue,
    formState: { isDirty },
  } = useForm<ProfileFormInput>({
    defaultValues: {
      name: admin?.name ?? '',
      email: admin?.email ?? '',
      phone: admin?.phone ?? '',
    },
  });

  // Keep form in sync when context loads/updates
  useEffect(() => {
    if (admin) {
      setValue('name', admin.name);
      setValue('email', admin.email);
      setValue('phone', admin.phone ?? '');
    }
  }, [admin, setValue]);

  // Password Form
  const {
    register: regPass,
    handleSubmit: submitPass,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm<PasswordFormInput>();

  const newPassword = watchPass('newPassword');

  // Submit Profile Changes
  const onProfileSave = (data: ProfileFormInput) => {
    updateAdmin({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Submit Password Change
  const onPasswordChange = (data: PasswordFormInput) => {
    setPasswordError('');
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordSaved(true);
    resetPass();
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  // Profile Photo Upload Handlers
  const handlePhotoUpload = (file: File) => {
    setPhotoError('');

    // Formats validation
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!supportedTypes.includes(file.type)) {
      setPhotoError('Supported formats: JPG, PNG, WEBP, SVG, GIF');
      return;
    }

    // Size validation: 2 MB limit
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setPhotoError('Photo must be less than 2 MB');
      return;
    }

    // Convert file to base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      updateAdmin({ avatar: resultStr });
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handlePhotoUpload(files[0]);
    }
  };

  const removePhoto = () => {
    updateAdmin({ avatar: '' });
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
          <UserCircle size={22} className="text-gold-400" /> Account Profile
        </h1>
        <p className="text-sm text-obsidian-400 mt-0.5">Manage your personal information, profile photo, and password security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar Uploader & Role Display */}
        <div className="space-y-6">
          <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".jpg,.jpeg,.png,.svg,.webp,.gif"
              className="hidden"
            />

            {/* Profile Avatar Frame */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gold-gradient p-0.5 shadow-gold/20 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-obsidian-950 overflow-hidden flex items-center justify-center text-gold-400 text-3xl font-bold">
                  {admin?.avatar ? (
                    <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                  ) : (
                    admin ? getInitials(admin.name) : 'A'
                  )}
                </div>
              </div>

              {/* Camera Overlays */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-900 border border-obsidian-950 transition-colors shadow-lg active:scale-95"
                title="Upload Photo"
              >
                <Camera size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div>
              <p className="text-base font-bold text-obsidian-100">{admin?.name}</p>
              <p className="text-xs text-obsidian-400 mt-0.5">{admin?.email}</p>
              <div className="mt-3">
                <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-lg text-xs font-bold text-gold-400 uppercase tracking-wider">
                  {admin?.role ?? 'Super Admin'}
                </span>
              </div>
            </div>

            {/* Photo Edit Options */}
            {admin?.avatar && (
              <button
                type="button"
                onClick={removePhoto}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-[10px] font-bold text-red-400 transition-colors"
              >
                <Trash2 size={12} /> Remove photo
              </button>
            )}

            {photoError && (
              <p className="text-[10px] font-semibold text-red-400 bg-red-500/5 border border-red-500/10 p-2 rounded-lg w-full">
                {photoError}
              </p>
            )}
          </div>
        </div>

        {/* Right Columns: Edit Info Form & Change Password Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6">
            <h3 className="font-bold text-obsidian-100 text-sm pb-3 border-b border-obsidian-750 mb-5">Personal Details</h3>
            
            <form onSubmit={submitProfile(onProfileSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} className="text-gold-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    {...regProfile('name', { required: 'Full name is required' })}
                    className="input-dark"
                    placeholder="e.g. Alexander Vance"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={12} className="text-gold-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    {...regProfile('email', { required: 'Email address is required' })}
                    className="input-dark"
                    placeholder="e.g. alexander@buildmysite.com"
                  />
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} className="text-gold-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    {...regProfile('phone')}
                    className="input-dark"
                    placeholder="e.g. +44 (0) 7700 900077"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-obsidian-750/30">
                <p className="text-xs text-obsidian-500 font-medium">
                  {isDirty ? 'Unsaved changes' : 'Profile up to date'}
                </p>
                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {profileSaved && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-green-400 font-semibold"
                      >
                        ✓ Profile updated successfully
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    className="gold-btn flex items-center gap-2 px-5 py-2 text-xs font-bold"
                  >
                    <Save size={13} /> Save Profile
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6">
            <h3 className="font-bold text-obsidian-100 text-sm pb-3 border-b border-obsidian-750 mb-5 flex items-center gap-1.5">
              <Lock size={15} className="text-gold-400" /> Security (Change Password)
            </h3>

            <form onSubmit={submitPass(onPasswordChange)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    {...regPass('currentPassword', { required: 'Required' })}
                    className="input-dark pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passErrors.currentPassword && <p className="text-[10px] text-red-400">{passErrors.currentPassword.message}</p>}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    {...regPass('newPassword', {
                      required: 'Required',
                      minLength: { value: 8, message: 'Minimum 8 characters' }
                    })}
                    className="input-dark pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passErrors.newPassword && <p className="text-[10px] text-red-400">{passErrors.newPassword.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...regPass('confirmPassword', {
                      required: 'Required',
                      validate: v => v === newPassword || 'Passwords do not match'
                    })}
                    className="input-dark pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passErrors.confirmPassword && <p className="text-[10px] text-red-400">{passErrors.confirmPassword.message}</p>}
              </div>

              {passwordError && (
                <p className="text-[10px] font-semibold text-red-400">{passwordError}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-obsidian-750/30">
                <AnimatePresence>
                  {passwordSaved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-green-400 font-semibold"
                    >
                      ✓ Password changed successfully
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  className="px-4 py-2 border border-obsidian-700 hover:border-obsidian-600 bg-obsidian-900 hover:bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 rounded-xl text-xs font-bold transition-all duration-200 ml-auto"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
