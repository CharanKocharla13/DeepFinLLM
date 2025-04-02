import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FinancialQuestion } from "@shared/schema";

const useFinancialData = () => {
  const userId = localStorage.getItem("userId");
  
  // Fetch QA history
  const { 
    data: historyData, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: [`/api/history/${userId}`],
    enabled: !!userId,
    onError: () => {} // Silently handle errors - we'll show an empty state
  });
  
  // Manage responses locally as well (for newly added questions before refetch)
  const [responses, setResponses] = useState<FinancialQuestion[]>([]);
  
  // Update local responses when history data changes
  useEffect(() => {
    if (historyData) {
      const formattedHistory: FinancialQuestion[] = historyData.map((item: any) => ({
        id: item.id.toString(),
        question: item.question,
        answer: item.answer,
        timestamp: item.createdAt
      }));
      setResponses(formattedHistory);
    }
  }, [historyData]);
  
  // Add a new response to the local state
  const addResponse = (response: FinancialQuestion) => {
    setResponses((prev) => [response, ...prev]);
  };
  
  return {
    responses,
    isLoading,
    refetchHistory: refetch,
    addResponse,
    hasResponses: responses.length > 0
  };
};

export default useFinancialData;
