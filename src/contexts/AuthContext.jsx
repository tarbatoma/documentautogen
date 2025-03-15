import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        setUser(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthError = (error) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email sau parolă incorectă';
      case 'User already registered':
        return 'Există deja un cont cu acest email';
      case 'Password is too short':
        return 'Parola trebuie să aibă minim 6 caractere';
      case 'Email not confirmed':
        return 'Te rugăm să confirmi adresa de email';
      case 'Invalid email':
        return 'Adresa de email nu este validă';
      default:
        return error.message || 'A apărut o eroare. Te rugăm să încerci din nou.';
    }
  };

  const signUp = async (email, password, name) => {
    try {
      if (!email || !password || !name) {
        throw new Error('Te rugăm să completezi toate câmpurile');
      }

      if (password.length < 6) {
        throw new Error('Parola trebuie să aibă minim 6 caractere');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            plan: 'free',
            features: {
              automations: false,
              custom_branding: false,
              priority_support: false,
              unlimited_documents: false
            },
            limits: {
              documents_per_month: 3,
              storage_gb: 1
            }
          },
        },
      });

      if (error) throw error;

      toast.success('Cont creat cu succes! Te poți autentifica acum.');
      navigate('/login');
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Te rugăm să completezi toate câmpurile');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Autentificare reușită!');
      navigate('/dashboard');
      return { data, error: null };
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Te-ai deconectat cu succes!');
      navigate('/');
    } catch (error) {
      toast.error('Eroare la deconectare');
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!email) {
        throw new Error('Te rugăm să introduci adresa de email');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email-ul pentru resetarea parolei a fost trimis!');
      return { error: null };
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      if (!newPassword) {
        throw new Error('Te rugăm să introduci noua parolă');
      }

      if (newPassword.length < 6) {
        throw new Error('Parola trebuie să aibă minim 6 caractere');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Parola a fost actualizată cu succes!');
      return { error: null };
    } catch (error) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      return { error };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};