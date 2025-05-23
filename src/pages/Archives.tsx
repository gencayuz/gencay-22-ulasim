
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { DocumentViewer } from "@/components/DocumentViewer";
import { UploadForm } from "@/components/archives/UploadForm";
import { DocumentList, ArchiveDocument } from "@/components/archives/DocumentList";
import { loadDocuments, saveDocument } from "@/utils/documentUtils";

const Archives = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ArchiveDocument[]>(() => loadDocuments());
  const [selectedDocument, setSelectedDocument] = useState<ArchiveDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleUploadSuccess = (document: ArchiveDocument) => {
    saveDocument(document);
    setDocuments((prevDocs) => [...prevDocs, document]);
  };
  
  const handleDocumentClick = (document: ArchiveDocument) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

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
          <UploadForm onUploadSuccess={handleUploadSuccess} />
          <DocumentList documents={documents} onDocumentClick={handleDocumentClick} />
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
