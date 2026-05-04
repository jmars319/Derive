import { mockDeriveQuestionResponse, mockHealthCheckResponse } from "@derive/api-contracts";
import { anonymousAccessPolicy, describeAuthMode } from "@derive/auth";
import { readPublicConfig } from "@derive/config";
import { mockProgressEvents } from "@derive/realtime";
import { PageShell, SectionCard, StatusPill } from "@derive/ui";

const config = readPublicConfig({ APP_NAME: "tenra Derive" });

export default function App() {
  return (
    <PageShell
      eyebrow="Desktop channel"
      title="tenra Derive desktop"
      description="Desktop is reserved for focused workflows such as side-by-side trace review, longer context panes, and local developer utility modes."
      aside={
        <div className="desktop-aside">
          <StatusPill label={mockHealthCheckResponse.surfaces.desktopapp} tone="warn" />
          <p>{describeAuthMode(anonymousAccessPolicy.authMode)}</p>
        </div>
      }
    >
      <div className="desktop-grid">
        <SectionCard title="Desktop status" kicker="Shared package baseline">
          <p>
            {config.appName} desktop reuses shared contracts and UI while focused trace-review workflows are defined.
          </p>
        </SectionCard>
        <SectionCard title="Latest sample answer" kicker="Shared contract import">
          <p>{mockDeriveQuestionResponse.answer.answerText}</p>
        </SectionCard>
        <SectionCard title="Pipeline preview" kicker="Realtime package">
          <ul>
            {mockProgressEvents.map((event) => (
              <li key={event.eventId}>
                <strong>{event.stage}</strong>: {event.message}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </PageShell>
  );
}
