
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { differenceInDays } from "date-fns";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, FileUp, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LicenseData } from "@/components/DataTable";

type DocumentType = "healthReport" | "seatInsurance" | "psychotechnic" | "srcCertificate";

const Raporlar = () => {
  const navigate = useNavigate();
  const [activeReportTab, setActiveReportTab] = useState<string>("overview");
  
  const allData = useMemo(() => {
    const mPlaka = JSON.parse(localStorage.getItem("mPlaka") || "[]");
    const sPlaka = JSON.parse(localStorage.getItem("sPlaka") || "[]");
    const jPlaka = JSON.parse(localStorage.getItem("jPlaka") || "[]");
    const d4Plaka = JSON.parse(localStorage.getItem("d4Plaka") || "[]");
    const d4sPlaka = JSON.parse(localStorage.getItem("d4sPlaka") || "[]");

    const mPlakaWithType = mPlaka.map((item: any) => ({ ...item, type: "M Plaka", endDate: new Date(item.endDate) }));
    const sPlakaWithType = sPlaka.map((item: any) => ({ ...item, type: "S Plaka", endDate: new Date(item.endDate) }));
    const jPlakaWithType = jPlaka.map((item: any) => ({ ...item, type: "T Plaka", endDate: new Date(item.endDate) }));
    const d4PlakaWithType = d4Plaka.map((item: any) => ({ ...item, type: "D4 Plaka", endDate: new Date(item.endDate) }));
    const d4sPlakaWithType = d4sPlaka.map((item: any) => ({ ...item, type: "D4S Plaka", endDate: new Date(item.endDate) }));

    return [...mPlakaWithType, ...sPlakaWithType, ...jPlakaWithType, ...d4PlakaWithType, ...d4sPlakaWithType];
  }, []);

  const plateTypeStats = useMemo(() => {
    const stats = [
      { name: "M Plaka", value: allData.filter((item: any) => item.type === "M Plaka").length },
      { name: "S Plaka", value: allData.filter((item: any) => item.type === "S Plaka").length },
      { name: "T Plaka", value: allData.filter((item: any) => item.type === "T Plaka").length },
      { name: "D4 Plaka", value: allData.filter((item: any) => item.type === "D4 Plaka").length },
      { name: "D4S Plaka", value: allData.filter((item: any) => item.type === "D4S Plaka").length },
    ];
    return stats;
  }, [allData]);

  const statusStats = useMemo(() => {
    const today = new Date();
    
    const expired = allData.filter((item: any) => {
      const endDate = new Date(item.endDate);
      return differenceInDays(endDate, today) < 0;
    }).length;
    
    const expiringSoon = allData.filter((item: any) => {
      const endDate = new Date(item.endDate);
      const diff = differenceInDays(endDate, today);
      return diff >= 0 && diff <= 7;
    }).length;
    
    const valid = allData.filter((item: any) => {
      const endDate = new Date(item.endDate);
      return differenceInDays(endDate, today) > 7;
    }).length;

    return [
      { name: "Süresi Dolmuş", value: expired },
      { name: "Yakında Dolacak", value: expiringSoon },
      { name: "Geçerli", value: valid },
    ];
  }, [allData]);

  const ageStats = useMemo(() => {
    const ageGroups = [
      { name: "0-2 Yaş", value: 0 },
      { name: "3-5 Yaş", value: 0 },
      { name: "6-10 Yaş", value: 0 },
      { name: "10+ Yaş", value: 0 },
    ];

    allData.forEach((item: any) => {
      const age = item.vehicleAge;
      if (age <= 2) ageGroups[0].value++;
      else if (age <= 5) ageGroups[1].value++;
      else if (age <= 10) ageGroups[2].value++;
      else ageGroups[3].value++;
    });

    return ageGroups;
  }, [allData]);

  // Fixed function to safely handle undefined document types
  const getExpiringDocuments = (docType: DocumentType, days: number = 30) => {
    const today = new Date();
    
    return allData.filter((item: any) => {
      // Check if the document type exists on this item before trying to access it
      if (!item[docType]) return false;
      
      const docEndDate = new Date(item[docType].endDate);
      // Double-check that endDate exists and is valid before calculating days
      if (!docEndDate || isNaN(docEndDate.getTime())) return false;
      
      const daysLeft = differenceInDays(docEndDate, today);
      return daysLeft >= 0 && daysLeft <= days;
    }).map((item: any) => ({
      ...item,
      daysLeft: differenceInDays(new Date(item[docType].endDate), today)
    })).sort((a: any, b: any) => a.daysLeft - b.daysLeft);
  };

  const expiringHealthReports = useMemo(() => getExpiringDocuments("healthReport"), [allData]);
  const expiringSeatInsurance = useMemo(() => getExpiringDocuments("seatInsurance"), [allData]);
  const expiringPsychotechnic = useMemo(() => getExpiringDocuments("psychotechnic"), [allData]);
  // Only access srcCertificate if it's expected to exist
  const expiringSrcCertificates = useMemo(() => getExpiringDocuments("srcCertificate"), [allData]);

  const printReport = () => {
    window.print();
  };

  const COLORS = ["#ea384c", "#FEF7CD", "#65C466"];
  const PLATE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

  const DocumentExpiryTable = ({ documents, title }: { documents: any[], title: string }) => {
    // Generate a document type key from the title
    const getDocumentTypeKey = (title: string): string => {
      // Convert "Sağlık Raporu Belgeleri" to "healthReport"
      // Convert "Koltuk Sigortası Belgeleri" to "seatInsurance"
      // Convert "Psikoteknik Belgeleri" to "psychotechnic"
      // Convert "SRC Belgeleri" to "srcCertificate"
      
      if (title.includes("Sağlık")) return "healthReport";
      if (title.includes("Koltuk")) return "seatInsurance";
      if (title.includes("Psikoteknik")) return "psychotechnic";
      if (title.includes("SRC")) return "srcCertificate";
      
      // Default to a safe value in case the title doesn't match
      return "healthReport";
    };
    
    const docTypeKey = getDocumentTypeKey(title);
    
    return (
      <Card className="print-friendly">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Son 30 gün içinde süresi dolacak belgeler</CardDescription>
          </div>
          <Button onClick={printReport} className="print:hidden">
            <FileText className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adı Soyadı</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Plaka</TableHead>
                  <TableHead>Türü</TableHead>
                  <TableHead>Bitiş Tarihi</TableHead>
                  <TableHead>Kalan Gün</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc: any) => (
                  <TableRow key={`${doc.id}-${docTypeKey}`}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {doc.phone || "-"}
                    </TableCell>
                    <TableCell>{doc.licensePlate}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      {/* Safely access the document's end date */}
                      {doc[docTypeKey] && new Date(doc[docTypeKey].endDate).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <span className={`${doc.daysLeft <= 7 ? "text-amber-500 font-bold" : ""}`}>
                        {doc.daysLeft} gün
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Yakında süresi dolacak belge bulunamadı</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="home" onClick={() => navigate("/")}>Ana Sayfa</TabsTrigger>
          <TabsTrigger value="overview" onClick={() => setActiveReportTab("overview")}>Genel Bakış</TabsTrigger>
          <TabsTrigger value="health" onClick={() => setActiveReportTab("health")}>Sağlık Raporu</TabsTrigger>
          <TabsTrigger value="insurance" onClick={() => setActiveReportTab("insurance")}>Koltuk Sigortası</TabsTrigger>
          <TabsTrigger value="psycho" onClick={() => setActiveReportTab("psycho")}>Psikoteknik</TabsTrigger>
          <TabsTrigger value="src" onClick={() => setActiveReportTab("src")}>SRC Belgesi</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">Sistem Raporları</h2>

        {activeReportTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Belge Durumu</CardTitle>
                <CardDescription>Tüm belgelerin geçerlilik durumu</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kayıt`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plaka Türü Dağılımı</CardTitle>
                <CardDescription>Her plaka türündeki kayıt sayısı</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plateTypeStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kayıt`, '']} />
                    <Legend />
                    <Bar dataKey="value" name="Kayıt Sayısı" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Araç Yaşı Dağılımı</CardTitle>
                <CardDescription>Kayıtlı araçların yaş dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} araç`, '']} />
                    <Legend />
                    <Bar dataKey="value" name="Araç Sayısı" fill="#1A1F2C" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeReportTab === "health" && (
          <DocumentExpiryTable 
            documents={expiringHealthReports} 
            title="Sağlık Raporu Belgeleri" 
          />
        )}
        
        {activeReportTab === "insurance" && (
          <DocumentExpiryTable 
            documents={expiringSeatInsurance} 
            title="Koltuk Sigortası Belgeleri" 
          />
        )}
        
        {activeReportTab === "psycho" && (
          <DocumentExpiryTable 
            documents={expiringPsychotechnic} 
            title="Psikoteknik Belgeleri" 
          />
        )}
        
        {activeReportTab === "src" && (
          <DocumentExpiryTable 
            documents={expiringSrcCertificates} 
            title="SRC Belgeleri" 
          />
        )}
      </div>

      <style jsx="true" global="true">{`
        @media print {
          .print-friendly {
            break-inside: avoid;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Raporlar;
