"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "BUILD VERY BEAUTIFUL", description: "BUILD ME VERY BEAUTIFUL WEBSITE TO SELL THIS ICE CREAMS", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Six bright yellow", description: "Six bright yellow mango ice cream scoops with visible fruit chunks fill a speckled light", price: 30, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Three scoops dark", description: "Three scoops of dark brown chocolate ice cream in a round, off-white ceramic bowl.", price: 40, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "premium product", description: "a premium product", price: 50, badge: "" }
];

  const filters = ["All Flavors", "Seasonal", "Vegan", "Classics"];
  const [activeFilter, setActiveFilter] = useState("All Flavors");
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({});
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
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
        el.style.transform = "translateY(32px)";
        el.style.transition = "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)";
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

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedStates((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedStates((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const filteredProducts =
    activeFilter === "All Flavors"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap');
        :root {
          --bg: #0F0B06;
          --surface: #C4B5A0;
          --primary: #EDE0CF;
          --accent: #2D8659;
          --text: #F5F0E8;
          --muted: #9B8B7E;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: 'Nunito Sans', sans-serif; }
        h1,h2,h3,h4,h5 { font-family: 'Space Grotesk', sans-serif; }
        button { font-family: 'Nunito Sans', sans-serif; }
        .card-hover { transition: transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 32px 64px -16px #2D865940; }
        .img-zoom { transition: transform 600ms cubic-bezier(0.4,0,0.2,1); }
        .img-zoom:hover { transform: scale(1.05); }
        .ghost-btn { opacity: 0; transition: opacity 200ms ease; }
        .product-card:hover .ghost-btn { opacity: 1; }
        .nav-link-hover { position: relative; text-decoration: none; }
        .nav-link-hover::after { content: ''; position: absolute; bottom: -2px; left: 50%; right: 50%; height: 1px; background: var(--accent); transition: left 250ms ease, right 250ms ease; }
        .nav-link-hover:hover::after { left: 0; right: 0; }
        @media (max-width: 768px) {
          .grid-3col { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .grid-3col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* NAVIGATION */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 300ms ease-out, border-bottom 300ms ease-out",
          background: navSolid ? "#0F0B06F2" : "transparent",
          borderBottom: navSolid ? "1px solid #EDE0CF15" : "1px solid transparent",
          backdropFilter: navSolid ? "blur(12px)" : "none",
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
          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.5 2 6 5 6 8c0 4 6 14 6 14s6-10 6-14c0-3-2.5-6-6-6z" />
                <circle cx="12" cy="8" r="2" fill="#fff" stroke="none" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.375rem",
                color: "var(--text)",
                letterSpacing: "-0.03em",
              }}
            >
              Glac
            </span>
          </button>

          {/* Desktop nav */}
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "40px" }}
          >
            {["Shop", "Flavors", "Our Story", "Locations", "Gifts"].map((link) => (
              <button
                key={link}
                className="nav-link-hover"
                onClick={() => router.push(`/${link.toLowerCase().replace(" ", "-")}`)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: link === "Shop" ? "var(--accent)" : "var(--text)",
                  fontSize: "0.9375rem",
                  fontWeight: link === "Shop" ? 600 : 500,
                  fontFamily: "'Nunito Sans', sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                {link}
              </button>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "16px" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <button
                onClick={() => router.push("/cart")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
                aria-label="Cart"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: "9999px",
                    width: "18px",
                    height: "18px",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile cart */}
          <button
            className="mobile-menu-btn"
            onClick={() => router.push("/cart")}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              color: "var(--text)",
              alignItems: "center",
            }}
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "9999px",
                width: "18px",
                height: "18px",
                fontSize: "0.625rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              0
            </span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#0F0B06F8",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            padding: "32px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}
              aria-label="Close menu"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {["Shop", "Flavors", "Our Story", "Locations", "Gifts"].map((link) => (
              <button
                key={link}
                onClick={() => { setMenuOpen(false); router.push(`/${link.toLowerCase().replace(" ", "-")}`); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontSize: "2.25rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  textAlign: "left",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SHOP HERO BANNER */}
      <section
        style={{
          paddingTop: "144px",
          paddingBottom: "64px",
          paddingLeft: "32px",
          paddingRight: "32px",
          background: "var(--bg)",
          borderBottom: "1px solid #EDE0CF10",
        }}
        ref={addRevealRef}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 600,
              color: "var(--accent)",
              marginBottom: "16px",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Handcrafted in small batches · Made in India
          </span>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text)",
              maxWidth: "640px",
              marginBottom: "24px",
            }}
          >
            The Full Collection
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "520px",
              marginBottom: "40px",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Every scoop tells a story. Explore our complete range of bold, artisan-crafted flavors — from beloved classics to this season's most coveted releases.
          </p>

          {/* Trust bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "center",
            }}
          >
            {[
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ),
                label: "4.9 / 5 from 3,200+ reviews",
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                ),
                label: "Free shipping over ₹999",
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                label: "Ethically Sourced Ingredients",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.875rem",
                  color: "var(--muted)",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section
        style={{
          padding: "40px 32px 32px",
          background: "var(--bg)",
          position: "sticky",
          top: "72px",
          zIndex: 50,
          borderBottom: "1px solid #EDE0CF10",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--muted)",
              fontWeight: 500,
              marginRight: "4px",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            Filter by:
          </span>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "10px 20px",
                borderRadius: "9999px",
                border: activeFilter === f ? "none" : "1.5px solid #EDE0CF30",
                background: activeFilter === f ? "var(--accent)" : "transparent",
                color: activeFilter === f ? "#fff" : "var(--muted)",
                fontSize: "0.875rem",
                fontWeight: activeFilter === f ? 600 : 500,
                cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif",
                transition: "background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== f) {
                  e.currentTarget.style.borderColor = "#EDE0CF60";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== f) {
                  e.currentTarget.style.borderColor = "#EDE0CF30";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              {f}
            </button>
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.875rem",
              color: "var(--muted)",
              fontFamily: "'Nunito Sans', sans-serif",
            }}
          >
            {filteredProducts.length} flavor{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <main style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 96px" }}
        >
          <div
            className="grid-3col"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {filteredProducts.map((p, index) => (
              <article
                key={p.id}
                className="product-card card-hover"
                ref={(el) => {
                  if (el) {
                    el.style.transitionDelay = `${index * 100}ms`;
                    addRevealRef(el);
                  }
                }}
                style={{
                  background: "#1A1410",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #EDE0CF0A",
                  position: "relative",
                }}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
              >
                {/* Badge */}
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      zIndex: 10,
                      background:
                        p.badge === "New"
                          ? "var(--accent)"
                          : p.badge === "Best Seller"
                          ? "#8B5E3C"
                          : "#3D6B8B",
                      color: "#fff",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      borderRadius: "9999px",
                      fontFamily: "'Nunito Sans', sans-serif",
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                {/* Image */}
                <div style={{ overflow: "hidden", aspectRatio: "4/5", position: "relative" }}>
                  <img
                    src={p.img}
                    alt={`${p.name} — artisan ice cream by Glac`}
                    className="img-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Hover ghost button */}
                  <div
                    className="ghost-btn"
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      padding: "24px",
                      background: "linear-gradient(to top, #0F0B06CC 0%, transparent 100%)",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                        );
                      }}
                      style={{
                        padding: "12px 28px",
                        borderRadius: "12px",
                        border: "1.5px solid #fff",
                        background: "transparent",
                        color: "#fff",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Nunito Sans', sans-serif",
                        letterSpacing: "0.02em",
                        transition: "background 200ms ease, color 200ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#0F0B06";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#fff";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "24px" }}>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "1.125rem",
                      color: "var(--text)",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                      marginBottom: "20px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        border: "none",
                        background: addedStates[p.id] ? "#1E6B42" : "var(--accent)",
                        color: "#fff",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Nunito Sans', sans-serif",
                        transition: "background 200ms ease, transform 150ms ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.98)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                    >
                      {addedStates[p.id] ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                          Added!
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div
            ref={addRevealRef}
            style={{ textAlign: "center", marginTop: "72px" }}
          >
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "20px", fontFamily: "'Nunito Sans', sans-serif" }}>
              Showing {filteredProducts.length} of {filteredProducts.length} flavors
            </p>
            <button
              style={{
                padding: "16px 48px",
                borderRadius: "12px",
                border: "1.5px solid #EDE0CF30",
                background: "transparent",
                color: "var(--text)",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif",
                transition: "border-color 200ms ease, background 200ms ease, transform 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "#2D865915";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#EDE0CF30";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Load More Flavors
            </button>
          </div>
        </div>
      </main>

      {/* STORY STRIP */}
      <section
        ref={addRevealRef}
        style={{
          background: "#13100C",
          padding: "96px 32px",
          borderTop: "1px solid #EDE0CF0A",
          borderBottom: "1px solid #EDE0CF0A",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "64px",
            alignItems: "center",
          }}
        >
          <div style={{ overflow: "hidden", borderRadius: "16px" }}>
            <img
              src="/product-1.jpg"
              alt="Artisan ice cream crafting process at Glac — small batch, handcrafted"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                display: "block",
                transition: "transform 600ms cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 600,
                color: "var(--accent)",
                marginBottom: "16px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Our Story
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              Frozen with intention.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                marginBottom: "28px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Every pint at Glac begins with a single obsession — the very best ingredients India has to offer. We source directly from farmers, craft in small batches, and freeze slowly to lock in maximum flavor.
            </p>
            <button
              onClick={() => router.push("/our-story")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "'Nunito Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0",
                borderBottom: "1px solid var(--accent)",
                paddingBottom: "2px",
                transition: "gap 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.gap = "14px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.gap = "8px";
              }}
            >
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#090705",
          padding: "80px 32px 0",
          borderTop: "1px solid #EDE0CF08",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 2fr",
            gap: "48px",
            paddingBottom: "64px",
          }}
        >
          {/* Col 1 — Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2C8.5 2 6 5 6 8c0 4 6 14 6 14s6-10 6-14c0-3-2.5-6-6-6z" />
                  <circle cx="12" cy="8" r="2" fill="#fff" stroke="none" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                }}
              >
                Glac
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                marginBottom: "24px",
                maxWidth: "240px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              Bold flavors, artfully frozen. Handcrafted in small batches across India.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                {
                  label: "Instagram",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: "Pinterest",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.76 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.34.67 1.34 1.48 0 .9-.58 2.25-.87 3.5-.25 1.05.52 1.9 1.54 1.9 1.84 0 3.08-2.37 3.08-5.18 0-2.14-1.44-3.64-3.5-3.64-2.38 0-3.77 1.79-3.77 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.24-.06.26-.21.85-.23.97-.04.16-.13.19-.29.11-1.1-.51-1.78-2.13-1.78-3.43 0-2.79 2.03-5.35 5.85-5.35 3.07 0 5.46 2.19 5.46 5.11 0 3.05-1.92 5.5-4.58 5.5-.9 0-1.74-.47-2.02-1.02l-.55 2.04c-.2.77-.74 1.73-1.1 2.31.83.26 1.7.4 2.61.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid #EDE0CF20",
                    background: "transparent",
                    color: "var(--muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 200ms ease, color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#EDE0CF20";
                    e.currentTarget.style.color = "var(--muted)";
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              Shop
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Pints", "Collections", "Gifts", "Subscriptions"].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push("/shop")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    fontSize: "0.9375rem",
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: "left",
                    padding: "0",
                    transition: "color 200ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3 — About */}
          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              About Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Our Story", "Sustainability", "Careers", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push(`/${item.toLowerCase().replace(" ", "-")}`)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    fontSize: "0.9375rem",
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: "left",
                    padding: "0",
                    transition: "color 200ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              Stay in the Loop
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "var(--muted)",
                marginBottom: "20px",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              New flavors, seasonal drops, and exclusive offers — straight to your inbox.
            </p>
            <div style={{ display: "flex", gap: "0", borderRadius: "12px", overflow: "hidden", border: "1px solid #EDE0CF20" }}>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "#1A1410",
                  border: "none",
                  color: "var(--text)",
                  fontSize: "0.875rem",
                  fontFamily: "'Nunito Sans', sans-serif",
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "12px 20px",
                  background: "var(--accent)",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif",
                  whiteSpace: "nowrap",
                  transition: "background 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#236B47")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
              >
                Subscribe
              </button>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginTop: "10px",
                fontFamily: "'Nunito Sans', sans-serif",
                opacity: 0.7,
              }}
            >
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid #EDE0CF0A",
            padding: "24px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
            © {new Date().getFullYear()} Glac. All rights reserved. Made with love in India.
          </span>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {["Visa", "Mastercard", "Amex", "UPI"].map((pay) => (
              <span
                key={pay}
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                  color: "var(--muted)",
                  border: "1px solid #EDE0CF20",
                  borderRadius: "4px",
                  padding: "3px 8px",
                  letterSpacing: "0.04em",
                }}
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}