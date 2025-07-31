import React, { useState } from 'react';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { Season } from '../App';
import raceResultsData from '../data/raceResults.json';

interface RaceResultsProps {
  season: Season;
}

const circuits = [
  'Australia', 'China', 'Japan', 'Saudi Arabia', 'Russia', 'Azerbaijan',
  'Italy (Imola)', 'Monaco', 'Portugal', 'Canada', 'Great Britain', 'Hungary',
  'Belgium', 'Netherlands', 'Germany', 'Monza (Italy)', 'South Africa',
  'Singapore', 'Phoenix', 'Las Vegas', 'Brazil', 'Spain', 'United Arab Emirates', 'Qatar'
];

const RaceResults: React.FC<RaceResultsProps> = ({ season }) => {
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const seasonData = raceResultsData[season as keyof typeof raceResultsData] || {};
  
  // Transform data to match expected format
  const results: { [circuit: string]: { winner: string; date: string; podium: string[] } } = {};
  Object.entries(seasonData).forEach(([circuit, raceData]) => {
    const sortedResults = [...raceData.results].sort((a, b) => a.position - b.position);
    results[circuit] = {
      winner: sortedResults[0]?.driver || '',
      date: raceData.date,
      podium: sortedResults.slice(0, 3).map(r => r.driver)
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-green-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Race Calendar - {season}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {circuits.map((circuit) => {
            const result = results[circuit];
            const isCompleted = !!result;
            
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
                    <div className="text-sm text-gray-400 mb-1">{result.date}</div>
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-yellow-400" />
                      <span className="text-sm text-green-400 font-medium">{result.winner}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not completed</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCircuit && results[selectedCircuit] && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-xl font-bold text-white mb-4">{selectedCircuit} GP Results</h3>
          
          <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-400 mb-2">{results[selectedCircuit].date}</div>
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400" size={20} />
              <span className="text-lg font-semibold text-white">Winner: {results[selectedCircuit].winner}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Podium Finishers</h4>
            <div className="space-y-3">
              {seasonData[selectedCircuit]?.results.slice(0, 10).map((result, index) => (
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
                    <span className="text-white font-medium">{result.driver}</span>
                    <div className="text-sm text-gray-400">{result.team}</div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {result.position <= 10 ? `${[25, 18, 15, 12, 10, 8, 6, 4, 2, 1][result.position - 1]} pts` : '0 pts'}
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