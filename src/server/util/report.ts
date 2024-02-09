import { Activity } from "@prisma/client";

import PDFKit from "pdfkit";

export function generateReport(
  name: string,
  totalHours: number,
  activities: Activity[],
) {
  const doc = new PDFKit();

  const lorem = "Volunteer Report";

  doc.text(lorem, {
    align: "center",
  });

  doc.moveDown();

  doc.text(name);

  doc.moveDown();

  doc.text(`Total working hours: ${totalHours}`);

  doc.moveDown();

  doc.text("Volunteered Events");

  activities.forEach(({ title }) => {
    doc.text(title);
    doc.moveDown();
  });

  doc.end();

  const data = doc.read();
  return data.toString("base64");
}
