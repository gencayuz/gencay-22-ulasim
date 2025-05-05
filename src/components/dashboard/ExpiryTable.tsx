
import React from "react";
import { Phone, AlertCircle } from "lucide-react";

export type ExpiryRecord = {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  type: string;
  documentType: string;
  expiryDate: Date;
  daysLeft: number;
};

interface ExpiryTableProps {
  records: ExpiryRecord[];
}

export const ExpiryTable = ({ records }: ExpiryTableProps) => {
  if (records.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Son 7 Gün ve Süresi Geçmiş Belgeler</h2>
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Adı Soyadı</th>
              <th className="py-3 px-4 text-left font-medium">Telefon</th>
              <th className="py-3 px-4 text-left font-medium">Plaka</th>
              <th className="py-3 px-4 text-left font-medium">Tür</th>
              <th className="py-3 px-4 text-left font-medium">Belge Türü</th>
              <th className="py-3 px-4 text-left font-medium">Bitiş Tarihi</th>
              <th className="py-3 px-4 text-left font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr 
                key={record.id}
                className={`border-b ${
                  record.daysLeft < 0 
                    ? "bg-danger/10" 
                    : record.daysLeft <= 7 
                      ? "bg-warning/30" 
                      : ""
                }`}
              >
                <td className="py-3 px-4">{record.name}</td>
                <td className="py-3 px-4 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {record.phone}
                </td>
                <td className="py-3 px-4">{record.licensePlate}</td>
                <td className="py-3 px-4">{record.type}</td>
                <td className="py-3 px-4">{record.documentType}</td>
                <td className="py-3 px-4">
                  {record.expiryDate.toLocaleDateString('tr-TR')}
                </td>
                <td className="py-3 px-4">
                  {record.daysLeft < 0 ? (
                    <span className="flex items-center text-danger">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {Math.abs(record.daysLeft)} gün önce süresi doldu
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {record.daysLeft} gün kaldı
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
