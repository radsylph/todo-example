import { z } from "zod";
import { m } from "#/paraglide/messages";

// ─── Enums ───

export const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
] as const;

export const maritalStatus = [
  "married",
  "single",
  "divorced",
  "separated",
  "widowed",
] as const;

export const employerStatus = [
  "disabled",
  "employed",
  "retired",
  "student",
] as const;

export const beneficiaryRelation = [
  "Business",
  "Business Associate",
  "Charity",
  "Child",
  "Church",
  "Friend",
  "Funeral Home",
  "Grandchild",
  "Grandparent",
  "Insured's Estate",
  "Life Partner",
  "Parent",
  "Sibling",
  "Spouse",
  "Trust",
  "Other",
] as const;

// ─── Sub-schemas ───

export const primaryInsuredSchema = z.object({
  ssn: z.string().min(1, "SSN is required"),
  driversLicenseIssueState: z.enum([...usStates, "none"]),
  maritalStatus: z.enum(maritalStatus),
  stateOfBirth: z.enum([...usStates, "other"]),
  birthPlace: z.string(),
  emailAddress: z.email(),
  cellphoneNumber: z.string().min(1, "Phone is required"),
  employerStatus: z.enum(employerStatus),
  employerName: z.string(),
  occupationAndDuties: z.string(),
  citizen: z.boolean(),
  visaType: z.string(),
  visaNumber: z.number(),
  timeInUS: z.number(),
});

export const healthStatementSchema = z.object({
  height: z.number(),
  weight: z.number(),
  primaryPhysician: z.boolean(),
  primaryPhysicianInfomation: z.string(),
  lastConsult: z.string(),
});

export const beneficiarySchema = z.object({
  relation: z.enum(beneficiaryRelation),
  name: z.string(),
  percent: z.number(),
});

export const financialInformationSchema = z.object({
  annualGrossIncome: z.number(),
  bankruptcy: z.boolean(),
});

// ─── Main form schema ───
// Cross-field validations that touch multiple subobjects live here as
// superRefine checks so messages resolve against the current locale at
// validation time (rather than at module load).

export const clientFormSchema = z
  .object({
    primaryInsured: primaryInsuredSchema,
    healthStatement: healthStatementSchema,
    beneficiaries: z.array(beneficiarySchema),
    financialInformation: financialInformationSchema,
  })
  .superRefine((data, ctx) => {
    const insured = data.primaryInsured;
    console.log("test");

    // Birth place required only when stateOfBirth is "other"
    if (insured.stateOfBirth === "other" && !insured.birthPlace.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["primaryInsured", "birthPlace"],
        message: "Birth place is required",
      });
    }

    // Visa fields are only relevant for non-citizens
    if (!insured.citizen) {
      if (!insured.visaType.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryInsured", "visaType"],
          message: m.client_form_validation_visa_type_required(),
        });
      }
      if (!insured.visaNumber) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryInsured", "visaNumber"],
          message: m.client_form_validation_visa_number_required(),
        });
      }
      if (!insured.timeInUS) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryInsured", "timeInUS"],
          message: m.client_form_validation_time_in_us_required(),
        });
      }
    }

    // Employer / occupation only relevant when employed
    if (insured.employerStatus === "employed") {
      if (!insured.employerName.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryInsured", "employerName"],
          message: m.client_form_validation_employer_name_required(),
        });
      }
      if (!insured.occupationAndDuties.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["primaryInsured", "occupationAndDuties"],
          message: m.client_form_validation_occupation_required(),
        });
      }
    }
    // Beneficiary percentages must sum to 100 when any exist
    if (data.beneficiaries.length > 0) {
      const total = data.beneficiaries.reduce(
        (sum, b) => sum + (Number(b.percent) || 0),
        0,
      );
      if (total !== 100) {
        ctx.addIssue({
          code: "custom",
          path: ["beneficiaries", "root"],
          message: m.client_form_validation_beneficiary_percent(),
        });
      }
    }
  });

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
export type PrimaryInsured = z.infer<typeof primaryInsuredSchema>;
export type HealthStatement = z.infer<typeof healthStatementSchema>;
export type Beneficiary = z.infer<typeof beneficiarySchema>;
export type FinancialInformation = z.infer<typeof financialInformationSchema>;
