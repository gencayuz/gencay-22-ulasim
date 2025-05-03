import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LicenseData } from "@/types/license";

const JPlaka = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LicenseData[]>(() => {
    const savedData = localStorage.getItem("jPlaka");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        return parsedData.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          healthReport: item.healthReport ? {
            startDate: new Date(item.healthReport.startDate),
            endDate: new Date(item.healthReport.endDate),
          } : {
            startDate: new Date(),
            endDate: addDays(new Date(), 365),
          },
          seatInsurance: item.seatInsurance ? {
            startDate: new Date(item.seatInsurance.startDate),
            endDate: new Date(item.seatInsurance.endDate),
          } : {
            startDate: new Date(),
            endDate: addDays(new Date(), 365),
          },
          psychotechnic: item.psychotechnic ? {
            startDate: new Date(item.psychotechnic.startDate),
            endDate: new Date(item.psychotechnic.endDate),
          } : {
            startDate: new Date(),
            endDate: addDays(new Date(), 365),
          },
          phone: item.phone || "",
          ownerType: item.ownerType || "owner", // Default to owner
          criminalRecord: item.criminalRecord || "no",
          taxCertificate: item.taxCertificate || "no",
          chamberRegistration: item.chamberRegistration || "no",
        }));
      } catch (error) {
        console.error("Error parsing saved data", error);
        return generateInitialData();
      }
    } else {
      return generateInitialData();
    }
  });

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem("jPlaka", JSON.stringify(data));
  }, [data]);

  const handleSave = (newItem: LicenseData) => {
    setData((prevData) => {
      const index = prevData.findIndex((item) => item.id === newItem.id);
      if (index >= 0) {
        // Update existing item
        const updatedData = [...prevData];
        updatedData[index] = newItem;
        toast.success("Kayıt güncellendi");
        return updatedData;
      } else {
        // Add new item
        toast.success("Yeni kayıt eklendi");
        return [...prevData, newItem];
      }
    });
  };

  return (
    <Layout>
      <Tabs defaultValue="records" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="home" onClick={() => navigate("/")}>Ana Sayfa</TabsTrigger>
          <TabsTrigger value="records">T Plaka Kayıtları</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">T Plaka Kayıtları</h2>
        <EnhancedDataTable data={data} plateType="J" onSave={handleSave} />
      </div>
    </Layout>
  );
};

// Helper function to generate initial sample data
function generateInitialData(): LicenseData[] {
  const today = new Date();
  
  return [
    {
      id: "1",
      name: "Hasan Yıldız",
      phone: "05xx xxx xx xx",
      licensePlate: "34 J 9876",
      vehicleAge: 1,
      startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
      endDate: addDays(today, 180),
      healthReport: {
        startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
        endDate: addDays(today, 180),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
        endDate: addDays(today, 180),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
        endDate: addDays(today, 180),
      },
      ownerType: "owner",
    },
    {
      id: "2",
      name: "İbrahim Aydın",
      phone: "05xx xxx xx xx",
      licensePlate: "34 J 5432",
      vehicleAge: 3,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      endDate: addDays(today, 7), // Expiring soon
      healthReport: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 30),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 60),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 90),
      },
      ownerType: "driver",
    },
    {
      id: "3",
      name: "Merve Koç",
      phone: "05xx xxx xx xx",
      licensePlate: "34 J 2109",
      vehicleAge: 5,
      startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
      endDate: addDays(today, -2), // Expired
      healthReport: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, -5),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 120),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, -10),
      },
      ownerType: "owner",
    },
  ];
}

export default JPlaka;
