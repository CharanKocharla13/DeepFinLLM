import { useState, useEffect } from "react";
import ApiKeyField from "@/components/ApiKeyField";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useApiSettings from "@/hooks/useApiSettings";
import LoadingOverlay from "@/components/LoadingOverlay";
import { ApiSettings } from "@shared/schema";

const SettingsPage = () => {
  const { apiSettings, isLoading, saveSettings } = useApiSettings();
  const userId = localStorage.getItem("userId") as string;
  
  // Local form state
  const [deepseekKey, setDeepseekKey] = useState("");
  const [fmpKey, setFmpKey] = useState("");
  const [deepseekModel, setDeepseekModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [dataRefreshRate, setDataRefreshRate] = useState("realtime");
  const [saveHistory, setSaveHistory] = useState(true);
  const [includeMarketData, setIncludeMarketData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form from API settings
  useEffect(() => {
    if (apiSettings) {
      const settings = apiSettings as ApiSettings;
      setDeepseekKey(settings.deepseekKey || "");
      setFmpKey(settings.fmpKey || "");
      setDeepseekModel(settings.deepseekModel || "deepseek/deepseek-chat-v3-0324:free");
      setDataRefreshRate(settings.dataRefreshRate || "realtime");
      setSaveHistory(settings.saveHistory !== undefined ? settings.saveHistory : true);
      setIncludeMarketData(settings.includeMarketData !== undefined ? settings.includeMarketData : true);
    }
  }, [apiSettings]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    saveSettings.mutate({
      userId,
      deepseekKey,
      fmpKey,
      deepseekModel,
      dataRefreshRate,
      saveHistory,
      includeMarketData
    }, {
      onSettled: () => {
        setIsSaving(false);
      }
    });
  };
  
  return (
    <section className="fade-in">
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-6">API Settings</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DeepSeek API Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <span className="material-icons text-primary">smart_toy</span>
                OpenRouter API
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Connect to OpenRouter's AI models for intelligent financial analysis.</p>
              
              <ApiKeyField
                id="deepseek-api-key"
                label="API Key"
                value={deepseekKey}
                onChange={setDeepseekKey}
                placeholder="Enter your OpenRouter API key"
              />
              
              <div>
                <Label htmlFor="deepseek-model" className="text-sm font-medium text-foreground mb-1">Model</Label>
                <Select value={deepseekModel} onValueChange={setDeepseekModel} disabled>
                  <SelectTrigger id="deepseek-model" className="w-full">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek/deepseek-chat-v3-0324:free">DeepSeek Chat v3</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Using DeepSeek Chat v3 via OpenRouter</p>
              </div>
            </div>
            
            <hr className="border-border" />
            
            {/* FMP API Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <span className="material-icons text-primary">analytics</span>
                Financial Modeling Prep (FMP) API
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Access real-time financial data, stock quotes, and market analysis.</p>
              
              <ApiKeyField
                id="fmp-api-key"
                label="API Key"
                value={fmpKey}
                onChange={setFmpKey}
                placeholder="Enter your FMP API key"
              />
              
              <div>
                <Label htmlFor="data-refresh-rate" className="text-sm font-medium text-foreground mb-1">Data Refresh Rate</Label>
                <Select value={dataRefreshRate} onValueChange={setDataRefreshRate}>
                  <SelectTrigger id="data-refresh-rate" className="w-full">
                    <SelectValue placeholder="Select refresh rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time (when available)</SelectItem>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="30min">Every 30 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <hr className="border-border" />
            
            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <span className="material-icons text-primary">settings</span>
                General Settings
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Save Question History</h4>
                  <p className="text-xs text-muted-foreground">Store your previous questions and answers</p>
                </div>
                <Switch 
                  checked={saveHistory} 
                  onCheckedChange={setSaveHistory} 
                  id="save-history"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Include Market Data</h4>
                  <p className="text-xs text-muted-foreground">Enhance AI responses with real-time market data when relevant</p>
                </div>
                <Switch 
                  checked={includeMarketData}
                  onCheckedChange={setIncludeMarketData}
                  id="include-market-data"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-200"
                disabled={saveSettings.isPending}
              >
                <span className="material-icons mr-1">save</span>
                {saveSettings.isPending ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Loading Overlay for saving */}
      <LoadingOverlay 
        isVisible={isSaving} 
        message="Saving your settings..."
        subMessage="Please wait while we update your configuration"
      />
    </section>
  );
};

export default SettingsPage;
