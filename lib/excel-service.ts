import * as XLSX from 'xlsx'

// Types
export interface ExcelUser {
  id: string
  email: string
  username: string
  password: string // In production, this should be hashed
  createdAt: string
  lastLogin: string
}

export interface ExcelWatchlistEntry {
  id: string
visibilityCopyCodeSelect
  userId: string
  animeId: string
  animeTitle: string
  status: 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch'
  currentEpisode: number
  totalEpisodes: number
  score: number
  notes: string
  startDate: string
  completedDate: string
  addedAt: string
  updatedAt: string
}

export interface ExcelAnime {
  id: string
  title: string
  coverImage: string
  genres: string // comma-separated
  episodes: number
  rating: number
  year: number
  synopsis: string
  studio: string
}

export interface ExcelLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  module: string
  message: string
  userId?: string
}

// Helper to create workbook from data
function createWorkbook<T extends object>(data: T[], sheetName: string): XLSX.WorkBook {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  return workbook
}

// Helper to read data from workbook
function readWorkbook<T>(workbook: XLSX.WorkBook, sheetName: string): T[] {
  const worksheet = workbook.Sheets[sheetName]
  if (!worksheet) return []
  return XLSX.utils.sheet_to_json<T>(worksheet)
}

// Convert workbook to base64 for API transfer
export function workbookToBase64(workbook: XLSX.WorkBook): string {
  const buffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' })
  return buffer
}

// Convert base64 to workbook
export function base64ToWorkbook(base64: string): XLSX.WorkBook {
  return XLSX.read(base64, { type: 'base64' })
}

// Create initial Excel files with default data
export function createInitialUsersWorkbook(): XLSX.WorkBook {
  const users: ExcelUser[] = []
  return createWorkbook(users, 'Users')
}

export function createInitialWatchlistWorkbook(): XLSX.WorkBook {
  const watchlist: ExcelWatchlistEntry[] = []
  return createWorkbook(watchlist, 'Watchlist')
}

export function createInitialAnimeWorkbook(): XLSX.WorkBook {
  const anime: ExcelAnime[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      coverImage: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
      genres: 'Action,Drama,Fantasy,Mystery',
      episodes: 87,
      rating: 9.0,
      year: 2013,
      synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans.',
      studio: 'Wit Studio'
    },
    {
      id: '2',
      title: 'Death Note',
      coverImage: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
      genres: 'Mystery,Psychological,Supernatural,Thriller',
      episodes: 37,
      rating: 8.6,
      year: 2006,
      synopsis: 'A shinigami drops his Death Note into the human world, where Light Yagami finds it.',
      studio: 'Madhouse'
    },
    {
      id: '3',
      title: 'Fullmetal Alchemist: Brotherhood',
      coverImage: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
      genres: 'Action,Adventure,Drama,Fantasy',
      episodes: 64,
      rating: 9.1,
      year: 2009,
      synopsis: 'Two brothers search for the Philosophers Stone to restore their bodies after a failed alchemical ritual.',
      studio: 'Bones'
    },
    {
      id: '4',
      title: 'Steins;Gate',
      coverImage: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
      genres: 'Drama,Sci-Fi,Thriller',
      episodes: 24,
      rating: 9.1,
      year: 2011,
      synopsis: 'A group of friends accidentally discover a method of time travel through text messages.',
      studio: 'White Fox'
    },
    {
      id: '5',
      title: 'One Punch Man',
      coverImage: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg',
      genres: 'Action,Comedy,Parody,Sci-Fi',
      episodes: 24,
      rating: 8.5,
      year: 2015,
      synopsis: 'Saitama is a hero who can defeat any opponent with a single punch but seeks a worthy challenge.',
      studio: 'Madhouse'
    },
    {
      id: '6',
      title: 'Demon Slayer',
      coverImage: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
      genres: 'Action,Fantasy,Historical,Supernatural',
      episodes: 55,
      rating: 8.5,
      year: 2019,
      synopsis: 'Tanjiro becomes a demon slayer to avenge his family and cure his sister who was turned into a demon.',
      studio: 'ufotable'
    },
    {
      id: '7',
      title: 'My Hero Academia',
      coverImage: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
      genres: 'Action,Comedy,School,Shounen',
      episodes: 138,
      rating: 8.0,
      year: 2016,
      synopsis: 'In a world where most people have superpowers, a powerless boy dreams of becoming a hero.',
      studio: 'Bones'
    },
    {
      id: '8',
      title: 'Jujutsu Kaisen',
      coverImage: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
      genres: 'Action,Fantasy,Horror,Supernatural',
      episodes: 47,
      rating: 8.7,
      year: 2020,
      synopsis: 'A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse.',
      studio: 'MAPPA'
    },
    {
      id: '9',
      title: 'Spy x Family',
      coverImage: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
      genres: 'Action,Comedy,Slice of Life',
      episodes: 37,
      rating: 8.5,
      year: 2022,
      synopsis: 'A spy, an assassin, and a telepath form a fake family while hiding their true identities.',
      studio: 'Wit Studio'
    },
    {
      id: '10',
      title: 'Naruto Shippuden',
      coverImage: 'https://cdn.myanimelist.net/images/anime/5/17407.jpg',
      genres: 'Action,Adventure,Comedy,Drama',
      episodes: 500,
      rating: 8.3,
      year: 2007,
      synopsis: 'Naruto returns after training to save his friend Sasuke and protect his village.',
      studio: 'Pierrot'
    },
    {
      id: '11',
      title: 'Violet Evergarden',
      coverImage: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg',
      genres: 'Drama,Fantasy,Slice of Life',
      episodes: 13,
      rating: 8.7,
      year: 2018,
      synopsis: 'A former soldier becomes an Auto Memory Doll to understand the meaning of love.',
      studio: 'Kyoto Animation'
    },
    {
      id: '12',
      title: 'Mob Psycho 100',
      coverImage: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg',
      genres: 'Action,Comedy,Slice of Life,Supernatural',
      episodes: 37,
      rating: 8.5,
      year: 2016,
      synopsis: 'A psychic middle school boy tries to live a normal life while working for a con artist.',
      studio: 'Bones'
    }
  ]
  return createWorkbook(anime, 'Anime')
}

export function createInitialLogsWorkbook(): XLSX.WorkBook {
  const logs: ExcelLog[] = [
    {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      module: 'SYSTEM',
      message: 'AniTracker Excel Storage initialized'
    }
  ]
  return createWorkbook(logs, 'Logs')
}

// Parse users from workbook
export function parseUsersFromWorkbook(workbook: XLSX.WorkBook): ExcelUser[] {
  return readWorkbook<ExcelUser>(workbook, 'Users')
}

// Parse watchlist from workbook
export function parseWatchlistFromWorkbook(workbook: XLSX.WorkBook): ExcelWatchlistEntry[] {
  return readWorkbook<ExcelWatchlistEntry>(workbook, 'Watchlist')
}

// Parse anime from workbook
export function parseAnimeFromWorkbook(workbook: XLSX.WorkBook): ExcelAnime[] {
  return readWorkbook<ExcelAnime>(workbook, 'Anime')
}

// Parse logs from workbook
export function parseLogsFromWorkbook(workbook: XLSX.WorkBook): ExcelLog[] {
  return readWorkbook<ExcelLog>(workbook, 'Logs')
}

// Add user to workbook
export function addUserToWorkbook(workbook: XLSX.WorkBook, user: ExcelUser): XLSX.WorkBook {
  const users = parseUsersFromWorkbook(workbook)
  users.push(user)
  return createWorkbook(users, 'Users')
}

// Update user in workbook
export function updateUserInWorkbook(workbook: XLSX.WorkBook, userId: string, updates: Partial<ExcelUser>): XLSX.WorkBook {
  const users = parseUsersFromWorkbook(workbook)
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
  }
  return createWorkbook(users, 'Users')
}

// Add watchlist entry to workbook
export function addWatchlistEntryToWorkbook(workbook: XLSX.WorkBook, entry: ExcelWatchlistEntry): XLSX.WorkBook {
  const watchlist = parseWatchlistFromWorkbook(workbook)
  watchlist.push(entry)
  return createWorkbook(watchlist, 'Watchlist')
}

// Update watchlist entry in workbook
export function updateWatchlistEntryInWorkbook(workbook: XLSX.WorkBook, entryId: string, updates: Partial<ExcelWatchlistEntry>): XLSX.WorkBook {
  const watchlist = parseWatchlistFromWorkbook(workbook)
  const index = watchlist.findIndex(e => e.id === entryId)
  if (index !== -1) {
    watchlist[index] = { ...watchlist[index], ...updates, updatedAt: new Date().toISOString() }
  }
  return createWorkbook(watchlist, 'Watchlist')
}

// Remove watchlist entry from workbook
export function removeWatchlistEntryFromWorkbook(workbook: XLSX.WorkBook, entryId: string): XLSX.WorkBook {
  const watchlist = parseWatchlistFromWorkbook(workbook).filter(e => e.id !== entryId)
  return createWorkbook(watchlist, 'Watchlist')
}

// Add log entry to workbook
export function addLogToWorkbook(workbook: XLSX.WorkBook, log: ExcelLog): XLSX.WorkBook {
  const logs = parseLogsFromWorkbook(workbook)
  logs.push(log)
  return createWorkbook(logs, 'Logs')
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
