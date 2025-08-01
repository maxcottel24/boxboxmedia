import React, { useState, useEffect } from 'react';
import { Building2, Trophy } from 'lucide-react';
import { loadSeason, calculateConstructorStandings } from '../utils/dataLoader';
import { getTeamLogo } from '../utils/teamLogos';

interface ConstructorStandingsProps {
  season: number;
}

const ConstructorStandings: React.FC<ConstructorStandingsProps> = ({ season }) => {
  const [standings, setStandings] = useState<Array<{
    team: string;
    points: number;
    wins: number;
    podiums: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        const seasonData = await loadSeason(season);
        const constructorStandings = calculateConstructorStandings(seasonData);
        setStandings(constructorStandings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadStandings();
  }, [season]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <Building2 className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Constructor Championship - {season}</h2>
        </div>
        <p className="text-gray-400 mt-2">Team standings and points</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Position</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Team</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Points</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Wins</th>
              <th className="text-left py-4 px-6 text-gray-300 font-semibold">Podiums</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr 
                key={team.team}
                className="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors duration-200"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getTeamLogo(team.team)} 
                      alt={team.team}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-white font-semibold">{team.team}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-white font-semibold text-lg">{team.points}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{team.wins}</span>
                    {team.wins > 0 && <Trophy className="text-yellow-400" size={16} />}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-300">{team.podiums}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConstructorStandings;