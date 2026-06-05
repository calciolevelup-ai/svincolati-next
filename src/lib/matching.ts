import { SPORTS } from './constants'

export interface Ad {
  id: string
  ruolo: string
  cat: string
  regione: string
  provincia?: string
  sport: string
}

export interface Player {
  id: string
  ruolo?: string
  cat?: string
  regione?: string
  provincia?: string
  sport: string
}

export const matchScore = (player: Player, ad: Ad): number => {
  const cfg = SPORTS[player.sport as keyof typeof SPORTS]
  if (!cfg) return 0

  let score = 0

  // Position match (4 points)
  if (player.ruolo && player.ruolo === ad.ruolo) score += 4

  // Category match (0-3 points based on proximity)
  if (player.cat && ad.cat) {
    const playerCatIdx = cfg.categorie.indexOf(player.cat)
    const adCatIdx = cfg.categorie.indexOf(ad.cat)

    if (playerCatIdx >= 0 && adCatIdx >= 0) {
      const diff = Math.abs(playerCatIdx - adCatIdx)
      if (diff === 0) score += 3
      else if (diff === 1) score += 1
    }
  }

  // Region match (2 points)
  if (player.regione && player.regione === ad.regione) score += 2

  // Province match (1 point)
  if (player.provincia && player.provincia === ad.provincia) score += 1

  return score
}

export const getMatchingAds = (player: Player, ads: Ad[], minScore: number = 3): Ad[] => {
  return ads
    .map(ad => ({ ad, score: matchScore(player, ad) }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ ad }) => ad)
}

export const getMatchingPlayers = (ad: Ad, players: Player[], minScore: number = 3): Player[] => {
  return players
    .map(p => ({ player: p, score: matchScore(p, ad) }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ player }) => player)
}
