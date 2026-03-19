import {
  mockDeriveQuestionRequest,
  mockDeriveQuestionResponse,
  mockHealthCheckResponse
} from "@derive/api-contracts";
import { appName, readPublicConfig } from "@derive/config";
import { normalizeQuestionText } from "@derive/domain";
import {
  defaultPrivacyPosture,
  describeSourceExposure,
  redactQuestionPreview
} from "@derive/privacy";
import { CONFIDENCE_LEVELS } from "@derive/shared-types";
import { PageShell, SectionCard, StatusPill } from "@derive/ui";
import { deriveQuestionRequestSchema } from "@derive/validation";

const config = readPublicConfig(process.env);
const response = mockDeriveQuestionResponse;
const requestValidation = deriveQuestionRequestSchema.safeParse(mockDeriveQuestionRequest);
const normalizedPrompt = normalizeQuestionText(mockDeriveQuestionRequest.question);
const confidenceRank = CONFIDENCE_LEVELS.indexOf(response.answer.confidence) + 1;

export default function HomePage() {
  return (
    <PageShell
      eyebrow="Active surface: webapp"
      title={appName}
      description="Derive accepts messy developer questions, resolves intent, and returns a structured answer with visible assumptions, context signals, and source traceability. This v0 scaffold is real architecture with mock data, not a fake backend."
      aside={
        <div className="trust-note">
          <StatusPill label={`${config.sourceMode} mode`} tone="warn" />
          <h2>Trust model</h2>
          <p>
            The answer below is imported from shared contracts. No live retrieval, synthesis, or
            persistence is connected yet.
          </p>
          <dl>
            <div>
              <dt>System status</dt>
              <dd>{response.system.status}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>
                {response.answer.confidence} ({confidenceRank}/{CONFIDENCE_LEVELS.length})
              </dd>
            </div>
            <div>
              <dt>Validation</dt>
              <dd>{requestValidation.success ? "request shape valid" : "request shape invalid"}</dd>
            </div>
          </dl>
        </div>
      }
    >
      <div className="webapp-layout">
        <SectionCard title="Question intake" kicker="Messy prompt in, structured reasoning out">
          <div className="composer">
            <label htmlFor="question" className="field-label">
              Ask the rough version first
            </label>
            <textarea
              id="question"
              name="question"
              defaultValue={mockDeriveQuestionRequest.question}
              aria-label="Developer question draft"
            />
            <div className="composer-meta">
              <StatusPill label="Mock intake" tone="neutral" />
              <p>
                Normalized preview: <span>{normalizedPrompt}</span>
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="webapp-grid">
          <SectionCard title="Derived answer" kicker="Structured answer surface">
            <div className="answer-card">
              <p className="answer-summary">{response.answer.summary}</p>
              <p>{response.answer.answer}</p>
              <div className="scope-grid">
                <div>
                  <h3>In scope</h3>
                  <ul>
                    {response.answer.scope.inScope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Out of scope</h3>
                  <ul>
                    {response.answer.scope.outOfScope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Context and assumptions" kicker="Traceability first">
            <div className="stack-list">
              {response.answer.contextSignals.map((signal) => (
                <article key={signal.id} className="stack-item">
                  <div className="stack-header">
                    <h3>{signal.label}</h3>
                    <StatusPill label={signal.kind} tone="neutral" />
                  </div>
                  <p>{signal.detail}</p>
                </article>
              ))}
              {response.answer.assumptions.map((assumption) => (
                <article key={assumption.id} className="stack-item">
                  <div className="stack-header">
                    <h3>Assumption</h3>
                    <StatusPill label={assumption.impact} tone="warn" />
                  </div>
                  <p>{assumption.statement}</p>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="webapp-grid">
          <SectionCard title="Cited sources" kicker="Source attribution">
            <div className="sources">
              {response.answer.sources.map((source) => (
                <article key={source.id} className="source-item">
                  <div className="stack-header">
                    <h3>{source.title}</h3>
                    <StatusPill label={source.kind} tone="good" />
                  </div>
                  <p>{source.whyItMatters}</p>
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

          <SectionCard title="System note" kicker="What this scaffold is and is not">
            <div className="system-note">
              <p>
                {appName} is centered on shared domain contracts, not app-local business logic. The
                web app is the active surface; desktop and mobile are intentionally thin scaffolds.
              </p>
              <dl>
                <div>
                  <dt>Question preview</dt>
                  <dd>{redactQuestionPreview(response.receivedQuestion.rawText)}</dd>
                </div>
                <div>
                  <dt>Public app name</dt>
                  <dd>{config.appName}</dd>
                </div>
                <div>
                  <dt>Health check</dt>
                  <dd>
                    {mockHealthCheckResponse.status} / {mockHealthCheckResponse.mode}
                  </dd>
                </div>
                <div>
                  <dt>Source posture</dt>
                  <dd>{defaultPrivacyPosture.sources}</dd>
                </div>
              </dl>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
