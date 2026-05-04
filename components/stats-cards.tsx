'use client'

import type { WatchlistItem } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Play, CheckCircle, Clock, XCircle, Calendar, Film, Star, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  watchlist: WatchlistItem[]
}

export function StatsCards({ watchlist }: StatsCardsProps) {
  const stats = {
    watching: watchlist.filter(item => item.status === 'watching').length,
    completed: watchlist.filter(item => item.status === 'completed').length,
    onHold: watchlist.filter(item => item.status === 'on-hold').length,
    dropped: watchlist.filter(item => item.status === 'dropped').length,
    planToWatch: watchlist.filter(item => item.status === 'plan-to-watch').length,
    totalEpisodes: watchlist.reduce((sum, item) => sum + item.progress, 0),
    totalAnime: watchlist.length,
    averageScore: watchlist.filter(item => item.score).length > 0
      ? watchlist.filter(item => item.score).reduce((sum, item) => sum + (item.score || 0), 0) / 
        watchlist.filter(item => item.score).length
      : 0
  }

  const statItems = [
    { label: 'Watching', value: stats.watching, icon: Play, color: 'text-watching bg-watching/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-completed bg-completed/10' },
    { label: 'On Hold', value: stats.onHold, icon: Clock, color: 'text-on-hold bg-on-hold/10' },
    { label: 'Dropped', value: stats.dropped, icon: XCircle, color: 'text-dropped bg-dropped/10' },
    { label: 'Plan to Watch', value: stats.planToWatch, icon: Calendar, color: 'text-plan-to-watch bg-plan-to-watch/10' },
    { label: 'Total Anime', value: stats.totalAnime, icon: Film, color: 'text-primary bg-primary/10' },
    { label: 'Episodes Watched', value: stats.totalEpisodes, icon: TrendingUp, color: 'text-accent bg-accent/10' },
    { label: 'Average Score', value: stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '-', icon: Star, color: 'text-chart-3 bg-chart-3/10' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
