import type { ClientFormSchema } from "../types";

/**
 * Formats the entire client form payload into a readable structured block
 * of text intended for clipboard pasting (email, notes, etc.).
 */
export function formatClientFormData(data: ClientFormSchema): string {
	const yes = "✅ Yes";
	const no = "❌ No";
	const na = "—";

	const lines: string[] = [];

	// ─── Primary Insured ───
	lines.push("═══════════════════════════════════════");
	lines.push("  PRIMARY INSURED INFORMATION");
	lines.push("");
	lines.push(`  SSN                        : ${data.primaryInsured.ssn}`);
	lines.push(
		`  Driver's License State      : ${data.primaryInsured.driversLicenseIssueState}`,
	);
	lines.push(
		`  Marital Status              : ${data.primaryInsured.maritalStatus}`,
	);
	lines.push(
		`  State of Birth              : ${data.primaryInsured.stateOfBirth}`,
	);
	lines.push(
		`  Birth Place                 : ${data.primaryInsured.birthPlace}`,
	);
	lines.push(
		`  Email                       : ${data.primaryInsured.emailAddress}`,
	);
	lines.push(
		`  Cellphone                   : ${data.primaryInsured.cellphoneNumber}`,
	);
	lines.push(
		`  Employer Status             : ${data.primaryInsured.employerStatus}`,
	);

	if (
		data.primaryInsured.employerStatus !== "disabled" &&
		data.primaryInsured.employerStatus !== "retired"
	) {
		lines.push(
			`  Employer Name               : ${data.primaryInsured.employerName}`,
		);
		lines.push(
			`  Occupation & Duties          : ${data.primaryInsured.occupationAndDuties}`,
		);
	}

	lines.push(
		`  US Citizen                  : ${data.primaryInsured.citizen ? yes : no}`,
	);

	if (!data.primaryInsured.citizen) {
		lines.push(
			`  Visa Type                   : ${data.primaryInsured.visaType || na}`,
		);
		lines.push(
			`  Visa Number                 : ${data.primaryInsured.visaNumber || na}`,
		);
		lines.push(
			`  Time in US (years)          : ${data.primaryInsured.timeInUS || na}`,
		);
	}

	// ─── Health Statement ───
	lines.push("");
	lines.push("═══════════════════════════════════════");
	lines.push("  HEALTH STATEMENT");
	lines.push("");
	lines.push(`  Height (cm)                 : ${data.healthStatement.height}`);
	lines.push(`  Weight (kg)                 : ${data.healthStatement.weight}`);
	lines.push(
		`  Primary Physician           : ${data.healthStatement.primaryPhysician ? yes : no}`,
	);
	if (data.healthStatement.primaryPhysician) {
		lines.push(
			`  Physician Information       : ${data.healthStatement.primaryPhysicianInfomation}`,
		);
	}
	lines.push(
		`  Last Consultation           : ${data.healthStatement.lastConsult}`,
	);

	// ─── Beneficiaries ───
	lines.push("");
	lines.push("═══════════════════════════════════════");
	lines.push("  BENEFICIARIES");
	if (data.beneficiaries.length === 0) {
		lines.push(`  (none)`);
	} else {
		lines.push("");
		data.beneficiaries.forEach((b, i) => {
			lines.push(`  ${i + 1}. ${b.name} — ${b.relation} — ${b.percent}%`);
		});
	}

	// ─── Financial Information ───
	lines.push("");
	lines.push("═══════════════════════════════════════");
	lines.push("  FINANCIAL INFORMATION");
	lines.push("");
	lines.push(
		`  Annual Gross Income         : $${data.financialInformation.annualGrossIncome.toLocaleString()}`,
	);
	lines.push(
		`  Bankruptcy                  : ${data.financialInformation.bankruptcy ? yes : no}`,
	);

	lines.push("");
	lines.push("═══════════════════════════════════════");

	return lines.join("\n");
}

/**
 * Submits the client form by copying a structured summary to the clipboard.
 *
 * @returns The plain-text formatted summary.
 */
export async function submitClientForm(
	data: ClientFormSchema,
): Promise<string> {
	const formatted = formatClientFormData(data);
	await navigator.clipboard.writeText(formatted);
	return formatted;
}
