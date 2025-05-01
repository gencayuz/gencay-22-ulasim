
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isAfter, isBefore, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, AlertCircle, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { tr } from "date-fns/locale";

export interface LicenseData {
  id: string;
  name: string;
  licensePlate: string;
  vehicleAge: number;
  startDate: Date;
  endDate: Date;
}

interface DataTableProps {
  data: LicenseData[];
  plateType: string;
  onSave: (data: LicenseData) => void;
}

export function DataTable({ data, plateType, onSave }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state for adding/editing entries
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<LicenseData | null>(null);
  const [name, setName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleAge, setVehicleAge] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 365));

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setCurrentItem(null);
    setName("");
    setLicensePlate("");
    setVehicleAge(0);
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 365));
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LicenseData) => {
    setCurrentItem(item);
    setName(item.name);
    setLicensePlate(item.licensePlate);
    setVehicleAge(item.vehicleAge);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!startDate || !endDate) return;
    
    const newItem: LicenseData = {
      id: currentItem?.id || crypto.randomUUID(),
      name,
      licensePlate,
      vehicleAge,
      startDate,
      endDate,
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
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Adı Soyadı</TableHead>
              <TableHead>Araç Plakası</TableHead>
              <TableHead>Araç Yaşı</TableHead>
              <TableHead>Başlangıç Tarihi</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const status = getRowStatus(item.endDate);
                return (
                  <TableRow 
                    key={item.id} 
                    className={
                      status === "danger" ? "bg-danger/10" : 
                      status === "warning" ? "bg-warning/30" : ""
                    }
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.licensePlate}</TableCell>
                    <TableCell>{item.vehicleAge}</TableCell>
                    <TableCell>{format(item.startDate, "dd.MM.yyyy")}</TableCell>
                    <TableCell>{format(item.endDate, "dd.MM.yyyy")}</TableCell>
                    <TableCell>
                      {status === "danger" && (
                        <span className="flex items-center text-danger">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Süresi dolmuş
                        </span>
                      )}
                      {status === "warning" && (
                        <span className="flex items-center text-amber-500">
                          <Bell className="h-4 w-4 mr-1" />
                          Son {differenceInDays(item.endDate, new Date())} gün
                        </span>
                      )}
                      {status === "normal" && (
                        <span className="text-green-600">Geçerli</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        Düzenle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right">
                Başlangıç
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right">
                Bitiş
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
