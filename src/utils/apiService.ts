
const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiLicenseData {
  id: string;
  name: string;
  sicilNo?: string;
  phone: string;
  licensePlate: string;
  vehicleAge: number;
  startDate: string;
  endDate: string;
  healthReport: {
    startDate: string;
    endDate: string;
  };
  seatInsurance?: {
    startDate: string;
    endDate: string;
  };
  psychotechnic: {
    startDate: string;
    endDate: string;
  };
  ownerType?: "owner" | "driver";
  criminalRecord?: "yes" | "no";
  taxCertificate?: "yes" | "no";
  chamberRegistration?: "yes" | "no";
  sgkServiceList?: "yes" | "no";
  penaltyPoints?: "yes" | "no";
  active: boolean;
}

export interface ApiDocument {
  id: string;
  licensePlate: string;
  documentType: string;
  fileName: string;
  uploadDate: Date;
}

// License API functions
export const licenseApi = {
  async getLicenses(plateType: string): Promise<ApiLicenseData[]> {
    const response = await fetch(`${API_BASE_URL}/licenses/${plateType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch licenses');
    }
    return response.json();
  },

  async saveLicense(plateType: string, licenseData: ApiLicenseData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/licenses/${plateType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(licenseData),
    });
    if (!response.ok) {
      throw new Error('Failed to save license');
    }
  }
};

// Document API functions
export const documentApi = {
  async uploadDocument(file: File, licensePlate: string, documentType: string): Promise<ApiDocument> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('licensePlate', licensePlate);
    formData.append('documentType', documentType);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const result = await response.json();
    return result.document;
  },

  async getDocuments(): Promise<ApiDocument[]> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    const documents = await response.json();
    return documents.map((doc: any) => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate)
    }));
  },

  async downloadDocument(documentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`);
    if (!response.ok) {
      throw new Error('Failed to download document');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
