import React, { useState } from 'react';
import { Trophy, Calendar, Users, MapPin, Plus, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import SeasonSelector from './components/SeasonSelector';
import DriverStandings from './components/DriverStandings';
import ConstructorStandings from './components/ConstructorStandings';
import RaceResults from './components/RaceResults';
import HallOfFame from './components/HallOfFame';

export type View = 'drivers' | 'constructors' | 'races' | 'hall-of-fame';

function App() {
  const [currentSeason, setCurrentSeason] = useState<number>(2027);
  const [currentView, setCurrentView] = useState<View>('drivers');

  const navigationItems = [
    { id: 'drivers' as View, label: 'Driver Standings', icon: Users },
    { id: 'constructors' as View, label: 'Constructor Standings', icon: Trophy },
    { id: 'races' as View, label: 'Race Results', icon: Calendar },
    { id: 'hall-of-fame' as View, label: 'Hall of Fame', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'drivers':
        return <DriverStandings season={currentSeason} />;
      case 'constructors':
        return <ConstructorStandings season={currentSeason} />;
      case 'races':
        return <RaceResults season={currentSeason} />;
      case 'hall-of-fame':
        return <HallOfFame />;
      default:
        return <DriverStandings season={currentSeason} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <SeasonSelector 
                currentSeason={currentSeason}
                onSeasonChange={setCurrentSeason}
                disabled={currentView === 'hall-of-fame'}
              />
              
              <nav className="mt-8 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;