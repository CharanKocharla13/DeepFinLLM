import {
  apiKeys,
  type ApiKeys,
  type InsertApiKeys,
  qaHistory,
  type QAHistory,
  type InsertQAHistory
} from "@shared/schema";

export interface IStorage {
  // API Key methods
  getApiKeys(userId: string): Promise<ApiKeys | undefined>;
  saveApiKeys(keys: InsertApiKeys): Promise<ApiKeys>;
  
  // QA History methods
  getQAHistory(userId: string): Promise<QAHistory[]>;
  saveQAHistory(qa: InsertQAHistory): Promise<QAHistory>;
  clearQAHistory(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private apiKeysMap: Map<string, ApiKeys>;
  private qaHistoryMap: Map<string, QAHistory[]>;
  private currentApiKeyId: number;
  private currentQAHistoryId: number;

  constructor() {
    this.apiKeysMap = new Map();
    this.qaHistoryMap = new Map();
    this.currentApiKeyId = 1;
    this.currentQAHistoryId = 1;
  }

  async getApiKeys(userId: string): Promise<ApiKeys | undefined> {
    return this.apiKeysMap.get(userId);
  }

  async saveApiKeys(keys: InsertApiKeys): Promise<ApiKeys> {
    const existingKeys = await this.getApiKeys(keys.userId);
    
    // Create or update API keys
    const id = existingKeys ? existingKeys.id : this.currentApiKeyId++;
    const apiKeysData: ApiKeys = { 
      ...keys, 
      id,
      deepseekModel: keys.deepseekModel || "deepseek/deepseek-chat-v3-0324:free",
      dataRefreshRate: keys.dataRefreshRate || "15min",
      saveHistory: keys.saveHistory !== undefined ? keys.saveHistory : true,
      includeMarketData: keys.includeMarketData !== undefined ? keys.includeMarketData : true
    };
    
    this.apiKeysMap.set(keys.userId, apiKeysData);
    return apiKeysData;
  }

  async getQAHistory(userId: string): Promise<QAHistory[]> {
    return this.qaHistoryMap.get(userId) || [];
  }

  async saveQAHistory(qa: InsertQAHistory): Promise<QAHistory> {
    const id = this.currentQAHistoryId++;
    const now = new Date();
    
    const qaData: QAHistory = {
      ...qa,
      id,
      createdAt: now
    };
    
    const userHistory = this.qaHistoryMap.get(qa.userId) || [];
    userHistory.unshift(qaData); // Add new question to the beginning
    this.qaHistoryMap.set(qa.userId, userHistory);
    
    return qaData;
  }

  async clearQAHistory(userId: string): Promise<void> {
    this.qaHistoryMap.delete(userId);
  }
}

export const storage = new MemStorage();
