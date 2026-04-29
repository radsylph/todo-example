import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer.tsx";
import { getTasksFn } from "#/modules/tasks/logic/functions";
import { Badge } from "#components/ui/badge";
import { Button } from "#/modules/common/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard } from "#modules/tasks/components/taskCard.tsx";
import { m } from "#/paraglide/messages";
import {
  Empty,
  EmptyHeader,
  EmptyDescription,
  EmptyTitle,
} from "#components/ui/empty.tsx";

export const Route = createFileRoute("/app/task/")({
  component: RouteComponent,
  loader: () => getTasksFn(),
});

function RouteComponent() {
  const tasks = Route.useLoaderData();
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;

  return (
    <PageContainer
      title={m.tasks_title()}
      description={m.tasks_description()}
      className="pt-8"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between bg-muted/50 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 ">
              <h2 className="text-lg font-bold">
                {/* {m.completion_status()} */}
              </h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <Empty className="col-span-full py-20 text-muted-foreground border-2 border-dashed rounded-3xl">
              <EmptyHeader>
                <EmptyTitle>{m.no_tasks_found()}</EmptyTitle>
                <EmptyDescription>{m.create_first_task()}</EmptyDescription>
              </EmptyHeader>
              <Button variant="outline" asChild>
                <Link to="/app/task/add">{m.create_first_task()}</Link>
              </Button>
            </Empty>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
