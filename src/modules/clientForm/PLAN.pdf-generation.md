# Plan: Generate a PDF on Client Form Submission

## Goal

When a client completes and saves the form, the app should generate a simple downloadable PDF containing the submitted information instead of copying a text summary to the clipboard.

## Current behaviour

- `src/modules/clientForm/logic/functions.ts` formats the payload as plain text via `formatClientFormData` and writes it to `navigator.clipboard` in `submitClientForm`.
- `src/modules/clientForm/components/clientForm.tsx` awaits `submitClientForm`, logs the formatted text, and shows a success toast.
- The fallback path still logs the formatted text if the clipboard API fails.

## Proposed behaviour

- On valid submit, build a PDF client-side and trigger a browser download.
- Remove the clipboard write and the clipboard-fallback path entirely.
- Keep the success toast; add an error toast if PDF generation fails.
- Reuse the existing structured layout (Primary Insured, Health Statement, Beneficiaries, Financial Information) inside the PDF.

## Out of scope

- No server-side persistence.
- No e-mailing the PDF.
- No print preview / print dialog (download only).
- No advanced styling (cover page, logos, signatures) for the first iteration.

## PDF generation approach

### Recommended library: `jspdf` (client-side)

Add `jspdf` to dependencies. For the beneficiaries table we can optionally add `jspdf-autotable`; for a first simple version we can also render beneficiaries as plain lines and avoid the extra dependency.

| Option | Pros | Cons |
|---|---|---|
| `jspdf` | Small, widely used, Vite-friendly, sufficient for simple text layouts | Tables need an optional plugin; default font has limited Unicode support |
| `pdfmake` | Declarative document definitions, built-in tables | Larger bundle; font setup in Vite is more involved |
| `@react-pdf/renderer` | React-style API | Heavy; overkill for a one-page summary |
| `html2pdf.js` / `html2canvas` | Renders existing DOM | Slow; pulls in html2canvas; not needed for structured data |

### Font / encoding note

The default `jspdf` font (Helvetica) supports basic Latin characters only. The current plain-text formatter uses emoji (`✅`, `❌`) and box-drawing characters that will not render. The PDF builder should use plain-text labels such as `Yes` / `No` and simple separators (`---` or whitespace).

### Content layout

1. Title: "Client Form Summary" (or localized equivalent).
2. Generated-at timestamp.
3. Section: Primary Insured — label/value pairs, conditionally omitting irrelevant fields (employer info, visa info).
4. Section: Health Statement — label/value pairs, conditionally showing physician info.
5. Section: Beneficiaries — numbered list or small table.
6. Section: Financial Information — income and bankruptcy flag.

## Files to change

| File | Change |
|---|---|
| `package.json` | Add `jspdf` (and `jspdf-autotable` if we use tables) to `dependencies`. |
| `src/modules/clientForm/logic/functions.ts` | Replace clipboard logic with `generateClientFormPdf`. Keep `formatClientFormData` if we want a plain-text fallback, but stop using it for the happy path. |
| `src/modules/clientForm/components/clientForm.tsx` | Update `onSubmit` to call the new PDF generator; remove `formatClientFormData` import if no longer used; handle errors. |
| `messages/en.json` / `messages/es.json` | Add/change keys for the success toast and a new error toast (e.g., `client_form_pdf_error`). |

## Detailed implementation steps

### 1. Add the dependency

```bash
pnpm add jspdf
# optional, if we render beneficiaries as a table
pnpm add jspdf-autotable
```

### 2. Build the PDF generator in `logic/functions.ts`

```ts
import { jsPDF } from "jspdf";
import type { ClientFormSchema } from "../types";

export function generateClientFormPdf(data: ClientFormSchema): void {
  const doc = new jsPDF();
  const left = 14;
  let y = 20;
  const lineHeight = 7;

  const addHeading = (text: string) => {
    doc.setFontSize(16);
    doc.text(text, left, y);
    y += lineHeight * 1.5;
    doc.setFontSize(12);
  };

  const addLabelValue = (label: string, value: string) => {
    doc.text(`${label}: ${value}`, left, y);
    y += lineHeight;
  };

  doc.setFontSize(20);
  doc.text("Client Form Summary", left, y);
  y += lineHeight * 2;
  doc.setFontSize(12);
  addLabelValue("Generated", new Date().toLocaleString());
  y += lineHeight;

  addHeading("Primary Insured");
  addLabelValue("SSN", data.primaryInsured.ssn);
  addLabelValue("Driver's License State", data.primaryInsured.driversLicenseIssueState);
  addLabelValue("Marital Status", data.primaryInsured.maritalStatus);
  addLabelValue("State of Birth", data.primaryInsured.stateOfBirth);
  if (data.primaryInsured.stateOfBirth === "other") {
    addLabelValue("Birth Place", data.primaryInsured.birthPlace);
  }
  addLabelValue("Email", data.primaryInsured.emailAddress);
  addLabelValue("Cellphone", data.primaryInsured.cellphoneNumber);
  addLabelValue("Employer Status", data.primaryInsured.employerStatus);
  if (data.primaryInsured.employerStatus !== "disabled" && data.primaryInsured.employerStatus !== "retired") {
    addLabelValue("Employer Name", data.primaryInsured.employerName);
    addLabelValue("Occupation & Duties", data.primaryInsured.occupationAndDuties);
  }
  addLabelValue("US Citizen", data.primaryInsured.citizen ? "Yes" : "No");
  if (!data.primaryInsured.citizen) {
    addLabelValue("Visa Type", data.primaryInsured.visaType || "—");
    addLabelValue("Visa Number", String(data.primaryInsured.visaNumber || "—"));
    addLabelValue("Time in US (years)", String(data.primaryInsured.timeInUS || "—"));
  }

  y += lineHeight;
  addHeading("Health Statement");
  addLabelValue("Height (cm)", String(data.healthStatement.height));
  addLabelValue("Weight (kg)", String(data.healthStatement.weight));
  addLabelValue("Primary Physician", data.healthStatement.primaryPhysician ? "Yes" : "No");
  if (data.healthStatement.primaryPhysician) {
    addLabelValue("Physician Information", data.healthStatement.primaryPhysicianInfomation);
  }
  addLabelValue("Last Consultation", data.healthStatement.lastConsult);

  y += lineHeight;
  addHeading("Beneficiaries");
  if (data.beneficiaries.length === 0) {
    doc.text("None", left, y);
    y += lineHeight;
  } else {
    data.beneficiaries.forEach((b, i) => {
      doc.text(`${i + 1}. ${b.name} — ${b.relation} — ${b.percent}%`, left, y);
      y += lineHeight;
    });
  }

  y += lineHeight;
  addHeading("Financial Information");
  addLabelValue("Annual Gross Income", `$${data.financialInformation.annualGrossIncome.toLocaleString()}`);
  addLabelValue("Bankruptcy", data.financialInformation.bankruptcy ? "Yes" : "No");

  doc.save(`client-form-${Date.now()}.pdf`);
}
```

> The exact helper names, spacing, and filename format are configurable. The key point is that PDF generation stays synchronous and client-side.

### 3. Update the component submit handler

```ts
const onSubmit = async (data: ClientFormSchema) => {
  setLoading(true);
  try {
    generateClientFormPdf(data);
    toast.success(m.client_form_saved_success());
  } catch (err) {
    console.error("Failed to generate client form PDF", err);
    toast.error(m.client_form_pdf_error());
  } finally {
    setLoading(false);
  }
};
```

Remove the `formatClientFormData` import if it is no longer referenced.

### 4. Localization

Add to both `messages/en.json` and `messages/es.json`:

```json
{
  "client_form_pdf_error": "Could not generate the PDF. Please try again."
}
```

Spanish:

```json
{
  "client_form_pdf_error": "No se pudo generar el PDF. Inténtalo de nuevo."
}
```

Optionally localize the PDF title and section headings as well if we decide to render the PDF in the active locale.

## Error handling

- Wrap PDF generation in `try/catch`.
- On failure, show `toast.error(m.client_form_pdf_error())` and keep the form values so the user can retry.
- The loading spinner should be reset in a `finally` block.

## Testing strategy

- Unit test `generateClientFormPdf` indirectly by asserting it does not throw for valid data and that it calls `doc.save`. Because `jsPDF` is heavily DOM/canvas-independent, we can mock it in Vitest.
- Add a minimal test in `logic/functions.test.ts` (new file) covering:
  - citizen vs non-citizen field omission
  - employer-status conditionals
  - empty beneficiaries list
- Component test: submit the form and assert the success toast path is reached.

## Resolved decisions

1. **PDF content language** — English-only PDF content; localize only the UI toasts.
2. **Beneficiaries layout** — Numbered list (no `jspdf-autotable` dependency).
3. **Download filename** — Timestamped with the client's name: `client-form-{clientname}-{timestamp}.pdf`. Resolved as option **B**: add a `primaryInsured.fullName` field.
4. **Plain-text formatter** — Remove `formatClientFormData` entirely.
5. **PDF library** — Client-side `jspdf`; no server function.

## Resolved item — client name field added

`ClientFormSchema` did not contain a client/full-name field, so option **B** was chosen: add `primaryInsured.fullName` (`z.string().min(1)`), a new `InputElement`, and `client_form_full_name` / `client_form_full_name_placeholder` localization keys. The PDF filename is derived from this field.

## Follow-up docs

- Create an ADR under `docs/adr/` for the PDF library choice (`jspdf`, client-side).
- Update `CONTEXT.md` with a short note describing the "Client form PDF" artifact if the term becomes part of the shared domain language.
