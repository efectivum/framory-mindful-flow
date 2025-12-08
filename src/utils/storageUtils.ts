import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a voice recording to Supabase Storage
 */
export const uploadVoiceRecording = async (
  audioBlob: Blob,
  userId: string
): Promise<{ path: string; url: string } | null> => {
  const fileName = `${userId}/${Date.now()}.webm`;
  
  const { data, error } = await supabase.storage
    .from('voice-recordings')
    .upload(fileName, audioBlob, {
      contentType: 'audio/webm',
      cacheControl: '3600',
    });

  if (error) {
    console.error('Voice recording upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('voice-recordings')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
};

/**
 * Upload a journal attachment (image/PDF) to Supabase Storage
 */
export const uploadJournalAttachment = async (
  file: File,
  userId: string
): Promise<{ path: string; url: string } | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('journal-attachments')
    .upload(fileName, file, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) {
    console.error('Attachment upload error:', error);
    return null;
  }

  // Get signed URL for private bucket
  const { data: urlData, error: urlError } = await supabase.storage
    .from('journal-attachments')
    .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

  if (urlError) {
    console.error('Signed URL error:', urlError);
    return null;
  }

  return {
    path: data.path,
    url: urlData.signedUrl,
  };
};

/**
 * Delete a file from storage
 */
export const deleteStorageFile = async (
  bucket: 'voice-recordings' | 'journal-attachments',
  path: string
): Promise<boolean> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Delete file error:', error);
    return false;
  }

  return true;
};
