import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer";
import { TaskForm } from "#modules/tasks/components/taskForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/modules/common/components/ui/breadcrumb";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/app/task/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      title="Create a new Task"
      description="Add a new task to your list"
      goBack
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/app/task"
                  search={{
                    page: 1,
                    limit: 12,
                    orderBy: "desc",
                  }}
                >
                  {m.tasks_title()}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{m.new_task()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <TaskForm type="create" />
    </PageContainer>
  );
}
