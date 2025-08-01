export const TEAM_LOGOS = {
  'Red Bull': 'https://i.imgur.com/DlwfWqY.png',
  'McLaren': 'https://i.imgur.com/LCGzrHE.png',
  'Ferrari': 'https://i.imgur.com/EfxPgSo.png',
  'Mercedes': 'https://i.imgur.com/K842JS5.png',
  'Alpine': 'https://i.imgur.com/meZ7Mmy.png',
  'Aston Martin': 'https://i.imgur.com/POJgjww.png',
  'Haas': 'https://i.imgur.com/vaxLmbH.png',
  'Racing Bulls': 'https://i.imgur.com/hVcWGAf.png',
  'Sauber': 'https://i.imgur.com/wf690D4.png',
  'Williams': 'https://i.imgur.com/EDDEHIC.png'
};

export function getTeamLogo(teamName: string): string {
  return TEAM_LOGOS[teamName as keyof typeof TEAM_LOGOS] || 'https://images.pexels.com/photos/163407/bulls-bull-red-bull-163407.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop';
}

// Fonction pour déterminer la couleur des points selon les conditions
export function getPointsColor(result: {
  fastestLap?: boolean;
  status?: string;
  penalty?: {
    type: "time" | "drive-through" | "stop-go" | "grid" | "points";
    value: string;
    reason: string;
  } | undefined;
  polePosition?: boolean;
}): string {
  // Priorité: Fastest lap > DNF > Pénalité > Pole
  if (result.fastestLap) {
    return 'text-purple-400'; // Violet pour fastest lap
  }
  
  if (result.status === 'DNF') {
    return 'text-red-400'; // Rouge pour DNF
  }
  
  if (result.penalty) {
    return 'text-orange-400'; // Orange pour pénalité
  }
  
  if (result.polePosition) {
    return 'text-blue-400'; // Bleu pour pole
  }
  
  return 'text-green-400'; // Vert par défaut
}