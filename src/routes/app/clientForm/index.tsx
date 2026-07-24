import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/modules/common/components/ui/breadcrumb";
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
			goBack
			breadcrumbs={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									to="/app/task"
									search={{ page: 1, limit: 12, orderBy: "desc" }}
								>
									{m.tasks_title()}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{m.client_form_title()}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
		>
			<ClientForm />
		</PageContainer>
	);
}
