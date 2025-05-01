
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { differenceInDays } from "date-fns";
import { Layout } from "@/components/Layout";
import type { LicenseData } from "@/components/DataTable";

const Raporlar = () => {
  const allData = useMemo(() => {
    const mPlaka = JSON.parse(localStorage.getItem("mPlaka") || "[]");
    const sPlaka = JSON.parse(localStorage.getItem("sPlaka") || "[]");
    const jPlaka = JSON.parse(localStorage.getItem("jPlaka") || "[]");

    const mPlakaWithType = mPlaka.map((item: any) => ({ ...item, type: "M Plaka", endDate: new Date(item.endDate) }));
    const sPlakaWithType = sPlaka.map((item: any) => ({ ...item, type: "S Plaka", endDate: new Date(item.endDate) }));
    const jPlakaWithType = jPlaka.map((item: any) => ({ ...item, type: "J Plaka", endDate: new Date(item.endDate) }));

    return [...mPlakaWithType, ...sPlakaWithType, ...jPlakaWithType];
  }, []);

  const plateTypeStats = useMemo(() => {
    const stats = [
      { name: "M Plaka", value: allData.filter((item: any) => item.type === "M Plaka").length },
      { name: "S Plaka", value: allData.filter((item: any) => item.type === "S Plaka").length },
      { name: "J Plaka", value: allData.filter((item: any) => item.type === "J Plaka").length },
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

  const COLORS = ["#ea384c", "#FEF7CD", "#65C466"];
  const PLATE_COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Layout>
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">Sistem Raporları</h2>

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
      </div>
    </Layout>
  );
};

export default Raporlar;
