import { FC } from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-2xl">trending_up</span>
          <h1 className="text-xl font-semibold">DeepFinLLM</h1>
        </div>
        <nav>
          <ul className="flex space-x-1 md:space-x-4">
            <li>
              <button 
                onClick={() => onTabChange("qa")} 
                className={`py-2 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base flex items-center transition-colors duration-200 ${
                  activeTab === "qa" ? "bg-primary-700/70" : "hover:bg-primary-700/50"
                }`}
              >
                <span className="material-icons mr-1 text-sm md:text-base">question_answer</span>
                Q&A
              </button>
            </li>
          
            <li>
              <button 
                onClick={() => onTabChange("settings")} 
                className={`py-2 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base flex items-center transition-colors duration-200 ${
                  activeTab === "settings" ? "bg-primary-700/70" : "hover:bg-primary-700/50"
                }`}
              >
                <span className="material-icons mr-1 text-sm md:text-base">settings</span>
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
