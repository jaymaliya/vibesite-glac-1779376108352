"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Flavors", path: "/flavors" },
    { label: "Our Story", path: "/our-story" },
    { label: "Locations", path: "/locations" },
    { label: "Gifts", path: "/gifts" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#0F0B06",
        borderTop: "1px solid rgba(196,181,160,0.12)",
        paddingTop: "96px",
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "64px",
            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "36px",
                  letterSpacing: "-0.04em",
                  color: "#EDE0CF",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                Glac
              </span>
              <p
                style={{
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: "15px",
                  color: "#9B8B7E",
                  marginTop: "12px",
                  lineHeight: 1.6,
                  maxWidth: "260px",
                }}
              >
                Bold flavors, artfully frozen. Handcrafted small-batch ice
                creams made with love in India.
              </p>
            </div>

            {/* Trust signals */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D8659"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: "13px",
                    color: "#9B8B7E",
                  }}
                >
                  Made in India
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D8659"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: "13px",
                    color: "#9B8B7E",
                  }}
                >
                  Free shipping above ₹499
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D8659"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: "13px",
                    color: "#9B8B7E",
                  }}
                >
                  No artificial preservatives
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "32px",
              }}
            >
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Glac on Instagram"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(196,181,160,0.08)",
                  border: "1px solid rgba(196,181,160,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9B8B7E",
                  outline: "none",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#EDE0CF";
                  el.style.backgroundColor = "rgba(196,181,160,0.15)";
                  el.style.borderColor = "rgba(196,181,160,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#9B8B7E";
                  el.style.backgroundColor = "rgba(196,181,160,0.08)";
                  el.style.borderColor = "rgba(196,181,160,0.15)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Glac on Twitter"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(196,181,160,0.08)",
                  border: "1px solid rgba(196,181,160,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9B8B7E",
                  outline: "none",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#EDE0CF";
                  el.style.backgroundColor = "rgba(196,181,160,0.15)";
                  el.style.borderColor = "rgba(196,181,160,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#9B8B7E";
                  el.style.backgroundColor = "rgba(196,181,160,0.08)";
                  el.style.borderColor = "rgba(196,181,160,0.15)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Glac on WhatsApp"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(196,181,160,0.08)",
                  border: "1px solid rgba(196,181,160,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9B8B7E",
                  outline: "none",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#EDE0CF";
                  el.style.backgroundColor = "rgba(196,181,160,0.15)";
                  el.style.borderColor = "rgba(196,181,160,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "#9B8B7E";
                  el.style.backgroundColor = "rgba(196,181,160,0.08)";
                  el.style.borderColor = "rgba(196,181,160,0.15)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h3
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9B8B7E",
                marginBottom: "24px",
              }}
            >
              Explore
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.label} style={{ marginBottom: "12px" }}>
                  <button
                    onClick={() => router.push(link.path)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: "15px",
                      color: "#F5F0E8",
                      outline: "none",
                      transition:
                        "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#2D8659")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#F5F0E8")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.color = "#2D8659")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.color = "#F5F0E8")
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Policies */}
            <h3
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9B8B7E",
                marginTop: "40px",
                marginBottom: "24px",
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
                { label: "Refund Policy", path: "/refund" },
                { label: "Shipping Policy", path: "/shipping" },
              ].map((link) => (
                <li key={link.label} style={{ marginBottom: "12px" }}>
                  <button
                    onClick={() => router.push(link.path)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "#9B8B7E",
                      outline: "none",
                      transition:
                        "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F5F0E8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#9B8B7E")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.color = "#F5F0E8")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.color = "#9B8B7E")
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#9B8B7E",
                marginBottom: "24px",
              }}
            >
              Stay in the scoop
            </h3>
            <p
              style={{
                fontFamily: '"Nunito Sans", sans-serif',
                fontSize: "15px",
                color: "#F5F0E8",
                lineHeight: 1.6,
                marginBottom: "24px",
                maxWidth: "300px",
              }}
            >
              New flavors, seasonal drops, and exclusive offers — delivered to
              your inbox.
            </p>

            {subscribed ? (
              <div
                style={{
                  backgroundColor: "rgba(45,134,89,0.12)",
                  border: "1px solid rgba(45,134,89,0.35)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D8659"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: "15px",
                    color: "#2D8659",
                    fontWeight: 500,
                  }}
                >
                  You&apos;re on the list!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="your@email.com"
                      aria-label="Email address for newsletter"
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(196,181,160,0.08)",
                        border: emailError
                          ? "1px solid rgba(192,57,43,0.7)"
                          : "1px solid rgba(196,181,160,0.2)",
                        borderRadius: "12px",
                        padding: "14px 16px",
                        fontFamily: '"Nunito Sans", sans-serif',
                        fontSize: "15px",
                        color: "#F5F0E8",
                        outline: "none",
                        boxSizing: "border-box",
                        transition:
                          "border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2D8659";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(45,134,89,0.18)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = emailError
                          ? "rgba(192,57,43,0.7)"
                          : "rgba(196,181,160,0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {emailError && (
                    <p
                      id="email-error"
                      role="alert"
                      style={{
                        fontFamily: '"Nunito Sans", sans-serif',
                        fontSize: "13px",
                        color: "#c0392b",
                        margin: 0,
                      }}
                    >
                      {emailError}
                    </p>
                  )}
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2D8659",
                      color: "#F5F0E8",
                      border: "none",
                      borderRadius: "12px",
                      padding: "14px 24px",
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600,
                      fontSize: "15px",
                      cursor: "pointer",
                      outline: "none",
                      letterSpacing: "0.01em",
                      transition:
                        "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#256b47";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2D8659";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 0 2px #2D8659, 0 0 0 4px rgba(45,134,89,0.3)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}

            {/* Payment / trust badges */}
            <div style={{ marginTop: "32px" }}>
              <p
                style={{
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontSize: "12px",
                  color: "#9B8B7E",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Secure payments via
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "rgba(196,181,160,0.08)",
                  border: "1px solid rgba(196,181,160,0.15)",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9B8B7E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Nunito Sans", sans-serif',
                    fontSize: "13px",
                    color: "#9B8B7E",
                    fontWeight: 500,
                  }}
                >
                  Razorpay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(196,181,160,0.12)",
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: "13px",
              color: "#9B8B7E",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Glac. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: "13px",
              color: "#9B8B7E",
              margin: 0,
            }}
          >
            Bold flavors, artfully frozen. Crafted with care in India.
          </p>
        </div>
      </div>
    </footer>
  );
}