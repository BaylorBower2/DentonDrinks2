import { supabase } from '../supabase/config';
import { withRetry } from '../supabase/retry';
import { uploadReviewImage } from '../images/storage';
import type { ReviewInput } from '../types';
import { SupabaseError } from '../supabase/error-handler';

export async function createReview(reviewData: ReviewInput) {
  try {
    let image_url: string | null = null;

    if (reviewData.image) {
      // Upload image and get URL
      const { url } = await uploadReviewImage(reviewData.image, reviewData.venue_id);
      image_url = url;
    }

    // Create review with retry logic
    const { data, error } = await withRetry(
      async () => supabase
        .from('reviews')
        .insert([{
          venue_id: reviewData.venue_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          image_url
        }])
        .select()
        .single()
    );

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createReview:', error);
    throw new SupabaseError(
      error instanceof Error ? error.message : 'Failed to create review',
      error
    );
  }
}

export async function getLatestReviews(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;

    const { data, error, count } = await withRetry(
      async () => supabase
        .from('reviews')
        .select(`
          *,
          venues (
            name,
            type
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    );

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    return {
      reviews: data || [],
      hasMore: count ? offset + limit < count : false
    };
  } catch (error) {
    console.error('Error in getLatestReviews:', error);
    throw new SupabaseError(
      error instanceof Error ? error.message : 'Failed to fetch reviews',
      error
    );
  }
}