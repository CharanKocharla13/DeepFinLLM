import { FC } from "react";
import { FinancialQuestion } from "@shared/schema";
import { format } from "date-fns";

interface ResponseItemProps {
  response: FinancialQuestion;
}

const ResponseItem: FC<ResponseItemProps> = ({ response }) => {
  const { question, answer, timestamp } = response;
  
  // Format timestamp to human-readable date
  const formattedDate = format(new Date(timestamp), "MMMM d, yyyy 'at' h:mm a");
  
  // Convert markdown tables in the answer to HTML
  const processAnswer = (answerText: string) => {
    // Simple markdown table detection and HTML conversion
    // This is a basic implementation - a more robust solution would use a markdown parser
    let processedAnswer = answerText;
    
    // Replace markdown tables with HTML tables
    const tableRegex = /\|(.+)\|\n\|[-|]+\|([\s\S]*?)(?=\n\n|\n#|\n\*\*|$)/g;
    processedAnswer = processedAnswer.replace(tableRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean);
      const rows = bodyRows.split('\n').filter(Boolean);
      
      let tableHtml = '<div class="overflow-x-auto mb-4"><table class="min-w-full text-sm"><thead class="bg-gray-50"><tr>';
      
      // Add headers
      headers.forEach((header: string) => {
        tableHtml += `<th class="px-4 py-2 text-left font-medium text-gray-500">${header}</th>`;
      });
      
      tableHtml += '</tr></thead><tbody class="divide-y divide-gray-200">';
      
      // Add rows
      rows.forEach((row: string) => {
        const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
        tableHtml += '<tr>';
        
        cells.forEach((cell: string) => {
          // Add special styling for financial numbers
          let cellClass = "px-4 py-2";
          if (/^\+\d/.test(cell)) {
            cellClass += " font-mono finance-positive";
          } else if (/^-\d/.test(cell)) {
            cellClass += " font-mono finance-negative";
          } else if (/\$\d/.test(cell)) {
            cellClass += " font-mono";
          }
          
          tableHtml += `<td class="${cellClass}">${cell}</td>`;
        });
        
        tableHtml += '</tr>';
      });
      
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });
    
    // Replace line breaks with <br> and parse bullet points
    processedAnswer = processedAnswer
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)(?=\n\*|\n\n|$)/g, '<li>$1</li>')
      .replace(/<li>(.*?)<\/li>(?:\n)?(?:<li>|$)/g, '<ul class="list-disc pl-5 mb-3 space-y-1">$&</ul>');
    
    return `<p class="mb-3">${processedAnswer}</p>`;
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-6">
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-start gap-3">
          <span className="material-icons text-primary mt-0.5">question_mark</span>
          <div>
            <h3 className="font-medium text-card-foreground">{question}</h3>
            <p className="text-xs text-muted-foreground mt-1">Asked on {formattedDate}</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="material-icons text-primary mt-0.5">smart_toy</span>
          <div 
            className="text-card-foreground"
            dangerouslySetInnerHTML={{ __html: processAnswer(answer) }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponseItem;
