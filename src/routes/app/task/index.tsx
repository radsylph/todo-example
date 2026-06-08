import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer.tsx";
import { getTasksFn } from "#/modules/tasks/logic/functions";
import { Badge } from "#components/ui/badge";
import { Button } from "#/modules/common/components/ui/button";
import { Plus } from "lucide-react";
import type { Task } from "#modules/tasks/types";
import { TaskDataTable } from "#modules/tasks/components/table/taskDataTable.tsx";
import { m } from "#/paraglide/messages";
import { TaskDialogProvider } from "#modules/tasks/components/dialogs/taskDialogContex.tsx";
import { taskQueryOptionsSchema } from "#modules/tasks/schemas.ts";
import { TaskDialogs } from "#modules/tasks/components/dialogs/taskDialogs.tsx";

export const Route = createFileRoute("/app/task/")({
  validateSearch: (search: Record<string, unknown>) => {
    return taskQueryOptionsSchema.parse({
      ...search,
    });
  },
  loaderDeps: ({ search }) => search,
  component: RouteComponent,
  loader: ({ deps }) => getTasksFn({ data: deps }),
});

function RouteComponent() {
  const response = Route.useLoaderData();
  const tasks = response.data
  const completedTasks = tasks.filter((t: Task) => t.status === "completed").length;
  const totalTasks = tasks.length;

  return (
    <TaskDialogProvider>
      <PageContainer
        title={m.tasks_title()}
        description={m.tasks_description()}
        className="pt-8"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {m.tasks_title()}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold tracking-tight">
                    {totalTasks}
                  </span>
                  <Badge variant="secondary" className="h-6 px-2 text-xs font-semibold">
                    {totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0}% {m.status_completed()}
                  </Badge>
                </div>
              </div>

              <div className="h-10 w-px bg-border/60 mx-2 hidden sm:block" />

              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {m.completion_status()}
                </span>
                <span className="text-3xl font-bold tracking-tight text-primary">
                  {completedTasks}
                </span>
              </div>
            </div>

            <Button variant="default" asChild className="rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-6">
              <Link to="/app/task/add">
                <Plus className="mr-2 size-5" />
                <span className="font-semibold">{m.new_task()}</span>
              </Link>
            </Button>
          </div>

          <div className="md:mt-6">
            <TaskDataTable data={response} />
          </div>
        </div>
      </PageContainer>
      <TaskDialogs />
    </TaskDialogProvider>
  );
}
