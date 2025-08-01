import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Trophy, AlertTriangle, Clock, Zap, Flag } from 'lucide-react';
import { loadSeason, Season } from '../utils/dataLoader';
import { getPointsColor } from '../utils/teamLogos';

interface RaceResultsProps {
  season: number;
}

const circuits = [
  'Australia', 'China', 'Japan', 'Saudi Arabia', 'Russia', 'Azerbaijan',
  'Italy (Imola)', 'Monaco', 'Portugal', 'Canada', 'Great Britain', 'Hungary',
  'Belgium', 'Netherlands', 'Germany', 'Monza (Italy)', 'South Africa',
  'Singapore', 'Phoenix', 'Las Vegas', 'Brazil', 'Spain', 'United Arab Emirates', 'Qatar'
];

const RaceResults: React.FC<RaceResultsProps> = ({ season }) => {
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeasonData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadSeason(season);
        setSeasonData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadSeasonData();
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

  if (!seasonData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Aucune donnée disponible</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-green-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Race Calendar - {season}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circuits.map((circuit) => {
            const race = seasonData.races[circuit];
            const isCompleted = !!race;
            
            return (
              <button
                key={circuit}
                onClick={() => setSelectedCircuit(circuit)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  isCompleted
                    ? 'bg-green-900/30 border-green-600/50 hover:bg-green-900/50'
                    : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                } ${selectedCircuit === circuit ? 'ring-2 ring-red-500' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className={isCompleted ? 'text-green-400' : 'text-gray-400'} />
                  <span className="font-semibold text-white">{circuit}</span>
                </div>
                
                {isCompleted ? (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">GP #{race.gpOrder}</div>
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-yellow-400" />
                      <span className="text-sm text-green-400 font-medium">{race.results[0]?.driver}</span>
                    </div>
                    {race.polePosition && (
                      <div className="flex items-center gap-2 mt-1">
                        <Flag size={12} className="text-blue-400" />
                        <span className="text-xs text-blue-400">Pole: {race.polePosition.driver}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not completed</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCircuit && seasonData.races[selectedCircuit] && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-white mb-4">{selectedCircuit} GP Results</h3>
          
          <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-400 mb-2">GP #{seasonData.races[selectedCircuit].gpOrder}</div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-400" size={20} />
              <span className="text-lg font-semibold text-white">Winner: {seasonData.races[selectedCircuit].results[0]?.driver}</span>
            </div>
            {seasonData.races[selectedCircuit].polePosition && (
              <div className="flex items-center gap-2">
                <Flag className="text-blue-400" size={16} />
                <span className="text-sm text-blue-400">
                  Pole Position: {seasonData.races[selectedCircuit].polePosition.driver} 
                  {seasonData.races[selectedCircuit].polePosition.time && (
                    <span className="text-gray-400 ml-1">({seasonData.races[selectedCircuit].polePosition.time})</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Race Results</h4>
            <div className="space-y-3">
              {seasonData.races[selectedCircuit].results.map((result) => (
                <div key={result.driver} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    result.position === 1 ? 'bg-yellow-500 text-black' :
                    result.position === 2 ? 'bg-gray-300 text-black' :
                    result.position === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {result.position}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{result.driver}</span>
                      {result.fastestLap && (
                        <Zap className="text-purple-400" size={14} />
                      )}
                      {result.status === 'DNF' && (
                        <AlertTriangle className="text-red-400" size={14} />
                      )}
                      {result.penalty && (
                        <Clock className="text-orange-400" size={14} />
                      )}
                      {seasonData.races[selectedCircuit].polePosition?.driver === result.driver && (
                        <Flag className="text-blue-400" size={14} />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{result.team}</div>
                    {result.status === 'DNF' && (
                      <div className="text-xs text-red-400">DNF - {result.dnfReason}</div>
                    )}
                    {result.penalty && (
                      <div className="text-xs text-orange-400">
                        {result.penalty.type} penalty: {result.penalty.value} ({result.penalty.reason})
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {(() => {
                      const pointsColor = getPointsColor({
                        fastestLap: result.fastestLap,
                        status: result.status,
                        penalty: result.penalty,
                        polePosition: seasonData.races[selectedCircuit].polePosition?.driver === result.driver
                      });
                      
                      return (
                        <div className={`text-sm font-semibold ${pointsColor}`}>
                          {result.points || 0} pts
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceResults;