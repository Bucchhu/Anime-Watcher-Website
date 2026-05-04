'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getWatchlist, getRecommendations, addToWatchlist, updateWatchlistItem } from '@/lib/store'
import type { WatchlistItem, Anime, WatchStatus } from '@/lib/types'
import { StatsCards } from '@/components/stats-cards'
import { AnimeCard } from '@/components/anime-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [recommendations, setRecommendations] = useState<Anime[]>([])

  useEffect(() => {
    if (user) {
      setWatchlist(getWatchlist(user.id))
      setRecommendations(getRecommendations(user.id))
    }
  }, [user])

  const handleAddToWatchlist = (animeId: string, status: WatchStatus) => {
    if (!user) return
    const newItem = addToWatchlist(user.id, animeId, status)
    if (newItem) {
      setWatchlist(getWatchlist(user.id))
      setRecommendations(getRecommendations(user.id))
    }
  }

  const handleUpdateStatus = (itemId: string, status: WatchStatus) => {
    if (!user) return
    updateWatchlistItem(user.id, itemId, { status })
    setWatchlist(getWatchlist(user.id))
  }

  const handleUpdateProgress = (itemId: string, progress: number) => {
    if (!user) return
    const item = watchlist.find(i => i.id === itemId)
    if (item) {
      const updates: Partial<WatchlistItem> = { progress }
      // Auto-complete if reached total episodes
      if (progress >= item.anime.episodes) {
        updates.status = 'completed'
      } else if (progress > 0 && item.status === 'plan-to-watch') {
        updates.status = 'watching'
      }
      updateWatchlistItem(user.id, itemId, updates)
      setWatchlist(getWatchlist(user.id))
    }
  }

  const currentlyWatching = watchlist.filter(item => item.status === 'watching')
  const watchlistItemMap = new Map(watchlist.map(item => [item.animeId, item]))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}</h1>
        <p className="text-muted-foreground mt-1">
          {"Here's what's happening with your anime journey"}
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards watchlist={watchlist} />

      {/* Currently Watching */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-watching" />
            <CardTitle className="text-lg">Currently Watching</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/watchlist" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {currentlyWatching.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentlyWatching.slice(0, 5).map((item) => (
                <AnimeCard
                  key={item.id}
                  anime={item.anime}
                  watchlistItem={item}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateProgress={handleUpdateProgress}
                  showProgress
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No anime currently watching</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/browse">Browse anime</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Recommended For You</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recommendations" className="gap-1">
              See more <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                watchlistItem={watchlistItemMap.get(anime.id)}
                onAddToWatchlist={handleAddToWatchlist}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
