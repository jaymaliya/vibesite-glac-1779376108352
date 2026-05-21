"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items = [], clearCart } = useCart() ?? {};
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(form.pin)) {
      newErrors.pin = "Enter a valid 6-digit PIN code";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: "rzp_test_",
        amount: order.amount,
        currency: "INR",
        name: "Glac",
        description: "Handcrafted Ice Creams",
        order_id: order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#2D8659" },
        handler: () => {
          clearCart?.();
          router.push("/");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${errors[field] ? "#e53e3e" : "rgba(237,224,207,0.2)"}`,
    background: "rgba(237,224,207,0.06)",
    color: "var(--text)",
    fontSize: "1rem",
    fontFamily: "'Nunito Sans', sans-serif",
    lineHeight: 1.6,
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "8px",
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const errorStyle: React.CSSProperties = {
    color: "#fc8181",
    fontSize: "0.8rem",
    marginTop: "6px",
    fontFamily: "'Nunito Sans', sans-serif",
  };

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh",
    "Jammu & Kashmir","Ladakh","Puducherry",
  ];

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito Sans', sans-serif",
          gap: "32px",
          padding: "48px 24px",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "rgba(237,224,207,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "12px",
            }}
          >
            Your cart is empty
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7 }}>
            Looks like you haven't added any scoops yet.
          </p>
        </div>
        <button
          onClick={() => router.push("/shop")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(45,134,89,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(45,134,89,0.4)";
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          style={{
            padding: "16px 48px",
            borderRadius: "12px",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "'Nunito Sans', sans-serif",
            cursor: "pointer",
            letterSpacing: "0.02em",
            boxShadow: "0 10px 30px -10px rgba(45,134,89,0.4)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(15,11,6,0.95)" : "rgba(15,11,6,0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid rgba(237,224,207,0.1)" : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/")}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              transition: "opacity 0.2s ease",
              padding: 0,
            }}
          >
            Glac
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Secure Checkout
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", color: "var(--muted)" }}>
          <button
            onClick={() => router.push("/")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", padding: 0, transition: "color 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Home
          </button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <button
            onClick={() => router.push("/shop")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", padding: 0, transition: "color 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Shop
          </button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          <span style={{ color: "var(--text)" }}>Checkout</span>
        </div>
      </div>

      {/* HERO STRIP */}
      <div
        ref={addRevealRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 32px 0",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "'Nunito Sans', sans-serif",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Almost There
        </span>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--text)",
            marginBottom: "16px",
          }}
        >
          Complete your order
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px" }}>
          Handcrafted in small batches · Delivered fresh to your door.
        </p>
      </div>

      {/* TRUST BAR */}
      <div
        ref={addRevealRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            padding: "16px 24px",
            borderRadius: "12px",
            background: "rgba(196,181,160,0.06)",
            border: "1px solid rgba(237,224,207,0.08)",
          }}
        >
          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: "256-bit SSL Encrypted" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: "Free shipping over ₹500" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Made in India" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: "12,000+ happy customers" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {item.icon}
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "32px 32px 96px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 480px)",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* LEFT: FORM */}
        <div ref={addRevealRef}>
          {/* CONTACT SECTION */}
          <div
            style={{
              background: "rgba(196,181,160,0.05)",
              border: "1px solid rgba(237,224,207,0.1)",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>1</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Contact Information
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Arjun Sharma"
                  style={inputStyle("name")}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.name ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="arjun@email.com"
                  style={inputStyle("email")}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.email ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  style={inputStyle("phone")}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.phone ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* DELIVERY SECTION */}
          <div
            style={{
              background: "rgba(196,181,160,0.05)",
              border: "1px solid rgba(237,224,207,0.1)",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>2</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Delivery Address
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Street Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Flat 4B, Sunshine Apartments, MG Road"
                  rows={3}
                  style={{
                    ...inputStyle("address"),
                    resize: "vertical",
                    minHeight: "88px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.address ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.address && <p style={errorStyle}>{errors.address}</p>}
              </div>

              <div>
                <label style={labelStyle}>City *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  style={inputStyle("city")}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.city ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.city && <p style={errorStyle}>{errors.city}</p>}
              </div>

              <div>
                <label style={labelStyle}>State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  style={{
                    ...inputStyle("state"),
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239B8B7E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: "40px",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.state ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="" style={{ background: "#0F0B06", color: "var(--muted)" }}>Select State</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s} style={{ background: "#0F0B06", color: "var(--text)" }}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>

              <div>
                <label style={labelStyle}>PIN Code *</label>
                <input
                  name="pin"
                  value={form.pin}
                  onChange={handleChange}
                  placeholder="560001"
                  maxLength={6}
                  style={inputStyle("pin")}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,134,89,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.pin ? "#e53e3e" : "rgba(237,224,207,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
              </div>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div
            style={{
              background: "rgba(196,181,160,0.05)",
              border: "1px solid rgba(237,224,207,0.1)",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(45,134,89,0.2)",
                  border: "1.5px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "var(--accent)", fontSize: "0.875rem", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>3</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Payment
              </h2>
            </div>
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(45,134,89,0.08)",
                border: "1px solid rgba(45,134,89,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <div>
                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", margin: 0, fontFamily: "'Nunito Sans', sans-serif" }}>
                  Secure payment via Razorpay
                </p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "4px 0 0", fontFamily: "'Nunito Sans', sans-serif" }}>
                  UPI, Cards, Netbanking, Wallets — all accepted
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
              {["Visa", "MC", "UPI", "Gpay", "PhonePe"].map((p) => (
                <div
                  key={p}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(237,224,207,0.06)",
                    border: "1px solid rgba(237,224,207,0.12)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div
          ref={addRevealRef}
          style={{
            position: "sticky",
            top: "96px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(196,181,160,0.06)",
              border: "1px solid rgba(237,224,207,0.12)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* SUMMARY HEADER */}
            <div
              style={{
                padding: "28px 32px",
                borderBottom: "1px solid rgba(237,224,207,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                Order Summary
              </h3>
              <span
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* ITEMS LIST */}
            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "rgba(237,224,207,0.04)",
                    border: "1px solid rgba(237,224,207,0.06)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(237,224,207,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid rgba(237,224,207,0.1)",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "var(--text)",
                        margin: "0 0 4px",
                        fontFamily: "'Nunito Sans', sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        margin: "0 0 8px",
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                    >
                      Qty: {item.quantity}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        margin: 0,
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                    >
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      fontFamily: "'Nunito Sans', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹{item.price.toLocaleString("en-IN")} each
                  </div>
                </div>
              ))}
            </div>

            {/* PROMO CODE */}
            <div style={{ padding: "0 32px 24px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  placeholder="Promo code"
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(237,224,207,0.15)",
                    background: "rgba(237,224,207,0.04)",
                    color: "var(--text)",
                    fontSize: "0.875rem",
                    fontFamily: "'Nunito Sans', sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(237,224,207,0.15)")}
                />
                <button
                  style={{
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(45,134,89,0.4)",
                    background: "transparent",
                    color: "var(--accent)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    fontFamily: "'Nunito Sans', sans-serif",
                    cursor: "pointer",
                    transition: "background 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(45,134,89,0.12)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(45,134,89,0.4)";
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div
              style={{
                padding: "24px 32px",
                borderTop: "1px solid rgba(237,224,207,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", fontFamily: "'Nunito Sans', sans-serif" }}>Subtotal</span>
                <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Nunito Sans', sans-serif" }}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", fontFamily: "'Nunito Sans', sans-serif" }}>Shipping</span>
                {shipping === 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        background: "rgba(45,134,89,0.15)",
                        color: "var(--accent)",
                        borderRadius: "9999px",
                        padding: "2px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "'Nunito Sans', sans-serif",
                      }}
                    >
                      FREE
                    </span>
                  </div>
                ) : (
                  <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Nunito Sans', sans-serif" }}>
                    ₹{shipping.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {subtotal <= 500 && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "rgba(45,134,89,0.08)",
                    border: "1px solid rgba(45,134,89,0.15)",
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    fontFamily: "'Nunito Sans', sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  Add ₹{(500 - subtotal).toLocaleString("en-IN")} more to get <strong style={{ color: "var(--accent)" }}>free shipping</strong>!
                </div>
              )}
              <div
                style={{
                  borderTop: "1px solid rgba(237,224,207,0.08)",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "var(--text)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.375rem",
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: "0 32px 32px" }}>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 20px 50px -15px rgba(45,134,89,0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 12px 32px -10px rgba(45,134,89,0.45)";
                }}
                onMouseDown={(e) => !isProcessing && (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => !isProcessing && (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  width: "100%",
                  padding: "18px 32px",
                  borderRadius: "14px",
                  border: "none",
                  background: isProcessing ? "rgba(45,134,89,0.5)" : "var(--accent)",
                  color: "#fff",
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                  letterSpacing: "0.02em",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  boxShadow: "0 12px 32px -10px rgba(45,134,89,0.45)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), background 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {isProcessing ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Place Order · Pay ₹{total.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "16px",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Your information is encrypted and secure. By placing your order you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>

          {/* DELIVERY PROMISE CARD */}
          <div
            style={{
              background: "rgba(196,181,160,0.05)",
              border: "1px solid rgba(237,224,207,0.1)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
                title: "Express Delivery",
                desc: "2–4 working days across India",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                title: "Cold Chain Maintained",
                desc: "Premium insulated packaging",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
                title: "Quality Guaranteed",
                desc: "100% refund if not satisfied",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(45,134,89,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", margin: "0 0 2px", fontFamily: "'Nunito Sans', sans-serif" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0, fontFamily: "'Nunito Sans', sans-serif" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .order-summary-sticky {
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .checkout-form-card {
            padding: 24px !important;
          }
          .form-two-col {
            grid-template-columns: 1fr !important;
          }
        }
        *:focus-visible {
          outline: 2px solid #2D8659;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}