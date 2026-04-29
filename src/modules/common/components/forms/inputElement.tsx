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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", props.className)}>
          {props.label && (
            <FormLabel className={cn("", props.labelClassName)}>
              {props.label}
              {props.required && (
                <span className="text-red-500 font-bold">*</span>
              )}
              {props.optional && (
                <span className="text-neutral-400"> (optional)</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder={props.placeholder}
              className={cn("", props.inputClassName)}
              type={props.type ?? "text"}
              disabled={props.disabled}
              autoComplete={props.autoComplete}
              suffix={renderRightAdornment?.(field.value)}
            />
          </FormControl>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
