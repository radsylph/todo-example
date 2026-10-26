import { jsPDF } from "jspdf";
import type { ClientFormSchema } from "../types";

const yes = "Sí";
const no = "No";
const na = "—";

/**
 * Builds a filename from the client's full name and the current timestamp.
 * Non-alphanumeric characters are stripped so the name is filesystem-safe.
 */
function buildPdfFilename(fullName: string): string {
	const safeName = fullName.trim().replace(/[^a-z0-9]+/gi, "-");
	return `formulario-cliente-${safeName}-${Date.now()}.pdf`;
}

/**
 * Generates a one-page PDF summary of the client form and triggers a browser
 * download. This runs entirely client-side.
 *
 * NOTE: Content is hardcoded in Spanish by request. Make this dynamic when the
 * PDF language needs to follow the active Paraglide locale.
 */
export function generateClientFormPdf(data: ClientFormSchema): void {
	const doc = new jsPDF();
	const left = 14;
	const lineHeight = 7;
	let y = 20;

	const ensurePageBreak = (needed = lineHeight) => {
		if (y + needed > 280) {
			doc.addPage();
			y = 20;
		}
	};

	const addHeading = (text: string) => {
		ensurePageBreak(lineHeight * 2);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(14);
		doc.text(text, left, y);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(11);
		y += lineHeight * 1.5;
	};

	const addLabelValue = (label: string, value: string) => {
		ensurePageBreak();
		doc.text(`${label}: ${value}`, left, y);
		y += lineHeight;
	};

	// ─── Title ───
	doc.setFont("helvetica", "bold");
	doc.setFontSize(20);
	doc.text("Resumen del Formulario de Cliente", left, y);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	y += lineHeight * 1.5;
	doc.text(`Generado: ${new Date().toLocaleString()}`, left, y);
	doc.setFontSize(11);
	y += lineHeight * 1.5;

	// ─── Primary Insured ───
	addHeading("Asegurado Principal");
	addLabelValue("Nombre Completo", data.primaryInsured.fullName);
	addLabelValue("SSN", data.primaryInsured.ssn);
	addLabelValue(
		"Estado de Emisión de Licencia",
		data.primaryInsured.driversLicenseIssueState,
	);
	if (data.primaryInsured.driversLicenseIssueState !== "none") {
		addLabelValue(
			"Número de Licencia",
			data.primaryInsured.driversLicenseNumber,
		);
	}
	addLabelValue("Estado Civil", data.primaryInsured.maritalStatus);
	addLabelValue("Estado de Nacimiento", data.primaryInsured.stateOfBirth);
	if (data.primaryInsured.stateOfBirth === "other") {
		addLabelValue("Lugar de Nacimiento", data.primaryInsured.birthPlace);
	}
	addLabelValue("Correo Electrónico", data.primaryInsured.emailAddress);
	addLabelValue("Número de Celular", data.primaryInsured.cellphoneNumber);
	addLabelValue("Situación Laboral", data.primaryInsured.employerStatus);
	if (
		data.primaryInsured.employerStatus !== "disabled" &&
		data.primaryInsured.employerStatus !== "retired"
	) {
		addLabelValue("Nombre del Empleador", data.primaryInsured.employerName);
		addLabelValue(
			"Ocupación y Funciones",
			data.primaryInsured.occupationAndDuties,
		);
	}
	addLabelValue("Ciudadano Estadounidense", data.primaryInsured.citizen ? yes : no);
	if (!data.primaryInsured.citizen) {
		addLabelValue("Tipo de Visa", data.primaryInsured.visaType || na);
		addLabelValue(
			"Número de Visa",
			String(data.primaryInsured.visaNumber || na),
		);
		addLabelValue(
			"Tiempo en EE.UU. (años)",
			String(data.primaryInsured.timeInUS || na),
		);
	}

	// ─── Health Statement ───
	y += lineHeight;
	addHeading("Declaración de Salud");
	addLabelValue("Altura (cm)", String(data.healthStatement.height));
	addLabelValue("Peso (kg)", String(data.healthStatement.weight));
	addLabelValue(
		"Médico de Cabecera",
		data.healthStatement.primaryPhysician ? yes : no,
	);
	if (data.healthStatement.primaryPhysician) {
		addLabelValue(
			"Información del Médico",
			data.healthStatement.primaryPhysicianInfomation,
		);
	}
	addLabelValue(
		"Tiene Medicamentos Recetados",
		data.healthStatement.hasPrescriptionMedicine ? yes : no,
	);
	if (data.healthStatement.hasPrescriptionMedicine) {
		addLabelValue(
			"Medicamentos Recetados",
			data.healthStatement.prescriptionMedicine,
		);
	}
	addLabelValue("Última Consulta", data.healthStatement.lastConsult);

	// ─── Beneficiaries ───
	y += lineHeight;
	addHeading("Beneficiarios");
	if (data.beneficiaries.length === 0) {
		ensurePageBreak();
		doc.text("Ninguno", left, y);
		y += lineHeight;
	} else {
		data.beneficiaries.forEach((b, i) => {
			ensurePageBreak();
			doc.text(`${i + 1}. ${b.name} - ${b.relation} - ${b.percent}%`, left, y);
			y += lineHeight;
		});
	}

	// ─── Financial Information ───
	y += lineHeight;
	addHeading("Información Financiera");
	addLabelValue(
		"Ingreso Bruto Anual",
		`$${data.financialInformation.annualGrossIncome.toLocaleString()}`,
	);
	addLabelValue("Bancarrota", data.financialInformation.bankruptcy ? yes : no);

	doc.save(buildPdfFilename(data.primaryInsured.fullName));
}
