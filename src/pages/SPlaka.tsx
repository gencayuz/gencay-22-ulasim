
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/DataTable";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LicenseData } from "@/types/license";

const SPlaka = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LicenseData[]>(() => {
    const savedData = localStorage.getItem("sPlaka");
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
    localStorage.setItem("sPlaka", JSON.stringify(data));
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
          <TabsTrigger value="records">S Plaka Kayıtları</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">S Plaka Kayıtları</h2>
        <DataTable data={data} plateType="S" onSave={handleSave} />
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
      name: "Fatma Öztürk",
      phone: "05xx xxx xx xx",
      licensePlate: "34 S 4321",
      vehicleAge: 6,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      endDate: addDays(today, 5),
      healthReport: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 15),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 25),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 35),
      },
      ownerType: "owner",
    },
    {
      id: "2",
      name: "Ali Kılıç",
      phone: "05xx xxx xx xx",
      licensePlate: "34 S 8765",
      vehicleAge: 4,
      startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
      endDate: addDays(today, 2),
      healthReport: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 12),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 22),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 32),
      },
      ownerType: "driver",
    },
    {
      id: "3",
      name: "Zeynep Şahin",
      phone: "05xx xxx xx xx",
      licensePlate: "34 S 1098",
      vehicleAge: 7,
      startDate: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()),
      endDate: addDays(today, -10),
      healthReport: {
        startDate: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()),
        endDate: addDays(today, -5),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()),
        endDate: addDays(today, 45),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 3, today.getMonth(), today.getDate()),
        endDate: addDays(today, -15),
      },
      ownerType: "owner",
    },
  ];
}

export default SPlaka;
