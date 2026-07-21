// ============================================================
// BuildMySite Admin — Settings Page (Premium Frontend-Only)
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Upload,
  X,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SettingsFormInput {
  companyName: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  themePrimaryColor: string;
  themeBgColor: string;
}

interface PasswordFormInput {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const DEFAULT_SETTINGS: SettingsFormInput = {
  companyName: 'BuildMySite',
  website: 'https://buildmysite.com',
  email: 'hello@buildmysite.com',
  phone: '+44 (0) 20 1234 5678',
  address: 'London, United Kingdom',
  twitter: 'https://twitter.com/buildmysite',
  instagram: 'https://instagram.com/buildmysite',
  linkedin: 'https://linkedin.com/company/buildmysite',
  facebook: 'https://facebook.com/buildmysite',
  themePrimaryColor: '#D4AF37',
  themeBgColor: '#0A0A0A',
};

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6 space-y-4">
    <h3 className="font-bold text-obsidian-100 text-sm pb-3 border-b border-obsidian-750">{title}</h3>
    {children}
  </div>
);

const AdminSettings = () => {
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Logo upload state
  const [logo, setLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize main settings form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<SettingsFormInput>({
    defaultValues: DEFAULT_SETTINGS,
  });

  // Initialize password form
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm<PasswordFormInput>();

  const newPassword = watchPass('newPassword');

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('bms_site_settings');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as SettingsFormInput;
        Object.entries(parsed).forEach(([key, val]) => {
          setValue(key as keyof SettingsFormInput, val);
        });
      } catch (e) {
        console.error('Failed to parse site settings:', e);
      }
    }

    const savedLogo = localStorage.getItem('bms_site_logo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, [setValue]);

  // Main Form Submit (Save settings)
  const onSubmitSettings = (data: SettingsFormInput) => {
    localStorage.setItem('bms_site_settings', JSON.stringify(data));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Password Form Submit
  const onSubmitPassword = (data: PasswordFormInput) => {
    setPasswordError('');
    // Client-side demo logic
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordSaved(true);
    resetPass();
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  // Logo uploader handlers
  const handleLogoUpload = (file: File) => {
    setLogoError('');

    // Supported formats validation
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!supportedTypes.includes(file.type)) {
      setLogoError('Supported formats: JPG, PNG, WEBP, SVG, GIF');
      return;
    }

    // Size limit validation: 2 MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setLogoError('Image size must be less than 2 MB');
      return;
    }

    // Convert file to Base64 data url
    const reader = new FileReader();
    reader.onloadend = () => {
      const resultStr = reader.result as string;
      setLogo(resultStr);
      localStorage.setItem('bms_site_logo', resultStr);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoError('');
    localStorage.removeItem('bms_site_logo');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-obsidian-50 flex items-center gap-2">
            <SettingsIcon size={22} className="text-gold-400" /> Settings
          </h1>
          <p className="text-sm text-obsidian-400 mt-0.5">Manage company information, contact details, branding and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-6">
            {/* Company Info */}
            <SettingsSection title="Company Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Globe size={12} className="text-gold-400" /> Company Name
                  </label>
                  <input
                    type="text"
                    {...register('companyName', { required: true })}
                    className="input-dark"
                    placeholder="e.g. BuildMySite"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Globe size={12} className="text-gold-400" /> Website URL
                  </label>
                  <input
                    type="url"
                    {...register('website')}
                    className="input-dark"
                    placeholder="e.g. https://buildmysite.com"
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Contact Details */}
            <SettingsSection title="Contact Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail size={12} className="text-gold-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="input-dark"
                    placeholder="e.g. hello@buildmysite.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone size={12} className="text-gold-400" /> Phone Number
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="input-dark"
                    placeholder="e.g. +44 (0) 20 1234 5678"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-gold-400" /> Physical Address
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="input-dark"
                    placeholder="e.g. London, United Kingdom"
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Social Links */}
            <SettingsSection title="Social Links">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'twitter' as const, Icon: Twitter, label: 'Twitter / X URL' },
                  { name: 'instagram' as const, Icon: Instagram, label: 'Instagram URL' },
                  { name: 'linkedin' as const, Icon: Linkedin, label: 'LinkedIn URL' },
                  { name: 'facebook' as const, Icon: Facebook, label: 'Facebook URL' },
                ].map(({ name, Icon, label }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-gold-400" />
                    </div>
                    <input
                      type="url"
                      {...register(name)}
                      placeholder={label}
                      className="input-dark flex-1"
                    />
                  </div>
                ))}
              </div>
            </SettingsSection>

            {/* Theme Settings */}
            <SettingsSection title="Theme Settings (Branding)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Primary Accent (Gold)</label>
                  <div className="flex items-center gap-3 p-1.5 rounded-xl bg-obsidian-900/60 border border-obsidian-750">
                    <input
                      type="color"
                      {...register('themePrimaryColor')}
                      className="w-10 h-10 rounded-lg border border-obsidian-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      {...register('themePrimaryColor')}
                      className="bg-transparent text-sm text-obsidian-200 outline-none border-none flex-1 focus:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Background Fill (Black)</label>
                  <div className="flex items-center gap-3 p-1.5 rounded-xl bg-obsidian-900/60 border border-obsidian-750">
                    <input
                      type="color"
                      {...register('themeBgColor')}
                      className="w-10 h-10 rounded-lg border border-obsidian-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      {...register('themeBgColor')}
                      className="bg-transparent text-sm text-obsidian-200 outline-none border-none flex-1 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Submit Toolbar */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-obsidian-850/40 border border-obsidian-750 backdrop-blur-sm">
              <p className="text-xs text-obsidian-400 font-medium">
                {isDirty ? 'Unsaved settings changes' : 'Settings are up to date'}
              </p>
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {settingsSaved && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-green-400 font-semibold"
                    >
                      ✓ Settings saved successfully
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  className="gold-btn flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                >
                  <Save size={14} /> Save Configuration
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar panels: Logo Upload & Change Password */}
        <div className="space-y-6">
          {/* Logo Upload Panel */}
          <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-obsidian-100 text-sm pb-3 border-b border-obsidian-750">Logo Upload</h3>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".jpg,.jpeg,.png,.svg,.webp,.gif"
                className="hidden"
              />
              
              {logo ? (
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gold-500/20 rounded-xl bg-obsidian-900/60 space-y-3">
                  <div className="max-h-24 max-w-full overflow-hidden p-2 rounded-lg bg-obsidian-950 flex items-center justify-center border border-obsidian-800 shadow-inner">
                    <img src={logo} alt="Company Logo" className="max-h-20 w-auto object-contain" />
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex-1 px-3 py-2 bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-obsidian-600 rounded-xl text-[11px] font-bold text-obsidian-200 transition-colors"
                    >
                      Replace Logo
                    </button>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl text-[11px] font-bold text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-obsidian-700 hover:border-gold-500/40 rounded-xl bg-obsidian-900/40 cursor-pointer transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-obsidian-800 border border-obsidian-750 group-hover:border-gold-500/30 flex items-center justify-center text-obsidian-400 group-hover:text-gold-400 transition-colors shadow-inner">
                    <Upload size={16} />
                  </div>
                  <p className="text-xs font-semibold text-obsidian-300 mt-3 group-hover:text-obsidian-100 transition-colors">Upload site logo</p>
                  <p className="text-[10px] text-obsidian-500 text-center mt-1.5 leading-normal">
                    Drag and drop or click to browse.<br />
                    JPG, PNG, SVG or WEBP (Max 2 MB)
                  </p>
                </div>
              )}

              {logoError && (
                <p className="text-[11px] font-semibold text-red-400 text-center bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  {logoError}
                </p>
              )}
            </div>
          </div>

          {/* Change Password Panel */}
          <div className="bg-obsidian-800/40 border border-obsidian-700/50 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-obsidian-100 text-sm pb-3 border-b border-obsidian-750 flex items-center gap-1.5">
              <Lock size={15} className="text-gold-400" /> Security
            </h3>
            
            <form onSubmit={handleSubmitPass(onSubmitPassword)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    {...registerPass('currentPassword', { required: 'Required' })}
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
                    {...registerPass('newPassword', {
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

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-obsidian-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...registerPass('confirmPassword', {
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

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <AnimatePresence>
                  {passwordSaved && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] text-green-400 font-semibold"
                    >
                      ✓ Password changed
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  type="submit"
                  className="px-4 py-2 border border-obsidian-700 hover:border-obsidian-600 bg-obsidian-900 hover:bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 rounded-xl text-xs font-bold transition-all duration-200 ml-auto"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
