export const SPORT_THEMES: Record<string, { color: string; label: string; icon: string; hex: string }> = {
  calcio: {
    color: 'rgba(65, 194, 133, 0.2)',
    label: 'Calcio',
    icon: '⚽',
    hex: '#41c285'
  },
  calcio5: {
    color: 'rgba(76, 194, 255, 0.2)',
    label: 'Calcio 5',
    icon: '⚽',
    hex: '#4cc2ff'
  },
  pallavolo: {
    color: 'rgba(255, 180, 0, 0.2)',
    label: 'Pallavolo',
    icon: '🏐',
    hex: '#ffd700'
  },
  rugby: {
    color: 'rgba(255, 120, 80, 0.2)',
    label: 'Rugby',
    icon: '🏈',
    hex: '#ff7850'
  },
  basket: {
    color: 'rgba(150, 100, 255, 0.2)',
    label: 'Basketball',
    icon: '🏀',
    hex: '#9664ff'
  }
}

export function getSportTheme(sport: string | undefined) {
  return SPORT_THEMES[sport || 'calcio'] || SPORT_THEMES.calcio
}

export function getSportColor(sport: string | undefined): string {
  return getSportTheme(sport).hex
}
