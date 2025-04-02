import { FC } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ 
  isVisible,
  message = "Analyzing financial data...",
  subMessage = "This may take a moment as we process your request"
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        <p className="text-center text-gray-700 font-medium">{message}</p>
        <p className="text-center text-gray-500 text-sm mt-2">{subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
