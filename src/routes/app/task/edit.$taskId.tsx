import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer";
import { TaskForm } from "#modules/tasks/components/taskForm";
import { getTaskByIdFn } from "#modules/tasks/logic/functions";

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
    >
      <TaskForm type="update" task={task} />
    </PageContainer>
  );
}
