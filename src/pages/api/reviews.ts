import type { APIRoute } from 'astro';
import { createReview } from '../../lib/reviews/review-service';
import type { ReviewInput } from '../../lib/types';
import { SupabaseError } from '../../lib/supabase/error-handler';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    
    const reviewInput: ReviewInput = {
      venue_id: data.get('venueId')?.toString() || '',
      rating: parseInt(data.get('rating')?.toString() || '0'),
      comment: data.get('comment')?.toString() || '',
      image: data.get('image') as File || undefined
    };

    // Validate inputs
    if (!reviewInput.venue_id) {
      throw new Error('Venue ID is required');
    }
    if (!reviewInput.rating || reviewInput.rating < 1 || reviewInput.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!reviewInput.comment || reviewInput.comment.trim().length < 10) {
      throw new Error('Comment must be at least 10 characters');
    }

    const review = await createReview(reviewInput);

    return new Response(
      JSON.stringify({ success: true, review }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing review:', error);
    const message = error instanceof Error ? error.message : 'Failed to create review';
    return new Response(
      JSON.stringify({ error: message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};