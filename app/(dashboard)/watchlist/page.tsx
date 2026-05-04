'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getWatchlist, updateWatchlistItem, removeFromWatchlist } from '@/lib/store'
import type { WatchlistItem, WatchStatus } from '@/lib/types'
import { AnimeCard } from '@/components/anime-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Play, CheckCircle, Clock, XCircle, Calendar, List, Trash2 } from 'lucide-react'
import Link from 'next/link'

const tabConfig = [
  { value: 'all', label: 'All', icon: List },
  { value: 'watching', label: 'Watching', icon: Play },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
  { value: 'on-hold', label: 'On Hold', icon: Clock },
  { value: 'dropped', label: 'Dropped', icon: XCircle },
  { value: 'plan-to-watch', label: 'Plan to Watch', icon: Calendar },
]

export default function WatchlistPage() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user) {
      setWatchlist(getWatchlist(user.id))
    }
  }, [user])

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
      if (progress >= item.anime.episodes) {
        updates.status = 'completed'
      } else if (progress > 0 && item.status === 'plan-to-watch') {
        updates.status = 'watching'
      }
      updateWatchlistItem(user.id, itemId, updates)
      setWatchlist(getWatchlist(user.id))
    }
  }

  const handleRemove = (itemId: string) => {
    if (!user) return
    removeFromWatchlist(user.id, itemId)
    setWatchlist(getWatchlist(user.id))
  }

  const filteredWatchlist = activeTab === 'all' 
    ? watchlist 
    : watchlist.filter(item => item.status === activeTab)

  const getCounts = () => {
    const counts: Record<string, number> = { all: watchlist.length }
    tabConfig.forEach(tab => {
      if (tab.value !== 'all') {
        counts[tab.value] = watchlist.filter(item => item.status === tab.value).length
      }
    })
    return counts
  }

  const counts = getCounts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your anime collection
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {tabConfig.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="gap-2 data-[state=active]:bg-background"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="text-xs text-muted-foreground">({counts[tab.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredWatchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredWatchlist.map((item) => (
                <div key={item.id} className="group relative">
                  <AnimeCard
                    anime={item.anime}
                    watchlistItem={item}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateProgress={handleUpdateProgress}
                    showProgress
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <List className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>
                  {activeTab === 'all' ? 'Your watchlist is empty' : `No anime ${tabConfig.find(t => t.value === activeTab)?.label.toLowerCase()}`}
                </EmptyTitle>
                <EmptyDescription>
                  {activeTab === 'all' ? 'Start adding anime to track your progress' : 'Anime with this status will appear here'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/browse">Browse Anime</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
