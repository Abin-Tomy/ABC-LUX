/* =============================================================
   Contact.tsx — Admission/Contact Section
   =============================================================
   Purpose   : Renders the contact form and business information section.
   Used by   : Home page index.tsx
   Depends on: react, useMagnetic, TitleReveal
   Notes     : Form is fully integrated with a Vercel Serverless Function backend and Resend.
   ============================================================= */

import { useState } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import TitleReveal from "../ui/TitleReveal";

/**
 * MessageDialog
 * A custom modal dialog to show success/error messages after form submission.
 */
function MessageDialog({
  isOpen,
  type,
  title,
  message,
  onClose,
}: {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-2xl bg-obsidian border border-white/10 p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
          >
            {type === "success" ? (
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h3 className="font-serif text-3xl text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{message}</p>
          <button
            onClick={onClose}
            className="lux-eyebrow w-full rounded-full border border-foreground/40 px-8 py-4 text-foreground transition-colors hover:border-ember hover:bg-ember hover:text-obsidian"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Field
 * A reusable, styled form field component supporting input, textarea, and select.
 */
function Field({
  label,
  name,
  type = "text",
  as = "input",
  options,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}) {
  return (
    <label className="group relative block py-4">
      <span className="lux-eyebrow block text-muted-foreground transition-colors group-focus-within:text-ember">
        {label} {required && <span className="text-ember ml-1">*</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          rows={2}
          className="mt-2 w-full resize-none border-0 bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none md:text-3xl"
          placeholder="—"
        />
      ) : as === "select" ? (
        <select
          name={name}
          required={required}
          className="mt-2 w-full appearance-none border-0 bg-transparent font-serif text-2xl text-foreground focus:outline-none md:text-3xl"
        >
          {options?.map((o) => (
            <option key={o} value={o} className="bg-obsidian text-foreground">
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-2 w-full border-0 bg-transparent font-serif text-2xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none md:text-3xl"
          placeholder="—"
        />
      )}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-white/15 transition-transform duration-500"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-700 group-focus-within:scale-x-100"
      />
    </label>
  );
}

/**
 * Admission
 * The main contact section providing company details and a contact form.
 */
export function Admission() {
  const submitRef = useMagnetic<HTMLButtonElement>(0.3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse backend response:", responseText);
        throw new Error("Backend returned invalid format.");
      }

      if (response.ok) {
        setDialog({
          isOpen: true,
          type: "success",
          title: "Message Sent Successfully",
          message:
            result.message ||
            "Thank you for reaching out. We have received your message and will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset(); // Clear the form
      } else {
        setDialog({
          isOpen: true,
          type: "error",
          title: "Submission Failed",
          message: result.error || "Please make sure all fields are correctly filled.",
        });
      }
    } catch (error: any) {
      console.error("Contact Form Error:", error);
      setDialog({
        isOpen: true,
        type: "error",
        title: "Connection Error",
        message: `Could not connect to the server: ${error.message}. Please check your internet connection and try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MessageDialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      <section id="contact" className="relative w-full bg-obsidian py-[18vh]">
        {/* Star divider */}
        <div
          className="absolute top-0 left-1/2 z-50 w-24 h-24 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "#D3C8B6" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M50,0c0,27.6,22.4,50,50,50-27.6,0-50,22.4-50,50,0-27.6-22.4-50-50-50,27.6,0,50-22.4,50-50Z" />
          </svg>
        </div>

        <div className="mx-auto max-w-[1400px] px-8">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "3rem",
              padding: "0.375rem 1rem",
              borderRadius: "9999px",
              border: "0.5px solid rgba(201,169,98,0.4)",
              background: "rgba(201,169,98,0.07)",
              fontSize: "0.65rem",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C9A962",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#C9A962",
                display: "inline-block",
              }}
            />
            Contact
          </span>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="font-serif text-[12vw] leading-[0.92] tracking-[-0.03em] md:text-[6vw]">
                <TitleReveal text="Feel Free To" className="mr-[0.25em]" waitForPreloader={false} />
                <TitleReveal
                  text="Keep"
                  className="mr-[0.35em] whitespace-nowrap"
                  waitForPreloader={false}
                />
                <TitleReveal
                  text="In Touch With Us"
                  className="font-light italic text-ember"
                  waitForPreloader={false}
                />
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Find the perfect lighting solutions tailored to your needs. Get in touch with us for
                expert advice and premium products.
              </p>
              <div className="mt-12 space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-ember mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <div className="font-serif text-lg text-foreground">
                    Shop No. 5, Zone 43, Street, 340 Salwa Road, Doha
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-ember" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-4.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <div className="font-serif text-lg text-foreground">8:00 AM To 10:00 PM</div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-ember" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <div className="font-serif text-lg text-foreground">info@abclux.qa</div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-ember" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <div className="font-serif text-lg text-foreground">+974 51163300</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-y border-white/10 pb-12">
              <Field label="Your Name" name="name" required />
              <Field label="Your Email" name="email" type="email" required />
              <Field label="Your Phone" name="phone" type="tel" required />
              <Field label="Subject" name="subject" required />
              <Field label="Message" name="message" as="textarea" required />

              <div className="flex items-center justify-between pt-8">
                <p className="lux-eyebrow max-w-xs text-muted-foreground">
                  We will get back to you as soon as possible.
                </p>
                <button
                  ref={submitRef}
                  type="submit"
                  data-cursor={isSubmitting ? "WAIT" : "SEND"}
                  disabled={isSubmitting}
                  className="lux-eyebrow rounded-full border border-foreground/40 px-8 py-4 text-foreground transition-colors hover:border-ember hover:bg-ember hover:text-obsidian disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
