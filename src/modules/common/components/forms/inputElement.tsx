import { useState } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "#components/ui/input";
import { cn } from "../../../../lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

interface InputElementProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<TFormValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  optional?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  renderRightAdornment?: (fieldValue: TFormValues[TName]) => React.ReactNode;
}

export function InputElement<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  control,
  name,
  renderRightAdornment,
  ...props
}: InputElementProps<TFormValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", props.className)}>
          {props.label && (
            <FormLabel className={cn("", props.labelClassName)}>
             <p className="text-base font-medium">{props.label}</p>
              {props.required && (
                <span className="text-red-500 font-bold">*</span>
              )}
              {props.optional && (
                <span className="text-neutral-400">(optional)</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative flex items-center">
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={props.placeholder}
                className={cn(
                  "text-base font-medium",
                  isPassword && "pr-10",
                  props.inputClassName,
                )}
                type={isPassword ? (showPassword ? "text" : "password") : (props.type ?? "text")}
                disabled={props.disabled}
                autoComplete={props.autoComplete}
              />
              {isPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full flex items-center justify-center px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              )}
              {!isPassword && renderRightAdornment && (
                 <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                   {renderRightAdornment(field.value)}
                 </div>
              )}
            </div>
          </FormControl>
          {props.description && (
            <FormDescription className="text-base">{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
