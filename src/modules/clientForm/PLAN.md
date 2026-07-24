# Plan: Client Form with Tabs

## Overview

Build a multi-tab client form using the existing project patterns (based on `tasks` module). No data will be persisted to a database — on submit, we simply display a success toast with the form data.

## Architecture

```
src/modules/clientForm/
├── schemas.ts           ✅ Already done
├── types.ts             Create — inferred TS types from Zod
├── components/
│   └── clientForm.tsx   Main form with Tabs, FormLayout, and react-hook-form
├── hooks/
│   └── (optional)       No hooks needed yet
└── logic/
    └── functions.ts     No-op submit handler (toast only)

src/routes/app/clientForm/
└── index.tsx            Update — route component using createFileRoute (TanStack Start)

messages/
├── en.json              Add — new localization keys
└── es.json              Add — new localization keys

src/modules/common/components/layout/sideBar/appSideBar.tsx
                         Update — add "Client Form" nav item to sidebar
```

## Detailed Steps

### 1. `types.ts`

Export inferred types from schemas (same pattern as `tasks/types.ts`):

- `ClientFormSchema`
- `PrimaryInsured`
- `HealthStatement`
- `Beneficiary`
- `FinancialInformation`

### 2. `components/clientForm.tsx` — Main Form Component

**Pattern**: Follow `tasks/components/taskForm.tsx`

**Key differences for tabs:**

- Use `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `#components/ui/tabs`
- Wrap the form in `FormLayout` (from `#components/layout/formLayout`)
- Use `react-hook-form` + `zodResolver` with `clientFormSchema`
- Use `defaultValues` matching the schema structure (all tabs share one form context)
- On submit, call `toast.success(...)` and log the data — no server function call

**Tab structure:**

| Tab | Value | Content |
|---|---|---|
| Primary Insured | `primary` | Primary Insured fields |
| Health Statement | `health` | Health fields |
| Beneficiaries | `beneficiaries` | Beneficiary list (add/remove) |
| Financial Info | `financial` | Financial fields |

**Within each `TabsContent`**, render fields directly using shared form components:

- **InputElement** for strings/numbers: `ssn`, `birthPlace`, `emailAddress`, `cellphoneNumber`, `employerName`, `occupationAndDuties`, `visaType`, `visaNumber`, `timeInUS`, `height`, `weight`, `primaryPhysician`, `lastConsult`, `annualGrossIncome`, etc.
- **SelectElement** (create a wrapper) or raw `<Select>` for enum fields: `driversLicenseIssueState`, `maritalStatus`, `stateOfBirth`, `employerStatus`, `beneficiary.relation`
- **SwitchElement** for booleans: `citizen`, `bankruptcy`
- **useFieldArray** from react-hook-form for the `beneficiaries` array (add/remove rows)

### 3. Nested Field Paths in react-hook-form

Since the schema uses nested objects, field names must use dot notation:

```
"primaryInsured.ssn"
"primaryInsured.driversLicenseIssueState"
"healthStatement.height"
"financialInformation.annualGrossIncome"
```

For `useFieldArray`: use name `"beneficiaries"`.

### 4. Select/Dropdown Component Strategy

The project doesn't have a `SelectElement` wrapper in `common/components/forms/`. 

Create a `SelectElement.tsx` in `src/modules/common/components/forms/` following the same pattern as `InputElement` and `RadioGroupElement` — a thin `FormField` wrapper around `<Select>`, `<SelectTrigger>`, `<SelectContent>`, `<SelectItem>`.

### 5. `logic/functions.ts`

Simple no-op function that returns the data:

```ts
export function submitClientForm(data: ClientFormSchema) {
  // No DB, just return/display the data
  return data;
}
```

Or handle entirely in the component with a toast.

### 6. Routes — TanStack Start File-Based Routing

**File**: `src/routes/app/clientForm/index.tsx`

Follow the pattern from `src/routes/app/task/add.tsx`:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer } from "#components/layout/pageContainer";
import { ClientForm } from "#modules/clientForm/components/clientForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/modules/common/components/ui/breadcrumb";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/app/clientForm/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      title={m.client_form_title()}
      description={m.client_form_description()}
      goBack
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/app/task" search={{ page: 1, limit: 12, orderBy: "desc" }}>
                  {m.tasks_title()}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{m.client_form_title()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <ClientForm />
    </PageContainer>
  );
}
```

### 7. Sidebar Navigation

**File**: `src/modules/common/components/layout/sideBar/appSideBar.tsx`

Add a new item to `sideBarItemsContent`:

```tsx
import { FileText } from "lucide-react"; // add to existing imports

const sideBarItemsContent = [
  {
    title: m.tasks_title(),
    href: "/app/task",
    icon: <List className="size-4" />,
  },
  {
    title: m.client_form_title(),      // NEW
    href: "/app/clientForm",            // NEW
    icon: <FileText className="size-4" />, // NEW
  },
];
```

### 8. Localization Messages

Add the following keys to both language files.

#### `messages/en.json` — New Entries

```json
"client_form_title": "Client Form",
"client_form_description": "Fill in the client information across all sections",
"client_form_saved_success": "Client form submitted successfully",
"client_form_tab_primary": "Primary Insured",
"client_form_tab_health": "Health Statement",
"client_form_tab_beneficiaries": "Beneficiaries",
"client_form_tab_financial": "Financial Information",
"client_form_ssn": "SSN",
"client_form_ssn_placeholder": "123-45-6789",
"client_form_drivers_license_state": "Driver's License Issue State",
"client_form_marital_status": "Marital Status",
"client_form_state_of_birth": "State of Birth",
"client_form_birth_place": "Birth Place",
"client_form_birth_place_placeholder": "City, Country",
"client_form_email": "Email Address",
"client_form_email_placeholder": "client@example.com",
"client_form_cellphone": "Cellphone Number",
"client_form_cellphone_placeholder": "(555) 123-4567",
"client_form_employer_status": "Employer Status",
"client_form_employer_name": "Employer Name",
"client_form_employer_name_placeholder": "Company name",
"client_form_occupation": "Occupation and Duties",
"client_form_occupation_placeholder": "Describe occupation and duties",
"client_form_citizen": "US Citizen",
"client_form_visa_type": "Visa Type",
"client_form_visa_number": "Visa Number",
"client_form_time_in_us": "Time in US (years)",
"client_form_height": "Height (cm)",
"client_form_weight": "Weight (kg)",
"client_form_primary_physician": "Primary Physician",
"client_form_primary_physician_placeholder": "Dr. Name",
"client_form_last_consult": "Last Consultation",
"client_form_last_consult_placeholder": "YYYY-MM-DD",
"client_form_beneficiary_relation": "Relation",
"client_form_beneficiary_name": "Beneficiary Name",
"client_form_beneficiary_name_placeholder": "Full name",
"client_form_beneficiary_percent": "Percentage",
"client_form_add_beneficiary": "Add Beneficiary",
"client_form_remove_beneficiary": "Remove",
"client_form_annual_income": "Annual Gross Income",
"client_form_annual_income_placeholder": "0.00",
"client_form_bankruptcy": "Bankruptcy",
"client_form_select_none": "None",
"client_form_select_other": "Other"
```

#### `messages/es.json` — New Entries

```json
"client_form_title": "Formulario de Cliente",
"client_form_description": "Complete la información del cliente en todas las secciones",
"client_form_saved_success": "Formulario de cliente enviado con éxito",
"client_form_tab_primary": "Asegurado Principal",
"client_form_tab_health": "Declaración de Salud",
"client_form_tab_beneficiaries": "Beneficiarios",
"client_form_tab_financial": "Información Financiera",
"client_form_ssn": "SSN",
"client_form_ssn_placeholder": "123-45-6789",
"client_form_drivers_license_state": "Estado de Emisión de Licencia",
"client_form_marital_status": "Estado Civil",
"client_form_state_of_birth": "Estado de Nacimiento",
"client_form_birth_place": "Lugar de Nacimiento",
"client_form_birth_place_placeholder": "Ciudad, País",
"client_form_email": "Correo Electrónico",
"client_form_email_placeholder": "cliente@ejemplo.com",
"client_form_cellphone": "Número de Celular",
"client_form_cellphone_placeholder": "(555) 123-4567",
"client_form_employer_status": "Situación Laboral",
"client_form_employer_name": "Nombre del Empleador",
"client_form_employer_name_placeholder": "Nombre de la empresa",
"client_form_occupation": "Ocupación y Funciones",
"client_form_occupation_placeholder": "Describa ocupación y funciones",
"client_form_citizen": "Ciudadano Estadounidense",
"client_form_visa_type": "Tipo de Visa",
"client_form_visa_number": "Número de Visa",
"client_form_time_in_us": "Tiempo en EE.UU. (años)",
"client_form_height": "Altura (cm)",
"client_form_weight": "Peso (kg)",
"client_form_primary_physician": "Médico de Cabecera",
"client_form_primary_physician_placeholder": "Dr. Nombre",
"client_form_last_consult": "Última Consulta",
"client_form_last_consult_placeholder": "AAAA-MM-DD",
"client_form_beneficiary_relation": "Relación",
"client_form_beneficiary_name": "Nombre del Beneficiario",
"client_form_beneficiary_name_placeholder": "Nombre completo",
"client_form_beneficiary_percent": "Porcentaje",
"client_form_add_beneficiary": "Agregar Beneficiario",
"client_form_remove_beneficiary": "Eliminar",
"client_form_annual_income": "Ingreso Bruto Anual",
"client_form_annual_income_placeholder": "0.00",
"client_form_bankruptcy": "Bancarrota",
"client_form_select_none": "Ninguno",
"client_form_select_other": "Otro"
```

### 9. File Changes Summary

| File | Action |
|---|---|
| `src/modules/clientForm/types.ts` | **Create** — inferred types |
| `src/modules/clientForm/components/clientForm.tsx` | **Create** — main tabs form |
| `src/modules/clientForm/logic/functions.ts` | **Update** — add submit handler |
| `src/modules/common/components/forms/selectElement.tsx` | **Create** — reusable Select wrapper |
| `src/routes/app/clientForm/index.tsx` | **Update** — route component |
| `src/modules/common/components/layout/sideBar/appSideBar.tsx` | **Update** — add nav item |
| `messages/en.json` | **Update** — add ~35 localization keys |
| `messages/es.json` | **Update** — add ~35 localization keys |

### 10. Edge Cases & Validations to Add (future)

- `visaType` / `visaNumber` / `timeInUS` should be conditionally required only when `citizen === false`
- `employerName` / `occupationAndDuties` should be conditionally required when `employerStatus !== "disabled"` and `!== "retired"`
- `percent` sum across all beneficiaries could be validated to equal 100
- `birthPlace` should be conditionally required only when `stateOfBirth === "other"`
- SSN format validation (XXX-XX-XXXX)
- Phone number format
