"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export default function LandingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className={jakarta.variable} style={{ fontFamily: "var(--font-jakarta)" }}>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          background: scrolled ? "rgba(6, 9, 26, 0.92)" : "rgba(6, 9, 26, 0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(77, 127, 255, 0.12)" : "1px solid rgba(226, 234, 255, 0.04)",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #3b6ef0 0%, #6b94ff 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(77, 127, 255, 0.4)",
          }}>
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#e2eaff", letterSpacing: "-0.02em" }}>
            VeloScribe
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  position: "relative",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#7aa3ff" : "rgba(226,234,255,0.55)",
                  textDecoration: "none",
                  transition: "color 0.2s, background 0.2s",
                  background: active ? "rgba(77, 127, 255, 0.1)" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.85)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(226,234,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.55)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <span>{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="navbar-pill"
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 20,
                      height: 2,
                      borderRadius: 2,
                      background: "#4d7fff",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="hidden md:flex">
          <Link
            href="/login"
            style={{
              fontSize: 14, fontWeight: 500, color: "rgba(226,234,255,0.55)",
              textDecoration: "none", padding: "8px 12px", borderRadius: 8, transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.9)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.55)")}
          >
            Log In
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
              color: "#fff", padding: "8px 20px", borderRadius: 9,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(77, 127, 255, 0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(77, 127, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(77, 127, 255, 0.35)";
            }}
          >
            Try for Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(226,234,255,0.7)", padding: 4 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 64, left: 0, right: 0, zIndex: 199,
              background: "rgba(8, 12, 30, 0.98)", backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(77, 127, 255, 0.15)",
              padding: "16px 24px 24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: "12px 16px", borderRadius: 10,
                      fontSize: 15, fontWeight: active ? 700 : 500,
                      color: active ? "#7aa3ff" : "rgba(226,234,255,0.7)",
                      textDecoration: "none",
                      background: active ? "rgba(77, 127, 255, 0.1)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href="/login"
                  style={{
                    textAlign: "center", padding: "11px", borderRadius: 10,
                    fontSize: 14, fontWeight: 600, color: "rgba(226,234,255,0.65)",
                    textDecoration: "none", border: "1px solid rgba(226,234,255,0.1)",
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  style={{
                    textAlign: "center", padding: "11px", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, color: "#fff",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
                    boxShadow: "0 4px 14px rgba(77, 127, 255, 0.35)",
                  }}
                >
                  Try for Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
