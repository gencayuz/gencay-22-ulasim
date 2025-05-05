
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { FileText, ClipboardList, FileCheck, BarChart3, AlertCircle, FileBarChart, LogOut, Phone } from "lucide-react";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { LicenseData } from "@/types/license";

const TotalCard = ({ 
  title, 
  count, 
  icon: Icon, 
  color, 
  onClick 
}: { 
  title: string; 
  count: number; 
  icon: React.ElementType; 
  color: string; 
  onClick: () => void 
}) => (
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

type ExpiryRecord = {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  type: string;
  documentType: string;
  expiryDate: Date;
  daysLeft: number;
};

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mPlaka: 0,
    sPlaka: 0,
    jPlaka: 0,
    d4Plaka: 0,
    d4sPlaka: 0,
    expiringSoon: 0,
    expired: 0,
  });

  const [expiryRecords, setExpiryRecords] = useState<ExpiryRecord[]>([]);

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
    processPlates(jPlaka, "T Plaka"); // Changed from J Plaka to T Plaka
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
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
            title="T Plaka" // Changed from J Plaka to T Plaka
            count={stats.jPlaka} 
            icon={FileCheck}
            color="purple"
            onClick={() => navigate("/j-plaka")}
          />
          <TotalCard 
            title="D4 Plaka" 
            count={stats.d4Plaka} 
            icon={FileBarChart}
            color="green"
            onClick={() => navigate("/d4-plaka")}
          />
          <TotalCard 
            title="D4S Plaka" 
            count={stats.d4sPlaka} 
            icon={FileBarChart}
            color="teal"
            onClick={() => navigate("/d4s-plaka")}
          />
        </div>

        {expiryRecords.length > 0 && (
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
                  {expiryRecords.map((record) => (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Özet Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Toplam Plaka Sayısı:</span>
                <span>{stats.mPlaka + stats.sPlaka + stats.jPlaka + stats.d4Plaka + stats.d4sPlaka}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Süresi Dolmuş Belge:</span>
                <span className="text-danger font-semibold">{stats.expired}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Süresi Yakında Dolacak Belge:</span>
                <span className="text-amber-500 font-semibold">{stats.expiringSoon}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Plaka Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">M Plaka</span>
                    <span className="text-sm">{stats.mPlaka}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.min(100, stats.mPlaka * 5)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">S Plaka</span>
                    <span className="text-sm">{stats.sPlaka}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min(100, stats.sPlaka * 5)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">J Plaka</span>
                    <span className="text-sm">{stats.jPlaka}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${Math.min(100, stats.jPlaka * 5)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">D4 Plaka</span>
                    <span className="text-sm">{stats.d4Plaka}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${Math.min(100, stats.d4Plaka * 5)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">D4S Plaka</span>
                    <span className="text-sm">{stats.d4sPlaka}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
                      style={{ width: `${Math.min(100, stats.d4sPlaka * 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
