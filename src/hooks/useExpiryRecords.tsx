
import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { LicenseData } from "@/types/license";
import { ExpiryRecord } from "@/components/dashboard/ExpiryTable";

export const useExpiryRecords = () => {
  const [expiryRecords, setExpiryRecords] = useState<ExpiryRecord[]>([]);
  const [stats, setStats] = useState({
    mPlaka: 0,
    sPlaka: 0,
    jPlaka: 0,
    d4Plaka: 0,
    d4sPlaka: 0,
    expiringSoon: 0,
    expired: 0,
  });

  useEffect(() => {
    // Get data from localStorage
    const mPlaka = JSON.parse(localStorage.getItem("mPlaka") || "[]");
    const sPlaka = JSON.parse(localStorage.getItem("sPlaka") || "[]");
    const jPlaka = JSON.parse(localStorage.getItem("jPlaka") || "[]");
    const d4Plaka = JSON.parse(localStorage.getItem("d4Plaka") || "[]");
    const d4sPlaka = JSON.parse(localStorage.getItem("d4sPlaka") || "[]");

    const allRecords: ExpiryRecord[] = [];
    const today = new Date();

    // Process all data types and collect expiry records
    const processPlates = (plates: any[], type: string) => {
      plates.forEach((plate: LicenseData) => {
        // Check license expiry
        const endDate = new Date(plate.endDate);
        const daysLeft = differenceInDays(endDate, today);
        
        if (daysLeft <= 7) {
          allRecords.push({
            id: plate.id,
            name: plate.name,
            phone: plate.phone || '-',
            licensePlate: plate.licensePlate,
            type,
            documentType: "Ruhsat",
            expiryDate: endDate,
            daysLeft
          });
        }
        
        // Check health report expiry
        if (plate.healthReport) {
          const healthEndDate = new Date(plate.healthReport.endDate);
          const healthDaysLeft = differenceInDays(healthEndDate, today);
          
          if (healthDaysLeft <= 7) {
            allRecords.push({
              id: `${plate.id}-health`,
              name: plate.name,
              phone: plate.phone || '-',
              licensePlate: plate.licensePlate,
              type,
              documentType: "Sağlık Raporu",
              expiryDate: healthEndDate,
              daysLeft: healthDaysLeft
            });
          }
        }
        
        // Check seat insurance expiry
        if (plate.seatInsurance) {
          const seatEndDate = new Date(plate.seatInsurance.endDate);
          const seatDaysLeft = differenceInDays(seatEndDate, today);
          
          if (seatDaysLeft <= 7) {
            allRecords.push({
              id: `${plate.id}-seat`,
              name: plate.name,
              phone: plate.phone || '-',
              licensePlate: plate.licensePlate,
              type,
              documentType: "Koltuk Sigortası",
              expiryDate: seatEndDate,
              daysLeft: seatDaysLeft
            });
          }
        }
        
        // Check psychotechnic expiry
        if (plate.psychotechnic) {
          const psychoEndDate = new Date(plate.psychotechnic.endDate);
          const psychoDaysLeft = differenceInDays(psychoEndDate, today);
          
          if (psychoDaysLeft <= 7) {
            allRecords.push({
              id: `${plate.id}-psycho`,
              name: plate.name,
              phone: plate.phone || '-',
              licensePlate: plate.licensePlate,
              type,
              documentType: "Psikoteknik",
              expiryDate: psychoEndDate,
              daysLeft: psychoDaysLeft
            });
          }
        }
      });
    };

    processPlates(mPlaka, "M Plaka");
    processPlates(sPlaka, "S Plaka");
    processPlates(jPlaka, "T Plaka"); // Using T Plaka instead of J Plaka
    processPlates(d4Plaka, "D4 Plaka");
    processPlates(d4sPlaka, "D4S Plaka");

    // Sort by days left (expired first)
    allRecords.sort((a, b) => a.daysLeft - b.daysLeft);
    setExpiryRecords(allRecords);

    // Count expiring and expired documents
    const expiringSoon = allRecords.filter(record => record.daysLeft >= 0 && record.daysLeft <= 7).length;
    const expired = allRecords.filter(record => record.daysLeft < 0).length;

    setStats({
      mPlaka: mPlaka.length,
      sPlaka: sPlaka.length,
      jPlaka: jPlaka.length,
      d4Plaka: d4Plaka.length,
      d4sPlaka: d4sPlaka.length,
      expiringSoon,
      expired,
    });
  }, []);

  return { expiryRecords, stats };
};
