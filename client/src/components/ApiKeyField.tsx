import { FC, useState } from "react";

interface ApiKeyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ApiKeyField: FC<ApiKeyFieldProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "Enter your API key" 
}) => {
  const [showKey, setShowKey] = useState(false);
  
  const toggleVisibility = () => {
    setShowKey(!showKey);
  };
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input 
          type={showKey ? "text" : "password"} 
          id={id} 
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button 
          type="button" 
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
          onClick={toggleVisibility}
        >
          <span className="material-icons text-gray-400">
            {showKey ? "visibility" : "visibility_off"}
          </span>
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">Your API key is stored securely in the server.</p>
    </div>
  );
};

export default ApiKeyField;
