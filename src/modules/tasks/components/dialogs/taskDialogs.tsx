import { ConfirmDialog } from "#components/layout/confirmDialog";
import { m } from "#/paraglide/messages";
import { useTaskDialog } from "./taskDialogContex";
import { deleteTaskFn, updateTaskFn } from "#modules/tasks/logic/functions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { TaskStatus } from "../../types";
import { Trash2, Triangle } from "lucide-react";

export function TaskDialogs() {
  const { open, setOpen, dialog, setDialog, task, setTask } = useTaskDialog();
  const router = useRouter();

  const handleConfirm = async () => {
    if (!task) return;

    try {
      if (dialog === "delete") {
        await deleteTaskFn({ data: { taskId: task.id } });
        toast.success(m.task_deleted_success());
      } else if (dialog === "update") {
        const newStatus =
          task.status === TaskStatus.COMPLETED
            ? TaskStatus.ACTIVE
            : TaskStatus.COMPLETED;
        
        await updateTaskFn({ data: { ...task, status: newStatus } });
        toast.success(m.task_updated_success());
      }

      await router.invalidate();
    } catch (error) {
      toast.error("Error processing request");
    } finally {
      setOpen(false);
      setDialog(null);
      setTask(null);
    }
  };

  const deleteDescription = () => {
    return (
      <>
        {m.dialog_delete_description1()}
        {" "}
        <span className="font-semibold">{task?.title}</span>
        {" "}
        {m.dialog_delete_description2()}
      </>
    );
  };

  const updateStatusDescription = () => {
    return (
      <>
        {m.dialog_update_status_description1()}
        {" "}
        <span className="font-semibold">{task?.title}</span>
        {" "}
        {m.dialog_update_status_description2({newStatus: task?.status === TaskStatus.COMPLETED ? m.status_active() : m.status_completed()})}
      </>
    );
  };

  return (
    <>
      <ConfirmDialog
        title={
          dialog === "delete" ? m.dialog_delete_title() : m.dialog_update_status_title()
        }
        description={
          dialog === "delete"
            ? deleteDescription()
            : updateStatusDescription()
        }
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) { 
            setDialog(null);
            setTask(null);
          }
        }}
        icon={dialog === "delete" ? <Trash2 className="size-5 text-rose-500" /> : <Triangle className="size-5 text-amber-500" />}
        onConfirm={handleConfirm}
        isDestructive={dialog === "delete"}
        confirmBtnText={dialog === "delete" ? m.dialog_delete() : m.dialog_update_status()}
        cancelBtnText={m.form_cancel()}
      />
    </>
  );
}