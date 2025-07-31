import React from 'react';
import { Flag, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-red-600/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Flag className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BoxBoxMedia</h1>
                <p className="text-gray-400 text-sm">Formula 1 Championship Tracker</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-red-400">
            <Zap size={20} />
            <span className="font-medium">Live Season 2027</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;