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
import { Textarea } from "#components/ui/textarea";
import { cn } from "../../../../lib/utils";

interface TextAreaElementProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
> extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  control: Control<TFormValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  optional?: boolean;
  inputClassName?: string;
  labelClassName?: string;
}

export function TextAreaElement<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  control,
  name,
  ...props
}: TextAreaElementProps<TFormValues, TName>) {
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
            <Textarea
              {...field}
              value={field.value ?? ""}
              placeholder={props.placeholder}
              className={cn("text-base font-medium", props.inputClassName)}
              disabled={props.disabled}
              autoComplete={props.autoComplete}
            />
          </FormControl>
          {props.description && (
            <FormDescription className="text-base">
              {props.description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
