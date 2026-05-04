'use client'

import Image from 'next/image'
import type { Anime, WatchlistItem, WatchStatus } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Star, Plus, ChevronDown, Play, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<WatchStatus, { label: string; color: string; icon: typeof Play }> = {
  'watching': { label: 'Watching', color: 'bg-watching text-watching-foreground', icon: Play },
  'completed': { label: 'Completed', color: 'bg-completed text-completed-foreground', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'bg-on-hold text-on-hold-foreground', icon: Clock },
  'dropped': { label: 'Dropped', color: 'bg-dropped text-dropped-foreground', icon: XCircle },
  'plan-to-watch': { label: 'Plan to Watch', color: 'bg-plan-to-watch text-plan-to-watch-foreground', icon: Calendar },
}

interface AnimeCardProps {
  anime: Anime
  watchlistItem?: WatchlistItem
  onAddToWatchlist?: (animeId: string, status: WatchStatus) => void
  onUpdateStatus?: (itemId: string, status: WatchStatus) => void
  onUpdateProgress?: (itemId: string, progress: number) => void
  showProgress?: boolean
  onClick?: () => void
}

export function AnimeCard({ 
  anime, 
  watchlistItem,
  onAddToWatchlist,
  onUpdateStatus,
  onUpdateProgress,
  showProgress = false,
  onClick
}: AnimeCardProps) {
  const progress = watchlistItem ? (watchlistItem.progress / anime.episodes) * 100 : 0

  return (
    <Card 
      className="group overflow-hidden border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={anime.image}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1">
          <Star className="h-3 w-3 fill-chart-3 text-chart-3" />
          <span className="text-xs font-medium">{anime.rating.toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        {watchlistItem && (
          <Badge 
            className={cn(
              'absolute top-2 right-2 text-xs',
              statusConfig[watchlistItem.status].color
            )}
          >
            {statusConfig[watchlistItem.status].label}
          </Badge>
        )}

        {/* Quick Add/Status Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {watchlistItem ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="secondary" className="h-8 gap-1">
                  {statusConfig[watchlistItem.status].label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(statusConfig) as WatchStatus[]).map((status) => {
                  const config = statusConfig[status]
                  return (
                    <DropdownMenuItem 
                      key={status}
                      onClick={() => onUpdateStatus?.(watchlistItem.id, status)}
                      className={cn(
                        watchlistItem.status === status && 'bg-accent'
                      )}
                    >
                      <config.icon className="mr-2 h-4 w-4" />
                      {config.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(statusConfig) as WatchStatus[]).map((status) => {
                  const config = statusConfig[status]
                  return (
                    <DropdownMenuItem 
                      key={status}
                      onClick={() => onAddToWatchlist?.(anime.id, status)}
                    >
                      <config.icon className="mr-2 h-4 w-4" />
                      {config.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] text-balance">
          {anime.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{anime.year}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{anime.episodes} eps</span>
        </div>

        {/* Progress Bar */}
        {showProgress && watchlistItem && (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateProgress?.(watchlistItem.id, Math.max(0, watchlistItem.progress - 1))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={watchlistItem.progress <= 0}
                >
                  -
                </button>
                <span className="font-medium min-w-[4rem] text-center">
                  {watchlistItem.progress} / {anime.episodes}
                </span>
                <button
                  onClick={() => onUpdateProgress?.(watchlistItem.id, Math.min(anime.episodes, watchlistItem.progress + 1))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={watchlistItem.progress >= anime.episodes}
                >
                  +
                </button>
              </div>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mt-3">
          {anime.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
