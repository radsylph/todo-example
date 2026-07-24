import type { ClientFormSchema } from "../types";

// No database persistence — the form is demo-only.
// This function simply returns the validated payload so the caller can
// toast/log it. Returning here keeps the component lean.
export function submitClientForm(data: ClientFormSchema) {
	return data;
}
