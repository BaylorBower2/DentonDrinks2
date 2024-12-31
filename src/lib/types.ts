export interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  venue_id: string;
}

export interface ReviewWithVenue extends Review {
  venues: {
    name: string;
    type: string;
  };
}

export interface ReviewInput {
  venue_id: string;
  rating: number;
  comment: string;
  image?: File;
}