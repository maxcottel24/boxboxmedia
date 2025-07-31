export const F1_POINTS_SYSTEM = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1
};

export interface RaceResult {
  position: number;
  driver: string;
  team: string;
}

export interface DriverStanding {
  position: number;
  driver: string;
  team: string;
  points: number;
  wins: number;
  change: number;
}

export interface ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
  drivers: string[];
}

export function calculateDriverStandings(raceResults: { [race: string]: { results: RaceResult[] } }): DriverStanding[] {
  const driverPoints: { [driver: string]: { points: number; wins: number; team: string } } = {};

  // Calculate points for each driver
  Object.values(raceResults).forEach(race => {
    race.results.forEach(result => {
      const points = F1_POINTS_SYSTEM[result.position as keyof typeof F1_POINTS_SYSTEM] || 0;
      
      if (!driverPoints[result.driver]) {
        driverPoints[result.driver] = { points: 0, wins: 0, team: result.team };
      }
      
      driverPoints[result.driver].points += points;
      if (result.position === 1) {
        driverPoints[result.driver].wins += 1;
      }
    });
  });

  // Convert to array and sort by points
  const standings = Object.entries(driverPoints)
    .map(([driver, data]) => ({
      driver,
      points: data.points,
      wins: data.wins,
      team: data.team
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.driver.localeCompare(b.driver);
    });

  // Add positions and mock change data
  return standings.map((standing, index) => ({
    position: index + 1,
    driver: standing.driver,
    team: standing.team,
    points: standing.points,
    wins: standing.wins,
    change: 0 // This would need historical data to calculate properly
  }));
}

export function calculateConstructorStandings(raceResults: { [race: string]: { results: RaceResult[] } }): ConstructorStanding[] {
  const teamPoints: { [team: string]: { points: number; wins: number; drivers: Set<string> } } = {};

  // Calculate points for each team
  Object.values(raceResults).forEach(race => {
    race.results.forEach(result => {
      const points = F1_POINTS_SYSTEM[result.position as keyof typeof F1_POINTS_SYSTEM] || 0;
      
      if (!teamPoints[result.team]) {
        teamPoints[result.team] = { points: 0, wins: 0, drivers: new Set() };
      }
      
      teamPoints[result.team].points += points;
      teamPoints[result.team].drivers.add(result.driver);
      if (result.position === 1) {
        teamPoints[result.team].wins += 1;
      }
    });
  });

  // Convert to array and sort by points
  const standings = Object.entries(teamPoints)
    .map(([team, data]) => ({
      team,
      points: data.points,
      wins: data.wins,
      drivers: Array.from(data.drivers)
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.team.localeCompare(b.team);
    });

  // Add positions
  return standings.map((standing, index) => ({
    position: index + 1,
    team: standing.team,
    points: standing.points,
    wins: standing.wins,
    drivers: standing.drivers
  }));
}