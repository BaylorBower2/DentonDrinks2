import { supabase } from '../supabase/config';
import type { Database } from '../database.types';
import { SupabaseError } from '../supabase/error-handler';

export type Venue = Database['public']['Tables']['venues']['Row'] & {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    image_url: string | null;
    created_at: string;
  }>;
  rating: number;
  image: string;
};

function calculateAverageRating(reviews: { rating: number }[] | null): number {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

export async function getVenues(type?: 'bar' | 'brewery'): Promise<Venue[]> {
  try {
    console.log('Starting venue fetch, type:', type);
    
    const query = supabase
      .from('venues')
      .select(`
        *,
        reviews (
          rating
        )
      `);

    if (type) {
      query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new SupabaseError('Failed to fetch venues', error);
    }

    if (!data) return [];

    return data.map(venue => ({
      ...venue,
      rating: calculateAverageRating(venue.reviews),
      image: venue.image_url,
      reviews: venue.reviews || []
    }));
  } catch (error) {
    console.error('Error in getVenues:', error);
    throw new SupabaseError(
      'Failed to load venues. Please check your connection and try again.',
      error
    );
  }
}

export async function getVenueById(id: string): Promise<Venue | null> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        reviews (
          id,
          rating,
          comment,
          image_url,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      throw new SupabaseError('Failed to fetch venue', error);
    }

    if (!data) return null;

    return {
      ...data,
      rating: calculateAverageRating(data.reviews),
      image: data.image_url,
      reviews: data.reviews || []
    };
  } catch (error) {
    console.error('Error in getVenueById:', error);
    throw new SupabaseError(
      'Failed to load venue details. Please check your connection and try again.',
      error
    );
  }
}