import type { z } from "zod";
import type {
	beneficiarySchema,
	clientFormSchema,
	financialInformationSchema,
	healthStatementSchema,
	primaryInsuredSchema,
} from "./schemas";

export type ClientFormSchema = z.infer<typeof clientFormSchema>;
export type PrimaryInsured = z.infer<typeof primaryInsuredSchema>;
export type HealthStatement = z.infer<typeof healthStatementSchema>;
export type Beneficiary = z.infer<typeof beneficiarySchema>;
export type FinancialInformation = z.infer<typeof financialInformationSchema>;
