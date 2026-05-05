import { Badge } from "#components/ui/badge";
import { cn } from "#/lib/utils";
import { type Task, TaskPriority, TaskStatus } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    [TaskPriority.LOW]:{
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      label: m.priority_low(),
    },
    [TaskPriority.MEDIUM]:{
     badge:  "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
     label: m.priority_medium(),
    },
    [TaskPriority.HIGH]:{
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      label: m.priority_high(),
    }
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
      badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: m.status_completed(),
    },
  };

  return (
    <Link to="/app/task/edit/$taskId" params={{ taskId: task.id }} className="block">
      <Card className="flex flex-col gap-2 rounded-xl bg-card shadow-sm hover:shadow-lg hover:scale-101 cursor-pointer transition-all duration-500 h-full">
        <CardHeader className="flex justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(taskStatus[status].badge)}>
              {taskStatus[status].label}
            </Badge>
            <Badge variant="outline" className={cn(taskPriority[priority].badge)}>
              {taskPriority[priority].label}
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
    </Link>
  );
}
