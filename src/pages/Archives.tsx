
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DocumentList } from "@/components/archives/DocumentList";
import { UploadForm } from "@/components/archives/UploadForm";
import { DocumentViewer } from "@/components/DocumentViewer";
import type { ArchiveDocument } from "@/components/archives/DocumentList";
import { documentApi } from "@/utils/apiService";
import { toast } from "sonner";

const Archives = () => {
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ArchiveDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load documents from API on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const apiDocuments = await documentApi.getDocuments();
        setDocuments(apiDocuments);
      } catch (error) {
        console.error('Failed to load documents:', error);
        toast.error('Belgeler yüklenirken hata oluştu');
        // Fallback to sessionStorage
        loadFromSessionStorage();
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const loadFromSessionStorage = () => {
    const savedDocs = sessionStorage.getItem("archiveDocuments");
    if (savedDocs) {
      try {
        const parsedDocs = JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
        setDocuments(parsedDocs);
      } catch (error) {
        console.error("Error parsing saved documents", error);
      }
    }
  };

  const handleUploadSuccess = async (document: ArchiveDocument) => {
    // Add to local state immediately for better UX
    setDocuments(prev => [document, ...prev]);
    
    // Also save to sessionStorage for backward compatibility
    const updatedDocuments = [document, ...documents];
    sessionStorage.setItem("archiveDocuments", JSON.stringify(updatedDocuments));
  };

  const handleDocumentClick = (document: ArchiveDocument) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Belgeler yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Belge Arşivi</h1>
          <p className="text-muted-foreground mt-2">
            Yüklenen belgeleri görüntüleyin ve yeni belgeler ekleyin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DocumentList 
              documents={documents} 
              onDocumentClick={handleDocumentClick}
            />
          </div>
          
          <div>
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </div>
      
      <DocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </Layout>
  );
};

export default Archives;
