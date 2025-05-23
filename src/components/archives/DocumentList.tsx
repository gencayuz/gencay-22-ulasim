
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText } from "lucide-react";

interface DocumentListProps {
  documents: ArchiveDocument[];
  onDocumentClick: (document: ArchiveDocument) => void;
}

export interface ArchiveDocument {
  id: string;
  licensePlate: string;
  documentType: string;
  fileName: string;
  uploadDate: Date;
}

export function DocumentList({ documents, onDocumentClick }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDocuments = documents.filter(doc => 
    doc.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Yüklenen Belgeler</h3>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Belge ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plaka</TableHead>
                <TableHead>Belge Türü</TableHead>
                <TableHead>Dosya Adı</TableHead>
                <TableHead>Yükleme Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <TableRow 
                    key={doc.id} 
                    className="cursor-pointer hover:bg-muted/70"
                    onClick={() => onDocumentClick(doc)}
                  >
                    <TableCell>{doc.licensePlate}</TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                      {doc.fileName}
                    </TableCell>
                    <TableCell>{doc.uploadDate.toLocaleDateString("tr-TR")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Belge bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
