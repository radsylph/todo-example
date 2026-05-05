import React, { useState } from "react";
import { Loader2, Save, TriangleAlert, X, ArrowLeft } from "lucide-react";
import { useCanGoBack, useRouter, useBlocker } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";
import { ConfirmDialog } from "./confirmDialog";
import { Button } from "#components/ui/button";
import { m } from "#/paraglide/messages";

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

export default function FormLayout({
  children,
  onSubmit,
  submitLabel,
  cancelLabel,
  isSubmitting: isSubmittingProp,
}: FormProps) {
  const finalSubmitLabel = submitLabel ?? m.form_save_changes();
  const finalCancelLabel = cancelLabel ?? m.form_cancel();
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

        <div className="sticky bottom-6 self-center z-50 w-[calc(100%-2rem)] max-w-xl md:max-w-2xl lg:max-w-4xl">
          <div className="bg-background/80 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 ring-1 ring-black/5 dark:ring-white/5">
            <div className="hidden sm:flex flex-col">
              <p className="text-sm font-medium text-foreground/80">
                {isDirty ? m.form_unsaved_changes() : m.form_all_changes_saved()}
              </p>
              <p className="text-xs text-muted-foreground">
                {isDirty
                  ? m.form_remember_save()
                  : m.form_safely_exit()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-3">
              <Button
              type="button"
                variant={isDirty ? "destructive" : "outline"}
                onClick={(e) => handleGoBack(e)}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {isDirty ? (
                  <X className="mr-2 size-4" />
                ) : (
                  <ArrowLeft className="mr-2 size-4" />
                )}
                {isDirty ? m.form_reset_changes() : finalCancelLabel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (onSubmit && !isDirty)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {finalSubmitLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        title={m.form_confirm_leave_title()}
        icon={<TriangleAlert className="size-5 text-amber-500" />}
        description={m.form_confirm_leave_desc()}
        onConfirm={() => proceed?.()}
        cancelBtnText={m.form_confirm_stay()}
        confirmBtnText={m.form_confirm_leave()}
        open={status === "blocked"}
        onOpenChange={() => blockerReset?.()}
      />

      <ConfirmDialog
        open={openReset}
        onOpenChange={setOpenReset}
        title={m.form_reset_title()}
        icon={<TriangleAlert className="size-5 text-amber-500" />}
        description={m.form_reset_desc()}
        onConfirm={() => {
          formReset()
          setOpenReset(false)
        }}
        onCancel={() => setOpenReset(false)}
        confirmBtnText={m.form_reset_changes()}
        cancelBtnText={m.form_keep_editing()}
        isDestructive
      />
    </>
  );
}