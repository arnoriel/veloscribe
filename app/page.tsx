"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  FileText,
  Users,
  ArrowRight,
  Check,
  Star,
  Lock,
  Globe,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import LandingNavbar from "@/components/landing/Navbar";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const C = {
  bg: "#06091A",
  bgCard: "#0C1428",
  accent: "#4D7FFF",
  accentLight: "#7AA3FF",
  accentGlow: "rgba(77,127,255,0.15)",
  accentBorder: "rgba(77,127,255,0.25)",
  text: "#E2EAFF",
  muted: "rgba(226,234,255,0.5)",
  dim: "rgba(226,234,255,0.28)",
  border: "rgba(226,234,255,0.07)",
};

const aiSuggestions = [
  "✨ Improve Writing",
  "🔧 Fix Grammar",
  "🎯 Change Tone",
  "▶ Continue",
  "📝 Summarize",
];

const demoLines = [
  { text: "Great communication starts with", type: "h" },
  { text: "clarity of thought, not speed of fingers.", type: "h-accent" },
  {
    text: "VeloScribe ensures every word you write is meaningful and hits the mark.",
    type: "p",
  },
];

function EditorMockup() {
  const [visible, setVisible] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    let n = 0;
    const step = () => {
      if (n < demoLines.length) {
        setVisible(n + 1);
        n++;
        setTimeout(step, n === 1 ? 500 : 700);
      } else {
        setTimeout(() => setShowAI(true), 700);
      }
    };
    setTimeout(step, 600);
  }, []);

  useEffect(() => {
    if (!showAI) return;
    let i = 0;
    const t = setInterval(() => {
      setActiveIdx(i % aiSuggestions.length);
      i++;
    }, 1100);
    return () => clearInterval(t);
  }, [showAI]);

  return (
    <div
      style={{
        background: "rgba(10, 15, 38, 0.95)",
        border: `1px solid ${C.accentBorder}`,
        borderRadius: 18,
        padding: "28px 32px",
        boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 240, height: 240,
        background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Window chrome */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22, alignItems: "center" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: "auto", fontSize: 11, color: C.dim }}>
          veloscribe.app / my-workspace
        </div>
      </div>

      {/* Doc title */}
      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 18, letterSpacing: "-0.02em" }}>
        Q4 2026 Content Strategy
      </div>

      {/* Lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {demoLines.map((line, i) => {
          if (i >= visible) return null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                fontSize: line.type.startsWith("h") ? 15 : 13,
                fontWeight: line.type.startsWith("h") ? 700 : 400,
                color: line.type === "h-accent" ? C.accentLight : "rgba(226,234,255,0.8)",
                lineHeight: 1.65,
                letterSpacing: line.type.startsWith("h") ? "-0.015em" : "normal",
              }}
            >
              {line.text}
            </motion.div>
          );
        })}

        {visible < demoLines.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
            style={{
              display: "inline-block", width: 2, height: 15,
              background: C.accent, verticalAlign: "middle", borderRadius: 1,
            }}
          />
        )}
      </div>

      {/* AI bar */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}
          >
            {aiSuggestions.map((s, i) => (
              <motion.div
                key={s}
                animate={{
                  background: activeIdx === i ? "rgba(77,127,255,0.2)" : "rgba(226,234,255,0.04)",
                  borderColor: activeIdx === i ? "rgba(77,127,255,0.5)" : "rgba(226,234,255,0.1)",
                  color: activeIdx === i ? "#7aa3ff" : "rgba(226,234,255,0.45)",
                }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "5px 12px", borderRadius: 8, border: "1px solid",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >
                {s}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slash hint */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              marginTop: 14, display: "flex", alignItems: "center", gap: 8,
              padding: "7px 12px", background: C.accentGlow,
              borderRadius: 8, border: `1px solid ${C.accentBorder}`,
            }}
          >
            <span style={{ color: C.accent, fontSize: 14, fontWeight: 800 }}>/</span>
            <span style={{ color: C.muted, fontSize: 12 }}>
              Type a command — Heading, Checklist, AI Assistant...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    tag: "AI Assistant",
    title: "AI that understands your writing context",
    desc: "Highlight text, pick an action — AI instantly improves phrasing, shifts tone, or continues your draft without ever leaving the editor.",
  },
  {
    icon: FileText,
    tag: "Smart Workspace",
    title: "An organised workspace with no limits",
    desc: "Pages inside pages. Find any document in seconds with CMD+K. A clean structure that follows the way your brain actually works.",
  },
  {
    icon: Users,
    tag: "Collaboration",
    title: "Collaborate without friction",
    desc: "See who's writing alongside you in real-time. Changes sync instantly — no refreshing, no waiting.",
  },
];

const testimonials = [
  {
    quote: "VeloScribe replaced both Notion and Grammarly for me. The AI actually understands context — it's not just templates.",
    name: "Rania M.",
    role: "Content Strategist",
  },
  {
    quote: "The 'Continue Writing' feature is insanely effective. Stuck mid-paragraph, one click, and it flows perfectly.",
    name: "Bimo A.",
    role: "Writer & Copywriter",
  },
  {
    quote: "The interface feels genuinely premium. Our entire 8-person team has moved from Notion to VeloScribe.",
    name: "Dea F.",
    role: "Product Manager",
  },
];

export default function HomePage() {
  return (
    <div
      className={jakarta.variable}
      style={{
        fontFamily: "var(--font-jakarta)",
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <LandingNavbar />

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bg glows */}
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(77,127,255,0.11) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "15%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(107,148,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, background: "radial-gradient(ellipse, rgba(77,127,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <style>{`
          @keyframes vs-shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes vs-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        `}</style>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 100,
            border: `1px solid ${C.accentBorder}`, background: C.accentGlow,
            marginBottom: 32, fontSize: 13, fontWeight: 600, color: C.accentLight,
          }}
        >
          <Sparkles size={13} />
          AI Writing Workspace — Free to Get Started
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          style={{
            fontSize: "clamp(40px, 6.5vw, 82px)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            textAlign: "center",
            maxWidth: 880,
            margin: "0 auto 24px",
          }}
        >
          Write Faster.
          <br />
          <span
            style={{
              background: "linear-gradient(120deg, #4d7fff 0%, #a5c0ff 45%, #4d7fff 80%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "vs-shimmer 4s ease infinite",
            }}
          >
            Think Clearer.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          style={{
            fontSize: "clamp(15px, 1.8vw, 19px)",
            lineHeight: 1.72,
            color: C.muted,
            textAlign: "center",
            maxWidth: 520,
            margin: "0 auto 48px",
            fontWeight: 400,
          }}
        >
          VeloScribe is the intelligent workspace that understands how you think — and helps turn those thoughts into writing that's perfectly on point.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.38 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
              color: "#fff", padding: "14px 32px", borderRadius: 11,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 8px 30px rgba(77,127,255,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(77,127,255,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(77,127,255,0.4)";
            }}
          >
            Start for Free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/features"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              border: `1px solid ${C.border}`, color: "rgba(226,234,255,0.72)",
              padding: "14px 28px", borderRadius: 11,
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              background: "rgba(226,234,255,0.04)",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(226,234,255,0.07)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(226,234,255,0.18)";
              (e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(226,234,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = C.border;
              (e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.72)";
            }}
          >
            See All Features
            <ChevronRight size={15} />
          </Link>
        </motion.div>

        {/* Editor demo */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.58 }}
          style={{ width: "100%", maxWidth: 680, margin: "64px auto 0" }}
        >
          <EditorMockup />
        </motion.div>
      </section>

      {/* ── Social proof strip ── */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "24px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          flexWrap: "wrap",
          background: "rgba(12, 20, 40, 0.5)",
        }}
      >
        <span style={{ fontSize: 12, color: C.dim, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Used by
        </span>
        {["Writers", "Content Creators", "Startup Founders", "Students", "Copywriters"].map((r) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(226,234,255,0.45)", fontSize: 13, fontWeight: 500 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, opacity: 0.6 }} />
            {r}
          </div>
        ))}
      </div>

      {/* ── Features preview ── */}
      <section style={{ padding: "112px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accent, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 18, height: 1.5, background: C.accent, opacity: 0.5 }} />
            Key Features
            <div style={{ width: 18, height: 1.5, background: C.accent, opacity: 0.5 }} />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.028em", lineHeight: 1.1, marginBottom: 16 }}>
            One workspace for every need.
          </h2>
          <p style={{ color: C.muted, fontSize: 17, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
            More than a text editor. VeloScribe is a thinking space that grows with the way you work.
          </p>
          <Link
            href="/features"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 600, color: C.accentLight,
              textDecoration: "none", padding: "8px 16px",
              borderRadius: 8, border: `1px solid ${C.accentBorder}`,
              background: C.accentGlow, transition: "background 0.2s",
            }}
          >
            Explore all features <ChevronRight size={14} />
          </Link>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: "28px 24px",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(77,127,255,0.1)", border: "1px solid rgba(77,127,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon size={19} color={C.accent} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.accent, marginBottom: 8, opacity: 0.85 }}>
                  {f.tag}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.35, letterSpacing: "-0.015em" }}>
                  {f.title}
                </h3>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA mid-page ── */}
      <section style={{ padding: "0 24px 112px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 860, margin: "0 auto",
            background: "linear-gradient(135deg, #0d1a3a 0%, #0c1f50 100%)",
            border: `1px solid ${C.accentBorder}`,
            borderRadius: 22, padding: "56px 48px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 300, background: `radial-gradient(ellipse, rgba(77,127,255,0.12) 0%, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accentLight, marginBottom: 16 }}>
              How It Works
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 16 }}>
              From thought to polished writing, in seconds.
            </h2>
            <p style={{ color: C.muted, fontSize: 16, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>
              See how VeloScribe integrates AI into every step of your writing — without ever disrupting your creative flow.
            </p>
            <Link
              href="/how-it-works"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
                color: "#fff", padding: "13px 28px", borderRadius: 10,
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 6px 24px rgba(77,127,255,0.4)",
              }}
            >
              See How It Works
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "0 24px 112px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 52 }}
          >
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10 }}>
              They&apos;ve already felt the difference.
            </h2>
            <p style={{ color: C.muted, fontSize: 15 }}>
              Not marketing copy — real experiences from real VeloScribe users.
            </p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: C.bgCard, border: `1px solid ${C.border}`,
                  borderRadius: 16, padding: "26px 22px",
                }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} fill={C.accent} color={C.accent} />
                  ))}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(226,234,255,0.78)", marginBottom: 18, fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(77,127,255,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative" }}
        >
          <h2 style={{ fontSize: "clamp(34px, 5.5vw, 68px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.032em", maxWidth: 660, margin: "0 auto 22px" }}>
            Your writing is waiting to begin.
          </h2>
          <p style={{ fontSize: 17, color: C.muted, maxWidth: 420, margin: "0 auto 44px", lineHeight: 1.7 }}>
            Free forever. No credit card required. Up and running in 30 seconds.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
              color: "#fff", padding: "16px 40px", borderRadius: 12,
              fontSize: 16, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 12px 40px rgba(77,127,255,0.45)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 50px rgba(77,127,255,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(77,127,255,0.45)";
            }}
          >
            Create a Free Account
            <ArrowRight size={17} />
          </Link>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {[
              { icon: Lock, label: "No credit card required" },
              { icon: Globe, label: "Access from anywhere" },
              { icon: Zap, label: "30-second setup" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.dim }}>
                <Icon size={13} /> {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>VeloScribe</span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Features", href: "/features" },
            { label: "How It Works", href: "/how-it-works" },
            { label: "Pricing", href: "/pricing" },
            { label: "Privacy", href: "/privacy" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{ color: C.dim, textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(226,234,255,0.7)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.dim)}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(226,234,255,0.2)" }}>© 2026 VeloScribe</div>
      </footer>
    </div>
  );
}
