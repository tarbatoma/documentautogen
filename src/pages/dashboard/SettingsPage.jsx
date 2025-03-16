import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, CreditCard, Upload, Palette, Bell, 
  Check, X, ChevronRight, Crown
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, initializeUserSettings, uploadLogo, updateBranding } from '../../lib/supabase';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [brandingData, setBrandingData] = useState({
    logo: null,
    primaryColor: '#0284c7',
    secondaryColor: '#4f46e5'
  });

  const [notifications, setNotifications] = useState({
    emailOnSend: true,
    limitReminder: true
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const isPro = user?.user_metadata?.plan === 'pro';
  const isBusiness = user?.user_metadata?.plan === 'business';

  useEffect(() => {
    if (user) {
      fetchBrandingSettings();
      initializeUserSettings(user.id).then(({ data, error }) => {
        if (error) {
          console.error('Error initializing user settings:', error);
          toast.error('Eroare la inițializarea setărilor');
          return;
        }
        if (data) {
          setNotifications({
            emailOnSend: data.email_notifications,
            limitReminder: data.limit_reminder
          });
        }
      });
    }
  }, [user]);

  const fetchBrandingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('branding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setBrandingData({
          logo: data.logo_url,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color
        });
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      toast.error('Eroare la încărcarea setărilor de branding');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          throw new Error('Parolele noi nu coincid');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: profileData.newPassword
        });

        if (passwordError) throw passwordError;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: profileData.email,
        data: { full_name: profileData.fullName }
      });

      if (updateError) throw updateError;

      toast.success('Profilul a fost actualizat cu succes!');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandingUpdate = async (e) => {
    e.preventDefault();
    if (!isBusiness) return;

    setLoading(true);
    try {
      let logoUrl = brandingData.logo;

      if (selectedFile) {
        const { publicUrl, error: uploadError } = await uploadLogo(user.id, selectedFile);
        if (uploadError) throw uploadError;
        logoUrl = publicUrl;
      }

      const { error } = await updateBranding(user.id, {
        logo_url: logoUrl,
        primary_color: brandingData.primaryColor,
        secondary_color: brandingData.secondaryColor
      });

      if (error) throw error;

      toast.success('Setările de branding au fost actualizate!');
      setSelectedFile(null);
      fetchBrandingSettings(); // Refresh branding data
    } catch (error) {
      console.error('Error updating branding:', error);
      toast.error('Eroare la actualizarea setărilor de branding');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (newSettings) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_notifications: newSettings.emailOnSend,
          limit_reminder: newSettings.limitReminder
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setNotifications(newSettings);
      toast.success('Preferințele de notificări au fost actualizate!');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Eroare la actualizarea preferințelor de notificări');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profilul Meu</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume complet
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parolă nouă
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Lasă gol pentru a păstra parola actuală"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmă parola nouă
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Lasă gol pentru a păstra parola actuală"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Se salvează...' : 'Salvează modificările'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Subscription Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Abonament</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Plan actual: {isBusiness ? 'Business' : isPro ? 'Pro' : 'Free'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isBusiness ? 'Documente nelimitate' : isPro ? '100 documente/lună' : '3 documente/lună'}
                  </p>
                </div>
              </div>
              {!isBusiness && (
                <button className="btn-primary flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span>Upgrade la {isPro ? 'Business' : 'Pro'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Branding Section (Business Only) */}
        {isBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personalizare Brand</h2>
              <form onSubmit={handleBrandingUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Companie
                  </label>
                  <div className="flex items-center gap-4">
                    {brandingData.logo && (
                      <img
                        src={brandingData.logo}
                        alt="Company Logo"
                        className="w-16 h-16 object-contain"
                      />
                    )}
                    <div className="flex-1">
                      <label className="block">
                        <span className="sr-only">Choose file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Culoare Principală
                    </label>
                    <input
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                      className="h-10 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Culoare Secundară
                    </label>
                    <input
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                      className="h-10 w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Se salvează...' : 'Salvează setările de brand'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notificări</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notificări email documente</p>
                    <p className="text-sm text-gray-600">Primește email când documentul a fost trimis</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newSettings = {
                      ...notifications,
                      emailOnSend: !notifications.emailOnSend
                    };
                    handleNotificationUpdate(newSettings);
                  }}
                  className={`p-2 rounded-lg ${
                    notifications.emailOnSend
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {notifications.emailOnSend ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reminder limită documente</p>
                    <p className="text-sm text-gray-600">Primește notificare când te apropii de limită</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newSettings = {
                      ...notifications,
                      limitReminder: !notifications.limitReminder
                    };
                    handleNotificationUpdate(newSettings);
                  }}
                  className={`p-2 rounded-lg ${
                    notifications.limitReminder
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {notifications.limitReminder ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;