import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer.tsx";
import { getTasksFn } from "#/modules/tasks/logic/functions";
import { Badge } from "#components/ui/badge";
import { Button } from "#/modules/common/components/ui/button";
import { Plus } from "lucide-react";
import type { Task } from "#modules/tasks/types";
import { TaskDataTable } from "#modules/tasks/components/table/taskDataTable.tsx";
import { m } from "#/paraglide/messages";

import { taskQueryOptionsSchema } from "#modules/tasks/schemas.ts";

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
    <PageContainer
      title={m.tasks_title()}
      description={m.tasks_description()}
      className="pt-8"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 ">
              {/* <h2 className="text-lg font-bold"> */}
              {/* {m.completion_status()} */}
              {/* </h2> */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-md font-bold">
                  {m.tasks_count({
                    completed: completedTasks,
                    total: totalTasks,
                  })}
                </Badge>
                <Badge
                  variant={
                    completedTasks === totalTasks && totalTasks > 0
                      ? "default"
                      : "secondary"
                  }
                  className="rounded-md font-bold text-md"
                >
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  %
                </Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/app/task/add">
              <Plus className="mr-2" />
              {m.new_task()}
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          <TaskDataTable data={response} />
        </div>
      </div>
    </PageContainer>
  );
}
