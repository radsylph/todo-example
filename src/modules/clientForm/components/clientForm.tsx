import { zodResolver } from "@hookform/resolvers/zod";
import {
  DollarSign,
  HeartPulse,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { m } from "#/paraglide/messages";
import { InputElement } from "#components/forms/inputElement.tsx";
import {
  SelectElement,
  type SelectOption,
} from "#components/forms/selectElement.tsx";
import { SwitchElement } from "#components/forms/switchElement.tsx";
import { TextAreaElement } from "#components/forms/textAreaElement.tsx";
import FormLayout from "#components/layout/formLayout.tsx";
import { Button } from "#components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { Form } from "#components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { submitClientForm } from "../logic/functions";
import {
  beneficiaryRelation,
  clientFormSchema,
  employerStatus,
  maritalStatus,
  usStates,
} from "../schemas";
import type { ClientFormSchema } from "../types";

// ─── Option helpers ───

const stateOptions = (extra: "none" | "other"): SelectOption[] => [
  {
    value: extra,
    label:
      extra === "none"
        ? m.client_form_select_none()
        : m.client_form_select_other(),
  },
  ...usStates.map((value) => ({ value, label: value })),
];

const driversLicenseStateOptions = stateOptions("none");
const stateOfBirthOptions = stateOptions("other");

const maritalStatusLabels: Record<(typeof maritalStatus)[number], string> = {
  married: m.client_form_marital_married(),
  single: m.client_form_marital_single(),
  divorced: m.client_form_marital_divorced(),
  separated: m.client_form_marital_separated(),
  widowed: m.client_form_marital_widowed(),
};
const maritalStatusOptions = maritalStatus.map((value) => ({
  value,
  label: maritalStatusLabels[value],
}));

const employerStatusLabels: Record<(typeof employerStatus)[number], string> = {
  disabled: m.client_form_employer_disabled(),
  employed: m.client_form_employer_employed(),
  retired: m.client_form_employer_retired(),
  student: m.client_form_employer_student(),
};
const employerStatusOptions = employerStatus.map((value) => ({
  value,
  label: employerStatusLabels[value],
}));

const beneficiaryRelationLabels: Record<
  (typeof beneficiaryRelation)[number],
  string
> = {
  Business: m.client_form_relation_business(),
  "Business Associate": m.client_form_relation_business_associate(),
  Charity: m.client_form_relation_charity(),
  Child: m.client_form_relation_child(),
  Church: m.client_form_relation_church(),
  Friend: m.client_form_relation_friend(),
  "Funeral Home": m.client_form_relation_funeral_home(),
  Grandchild: m.client_form_relation_grandchild(),
  Grandparent: m.client_form_relation_grandparent(),
  "Insured's Estate": m.client_form_relation_insureds_estate(),
  "Life Partner": m.client_form_relation_life_partner(),
  Parent: m.client_form_relation_parent(),
  Sibling: m.client_form_relation_sibling(),
  Spouse: m.client_form_relation_spouse(),
  Trust: m.client_form_relation_trust(),
  Other: m.client_form_relation_other(),
};
const beneficiaryRelationOptions = beneficiaryRelation.map((value) => ({
  value,
  label: beneficiaryRelationLabels[value],
}));

// ─── Default values ───

const defaultValues: ClientFormSchema = {
  primaryInsured: {
    ssn: "",
    driversLicenseIssueState: "none",
    maritalStatus: "single",
    stateOfBirth: "other",
    birthPlace: "",
    emailAddress: "",
    cellphoneNumber: "",
    employerStatus: "employed",
    employerName: "",
    occupationAndDuties: "",
    citizen: true,
    visaType: "",
    visaNumber: 0,
    timeInUS: 0,
  },
  healthStatement: {
    height: 0,
    weight: 0,
    primaryPhysician: false,
    primaryPhysicianInfomation: "",
    lastConsult: "",
  },
  beneficiaries: [],
  financialInformation: {
    annualGrossIncome: 0,
    bankruptcy: false,
  },
};

// ─── Main component ───

interface TabsProps {
  value: string;
  icon: React.ReactNode;
  label: string;
}

function TabsForm({ value, icon, label }: TabsProps) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-primary hover:cursor-pointer"
    >
      {icon}
      {label}
    </TabsTrigger>
  );
}

export function ClientForm() {
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      value: "primary",
      icon: <User className="size-4" />,
      label: m.client_form_tab_primary(),
    },
    {
      value: "health",
      icon: <HeartPulse className="size-4" />,
      label: m.client_form_tab_health(),
    },
    {
      value: "beneficiaries",
      icon: <Users className="size-4" />,
      label: m.client_form_tab_beneficiaries(),
    },
    {
      value: "financial",
      icon: <DollarSign className="size-4" />,
      label: m.client_form_tab_financial(),
    },
  ];

  const form = useForm<ClientFormSchema>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  });

  const beneficiariesFieldArray = useFieldArray({
    control: form.control,
    name: "beneficiaries",
  });

  // Reactive UI state for conditional required markers and live summaries.
  const citizen = useWatch({
    control: form.control,
    name: "primaryInsured.citizen",
  });
  const employerStatusValue = useWatch({
    control: form.control,
    name: "primaryInsured.employerStatus",
  });
  const beneficiaries = useWatch({
    control: form.control,
    name: "beneficiaries",
  });
  const showEmployerFields =
    employerStatusValue !== "disabled" && employerStatusValue !== "retired";
  const totalPercent = (beneficiaries ?? []).reduce(
    (sum, b) => sum + (Number(b?.percent) || 0),
    0,
  );

  const onSubmit = (data: ClientFormSchema) => {
    setLoading(true);
    const result = submitClientForm(data);
    console.log("client form submitted", result);
    toast.success(m.client_form_saved_success());
    setLoading(false);
  };

  return (
    <Form {...form}>
      <FormLayout onSubmit={onSubmit} isSubmitting={loading}>
        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="w-full" variant="default">
            {tabs.map((tab) => (
              <TabsForm key={tab.value} {...tab} />
            ))}
          </TabsList>

          {/* ─── Primary Insured ─── */}
          <TabsContent value="primary">
            <Card>
              <CardHeader>
                <CardTitle>{m.client_form_tab_primary()}</CardTitle>
                <CardDescription>{m.client_form_description()}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputElement
                    control={form.control}
                    name="primaryInsured.ssn"
                    label={m.client_form_ssn()}
                    placeholder={m.client_form_ssn_placeholder()}
                    description={m.client_form_validation_ssn()}
                    required
                  />
                  <SelectElement
                    control={form.control}
                    name="primaryInsured.driversLicenseIssueState"
                    label={m.client_form_drivers_license_state()}
                    options={driversLicenseStateOptions}
                    placeholder={m.client_form_drivers_license_state()}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectElement
                    control={form.control}
                    name="primaryInsured.maritalStatus"
                    label={m.client_form_marital_status()}
                    options={maritalStatusOptions}
                    placeholder={m.client_form_marital_status()}
                    required
                  />
                  <SelectElement
                    control={form.control}
                    name="primaryInsured.stateOfBirth"
                    label={m.client_form_state_of_birth()}
                    options={stateOfBirthOptions}
                    placeholder={m.client_form_state_of_birth()}
                    required
                  />
                </div>
                {form.getValues("primaryInsured.stateOfBirth") === "other" && (
                  <InputElement
                    control={form.control}
                    name="primaryInsured.birthPlace"
                    label={m.client_form_birth_place()}
                    placeholder={m.client_form_birth_place_placeholder()}
                    required
                  />
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputElement
                    control={form.control}
                    name="primaryInsured.emailAddress"
                    label={m.client_form_email()}
                    placeholder={m.client_form_email_placeholder()}
                    type="email"
                    required
                  />
                  <InputElement
                    control={form.control}
                    name="primaryInsured.cellphoneNumber"
                    label={m.client_form_cellphone()}
                    placeholder={m.client_form_cellphone_placeholder()}
                    // description={m.client_form_validation_phone()}
                    required
                  />
                </div>

                <SelectElement
                  control={form.control}
                  name="primaryInsured.employerStatus"
                  label={m.client_form_employer_status()}
                  options={employerStatusOptions}
                  placeholder={m.client_form_employer_status()}
                  required
                />
                {form.getValues("primaryInsured.employerStatus") ===
                  "employed" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputElement
                      control={form.control}
                      name="primaryInsured.employerName"
                      label={m.client_form_employer_name()}
                      placeholder={m.client_form_employer_name_placeholder()}
                      required={showEmployerFields}
                      optional={!showEmployerFields}
                    />
                    <InputElement
                      control={form.control}
                      name="primaryInsured.occupationAndDuties"
                      label={m.client_form_occupation()}
                      placeholder={m.client_form_occupation_placeholder()}
                      required={showEmployerFields}
                      optional={!showEmployerFields}
                    />
                  </div>
                )}

                <SwitchElement
                  control={form.control}
                  name="primaryInsured.citizen"
                  label={m.client_form_citizen()}
                />
                {form.getValues("primaryInsured.citizen") && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InputElement
                      control={form.control}
                      name="primaryInsured.visaType"
                      label={m.client_form_visa_type()}
                      placeholder={m.client_form_visa_type()}
                      required={!citizen}
                      optional={citizen}
                    />
                    <InputElement
                      control={form.control}
                      name="primaryInsured.visaNumber"
                      label={m.client_form_visa_number()}
                      type="number"
                      required={!citizen}
                      optional={citizen}
                    />
                    <InputElement
                      control={form.control}
                      name="primaryInsured.timeInUS"
                      label={m.client_form_time_in_us()}
                      type="number"
                      required={!citizen}
                      optional={citizen}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Health Statement ─── */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>{m.client_form_tab_health()}</CardTitle>
                <CardDescription>{m.client_form_description()}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputElement
                    control={form.control}
                    name="healthStatement.height"
                    label={m.client_form_height()}
                    type="number"
                    required
                  />
                  <InputElement
                    control={form.control}
                    name="healthStatement.weight"
                    label={m.client_form_weight()}
                    type="number"
                    required
                  />
                </div>
                <SwitchElement
                  control={form.control}
                  name="healthStatement.primaryPhysician"
                  label={m.client_form_primary_physician()}
                />
                {form.getValues("healthStatement.primaryPhysician") && (
                  <TextAreaElement
                    control={form.control}
                    name="healthStatement.primaryPhysicianInfomation"
                    label={m.client_form_primary_physician_information_label()}
                    placeholder={m.client_form_primary_physician_information_placeholder()}
                  />
                )}
                <InputElement
                  control={form.control}
                  name="healthStatement.lastConsult"
                  label={m.client_form_last_consult()}
                  placeholder={m.client_form_last_consult_placeholder()}
                  required
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Beneficiaries ─── */}
          <TabsContent value="beneficiaries">
            <Card>
              <CardHeader>
                <CardTitle>{m.client_form_tab_beneficiaries()}</CardTitle>
                <CardDescription>{m.client_form_description()}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {beneficiariesFieldArray.fields.length > 0 && (
                  <div
                    className={
                      totalPercent === 100
                        ? "text-sm font-medium text-emerald-600 dark:text-emerald-400"
                        : "text-sm font-medium text-rose-600 dark:text-rose-400"
                    }
                  >
                    {m.client_form_beneficiaries_total({ total: totalPercent })}
                    {totalPercent !== 100 &&
                      ` — ${m.client_form_beneficiaries_expected()}`}
                  </div>
                )}
                {beneficiariesFieldArray.fields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {m.client_form_tab_beneficiaries()}
                  </p>
                )}

                {beneficiariesFieldArray.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-md border border-border p-4 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        onClick={() => beneficiariesFieldArray.remove(index)}
                        aria-label={m.client_form_remove_beneficiary()}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <SelectElement
                      control={form.control}
                      name={`beneficiaries.${index}.relation`}
                      label={m.client_form_beneficiary_relation()}
                      options={beneficiaryRelationOptions}
                      placeholder={m.client_form_beneficiary_relation()}
                      required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputElement
                        control={form.control}
                        name={`beneficiaries.${index}.name`}
                        label={m.client_form_beneficiary_name()}
                        placeholder={m.client_form_beneficiary_name_placeholder()}
                        required
                      />
                      <InputElement
                        control={form.control}
                        name={`beneficiaries.${index}.percent`}
                        label={m.client_form_beneficiary_percent()}
                        type="number"
                        required
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-fit"
                  onClick={() => {
                    beneficiariesFieldArray.append({
                      relation: "Child",
                      name: "",
                      percent: 0,
                    });
                  }}
                >
                  <Plus className="mr-2 size-4" />
                  {m.client_form_add_beneficiary()}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Financial Information ─── */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>{m.client_form_tab_financial()}</CardTitle>
                <CardDescription>{m.client_form_description()}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <InputElement
                  control={form.control}
                  name="financialInformation.annualGrossIncome"
                  label={m.client_form_annual_income()}
                  placeholder={m.client_form_annual_income_placeholder()}
                  type="number"
                  required
                />
                <SwitchElement
                  control={form.control}
                  name="financialInformation.bankruptcy"
                  label={m.client_form_bankruptcy()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FormLayout>
    </Form>
  );
}
