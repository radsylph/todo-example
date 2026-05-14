import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "#components/layout/formLayout.tsx";
import { createTaskSchema, updateTaskSchema } from "../schemas";
import type { TaskInsert, Task } from "../types";
import { Form } from "#components/ui/form";
import { InputElement } from "#components/forms/inputElement.tsx";
import {
  RadioGroupElement,
  RadioGroupElementType,
} from "#components/forms/radioGroupElement.tsx";
import { TextAreaElement } from "#components/forms/textAreaElement.tsx";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "#components/ui/card.tsx";
import {
  SignalLow,
  SignalMedium,
  SignalHigh,
  CheckCircle,
  CircleDashed,
  CirclePlus,
} from "lucide-react";
import { createTaskFn, updateTaskFn } from "#modules/tasks/logic/functions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { m } from "#/paraglide/messages";

type taskFormType = Omit<
  Task,
  "createdAt" | "updatedAt" | "isDeleted" | "deletedAt"
>;

interface props {
  type: "create" | "update";
  task?: taskFormType;
}

export function TaskForm({ type, task }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      type === "create" ? createTaskSchema : updateTaskSchema,
    ),
    values: task
      ? {
          ...task,
          description: task.description ?? "",
        }
      : undefined,
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      status: "active",
    },
  });

  const onSubmit = async (task: TaskInsert) => {
    if (type === "create") {
      setLoading(true);
      await createTaskFn({ data: task });
      toast.success(m.task_created_success());
      setLoading(false);
      router.navigate({
        to: "/app/task",
        search: { page: 1, limit: 10, orderBy: "desc" },
      });
    } else {
      setLoading(true);
      await updateTaskFn({ data: task });
      toast.success(m.task_updated_success());
      setLoading(false);
      router.navigate({
        to: "/app/task",
        search: { page: 1, limit: 10, orderBy: "desc" },
      });
    }
  };

  return (
    <Form {...form}>
      <FormLayout onSubmit={onSubmit} isSubmitting={loading}>
        <Card>
          <CardHeader>
            <CardTitle>{m.task_form_info_title()}</CardTitle>
            <CardDescription>{m.task_form_info_description()}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RadioGroupElement
              control={form.control}
              name="status"
              label={m.task_form_status_label()}
              type={RadioGroupElementType.LIST}
              options={[
                {
                  label: m.status_active(),
                  value: "active",
                  icon: <CirclePlus className="h-4 w-4 text-blue-500" />,
                },
                {
                  label: m.status_inactive(),
                  value: "inactive",
                  icon: <CircleDashed className="h-4 w-4 text-gray-500" />,
                },
                {
                  label: m.status_completed(),
                  value: "completed",
                  icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                },
              ]}
            />
            <InputElement
              control={form.control}
              name="title"
              label={m.task_form_title_label()}
              description={m.task_form_title_description()}
              placeholder={m.task_form_title_placeholder()}
              required
            />
            <TextAreaElement
              control={form.control}
              name="description"
              label={m.task_form_desc_label()}
              placeholder={m.task_form_desc_placeholder()}
              description={m.task_form_desc_description()}
              optional
            />
            <RadioGroupElement
              control={form.control}
              name="priority"
              label={m.task_form_priority_label()}
              type={RadioGroupElementType.CARD}
              options={[
                {
                  label: m.priority_low(),
                  value: "low",
                  icon: <SignalLow className="h-4 w-4 text-emerald-500" />,
                },
                {
                  label: m.priority_medium(),
                  value: "medium",
                  icon: <SignalMedium className="h-4 w-4 text-amber-500" />,
                },
                {
                  label: m.priority_high(),
                  value: "high",
                  icon: <SignalHigh className="h-4 w-4 text-rose-500" />,
                },
              ]}
            />
          </CardContent>
        </Card>
      </FormLayout>
    </Form>
  );
}
