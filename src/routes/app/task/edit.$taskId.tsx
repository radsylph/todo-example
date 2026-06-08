import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer";
import { TaskForm } from "#modules/tasks/components/taskForm";
import { getTaskByIdFn } from "#modules/tasks/logic/functions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/modules/common/components/ui/breadcrumb";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/app/task/edit/$taskId")({
  component: RouteComponent,
  loader: async ({ params: { taskId } }) => {
    const task = await getTaskByIdFn({ data: { taskId } });

    if (!task) {
      throw notFound();
    }

    return task;
  },
});

function RouteComponent() {
  const task = Route.useLoaderData();

  return (
    <PageContainer
      title="Edit Task"
      description="Update the details of your task"
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
              <BreadcrumbPage>{m.edit()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <TaskForm type="update" task={task} />
    </PageContainer>
  );
}
