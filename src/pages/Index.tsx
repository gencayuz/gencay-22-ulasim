
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { FileText, ClipboardList, FileCheck, BarChart3, AlertCircle } from "lucide-react";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";

const TotalCard = ({ title, count, icon: Icon, color, onClick }: { title: string; count: number; icon: React.ElementType; color: string; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full bg-${color}-100`}>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{count}</p>
    </CardContent>
    <CardFooter>
      <Button variant="ghost" size="sm" className="w-full">Görüntüle</Button>
    </CardFooter>
  </Card>
);

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mPlaka: 0,
    sPlaka: 0,
    jPlaka: 0,
    expiringSoon: 0,
    expired: 0,
  });

  useEffect(() => {
    // Get data from localStorage
    const mPlaka = JSON.parse(localStorage.getItem("mPlaka") || "[]");
    const sPlaka = JSON.parse(localStorage.getItem("sPlaka") || "[]");
    const jPlaka = JSON.parse(localStorage.getItem("jPlaka") || "[]");

    const allData = [...mPlaka, ...sPlaka, ...jPlaka];
    const today = new Date();

    // Count expiring and expired documents
    const expiringSoon = allData.filter((item: any) => {
      const endDate = new Date(item.endDate);
      const diff = differenceInDays(endDate, today);
      return diff >= 0 && diff <= 7;
    }).length;

    const expired = allData.filter((item: any) => {
      const endDate = new Date(item.endDate);
      return differenceInDays(endDate, today) < 0;
    }).length;

    setStats({
      mPlaka: mPlaka.length,
      sPlaka: sPlaka.length,
      jPlaka: jPlaka.length,
      expiringSoon,
      expired,
    });
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hoşgeldiniz</h1>
          <p className="text-muted-foreground">Plaka takip sistemi yönetim paneli</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalCard 
            title="M Plaka" 
            count={stats.mPlaka} 
            icon={FileText}
            color="blue"
            onClick={() => navigate("/m-plaka")}
          />
          <TotalCard 
            title="S Plaka" 
            count={stats.sPlaka} 
            icon={ClipboardList}
            color="indigo"
            onClick={() => navigate("/s-plaka")}
          />
          <TotalCard 
            title="J Plaka" 
            count={stats.jPlaka} 
            icon={FileCheck}
            color="purple"
            onClick={() => navigate("/j-plaka")}
          />
          <TotalCard 
            title="Raporlar" 
            count={stats.mPlaka + stats.sPlaka + stats.jPlaka} 
            icon={BarChart3}
            color="slate"
            onClick={() => navigate("/raporlar")}
          />
        </div>

        {(stats.expiringSoon > 0 || stats.expired > 0) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Uyarılar</h2>
            <div className="space-y-4">
              {stats.expired > 0 && (
                <Card className="bg-danger/10 border-danger/20">
                  <CardHeader>
                    <CardTitle className="text-danger flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Süresi Dolmuş Belgeler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Toplam {stats.expired} belgenin süresi dolmuş.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => navigate("/raporlar")}>
                      Raporlara Git
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {stats.expiringSoon > 0 && (
                <Card className="bg-warning/30 border-warning/20">
                  <CardHeader>
                    <CardTitle className="text-amber-600 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Süresi Yakında Dolacak Belgeler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Toplam {stats.expiringSoon} belgenin süresi önümüzdeki 7 gün içinde dolacak.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => navigate("/raporlar")}>
                      Raporlara Git
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
