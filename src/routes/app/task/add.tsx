import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer";
import { TaskForm } from "#modules/tasks/components/taskForm";

export const Route = createFileRoute("/app/task/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer title="Create a new Task" description="Add a new task to your list" goBack>
      <TaskForm type="create" />
    </PageContainer>
  );
}
