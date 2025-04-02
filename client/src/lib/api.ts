import axios from "axios";
import { ApiSettings, FinancialQuestion } from "@shared/schema";

// API client for making requests to the server
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions

// Settings API
export const getApiSettings = async (userId: string): Promise<ApiSettings> => {
  const response = await apiClient.get(`/settings/${userId}`);
  return response.data;
};

export const saveApiSettings = async (settings: Omit<ApiSettings, "id">): Promise<ApiSettings> => {
  const response = await apiClient.post("/settings", settings);
  return response.data;
};

// QA History API
export const getQAHistory = async (userId: string): Promise<FinancialQuestion[]> => {
  const response = await apiClient.get(`/history/${userId}`);
  
  return response.data.map((item: any) => ({
    id: item.id.toString(),
    question: item.question,
    answer: item.answer,
    timestamp: item.createdAt
  }));
};

export const clearQAHistory = async (userId: string): Promise<void> => {
  await apiClient.delete(`/history/${userId}`);
};

// Financial Q&A API
export const askFinancialQuestion = async (
  userId: string, 
  question: string
): Promise<FinancialQuestion> => {
  const response = await apiClient.post("/ask", { userId, question });
  return response.data;
};
