import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { m } from "#/paraglide/messages";
import { cn } from "../../../../lib/utils";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export interface SelectOption {
	label: React.ReactNode;
	value: string;
}

interface SelectElementProps<
	TFormValues extends FieldValues,
	TName extends FieldPath<TFormValues>,
> {
	control: Control<TFormValues>;
	name: TName;
	options: SelectOption[];
	label?: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;
	optional?: boolean;
	required?: boolean;
	className?: string;
	disabled?: boolean;
}

/**
 * Form-friendly wrapper around the shadcn Select primitive, following the
 * same convention as InputElement / RadioGroupElement.
 */
export function SelectElement<
	TFormValues extends FieldValues,
	TName extends FieldPath<TFormValues>,
>({
	control,
	name,
	options,
	label,
	description,
	placeholder,
	optional,
	required,
	className,
	disabled,
}: SelectElementProps<TFormValues, TName>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("flex flex-col gap-2", className)}>
					{label && (
						<FormLabel>
							<p className="text-base font-medium">{label}</p>
							{required && <span className="text-red-500 font-bold">*</span>}
							{optional && <span className="text-neutral-400">(optional)</span>}
						</FormLabel>
					)}
					<Select
						onValueChange={field.onChange}
						value={field.value}
						disabled={disabled}
					>
						<FormControl>
							<SelectTrigger className="w-full">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label ?? option.value}
								</SelectItem>
							))}
							{options.length === 0 && (
								<div className="px-2 py-1.5 text-sm text-muted-foreground">
									{m.client_form_select_none()}
								</div>
							)}
						</SelectContent>
					</Select>
					{description && (
						<FormDescription className="text-base">
							{description}
						</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
