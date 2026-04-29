import { Badge } from "#components/ui/badge";
import { cn } from "#/lib/utils";
import type { NewTask } from "../logic/queries.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { RelativeTimeCard } from "#components/ui/relative-time-card";
import { m } from "#/paraglide/messages";

interface TaskCardProps {
  task: NewTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const priority = task.priority ?? "low";
  const status = task.status ?? "active";
  const createdAt = task.createdAt ?? new Date();

  const priorityColor = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusColor = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    completed:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  const statusLabel = {
    active: m.status_active(),
    inactive: m.status_inactive(),
    completed: m.status_completed(),
  };

  const priorityLabel = {
    low: m.priority_low(),
    medium: m.priority_medium(),
    high: m.priority_high(),
  };

  return (
    <Card className="flex flex-col gap-2 rounded-xl bg-card shadow-sm hover:shadow-lg hover:scale-101 cursor-pointer transition-all duration-500">
      <CardHeader className="flex justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(statusColor[status])}>
            {statusLabel[status]}
          </Badge>
          <Badge variant="outline" className={cn(priorityColor[priority])}>
            {priorityLabel[priority]}
          </Badge>
        </div>
        <div>
          <div className="flex items-center">
            <Badge variant="outline">
              <RelativeTimeCard
                date={createdAt}
                className="hover:text-accent-foreground"
              />
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="font-semibold text-lg truncate">
          <h1>{task.title}</h1>
        </CardTitle>

        {task.description && (
          <CardDescription className="text-md text-muted-foreground line-clamp-4">
            {task.description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
