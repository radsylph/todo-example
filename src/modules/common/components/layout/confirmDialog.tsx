import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "#components/ui/alert-dialog";
import { cn } from "#/lib/utils";
import { Triangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  cancelBtnText?: string;
  confirmBtnText?: string;
  disable?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  cancelBtnText,
  confirmBtnText,
  disable,
  isLoading,
  icon,
  className,
  isDestructive,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              {icon ?? <Triangle className="size-4" />}
              <h1>{title}</h1>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span>{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={disable} onClick={onCancel}>
            {cancelBtnText ?? "cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={isDestructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={disable ?? isLoading}
          >
            {confirmBtnText ?? "continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
