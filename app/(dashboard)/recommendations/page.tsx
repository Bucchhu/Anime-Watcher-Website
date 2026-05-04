'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getRecommendations, getWatchlist, addToWatchlist, updateWatchlistItem, logToFile } from '@/lib/store'
import type { Anime, WatchlistItem, WatchStatus } from '@/lib/types'
import { AnimeCard } from '@/components/anime-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Sparkles, Brain, TrendingUp, Zap, RefreshCw, Globe } from 'lucide-react'

export default function RecommendationsPage() {
  const { user } = useAuth()
  const [localRecommendations, setLocalRecommendations] = useState<Anime[]>([])
  const [apiRecommendations, setApiRecommendations] = useState<Anime[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch recommendations from API
  const fetchApiRecommendations = useCallback(async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/anime?action=recommendations&limit=12')
      const data = await response.json()
      
      if (data.success) {
        // Filter out anime already in watchlist
        const watchedIds = new Set(watchlist.map(item => item.animeId))
        const filtered = data.anime.filter((a: Anime) => !watchedIds.has(a.id))
        setApiRecommendations(filtered.slice(0, 6))
        logToFile('INFO', 'RECOMMENDATIONS', `Fetched ${filtered.length} API recommendations`, user?.id)
      }
    } catch (error) {
      console.error('Failed to fetch API recommendations:', error)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [watchlist, user?.id])

  useEffect(() => {
    if (user) {
      setWatchlist(getWatchlist(user.id))
      setLocalRecommendations(getRecommendations(user.id))
    }
  }, [user])

  useEffect(() => {
    fetchApiRecommendations()
  }, [fetchApiRecommendations])

  const handleAddToWatchlist = (animeId: string, status: WatchStatus) => {
    if (!user) return
    
    // Check both local and API recommendations for the anime
    const anime = [...localRecommendations, ...apiRecommendations].find(a => a.id === animeId)
    if (anime) {
      // Cache the anime
      const cacheStr = localStorage.getItem('anime_cache') || '{}'
      const cache = JSON.parse(cacheStr)
      cache[animeId] = anime
      localStorage.setItem('anime_cache', JSON.stringify(cache))
    }
    
    addToWatchlist(user.id, animeId, status)
    setWatchlist(getWatchlist(user.id))
    setLocalRecommendations(getRecommendations(user.id))
    
    // Remove from API recommendations
    setApiRecommendations(prev => prev.filter(a => a.id !== animeId))
  }

  const handleUpdateStatus = (itemId: string, status: WatchStatus) => {
    if (!user) return
    updateWatchlistItem(user.id, itemId, { status })
    setWatchlist(getWatchlist(user.id))
  }

  const watchlistItemMap = new Map(watchlist.map(item => [item.animeId, item]))

  // Calculate user's top genres for display
  const genreAnalysis = watchlist.reduce((acc, item) => {
    item.anime.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const topGenres = Object.entries(genreAnalysis)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Recommended For You</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered suggestions based on your watch history and MyAnimeList data
        </p>
      </div>

      {/* AI Analysis Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Your Anime Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Top Genres</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {topGenres.length > 0 ? (
                  topGenres.map((genre) => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Add anime to see your preferences
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Recommendation Engine</span>
              </div>
              <p className="text-sm">
                {watchlist.length > 0 
                  ? `Analyzing ${watchlist.length} anime in your watchlist to find similar titles`
                  : 'Showing top-rated anime from MyAnimeList to get you started'
                }
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>How It Works</span>
              </div>
              <p className="text-sm">
                Combines your ratings, completion status, and genre preferences with MAL data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      ) : (
        <>
          {/* Local Recommendations (based on user watchlist) */}
          {localRecommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Based on Your Watchlist</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {localRecommendations.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    watchlistItem={watchlistItemMap.get(anime.id)}
                    onAddToWatchlist={handleAddToWatchlist}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* API Recommendations (from MyAnimeList) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Trending on MyAnimeList</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchApiRecommendations}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {apiRecommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {apiRecommendations.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    anime={anime}
                    watchlistItem={watchlistItemMap.get(anime.id)}
                    onAddToWatchlist={handleAddToWatchlist}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    All trending anime are in your watchlist! Click refresh for more.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {localRecommendations.length === 0 && apiRecommendations.length === 0 && !loading && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Looking for more recommendations?</h3>
            <p className="text-muted-foreground mb-4">
              Add more anime to your watchlist or click refresh for new suggestions!
            </p>
            <Button onClick={fetchApiRecommendations} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Get New Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
