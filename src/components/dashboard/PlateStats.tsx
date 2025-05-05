
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ClipboardList, FileCheck, FileBarChart } from "lucide-react";
import { StatCard } from "./StatCard";

interface PlateStatsProps {
  stats: {
    mPlaka: number;
    sPlaka: number;
    jPlaka: number;
    d4Plaka: number;
    d4sPlaka: number;
  };
}

export const PlateStats = ({ stats }: PlateStatsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
      <StatCard 
        title="M Plaka" 
        count={stats.mPlaka} 
        icon={FileText}
        color="blue"
        onClick={() => navigate("/m-plaka")}
      />
      <StatCard 
        title="S Plaka" 
        count={stats.sPlaka} 
        icon={ClipboardList}
        color="indigo"
        onClick={() => navigate("/s-plaka")}
      />
      <StatCard 
        title="T Plaka"
        count={stats.jPlaka} 
        icon={FileCheck}
        color="purple"
        onClick={() => navigate("/j-plaka")}
      />
      <StatCard 
        title="D4 Plaka" 
        count={stats.d4Plaka} 
        icon={FileBarChart}
        color="green"
        onClick={() => navigate("/d4-plaka")}
      />
      <StatCard 
        title="D4S Plaka" 
        count={stats.d4sPlaka} 
        icon={FileBarChart}
        color="teal"
        onClick={() => navigate("/d4s-plaka")}
      />
    </div>
  );
};
