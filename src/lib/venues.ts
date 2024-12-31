import { supabase, retryOperation } from './supabaseClient';
import { getCached, setCache } from './cache';
import { SUPABASE_CONFIG } from './config';
import type { Database } from './database.types';

type Venue = Database['public']['Tables']['venues']['Row'] & {
  reviews: Array<{ rating: number }>;
  rating: number;
  image: string;
};

const CACHE_KEYS = {
  ALL_VENUES: 'all_venues',
  VENUE_BY_TYPE: (type: string) => `venues_${type}`,
  VENUE_BY_ID: (id: string) => `venue_${id}`,
  FEATURED_VENUES: 'featured_venues',
  TOP_RATED_VENUES: 'top_rated_venues'
};

export async function getVenues(type?: 'bar' | 'brewery'): Promise<Venue[]> {
  const cacheKey = type ? CACHE_KEYS.VENUE_BY_TYPE(type) : CACHE_KEYS.ALL_VENUES;
  const cached = getCached<Venue[]>(cacheKey, SUPABASE_CONFIG.CACHE_DURATION);
  if (cached) return cached;

  try {
    const { data: venues, error } = await retryOperation(() => 
      supabase
        .from('venues')
        .select(`
          *,
          reviews (
            rating
          )
        `)
        .eq(type ? 'type' : 'id', type || '')
    );

    if (error) throw error;
    if (!venues) return [];

    const processedVenues = venues.map(venue => ({
      ...venue,
      rating: calculateAverageRating(venue.reviews),
      image: venue.image_url
    }));

    setCache(cacheKey, processedVenues);
    return processedVenues;
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const cacheKey = CACHE_KEYS.VENUE_BY_ID(id);
  const cached = getCached<Venue>(cacheKey, SUPABASE_CONFIG.CACHE_DURATION);
  if (cached) return cached;

  try {
    const { data: venue, error } = await retryOperation(() =>
      supabase
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
        .single()
    );

    if (error) throw error;
    if (!venue) return null;

    const processedVenue = {
      ...venue,
      rating: calculateAverageRating(venue.reviews),
      image: venue.image_url
    };

    setCache(cacheKey, processedVenue);
    return processedVenue;
  } catch (error) {
    console.error('Error fetching venue:', error);
    return null;
  }
}

export async function getFeaturedVenues(limit = 3): Promise<Venue[]> {
  const cacheKey = CACHE_KEYS.FEATURED_VENUES;
  const cached = getCached<Venue[]>(cacheKey, SUPABASE_CONFIG.CACHE_DURATION);
  if (cached) return cached;

  try {
    const { data: venues, error } = await retryOperation(() =>
      supabase
        .from('venues')
        .select(`
          *,
          reviews (
            rating
          )
        `)
        .limit(limit)
    );

    if (error) throw error;
    if (!venues) return [];

    const processedVenues = venues.map(venue => ({
      ...venue,
      rating: calculateAverageRating(venue.reviews),
      image: venue.image_url
    }));

    setCache(cacheKey, processedVenues);
    return processedVenues;
  } catch (error) {
    console.error('Error fetching featured venues:', error);
    return [];
  }
}

export async function getTopRatedVenues(limit = 3): Promise<Venue[]> {
  const cacheKey = CACHE_KEYS.TOP_RATED_VENUES;
  const cached = getCached<Venue[]>(cacheKey, SUPABASE_CONFIG.CACHE_DURATION);
  if (cached) return cached;

  try {
    const venues = await getVenues();
    const topVenues = venues
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    setCache(cacheKey, topVenues);
    return topVenues;
  } catch (error) {
    console.error('Error fetching top rated venues:', error);
    return [];
  }
}

function calculateAverageRating(reviews: { rating: number }[] | null): number {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}