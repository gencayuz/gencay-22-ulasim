import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, AlertCircle, Bell, Search, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { tr } from "date-fns/locale";

export interface LicenseData {
  id: string;
  name: string;
  phone: string;
  licensePlate: string;
  vehicleAge: number;
  startDate: Date;
  endDate: Date;
  healthReport: {
    startDate: Date;
    endDate: Date;
  };
  seatInsurance: {
    startDate: Date;
    endDate: Date;
  };
  psychotechnic: {
    startDate: Date;
    endDate: Date;
  };
  srcCertificate: {
    startDate: Date;
    endDate: Date;
  };
  licenseDocument?: string | null;
}

interface DataTableProps {
  data: LicenseData[];
  plateType: string;
  onSave: (data: LicenseData) => void;
  renderActionButtons?: (record: LicenseData) => React.ReactNode;
}

export function DataTable({ data, plateType, onSave, renderActionButtons }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state for adding/editing entries
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<LicenseData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleAge, setVehicleAge] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  
  // State for additional fields
  const [healthStartDate, setHealthStartDate] = useState<Date | undefined>(new Date());
  const [healthEndDate, setHealthEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [seatStartDate, setSeatStartDate] = useState<Date | undefined>(new Date());
  const [seatEndDate, setSeatEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [psychoStartDate, setPsychoStartDate] = useState<Date | undefined>(new Date());
  const [psychoEndDate, setPsychoEndDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [srcStartDate, setSrcStartDate] = useState<Date | undefined>(new Date());
  const [srcEndDate, setSrcEndDate] = useState<Date | undefined>(addDays(new Date(), 365));

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setCurrentItem(null);
    setName("");
    setPhone("");
    setLicensePlate("");
    setVehicleAge(0);
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 365));
    // Reset additional fields
    setHealthStartDate(new Date());
    setHealthEndDate(addDays(new Date(), 365));
    setSeatStartDate(new Date());
    setSeatEndDate(addDays(new Date(), 365));
    setPsychoStartDate(new Date());
    setPsychoEndDate(addDays(new Date(), 365));
    setSrcStartDate(new Date());
    setSrcEndDate(addDays(new Date(), 365));
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LicenseData) => {
    setCurrentItem(item);
    setName(item.name);
    setPhone(item.phone || "");
    setLicensePlate(item.licensePlate);
    setVehicleAge(item.vehicleAge);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    
    // Set additional fields if they exist, otherwise use defaults
    setHealthStartDate(item.healthReport?.startDate || new Date());
    setHealthEndDate(item.healthReport?.endDate || addDays(new Date(), 365));
    setSeatStartDate(item.seatInsurance?.startDate || new Date());
    setSeatEndDate(item.seatInsurance?.endDate || addDays(new Date(), 365));
    setPsychoStartDate(item.psychotechnic?.startDate || new Date());
    setPsychoEndDate(item.psychotechnic?.endDate || addDays(new Date(), 365));
    setSrcStartDate(item.srcCertificate?.startDate || new Date());
    setSrcEndDate(item.srcCertificate?.endDate || addDays(new Date(), 365));
    
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!startDate || !endDate || !healthStartDate || !healthEndDate || 
        !seatStartDate || !seatEndDate || !psychoStartDate || !psychoEndDate || 
        !srcStartDate || !srcEndDate) return;
    
    const newItem: LicenseData = {
      id: currentItem?.id || crypto.randomUUID(),
      name,
      phone,
      licensePlate,
      vehicleAge,
      startDate,
      endDate,
      healthReport: {
        startDate: healthStartDate,
        endDate: healthEndDate
      },
      seatInsurance: {
        startDate: seatStartDate,
        endDate: seatEndDate
      },
      psychotechnic: {
        startDate: psychoStartDate,
        endDate: psychoEndDate
      },
      srcCertificate: {
        startDate: srcStartDate,
        endDate: srcEndDate
      }
    };
    
    onSave(newItem);
    setIsDialogOpen(false);
  };

  const getRowStatus = (endDate: Date) => {
    const today = new Date();
    const daysUntilExpiry = differenceInDays(endDate, today);
    
    if (daysUntilExpiry < 0) {
      return "danger"; // Expired
    } else if (daysUntilExpiry <= 7) {
      return "warning"; // Expiring soon
    }
    return "normal"; // Valid
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Arama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={handleAddNew}>Yeni Kayıt Ekle</Button>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Adı Soyadı</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Araç Plakası</TableHead>
              <TableHead>Araç Yaşı</TableHead>
              <TableHead>Ruhsat Tarihleri</TableHead>
              <TableHead>Sağlık Raporu</TableHead>
              <TableHead>Koltuk Sigortası</TableHead>
              <TableHead>Psikoteknik</TableHead>
              <TableHead>SRC Belgesi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const licenseStatus = getRowStatus(item.endDate);
                const healthStatus = item.healthReport ? getRowStatus(item.healthReport.endDate) : "normal";
                const seatStatus = item.seatInsurance ? getRowStatus(item.seatInsurance.endDate) : "normal";
                const psychoStatus = item.psychotechnic ? getRowStatus(item.psychotechnic.endDate) : "normal";
                const srcStatus = item.srcCertificate ? getRowStatus(item.srcCertificate.endDate) : "normal";
                
                // Get the most severe status among all documents
                const worstStatus = [licenseStatus, healthStatus, seatStatus, psychoStatus, srcStatus].includes("danger") 
                  ? "danger" 
                  : [licenseStatus, healthStatus, seatStatus, psychoStatus, srcStatus].includes("warning") 
                    ? "warning" 
                    : "normal";
                
                return (
                  <TableRow 
                    key={item.id} 
                    className={
                      worstStatus === "danger" ? "bg-danger/10" : 
                      worstStatus === "warning" ? "bg-warning/30" : ""
                    }
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.phone || "-"}</TableCell>
                    <TableCell>{item.licensePlate}</TableCell>
                    <TableCell>{item.vehicleAge}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Başlangıç:</span>
                        <span>{format(item.startDate, "dd.MM.yyyy")}</span>
                        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
                        <span className={licenseStatus === "danger" ? "text-danger" : licenseStatus === "warning" ? "text-amber-500" : ""}>
                          {format(item.endDate, "dd.MM.yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Başlangıç:</span>
                        <span>{item.healthReport ? format(item.healthReport.startDate, "dd.MM.yyyy") : "-"}</span>
                        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
                        <span className={healthStatus === "danger" ? "text-danger" : healthStatus === "warning" ? "text-amber-500" : ""}>
                          {item.healthReport ? format(item.healthReport.endDate, "dd.MM.yyyy") : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Başlangıç:</span>
                        <span>{item.seatInsurance ? format(item.seatInsurance.startDate, "dd.MM.yyyy") : "-"}</span>
                        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
                        <span className={seatStatus === "danger" ? "text-danger" : seatStatus === "warning" ? "text-amber-500" : ""}>
                          {item.seatInsurance ? format(item.seatInsurance.endDate, "dd.MM.yyyy") : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Başlangıç:</span>
                        <span>{item.psychotechnic ? format(item.psychotechnic.startDate, "dd.MM.yyyy") : "-"}</span>
                        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
                        <span className={psychoStatus === "danger" ? "text-danger" : psychoStatus === "warning" ? "text-amber-500" : ""}>
                          {item.psychotechnic ? format(item.psychotechnic.endDate, "dd.MM.yyyy") : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Başlangıç:</span>
                        <span>{item.srcCertificate ? format(item.srcCertificate.startDate, "dd.MM.yyyy") : "-"}</span>
                        <span className="text-xs text-gray-500 mt-1">Bitiş:</span>
                        <span className={srcStatus === "danger" ? "text-danger" : srcStatus === "warning" ? "text-amber-500" : ""}>
                          {item.srcCertificate ? format(item.srcCertificate.endDate, "dd.MM.yyyy") : "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {worstStatus === "danger" && (
                        <span className="flex items-center text-danger">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Süresi dolmuş
                        </span>
                      )}
                      {worstStatus === "warning" && (
                        <span className="flex items-center text-amber-500">
                          <Bell className="h-4 w-4 mr-1" />
                          Son 7 gün
                        </span>
                      )}
                      {worstStatus === "normal" && (
                        <span className="text-green-600">Geçerli</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {renderActionButtons ? (
                        renderActionButtons(item)
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                          Düzenle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Adı Soyadı
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Telefon
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xx xxx xx xx"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="licensePlate" className="text-right">
                Araç Plakası
              </label>
              <Input
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="vehicleAge" className="text-right">
                Araç Yaşı
              </label>
              <Input
                id="vehicleAge"
                type="number"
                value={vehicleAge}
                onChange={(e) => setVehicleAge(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            {/* Ruhsat tarihleri */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Ruhsat Tarihleri
              </label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="text-sm text-muted-foreground">
                    Başlangıç
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label htmlFor="endDate" className="text-sm text-muted-foreground">
                    Bitiş
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Sağlık Raporu */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Sağlık Raporu
              </label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Başlangıç
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {healthStartDate ? format(healthStartDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={healthStartDate}
                        onSelect={setHealthStartDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Bitiş
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {healthEndDate ? format(healthEndDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={healthEndDate}
                        onSelect={setHealthEndDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Koltuk Sigortası */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Koltuk Sigortası
              </label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Başlangıç
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {seatStartDate ? format(seatStartDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={seatStartDate}
                        onSelect={setSeatStartDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Bitiş
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {seatEndDate ? format(seatEndDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={seatEndDate}
                        onSelect={setSeatEndDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Psikoteknik Belgesi */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                Psikoteknik Belgesi
              </label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Başlangıç
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {psychoStartDate ? format(psychoStartDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={psychoStartDate}
                        onSelect={setPsychoStartDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Bitiş
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {psychoEndDate ? format(psychoEndDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={psychoEndDate}
                        onSelect={setPsychoEndDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* SRC Belgesi */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right font-medium">
                SRC Belgesi
              </label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Başlangıç
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {srcStartDate ? format(srcStartDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={srcStartDate}
                        onSelect={setSrcStartDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Bitiş
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {srcEndDate ? format(srcEndDate, "dd.MM.yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={srcEndDate}
                        onSelect={setSrcEndDate}
                        locale={tr}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
