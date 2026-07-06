import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";
import * as emailValidator from "email-validator";
import rateLimit from "express-rate-limit";

// Load environment variables from .env.local first, then fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
); // Allow specific frontend requests
app.use(express.json()); // Parse JSON payloads

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Rate limiter for contact endpoint to prevent abuse and quota exhaustion
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: { error: "Too many contact requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form endpoint
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 2. Validate email format
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    // 3. Sanitize inputs to prevent XSS (Cross-Site Scripting)
    const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
    const sanitizedName = sanitizeHtml(name, sanitizeOptions);
    const sanitizedPhone = sanitizeHtml(phone, sanitizeOptions);
    const sanitizedSubject = sanitizeHtml(subject, sanitizeOptions);
    const sanitizedMessage = sanitizeHtml(message, sanitizeOptions);

    // 4. Send the email using Resend
    // Note: The 'from' address must be verified in your Resend dashboard.
    // 'onboarding@resend.dev' is a testing address provided by Resend.
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${sanitizedName} <onboarding@resend.dev>`, // Use verified domain from env
      to: [process.env.EMAIL_TO || "sales@abclux.qa"], // Replace with official mail address
      replyTo: email,
      subject: `New Contact Form Submission: ${sanitizedSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitizedName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitizedPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${sanitizedSubject}</td>
            </tr>
          </table>
          <h3 style="margin-top: 30px; color: #333;">Message:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${sanitizedMessage}</div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to send your message. Please try again later." });
    }

    console.log("Email sent successfully, Resend ID:", data?.id);
    return res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
