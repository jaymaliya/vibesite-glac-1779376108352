"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);
  const [cartBump, setCartBump] = useState(false);
  const bumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems !== prevTotalItems) {
      setPrevTotalItems(totalItems);
      setCartBump(true);
      if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
      bumpTimeoutRef.current = setTimeout(() => setCartBump(false), 400);
    }
  }, [totalItems, prevTotalItems]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Shop", path: "/shop" },
    { label: "Flavors", path: "/flavors" },
    { label: "Our Story", path: "/" },
    { label: "Locations", path: "/locations" },
    { label: "Gifts", path: "/gifts" },
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#0F0B06",
          borderBottom: scrolled ? "1px solid rgba(196,181,160,0.12)" : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px 0 rgba(237,224,207,0.07)"
            : "none",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Primary navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Logo — absolutely centered */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={() => router.push("/")}
              aria-label="Glac — go to homepage"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "8px",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 0 2px #2D8659")
              }
              onBlur={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: "28px",
                  letterSpacing: "-0.04em",
                  color: "#EDE0CF",
                  lineHeight: 1,
                }}
              >
                Glac
              </span>
            </button>
          </div>

          {/* Left spacer / hamburger mobile */}
          <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659")
              }
              onBlur={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              {menuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F5F0E8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop nav links — right of logo */}
          <div
            className="hidden lg:flex"
            style={{
              flex: "1",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "4px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.path)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: '"Nunito Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#F5F0E8",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  letterSpacing: "0.01em",
                  outline: "none",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2D8659";
                  e.currentTarget.style.backgroundColor =
                    "rgba(45,134,89,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#F5F0E8";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "rgba(196,181,160,0.25)",
                margin: "0 8px",
              }}
            />

            {/* Search icon */}
            <button
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2D8659";
                e.currentTarget.style.backgroundColor =
                  "rgba(45,134,89,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#F5F0E8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart icon */}
            <button
              onClick={() => router.push("/cart")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                outline: "none",
                transition:
                  "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2D8659";
                e.currentTarget.style.backgroundColor =
                  "rgba(45,134,89,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#F5F0E8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#c0392b",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    minWidth: "18px",
                    height: "18px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: '"Nunito Sans", sans-serif',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1,
                    transform: cartBump ? "scale(1.3)" : "scale(1)",
                    transition:
                      "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: cart on right side */}
          <div
            className="flex lg:hidden"
            style={{ alignItems: "center", gap: "4px" }}
          >
            {/* Search mobile */}
            <button
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659")
              }
              onBlur={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            {/* Cart mobile */}
            <button
              onClick={() => router.push("/cart")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#F5F0E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px #2D8659")
              }
              onBlur={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#c0392b",
                    color: "#ffffff",
                    borderRadius: "9999px",
                    minWidth: "18px",
                    height: "18px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: '"Nunito Sans", sans-serif',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1,
                    transform: cartBump ? "scale(1.3)" : "scale(1)",
                    transition:
                      "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 49,
          backgroundColor: "#0F0B06",
          display: "flex",
          flexDirection: "column",
          paddingTop: "88px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "40px",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          opacity: menuOpen ? 1 : 0,
          transition:
            "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: menuOpen ? "auto" : "none",
          overflowY: "auto",
        }}
      >
        <nav aria-label="Mobile navigation">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link, idx) => (
              <li key={link.label}>
                <button
                  onClick={() => {
                    router.push(link.path);
                    setMenuOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600,
                    fontSize: "32px",
                    letterSpacing: "-0.02em",
                    color: "#F5F0E8",
                    padding: "16px 0",
                    borderBottom:
                      idx < navLinks.length - 1
                        ? "1px solid rgba(196,181,160,0.12)"
                        : "none",
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
        </nav>

        {/* Mobile menu bottom */}
        <div style={{ marginTop: "auto", paddingTop: "40px" }}>
          <p
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: "13px",
              color: "#9B8B7E",
              marginBottom: "8px",
            }}
          >
            Made in India
          </p>
          <p
            style={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: "13px",
              color: "#9B8B7E",
            }}
          >
            Bold flavors, artfully frozen.
          </p>
        </div>
      </div>
    </>
  );
}