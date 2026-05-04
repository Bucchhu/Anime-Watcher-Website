'use client'

import type { User, Anime, WatchlistItem, WatchStatus } from './types'

// Logger function to write to corrections/logs.txt
export async function logToFile(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', module: string, message: string, userId?: string) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, module, message, userId })
    })
  } catch (error) {
    console.error('Failed to log:', error)
  }
}

// Bug report function
export async function submitBugReport(data: {
  reportedBy: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  description: string
  steps: string
  expected: string
  actual: string
}) {
  try {
    const response = await fetch('/api/bug-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    if (result.success) {
      await logToFile('INFO', 'BUG_REPORT', `New bug report created: ${result.bugId}`, data.reportedBy)
    }
    return result
  } catch (error) {
    console.error('Failed to submit bug report:', error)
    return { success: false, error: 'Failed to submit bug report' }
  }
}

// Download Excel file
export function downloadExcelFile(type: 'users' | 'watchlist' | 'anime' | 'logs') {
  window.open(`/api/excel?type=${type}&format=download`, '_blank')
}

// Sample anime data (simulating Excel/local data)
export const sampleAnimeData: Anime[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    titleJapanese: 'Shingeki no Kyojin',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.',
    episodes: 87,
    status: 'finished',
    rating: 9.0,
    genres: ['Action', 'Drama', 'Fantasy'],
    year: 2013,
    studio: 'Wit Studio'
  },
  {
    id: '2',
    title: 'Demon Slayer',
    titleJapanese: 'Kimetsu no Yaiba',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
    episodes: 55,
    status: 'airing',
    rating: 8.6,
    genres: ['Action', 'Fantasy', 'Adventure'],
    year: 2019,
    studio: 'ufotable'
  },
  {
    id: '3',
    title: 'Jujutsu Kaisen',
    titleJapanese: 'Jujutsu Kaisen',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.',
    episodes: 47,
    status: 'airing',
    rating: 8.7,
    genres: ['Action', 'Supernatural', 'School'],
    year: 2020,
    studio: 'MAPPA'
  },
  {
    id: '4',
    title: 'My Hero Academia',
    titleJapanese: 'Boku no Hero Academia',
    image: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
    synopsis: 'In a world where people with superpowers known as "Quirks" are the norm, a boy without powers dreams of becoming a superhero.',
    episodes: 138,
    status: 'airing',
    rating: 8.0,
    genres: ['Action', 'Comedy', 'School'],
    year: 2016,
    studio: 'Bones'
  },
  {
    id: '5',
    title: 'Death Note',
    titleJapanese: 'Death Note',
    image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
    synopsis: 'A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.',
    episodes: 37,
    status: 'finished',
    rating: 8.6,
    genres: ['Mystery', 'Psychological', 'Thriller'],
    year: 2006,
    studio: 'Madhouse'
  },
  {
    id: '6',
    title: 'One Punch Man',
    titleJapanese: 'One Punch Man',
    image: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg',
    synopsis: 'The story of Saitama, a hero that does it just for fun & can defeat his enemies with a single punch.',
    episodes: 24,
    status: 'finished',
    rating: 8.5,
    genres: ['Action', 'Comedy', 'Parody'],
    year: 2015,
    studio: 'Madhouse'
  },
  {
    id: '7',
    title: 'Spy x Family',
    titleJapanese: 'Spy x Family',
    image: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
    synopsis: 'A spy on an undercover mission gets married and adopts a child as part of his cover.',
    episodes: 37,
    status: 'airing',
    rating: 8.5,
    genres: ['Action', 'Comedy', 'Slice of Life'],
    year: 2022,
    studio: 'Wit Studio'
  },
  {
    id: '8',
    title: 'Chainsaw Man',
    titleJapanese: 'Chainsaw Man',
    image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    synopsis: 'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes.',
    episodes: 12,
    status: 'finished',
    rating: 8.5,
    genres: ['Action', 'Fantasy', 'Horror'],
    year: 2022,
    studio: 'MAPPA'
  },
  {
    id: '9',
    title: 'Fullmetal Alchemist: Brotherhood',
    titleJapanese: 'Hagane no Renkinjutsushi',
    image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong.',
    episodes: 64,
    status: 'finished',
    rating: 9.1,
    genres: ['Action', 'Adventure', 'Drama'],
    year: 2009,
    studio: 'Bones'
  },
  {
    id: '10',
    title: 'Steins;Gate',
    titleJapanese: 'Steins;Gate',
    image: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
    synopsis: 'A self-proclaimed mad scientist discovers a way to send messages to the past.',
    episodes: 24,
    status: 'finished',
    rating: 9.1,
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    year: 2011,
    studio: 'White Fox'
  },
  {
    id: '11',
    title: 'Vinland Saga',
    titleJapanese: 'Vinland Saga',
    image: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg',
    synopsis: 'Thorfinn pursues a journey with his father\'s killer to avenge him and become the greatest warrior.',
    episodes: 48,
    status: 'finished',
    rating: 8.8,
    genres: ['Action', 'Adventure', 'Drama'],
    year: 2019,
    studio: 'Wit Studio'
  },
  {
    id: '12',
    title: 'Mob Psycho 100',
    titleJapanese: 'Mob Psycho 100',
    image: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg',
    synopsis: 'A psychic middle school boy tries to live a normal life and suppress his growing powers.',
    episodes: 37,
    status: 'finished',
    rating: 8.6,
    genres: ['Action', 'Comedy', 'Supernatural'],
    year: 2016,
    studio: 'Bones'
  }
]

// Storage keys
const STORAGE_KEYS = {
  users: 'anime_tracker_users',
  currentUser: 'anime_tracker_current_user',
  watchlist: 'anime_tracker_watchlist'
}

// Helper to safely access localStorage
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

// User management (simulating Excel-based auth)
export function getUsers(): User[] {
  return getStorage<User[]>(STORAGE_KEYS.users, [])
}

export function getCurrentUser(): User | null {
  return getStorage<User | null>(STORAGE_KEYS.currentUser, null)
}

export function registerUser(username: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  
  if (users.some(u => u.email === email)) {
    logToFile('WARN', 'AUTH', `Registration failed: Email already registered - ${email}`)
    return { success: false, error: 'Email already registered' }
  }
  
  if (users.some(u => u.username === username)) {
    logToFile('WARN', 'AUTH', `Registration failed: Username already taken - ${username}`)
    return { success: false, error: 'Username already taken' }
  }
  
  const newUser: User & { password: string } = {
    id: crypto.randomUUID(),
    username,
    email,
    password, // In real app, this would be hashed
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  setStorage(STORAGE_KEYS.users, users)
  
  // Log successful registration
  logToFile('INFO', 'AUTH', `New user registered: ${username} (${email})`, newUser.id)
  
  const { password: _, ...userWithoutPassword } = newUser
  return { success: true, user: userWithoutPassword }
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getStorage<(User & { password: string })[]>(STORAGE_KEYS.users, [])
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    logToFile('WARN', 'AUTH', `Login failed: Invalid credentials for ${email}`)
    return { success: false, error: 'Invalid email or password' }
  }
  
  const { password: _, ...userWithoutPassword } = user
  setStorage(STORAGE_KEYS.currentUser, userWithoutPassword)
  
  // Log successful login
  logToFile('INFO', 'AUTH', `User logged in: ${user.username}`, user.id)
  
  return { success: true, user: userWithoutPassword }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.currentUser)
}

// Watchlist management (simulating Excel-based storage)
export function getWatchlist(userId: string): WatchlistItem[] {
  const allWatchlists = getStorage<Record<string, WatchlistItem[]>>(STORAGE_KEYS.watchlist, {})
  return allWatchlists[userId] || []
}

export function addToWatchlist(
  userId: string, 
  animeId: string, 
  status: WatchStatus = 'plan-to-watch'
): WatchlistItem | null {
  // First check sample data, then check cached anime from API
  let anime = sampleAnimeData.find(a => a.id === animeId)
  
  if (!anime) {
    // Check anime cache from API fetches
    const cacheStr = typeof window !== 'undefined' ? localStorage.getItem('anime_cache') : null
    if (cacheStr) {
      const cache = JSON.parse(cacheStr)
      anime = cache[animeId]
    }
  }
  
  if (!anime) return null
  
  const allWatchlists = getStorage<Record<string, WatchlistItem[]>>(STORAGE_KEYS.watchlist, {})
  const userWatchlist = allWatchlists[userId] || []
  
  // Check if already in watchlist
  if (userWatchlist.some(item => item.animeId === animeId)) {
    return null
  }
  
  const newItem: WatchlistItem = {
    id: crypto.randomUUID(),
    animeId,
    anime,
    userId,
    status,
    progress: 0,
    updatedAt: new Date().toISOString()
  }
  
  userWatchlist.push(newItem)
  allWatchlists[userId] = userWatchlist
  setStorage(STORAGE_KEYS.watchlist, allWatchlists)
  
  // Log watchlist addition
  logToFile('INFO', 'WATCHLIST', `Anime added to watchlist: ${anime.title} (Status: ${status})`, userId)
  
  return newItem
}

export function updateWatchlistItem(
  userId: string,
  itemId: string,
  updates: Partial<Pick<WatchlistItem, 'status' | 'progress' | 'score' | 'notes'>>
): WatchlistItem | null {
  const allWatchlists = getStorage<Record<string, WatchlistItem[]>>(STORAGE_KEYS.watchlist, {})
  const userWatchlist = allWatchlists[userId] || []
  
  const itemIndex = userWatchlist.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return null
  
  userWatchlist[itemIndex] = {
    ...userWatchlist[itemIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  // Auto-set finish date if completed
  if (updates.status === 'completed' && !userWatchlist[itemIndex].finishDate) {
    userWatchlist[itemIndex].finishDate = new Date().toISOString()
  }
  
  // Auto-set start date if watching
  if (updates.status === 'watching' && !userWatchlist[itemIndex].startDate) {
    userWatchlist[itemIndex].startDate = new Date().toISOString()
  }
  
  allWatchlists[userId] = userWatchlist
  setStorage(STORAGE_KEYS.watchlist, allWatchlists)
  
  return userWatchlist[itemIndex]
}

export function removeFromWatchlist(userId: string, itemId: string): boolean {
  const allWatchlists = getStorage<Record<string, WatchlistItem[]>>(STORAGE_KEYS.watchlist, {})
  const userWatchlist = allWatchlists[userId] || []
  
  const filtered = userWatchlist.filter(item => item.id !== itemId)
  if (filtered.length === userWatchlist.length) return false
  
  allWatchlists[userId] = filtered
  setStorage(STORAGE_KEYS.watchlist, allWatchlists)
  return true
}

// AI Recommendations (basic genre-based algorithm)
export function getRecommendations(userId: string): Anime[] {
  const watchlist = getWatchlist(userId)
  
  if (watchlist.length === 0) {
    // Return top-rated anime if no watch history
    return [...sampleAnimeData].sort((a, b) => b.rating - a.rating).slice(0, 6)
  }
  
  // Analyze user preferences
  const genreCounts: Record<string, number> = {}
  const studioCounts: Record<string, number> = {}
  const watchedIds = new Set(watchlist.map(item => item.animeId))
  
  watchlist.forEach(item => {
    // Weight by score and status
    const weight = item.status === 'completed' ? 2 : 
                   item.status === 'watching' ? 1.5 : 1
    const scoreWeight = item.score ? item.score / 10 : 0.7
    
    item.anime.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + weight * scoreWeight
    })
    
    if (item.anime.studio) {
      studioCounts[item.anime.studio] = (studioCounts[item.anime.studio] || 0) + weight * scoreWeight
    }
  })
  
  // Score unwatched anime based on preferences
  const recommendations = sampleAnimeData
    .filter(anime => !watchedIds.has(anime.id))
    .map(anime => {
      let score = anime.rating
      
      // Add genre affinity
      anime.genres.forEach(genre => {
        score += (genreCounts[genre] || 0) * 0.5
      })
      
      // Add studio affinity
      if (anime.studio && studioCounts[anime.studio]) {
        score += studioCounts[anime.studio] * 0.3
      }
      
      return { anime, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(r => r.anime)
  
  return recommendations
}

// Get all anime for browsing
export function getAllAnime(): Anime[] {
  return sampleAnimeData
}

export function getAnimeById(id: string): Anime | undefined {
  return sampleAnimeData.find(a => a.id === id)
}
