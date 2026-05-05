import { useEffect, useMemo, useState } from "react";
import { appName } from "@derive/config";
import { deriveAnswer, normalizeQuestionText, type DerivedAnswer } from "@derive/domain";

type ReviewStatus = "draft" | "reviewed" | "archived";

type DeriveRecord = {
  id: string;
  question: string;
  contextNotes: string;
  answerText: string;
  status: ReviewStatus;
  createdAt: number;
  updatedAt: number;
};

const storageKey = "tenra-derive-desktop-workbench:v1";

const defaultQuestion =
  "Next.js build failed with Cannot read properties of undefined in app/page.tsx and I am using TypeScript.";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `derive-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const now = () => Date.now();

const derivedForQuestion = (id: string, question: string): DerivedAnswer =>
  deriveAnswer({
    id,
    text: normalizeQuestionText(question),
    createdAt: now(),
  });

const createRecord = (): DeriveRecord => {
  const id = createId();
  const derived = derivedForQuestion(id, defaultQuestion);
  const timestamp = now();

  return {
    id,
    question: defaultQuestion,
    contextNotes: "Paste logs, source notes, constraints, or links here.",
    answerText: derived.answerText,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const loadRecords = () => {
  if (typeof window === "undefined") return [createRecord()];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [createRecord()];
    const parsed = JSON.parse(raw) as DeriveRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createRecord()];
  } catch {
    return [createRecord()];
  }
};

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));

const toMarkdown = (record: DeriveRecord, derived: DerivedAnswer) =>
  [
    `# ${record.question || "Untitled question"}`,
    "",
    `Status: ${record.status}`,
    `Confidence: ${derived.confidence}`,
    `Updated: ${new Date(record.updatedAt).toISOString()}`,
    "",
    "## Answer",
    "",
    record.answerText.trim() || derived.answerText,
    "",
    "## Context Notes",
    "",
    record.contextNotes.trim() || "(none)",
    "",
    "## Assumptions",
    "",
    ...derived.assumptions.map((item) => `- ${item.text}`),
    "",
    "## Signals",
    "",
    ...derived.context.map((signal) => `- ${signal.kind}: ${signal.value}`),
    "",
    "## Sources",
    "",
    ...derived.sources.map((source) => `- ${source.title}: ${source.url}`),
  ].join("\n");

export default function App() {
  const [records, setRecords] = useState<DeriveRecord[]>(loadRecords);
  const [activeId, setActiveId] = useState(records[0]?.id ?? "");
  const [notice, setNotice] = useState("Local derivation workbench ready.");

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records]);

  const activeRecord = records.find((record) => record.id === activeId) ?? records[0] ?? createRecord();
  const derived = useMemo(
    () => derivedForQuestion(activeRecord.id, activeRecord.question),
    [activeRecord.id, activeRecord.question],
  );
  const markdown = useMemo(() => toMarkdown(activeRecord, derived), [activeRecord, derived]);

  const updateActiveRecord = (updates: Partial<DeriveRecord>) => {
    const updatedAt = now();
    setRecords((current) =>
      current.map((record) =>
        record.id === activeRecord.id
          ? {
              ...record,
              ...updates,
              updatedAt,
            }
          : record,
      ),
    );
  };

  const createNewRecord = () => {
    const record = createRecord();
    setRecords((current) => [record, ...current]);
    setActiveId(record.id);
    setNotice("New question created.");
  };

  const regenerateAnswer = () => {
    updateActiveRecord({
      answerText: derived.answerText,
      status: "draft",
    });
    setNotice("Structured answer refreshed from the current question.");
  };

  const markReviewed = () => {
    updateActiveRecord({ status: "reviewed" });
    setNotice("Question marked reviewed.");
  };

  const archiveRecord = () => {
    updateActiveRecord({ status: "archived" });
    setNotice("Question archived.");
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setNotice("Markdown copied.");
    } catch {
      setNotice("Clipboard copy failed. Export still works.");
    }
  };

  const exportMarkdown = () => {
    const slug = (activeRecord.question || "derive-question")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "derive-question"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Markdown export created.");
  };

  const activeRecords = records.filter((record) => record.status !== "archived");

  return (
    <div className="derive-shell">
      <aside className="derive-sidebar">
        <header className="brand-block">
          <span>{appName}</span>
          <h1>Answer workbench</h1>
          <p>Structured questions, assumptions, confidence, and reviewable exports.</p>
        </header>

        <div className="toolbar">
          <button type="button" onClick={createNewRecord}>
            New
          </button>
          <span>{activeRecords.length} active</span>
        </div>

        <nav className="record-list" aria-label="Derive records">
          {records.map((record) => (
            <button
              className={record.id === activeRecord.id ? "record-button record-button-active" : "record-button"}
              key={record.id}
              onClick={() => setActiveId(record.id)}
              type="button"
            >
              <span>{record.question || "Untitled question"}</span>
              <small>
                {record.status} / {formatTime(record.updatedAt)}
              </small>
            </button>
          ))}
        </nav>
      </aside>

      <main className="derive-main">
        <section className="editor-panel" aria-label="Question editor">
          <header className="section-header">
            <div>
              <span className="eyebrow">Question</span>
              <h2>{activeRecord.question || "Untitled question"}</h2>
            </div>
            <span className={`status-pill status-${activeRecord.status}`}>{activeRecord.status}</span>
          </header>

          <label>
            Question
            <textarea
              className="question-input"
              value={activeRecord.question}
              onChange={(event) => updateActiveRecord({ question: event.target.value, status: "draft" })}
            />
          </label>

          <label>
            Context notes
            <textarea
              className="context-input"
              value={activeRecord.contextNotes}
              onChange={(event) => updateActiveRecord({ contextNotes: event.target.value, status: "draft" })}
            />
          </label>

          <label>
            Answer
            <textarea
              className="answer-input"
              value={activeRecord.answerText}
              onChange={(event) => updateActiveRecord({ answerText: event.target.value, status: "draft" })}
            />
          </label>

          <div className="action-row">
            <button type="button" onClick={regenerateAnswer}>
              Refresh Structure
            </button>
            <button type="button" onClick={markReviewed}>
              Mark Reviewed
            </button>
            <button type="button" onClick={archiveRecord}>
              Archive
            </button>
            <button type="button" onClick={copyMarkdown}>
              Copy Markdown
            </button>
            <button type="button" onClick={exportMarkdown}>
              Export
            </button>
          </div>

          <p className="notice" role="status">
            {notice}
          </p>
        </section>

        <aside className="inspector-panel" aria-label="Answer inspector">
          <section>
            <header className="panel-header">
              <span>Confidence</span>
              <strong>{derived.confidence}</strong>
            </header>
            <p>
              Confidence is based on detected context signals. It should be treated as a review cue, not a final claim.
            </p>
          </section>

          <section>
            <header className="panel-header">
              <span>Signals</span>
              <strong>{derived.context.length}</strong>
            </header>
            <ul className="compact-list">
              {derived.context.map((signal) => (
                <li key={`${signal.kind}-${signal.value}`}>
                  <b>{signal.kind}</b>
                  <span>{signal.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <header className="panel-header">
              <span>Assumptions</span>
              <strong>{derived.assumptions.length}</strong>
            </header>
            <ul className="text-list">
              {derived.assumptions.map((assumption) => (
                <li key={assumption.text}>{assumption.text}</li>
              ))}
            </ul>
          </section>

          <section>
            <header className="panel-header">
              <span>Sources</span>
              <strong>{derived.sources.length}</strong>
            </header>
            <ul className="source-list">
              {derived.sources.map((source) => (
                <li key={source.url}>
                  <strong>{source.title}</strong>
                  <span>{source.kind}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
