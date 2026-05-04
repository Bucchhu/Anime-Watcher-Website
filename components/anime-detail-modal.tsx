'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Anime, WatchlistItem, WatchStatus, StreamingPlatform } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Star, 
  Plus, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  ExternalLink,
  Tv,
  Youtube
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<WatchStatus, { label: string; color: string; icon: typeof Play }> = {
  'watching': { label: 'Watching', color: 'bg-watching text-watching-foreground', icon: Play },
  'completed': { label: 'Completed', color: 'bg-completed text-completed-foreground', icon: CheckCircle },
  'on-hold': { label: 'On Hold', color: 'bg-on-hold text-on-hold-foreground', icon: Clock },
  'dropped': { label: 'Dropped', color: 'bg-dropped text-dropped-foreground', icon: XCircle },
  'plan-to-watch': { label: 'Plan to Watch', color: 'bg-plan-to-watch text-plan-to-watch-foreground', icon: Calendar },
}

// Platform icons and colors
const platformStyles: Record<string, { bg: string; text: string }> = {
  crunchyroll: { bg: 'bg-[#F47521]', text: 'text-white' },
  netflix: { bg: 'bg-[#E50914]', text: 'text-white' },
  prime: { bg: 'bg-[#00A8E1]', text: 'text-white' },
  hulu: { bg: 'bg-[#1CE783]', text: 'text-black' },
  funimation: { bg: 'bg-[#5B0BB5]', text: 'text-white' },
  hidive: { bg: 'bg-[#00BAFF]', text: 'text-white' },
  disney: { bg: 'bg-[#113CCF]', text: 'text-white' },
  default: { bg: 'bg-muted', text: 'text-foreground' },
}

interface AnimeDetailModalProps {
  anime: Anime | null
  open: boolean
  onOpenChange: (open: boolean) => void
  watchlistItem?: WatchlistItem
  onAddToWatchlist?: (animeId: string, status: WatchStatus) => void
  onUpdateStatus?: (itemId: string, status: WatchStatus) => void
  onUpdateProgress?: (itemId: string, progress: number) => void
}

export function AnimeDetailModal({
  anime,
  open,
  onOpenChange,
  watchlistItem,
  onAddToWatchlist,
  onUpdateStatus,
  onUpdateProgress,
}: AnimeDetailModalProps) {
  const [showTrailer, setShowTrailer] = useState(false)

  if (!anime) return null

  const progress = watchlistItem ? (watchlistItem.progress / anime.episodes) * 100 : 0

  // Extract YouTube video ID from URL
  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const youtubeId = anime.trailerUrl ? getYoutubeId(anime.trailerUrl) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with backdrop */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          
          {/* Anime poster */}
          <div className="absolute bottom-4 left-4 flex items-end gap-4">
            <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden border-2 border-background shadow-xl">
              <Image
                src={anime.image}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="pb-2">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-balance">
                  {anime.title}
                </DialogTitle>
              </DialogHeader>
              {anime.titleJapanese && (
                <p className="text-sm text-muted-foreground">{anime.titleJapanese}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-background/80 rounded px-2 py-0.5">
                  <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
                  <span className="font-medium">{anime.rating.toFixed(1)}</span>
                </div>
                <Badge variant="secondary">{anime.year}</Badge>
                <Badge variant="secondary">{anime.episodes} eps</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {watchlistItem ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
                    {(() => {
                      const config = statusConfig[watchlistItem.status]
                      const IconComponent = config.icon
                      return <IconComponent className="h-4 w-4" />
                    })()}
                    {statusConfig[watchlistItem.status].label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(Object.keys(statusConfig) as WatchStatus[]).map((status) => {
                    const config = statusConfig[status]
                    return (
                      <DropdownMenuItem 
                        key={status}
                        onClick={() => onUpdateStatus?.(watchlistItem.id, status)}
                        className={cn(watchlistItem.status === status && 'bg-accent')}
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
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add to Watchlist
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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

            {youtubeId && (
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowTrailer(!showTrailer)}
              >
                <Youtube className="h-4 w-4" />
                {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
              </Button>
            )}
          </div>

          {/* YouTube Trailer */}
          {showTrailer && youtubeId && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={`${anime.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* Progress (if in watchlist) */}
          {watchlistItem && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateProgress?.(watchlistItem.id, Math.max(0, watchlistItem.progress - 1))}
                    disabled={watchlistItem.progress <= 0}
                  >
                    -
                  </Button>
                  <span className="font-medium min-w-[5rem] text-center">
                    {watchlistItem.progress} / {anime.episodes}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateProgress?.(watchlistItem.id, Math.min(anime.episodes, watchlistItem.progress + 1))}
                    disabled={watchlistItem.progress >= anime.episodes}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Synopsis */}
          <div>
            <h3 className="font-semibold mb-2">Synopsis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {anime.synopsis || 'No synopsis available.'}
            </p>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Where to Watch */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Tv className="h-4 w-4" />
              Where to Watch
            </h3>
            {anime.streamingPlatforms && anime.streamingPlatforms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {anime.streamingPlatforms.map((platform) => {
                  const style = platformStyles[platform.icon] || platformStyles.default
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center justify-between gap-2 px-4 py-3 rounded-lg transition-opacity hover:opacity-80',
                        style.bg,
                        style.text
                      )}
                    >
                      <span className="font-medium text-sm">{platform.name}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Default streaming platforms with search links */}
                <a
                  href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#F47521] text-white transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">Crunchyroll</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.netflix.com/search?q=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#E50914] text-white transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">Netflix</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.primevideo.com/search?phrase=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#00A8E1] text-white transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">Prime Video</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.hulu.com/search?q=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#1CE783] text-black transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">Hulu</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.hidive.com/search?q=${encodeURIComponent(anime.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#00BAFF] text-white transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">HIDIVE</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title + ' anime')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#FF0000] text-white transition-opacity hover:opacity-80"
                >
                  <span className="font-medium text-sm">YouTube</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Click any platform to search for this anime. Availability may vary by region.
            </p>
          </div>

          {/* Studio and other info */}
          {anime.studio && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
              <span><strong>Studio:</strong> {anime.studio}</span>
              <span><strong>Status:</strong> {anime.status === 'airing' ? 'Currently Airing' : anime.status === 'finished' ? 'Finished' : 'Upcoming'}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
