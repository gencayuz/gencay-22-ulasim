
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { PlateStats } from "@/components/dashboard/PlateStats";
import { ExpiryTable } from "@/components/dashboard/ExpiryTable";
import { StatsSummary } from "@/components/dashboard/StatsSummary";
import { useExpiryRecords } from "@/hooks/useExpiryRecords";

const Index = () => {
  const navigate = useNavigate();
  const { expiryRecords, stats } = useExpiryRecords();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <Layout>
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
            <p className="text-muted-foreground">Keşan Belediyesi Ulaşım Hizmetleri Yönetim Paneli</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>

        <PlateStats stats={stats} />
        <ExpiryTable records={expiryRecords} />
        <StatsSummary stats={stats} />
      </div>
    </Layout>
  );
};

export default Index;
