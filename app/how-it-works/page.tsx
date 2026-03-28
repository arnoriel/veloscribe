"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  Type,
  MousePointer2,
  Wand2,
  Share2,
  Play,
  Command,
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
  bgDeep: "#08112a",
  accent: "#4D7FFF",
  accentLight: "#7AA3FF",
  accentGlow: "rgba(77,127,255,0.13)",
  accentBorder: "rgba(77,127,255,0.25)",
  text: "#E2EAFF",
  muted: "rgba(226,234,255,0.5)",
  dim: "rgba(226,234,255,0.28)",
  border: "rgba(226,234,255,0.07)",
};

// ─── Steps ────────────────────────────────────────────────────────────────────

const mainSteps = [
  {
    n: "01",
    icon: Type,
    title: "Create a workspace & start writing",
    subtitle: "Your first workspace — free, forever.",
    desc: "Sign up in seconds, create a new workspace, and start writing on your first blank page. No complicated setup. No required templates. Just write.",
    details: [
      "Create workspaces for projects, teams, or personal use",
      "Unlimited nested pages — organised like folders",
      "Autosave — you'll never lose your work",
      "Sidebar navigation for instant document switching",
    ],
    visual: (
      <div style={{
        background: "rgba(8,15,35,0.9)", borderRadius: 14,
        border: `1px solid rgba(77,127,255,0.25)`, padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", gap: 16, height: 220 }}>
          {/* Sidebar */}
          <div style={{ width: 160, borderRight: "1px solid rgba(226,234,255,0.07)", paddingRight: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(226,234,255,0.3)", marginBottom: 12 }}>
              My Workspace
            </div>
            {[
              { icon: "📄", label: "2025 Strategy", active: true, depth: 0 },
              { icon: "📄", label: "Q1 Plan", active: false, depth: 1 },
              { icon: "📄", label: "Q2 Plan", active: false, depth: 1 },
              { icon: "📝", label: "Meeting Notes", active: false, depth: 0 },
              { icon: "📁", label: "Research", active: false, depth: 0 },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 8px", marginLeft: item.depth * 14,
                  borderRadius: 6,
                  background: item.active ? "rgba(77,127,255,0.15)" : "transparent",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 11 }}>{item.icon}</span>
                <span style={{ fontSize: 11, color: item.active ? "#7AA3FF" : "rgba(226,234,255,0.5)", fontWeight: item.active ? 600 : 400 }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
          {/* Editor area */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#E2EAFF", marginBottom: 12, letterSpacing: "-0.02em" }}>2025 Strategy</div>
            {[85, 100, 70, 90, 55].map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                style={{ height: 8, width: `${w}%`, background: i === 0 ? "rgba(226,234,255,0.2)" : "rgba(226,234,255,0.08)", borderRadius: 4, marginBottom: 8, transformOrigin: "left" }}
              />
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              style={{ width: 2, height: 14, background: "#4D7FFF", borderRadius: 1, marginTop: 4 }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    icon: MousePointer2,
    title: "Structure ideas with the block editor",
    subtitle: "Think in blocks, not long paragraphs.",
    desc: "Press / to add a new block — heading, checklist, image, code, or divider. Drag to reorder. The editor follows your thinking, not the other way around.",
    details: [
      "Slash command (/) for every block type",
      "Drag & drop for instant content reorganisation",
      "Code blocks with syntax highlighting",
      "Images and media directly inside your document",
    ],
    visual: (
      <div style={{
        background: "rgba(8,15,35,0.9)", borderRadius: 14,
        border: "1px solid rgba(77,127,255,0.25)", padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 700, color: "#E2EAFF" }}>Product Launch Plan</div>
        {[
          { type: "h2", content: "🎯 Goals", color: "rgba(226,234,255,0.9)" },
          { type: "p", content: "Ship MVP to 500 early users in Q1...", color: "rgba(226,234,255,0.6)" },
          { type: "todo", content: "Finalise landing page", color: "rgba(226,234,255,0.65)", done: true },
          { type: "todo", content: "Set up payment gateway", color: "rgba(226,234,255,0.65)", done: false },
          { type: "slash", content: "/", color: "#4D7FFF" },
        ].map((block, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
          >
            {block.type === "todo" && (
              <div style={{
                width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                border: `1.5px solid ${(block as { done?: boolean }).done ? "#4D7FFF" : "rgba(226,234,255,0.2)"}`,
                background: (block as { done?: boolean }).done ? "#4D7FFF" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {(block as { done?: boolean }).done && <Check size={9} color="#fff" strokeWidth={3} />}
              </div>
            )}
            {block.type === "slash" && (
              <div style={{ width: 14, height: 14, borderRadius: 4, border: "1px solid rgba(77,127,255,0.25)", background: "rgba(77,127,255,0.13)", flexShrink: 0 }} />
            )}
            <span style={{ fontSize: block.type === "h2" ? 14 : 12.5, fontWeight: block.type === "h2" ? 700 : 400, color: block.color, letterSpacing: block.type === "h2" ? "-0.01em" : "normal" }}>
              {block.content}
            </span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{ background: "rgba(12,20,48,0.98)", border: "1px solid rgba(77,127,255,0.25)", borderRadius: 10, padding: "8px 0", marginTop: 4, boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}
        >
          {[{ icon: "H", label: "Heading" }, { icon: "✓", label: "Checklist" }, { icon: "✨", label: "AI Assistant" }].map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", background: i === 2 ? "rgba(77,127,255,0.12)" : "transparent" }}>
              <span style={{ fontSize: 11, fontWeight: 700, width: 18, textAlign: "center", color: i === 2 ? "#4D7FFF" : "rgba(226,234,255,0.4)" }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: i === 2 ? "#7AA3FF" : "rgba(226,234,255,0.6)", fontWeight: i === 2 ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    n: "03",
    icon: Wand2,
    title: "Activate AI exactly when you need it",
    subtitle: "AI that's present, not intrusive.",
    desc: "Highlight text to improve, shift tone, or summarise. Or press / and select AI Assistant to continue writing from the cursor. AI streams results word by word — it feels like thinking together, not waiting for a machine.",
    details: [
      "Highlight → AI pop-up appears automatically",
      "Continue Writing reads 5–10 blocks of context above",
      "Real-time streaming — no loading screen",
      "Smart Summary to create abstracts for long documents",
    ],
    visual: (
      <div style={{
        background: "rgba(8,15,35,0.9)", borderRadius: 14,
        border: "1px solid rgba(77,127,255,0.25)", padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontSize: 13, color: "rgba(226,234,255,0.7)", lineHeight: 1.65, marginBottom: 14 }}>
          <span style={{ background: "rgba(77,127,255,0.22)", color: "#7AA3FF", padding: "1px 3px", borderRadius: 3 }}>
            An effective content marketing strategy requires a deep understanding of your target audience and how they consume content
          </span>
          {" "}in a constantly evolving digital landscape.
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}
        >
          {["✨ Improve", "🔧 Fix Grammar", "🎯 Change Tone →", "▶ Continue", "📝 Summarize"].map((s, i) => (
            <div key={s} style={{
              padding: "4px 10px", borderRadius: 6,
              border: `1px solid ${i === 0 ? "rgba(77,127,255,0.5)" : "rgba(226,234,255,0.1)"}`,
              background: i === 0 ? "rgba(77,127,255,0.18)" : "rgba(226,234,255,0.03)",
              fontSize: 10.5, fontWeight: 600,
              color: i === 0 ? "#7AA3FF" : "rgba(226,234,255,0.4)",
            }}>
              {s}
            </div>
          ))}
        </motion.div>
        <div style={{ background: "rgba(77,127,255,0.06)", borderRadius: 8, border: "1px solid rgba(77,127,255,0.15)", padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4D7FFF", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>✨ AI is writing...</div>
          <div style={{ fontSize: 12.5, color: "rgba(226,234,255,0.7)", lineHeight: 1.65 }}>
            A successful content strategy is built on a solid foundation of audience research.
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              style={{ display: "inline-block", width: 2, height: 13, background: "#4D7FFF", verticalAlign: "middle", borderRadius: 1, marginLeft: 2 }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "04",
    icon: Share2,
    title: "Collaborate & share your work",
    subtitle: "Write together, or share with the world.",
    desc: "Invite your team to a workspace and see who's writing what in real-time. Everything syncs instantly — you focus on writing, VeloScribe handles the rest.",
    details: [
      "Presence indicator — see collaborators in real-time",
      "Invite guests without requiring them to register",
      "Changes sync instantly to all devices",
      "Access from any browser — nothing to install",
    ],
    visual: (
      <div style={{
        background: "rgba(8,15,35,0.9)", borderRadius: 14,
        border: "1px solid rgba(77,127,255,0.25)", padding: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: "rgba(226,234,255,0.5)", fontWeight: 500 }}>Currently on this page:</div>
          <div style={{ display: "flex" }}>
            {[{ name: "Rania", color: "#4d7fff" }, { name: "Bimo", color: "#7c3aed" }, { name: "Dea", color: "#10b981" }].map((u, i) => (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
                title={u.name}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: u.color,
                  border: "2px solid rgba(8,15,35,1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#fff",
                  marginLeft: i > 0 ? -8 : 0,
                  position: "relative", zIndex: 3 - i,
                }}
              >
                {u.name[0]}
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Live</span>
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#E2EAFF", marginBottom: 10 }}>Q4 Campaign Brief</div>
        {[80, 100, 65, 90].map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{ height: 7, width: `${w}%`, background: "rgba(226,234,255,0.1)", borderRadius: 4, marginBottom: 7, transformOrigin: "left" }}
          />
        ))}
        <motion.div
          animate={{ x: [0, 12, 0], y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#7c3aed"><path d="M5 3l14 9-7 1-4 7z"/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#7c3aed", padding: "2px 7px", borderRadius: 4 }}>Bimo</span>
        </motion.div>
      </div>
    ),
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
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
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, border: `1px solid ${C.accentBorder}`, background: C.accentGlow, marginBottom: 28, fontSize: 12, fontWeight: 600, color: C.accentLight }}>
            <Play size={11} fill={C.accentLight} />
            How VeloScribe Works
          </div>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 70px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.07, maxWidth: 720, margin: "0 auto 20px" }}>
            From first idea to finished writing — in one workspace.
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: C.muted, maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.72 }}>
            Four simple steps. One flow that feels completely natural. VeloScribe is designed so you focus on writing, not on learning a tool.
          </p>

          {/* Step preview pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {mainSteps.map((s) => (
              <a
                key={s.n}
                href={`#step-${s.n}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 100,
                  border: `1px solid ${C.border}`, background: "rgba(226,234,255,0.03)",
                  fontSize: 12, fontWeight: 600, color: C.muted,
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.accentBorder;
                  (e.currentTarget as HTMLElement).style.color = C.accentLight;
                  (e.currentTarget as HTMLElement).style.background = C.accentGlow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.color = C.muted;
                  (e.currentTarget as HTMLElement).style.background = "rgba(226,234,255,0.03)";
                }}
              >
                <span style={{ fontWeight: 800, color: C.accent }}>{s.n}</span>
                {s.title.split(" ").slice(0, 3).join(" ")}...
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Steps ── */}
      <section style={{ padding: "0 24px 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {mainSteps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;
            return (
              <div key={step.n} id={`step-${step.n}`}>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 64,
                    alignItems: "center",
                    padding: "72px 0",
                    borderBottom: i < mainSteps.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  {/* Text side */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentGlow, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={20} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.accent, letterSpacing: "0.08em" }}>
                        Step {step.n}
                      </span>
                    </div>
                    <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 8 }}>
                      {step.title}
                    </h2>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.accentLight, marginBottom: 16 }}>
                      {step.subtitle}
                    </p>
                    <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 28 }}>
                      {step.desc}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {step.details.map((detail) => (
                        <div key={detail} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(77,127,255,0.15)", border: "1px solid rgba(77,127,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <Check size={10} color={C.accent} strokeWidth={2.5} />
                          </div>
                          <span style={{ fontSize: 14, color: "rgba(226,234,255,0.72)", lineHeight: 1.5 }}>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <div style={{ order: isEven ? 1 : 2 }}>
                    {step.visual}
                  </div>
                </motion.div>

                {/* Connector arrow */}
                {i < mainSteps.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowDown size={20} color="rgba(77,127,255,0.3)" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AI Deep Dive ── */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "linear-gradient(135deg, #0d1a3a 0%, #0c1f50 100%)",
              border: `1px solid ${C.accentBorder}`,
              borderRadius: 22, padding: "56px 48px",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "50%", right: -40, transform: "translateY(-50%)", width: 350, height: 350, background: "radial-gradient(circle, rgba(77,127,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", maxWidth: 620 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accentLight, marginBottom: 14 }}>
                The Technology Behind VeloScribe AI
              </div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 16 }}>
                AI that streams — so you never wait.
              </h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
                VeloScribe&apos;s AI doesn&apos;t wait until the full answer is ready before showing it. Using a streaming technique, each word appears one by one directly in your editor — like someone typing alongside you, not a machine processing in the background.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: "⚡", title: "Real-time Streaming", desc: "Words appear in the editor one by one as they're generated" },
                  { icon: "🧠", title: "Context-aware", desc: "AI reads your entire document before responding" },
                  { icon: "🎯", title: "In-editor Experience", desc: "No need to leave your writing flow" },
                  { icon: "🔄", title: "Retry & Regenerate", desc: "Not happy with the result? Regenerate with one click" },
                ].map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CMD+K feature ── */}
      <section style={{ padding: "0 24px 96px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 80 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accent, marginBottom: 14 }}>Quick Navigation</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 16 }}>
                CMD+K — Find anything in seconds.
              </h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
                Press CMD+K (or CTRL+K on Windows) from anywhere to open the quick search. Type a document name, run an AI command, or navigate to any page without touching the mouse.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Search documents from your entire workspace",
                  "Run AI actions directly from the search bar",
                  "Navigate to any page in 2 keystrokes",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(226,234,255,0.72)" }}>
                    <ChevronRight size={14} color={C.accent} />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ background: "rgba(8,15,35,0.95)", border: `1px solid ${C.accentBorder}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                  <Command size={15} color="rgba(226,234,255,0.3)" />
                  <span style={{ fontSize: 13, color: "rgba(226,234,255,0.3)" }}>Search or type a command...</span>
                  <kbd style={{ marginLeft: "auto", padding: "2px 7px", borderRadius: 5, border: `1px solid ${C.border}`, fontSize: 10, color: C.dim }}>ESC</kbd>
                </div>
                {[
                  { icon: "✨", label: "Improve Writing", sub: "AI Action" },
                  { icon: "▶", label: "Continue Writing", sub: "AI Action" },
                  { icon: "📄", label: "2025 Strategy", sub: "Page" },
                  { icon: "📄", label: "Meeting Notes — Monday", sub: "Page" },
                  { icon: "📁", label: "Team Workspace", sub: "Workspace" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", background: i === 0 ? "rgba(77,127,255,0.1)" : "transparent", borderLeft: i === 0 ? `2px solid ${C.accent}` : "2px solid transparent" }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: i < 2 ? 600 : 400, color: i === 0 ? C.text : "rgba(226,234,255,0.65)" }}>{item.label}</div>
                      <div style={{ fontSize: 10.5, color: item.sub === "AI Action" ? "rgba(77,127,255,0.7)" : C.dim }}>{item.sub}</div>
                    </div>
                    {i === 0 && <kbd style={{ marginLeft: "auto", padding: "2px 7px", borderRadius: 5, border: "1px solid rgba(77,127,255,0.3)", fontSize: 10, color: C.accentLight }}>↵</kbd>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 120px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 18 }}>
            Enough reading — time to try it.
          </h2>
          <p style={{ color: C.muted, fontSize: 16, maxWidth: 380, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Free to get started. No trial time limit.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #3b6ef0 0%, #5d8aff 100%)", color: "#fff", padding: "14px 32px", borderRadius: 11, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 28px rgba(77,127,255,0.4)" }}
            >
              Start Free Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${C.border}`, color: C.muted, padding: "14px 24px", borderRadius: 11, fontSize: 14, fontWeight: 500, textDecoration: "none", background: "rgba(226,234,255,0.03)" }}
            >
              See Pricing <ChevronRight size={14} />
            </Link>
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
          ].map((l) => (
            <Link key={l.label} href={l.href} style={{ color: C.dim, textDecoration: "none", fontSize: 13 }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(226,234,255,0.2)" }}>© 2025 VeloScribe</div>
      </footer>
    </div>
  );
}
