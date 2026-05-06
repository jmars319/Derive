"use client";

import { type FormEvent, useState } from "react";

import { buildDeriveReasoningBrief, mockHealthCheckResponse } from "@derive/api-contracts";
import { readPublicConfig } from "@derive/config";
import {
  deriveAnswer,
  mockUserQuestion,
  normalizeQuestionText,
  type DerivedAnswer,
  type UserQuestion
} from "@derive/domain";
import {
  defaultPrivacyPosture,
  describeSourceExposure,
  redactQuestionPreview
} from "@derive/privacy";
import { CONFIDENCE_LEVELS } from "@derive/shared-types";
import { PageShell, SectionCard, StatusPill } from "@derive/ui";
import { deriveQuestionRequestSchema } from "@derive/validation";

const config = readPublicConfig({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
});

function buildQuestion(text: string): UserQuestion {
  const timestamp = Date.now();

  return {
    id: `question_${timestamp}`,
    text,
    createdAt: timestamp
  };
}

export default function HomePage() {
  const [questionText, setQuestionText] = useState(mockUserQuestion.text);
  const [submittedQuestion, setSubmittedQuestion] = useState<UserQuestion>(mockUserQuestion);
  const [answer, setAnswer] = useState<DerivedAnswer>(() => deriveAnswer(mockUserQuestion));

  const normalizedPrompt = normalizeQuestionText(questionText);
  const requestValidation = deriveQuestionRequestSchema.safeParse({
    question: normalizedPrompt,
    client: "webapp"
  });
  const confidenceRank = CONFIDENCE_LEVELS.indexOf(answer.confidence) + 1;
  const reasoningBrief = buildDeriveReasoningBrief({
    question: submittedQuestion,
    answer,
    sourceApp: "manual",
    recommendedConsumers: ["assembly", "proxy"]
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!requestValidation.success) {
      return;
    }

    const nextQuestion = buildQuestion(questionText);

    setSubmittedQuestion(nextQuestion);
    setAnswer(deriveAnswer(nextQuestion));
  }

  return (
    <PageShell
      eyebrow="Active surface: webapp"
      title={config.appName}
      description="tenra Derive accepts messy developer questions, resolves simple local signals, and returns a deterministic structured answer with assumptions, context, confidence, and traceability. This phase is intentionally local and non-AI."
      aside={
        <div className="trust-note">
          <StatusPill label="deterministic local pipeline" tone="good" />
          <h2>Trust model</h2>
          <p>
            The result below is produced directly by `deriveAnswer()` in `@derive/domain`. No
            external APIs, retrieval systems, or model calls are involved.
          </p>
          <dl>
            <div>
              <dt>Confidence</dt>
              <dd>
                {answer.confidence} ({confidenceRank}/{CONFIDENCE_LEVELS.length})
              </dd>
            </div>
            <div>
              <dt>Input validation</dt>
              <dd>{requestValidation.success ? "request shape valid" : "question text required"}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{mockHealthCheckResponse.mode}</dd>
            </div>
          </dl>
        </div>
      }
    >
      <div className="webapp-layout">
        <SectionCard title="Question intake" kicker="Messy prompt in, deterministic structure out">
          <form className="composer" onSubmit={handleSubmit}>
            <label htmlFor="question" className="field-label">
              Ask the rough version first
            </label>
            <textarea
              id="question"
              name="question"
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              aria-label="Developer question draft"
            />
            <div className="composer-meta">
              <StatusPill
                label={requestValidation.success ? "Input valid" : "Input required"}
                tone={requestValidation.success ? "good" : "warn"}
              />
              <p>
                Normalized preview: <span>{normalizedPrompt || "Provide a question to derive."}</span>
              </p>
            </div>
            <div className="submit-row">
              <button type="submit" className="submit-button" disabled={!requestValidation.success}>
                Derive answer
              </button>
              <p className="hint-copy">Runs the local domain pipeline without leaving the app.</p>
            </div>
          </form>
        </SectionCard>

        <div className="webapp-grid">
          <SectionCard title="Derived answer" kicker="Structured answer surface">
            <div className="answer-card">
              <p className="answer-summary">{answer.answerText}</p>
            </div>
          </SectionCard>

          <SectionCard title="Context and assumptions" kicker="Traceability first">
            <div className="stack-list">
              {answer.context.map((signal, index) => (
                <article key={`${signal.kind}-${signal.value}-${index}`} className="stack-item">
                  <div className="stack-header">
                    <h3>{signal.value}</h3>
                    <StatusPill label={signal.kind} tone="neutral" />
                  </div>
                </article>
              ))}
              {answer.assumptions.map((assumption, index) => (
                <article key={`${assumption.text}-${index}`} className="stack-item">
                  <div className="stack-header">
                    <h3>Assumption</h3>
                    <StatusPill label="derived" tone="warn" />
                  </div>
                  <p>{assumption.text}</p>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="webapp-grid">
          <SectionCard title="Cited sources" kicker="Static but structured references">
            <div className="sources">
              {answer.sources.map((source) => (
                <article key={`${source.title}-${source.url}`} className="source-item">
                  <div className="stack-header">
                    <h3>{source.title}</h3>
                    <StatusPill label={source.kind} tone="good" />
                  </div>
                  <p className="source-exposure">
                    {describeSourceExposure(source, "summary-only")}
                  </p>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.url}
                  </a>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="System note" kicker="What this phase is and is not">
            <div className="system-note">
              <p>
                {config.appName} is using a real domain pipeline now, but it remains a local,
                deterministic Phase 1 implementation rather than a backend-backed answer system.
              </p>
              <dl>
                <div>
                  <dt>Submitted question</dt>
                  <dd>{redactQuestionPreview(submittedQuestion.text)}</dd>
                </div>
                <div>
                  <dt>Health check</dt>
                  <dd>
                    {mockHealthCheckResponse.status} / {mockHealthCheckResponse.mode}
                  </dd>
                </div>
                <div>
                  <dt>Surface status</dt>
                  <dd>{mockHealthCheckResponse.surfaces.webapp}</dd>
                </div>
                <div>
                  <dt>Source posture</dt>
                  <dd>{defaultPrivacyPosture.sources}</dd>
                </div>
                <div>
                  <dt>Handoff schema</dt>
                  <dd>{reasoningBrief.schema}</dd>
                </div>
                <div>
                  <dt>Consumers</dt>
                  <dd>{reasoningBrief.handoff.recommendedConsumers.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
