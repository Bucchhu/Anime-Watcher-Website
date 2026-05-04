import { NextResponse } from 'next/server'

// Jikan API base URL
const JIKAN_API = 'https://api.jikan.moe/v4'

export async function GET() {
  try {
    const response = await fetch(`${JIKAN_API}/genres/anime`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Filter to get main genres (not themes or demographics)
    const genres = data.data
      .filter((g: any) => g.count > 1000) // Only popular genres
      .map((g: any) => ({
        id: g.mal_id,
        name: g.name,
        count: g.count
      }))
      .sort((a: any, b: any) => b.count - a.count)

    return NextResponse.json({
      success: true,
      genres
    })

  } catch (error) {
    console.error('Genres API error:', error)
    // Return default genres on error
    return NextResponse.json({
      success: true,
      genres: [
        { id: 1, name: 'Action', count: 5000 },
        { id: 2, name: 'Adventure', count: 4000 },
        { id: 4, name: 'Comedy', count: 7000 },
        { id: 8, name: 'Drama', count: 3000 },
        { id: 10, name: 'Fantasy', count: 4500 },
        { id: 14, name: 'Horror', count: 1000 },
        { id: 7, name: 'Mystery', count: 1500 },
        { id: 22, name: 'Romance', count: 3500 },
        { id: 24, name: 'Sci-Fi', count: 2500 },
        { id: 36, name: 'Slice of Life', count: 2000 },
        { id: 30, name: 'Sports', count: 1200 },
        { id: 37, name: 'Supernatural', count: 2800 },
        { id: 41, name: 'Thriller', count: 800 }
      ]
    })
  }
}
