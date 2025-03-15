import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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