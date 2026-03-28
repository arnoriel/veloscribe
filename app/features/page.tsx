"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Layers,
  FileText,
  Users,
  Code2,
  Image as ImageIcon,
  Search,
  Star,
  History,
  Trash2,
  Eye,
  MousePointer2,
  Type,
  CheckSquare,
  ArrowRight,
  ChevronRight,
  Wand2,
  RefreshCw,
  AlignLeft,
  Mic2,
  Check,
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
  bgCardDeep: "#08112a",
  accent: "#4D7FFF",
  accentLight: "#7AA3FF",
  accentGlow: "rgba(77,127,255,0.13)",
  accentBorder: "rgba(77,127,255,0.25)",
  text: "#E2EAFF",
  muted: "rgba(226,234,255,0.5)",
  dim: "rgba(226,234,255,0.28)",
  border: "rgba(226,234,255,0.07)",
};

// ─── Feature data ─────────────────────────────────────────────────────────────

const aiFeatures = [
  {
    icon: Wand2,
    title: "Improve Writing",
    desc: "AI refines your word choice and style without altering your original meaning. Select any text, one click, and the result lands instantly.",
  },
  {
    icon: RefreshCw,
    title: "Fix Grammar",
    desc: "Automatically detect and fix grammatical errors — from punctuation to ambiguous sentence structures.",
  },
  {
    icon: Mic2,
    title: "Change Tone",
    desc: "Shift your writing to Formal, Casual, or Professional in seconds. Perfect for any communication context.",
  },
  {
    icon: ChevronRight,
    title: "Continue Writing",
    desc: "AI reads 5–10 content blocks above your cursor position and continues the next paragraph with pinpoint accuracy.",
  },
  {
    icon: AlignLeft,
    title: "Smart Summary",
    desc: "Auto-generate a summary of your entire document — ideal for executive summaries, TL;DRs, or article abstracts.",
  },
];

const editorFeatures = [
  {
    icon: Type,
    title: "Slash Command (/)",
    desc: "Type / anywhere to open the command menu. Pick a Heading, Paragraph, Checklist, or AI Assistant block — all in one motion.",
  },
  {
    icon: MousePointer2,
    title: "Drag & Drop Blocks",
    desc: "Drag and reorder content blocks anytime. Reorganising a document's structure feels as easy as moving sticky notes.",
  },
  {
    icon: CheckSquare,
    title: "Checklist & To-do",
    desc: "Build task lists directly inside your documents. Check items off one by one without leaving for another app.",
  },
  {
    icon: Code2,
    title: "Code Block + Syntax Highlighting",
    desc: "Write and display code with clean syntax highlighting. Supports all popular programming languages.",
  },
  {
    icon: ImageIcon,
    title: "Media & Image Block",
    desc: "Upload images directly to your workspace and render them inline. Make ideas more visual and engaging.",
  },
];

const workspaceFeatures = [
  {
    icon: Layers,
    title: "Infinite Nesting (Sub-pages)",
    desc: "Create pages inside pages, with no depth limit. Structure knowledge bases, projects, or research to match the way you think.",
  },
  {
    icon: Search,
    title: "Quick Search (CMD+K)",
    desc: "Find any document in your workspace in seconds. Hit the shortcut, type a name — done.",
  },
  {
    icon: Star,
    title: "Favourites",
    desc: "Pin important pages for fast access. Starred pages always appear at the top of your sidebar.",
  },
  {
    icon: Trash2,
    title: "Trash & Soft Delete",
    desc: "Deleted documents don't vanish immediately. You have time to recover them before they're permanently removed.",
  },
  {
    icon: History,
    title: "Page History (Pro)",
    desc: "Access and restore any document version up to 30 days back. No change is ever unrecoverable.",
  },
];

const collabFeatures = [
  {
    icon: Eye,
    title: "Presence Indicator",
    desc: "See real-time avatars of who else has the same document open. Team coordination becomes easy and transparent.",
  },
  {
    icon: Zap,
    title: "Optimistic UI",
    desc: "Changes appear instantly on your screen — no waiting for server confirmation. A fast, responsive writing experience.",
  },
  {
    icon: Users,
    title: "Multi-user Collaboration",
    desc: "Invite collaborators to a workspace. Access together, edit together, grow together — in one synchronised space.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "26px 22px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, width: 90, height: 90,
        background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "rgba(77,127,255,0.1)", border: "1px solid rgba(77,127,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        <Icon size={18} color={C.accent} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.35, letterSpacing: "-0.012em", color: C.text }}>
        {title}
      </h3>
      <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.68 }}>{desc}</p>
    </motion.div>
  );
}

function FeatureSection({
  id, tag, title, subtitle, features, accent = false,
}: {
  id: string; tag: string; title: string; subtitle: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  accent?: boolean;
}) {
  return (
    <section
      id={id}
      style={{
        padding: "96px 24px",
        background: accent ? "rgba(12,20,40,0.6)" : "transparent",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 52 }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>
            {tag}
          </div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, maxWidth: 600, marginBottom: 14 }}>
            {title}
          </h2>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 520, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <div
      className={jakarta.variable}
      style={{ fontFamily: "var(--font-jakarta)", background: C.bg, color: C.text, minHeight: "100vh" }}
    >
      <LandingNavbar />

      {/* ── Hero ── */}
      <section style={{ padding: "140px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(77,127,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, border: `1px solid ${C.accentBorder}`, background: C.accentGlow, marginBottom: 28, fontSize: 12, fontWeight: 600, color: C.accentLight }}>
            <Sparkles size={12} />
            All VeloScribe Features
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.07, maxWidth: 760, margin: "0 auto 20px" }}>
            Built for a smarter way to work.
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: C.muted, maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.72 }}>
            Every VeloScribe feature was born from a single question: how do we make writing more intuitive, faster, and higher quality?
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)",
              color: "#fff", padding: "13px 28px", borderRadius: 10,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(77,127,255,0.4)",
            }}
          >
            Try All Features — Free
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      {/* ── Quick nav ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(12,20,40,0.5)" }}>
        <div style={{ maxWidth: 555, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
          {[
            { label: "AI Intelligence", href: "#ai" },
            { label: "Block Editor", href: "#editor" },
            { label: "Workspace", href: "#workspace" },
            { label: "Collaboration", href: "#collab" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                padding: "16px 20px", fontSize: 13, fontWeight: 600, color: C.muted,
                textDecoration: "none", whiteSpace: "nowrap",
                borderBottom: "2px solid transparent", transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.text;
                (e.currentTarget as HTMLElement).style.borderBottomColor = C.accent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.muted;
                (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── AI section ── */}
      <section id="ai" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 52 }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>
              AI Intelligence
            </div>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, maxWidth: 600, marginBottom: 14 }}>
              AI that works inside your editor, not in another tab.
            </h2>
            <p style={{ color: C.muted, fontSize: 16, maxWidth: 520, lineHeight: 1.7 }}>
              No copy-pasting into ChatGPT. No switching tabs. VeloScribe&apos;s AI reads the context of your writing and delivers results right at your cursor.
            </p>
          </motion.div>

          {/* Big feature highlight */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "linear-gradient(135deg, #0d1a3a 0%, #0c1f50 100%)",
              border: `1px solid ${C.accentBorder}`,
              borderRadius: 20,
              padding: "40px 44px",
              marginBottom: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "50%", right: -60, transform: "translateY(-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(77,127,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

            {/* Left: Text */}
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(77,127,255,0.15)", border: "1px solid rgba(77,127,255,0.3)", fontSize: 11, fontWeight: 700, color: C.accentLight, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <Sparkles size={11} /> Signature Feature
              </div>
              <h3 style={{ fontSize: "clamp(20px, 2.8vw, 32px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 14 }}>
                AI Selection Menu — Highlight, Click, Done.
              </h3>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                Select any part of your writing and an AI pop-up appears instantly. Choose the action you need — from fixing grammar to completely shifting the writing&apos;s tone — without ever leaving the editor.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Improve Writing — refine word choice without changing meaning",
                  "Fix Grammar — correct errors with precision",
                  "Change Tone — formal, casual, or professional",
                  "Continue Writing — extend your draft with full context",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(226,234,255,0.75)" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(77,127,255,0.2)", border: "1px solid rgba(77,127,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} color={C.accent} strokeWidth={2.5} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mini mockup */}
            <div>
              <div style={{ background: "rgba(8,15,35,0.9)", borderRadius: 12, padding: "20px", border: "1px solid rgba(77,127,255,0.2)" }}>
                <div style={{ fontSize: 13, color: "rgba(226,234,255,0.7)", lineHeight: 1.6, marginBottom: 16 }}>
                  <span style={{ background: "rgba(77,127,255,0.25)", color: C.accentLight, padding: "2px 4px", borderRadius: 3 }}>
                    Effective content marketing strategy requires a deep understanding of your target audience and their content consumption habits
                  </span>
                  {" "}in an ever-evolving digital landscape.
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["✨ Improve", "🔧 Fix Grammar", "🎯 Change Tone", "▶ Continue", "📝 Summarize"].map((s, i) => (
                    <div key={s} style={{
                      padding: "5px 10px", borderRadius: 7,
                      border: `1px solid ${i === 0 ? "rgba(77,127,255,0.5)" : "rgba(226,234,255,0.1)"}`,
                      background: i === 0 ? "rgba(77,127,255,0.2)" : "rgba(226,234,255,0.03)",
                      fontSize: 11, fontWeight: 600,
                      color: i === 0 ? C.accentLight : "rgba(226,234,255,0.4)",
                    }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {aiFeatures.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Editor ── */}
      <FeatureSection
        id="editor"
        tag="Block Editor"
        title="An editor that works the way your brain does."
        subtitle="Not your average text editor. VeloScribe uses a block system that makes document organisation feel natural and intuitive."
        features={editorFeatures}
        accent={true}
      />

      {/* ── Workspace ── */}
      <FeatureSection
        id="workspace"
        tag="Smart Workspace"
        title="A workspace that grows with your projects."
        subtitle="From daily notes to a company knowledge base — VeloScribe holds it all together, without the clutter."
        features={workspaceFeatures}
      />

      {/* ── Collaboration ── */}
      <FeatureSection
        id="collab"
        tag="Real-time Collaboration"
        title="Write together. Grow together."
        subtitle="Real-time sync, presence indicators, and optimistic UI — collaboration feels as smooth as working solo."
        features={collabFeatures}
        accent={true}
      />

      {/* ── Comparison table ── */}
      <section style={{ padding: "96px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 12 }}>
              Apprentice vs Architect — what&apos;s the difference?
            </h2>
            <p style={{ color: C.muted, fontSize: 15 }}>
              Start free, upgrade when you&apos;re ready.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ background: C.bgCard, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden" }}
          >
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: C.bgCardDeep, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: "16px 24px", fontSize: 13, fontWeight: 600, color: C.muted }}>Feature</div>
              <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.muted }}>Apprentice</div>
              <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.accentLight, background: "rgba(77,127,255,0.08)" }}>Architect</div>
            </div>

            {[
              { feature: "Full block editor", free: "✓", pro: "✓" },
              { feature: "AI generation", free: "30×/day", pro: "Unlimited" },
              { feature: "File upload", free: "Up to 5 MB", pro: "Up to 100 MB" },
              { feature: "Guests per workspace", free: "Up to 2", pro: "Unlimited" },
              { feature: "Page history", free: "—", pro: "30 days" },
              { feature: "CMD+K quick search", free: "✓", pro: "✓" },
              { feature: "Unlimited workspaces", free: "✓", pro: "✓" },
              { feature: "Presence indicator", free: "✓", pro: "✓" },
              { feature: "Priority support", free: "—", pro: "✓" },
            ].map((row, i) => (
              <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderBottom: i < 8 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ padding: "14px 24px", fontSize: 14, color: "rgba(226,234,255,0.75)" }}>{row.feature}</div>
                <div style={{ padding: "14px 24px", textAlign: "center", fontSize: 13, color: row.free === "—" ? C.dim : "rgba(226,234,255,0.6)", fontWeight: row.free === "✓" ? 600 : 400 }}>{row.free}</div>
                <div style={{ padding: "14px 24px", textAlign: "center", fontSize: 13, color: row.pro === "—" ? C.dim : C.accentLight, fontWeight: row.pro !== "—" ? 600 : 400, background: "rgba(77,127,255,0.05)" }}>{row.pro}</div>
              </div>
            ))}
          </motion.div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link
              href="/pricing"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 14, fontWeight: 600, color: C.accentLight,
                textDecoration: "none", padding: "9px 18px",
                borderRadius: 8, border: `1px solid ${C.accentBorder}`, background: C.accentGlow,
              }}
            >
              See full pricing details <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 18 }}>
            Ready to try every feature?
          </h2>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 400, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Free forever. No credit card required.
          </p>
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
            Get Started — Free
            <ArrowRight size={16} />
          </Link>
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
          ].map((l) => (
            <Link key={l.label} href={l.href} style={{ color: C.dim, textDecoration: "none", fontSize: 13 }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(226,234,255,0.2)" }}>© 2025 VeloScribe</div>
      </footer>
    </div>
  );
}
