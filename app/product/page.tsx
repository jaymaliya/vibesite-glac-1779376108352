"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const allProducts = [
  { id: 1, img: "/product-1.jpg", name: "Midnight Dark Chocolate", description: "A velvety, intensely dark chocolate ice cream crafted from single-origin cacao. Deep cocoa bitterness balanced with a whisper of sea salt and vanilla bean.", price: 349 },
  { id: 2, img: "/product-2.jpg", name: "Six bright yellow", description: "Six bright yellow mango ice cream scoops with visible fruit chunks fill a speckled light brown ceramic bowl.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Three scoops dark", description: "Three scoops of dark brown chocolate ice cream in a round, off-white ceramic bowl.", price: 329 },
  { id: 4, img: "/product-4.jpg", name: "premium product", description: "a premium product", price: 399 },
];

const thumbnails = ["/product-1.jpg", "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];

const flavorVariants = [
  { label: "Classic Dark", color: "#3B1E08" },
  { label: "Salted Caramel", color: "#C47A2B" },
  { label: "Pistachio Rose", color: "#7DAB6A" },
  { label: "Berry Bliss", color: "#8B3A6A" },
];

const sizeVariants = [
  { label: "Pint", price: 0 },
  { label: "Quart", price: 120 },
  { label: "Half Gallon", price: 220 },
];

const reviews = [
  { name: "Priya S.", date: "12 Jan 2025", rating: 5, text: "Absolutely stunning flavors — the dark chocolate pint is criminally good. The texture is so creamy and smooth, unlike anything I've had from a store. Will absolutely reorder." },
  { name: "Arjun M.", date: "4 Feb 2025", rating: 5, text: "Got a gift box for my wife's birthday and she was blown away. The packaging is beautiful and the ice cream tastes like it came straight from an Italian gelateria." },
  { name: "Sneha R.", date: "22 Mar 2025", rating: 4, text: "Delivery was fast and everything arrived perfectly insulated. The salted caramel flavor is my new obsession. Slight wish there were more vegan options but overall exceptional quality." },
  { name: "Kabir T.", date: "1 Apr 2025", rating: 5, text: "Glac has ruined all other ice cream for me. The ingredients are clearly top-notch and you can taste the care that goes into each batch. The mango scoop literally tasted like a fresh Alphonso." },
];

function StarRow({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? "#2D8659" : "none"} stroke={i <= count ? "#2D8659" : "#9B8B7E"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Midnight Dark Chocolate";
  const basePrice = (!paramPrice || paramPrice === 0) ? 349 : paramPrice;

  const cartContext = useCart();
  const { addItem } = cartContext ?? { addItem: () => {} };
  const router = useRouter();

  const [activeThumb, setActiveThumb] = useState(0);
  const [mainImg, setMainImg] = useState(displayImg);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<{ about: boolean; ingredients: boolean }>({ about: true, ingredients: false });
  const [navScrolled, setNavScrolled] = useState(false);

  const imgArr = [displayImg, ...thumbnails.filter((t) => t !== displayImg)].slice(0, 4);
  const currentPrice = basePrice + sizeVariants[selectedSize].price;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);

    // Reveal animation
    const style = document.createElement("style");
    style.textContent = `
      .reveal { opacity: 1; transform: translateY(0); transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1); }
      .reveal.is-hidden { opacity: 0; transform: translateY(28px); }
      body { font-family: 'Nunito Sans', sans-serif; background: #0F0B06; }
    `;
    document.head.appendChild(style);

    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => el.classList.add("is-hidden"));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove("is-hidden"); } });
    }, { threshold: 0.1 });
    els.forEach((el) => obs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  const handleThumb = (i: number) => {
    setActiveThumb(i);
    setMainImg(imgArr[i]);
  };

  const handleAddToCart = () => {
    addItem({ id: `product-${displayImg}`, name: displayName, price: currentPrice, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${displayImg}`, name: displayName, price: currentPrice, quantity: qty });
    router.push("/checkout");
  };

  const handleRazorpay = () => {
    const options = {
      key: "rzp_test_",
      amount: currentPrice * qty * 100,
      currency: "INR",
      name: "Glac",
      description: displayName,
      handler: () => router.push("/checkout"),
      prefill: { name: "", email: "" },
      theme: { color: "#2D8659" },
    };
    if ((window as any).Razorpay) {
      const rp = new (window as any).Razorpay(options);
      rp.open();
    } else {
      handleBuyNow();
    }
  };

  const matched = allProducts.find((p) => p.img === displayImg);
  const description = matched?.description ?? "A handcrafted small-batch ice cream, made with ethically sourced ingredients and a whole lot of love. Every scoop is a sensory experience.";

  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? "#1A1208F5" : "transparent",
        borderBottom: navScrolled ? "1px solid #EDE0CF18" : "none",
        transition: "background 300ms ease-out, border-color 300ms ease-out",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.03em" }}>Glac</span>
        </button>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Shop", "Flavors", "Our Story", "Locations", "Gifts"].map((l) => (
            <button key={l} onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "0.9rem", fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500, opacity: 0.85, padding: "4px 0", borderBottom: "1px solid transparent", transition: "opacity 250ms, border-color 250ms" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "var(--accent)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; (e.currentTarget as HTMLButtonElement).style.borderBottomColor = "transparent"; }}
            >{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button onClick={() => router.push("/search")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", padding: "8px" }} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "flex", alignItems: "center", position: "relative", padding: "8px" }} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </nav>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.93)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", color: "#fff" }} aria-label="Close lightbox">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i - 1 + imgArr.length) % imgArr.length); }} style={{ position: "absolute", left: 24, background: "none", border: "none", cursor: "pointer", color: "#fff" }} aria-label="Previous">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <img src={imgArr[lightboxIdx]} alt="Product full view" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", maxWidth: "80vw", objectFit: "contain", borderRadius: "16px" }} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((i) => (i + 1) % imgArr.length); }} style={{ position: "absolute", right: 24, background: "none", border: "none", cursor: "pointer", color: "#fff" }} aria-label="Next">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* MAIN PRODUCT SECTION */}
      <section style={{ paddingTop: "96px", background: "var(--bg)", minHeight: "100vh" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "48px 48px 96px",
          display: "grid", gridTemplateColumns: "55fr 45fr", gap: "64px", alignItems: "flex-start",
        }}>
          {/* LEFT — STICKY GALLERY */}
          <div style={{ position: "sticky", top: "96px" }}>
            {/* Main image */}
            <div onClick={() => { setLightboxIdx(activeThumb); setLightboxOpen(true); }} style={{ overflow: "hidden", borderRadius: "20px", cursor: "zoom-in", background: "var(--surface)", boxShadow: "0 32px 80px -20px #EDE0CF30" }}>
              <img src={mainImg} alt={displayName} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
              />
            </div>
            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              {imgArr.map((img, i) => (
                <button key={i} onClick={() => handleThumb(i)} aria-label={`View image ${i + 1}`} style={{
                  padding: 0, border: "none", cursor: "pointer", borderRadius: "10px", overflow: "hidden",
                  outline: activeThumb === i ? "2px solid #2D8659" : "2px solid transparent",
                  outlineOffset: "2px", flex: "0 0 80px", width: "80px", height: "80px",
                  transition: "outline 180ms",
                }}>
                  <img src={img} alt={`Thumbnail ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {/* Eyebrow */}
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px" }}>Artisan · Small Batch · Made in India</span>

            {/* Product Name */}
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 16px" }}>
              {displayName}
            </h1>

            {/* Price + Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "2rem", color: "var(--accent)", letterSpacing: "-0.02em" }}>
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <StarRow count={5} />
                <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>4.9 (214 reviews)</span>
              </div>
            </div>

            {/* Trust bar */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "28px", padding: "14px 18px", background: "#EDE0CF0A", borderRadius: "12px", border: "1px solid #EDE0CF14" }}>
              {[
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="2"><path d="M5 12l5 5 9-9"/></svg>, text: "Free delivery above ₹599" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Ships in insulated pack" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "Ethically sourced" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {t.icon}
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>{t.text}</span>
                </div>
              ))}
            </div>

            {/* Flavor Variants */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", marginBottom: "12px" }}>
                Flavor — <span style={{ color: "var(--text)", textTransform: "none", letterSpacing: "0" }}>{flavorVariants[selectedFlavor].label}</span>
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {flavorVariants.map((f, i) => (
                  <button key={i} onClick={() => setSelectedFlavor(i)} style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "8px 16px", borderRadius: "9999px", cursor: "pointer",
                    border: selectedFlavor === i ? "1.5px solid #2D8659" : "1.5px solid #EDE0CF30",
                    background: selectedFlavor === i ? "#2D8659" : "transparent",
                    color: selectedFlavor === i ? "#fff" : "var(--text)",
                    fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500, fontSize: "0.85rem",
                    transition: "background 180ms, border-color 180ms, color 180ms",
                  }}>
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: f.color, flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Variants */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", marginBottom: "12px" }}>
                Size — <span style={{ color: "var(--text)", textTransform: "none", letterSpacing: "0" }}>{sizeVariants[selectedSize].label}</span>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {sizeVariants.map((s, i) => (
                  <button key={i} onClick={() => setSelectedSize(i)} style={{
                    padding: "8px 20px", borderRadius: "9999px", cursor: "pointer",
                    border: selectedSize === i ? "1.5px solid #2D8659" : "1.5px solid #EDE0CF30",
                    background: selectedSize === i ? "#2D8659" : "transparent",
                    color: selectedSize === i ? "#fff" : "var(--text)",
                    fontFamily: "'Nunito Sans', sans-serif", fontWeight: 500, fontSize: "0.85rem",
                    transition: "background 180ms, border-color 180ms, color 180ms",
                  }}>
                    {s.label}{s.price > 0 ? ` +₹${s.price}` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
              <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", margin: 0 }}>Qty</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1.5px solid #EDE0CF25", borderRadius: "12px", overflow: "hidden" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: "44px", height: "44px", background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Decrease quantity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text)", borderLeft: "1px solid #EDE0CF18", borderRight: "1px solid #EDE0CF18" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ width: "44px", height: "44px", background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Increase quantity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Total: <strong style={{ color: "var(--text)" }}>₹{(currentPrice * qty).toLocaleString("en-IN")}</strong></span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <button onClick={handleAddToCart} style={{
                width: "100%", padding: "18px 32px", borderRadius: "14px", border: "none", cursor: "pointer",
                background: added ? "#1a6640" : "var(--accent)", color: "#fff",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem",
                boxShadow: "0 12px 32px -8px #2D865950",
                transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms, background 200ms",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              >
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    Add to Cart
                  </>
                )}
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <button onClick={handleBuyNow} style={{
                  padding: "16px 24px", borderRadius: "14px", cursor: "pointer",
                  border: "1.5px solid var(--accent)", background: "transparent", color: "var(--accent)",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem",
                  transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), background 200ms",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.background = "#2D865914"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >Buy Now</button>
                <button onClick={handleRazorpay} style={{
                  padding: "16px 24px", borderRadius: "14px", cursor: "pointer",
                  border: "1.5px solid #EDE0CF25", background: "#EDE0CF08", color: "var(--text)",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem",
                  transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), background 200ms",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.background = "#EDE0CF14"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.background = "#EDE0CF08"; }}
                >Pay via UPI / Card</button>
              </div>
            </div>

            {/* Delivery promise */}
            <div style={{ display: "flex", gap: "16px", padding: "16px", background: "#2D865910", borderRadius: "12px", border: "1px solid #2D865928", marginBottom: "28px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: "2px" }}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>Delivered in insulated packaging</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>Arrives frozen &amp; fresh. Free shipping on orders above ₹599. Same-day delivery available in select cities.</p>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ borderTop: "1px solid #EDE0CF18" }}>
              {[
                {
                  key: "about" as const,
                  label: "About This Flavor",
                  content: description + " Handcrafted in small batches using ethically sourced dairy and locally procured seasonal ingredients. No artificial colors, no preservatives — just honest, bold flavor.",
                },
                {
                  key: "ingredients" as const,
                  label: "Ingredients & Allergens",
                  content: "Full cream milk, fresh cream, cane sugar, single-origin cacao (72%), Himalayan sea salt, Madagascar vanilla bean extract. Contains: Milk, May contain traces of nuts. No artificial flavors, colors or preservatives. Vegan options available — ask our team.",
                },
              ].map((acc) => (
                <div key={acc.key} style={{ borderBottom: "1px solid #EDE0CF18" }}>
                  <button onClick={() => setAccordionOpen((prev) => ({ ...prev, [acc.key]: !prev[acc.key] }))} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "18px 0", background: "none", border: "none", cursor: "pointer", color: "var(--text)",
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem",
                  }}>
                    {acc.label}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: accordionOpen[acc.key] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 250ms" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {accordionOpen[acc.key] && (
                    <p style={{ margin: "0 0 18px", fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)" }}>{acc.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reveal" style={{ background: "#0F0B06", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "12px" }}>What our fans say</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 3vw, 2.75rem)", letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 8px" }}>Real scoops, real stories</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <StarRow count={5} />
              <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>4.9 average from 214 reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{
                background: "#EDE0CF0A", border: "1px solid #EDE0CF14", borderRadius: "16px", padding: "28px",
                transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms",
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 20px 48px -12px #EDE0CF30"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <StarRow count={r.rating} />
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text)", margin: "0 0 16px", opacity: 0.88 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>
                    {r.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{r.name}</span>
                  <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2D8659" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    <span style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600 }}>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "12px" }}>You might also love</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)", letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 48px" }}>More from our creamery</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {allProducts.filter((p) => p.img !== displayImg).slice(0, 3).map((p) => (
              <article key={p.id} onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)} style={{ cursor: "pointer", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ overflow: "hidden", borderRadius: "16px", background: "var(--surface)", marginBottom: "16px" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                  />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "var(--text)", margin: "0 0 4px" }}>{p.name}</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#090704", borderTop: "1px solid #EDE0CF10", padding: "64px 48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px", marginBottom: "48px" }}>
            <div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.03em", display: "block", marginBottom: "12px" }}>Glac</span>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, margin: "0 0 20px" }}>Bold flavors, artfully frozen. Handcrafted in small batches across India.</p>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 2h4l2 4-3 1.5a16 16 0 0 0 6.5 6.5L13 11l4 2v4a2 2 0 0 1-2 2A18 18 0 0 1 2 2z" },
                  { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                  { label: "Pinterest", path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" },
                ].map((s) => (
                  <button key={s.label} aria-label={s.label} style={{ background: "#EDE0CF10", border: "none", cursor: "pointer", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", transition: "background 180ms" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2D865920"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#EDE0CF10"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={s.path}/></svg>
                  </button>
                ))}
              </div>
            </div>
            {[
              { heading: "Shop", links: ["Pints", "Collections", "Gifts", "Subscriptions"] },
              { heading: "About Us", links: ["Our Story", "Sustainability", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 20px" }}>{col.heading}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map((l) => (
                    <button key={l} onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.875rem", fontFamily: "'Nunito Sans', sans-serif", textAlign: "left", padding: 0, transition: "color 180ms" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
                    >{l}</button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 20px" }}>Newsletter</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, margin: "0 0 16px" }}>New flavors, exclusive drops, and seasonal picks — straight to your inbox.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="email" placeholder="your@email.com" style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #EDE0CF20", background: "#EDE0CF08", color: "var(--text)", fontFamily: "'Nunito Sans', sans-serif", fontSize: "0.875rem", outline: "none" }} />
                <button style={{ padding: "12px 16px", borderRadius: "10px", border: "none", cursor: "pointer", background: "var(--accent)", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.875rem", transition: "transform 200ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >Subscribe</button>
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "8px", opacity: 0.7 }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #EDE0CF10", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>© {new Date().getFullYear()} Glac. All rights reserved. Made with love in India.</p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {["VISA", "MC", "AMEX", "UPI"].map((pm) => (
                <span key={pm} style={{ padding: "4px 10px", border: "1px solid #EDE0CF18", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 700, color: "var(--muted)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em" }}>{pm}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#14100AF0", borderTop: "1px solid #EDE0CF18",
        backdropFilter: "blur(16px)", padding: "12px 20px",
        display: "flex", alignItems: "center", gap: "12px",
      }} className="mobile-bar">
        <div>
          <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--muted)" }}>{sizeVariants[selectedSize].label}</p>
          <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>₹{currentPrice.toLocaleString("en-IN")}</p>
        </div>
        <button onClick={handleAddToCart} style={{
          flex: 1, padding: "14px 24px", borderRadius: "12px", border: "none", cursor: "pointer",
          background: added ? "#1a6640" : "var(--accent)", color: "#fff",
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem",
          boxShadow: "0 8px 24px -8px #2D865950",
          transition: "transform 200ms, background 200ms",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          {added ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Added!</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}