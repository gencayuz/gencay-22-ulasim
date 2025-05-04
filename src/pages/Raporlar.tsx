import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LicenseData } from "@/types/license";
import { tr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  PieChart as ReChartsPieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from "recharts";
import * as htmlToImage from 'html-to-image';
import jsPDF from "jspdf";
import { FileDown, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { SMSHistoryTable } from "@/components/SMSHistoryTable";

const Raporlar = () => {
  const [data, setData] = useState<LicenseData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("month");
  const [reportTab, setReportTab] = useState<string>("summary");
  
  useEffect(() => {
    // Combine all the data from different license types
    const loadData = () => {
      const allData: LicenseData[] = [];
      
      // Load data from localStorage
      const mData = localStorage.getItem("mPlaka");
      const sData = localStorage.getItem("sPlaka");
      const jData = localStorage.getItem("jPlaka");
      const d4Data = localStorage.getItem("d4Plaka");
      const d4sData = localStorage.getItem("d4sPlaka");
      
      // Parse and add type information
      if (mData) {
        try {
          const parsed = JSON.parse(mData).map((item: any) => ({
            ...item,
            type: "M",
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            healthReport: item.healthReport ? {
              startDate: new Date(item.healthReport.startDate),
              endDate: new Date(item.healthReport.endDate),
            } : null,
            seatInsurance: item.seatInsurance ? {
              startDate: new Date(item.seatInsurance.startDate),
              endDate: new Date(item.seatInsurance.endDate),
            } : null,
            psychotechnic: item.psychotechnic ? {
              startDate: new Date(item.psychotechnic.startDate),
              endDate: new Date(item.psychotechnic.endDate),
            } : null,
            srcCertificate: item.srcCertificate ? {
              startDate: new Date(item.srcCertificate.startDate),
              endDate: new Date(item.srcCertificate.endDate),
            } : null,
          }));
          allData.push(...parsed);
        } catch (error) {
          console.error("Error parsing M plaka data", error);
        }
      }
      
      // Process other data types similarly
      if (sData) {
        try {
          const parsed = JSON.parse(sData).map((item: any) => ({
            ...item,
            type: "S",
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            healthReport: item.healthReport ? {
              startDate: new Date(item.healthReport.startDate),
              endDate: new Date(item.healthReport.endDate),
            } : null,
            seatInsurance: item.seatInsurance ? {
              startDate: new Date(item.seatInsurance.startDate),
              endDate: new Date(item.seatInsurance.endDate),
            } : null,
            psychotechnic: item.psychotechnic ? {
              startDate: new Date(item.psychotechnic.startDate),
              endDate: new Date(item.psychotechnic.endDate),
            } : null,
          }));
          allData.push(...parsed);
        } catch (error) {
          console.error("Error parsing S plaka data", error);
        }
      }
      
      // Add J plaka
      if (jData) {
        try {
          const parsed = JSON.parse(jData).map((item: any) => ({
            ...item,
            type: "J",
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            healthReport: item.healthReport ? {
              startDate: new Date(item.healthReport.startDate),
              endDate: new Date(item.healthReport.endDate),
            } : null,
            seatInsurance: item.seatInsurance ? {
              startDate: new Date(item.seatInsurance.startDate),
              endDate: new Date(item.seatInsurance.endDate),
            } : null,
            psychotechnic: item.psychotechnic ? {
              startDate: new Date(item.psychotechnic.startDate),
              endDate: new Date(item.psychotechnic.endDate),
            } : null,
          }));
          allData.push(...parsed);
        } catch (error) {
          console.error("Error parsing J plaka data", error);
        }
      }
      
      // Add D4 plaka
      if (d4Data) {
        try {
          const parsed = JSON.parse(d4Data).map((item: any) => ({
            ...item,
            type: "D4",
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            healthReport: item.healthReport ? {
              startDate: new Date(item.healthReport.startDate),
              endDate: new Date(item.healthReport.endDate),
            } : null,
            seatInsurance: item.seatInsurance ? {
              startDate: new Date(item.seatInsurance.startDate),
              endDate: new Date(item.seatInsurance.endDate),
            } : null,
            psychotechnic: item.psychotechnic ? {
              startDate: new Date(item.psychotechnic.startDate),
              endDate: new Date(item.psychotechnic.endDate),
            } : null,
          }));
          allData.push(...parsed);
        } catch (error) {
          console.error("Error parsing D4 plaka data", error);
        }
      }
      
      // Add D4S plaka
      if (d4sData) {
        try {
          const parsed = JSON.parse(d4sData).map((item: any) => ({
            ...item,
            type: "D4S",
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            healthReport: item.healthReport ? {
              startDate: new Date(item.healthReport.startDate),
              endDate: new Date(item.healthReport.endDate),
            } : null,
            seatInsurance: item.seatInsurance ? {
              startDate: new Date(item.seatInsurance.startDate),
              endDate: new Date(item.seatInsurance.endDate),
            } : null,
            psychotechnic: item.psychotechnic ? {
              startDate: new Date(item.psychotechnic.startDate),
              endDate: new Date(item.psychotechnic.endDate),
            } : null,
          }));
          allData.push(...parsed);
        } catch (error) {
          console.error("Error parsing D4S plaka data", error);
        }
      }
      
      return allData;
    };
    
    setData(loadData());
  }, []);
  
  // Calculate expiry stats based on the selected time range
  const getExpiryStats = () => {
    const now = new Date();
    let cutoffDate = now;
    
    if (timeRange === "week") {
      cutoffDate = addDays(now, 7);
    } else if (timeRange === "month") {
      cutoffDate = addDays(now, 30);
    } else if (timeRange === "quarter") {
      cutoffDate = addDays(now, 90);
    }
    
    const expiringLicenses = data.filter(item => 
      isAfter(item.endDate, now) && isBefore(item.endDate, cutoffDate)
    );
    
    const expiringHealth = data.filter(item => 
      item.healthReport && 
      isAfter(item.healthReport.endDate, now) && 
      isBefore(item.healthReport.endDate, cutoffDate)
    );
    
    const expiringSeat = data.filter(item => 
      item.seatInsurance && 
      isAfter(item.seatInsurance.endDate, now) && 
      isBefore(item.seatInsurance.endDate, cutoffDate)
    );
    
    const expiringPsycho = data.filter(item => 
      item.psychotechnic && 
      isAfter(item.psychotechnic.endDate, now) && 
      isBefore(item.psychotechnic.endDate, cutoffDate)
    );
    
    return {
      licenses: expiringLicenses.length,
      health: expiringHealth.length,
      seat: expiringSeat.length,
      psycho: expiringPsycho.length
    };
  };
  
  const stats = getExpiryStats();
  
  // Distribution of vehicle types
  const vehicleDistribution = [
    { name: "M Plaka", value: data.filter(i => i.type === "M").length },
    { name: "S Plaka", value: data.filter(i => i.type === "S").length },
    { name: "J Plaka", value: data.filter(i => i.type === "J").length },
    { name: "D4 Plaka", value: data.filter(i => i.type === "D4").length },
    { name: "D4S Plaka", value: data.filter(i => i.type === "D4S").length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Expiring documents by month
  const today = new Date();
  const nextMonths = Array.from({ length: 6 }, (_, i) => {
    const date = addDays(today, i * 30);
    return {
      month: format(date, "MMMM", { locale: tr }),
      licenses: data.filter(item => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return isAfter(item.endDate, startOfMonth) && isBefore(item.endDate, endOfMonth);
      }).length,
      health: data.filter(item => 
        item.healthReport && 
        isAfter(item.healthReport.endDate, new Date(date.getFullYear(), date.getMonth(), 1)) && 
        isBefore(item.healthReport.endDate, new Date(date.getFullYear(), date.getMonth() + 1, 0))
      ).length,
      seat: data.filter(item => 
        item.seatInsurance && 
        isAfter(item.seatInsurance.endDate, new Date(date.getFullYear(), date.getMonth(), 1)) && 
        isBefore(item.seatInsurance.endDate, new Date(date.getFullYear(), date.getMonth() + 1, 0))
      ).length,
      psycho: data.filter(item => 
        item.psychotechnic && 
        isAfter(item.psychotechnic.endDate, new Date(date.getFullYear(), date.getMonth(), 1)) && 
        isBefore(item.psychotechnic.endDate, new Date(date.getFullYear(), date.getMonth() + 1, 0))
      ).length,
    };
  });

  // Owner vs Driver statistics
  const ownerVsDriverStats = [
    { name: "Araç Sahipleri", value: data.filter(i => i.ownerType === "owner").length },
    { name: "Şoförler", value: data.filter(i => i.ownerType === "driver").length },
  ];
  
  // Document expiry by owner/driver type
  const getOwnerDriverExpiryStats = () => {
    const now = new Date();
    let cutoffDate = now;
    
    if (timeRange === "week") {
      cutoffDate = addDays(now, 7);
    } else if (timeRange === "month") {
      cutoffDate = addDays(now, 30);
    } else if (timeRange === "quarter") {
      cutoffDate = addDays(now, 90);
    }
    
    const ownerExpiryData = {
      licenses: data.filter(item => 
        item.ownerType === "owner" && 
        isAfter(item.endDate, now) && 
        isBefore(item.endDate, cutoffDate)
      ).length,
      health: data.filter(item => 
        item.ownerType === "owner" &&
        item.healthReport && 
        isAfter(item.healthReport.endDate, now) && 
        isBefore(item.healthReport.endDate, cutoffDate)
      ).length,
      seat: data.filter(item => 
        item.ownerType === "owner" &&
        item.seatInsurance && 
        isAfter(item.seatInsurance.endDate, now) && 
        isBefore(item.seatInsurance.endDate, cutoffDate)
      ).length,
      psycho: data.filter(item => 
        item.ownerType === "owner" &&
        item.psychotechnic && 
        isAfter(item.psychotechnic.endDate, now) && 
        isBefore(item.psychotechnic.endDate, cutoffDate)
      ).length,
    };
    
    const driverExpiryData = {
      licenses: data.filter(item => 
        item.ownerType === "driver" && 
        isAfter(item.endDate, now) && 
        isBefore(item.endDate, cutoffDate)
      ).length,
      health: data.filter(item => 
        item.ownerType === "driver" &&
        item.healthReport && 
        isAfter(item.healthReport.endDate, now) && 
        isBefore(item.healthReport.endDate, cutoffDate)
      ).length,
      seat: data.filter(item => 
        item.ownerType === "driver" &&
        item.seatInsurance && 
        isAfter(item.seatInsurance.endDate, now) && 
        isBefore(item.seatInsurance.endDate, cutoffDate)
      ).length,
      psycho: data.filter(item => 
        item.ownerType === "driver" &&
        item.psychotechnic && 
        isAfter(item.psychotechnic.endDate, now) && 
        isBefore(item.psychotechnic.endDate, cutoffDate)
      ).length,
    };
    
    return { ownerExpiryData, driverExpiryData };
  };
  
  const { ownerExpiryData, driverExpiryData } = getOwnerDriverExpiryStats();
  
  // Owner vs driver expiry comparison for bar chart
  const ownerDriverComparisonData = [
    { 
      name: "Ruhsat", 
      "Araç Sahipleri": ownerExpiryData.licenses, 
      "Şoförler": driverExpiryData.licenses 
    },
    { 
      name: "Sağlık Raporu", 
      "Araç Sahipleri": ownerExpiryData.health, 
      "Şoförler": driverExpiryData.health 
    },
    { 
      name: "Koltuk Sigortası", 
      "Araç Sahipleri": ownerExpiryData.seat, 
      "Şoförler": driverExpiryData.seat 
    },
    { 
      name: "Psikoteknik", 
      "Araç Sahipleri": ownerExpiryData.psycho, 
      "Şoförler": driverExpiryData.psycho 
    },
  ];
  
  // Export PDF function
  const exportPDF = async () => {
    try {
      const element = document.getElementById('report-container');
      if (!element) return;
      
      const canvas = await htmlToImage.toCanvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save('plaka-takip-raporu.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    const formattedData = data.map(item => ({
      "Tip": item.type,
      "Adı Soyadı": item.name,
      "Araç Plakası": item.licensePlate,
      "Telefon": item.phone || "-",
      "Araç Yaşı": item.vehicleAge,
      "Kullanıcı Tipi": item.ownerType === "owner" ? "Araç Sahibi" : "Şoför",
      "Ruhsat Bitiş": format(item.endDate, "dd.MM.yyyy"),
      "Sağlık Raporu Bitiş": item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-",
      "Koltuk Sigortası Bitiş": item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-",
      "Psikoteknik Bitiş": item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plaka Kayıtları");
    XLSX.writeFile(workbook, "plaka-takip-verileri.xlsx");
  };
  
  return (
    <Layout>
      <style>
        {`
        .chart-container {
          height: 300px;
        }
        .card-stats {
          margin-bottom: 20px;
        }
        `}
      </style>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Raporlar</h1>
          <div className="flex gap-2">
            <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
              <TabsList>
                <TabsTrigger value="week">7 Gün</TabsTrigger>
                <TabsTrigger value="month">30 Gün</TabsTrigger>
                <TabsTrigger value="quarter">90 Gün</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="outline"
              onClick={exportToExcel}
              className="flex items-center gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button 
              variant="outline"
              onClick={exportPDF}
              className="flex items-center gap-1"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
        
        {/* Main Tabs component that wraps all TabsContent */}
        <Tabs value={reportTab} onValueChange={setReportTab} className="w-full mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="summary">Genel Özet</TabsTrigger>
            <TabsTrigger value="owner-driver">Araç Sahibi/Şoför</TabsTrigger>
            <TabsTrigger value="sms">SMS Geçmişi</TabsTrigger>
          </TabsList>
          
          {/* Summary tab content */}
          <TabsContent value="summary">
            <div id="report-container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="card-stats">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{stats.licenses}</div>
                    <CardTitle className="text-lg">Plakalar</CardTitle>
                    <p className="text-gray-500 text-sm">Süresi dolacak</p>
                  </CardContent>
                </Card>
                <Card className="card-stats">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{stats.health}</div>
                    <CardTitle className="text-lg">Sağlık Raporları</CardTitle>
                    <p className="text-gray-500 text-sm">Süresi dolacak</p>
                  </CardContent>
                </Card>
                <Card className="card-stats">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{stats.seat}</div>
                    <CardTitle className="text-lg">Koltuk Sigortaları</CardTitle>
                    <p className="text-gray-500 text-sm">Süresi dolacak</p>
                  </CardContent>
                </Card>
                <Card className="card-stats">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold">{stats.psycho}</div>
                    <CardTitle className="text-lg">Psikoteknik</CardTitle>
                    <p className="text-gray-500 text-sm">Süresi dolacak</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="mb-4">Araç Tipi Dağılımı</CardTitle>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPieChart>
                          <Pie
                            data={vehicleDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {vehicleDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </ReChartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <CardTitle className="mb-4">Aylara Göre Süreleri Dolacak Belgeler</CardTitle>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={nextMonths}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="licenses" stroke="#8884d8" name="Ruhsat" />
                          <Line type="monotone" dataKey="health" stroke="#82ca9d" name="Sağlık" />
                          <Line type="monotone" dataKey="seat" stroke="#ff7300" name="Koltuk" />
                          <Line type="monotone" dataKey="psycho" stroke="#0088FE" name="Psikoteknik" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Owner/Driver tab content */}
          <TabsContent value="owner-driver">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-4">Araç Sahibi/Şoför Dağılımı</CardTitle>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReChartsPieChart>
                        <Pie
                          data={ownerVsDriverStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </ReChartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-4">Araç Sahibi/Şoför Belge Süresi Karşılaştırması</CardTitle>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ownerDriverComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Araç Sahipleri" fill="#0088FE" />
                        <Bar dataKey="Şoförler" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-4">Araç Sahipleri - Süresi Dolacak Belgeler</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{ownerExpiryData.licenses}</div>
                      <p>Ruhsat</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{ownerExpiryData.health}</div>
                      <p>Sağlık Raporu</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{ownerExpiryData.seat}</div>
                      <p>Koltuk Sigortası</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{ownerExpiryData.psycho}</div>
                      <p>Psikoteknik</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <CardTitle className="mb-4">Şoförler - Süresi Dolacak Belgeler</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{driverExpiryData.licenses}</div>
                      <p>Ruhsat</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{driverExpiryData.health}</div>
                      <p>Sağlık Raporu</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{driverExpiryData.seat}</div>
                      <p>Koltuk Sigortası</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-3xl font-bold">{driverExpiryData.psycho}</div>
                      <p>Psikoteknik</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* SMS History tab content */}
          <TabsContent value="sms">
            <Card>
              <CardContent className="pt-6">
                <CardTitle className="mb-4">SMS Geçmişi</CardTitle>
                <SMSHistoryTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Raporlar;
