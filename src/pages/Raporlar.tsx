
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { addDays, format, isAfter, isBefore, parseISO } from "date-fns";
import { ButtonGroup, ButtonSegmented, Card, CardContent, CardHeader, CardTitle, ExcelButton, Grid, LineChart, Pie, PieChart, Table, Title } from "@tremor/react";
import { htmlToImage } from "html-to-image";
import jsPDF from "jspdf";
import { LicenseData } from "@/types/license";
import { tr } from "date-fns/locale";

const Raporlar = () => {
  const [data, setData] = useState<LicenseData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("month");
  
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
  
  return (
    <Layout>
      <style>
        {`
        .tremor-Card-root {
          margin-bottom: 20px;
        }
        .chart-container {
          height: 300px;
        }
        `}
      </style>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Raporlar</h1>
          <div className="flex gap-2">
            <ButtonGroup>
              <ButtonSegmented 
                text="Haftalık" 
                icon={() => <span className="text-xs">7g</span>} 
                onClick={() => setTimeRange("week")} 
                selected={timeRange === "week"}
              />
              <ButtonSegmented 
                text="Aylık" 
                icon={() => <span className="text-xs">30g</span>} 
                onClick={() => setTimeRange("month")} 
                selected={timeRange === "month"} 
              />
              <ButtonSegmented 
                text="3 Aylık" 
                icon={() => <span className="text-xs">90g</span>} 
                onClick={() => setTimeRange("quarter")} 
                selected={timeRange === "quarter"} 
              />
            </ButtonGroup>
            <ExcelButton 
              text="Excel" 
              onDownload={() => data} 
              filename="plaka-takip-verileri" 
            />
            <button 
              onClick={exportPDF}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              PDF
            </button>
          </div>
        </div>
        
        <div id="report-container">
          <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Plakalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.licenses}</div>
                <p className="text-gray-500">Süresi dolacak</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sağlık Raporları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.health}</div>
                <p className="text-gray-500">Süresi dolacak</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Koltuk Sigortaları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.seat}</div>
                <p className="text-gray-500">Süresi dolacak</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Psikoteknik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.psycho}</div>
                <p className="text-gray-500">Süresi dolacak</p>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid numItems={1} numItemsSm={2} className="gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Araç Tipi Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <PieChart 
                    data={vehicleDistribution} 
                    index="name"
                    category="value"
                    variant="pie"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Aylara Göre Süreleri Dolacak Belgeler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="chart-container">
                  <LineChart 
                    data={nextMonths}
                    index="month"
                    categories={["licenses", "health", "seat", "psycho"]}
                    colors={["blue", "green", "red", "purple"]}
                    yAxisWidth={30}
                    valueFormatter={(value) => `${value} belge`}
                    customTooltip={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      return (
                        <div className="p-2 bg-white shadow-md rounded border">
                          <div className="text-sm font-medium">{payload[0].payload.month}</div>
                          <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span>Ruhsat: {payload[0]?.value || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span>Sağlık: {payload[1]?.value || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span>Koltuk: {payload[2]?.value || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span>Psikoteknik: {payload[3]?.value || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default Raporlar;
