import { useState, useEffect } from "react";
import QuestionForm from "@/components/QuestionForm";
import ResponseItem from "@/components/ResponseItem";
import LoadingOverlay from "@/components/LoadingOverlay";
import useFinancialData from "@/hooks/useFinancialData";
import { FinancialQuestion } from "@shared/schema";

const QAPage = () => {
  const { responses, isLoading, addResponse, hasResponses } = useFinancialData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleQuestionSubmit = (response: FinancialQuestion) => {
    setIsSubmitting(false);
    addResponse(response);
  };
  
  return (
    <section className="fade-in">
      {/* Welcome Card */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-3">Financial Insights Powered by AI</h2>
        <p className="text-muted-foreground mb-4">Ask any financial question to get data-driven answers focused on profitable decision making.</p>
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-start">
            <span className="material-icons text-primary mr-2">attach_money</span>
            <span>Investment strategies</span>
          </div>
          <div className="flex items-start">
            <span className="material-icons text-primary mr-2">analytics</span>
            <span>Market analysis</span>
          </div>
          <div className="flex items-start">
            <span className="material-icons text-primary mr-2">account_balance</span>
            <span>Risk assessment</span>
          </div>
        </div>
      </div>

      {/* Question Form */}
      <QuestionForm 
        onQuestionSubmit={(response) => {
          setIsSubmitting(true);
          handleQuestionSubmit(response);
        }} 
      />

      {/* Responses Section */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">Previous Questions & Answers</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your question history...</p>
          </div>
        ) : hasResponses ? (
          <div className="space-y-6">
            {responses.map((response) => (
              <ResponseItem key={response.id} response={response} />
            ))}
          </div>
        ) : (
          <div id="empty-state" className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <span className="material-icons text-muted-foreground text-2xl">search</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No questions yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Ask your first financial question to get data-driven insights for better decision making.</p>
          </div>
        )}
      </div>
      
      {/* Loading Overlay for submissions */}
      <LoadingOverlay isVisible={isSubmitting} />
    </section>
  );
};

export default QAPage;
