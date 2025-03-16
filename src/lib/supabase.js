import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-logo.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    // Update branding record
    const { error: brandingError } = await updateBranding(userId, {
      logo_url: publicUrl
    });

    if (brandingError) throw brandingError;

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return { error };
  }
};