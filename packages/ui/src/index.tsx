import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

import { appName } from "@derive/config";

export const deriveUiTokens = {
  ink: "#0f1720",
  paper: "#f6f1e8",
  accent: "#0b6a88",
  accentSoft: "#d8eff6",
  border: "rgba(15, 23, 32, 0.14)"
} as const;

type PageShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description: string;
  aside?: ReactNode;
}>;

type SectionCardProps = PropsWithChildren<{
  title: string;
  kicker?: string;
}>;

type StatusPillProps = {
  label: string;
  tone?: "neutral" | "good" | "warn";
};

const cardStyle: CSSProperties = {
  border: `1px solid ${deriveUiTokens.border}`,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.82)",
  boxShadow: "0 18px 60px rgba(15, 23, 32, 0.08)"
};

export function PageShell({
  eyebrow,
  title,
  description,
  aside,
  children
}: PageShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(216, 239, 246, 0.95), rgba(246, 241, 232, 1) 50%, rgba(240, 230, 214, 0.9) 100%)",
        color: deriveUiTokens.ink
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 64px"
        }}
      >
        <header
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            alignItems: "start",
            marginBottom: 28
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 999,
                background: deriveUiTokens.accentSoft,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}
            >
              <span>{eyebrow ?? "Developer Q&A"}</span>
              <span>{appName}</span>
            </div>
            <h1
              style={{
                margin: "18px 0 12px",
                fontSize: "clamp(2.7rem, 6vw, 5rem)",
                lineHeight: 0.95
              }}
            >
              {title}
            </h1>
            <p
              style={{
                maxWidth: 720,
                margin: 0,
                fontSize: 18,
                lineHeight: 1.6,
                color: "rgba(15, 23, 32, 0.8)"
              }}
            >
              {description}
            </p>
          </div>
          {aside ? <div style={{ ...cardStyle, padding: 20 }}>{aside}</div> : null}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

export function SectionCard({ title, kicker, children }: SectionCardProps) {
  return (
    <section style={{ ...cardStyle, padding: 24 }}>
      {kicker ? (
        <div
          style={{
            marginBottom: 8,
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(15, 23, 32, 0.6)"
          }}
        >
          {kicker}
        </div>
      ) : null}
      <h2 style={{ margin: "0 0 14px", fontSize: 24 }}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  const tones: Record<NonNullable<StatusPillProps["tone"]>, CSSProperties> = {
    neutral: {
      background: "rgba(15, 23, 32, 0.08)",
      color: deriveUiTokens.ink
    },
    good: {
      background: "rgba(30, 122, 82, 0.12)",
      color: "#14543a"
    },
    warn: {
      background: "rgba(179, 87, 0, 0.12)",
      color: "#7d4300"
    }
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        ...tones[tone]
      }}
    >
      {label}
    </span>
  );
}
