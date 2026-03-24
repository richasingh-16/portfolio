import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { z } from 'zod';
import xss from 'xss';

// Configuration for Rate Limiter: 3 requests per hour per IP
const rateLimiter = new RateLimiterMemory({
  points: 3, 
  duration: 3600, 
});

// Zod Schema for input validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  
  try {
    // 1. Rate Limiting
    try {
      await rateLimiter.consume(ip);
    } catch {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Input
    const body = await request.json();
    const validatedData = contactSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      );
    }


    const { name, email, subject, message } = validatedData.data;

    // 3. Sanitize inputs to prevent XSS
    const cleanName = xss(name);
    const cleanEmail = xss(email);
    const cleanSubject = xss(subject || 'No Subject');
    const cleanMessage = xss(message);

    // 4. Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: cleanEmail,
      subject: `Portfolio Contact from ${cleanName}: ${cleanSubject}`,
      text: `
Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

