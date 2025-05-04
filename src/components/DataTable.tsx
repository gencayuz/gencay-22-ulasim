
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { LicenseData } from "@/types/license";
import { LicenseFormDialog } from "./LicenseFormDialog";
import { LicenseTableRow } from "./LicenseTableRow";
import { filterLicenseData } from "@/utils/tableUtils";

export interface DataTableProps {
  data: LicenseData[];
  plateType: string;
  onSave: (data: LicenseData) => void;
  renderActionButtons?: (record: LicenseData) => React.ReactNode;
  isDialogOpen?: boolean;
  setIsDialogOpen?: (open: boolean) => void;
  editRecord?: LicenseData | null;
}

export function DataTable({ 
  data, 
  plateType, 
  onSave, 
  renderActionButtons,
  isDialogOpen,
  setIsDialogOpen,
  editRecord
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state for adding/editing entries
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<LicenseData | null>(null);
  
  // Use external dialog state if provided, otherwise use local state
  const dialogOpen = isDialogOpen !== undefined ? isDialogOpen : localDialogOpen;
  const setDialogOpen = setIsDialogOpen || setLocalDialogOpen;
  const currentRecord = editRecord || currentItem;
  
  const filteredData = filterLicenseData(data, searchTerm);

  const handleAddNew = () => {
    setCurrentItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: LicenseData) => {
    setCurrentItem(item);
    setDialogOpen(true);
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
              <TableHead>Araç Sahibi / Şoför</TableHead>
              <TableHead>Araç Plakası</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Araç Yaşı</TableHead>
              <TableHead>Sabıka Kaydı</TableHead>
              <TableHead>Vergi Levhası</TableHead>
              <TableHead>Ceza Puan Durumu</TableHead>
              <TableHead>Oda Kaydı</TableHead>
              <TableHead>SGK Hizmet Listesi</TableHead>
              <TableHead>Ruhsat Tarihleri</TableHead>
              <TableHead>Sağlık Raporu</TableHead>
              {plateType !== "J" && <TableHead>Koltuk Sigortası</TableHead>}
              <TableHead>Psikoteknik</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <LicenseTableRow 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEdit} 
                  renderActionButtons={renderActionButtons} 
                  plateType={plateType}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={plateType === "J" ? 14 : 15} className="h-24 text-center">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LicenseFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentItem={currentRecord}
        onSave={onSave}
        plateType={plateType}
      />
    </div>
  );
}
