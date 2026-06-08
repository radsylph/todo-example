import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "#components/ui/radio-group.tsx";
import { cn } from "#/lib/utils";
import { Field, FieldLabel, FieldTitle } from "#components/ui/field.tsx";

interface RadioGroupElementItems {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
}

export enum RadioGroupElementType {
  CARD = "card",
  LIST = "list",
}

const radioGroupVariants = {
  [RadioGroupElementType.CARD]: {
    group: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2",
    item: "block w-full cursor-pointer border rounded-md p-2 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md",
    selected: "shadow-lg -translate-y-1 shadow-lg",
    unselected: "border-border",
    content: "flex items-center justify-between p-2",
    icon: "mr-2",
    label: "text-base font-medium",
    labelSelected: "text-primary",
    labelUnselected: "text-muted-foreground",
  },
  [RadioGroupElementType.LIST]: {
    group: "flex flex-col gap-1",
    item: "flex items-center cursor-pointer rounded-md px-3 py-2 transition-all duration-200 hover:bg-accent/50 has-data-[state=checked]:bg-accent/80",
    selected: "",
    unselected: "",
    content: "flex items-center justify-between gap-3",
    icon: "mr-2",
    label: "text-sm font-medium",
    labelSelected: "text-foreground font-semibold",
    labelUnselected: "text-muted-foreground",
  },
};

interface RadioGroupElementProps<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
> {
  control: Control<TFormValues>;
  name: TName;
  options: RadioGroupElementItems[];
  label?: string;
  className?: string;
  onChange?: (value: string) => void;
  type?: RadioGroupElementType;
}

export function RadioGroupElement<
  TFormValues extends FieldValues,
  TName extends FieldPath<TFormValues>,
>({
  control,
  name,
  options,
  label,
  className,
  onChange,
  type = RadioGroupElementType.CARD,
  ...props
}: RadioGroupElementProps<TFormValues, TName>) {
  const variant = radioGroupVariants[type];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          {label && <FormLabel className="text-base">{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
              }}
              value={field.value}
              {...props}
              className={cn(variant.group)}
            >
              {options.map((option) => (
                <FormItem key={option.value}>
                  <Field
                    orientation={
                      type === RadioGroupElementType.LIST
                        ? "horizontal"
                        : "responsive"
                    }
                    className={type === RadioGroupElementType.LIST ? "w-fit" : ""}
                  >
                    <FieldLabel
                      htmlFor={option.value}
                      className={cn(
                        variant.item,
                        field.value === option.value && variant.selected,
                      )}
                    >
                      <div className={variant.content}>
                        <div className="flex items-center">
                          {option.icon && (
                            <span className={variant.icon}>{option.icon}</span>
                          )}
                          <FieldTitle
                            className={cn(
                              variant.label,
                              field.value === option.value
                                ? variant.labelSelected
                                : variant.labelUnselected,
                            )}
                          >
                            {option.label}
                          </FieldTitle>
                        </div>
                        <FormControl>
                          <RadioGroupItem value={option.value} id={option.value} className="border border-accent-foreground"/>
                        </FormControl>
                      </div>
                    </FieldLabel>
                  </Field>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
