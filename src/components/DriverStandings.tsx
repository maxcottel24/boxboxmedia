import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Season } from '../App';
import raceResultsData from '../data/raceResults.json';
import { calculateDriverStandings } from '../utils/pointsCalculator';
import { getTeamLogo } from '../utils/teamLogos';

interface DriverStandingsProps {
  season: Season;
}

const DriverStandings: React.FC<DriverStandingsProps> = ({ season }) => {
  const seasonData = raceResultsData[season as keyof typeof raceResultsData] || {};
  const standings = calculateDriverStandings(seasonData);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="text-green-400" size={16} />;
    if (change < 0) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

  const getTeamColor = (team: string) => {
    const colors: { [key: string]: string } = {
      'Red Bull Racing': 'bg-blue-600',
      'McLaren': 'bg-orange-500',
      'Ferrari': 'bg-red-600',
      'Mercedes': 'bg-gray-400',
      'Alpine': 'bg-pink-500',
      'Aston Martin': 'bg-green-600',
    };
    return colors[team] || 'bg-gray-500';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Driver Championship - {season}</h2>
        </div>
        <p className="text-gray-400 mt-2">Current standings and points</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Position</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Driver</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Team</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Points</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Wins</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Change</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((driver, index) => (
              <tr 
                key={driver.driver}
                className="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      driver.position === 1 ? 'bg-yellow-500 text-black' :
                      driver.position === 2 ? 'bg-gray-300 text-black' :
                      driver.position === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {driver.position}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white font-semibold">{driver.driver}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <img 
                      src={getTeamLogo(driver.team)} 
                      alt={driver.team}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-gray-300">{driver.team}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white font-semibold text-lg">{driver.points}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-300">{driver.wins}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    {getChangeIcon(driver.change)}
                    {driver.change !== 0 && (
                      <span className={`text-sm ${
                        driver.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {Math.abs(driver.change)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverStandings;