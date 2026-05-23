import { createContext, useState, useContext } from "react";
import type { TaskDialogType, Task, TaskDialogContextType } from "../../types";

export const TaskDialogContext = createContext<TaskDialogContextType | null>(null);


export const useTaskDialog = () => {
    const context = useContext(TaskDialogContext);
    if (!context) throw new Error("useTaskDialog must be used within TaskDialogProvider");
    return context;
};


export function TaskDialogProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState<TaskDialogType | null>(null);
    const [task, setTask] = useState<Task | null>(null);
    return (
        <TaskDialogContext.Provider value={{ open, setOpen, dialog, setDialog, task, setTask }}>
            {children}
        </TaskDialogContext.Provider>
    );
}