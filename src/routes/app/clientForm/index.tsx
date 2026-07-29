import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { PageContainer } from "#components/layout/pageContainer";
import { ClientForm } from "#modules/clientForm/components/clientForm";

export const Route = createFileRoute("/app/clientForm/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      title={m.client_form_title()}
      description={m.client_form_description()}
    >
      <ClientForm />
    </PageContainer>
  );
}
