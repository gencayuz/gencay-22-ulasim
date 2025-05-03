
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
}

export function DataTable({ data, plateType, onSave, renderActionButtons }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state for adding/editing entries
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<LicenseData | null>(null);
  
  const filteredData = filterLicenseData(data, searchTerm);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LicenseData) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
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
              <TableHead>Oda Kaydı</TableHead>
              <TableHead>Ruhsat Tarihleri</TableHead>
              <TableHead>Sağlık Raporu</TableHead>
              <TableHead>Koltuk Sigortası</TableHead>
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
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="h-24 text-center">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LicenseFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentItem={currentItem}
        onSave={onSave}
      />
    </div>
  );
}
