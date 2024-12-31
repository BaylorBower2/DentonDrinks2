import type { APIRoute } from 'astro';
import { z } from 'zod';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    // Validate input
    const validatedData = contactSchema.parse(data);

    // Check if Resend API key exists
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('Email service is not configured');
    }

    // Email content
    const emailContent = `
New Contact Form Submission:

Name: ${validatedData.name}
Email: ${validatedData.email}
Message:
${validatedData.message}
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
        subject: 'New Contact Form Submission - Denton Drinks',
        text: emailContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send message');
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Failed to send message. Please try again.' 
      }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};