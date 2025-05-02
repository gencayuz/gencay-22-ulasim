
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { LicenseData } from "@/types/license";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { toast } from "sonner";
import { addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const MPlaka = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LicenseData[]>(() => {
    const savedData = localStorage.getItem("mPlaka");
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
          srcCertificate: item.srcCertificate ? {
            startDate: new Date(item.srcCertificate.startDate),
            endDate: new Date(item.srcCertificate.endDate),
          } : undefined,
          licenseDocument: item.licenseDocument || null,
          ownerType: item.ownerType || "owner",
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
    localStorage.setItem("mPlaka", JSON.stringify(data));
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
          <TabsTrigger value="records">M Plaka Kayıtları</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">M Plaka Kayıtları</h2>
        <EnhancedDataTable data={data} plateType="M" onSave={handleSave} />
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
      name: "Ahmet Yılmaz",
      phone: "0555 123 4567",
      licensePlate: "34 M 1234",
      vehicleAge: 3,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      endDate: addDays(today, 15),
      healthReport: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 30),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 5),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, -3), // Expired
      },
      srcCertificate: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 60),
      },
      licenseDocument: null,
      ownerType: "owner",
    },
    {
      id: "2",
      name: "Mehmet Demir",
      phone: "0532 987 6543",
      licensePlate: "34 M 5678",
      vehicleAge: 5,
      startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
      endDate: addDays(today, 3),
      healthReport: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 60),
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 45),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 10),
      },
      srcCertificate: {
        startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
        endDate: addDays(today, 90),
      },
      licenseDocument: null,
      ownerType: "driver",
    },
    {
      id: "3",
      name: "Ayşe Kaya",
      phone: "0533 456 7890",
      licensePlate: "34 M 9012",
      vehicleAge: 2,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      endDate: addDays(today, -5), // Expired
      healthReport: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 7), // About to expire
      },
      seatInsurance: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 180),
      },
      psychotechnic: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 90),
      },
      srcCertificate: {
        startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
        endDate: addDays(today, 45),
      },
      licenseDocument: null,
      ownerType: "owner",
    },
  ];
}

export default MPlaka;
