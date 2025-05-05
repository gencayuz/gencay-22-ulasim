
import React from "react";
import { SummaryCard } from "./SummaryCard";

interface StatsSummaryProps {
  stats: {
    mPlaka: number;
    sPlaka: number;
    jPlaka: number;
    d4Plaka: number;
    d4sPlaka: number;
    expiringSoon: number;
    expired: number;
  };
}

export const StatsSummary = ({ stats }: StatsSummaryProps) => {
  const totalPlates = stats.mPlaka + stats.sPlaka + stats.jPlaka + stats.d4Plaka + stats.d4sPlaka;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <SummaryCard title="Özet Bilgiler">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-medium">Toplam Plaka Sayısı:</span>
          <span>{totalPlates}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-medium">Süresi Dolmuş Belge:</span>
          <span className="text-danger font-semibold">{stats.expired}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Süresi Yakında Dolacak Belge:</span>
          <span className="text-amber-500 font-semibold">{stats.expiringSoon}</span>
        </div>
      </SummaryCard>
      
      <SummaryCard title="Plaka Dağılımı">
        <div className="space-y-3">
          <PlateDistributionBar label="M Plaka" count={stats.mPlaka} color="blue" />
          <PlateDistributionBar label="S Plaka" count={stats.sPlaka} color="indigo" />
          <PlateDistributionBar label="J Plaka" count={stats.jPlaka} color="purple" />
          <PlateDistributionBar label="D4 Plaka" count={stats.d4Plaka} color="green" />
          <PlateDistributionBar label="D4S Plaka" count={stats.d4sPlaka} color="teal" />
        </div>
      </SummaryCard>
    </div>
  );
};

interface PlateDistributionBarProps {
  label: string;
  count: number;
  color: string;
}

const PlateDistributionBar = ({ label, count, color }: PlateDistributionBarProps) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">{count}</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 rounded-full`}
        style={{ width: `${Math.min(100, count * 5)}%` }}
      ></div>
    </div>
  </div>
);
