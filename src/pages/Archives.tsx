
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Upload, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentViewer } from "@/components/DocumentViewer";

interface ArchiveDocument {
  id: string;
  licensePlate: string;
  documentType: string;
  fileName: string;
  uploadDate: Date;
}

const Archives = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ArchiveDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  const [documents, setDocuments] = useState<ArchiveDocument[]>(() => {
    const savedDocs = localStorage.getItem("archiveDocuments");
    if (savedDocs) {
      try {
        const parsedDocs = JSON.parse(savedDocs);
        return parsedDocs.map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
      } catch (error) {
        console.error("Error parsing saved documents", error);
        return [];
      }
    }
    return [];
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!licensePlate.trim()) {
      toast.error("Araç plakası girmelisiniz.");
      return;
    }

    if (!documentType.trim()) {
      toast.error("Belge türü girmelisiniz.");
      return;
    }

    if (!file) {
      toast.error("Bir dosya seçmelisiniz.");
      return;
    }

    // Create new document entry
    const newDocument: ArchiveDocument = {
      id: Date.now().toString(),
      licensePlate,
      documentType,
      fileName: file.name,
      uploadDate: new Date()
    };

    // Add to state and save to localStorage
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    localStorage.setItem("archiveDocuments", JSON.stringify(updatedDocuments));

    // Reset form
    setLicensePlate("");
    setDocumentType("");
    setFile(null);
    
    // Notify user
    toast.success("Belge başarıyla arşivlendi");
  };
  
  const handleDocumentClick = (document: ArchiveDocument) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const filteredDocuments = documents.filter(doc => 
    doc.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Tabs defaultValue="archives" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="home" onClick={() => navigate("/")}>Ana Sayfa</TabsTrigger>
          <TabsTrigger value="archives">Arşiv</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4">Belge Arşivi</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Yeni Belge Yükle</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="licensePlate">Araç Plakası</Label>
                  <Input 
                    id="licensePlate" 
                    value={licensePlate} 
                    onChange={(e) => setLicensePlate(e.target.value)} 
                    placeholder="34 T 1234"
                  />
                </div>
                
                <div>
                  <Label htmlFor="documentType">Belge Türü</Label>
                  <Input 
                    id="documentType" 
                    value={documentType} 
                    onChange={(e) => setDocumentType(e.target.value)} 
                    placeholder="Araç Ruhsatı, Sabıka Kaydı, Oda Kaydı, vb."
                  />
                </div>
                
                <div>
                  <Label htmlFor="file">Dosya Seç</Label>
                  <div className="mt-1">
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleUpload}
                  disabled={!licensePlate || !documentType || !file}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Belgeyi Yükle
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Documents List */}
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
                          onClick={() => handleDocumentClick(doc)}
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
        </div>
      </div>
      
      <DocumentViewer
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        document={selectedDocument}
      />
    </Layout>
  );
};

export default Archives;
