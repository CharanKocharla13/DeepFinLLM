import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ApiSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const useApiSettings = () => {
  const { toast } = useToast();
  const userId = localStorage.getItem("userId");
  
  // Fetch API settings
  const { data: apiSettings, isLoading } = useQuery<ApiSettings>({
    queryKey: [`/api/settings/${userId}`],
    enabled: !!userId,
    // If we get a 404, it means the user hasn't set up API keys yet
    gcTime: 0,
    retry: false,
  });
  
  // Save API settings
  const saveSettings = useMutation({
    mutationFn: async (settings: Omit<ApiSettings, "id">) => {
      const response = await apiRequest("POST", "/api/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "API settings saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${userId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save API settings",
        variant: "destructive",
      });
    },
  });
  
  // Check if API keys are configured
  const settings = apiSettings as ApiSettings | undefined;
  const hasApiKeys = !!(settings?.deepseekKey && settings?.fmpKey);
  
  return {
    apiSettings,
    isLoading,
    saveSettings,
    hasApiKeys,
  };
};

export default useApiSettings;
