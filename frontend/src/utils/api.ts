import axios from 'axios';

export interface AnalysisResponse {
  document_type: string;
  language: string;
  price: number;
  time: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// Upload the user document to FastAPI for OCR + language analysis.
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axios.post<AnalysisResponse>(`${API_BASE_URL}/api/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data;
};
