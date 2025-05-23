
import { ArchiveDocument } from "@/components/archives/DocumentList";

export const loadDocuments = (): ArchiveDocument[] => {
  // Use sessionStorage instead of localStorage for shared access
  const savedDocs = sessionStorage.getItem("archiveDocuments");
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
};

export const saveDocument = (document: ArchiveDocument): void => {
  const documents = loadDocuments();
  const updatedDocuments = [...documents, document];
  sessionStorage.setItem("archiveDocuments", JSON.stringify(updatedDocuments));
};
