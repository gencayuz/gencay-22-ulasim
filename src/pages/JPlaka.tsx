
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DataTable, LicenseData } from "@/components/DataTable";
import { toast } from "sonner";
import { addDays } from "date-fns";

const JPlaka = () => {
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
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">J Plaka Kayıtları</h2>
        <DataTable data={data} plateType="J" onSave={handleSave} />
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
      licensePlate: "34 J 9876",
      vehicleAge: 1,
      startDate: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
      endDate: addDays(today, 180),
    },
    {
      id: "2",
      name: "İbrahim Aydın",
      licensePlate: "34 J 5432",
      vehicleAge: 3,
      startDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
      endDate: addDays(today, 7), // Expiring soon
    },
    {
      id: "3",
      name: "Merve Koç",
      licensePlate: "34 J 2109",
      vehicleAge: 5,
      startDate: new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
      endDate: addDays(today, -2), // Expired
    },
  ];
}

export default JPlaka;
