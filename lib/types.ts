export type WatchStatus = 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export interface StreamingPlatform {
  name: string
  url: string
  icon: 'crunchyroll' | 'netflix' | 'prime' | 'hulu' | 'funimation' | 'hidive' | 'disney' | 'default'
}

export interface Anime {
  id: string
  title: string
  titleJapanese?: string
  image: string
  synopsis: string
  episodes: number
  status: 'airing' | 'finished' | 'upcoming'
  rating: number
  genres: string[]
  year: number
  studio?: string
  trailerUrl?: string
  streamingPlatforms?: StreamingPlatform[]
}

export interface WatchlistItem {
  id: string
  animeId: string
  anime: Anime
  userId: string
  status: WatchStatus
  progress: number
  score?: number
  startDate?: string
  finishDate?: string
  notes?: string
  updatedAt: string
}

export interface WatchlistStats {
  watching: number
  completed: number
  onHold: number
  dropped: number
  planToWatch: number
  totalEpisodes: number
  averageScore: number
}
