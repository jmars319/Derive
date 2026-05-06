import { useEffect, useMemo, useState } from "react";
import { appName } from "@derive/config";
import { deriveAnswer, normalizeQuestionText, type DerivedAnswer } from "@derive/domain";
import { readDesktopStore, readLegacyLocalStorage, writeDesktopStore } from "./lib/desktopStore";

type ReviewStatus = "draft" | "reviewed" | "archived";

type LocalSourceNote = {
  id: string;
  title: string;
  url: string;
  body: string;
  createdAt: number;
};

type DeriveRecord = {
  id: string;
  question: string;
  contextNotes: string;
  localSources?: LocalSourceNote[];
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
    localSources: [],
    answerText: derived.answerText,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const loadRecords = () => {
  return [createRecord()];
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
    "## Local Sources",
    "",
    ...(record.localSources?.length
      ? record.localSources.map((source) => `- ${source.title}${source.url ? `: ${source.url}` : ""}\n  ${source.body}`)
      : ["(none)"]),
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

const toAssemblyBriefMarkdown = (record: DeriveRecord, derived: DerivedAnswer) =>
  [
    "# Assembly Brief From Derive",
    "",
    `Source: tenra Derive`,
    `Question: ${record.question || "Untitled question"}`,
    `Status: ${record.status}`,
    `Confidence: ${derived.confidence}`,
    `Updated: ${new Date(record.updatedAt).toISOString()}`,
    "",
    "## Recommended Content Task",
    "",
    "Turn this answer card into a reviewed internal note, decision record, or customer-facing draft as appropriate.",
    "",
    "## Answer",
    "",
    record.answerText.trim() || derived.answerText,
    "",
    "## Review Notes",
    "",
    record.contextNotes.trim() || "(none)",
    "",
    "## Local Sources",
    "",
    ...(record.localSources?.length
      ? record.localSources.map((source) => `- ${source.title}${source.url ? `: ${source.url}` : ""}\n  ${source.body}`)
      : ["(none)"]),
    "",
    "## Assumptions",
    "",
    ...derived.assumptions.map((item) => `- ${item.text}`),
    "",
    "## Sources",
    "",
    ...derived.sources.map((source) => `- ${source.title}: ${source.url}`),
  ].join("\n");

export default function App() {
  const [records, setRecords] = useState<DeriveRecord[]>(loadRecords);
  const [activeId, setActiveId] = useState(records[0]?.id ?? "");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceBody, setSourceBody] = useState("");
  const [notice, setNotice] = useState("Local derivation workbench ready.");
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    readDesktopStore<DeriveRecord[]>(storageKey)
      .then((storedRecords) => {
        if (cancelled) return;

        const legacyRecords = readLegacyLocalStorage<DeriveRecord[]>(storageKey);
        const nextRecords =
          Array.isArray(storedRecords) && storedRecords.length > 0
            ? storedRecords
            : Array.isArray(legacyRecords) && legacyRecords.length > 0
              ? legacyRecords
              : null;

        if (nextRecords) {
          setRecords(nextRecords);
          setActiveId(nextRecords[0]?.id ?? "");
          setNotice(storedRecords ? "Desktop store loaded." : "Legacy workbench records migrated.");
        }

        setIsStoreReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setNotice(error instanceof Error ? error.message : "Desktop store unavailable.");
        setIsStoreReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isStoreReady) return;

    void writeDesktopStore(storageKey, records).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Desktop store write failed.");
    });
  }, [isStoreReady, records]);

  const activeRecord = records.find((record) => record.id === activeId) ?? records[0] ?? createRecord();
  const derived = useMemo(
    () => derivedForQuestion(activeRecord.id, activeRecord.question),
    [activeRecord.id, activeRecord.question],
  );
  const markdown = useMemo(() => toMarkdown(activeRecord, derived), [activeRecord, derived]);
  const assemblyBriefMarkdown = useMemo(
    () => toAssemblyBriefMarkdown(activeRecord, derived),
    [activeRecord, derived],
  );

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

  const addLocalSource = () => {
    const title = sourceTitle.trim();
    const body = sourceBody.trim();

    if (!title || !body) {
      setNotice("Add a source title and source notes before saving.");
      return;
    }

    const source: LocalSourceNote = {
      id: createId(),
      title,
      url: sourceUrl.trim(),
      body,
      createdAt: now(),
    };

    updateActiveRecord({
      localSources: [source, ...(activeRecord.localSources ?? [])],
      status: "draft",
    });
    setSourceTitle("");
    setSourceUrl("");
    setSourceBody("");
    setNotice("Local source added.");
  };

  const removeLocalSource = (sourceId: string) => {
    updateActiveRecord({
      localSources: (activeRecord.localSources ?? []).filter((source) => source.id !== sourceId),
      status: "draft",
    });
    setNotice("Local source removed.");
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setNotice("Markdown copied.");
    } catch {
      setNotice("Clipboard copy failed. Export still works.");
    }
  };

  const copyAssemblyBrief = async () => {
    try {
      await navigator.clipboard.writeText(assemblyBriefMarkdown);
      setNotice("Assembly brief copied.");
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

          <section className="source-editor" aria-label="Local sources">
            <header className="panel-header">
              <span>Local Sources</span>
              <strong>{activeRecord.localSources?.length ?? 0}</strong>
            </header>
            <div className="source-editor-grid">
              <label>
                Title
                <input value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} />
              </label>
              <label>
                URL
                <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} />
              </label>
              <label className="source-editor-body">
                Notes
                <textarea value={sourceBody} onChange={(event) => setSourceBody(event.target.value)} />
              </label>
            </div>
            <button className="source-add-button" type="button" onClick={addLocalSource}>
              Add Source
            </button>
            <div className="source-note-list">
              {(activeRecord.localSources ?? []).map((source) => (
                <article key={source.id}>
                  <div>
                    <strong>{source.title}</strong>
                    {source.url ? <span>{source.url}</span> : null}
                    <p>{source.body}</p>
                  </div>
                  <button type="button" onClick={() => removeLocalSource(source.id)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>

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
            <button type="button" onClick={copyAssemblyBrief}>
              Copy Assembly Brief
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
