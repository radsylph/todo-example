import React, { useState } from "react";
import { Loader2, Save, TriangleAlert, X, ArrowLeft } from "lucide-react";
import { useCanGoBack, useRouter, useBlocker } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";
import { ConfirmDialog } from "./confirmDialog";
import { Button } from "#components/ui/button";

interface FormProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  goBack?: boolean;
  onSubmit?: (data: any) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}
//mejorar el form layout  y hacer los demas componentes como se hizo en xprmedia

export default function FormLayout({
  children,
  onSubmit,
  submitLabel = "Save changes",
  cancelLabel = "Cancel",
  isSubmitting: isSubmittingProp,
}: FormProps) {
  const [openReset, setOpenReset] = useState(false);
  const router = useRouter();
  const form = useFormContext();

  const { proceed, reset: blockerReset, status } = useBlocker({
    shouldBlockFn: () => isDirty && !isSubmitting,
    withResolver: true,
  });

  if (!form) {
    throw new Error("FormLayout must be used within a FormProvider");
  }

  const {
    formState: { isDirty, isSubmitting: isFormSubmitting },
    reset: formReset
  } = form;
  const isSubmitting = isSubmittingProp ?? isFormSubmitting;
  const canGoBack = useCanGoBack();

  const handleGoBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (isDirty) {
      setOpenReset(true)
    } else {
      executeGoBack();
    }
  };

  const executeGoBack = () => {
    canGoBack ? router.history.back() : router.navigate({ to: "/app/task" });
  };

  return (
    <>
      <form
        onSubmit={
          onSubmit ? form.handleSubmit(onSubmit) : (e) => e.preventDefault()
        }
        className="flex-1 flex flex-col gap-8 pb-28"
      >
        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
          <div className="bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4 flex items-center justify-end gap-3 px-6 ring-1 ring-black/5 dark:ring-white/5">
            <Button
              variant="outline"
              onClick={() => handleGoBack()}
              disabled={isSubmitting}
            >
              {isDirty ? (
                <X className="mr-2 size-4" />
              ) : (
                <ArrowLeft className="mr-2 size-4" />
              )}
              {isDirty ? "Reset Changes" : cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (onSubmit && !isDirty)}
              className="min-w-36 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>

      {/* <LeaveConfirmation shouldBlock={isDirty && !isSubmitting} /> */}

      <ConfirmDialog
        title={"You have unsaved changes"}
        icon={<TriangleAlert className="size-5 text-amber-500" />}
        description={"Are you sure you want to leave? Your changes will be lost."}
        onConfirm={() => proceed?.()}
        cancelBtnText={"Stay"}
        confirmBtnText={"Leave"}
        open={status === "blocked"}
        onOpenChange={() => blockerReset?.()}
      />

      <ConfirmDialog
        open={openReset}
        onOpenChange={setOpenReset}
        title="Reset changes?"
        description="All your changes will be lost if you reset."
        onConfirm={() => {
          formReset();
          setOpenReset(false);
        }}
        onCancel={() => setOpenReset(false)}
        confirmBtnText="Reset Changes"
        cancelBtnText="Keep Editing"
        isDestructive
      />
    </>
  );
}

export interface LeaveProps {
  shouldBlock: boolean;
  title?: string;
  message?: string;
  leaveText?: string;
  stayText?: string;
}

export function LeaveConfirmation({
  shouldBlock,
  title = "You have unsaved changes",
  message = "Are you sure you want to leave? Your changes will be lost.",
  leaveText = "Leave",
  stayText = "Stay",
}: LeaveProps) {
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => shouldBlock,
    withResolver: true,
  });

  return (
    <ConfirmDialog
      title={title}
      icon={<TriangleAlert className="size-5 text-amber-500" />}
      description={message}
      onConfirm={() => proceed?.()}
      cancelBtnText={stayText}
      confirmBtnText={leaveText}
      open={status === "blocked"}
      onOpenChange={() => reset?.()}
    />
  );
}
