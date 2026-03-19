import { mockDeriveQuestionResponse, mockHealthCheckResponse } from "@derive/api-contracts";
import { anonymousAccessPolicy, describeAuthMode } from "@derive/auth";
import { readPublicConfig } from "@derive/config";
import { mockProgressEvents } from "@derive/realtime";
import { PageShell, SectionCard, StatusPill } from "@derive/ui";

const config = readPublicConfig({ APP_NAME: "Derive" });

export default function App() {
  return (
    <PageShell
      eyebrow="Scaffolded surface: desktopapp"
      title="Derive desktop shell"
      description="Desktop exists as a lightweight shell for future focused workflows such as side-by-side trace review, longer context panes, and local developer utility modes."
      aside={
        <div className="desktop-aside">
          <StatusPill label={mockHealthCheckResponse.surfaces.desktopapp} tone="warn" />
          <p>{describeAuthMode(anonymousAccessPolicy.authMode)}</p>
        </div>
      }
    >
      <div className="desktop-grid">
        <SectionCard title="Shell status" kicker="Minimal by design">
          <p>
            {config.appName} desktop is intentionally thin. It reuses shared contracts and UI, but
            it does not claim any native functionality yet.
          </p>
        </SectionCard>
        <SectionCard title="Latest mock answer" kicker="Shared contract import">
          <p>{mockDeriveQuestionResponse.answer.answerText}</p>
        </SectionCard>
        <SectionCard title="Pipeline preview" kicker="Realtime package placeholder">
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
