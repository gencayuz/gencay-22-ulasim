
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, File } from "lucide-react";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    licensePlate: string;
    documentType: string;
    fileName: string;
    uploadDate: Date;
  } | null;
}

export function DocumentViewer({ open, onOpenChange, document }: DocumentViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!document) return null;
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate a download
    setTimeout(() => {
      setIsDownloading(false);
      
      // Create a dummy download (in a real app, this would be a real file download)
      const link = document.createElement("a");
      link.download = document.fileName;
      link.href = `data:application/octet-stream;base64,${btoa("This is a placeholder file content")}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Belge Görüntüleyici</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border rounded-md p-6 bg-muted/30 flex flex-col items-center justify-center space-y-4">
            <File className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-medium">{document.fileName}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {document.licensePlate} - {document.documentType}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              className="w-full max-w-xs"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "İndiriliyor..." : "Belgeyi İndir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
