'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getWatchlist, addToWatchlist, updateWatchlistItem, logToFile } from '@/lib/store'
import type { Anime, WatchlistItem, WatchStatus } from '@/lib/types'
import { AnimeCard } from '@/components/anime-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, TrendingUp, Calendar, Sparkles } from 'lucide-react'

interface Genre {
  id: number
  name: string
  count: number
}

interface Pagination {
  currentPage: number
  lastPage: number
  hasNextPage: boolean
  totalItems: number
}

export default function BrowsePage() {
  const { user } = useAuth()
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'top' | 'seasonal' | 'upcoming'>('top')
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    totalItems: 0
  })
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Fetch genres on mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('/api/anime/genres')
        const data = await response.json()
        if (data.success) {
          setGenres(data.genres)
        }
      } catch (error) {
        console.error('Failed to fetch genres:', error)
      }
    }
    fetchGenres()
  }, [])

  // Fetch user watchlist
  useEffect(() => {
    if (user) {
      setWatchlist(getWatchlist(user.id))
    }
  }, [user])

  // Fetch anime based on current filters
  const fetchAnime = useCallback(async (page: number = 1) => {
    setLoading(true)
    try {
      let url = '/api/anime?'
      
      if (searchQuery.trim()) {
        url += `action=search&q=${encodeURIComponent(searchQuery)}&page=${page}&limit=24`
      } else if (selectedGenres.length > 0) {
        url += `action=genre&genre=${selectedGenres.join(',')}&page=${page}&limit=24`
      } else {
        url += `action=${activeTab}&page=${page}&limit=24`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setAnimeList(data.anime)
        setPagination(data.pagination)
        logToFile('INFO', 'BROWSE', `Fetched ${data.anime.length} anime (${activeTab}, page ${page})`, user?.id)
      }
    } catch (error) {
      console.error('Failed to fetch anime:', error)
      logToFile('ERROR', 'BROWSE', `Failed to fetch anime: ${error}`, user?.id)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedGenres, activeTab, user?.id])

  // Initial fetch
  useEffect(() => {
    fetchAnime(1)
  }, [activeTab, selectedGenres])

  // Search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchAnime(1)
      }
    }, 500)
    
    setSearchTimeout(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchQuery])

  const handleAddToWatchlist = (animeId: string, status: WatchStatus) => {
    if (!user) return
    const anime = animeList.find(a => a.id === animeId)
    if (anime) {
      // Save anime to local storage for watchlist
      const existingAnime = localStorage.getItem('anime_cache') || '{}'
      const cache = JSON.parse(existingAnime)
      cache[animeId] = anime
      localStorage.setItem('anime_cache', JSON.stringify(cache))
    }
    addToWatchlist(user.id, animeId, status)
    setWatchlist(getWatchlist(user.id))
  }

  const handleUpdateStatus = (itemId: string, status: WatchStatus) => {
    if (!user) return
    updateWatchlistItem(user.id, itemId, { status })
    setWatchlist(getWatchlist(user.id))
  }

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(g => g !== genreId)
        : [...prev, genreId]
    )
    setSearchQuery('') // Clear search when filtering by genre
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchAnime(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const watchlistItemMap = new Map(watchlist.map(item => [item.animeId, item]))

  const tabConfig = [
    { value: 'top', label: 'Top Rated', icon: TrendingUp },
    { value: 'seasonal', label: 'This Season', icon: Calendar },
    { value: 'upcoming', label: 'Upcoming', icon: Sparkles },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Browse Anime</h1>
        <p className="text-muted-foreground mt-1">
          Discover anime from MyAnimeList database - {pagination.totalItems.toLocaleString()}+ titles
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as typeof activeTab)
        setSearchQuery('')
        setSelectedGenres([])
      }}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search thousands of anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Genres
              {selectedGenres.length > 0 && (
                <Badge variant="default" className="ml-1 h-5 px-1.5">
                  {selectedGenres.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Genre Filters */}
        {showFilters && (
          <div className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filter by Genre</span>
              {selectedGenres.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedGenres([])}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                  {selectedGenres.includes(genre.id) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-muted-foreground">Loading anime...</p>
          </div>
        ) : animeList.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No anime found. Try a different search or filter.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {animeList.length} of {pagination.totalItems.toLocaleString()} anime
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeList.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  watchlistItem={watchlistItemMap.get(anime.id)}
                  onAddToWatchlist={handleAddToWatchlist}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                    let pageNum: number
                    if (pagination.lastPage <= 5) {
                      pageNum = i + 1
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1
                    } else if (pagination.currentPage >= pagination.lastPage - 2) {
                      pageNum = pagination.lastPage - 4 + i
                    } else {
                      pageNum = pagination.currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
