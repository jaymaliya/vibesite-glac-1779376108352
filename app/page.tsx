"use client";
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../components/CartContext"

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Artisan Vanilla Bean",
    description: "Hand-scraped Madagascar vanilla pods folded into slow-churned cream. Pure, unapologetic sweetness.",
    price: 349,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Alphonso Mango Burst",
    description: "Six bright yellow mango scoops with visible fruit chunks — Ratnagiri Alphonso at its ripest.",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Dark Belgian Chocolate",
    description: "Three scoops of deep, brooding dark chocolate made with 72% Belgian couverture.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Single Origin Reserve",
    description: "A premium small-batch pint crafted from ethically sourced single-origin dairy.",
    price: 50,
  },
]

const seasonal = [
  { img: "/product-2.jpg", name: "Sitaphal & Cardamom", desc: "Custard apple kissed with hand-ground green cardamom", price: 420 },
  { img: "/product-3.jpg", name: "Rose & Pistachio", desc: "Damask rose water swirled through Iranian pistachio cream", price: 390 },
  { img: "/product-1.jpg", name: "Fig & Honey", desc: "Dried Nashik figs, raw wildflower honey, crumbled walnut", price: 450 },
  { img: "/product-4.jpg", name: "Thandai Kulfi Bar", desc: "Saffron, mixed nuts, and rose — Holi in frozen form", price: 280 },
]

const gifts = [
  {
    img: "/product-4.jpg",
    title: "The Glac Gift Box",
    desc: "Four handpicked pints nestled in a keepsake box. Perfect for occasions that deserve more than a card.",
    cta: "Shop Gift Boxes",
  },
  {
    img: "/product-2.jpg",
    title: "Monthly Pint Subscription",
    desc: "A new seasonal flavour at your door every month. Cancel anytime. Never be without good ice cream.",
    cta: "Subscribe Now",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [navSolid, setNavSolid] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)
  const [activeScoop, setActiveScoop] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleScroll = () => setNavSolid(window.scrollY > 80)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap');
      :root {
        --bg: #0F0B06;
        --surface: #C4B5A0;
        --primary: #EDE0CF;
        --accent: #2D8659;
        --text: #F5F0E8;
        --muted: #9B8B7E;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); font-family: 'Nunito Sans', sans-serif; color: var(--text); overflow-x: hidden; }
      h1,h2,h3,h4,h5 { font-family: 'Space Grotesk', sans-serif; }
      .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal.d1 { transition-delay: 0.1s; }
      .reveal.d2 { transition-delay: 0.2s; }
      .reveal.d3 { transition-delay: 0.3s; }
      .reveal.d4 { transition-delay: 0.4s; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
    `
    document.head.appendChild(style)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible")
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observerRef.current?.observe(el))

    return () => {
      document.head.removeChild(style)
      observerRef.current?.disconnect()
    }
  }, [])

  const handleAdd = (p: typeof products[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, img: p.img, quantity: 1 })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1400)
  }

  const handleAddSeasonal = (s: typeof seasonal[0], idx: number) => {
    addItem({ id: 100 + idx, name: s.name, price: s.price, img: s.img, quantity: 1 })
    setAddedId(100 + idx)
    setTimeout(() => setAddedId(null), 1400)
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "#FBF8F6" : "transparent",
        borderBottom: navSolid ? "1px solid #E8E0D4" : "none",
        transition: "background 300ms ease-out, border-color 300ms ease-out",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
            className="mobile-hamburger"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navSolid ? "#0F0B06" : "#F5F0E8"} strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 3 7 7 13 4-6 7-9.5 7-13 0-4-3-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700,
              color: navSolid ? "#0F0B06" : "#F5F0E8", letterSpacing: "-0.03em"
            }}>Glac</span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
            {["Shop", "Flavours", "Our Story", "Locations", "Gifts"].map((link) => (
              <button
                key={link}
                onClick={() => router.push("/shop")}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem",
                  color: navSolid ? "#3A2E24" : "#F5F0E8",
                  letterSpacing: "0.02em",
                  transition: "color 200ms",
                  padding: "4px 0",
                  borderBottom: "1px solid transparent",
                  position: "relative" as const,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = navSolid ? "#3A2E24" : "#F5F0E8" }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <button aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={navSolid ? "#3A2E24" : "#F5F0E8"} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button aria-label="Cart" onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, position: "relative" as const }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={navSolid ? "#3A2E24" : "#F5F0E8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span style={{
                position: "absolute" as const, top: 0, right: 0, width: 16, height: 16, borderRadius: "50%",
                background: "var(--accent)", color: "#fff", fontSize: "0.6rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>2</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, background: "#0F0B06",
          display: "flex", flexDirection: "column", padding: 32
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>Glac</span>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {["Shop", "Flavours", "Our Story", "Locations", "Gifts"].map((link, i) => (
            <button key={link} onClick={() => { router.push("/shop"); setMobileOpen(false) }} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700,
              color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 24,
              opacity: 0, animation: `fadeInUp 0.4s ${i * 0.07}s ease forwards`,
              borderBottom: "1px solid #1F1A14", paddingBottom: 20,
            }}>
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <img
          src="/product-1.jpg"
          alt="Artisan Vanilla Bean ice cream scoop — Glac's signature flavour"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Scrim */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
        }} />
        {/* Bottom center content */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 24px 72px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
        }}>
          <span style={{
            fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 20,
            fontFamily: "'Nunito Sans', sans-serif"
          }}>
            Bold Flavors · Artfully Frozen
          </span>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(3.2rem, 7vw, 6rem)",
            fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0,
            color: "#FFFFFF", maxWidth: 760, marginBottom: 20
          }}>
            Ice cream that<br/>earns its place
          </h1>
          <p style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7,
            color: "rgba(255,255,255,0.82)", maxWidth: 500, marginBottom: 36,
            fontWeight: 400
          }}>
            Small-batch, handcrafted pints made from ethically sourced ingredients. Every scoop tells a story.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "16px 48px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "var(--accent)", color: "#fff",
              fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "1rem",
              letterSpacing: "0.02em",
              boxShadow: "0 16px 40px -12px rgba(45,134,89,0.6)",
              transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms",
              marginBottom: 20,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px -10px rgba(45,134,89,0.7)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -12px rgba(45,134,89,0.6)" }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)" }}
          >
            Explore All Flavours
          </button>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontFamily: "'Nunito Sans', sans-serif" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,220,50,0.9)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              4.9 · 18,000+ happy customers
            </span>
            <span>🏭 Made in India</span>
            <span>Free delivery above ₹999</span>
            <span>Handcrafted in small batches · Ethically Sourced</span>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE SCOOPS ── */}
      <section style={{ background: "var(--bg)", padding: "96px 48px" }} className="reveal">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56, maxWidth: 600 }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>Our Craft</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: 10, lineHeight: 1.1 }}>
              Signature Scoops
            </h2>
            <p style={{ marginTop: 16, fontSize: "1.05rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              Four obsessions that started it all. Each pint is churned to order and shipped within 24 hours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
            {products.map((p, i) => (
              <article
                key={p.id}
                className={`reveal d${i + 1}`}
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                <div
                  style={{
                    background: "#1A1510", borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 8px 32px -8px rgba(237,224,207,0.08)",
                    transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = "translateY(-8px)"
                    el.style.boxShadow = "0 24px 60px -12px rgba(237,224,207,0.18)"
                    const hoverBtn = el.querySelector(".hover-btn") as HTMLElement
                    if (hoverBtn) hoverBtn.style.opacity = "1"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = "translateY(0)"
                    el.style.boxShadow = "0 8px 32px -8px rgba(237,224,207,0.08)"
                    const hoverBtn = el.querySelector(".hover-btn") as HTMLElement
                    if (hoverBtn) hoverBtn.style.opacity = "0"
                  }}
                >
                  <div style={{ overflow: "hidden", position: "relative" as const }}>
                    <img
                      src={p.img}
                      alt={`${p.name} — artisan ice cream pint`}
                      style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 600ms ease", display: "block" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)" }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                    />
                    {/* Scrim overlay */}
                    <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(15,11,6,0.88) 0%, transparent 100%)", padding: "20px 20px 16px" }}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "#F5F0E8", marginBottom: 4 }}>{p.name}</p>
                      <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: "rgba(245,240,232,0.65)", lineHeight: 1.4 }}>{p.description.slice(0, 54)}{p.description.length > 54 ? "…" : ""}</p>
                    </div>
                    {/* Hover ghost button */}
                    <div className="hover-btn" style={{ position: "absolute" as const, inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 250ms" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdd(p) }}
                        style={{
                          padding: "12px 28px", borderRadius: 10,
                          border: "1.5px solid rgba(255,255,255,0.7)",
                          background: "rgba(15,11,6,0.55)", backdropFilter: "blur(8px)",
                          color: "#fff", fontFamily: "'Nunito Sans', sans-serif",
                          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                          transition: "background 200ms",
                        }}
                      >
                        {addedId === p.id ? "✓ Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "var(--accent)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <span style={{
                      fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif"
                    }}>Per Pint</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <button
              onClick={() => router.push("/shop")}
              style={{
                padding: "14px 44px", borderRadius: 10, border: "1.5px solid rgba(237,224,207,0.25)",
                background: "transparent", color: "var(--primary)", cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem",
                transition: "border-color 200ms, background 200ms, transform 200ms",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.background = "rgba(237,224,207,0.06)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,224,207,0.25)"; (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              View All Flavours →
            </button>
          </div>
        </div>
      </section>

      {/* ── THE STORY ── */}
      <section style={{ background: "#110D08", padding: "96px 48px" }} className="reveal">
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 72, alignItems: "center" }}>
          <div style={{ overflow: "hidden", borderRadius: 24, boxShadow: "0 40px 80px -20px rgba(45,134,89,0.15)" }}>
            <img
              src="/product-3.jpg"
              alt="Artisanal ice cream being crafted — Glac's small-batch process"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 700ms ease", display: "block" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>Our Philosophy</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.1 }}>
              The Story Behind the Cream
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              Every Glac pint starts at the source. We work directly with family-run dairy farms in Nashik, small orchards in Coorg, and specialty spice growers in Kerala — people who care as deeply about quality as we do.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
              No stabilisers. No artificial colours. Just real ingredients, slow-churned to an obsessive standard. That's the Glac promise.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem",
                color: "var(--primary)", padding: 0,
                borderBottom: "1.5px solid rgba(237,224,207,0.4)",
                transition: "border-color 250ms, color 250ms",
                paddingBottom: 3,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "#fff" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,224,207,0.4)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)" }}
            >
              Read Our Story →
            </button>
          </div>
        </div>
      </section>

      {/* ── SEASONAL SCROLL ── */}
      <section style={{ background: "var(--bg)", padding: "96px 0" }} className="reveal">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>Limited Release</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: 10, lineHeight: 1.1 }}>
                Seasonal & Limited Editions
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", color: "var(--muted)", fontSize: "0.875rem", fontWeight: 600 }}
            >
              View all →
            </button>
          </div>
        </div>

        <div className="hide-scrollbar" style={{ display: "flex", gap: 24, overflowX: "auto", padding: "0 48px 16px" }}>
          {seasonal.map((s, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 300px", background: "#1A1510", borderRadius: 20, overflow: "hidden",
                boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
                transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 48px -8px rgba(45,134,89,0.2)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.5)" }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(s.name)}&price=${s.price}&img=${encodeURIComponent(s.img)}`)}
            >
              <div style={{ overflow: "hidden" }}>
                <img
                  src={s.img}
                  alt={`${s.name} — seasonal ice cream flavour`}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 500ms ease", display: "block" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                />
              </div>
              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "var(--text)", marginBottom: 4 }}>{s.name}</p>
                    <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.825rem", color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>₹{s.price.toLocaleString("en-IN")}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddSeasonal(s, i) }}
                    style={{
                      padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(45,134,89,0.5)",
                      background: addedId === 100 + i ? "var(--accent)" : "transparent",
                      color: addedId === 100 + i ? "#fff" : "var(--accent)",
                      fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem",
                      cursor: "pointer", transition: "background 180ms, color 180ms",
                    }}
                    onMouseEnter={(e) => { if (addedId !== 100 + i) { (e.currentTarget as HTMLElement).style.background = "rgba(45,134,89,0.15)" } }}
                    onMouseLeave={(e) => { if (addedId !== 100 + i) { (e.currentTarget as HTMLElement).style.background = "transparent" } }}
                  >
                    {addedId === 100 + i ? "✓ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORE LOCATOR ── */}
      <section style={{ background: "#0C0905", padding: "0" }} className="reveal">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", minHeight: 480 }}>
          {/* Map placeholder */}
          <div style={{ background: "#1A1A14", position: "relative" as const, overflow: "hidden", minHeight: 480 }}>
            {/* Stylised map grid */}
            <div style={{ position: "absolute" as const, inset: 0, opacity: 0.15 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ position: "absolute" as const, left: `${(i % 6) * 18}%`, top: `${Math.floor(i / 6) * 50}%`, width: "17%", height: "45%", border: "1px solid var(--primary)", borderRadius: 4 }} />
              ))}
            </div>
            {/* Pin dots */}
            {[{ x: "22%", y: "38%" }, { x: "44%", y: "55%" }, { x: "67%", y: "28%" }, { x: "81%", y: "62%" }].map((pos, i) => (
              <div key={i} style={{ position: "absolute" as const, left: pos.x, top: pos.y, transform: "translate(-50%,-50%)" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px rgba(45,134,89,0.25)", animation: "pulse 2s infinite" }} />
              </div>
            ))}
            <div style={{ position: "absolute" as const, bottom: 20, left: 20, background: "#1A1510", borderRadius: 10, padding: "10px 16px" }}>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.75rem", color: "var(--muted)" }}>4 Glac scoop shops</p>
            </div>
          </div>
          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px 48px", background: "#110D08" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif", marginBottom: 16 }}>Visit Us</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.15, marginBottom: 20 }}>
              Find Your Nearest Scoop Shop
            </h2>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: 36 }}>
              Four locations across Mumbai, Pune, Bangalore, and Delhi NCR. Walk in or pre-order for pickup.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                alignSelf: "flex-start", padding: "14px 32px", borderRadius: 10,
                border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer",
                fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "0.9rem",
                boxShadow: "0 12px 32px -8px rgba(45,134,89,0.45)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px rgba(45,134,89,0.6)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -8px rgba(45,134,89,0.45)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8 2 5 5 5 9c0 3.5 3 7 7 13 4-6 7-9.5 7-13 0-4-3-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Find a Location
            </button>
          </div>
        </div>
      </section>

      {/* ── GIFTS & COLLECTIONS ── */}
      <section style={{ background: "var(--bg)", padding: "96px 48px" }} className="reveal">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", fontFamily: "'Nunito Sans', sans-serif" }}>Thoughtfully Curated</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", marginTop: 10, lineHeight: 1.1 }}>
              Gifts & Collections
            </h2>
            <p style={{ marginTop: 14, fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif", maxWidth: 500, margin: "14px auto 0" }}>
              Because the best gift is always one that melts in your mouth.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {gifts.map((g, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                  gap: 64,
                  alignItems: "center",
                  direction: (i % 2 === 1 ? "rtl" : "ltr") as "ltr" | "rtl",
                }}
              >
                <div style={{ direction: "ltr" as "ltr", overflow: "hidden", borderRadius: 24, boxShadow: "0 24px 64px -16px rgba(45,134,89,0.12)" }}>
                  <img
                    src={g.img}
                    alt={`${g.title} — Glac collection`}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 700ms ease", display: "block" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                  />
                </div>
                <div style={{ direction: "ltr" as "ltr", display: "flex", flexDirection: "column", gap: 20 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.15 }}>
                    {g.title}
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--muted)", fontFamily: "'Nunito Sans', sans-serif" }}>
                    {g.desc}
                  </p>
                  <button
                    onClick={() => router.push("/shop")}
                    style={{
                      alignSelf: "flex-start", padding: "13px 32px", borderRadius: 10,
                      border: "1.5px solid rgba(237,224,207,0.25)", background: "transparent",
                      color: "var(--primary)", cursor: "pointer",
                      fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem",
                      transition: "border-color 200ms, background 200ms, transform 200ms",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.background = "rgba(237,224,207,0.06)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,224,207,0.25)"; (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                  >
                    {g.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: "#110D08", borderTop: "1px solid #1E1810", borderBottom: "1px solid #1E1810", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 32 }}>
          {[
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Same-day delivery in Mumbai" },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>, label: "100% natural ingredients" },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: "4.9 · 18,000+ reviews" },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Handcrafted in India" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {item.icon}
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--muted)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#080604", padding: "72px 48px 40px", borderTop: "1px solid #1A1510" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: 48, marginBottom: 64 }}>
            {/* Col 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }} onClick={() => router.push("/")}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8 2 5 5 5 9c0 3.5 3 7 7 13 4-6 7-9.5 7-13 0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>Glac</span>
              </div>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: 260, marginBottom: 24 }}>
                Bold flavors, artfully frozen. Small-batch ice cream made with obsessive care.
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                {[
                  <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                  <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                  <svg key="pt" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12a4 4 0 108 0 4 4 0 00-8 0"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
                ].map((icon, i) => (
                  <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A1510", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", transition: "color 200ms, background 200ms" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; (e.currentTarget as HTMLElement).style.background = "#2A2218" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.background = "#1A1510" }}
                  >{icon}</button>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", marginBottom: 20 }}>Shop</p>
              {["Pints", "Collections", "Gifts", "Subscriptions"].map((link) => (
                <button key={link} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", marginBottom: 12, textAlign: "left", padding: 0, transition: "color 200ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
                >{link}</button>
              ))}
            </div>

            {/* Col 3 */}
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", marginBottom: 20 }}>About Us</p>
              {["Our Story", "Sustainability", "Careers", "Contact"].map((link) => (
                <button key={link} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", marginBottom: 12, textAlign: "left", padding: 0, transition: "color 200ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
                >{link}</button>
              ))}
            </div>

            {/* Col 4 */}
            <div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", marginBottom: 20 }}>Newsletter</p>
              <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)", marginBottom: 20 }}>
                New flavours, seasonal releases, and exclusive drops — first to your inbox.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1, padding: "11px 16px", borderRadius: 8,
                    border: "1px solid rgba(237,224,207,0.15)",
                    background: "#1A1510", color: "var(--text)", outline: "none",
                    fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem",
                  }}
                />
                <button
                  style={{
                    padding: "11px 20px", borderRadius: 8, border: "none",
                    background: "var(--accent)", color: "#fff", cursor: "pointer",
                    fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem",
                    transition: "transform 200ms",
                    whiteSpace: "nowrap" as const,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
                >
                  Subscribe
                </button>
              </div>
              <p style={{ marginTop: 10, fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.72rem", color: "#5A4E44" }}>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid #1A1510", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>
              © {new Date().getFullYear()} Glac. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["VISA", "MC", "AMEX", "UPI"].map((pm) => (
                <span key={pm} style={{
                  padding: "4px 10px", borderRadius: 5, background: "#1A1510",
                  fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700,
                  color: "var(--muted)", letterSpacing: "0.06em"
                }}>{pm}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(45,134,89,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(45,134,89,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
        @media (max-width: 900px) {
          section > div[style*="gridTemplateColumns: 3fr 2fr"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; direction: ltr !important; }
          section > div > div > div[style*="direction"] { direction: ltr !important; }
          footer > div > div[style*="gridTemplateColumns: 2fr 1fr 1fr 2fr"] { grid-template-columns: 1fr 1fr !important; }
          nav > div { padding: 0 20px !important; }
          section[style*="padding: 96px 48px"] { padding: 64px 24px !important; }
        }
        @media (max-width: 600px) {
          footer > div > div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
          section > div[style*="gridTemplateColumns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}