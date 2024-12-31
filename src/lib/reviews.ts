import { supabase } from './supabase';
import type { ReviewWithVenue } from './types';

export async function createReview({ venue_id, rating, comment, image }: ReviewInput) {
  try {
    // Validate inputs
    if (!venue_id) throw new Error('Venue ID is required');
    if (!rating || rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
    if (!comment || comment.trim().length < 10) throw new Error('Comment must be at least 10 characters');

    let image_url: string | null = null;

    if (image && image.size > 0) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('review-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('review-images')
        .getPublicUrl(fileName);
      
      image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        venue_id,
        rating,
        comment,
        image_url
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}