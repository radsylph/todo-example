import { Badge } from "#components/ui/badge";
import { cn } from "#/lib/utils";
import { type Task, TaskPriority, TaskStatus } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "#components/ui/card";
import { RelativeTimeCard } from "#components/ui/relative-time-card";
import { m } from "#/paraglide/messages";
import { Link } from "@tanstack/react-router";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const priority = task.priority ?? "low";
  const status = task.status ?? "active";
  const createdAt = task.createdAt ?? new Date();

  const taskPriority = {
    [TaskPriority.LOW]: {
      badge:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      dot: "bg-emerald-500",
      label: m.priority_low(),
    },
    [TaskPriority.MEDIUM]: {
      badge:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      dot: "bg-amber-500",
      label: m.priority_medium(),
    },
    [TaskPriority.HIGH]: {
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      dot: "bg-rose-500",
      label: m.priority_high(),
    },
  };

  const taskStatus = {
    [TaskStatus.ACTIVE]: {
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      label: m.status_active(),
    },
    [TaskStatus.INACTIVE]: {
      badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      label: m.status_inactive(),
    },
    [TaskStatus.COMPLETED]: {
      badge:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: m.status_completed(),
    },
  };

  const stickyColors = {
    [TaskPriority.LOW]:
      "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900",
    [TaskPriority.MEDIUM]:
      "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900",
    [TaskPriority.HIGH]:
      "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900",
  };


  const hoverRotation =
    task.id.charCodeAt(task.id.length - 1) % 2 === 0
      ? "hover:rotate-2"
      : "hover:-rotate-2";

  return (
    <Link
      to="/app/task/edit/$taskId"
      params={{ taskId: task.id }}
      className={cn(
        "block transition-all duration-500 hover:scale-105",
        hoverRotation,
      )}
    >
      <Card
        className={cn(
          "flex flex-col gap-2 p-5 min-h-50 border-none shadow-md hover:shadow-2xl transition-all duration-500 rounded-sm relative overflow-hidden",
          stickyColors[priority],
        )}
      >
        <CardHeader className="flex p-0 flex-wrap w-full justify-between items-center bg-transparent">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs uppercase tracking-wider font-semibold",
                taskStatus[status].badge,
              )}
            >
              {taskStatus[status].label}
            </Badge>
          </div>
          <p className="text-xs font-medium opacity-70">
            <RelativeTimeCard date={createdAt} />
          </p>
        </CardHeader>

        <CardContent className="p-0 flex flex-col gap-2 mt-2">
          <CardTitle className="font-bold text-xl leading-tight text-foreground/90">
            {task.title}
          </CardTitle>

          {task.description && (
            <CardDescription className="text-sm italic text-foreground/70 line-clamp-4 leading-relaxed">
              {task.description}
            </CardDescription>
          )}
        </CardContent>
        <CardFooter className="p-0">
          <div className="absolute bottom-3 right-3 flex items-center gap-1 justify-center">
            <div
              className={cn("w-2 h-2 rounded-full", taskPriority[priority].dot)}
            />
            <span className="text-xs font-bold uppercase opacity-60">
              {taskPriority[priority].label}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
