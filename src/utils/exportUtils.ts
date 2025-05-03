
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { LicenseData } from "@/types/license";
import { toast } from "sonner";

/**
 * Export license data to Excel file
 */
export const exportToExcel = (data: LicenseData[], plateType: string) => {
  // Format dates for Excel export
  const formattedData = data.map(item => ({
    "Adı Soyadı": item.name,
    "Araç Sahibi / Şoför": item.ownerType === "owner" ? "Araç Sahibi" : "Şoför",
    "Araç Plakası": item.licensePlate,
    "Telefon": item.phone || "-",
    "Araç Yaşı": item.vehicleAge,
    "Sabıka Kaydı": item.criminalRecord === "yes" ? "Var" : "Yok",
    "Vergi Levhası": item.taxCertificate === "yes" ? "Var" : "Yok",
    "Oda Kaydı": item.chamberRegistration === "yes" ? "Var" : "Yok",
    "Ruhsat Başlangıç": format(item.startDate, "dd.MM.yyyy"),
    "Ruhsat Bitiş": format(item.endDate, "dd.MM.yyyy"),
    "Sağlık Raporu Başlangıç": item.healthReport ? format(item.healthReport.startDate, "dd.MM.yyyy") : "-",
    "Sağlık Raporu Bitiş": item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-",
    "Koltuk Sigortası Başlangıç": item.seatInsurance ? format(item.seatInsurance.startDate, "dd.MM.yyyy") : "-",
    "Koltuk Sigortası Bitiş": item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-",
    "Psikoteknik Başlangıç": item.psychotechnic ? format(item.psychotechnic.startDate, "dd.MM.yyyy") : "-",
    "Psikoteknik Bitiş": item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-",
  }));

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${plateType}_Plaka`);
  
  // Generate Excel file
  XLSX.writeFile(workbook, `${plateType}_Plaka_Kayitlari.xlsx`);
  toast.success("Excel dosyası indirildi.");
};

/**
 * Export license data to Word file
 */
export const exportToWord = (data: LicenseData[], plateType: string) => {
  // Create a formatted HTML string for Word document
  let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${plateType} Plaka Kayıtları</title>
      <style>
        table {border-collapse: collapse; width: 100%; margin-bottom: 20px;}
        th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
        th {background-color: #f2f2f2;}
        h1 {text-align: center;}
      </style>
    </head>
    <body>
      <h1>${plateType} Plaka Kayıtları</h1>
      <table>
        <tr>
          <th>Adı Soyadı</th>
          <th>Araç Sahibi / Şoför</th>
          <th>Araç Plakası</th>
          <th>Telefon</th>
          <th>Araç Yaşı</th>
          <th>Sabıka Kaydı</th>
          <th>Vergi Levhası</th>
          <th>Oda Kaydı</th>
          <th>Ruhsat Tarihleri</th>
          <th>Sağlık Raporu</th>
          <th>Koltuk Sigortası</th>
          <th>Psikoteknik</th>
        </tr>
  `;

  // Add data rows
  data.forEach(item => {
    html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.ownerType === "owner" ? "Araç Sahibi" : "Şoför"}</td>
        <td>${item.licensePlate}</td>
        <td>${item.phone || "-"}</td>
        <td>${item.vehicleAge}</td>
        <td>${item.criminalRecord === "yes" ? "Var" : "Yok"}</td>
        <td>${item.taxCertificate === "yes" ? "Var" : "Yok"}</td>
        <td>${item.chamberRegistration === "yes" ? "Var" : "Yok"}</td>
        <td>
          Başlangıç: ${format(item.startDate, "dd.MM.yyyy")}<br>
          Bitiş: ${format(item.endDate, "dd.MM.yyyy")}
        </td>
        <td>
          Başlangıç: ${item.healthReport ? format(item.healthReport.startDate, "dd.MM.yyyy") : "-"}<br>
          Bitiş: ${item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-"}
        </td>
        <td>
          Başlangıç: ${item.seatInsurance ? format(item.seatInsurance.startDate, "dd.MM.yyyy") : "-"}<br>
          Bitiş: ${item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-"}
        </td>
        <td>
          Başlangıç: ${item.psychotechnic ? format(item.psychotechnic.startDate, "dd.MM.yyyy") : "-"}<br>
          Bitiş: ${item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-"}
        </td>
      </tr>
    `;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  // Create a Blob containing the HTML content
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  
  // Create a link to download the file and trigger it
  const link = document.createElement('a');
  link.href = url;
  link.download = `${plateType}_Plaka_Kayitlari.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Word dosyası indirildi.");
};
