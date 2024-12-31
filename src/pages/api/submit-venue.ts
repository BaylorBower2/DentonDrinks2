import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createRedirectUrl } from '../../lib/utils/url';

// Validation schema
const venueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['bar', 'brewery'], 'Invalid venue type'),
  address: z.string().min(1, 'Address is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  submitterEmail: z.string().email('Invalid email address')
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      type: formData.get('type'),
      address: formData.get('address'),
      description: formData.get('description'),
      submitterEmail: formData.get('submitterEmail')
    };

    // Validate input
    const validatedData = venueSchema.parse(data);

    // Check if Resend API key exists
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Resend API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Email service is not configured. Your submission has been logged.' 
        }), 
        { status: 200 }
      );
    }

    // Email content
    const emailContent = `
New Venue Submission:

Name: ${validatedData.name}
Type: ${validatedData.type}
Address: ${validatedData.address}
Description: ${validatedData.description}
Submitted by: ${validatedData.submitterEmail}
`;

    // Send email using Resend's default domain
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Denton Drinks <onboarding@resend.dev>', // Using Resend's default domain
        to: 'dentondrinks@gmail.com',
        subject: 'New Venue Submission - Denton Drinks',
        text: emailContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email notification');
    }

    // Create absolute URL for redirect
    const redirectUrl = createRedirectUrl(request, '/?submitted=true');
    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error processing venue submission:', error);
    
    // Return user-friendly error message
    return new Response(
      JSON.stringify({ 
        error: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Failed to process venue submission. Please try again.' 
      }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};