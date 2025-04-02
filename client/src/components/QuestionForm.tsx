import { FC, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import useApiSettings from "@/hooks/useApiSettings";
import { FinancialQuestion } from "@shared/schema";

interface QuestionFormProps {
  onQuestionSubmit: (response: FinancialQuestion) => void;
}

const QuestionForm: FC<QuestionFormProps> = ({ onQuestionSubmit }) => {
  const [question, setQuestion] = useState("");
  const { toast } = useToast();
  const { hasApiKeys } = useApiSettings();
  
  const askQuestion = useMutation({
    mutationFn: async (questionText: string) => {
      const userId = localStorage.getItem("userId") as string;
      const response = await apiRequest("POST", "/api/ask", { userId, question: questionText });
      return response.json();
    },
    onSuccess: (data: FinancialQuestion) => {
      onQuestionSubmit(data);
      setQuestion("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasApiKeys) {
      toast({
        title: "API Keys Required",
        description: "Please configure your API keys in the Settings tab before asking questions.",
        variant: "destructive",
      });
      return;
    }
    
    askQuestion.mutate(question);
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
      <h2 className="text-lg font-medium text-card-foreground mb-4">Ask a Financial Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question-input" className="sr-only">Your question</label>
          <textarea 
            id="question-input" 
            className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
            rows={3} 
            placeholder="E.g., What are the best dividend stocks to invest in right now?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg flex items-center transition-colors duration-200"
            disabled={askQuestion.isPending}
          >
            <span className="material-icons mr-1">send</span>
            {askQuestion.isPending ? "Processing..." : "Ask Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
