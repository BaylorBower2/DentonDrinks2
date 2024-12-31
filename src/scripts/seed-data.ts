import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please connect to Supabase first.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  // Insert venues
  const { data: venues, error: venuesError } = await supabase
    .from('venues')
    .insert([
      {
        name: "Oak St. Drafthouse",
        description: "Historic home turned craft beer paradise with an amazing patio",
        image_url: "/images/oak-st.jpg",
        address: "308 E Oak St, Denton, TX 76201",
        type: "bar"
      },
      {
        name: "Denton County Brewing Company",
        description: "Local brewery with rotating taps and great atmosphere",
        image_url: "/images/dcbc.jpg",
        address: "200 E McKinney St, Denton, TX 76201",
        type: "brewery"
      },
      {
        name: "East Side",
        description: "Denton's favorite social hub with a massive outdoor area",
        image_url: "/images/east-side.jpg",
        address: "117 E Oak St, Denton, TX 76201",
        type: "bar"
      }
    ])
    .select();

  if (venuesError) {
    console.error('Error inserting venues:', venuesError);
    return;
  }

  console.log('Venues inserted:', venues);

  // Insert reviews for each venue
  for (const venue of venues) {
    const { error: reviewsError } = await supabase
      .from('reviews')
      .insert([
        {
          venue_id: venue.id,
          rating: 5,
          comment: `Amazing experience at ${venue.name}! The atmosphere was perfect and the service was outstanding.`,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          venue_id: venue.id,
          rating: 4,
          comment: `Really enjoyed my visit to ${venue.name}. Great selection and friendly staff.`,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

    if (reviewsError) {
      console.error(`Error inserting reviews for ${venue.name}:`, reviewsError);
    }
  }

  console.log('Seed data inserted successfully!');
}

seedData();