"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Check,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Shield,
  Headphones,
  RefreshCw,
  Users,
  Star,
  Crown,
  Hammer,
  BookOpen,
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import LandingNavbar from "@/components/landing/Navbar";
import Link from "next/link";
import { useState } from "react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const C = {
  bg: "#06091A",
  bgCard: "#0C1428",
  bgDeep: "#08112a",
  bgPro: "linear-gradient(145deg, #0e1d42 0%, #0c2058 100%)",
  bgForge: "linear-gradient(145deg, #1a1000 0%, #2a1a00 100%)",
  accent: "#4D7FFF",
  accentLight: "#7AA3FF",
  accentGlow: "rgba(77,127,255,0.13)",
  accentBorder: "rgba(77,127,255,0.28)",
  text: "#E2EAFF",
  muted: "rgba(226,234,255,0.5)",
  dim: "rgba(226,234,255,0.28)",
  border: "rgba(226,234,255,0.07)",
  green: "#10b981",
  amber: "#f59e0b",
  amberGlow: "rgba(245,158,11,0.15)",
  amberBorder: "rgba(245,158,11,0.28)",
  amberLight: "#fbbf24",
};

// ─── Plans ───────────────────────────────────────────────────────────────────

const plans = [
  {
    id: "free",
    name: "The Apprentice",
    tier: "Free",
    icon: BookOpen,
    price: { monthly: "$0", yearly: "$0" },
    priceSub: { monthly: "forever free", yearly: "forever free" },
    desc: "Everything you need to start writing better. No time limits, no catch.",
    cta: "Get Started Free",
    ctaHref: "/login",
    highlighted: false,
    features: [
      { label: "Full block editor", included: true },
      { label: "Unlimited workspaces", included: true },
      { label: "Unlimited pages", included: true },
      { label: "CMD+K quick search", included: true },
      { label: "AI generation", included: true, note: "30× per day" },
      { label: "File upload", included: true, note: "Up to 5 MB/file" },
      { label: "Guests per workspace", included: true, note: "Up to 2" },
      { label: "Presence indicator", included: true },
      { label: "Page history", included: false },
      { label: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "The Architect",
    tier: "Pro",
    icon: Crown,
    price: { monthly: "$15", yearly: "$10" },
    priceSub: { monthly: "per month", yearly: "per month, billed $120/yr" },
    desc: "For serious writers, collaborative teams, and anyone who refuses to be limited.",
    cta: "Start 7-Day Free Trial",
    ctaHref: "/login",
    highlighted: true,
    badge: "MOST POPULAR",
    features: [
      { label: "Full block editor", included: true },
      { label: "Unlimited workspaces", included: true },
      { label: "Unlimited pages", included: true },
      { label: "CMD+K quick search", included: true },
      { label: "AI generation", included: true, note: "Unlimited" },
      { label: "File upload", included: true, note: "Up to 100 MB/file" },
      { label: "Guests per workspace", included: true, note: "Unlimited" },
      { label: "Presence indicator", included: true },
      { label: "Page history", included: true, note: "30 days" },
      { label: "Priority support", included: true },
    ],
  },
  {
    id: "team",
    name: "The Forge",
    tier: "Team",
    icon: Hammer,
    price: { monthly: "$12", yearly: "$10" },
    priceSub: { monthly: "per user/mo · min. 3 users", yearly: "per user/mo · billed annually" },
    desc: "Built for teams that build together. Shared workspaces, admin controls, and everything in Pro.",
    cta: "Contact Sales",
    ctaHref: "mailto:hi@veloscribe.app",
    highlighted: false,
    isTeam: true,
    features: [
      { label: "Everything in The Architect", included: true },
      { label: "Shared team workspaces", included: true },
      { label: "Admin & member roles", included: true },
      { label: "Team analytics dashboard", included: true },
      { label: "AI generation", included: true, note: "Unlimited" },
      { label: "File upload", included: true, note: "Up to 500 MB/file" },
      { label: "Guests per workspace", included: true, note: "Unlimited" },
      { label: "Page history", included: true, note: "90 days" },
      { label: "Dedicated onboarding", included: true },
      { label: "Priority & SLA support", included: true },
    ],
  },
];

const comparisonRows = [
  { category: "Editor", feature: "Block editor (headings, paragraphs, checklists, code, media)", free: true, pro: true, team: true },
  { category: "Editor", feature: "Slash command (/)", free: true, pro: true, team: true },
  { category: "Editor", feature: "Drag & drop blocks", free: true, pro: true, team: true },
  { category: "Editor", feature: "Code block + syntax highlighting", free: true, pro: true, team: true },
  { category: "Workspace", feature: "Unlimited workspaces", free: true, pro: true, team: true },
  { category: "Workspace", feature: "Nested pages (sub-pages)", free: true, pro: true, team: true },
  { category: "Workspace", feature: "CMD+K quick search", free: true, pro: true, team: true },
  { category: "Workspace", feature: "Favourites & Trash", free: true, pro: true, team: true },
  { category: "Workspace", feature: "Page history & restore", free: false, pro: "30 days", team: "90 days" },
  { category: "AI", feature: "Improve Writing", free: true, pro: true, team: true },
  { category: "AI", feature: "Fix Grammar", free: true, pro: true, team: true },
  { category: "AI", feature: "Change Tone", free: true, pro: true, team: true },
  { category: "AI", feature: "Continue Writing", free: true, pro: true, team: true },
  { category: "AI", feature: "Smart Summary", free: true, pro: true, team: true },
  { category: "AI", feature: "AI generations per day", free: "30×/day", pro: "Unlimited", team: "Unlimited" },
  { category: "Collaboration", feature: "Presence indicator", free: true, pro: true, team: true },
  { category: "Collaboration", feature: "Real-time sync", free: true, pro: true, team: true },
  { category: "Collaboration", feature: "Guests per workspace", free: "Up to 2", pro: "Unlimited", team: "Unlimited" },
  { category: "Collaboration", feature: "Admin & member roles", free: false, pro: false, team: true },
  { category: "Storage", feature: "Max file upload size", free: "5 MB/file", pro: "100 MB/file", team: "500 MB/file" },
  { category: "Support", feature: "Priority support", free: false, pro: true, team: true },
  { category: "Support", feature: "SLA & dedicated onboarding", free: false, pro: false, team: true },
];

const faqs = [
  {
    q: "Is the Free plan really free forever?",
    a: "Yes. The Apprentice plan has no time limit. You won't be pushed to upgrade, and all core features remain fully available at no cost. Upgrade to The Architect only when you need unlimited AI, larger file storage, or unlimited collaborators.",
  },
  {
    q: "What counts as one AI generation in the Free plan?",
    a: "Every time you use an AI feature — Improve Writing, Fix Grammar, Continue Writing, etc. — it counts as one use. On the Free plan you get 30 uses per day, resetting at midnight. That's plenty for normal daily writing.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. No long-term contracts. Cancel any time from your account dashboard and you won't be charged again after the current billing period ends. Your documents stay safe and accessible via the Free plan.",
  },
  {
    q: "What's the difference between monthly and annual billing?",
    a: "With annual billing, The Architect costs $10/month (billed $120/year) — saving you $60 compared to monthly. Choose monthly for flexibility, annual for value.",
  },
  {
    q: "What is the minimum for The Forge team plan?",
    a: "The Forge plan requires a minimum of 3 users at $12/user/month (monthly) or $10/user/month (annual). For teams under 3, The Architect covers everything you need.",
  },
  {
    q: "Is my data safe with VeloScribe?",
    a: "Data security is our top priority. All data is encrypted in transit and at rest. We never sell or share your data with third parties. Your documents belong to you — completely.",
  },
  {
    q: "Are there extra charges for AI usage on paid plans?",
    a: "No. For Architect and Forge users, all AI usage is included in your subscription. No per-token fees, no hidden charges.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "20px 0",
          background: "transparent", border: "none", cursor: "pointer",
          textAlign: "left", gap: 16,
        }}
      >
        <span style={{
          fontSize: 15, fontWeight: 600, lineHeight: 1.4,
          color: open ? C.text : "rgba(226,234,255,0.8)",
          fontFamily: "var(--font-jakarta)", transition: "color 0.2s",
        }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} color={open ? C.accent : C.dim} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.75, paddingBottom: 20 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [expandTable, setExpandTable] = useState(false);

  return (
    <div
      className={jakarta.variable}
      style={{ fontFamily: "var(--font-jakarta)", background: C.bg, color: C.text, minHeight: "100vh" }}
    >
      <LandingNavbar />

      {/* ── Hero ── */}
      <section
        style={{
          padding: "140px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(77,127,255,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, border: `1px solid ${C.accentBorder}`, background: C.accentGlow, marginBottom: 28, fontSize: 12, fontWeight: 600, color: C.accentLight }}>
            <Sparkles size={12} />
            VeloScribe Pricing
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.07, maxWidth: 700, margin: "0 auto 18px" }}>
            Start free.
            <br />
            <span style={{ color: C.accentLight }}>Upgrade when you&apos;re ready.</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: C.muted, maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.72 }}>
            No hidden fees. No long-term contracts. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(12,20,40,0.8)", border: `1px solid ${C.border}`, borderRadius: 100, padding: "4px" }}>
            <button
              onClick={() => setYearly(false)}
              style={{
                padding: "7px 18px", borderRadius: 100, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "var(--font-jakarta)",
                background: !yearly ? "rgba(77,127,255,0.2)" : "transparent",
                color: !yearly ? C.accentLight : C.muted,
                transition: "all 0.2s",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              style={{
                padding: "7px 18px", borderRadius: 100, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "var(--font-jakarta)",
                background: yearly ? "rgba(77,127,255,0.2)" : "transparent",
                color: yearly ? C.accentLight : C.muted,
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Annual
              <span style={{ fontSize: 10, fontWeight: 700, background: C.green, color: "#fff", padding: "2px 6px", borderRadius: 4 }}>
                Save 33%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Pricing cards ── */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
          }}>
            {plans.map((plan, i) => {
              const PlanIcon = plan.icon;
              const isTeam = plan.id === "team";
              const isHighlighted = plan.highlighted;

              const cardStyle = isHighlighted
                ? { background: C.bgPro, border: `1px solid ${C.accentBorder}`, boxShadow: "0 24px 64px rgba(77,127,255,0.18), 0 0 0 1px rgba(77,127,255,0.08) inset" }
                : isTeam
                  ? { background: C.bgForge, border: `1px solid ${C.amberBorder}` }
                  : { background: C.bgCard, border: `1px solid ${C.border}` };

              const accentColor = isTeam ? C.amberLight : C.accentLight;
              const accentGlow = isTeam ? C.amberGlow : C.accentGlow;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    borderRadius: 22,
                    padding: isHighlighted ? "40px 32px" : "36px 28px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    ...cardStyle,
                  }}
                >
                  {/* Badge */}
                  {isHighlighted && (
                    <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)", fontSize: 10, fontWeight: 800, padding: "6px 18px", borderBottomLeftRadius: 14, color: "#fff", letterSpacing: "0.08em" }}>
                      {plan.badge}
                    </div>
                  )}
                  {isTeam && (
                    <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)", fontSize: 10, fontWeight: 800, padding: "6px 18px", borderBottomLeftRadius: 14, color: "#fff", letterSpacing: "0.08em" }}>
                      TEAMS
                    </div>
                  )}

                  {/* Glow */}
                  <div style={{ position: "absolute", top: "30%", right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${accentGlow} 0%, transparent 65%)`, pointerEvents: "none" }} />

                  {/* Plan icon + tier */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: isTeam ? "rgba(245,158,11,0.12)" : isHighlighted ? "rgba(77,127,255,0.15)" : "rgba(226,234,255,0.06)",
                      border: `1px solid ${isTeam ? "rgba(245,158,11,0.3)" : isHighlighted ? "rgba(77,127,255,0.3)" : "rgba(226,234,255,0.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <PlanIcon size={17} color={accentColor} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, lineHeight: 1 }}>
                        {plan.tier}
                      </div>
                    </div>
                  </div>

                  {/* Plan name */}
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", color: C.text, marginBottom: 4 }}>
                    {plan.name}
                  </div>

                  {/* Price */}
                  <motion.div
                    key={yearly ? "yearly" : "monthly"}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ marginBottom: 6 }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {yearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {plan.id !== "free" && (
                        <span style={{ fontSize: 13, color: C.dim, fontWeight: 500 }}>/mo</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>
                      {yearly ? plan.priceSub.yearly : plan.priceSub.monthly}
                      {yearly && plan.id !== "free" && (
                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, background: "rgba(16, 185, 129, 0.15)", color: C.green, padding: "2px 7px", borderRadius: 4 }}>
                          Save 33%
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Desc */}
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${isHighlighted ? "rgba(77,127,255,0.15)" : isTeam ? "rgba(245,158,11,0.12)" : C.border}` }}>
                    {plan.desc}
                  </p>

                  {/* Feature list */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                    {plan.features.map((feat) => (
                      <li key={feat.label} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        {feat.included ? (
                          <div style={{
                            width: 17, height: 17, borderRadius: 5, flexShrink: 0, marginTop: 1,
                            background: isTeam ? "rgba(245,158,11,0.12)" : isHighlighted ? "rgba(77,127,255,0.2)" : "rgba(226,234,255,0.08)",
                            border: `1px solid ${isTeam ? "rgba(245,158,11,0.35)" : isHighlighted ? "rgba(77,127,255,0.4)" : "rgba(226,234,255,0.15)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Check size={10} color={accentColor} strokeWidth={2.5} />
                          </div>
                        ) : (
                          <div style={{ width: 17, height: 17, borderRadius: 5, background: "rgba(226,234,255,0.03)", border: "1px solid rgba(226,234,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <X size={10} color="rgba(226,234,255,0.2)" strokeWidth={2.5} />
                          </div>
                        )}
                        <div>
                          <span style={{ fontSize: 13, color: feat.included ? "rgba(226,234,255,0.8)" : C.dim }}>
                            {feat.label}
                          </span>
                          {feat.note && (
                            <span style={{ marginLeft: 5, fontSize: 11, fontWeight: 600, color: feat.included ? accentColor : C.dim }}>
                              — {feat.note}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "block", width: "100%", textAlign: "center",
                      padding: "13px", borderRadius: 11,
                      fontSize: 14, fontWeight: 700, textDecoration: "none",
                      transition: "all 0.2s",
                      ...(isHighlighted
                        ? { background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)", color: "#fff", boxShadow: "0 6px 22px rgba(77,127,255,0.4)" }
                        : isTeam
                          ? { background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)", color: "#fff", boxShadow: "0 6px 22px rgba(245,158,11,0.3)" }
                          : { background: "rgba(226,234,255,0.06)", color: "rgba(226,234,255,0.72)", border: `1px solid ${C.border}` }),
                    }}
                  >
                    {plan.cta}
                  </Link>

                  {isHighlighted && (
                    <p style={{ textAlign: "center", fontSize: 12, color: C.dim, marginTop: 10 }}>
                      7-day free trial — no credit card required
                    </p>
                  )}
                  {isTeam && (
                    <p style={{ textAlign: "center", fontSize: 12, color: C.dim, marginTop: 10 }}>
                      Minimum 3 users · custom billing available
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 44, flexWrap: "wrap" }}>
            {[
              { icon: Shield, label: "Secure & encrypted payments" },
              { icon: RefreshCw, label: "Cancel anytime" },
              { icon: Headphones, label: "Responsive support" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.dim }}>
                <Icon size={14} color={C.accentLight} opacity={0.7} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section style={{ padding: "0 24px 96px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", paddingTop: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 44, textAlign: "center" }}
          >
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 12 }}>
              Full feature comparison
            </h2>
            <p style={{ color: C.muted, fontSize: 15 }}>Everything you get on each plan — in one place.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ background: C.bgCard, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}
          >
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: "16px 24px", fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: "0.05em", textTransform: "uppercase" }}>Feature</div>
              <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 12, fontWeight: 700, color: C.muted }}>Apprentice</div>
              <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 12, fontWeight: 700, color: C.accentLight, background: "rgba(77,127,255,0.07)" }}>Architect</div>
              <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 12, fontWeight: 700, color: C.amberLight, background: "rgba(245,158,11,0.05)" }}>Forge</div>
            </div>

            {/* Rows */}
            {(() => {
              const rows = expandTable ? comparisonRows : comparisonRows.slice(0, 12);
              let lastCategory = "";
              return rows.map((row, i) => {
                const showCategory = row.category !== lastCategory;
                lastCategory = row.category;
                return (
                  <div key={row.feature}>
                    {showCategory && (
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "rgba(77,127,255,0.04)", borderBottom: `1px solid ${C.border}`, borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ padding: "9px 24px", fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{row.category}</div>
                        <div />
                        <div style={{ background: "rgba(77,127,255,0.05)" }} />
                        <div style={{ background: "rgba(245,158,11,0.03)" }} />
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ padding: "11px 24px", fontSize: 13, color: "rgba(226,234,255,0.72)" }}>{row.feature}</div>
                      {/* Free */}
                      <div style={{ padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {typeof row.free === "boolean"
                          ? (row.free ? <Check size={15} color="rgba(226,234,255,0.5)" strokeWidth={2.5} /> : <X size={13} color="rgba(226,234,255,0.18)" strokeWidth={2.5} />)
                          : <span style={{ fontSize: 11.5, color: "rgba(226,234,255,0.55)", fontWeight: 500, textAlign: "center" }}>{row.free}</span>}
                      </div>
                      {/* Pro */}
                      <div style={{ padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(77,127,255,0.04)" }}>
                        {typeof row.pro === "boolean"
                          ? (row.pro ? <Check size={15} color={C.accentLight} strokeWidth={2.5} /> : <X size={13} color="rgba(226,234,255,0.18)" strokeWidth={2.5} />)
                          : <span style={{ fontSize: 11.5, color: C.accentLight, fontWeight: 600, textAlign: "center" }}>{row.pro}</span>}
                      </div>
                      {/* Team */}
                      <div style={{ padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(245,158,11,0.03)" }}>
                        {typeof row.team === "boolean"
                          ? (row.team ? <Check size={15} color={C.amberLight} strokeWidth={2.5} /> : <X size={13} color="rgba(226,234,255,0.18)" strokeWidth={2.5} />)
                          : <span style={{ fontSize: 11.5, color: C.amberLight, fontWeight: 600, textAlign: "center" }}>{row.team}</span>}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}

            {!expandTable && (
              <div style={{ textAlign: "center", padding: "16px" }}>
                <button
                  onClick={() => setExpandTable(true)}
                  style={{
                    background: "transparent", border: `1px solid ${C.border}`,
                    borderRadius: 8, padding: "8px 20px",
                    fontSize: 13, fontWeight: 600, color: C.muted,
                    cursor: "pointer", fontFamily: "var(--font-jakarta)",
                    display: "inline-flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  Show all features <ChevronDown size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "0 24px 96px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 980, margin: "0 auto", paddingTop: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10 }}>
              Why they chose to upgrade.
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {[
              { quote: "Unlimited AI on the Architect plan is a game-changer. I generate 20+ content drafts a week — no limits, no stress.", name: "Hafidz R.", role: "Content Strategist", plan: "Architect" },
              { quote: "Page history saved a proposal I accidentally deleted. Absolutely worth every cent.", name: "Tiara W.", role: "Freelance Writer", plan: "Architect" },
              { quote: "Our 8-person team all moved into one Forge workspace. The collaboration is so much smoother now.", name: "Arif M.", role: "Product Manager", plan: "Forge" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 20px" }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} fill={C.accent} color={C.accent} />)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(226,234,255,0.78)", marginBottom: 16, fontStyle: "italic" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: C.dim }}>{t.role}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                    ...(t.plan === "Forge"
                      ? { background: "rgba(245,158,11,0.15)", color: C.amberLight }
                      : { background: "rgba(77,127,255,0.15)", color: C.accentLight }),
                  }}>
                    {t.plan}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "0 24px 96px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", paddingTop: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 40 }}
          >
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 12 }}>
              Frequently asked questions
            </h2>
            <p style={{ color: C.muted, fontSize: 15 }}>
              Still have questions?{" "}
              <a href="mailto:hi@veloscribe.app" style={{ color: C.accentLight, textDecoration: "none" }}>
                Reach out to us
              </a>
              .
            </p>
          </motion.div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(77,127,255,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative" }}
        >
          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 18 }}>
            Start free today.
          </h2>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 400, margin: "0 auto 40px", lineHeight: 1.7 }}>
            No reason to wait. The Apprentice plan is free — forever.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
                color: "#fff", padding: "15px 36px", borderRadius: 11,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 8px 30px rgba(77,127,255,0.4)",
              }}
            >
              Sign Up Free — Now <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {["No credit card required", "Cancel anytime", "30-second setup"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: C.dim }}>
                <Check size={12} color={C.accentLight} opacity={0.6} /> {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
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
            <Link key={l.label} href={l.href} style={{ color: C.dim, textDecoration: "none", fontSize: 13 }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(226,234,255,0.2)" }}>© 2026 VeloScribe</div>
      </footer>
    </div>
  );
}
