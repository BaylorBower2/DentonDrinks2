import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const venues = [
  {
    name: "Oak St. Drafthouse",
    description: "Historic home turned craft beer paradise with an amazing patio. Features over 50 rotating taps and a beautiful outdoor space.",
    image_url: "/images/oak-st.jpg",
    address: "308 E Oak St, Denton, TX 76201",
    type: "bar"
  },
  {
    name: "Denton County Brewing Company",
    description: "Local brewery with rotating taps and great atmosphere. Known for their innovative craft beers and friendly staff.",
    image_url: "/images/dcbc.jpg",
    address: "200 E McKinney St, Denton, TX 76201",
    type: "brewery"
  },
  {
    name: "East Side",
    description: "Denton's favorite social hub with a massive outdoor area. Perfect for groups and weekend hangouts.",
    image_url: "/images/east-side.jpg",
    address: "117 E Oak St, Denton, TX 76201",
    type: "bar"
  },
  {
    name: "Harvest House",
    description: "Vibrant bar with live music and great outdoor space. Features craft cocktails and local beers.",
    image_url: "/images/harvest-house.jpg",
    address: "331 E Hickory St, Denton, TX 76201",
    type: "bar"
  },
  {
    name: "Armadillo Ale Works",
    description: "Craft brewery with unique flavors and a welcoming taproom. Known for experimental brews.",
    image_url: "/images/armadillo.jpg",
    address: "221 S Bell Ave, Denton, TX 76201",
    type: "brewery"
  }
];

const reviewTemplates = [
  {
    rating: 5,
    comments: [
      "Absolutely love this place! The atmosphere is perfect and the staff is incredibly friendly.",
      "Best spot in Denton! Great selection and amazing vibes.",
      "Can't recommend this place enough. Always have a great time here."
    ]
  },
  {
    rating: 4,
    comments: [
      "Really solid spot. Good drinks and nice atmosphere.",
      "Great place to hang out with friends. Prices are reasonable.",
      "Consistently good experience. Would definitely come back."
    ]
  },
  {
    rating: 3,
    comments: [
      "Decent place. Could improve on service but drinks are good.",
      "Average experience. Nothing spectacular but nothing bad either.",
      "OK spot for casual drinks. Gets busy on weekends."
    ]
  }
];

async function seedTestData() {
  try {
    // Insert venues
    const { data: insertedVenues, error: venuesError } = await supabase
      .from('venues')
      .insert(venues)
      .select();

    if (venuesError) {
      throw venuesError;
    }

    console.log('✓ Venues inserted successfully');

    // Add reviews for each venue
    for (const venue of insertedVenues) {
      const reviews = [];
      
      // Generate 3-5 reviews per venue
      const numReviews = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numReviews; i++) {
        const templateIndex = Math.floor(Math.random() * reviewTemplates.length);
        const template = reviewTemplates[templateIndex];
        const commentIndex = Math.floor(Math.random() * template.comments.length);
        
        reviews.push({
          venue_id: venue.id,
          rating: template.rating,
          comment: template.comments[commentIndex],
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
        });
      }

      const { error: reviewsError } = await supabase
        .from('reviews')
        .insert(reviews);

      if (reviewsError) {
        console.error(`Error adding reviews for ${venue.name}:`, reviewsError);
        continue;
      }
    }

    console.log('✓ Reviews inserted successfully');
    console.log('Test data seeding completed!');

  } catch (error) {
    console.error('Error seeding test data:', error);
  }
}

seedTestData();