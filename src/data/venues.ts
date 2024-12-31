export interface Venue {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  type: 'bar' | 'brewery';
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  venueId: string;
  rating: number;
  comment: string;
  date: string;
}

export const venues: Venue[] = [
  {
    id: 'oak-st-drafthouse',
    name: "Oak St. Drafthouse",
    description: "Historic home turned craft beer paradise with an amazing patio",
    image: "/images/oak-st.jpg",
    address: "308 E Oak St, Denton, TX 76201",
    type: "bar",
    rating: 4.5,
    reviews: []
  },
  {
    id: 'denton-county-brewing',
    name: "Denton County Brewing Company",
    description: "Local brewery with rotating taps and great atmosphere",
    image: "/images/dcbc.jpg",
    address: "200 E McKinney St, Denton, TX 76201",
    type: "brewery",
    rating: 4.8,
    reviews: []
  },
  {
    id: 'east-side',
    name: "East Side",
    description: "Denton's favorite social hub with a massive outdoor area",
    image: "/images/east-side.jpg",
    address: "117 E Oak St, Denton, TX 76201",
    type: "bar",
    rating: 4.7,
    reviews: []
  }
];