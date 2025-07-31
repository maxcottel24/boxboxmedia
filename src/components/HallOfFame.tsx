import React, { useState } from 'react';
import { Crown, Trophy, TrendingUp, Award } from 'lucide-react';
import raceResultsData from '../data/raceResults.json';
import { calculateDriverStandings, calculateConstructorStandings } from '../utils/pointsCalculator';

type HallOfFameView = 'champions' | 'wins' | 'points' | 'teams';

const HallOfFame: React.FC = () => {
  const [currentView, setCurrentView] = useState<HallOfFameView>('champions');

  // Calculate champions for each season
  const champions = Object.entries(raceResultsData).map(([year, seasonData]) => {
    const standings = calculateDriverStandings(seasonData);
    const champion = standings[0];
    return {
      year,
      driver: champion?.driver || 'TBD',
      team: champion?.team || 'TBD',
      points: champion?.points || 0,
      inProgress: year === '2027'
    };
  });

  // Calculate all-time wins
  const allTimeWins: { [driver: string]: { wins: number; seasons: string[] } } = {};
  Object.entries(raceResultsData).forEach(([year, seasonData]) => {
    const standings = calculateDriverStandings(seasonData);
    standings.forEach(driver => {
      if (!allTimeWins[driver.driver]) {
        allTimeWins[driver.driver] = { wins: 0, seasons: [] };
      }
      allTimeWins[driver.driver].wins += driver.wins;
      if (driver.wins > 0) {
        allTimeWins[driver.driver].seasons.push(year);
      }
    });
  });

  const mostWins = Object.entries(allTimeWins)
    .map(([driver, data]) => ({
      driver,
      wins: data.wins,
      seasons: data.seasons.join(', ')
    }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);

  // Calculate all-time points
  const allTimePoints: { [driver: string]: { points: number; seasons: number } } = {};
  Object.entries(raceResultsData).forEach(([year, seasonData]) => {
    const standings = calculateDriverStandings(seasonData);
    standings.forEach(driver => {
      if (!allTimePoints[driver.driver]) {
        allTimePoints[driver.driver] = { points: 0, seasons: 0 };
      }
      allTimePoints[driver.driver].points += driver.points;
      allTimePoints[driver.driver].seasons += 1;
    });
  });

  const mostPoints = Object.entries(allTimePoints)
    .map(([driver, data]) => ({
      driver,
      points: data.points,
      avgPerSeason: Math.round((data.points / data.seasons) * 10) / 10
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  // Calculate constructor champions
  const constructorChampions = Object.entries(raceResultsData).map(([year, seasonData]) => {
    const standings = calculateConstructorStandings(seasonData);
    const champion = standings[0];
    return {
      year,
      team: champion?.team || 'TBD',
      points: champion?.points || 0,
      inProgress: year === '2027'
    };
  });

  const tabItems = [
    { id: 'champions' as HallOfFameView, label: 'Champions', icon: Crown },
    { id: 'wins' as HallOfFameView, label: 'Most Wins', icon: Trophy },
    { id: 'points' as HallOfFameView, label: 'Most Points', icon: TrendingUp },
    { id: 'teams' as HallOfFameView, label: 'Constructor Champions', icon: Award },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'champions':
        return (
          <div className="space-y-4">
            {champions.map((champion) => (
              <div 
                key={champion.year}
                className={`p-6 rounded-lg border ${
                  champion.inProgress 
                    ? 'bg-yellow-900/20 border-yellow-600/50' 
                    : 'bg-gray-700/30 border-gray-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Crown className="text-yellow-400" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-white">{champion.year} Champion</h3>
                      <p className="text-gray-300">{champion.driver} • {champion.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{champion.points}</div>
                    <div className="text-sm text-gray-400">points</div>
                    {champion.inProgress && (
                      <div className="text-xs text-yellow-400 mt-1">Current Leader</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'wins':
        return (
          <div className="space-y-3">
            {mostWins.map((driver, index) => (
              <div key={driver.driver} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-300 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{driver.driver}</div>
                    <div className="text-sm text-gray-400">Active in: {driver.seasons}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{driver.wins}</div>
                  <div className="text-sm text-gray-400">wins</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'points':
        return (
          <div className="space-y-3">
            {mostPoints.map((driver, index) => (
              <div key={driver.driver} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-300 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{driver.driver}</div>
                    <div className="text-sm text-gray-400">Avg: {driver.avgPerSeason} per season</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{driver.points}</div>
                  <div className="text-sm text-gray-400">total points</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'teams':
        return (
          <div className="space-y-4">
            {constructorChampions.map((champion) => (
              <div 
                key={champion.year}
                className={`p-6 rounded-lg border ${
                  champion.inProgress 
                    ? 'bg-blue-900/20 border-blue-600/50' 
                    : 'bg-gray-700/30 border-gray-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Award className="text-blue-400" size={24} />
                    <div>
                      <h3 className="text-xl font-bold text-white">{champion.year} Constructor Champion</h3>
                      <p className="text-gray-300">{champion.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{champion.points}</div>
                    <div className="text-sm text-gray-400">points</div>
                    {champion.inProgress && (
                      <div className="text-xs text-blue-400 mt-1">Current Leader</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-4">Hall of Fame</h2>
        <div className="flex flex-wrap gap-2">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default HallOfFame;