// Liste des saisons disponibles
export const AVAILABLE_SEASONS = [2025, 2026, 2027] as const;

// Type pour les saisons disponibles
export type AvailableSeason = typeof AVAILABLE_SEASONS[number];

// Fonction pour vérifier si une saison est disponible
export function isSeasonAvailable(season: number): season is AvailableSeason {
  return AVAILABLE_SEASONS.includes(season as AvailableSeason);
}

// Fonction pour obtenir la saison la plus récente
export function getLatestSeason(): AvailableSeason {
  return AVAILABLE_SEASONS[AVAILABLE_SEASONS.length - 1];
} 