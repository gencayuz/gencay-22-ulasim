import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { LicenseData } from "@/types/license";
import { licenseApi } from "@/utils/apiService";
import { convertApiDataToLicense, convertLicenseDataToApi } from "@/utils/dataConversion";

const JPlaka = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LicenseData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiData = await licenseApi.getLicenses('J');
        const convertedData = apiData.map(convertApiDataToLicense);
        setData(convertedData);
      } catch (error) {
        console.error('Failed to load J plaka data:', error);
        toast.error('Veriler yüklenirken hata oluştu');
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("jPlaka");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const convertedData = parsedData.map((item: any) => ({
          ...item,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          healthReport: item.healthReport ? {
            startDate: new Date(item.healthReport.startDate),
            endDate: new Date(item.healthReport.endDate),
          } : {
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          seatInsurance: item.seatInsurance ? {
            startDate: new Date(item.seatInsurance.startDate),
            endDate: new Date(item.seatInsurance.endDate),
          } : {
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          psychotechnic: item.psychotechnic ? {
            startDate: new Date(item.psychotechnic.startDate),
            endDate: new Date(item.psychotechnic.endDate),
          } : {
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          phone: item.phone || "",
          sicilNo: item.sicilNo || "", // Add sicilNo field
          ownerType: item.ownerType || "owner", // Default to owner
          criminalRecord: item.criminalRecord || "no",
          taxCertificate: item.taxCertificate || "no",
          chamberRegistration: item.chamberRegistration || "no",
          active: item.active !== undefined ? item.active : true, // Default to active
        }));
        setData(convertedData);
      } catch (error) {
        console.error("Error parsing saved data", error);
        setData([]);
      }
    }
  };

  const handleSave = async (newItem: LicenseData) => {
    try {
      // Convert to API format and save to server
      const apiData = convertLicenseDataToApi(newItem);
      await licenseApi.saveLicense('J', apiData);
      
      // Update local state
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
      
      // Also save to localStorage as backup
      localStorage.setItem("jPlaka", JSON.stringify([...data.filter(item => item.id !== newItem.id), newItem]));
    } catch (error) {
      console.error('Failed to save license:', error);
      toast.error('Kayıt kaydedilirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Veriler yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Tabs defaultValue="records" className="w-full mb-4">
        <TabsList>
          <TabsTrigger value="home" onClick={() => navigate("/")}>Ana Sayfa</TabsTrigger>
          <TabsTrigger value="records">J Plaka Kayıtları</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="w-full px-1">
        <h2 className="text-xl font-semibold mb-2">J Plaka Kayıtları</h2>
        <EnhancedDataTable data={data} plateType="J" onSave={handleSave} />
      </div>
    </Layout>
  );
};

export default JPlaka;
