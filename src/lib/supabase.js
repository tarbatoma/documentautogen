import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to initialize or get user settings
export const initializeUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        email_notifications: true,
        limit_reminder: true
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing user settings:', error);
    return { data: null, error };
  }
};

// Helper function to handle branding updates
export const updateBranding = async (userId, data) => {
  try {
    const { error } = await supabase
      .from('branding')
      .upsert(
        { 
          user_id: userId,
          ...data 
        },
        { 
          onConflict: 'user_id',
          returning: 'minimal' 
        }
      );

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating branding:', error);
    return { error };
  }
};

// Helper function to upload logo
export const uploadLogo = async (userId, file) => {
  try {
    // First check if there's an existing logo
    const { data: existingBranding, error: fetchError } = await supabase
      .from('branding')
      .select('logo_url')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // If there's an existing logo, delete it
    if (existingBranding?.logo_url) {
      const oldPath = existingBranding.logo_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('logos')
          .remove([oldPath]);
      }
    }

    // Upload new file
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName);

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return { error };
  }
};

// Helper function to generate document file path
export const generateDocumentPath = (userId, documentId) => {
  return `${userId}/${documentId}.pdf`;
};

// Helper function to check document status
export const checkDocumentStatus = async (documentId) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('status')
      .eq('id', documentId)
      .single();

    if (error) throw error;
    return data?.status;
  } catch (error) {
    console.error('Error checking document status:', error);
    return null;
  }
};

// Helper function to update document status
export const updateDocumentStatus = async (documentId, status) => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ status })
      .eq('id', documentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating document status:', error);
    return false;
  }
};