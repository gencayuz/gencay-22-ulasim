
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { ArchiveDocument } from "@/components/archives/DocumentList";

interface UploadFormProps {
  onUploadSuccess: (document: ArchiveDocument) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [licensePlate, setLicensePlate] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

    onUploadSuccess(newDocument);

    // Reset form
    setLicensePlate("");
    setDocumentType("");
    setFile(null);
    
    // Notify user
    toast.success("Belge başarıyla arşivlendi");
  };

  return (
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
  );
}
