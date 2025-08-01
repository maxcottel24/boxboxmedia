// Types pour les données
export interface RaceResult {
  position: number;
  driver: string;
  team: string;
  status?: string; // "DNF", "DNS", "DSQ", "NC", etc.
  dnfReason?: string; // "Engine", "Accident", "Gearbox", etc.
  penalty?: {
    type: "time" | "drive-through" | "stop-go" | "grid" | "points";
    value: string; // "5s", "10s", "3 positions", "2 points", etc.
    reason: string; // "Track limits", "Unsafe release", etc.
  };
  fastestLap?: boolean;
  points?: number; // Points gagnés dans cette course spécifique
}

export interface Race {
  gpOrder: number;
  polePosition?: {
    driver: string;
    team: string;
    time?: string; // "1:23.456"
  };
  results: RaceResult[];
}

export interface Season {
  season: number;
  races: Record<string, Race>;
}

export interface Driver {
  number: number;
  nationality: string;
  dateOfBirth: string;
}

export interface Team {
  fullName: string;
  teamPrincipal: string;
  championships: number;
}

// Fonction pour charger une saison spécifique
export async function loadSeason(season: number): Promise<Season> {
  try {
    const response = await import(`../data/seasons/${season}.json`);
    return response.default;
  } catch (error) {
    throw new Error(`Impossible de charger la saison ${season}: ${error}`);
  }
}

// Fonction pour charger les métadonnées des pilotes
export async function loadDrivers(): Promise<Record<string, Driver>> {
  try {
    const response = await import('../data/metadata/drivers.json');
    return response.default.drivers;
  } catch (error) {
    throw new Error(`Impossible de charger les données des pilotes: ${error}`);
  }
}

// Fonction pour charger les métadonnées des équipes
export async function loadTeams(): Promise<Record<string, Team>> {
  try {
    const response = await import('../data/metadata/teams.json');
    return response.default.teams;
  } catch (error) {
    throw new Error(`Impossible de charger les données des équipes: ${error}`);
  }
}

// Fonction pour obtenir la liste des saisons disponibles
export async function getAvailableSeasons(): Promise<number[]> {
  // Pour l'instant, on retourne les saisons hardcodées
  // Plus tard, on pourrait scanner le dossier seasons/ dynamiquement
  return [2025, 2026, 2027];
}

// Fonction utilitaire pour calculer les points d'un pilote dans une course
export function getPointsForPosition(position: number): number {
  const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  return position <= 10 ? pointsSystem[position - 1] : 0;
}

// Fonction pour calculer le classement des pilotes pour une saison
export function calculateDriverStandings(season: Season): Array<{
  driver: string;
  team: string;
  points: number;
  wins: number;
  podiums: number;
}> {
  const driverStats = new Map<string, { team: string; points: number; wins: number; podiums: number }>();

  // Parcourir toutes les courses de la saison
  Object.values(season.races).forEach(race => {
    race.results.forEach(result => {
      const points = getPointsForPosition(result.position);
      const isWin = result.position === 1;
      const isPodium = result.position <= 3;

      if (driverStats.has(result.driver)) {
        const stats = driverStats.get(result.driver)!;
        stats.points += points;
        if (isWin) stats.wins++;
        if (isPodium) stats.podiums++;
      } else {
        driverStats.set(result.driver, {
          team: result.team,
          points,
          wins: isWin ? 1 : 0,
          podiums: isPodium ? 1 : 0
        });
      }
    });
  });

  // Convertir en tableau et trier par points
  return Array.from(driverStats.entries())
    .map(([driver, stats]) => ({
      driver,
      ...stats
    }))
    .sort((a, b) => {
      // Tri par points, puis par victoires, puis par podiums
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.podiums - a.podiums;
    });
}

// Fonction pour calculer le classement des constructeurs pour une saison
export function calculateConstructorStandings(season: Season): Array<{
  team: string;
  points: number;
  wins: number;
  podiums: number;
}> {
  const teamStats = new Map<string, { points: number; wins: number; podiums: number }>();

  // Parcourir toutes les courses de la saison
  Object.values(season.races).forEach(race => {
    race.results.forEach(result => {
      const points = getPointsForPosition(result.position);
      const isWin = result.position === 1;
      const isPodium = result.position <= 3;

      if (teamStats.has(result.team)) {
        const stats = teamStats.get(result.team)!;
        stats.points += points;
        if (isWin) stats.wins++;
        if (isPodium) stats.podiums++;
      } else {
        teamStats.set(result.team, {
          points,
          wins: isWin ? 1 : 0,
          podiums: isPodium ? 1 : 0
        });
      }
    });
  });

  // Convertir en tableau et trier par points
  return Array.from(teamStats.entries())
    .map(([team, stats]) => ({
      team,
      ...stats
    }))
    .sort((a, b) => {
      // Tri par points, puis par victoires, puis par podiums
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.podiums - a.podiums;
    });
} 