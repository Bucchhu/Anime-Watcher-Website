import { NextRequest, NextResponse } from 'next/server'

// Jikan API base URL (MyAnimeList unofficial API)
const JIKAN_API = 'https://api.jikan.moe/v4'

// Fallback anime data when API is unavailable
const FALLBACK_ANIME = [
  { id: '1', title: 'Attack on Titan', titleJapanese: 'Shingeki no Kyojin', image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans.', episodes: 87, status: 'finished', rating: 9.0, genres: ['Action', 'Drama', 'Fantasy'], year: 2013, studio: 'Wit Studio' },
  { id: '5', title: 'Fullmetal Alchemist: Brotherhood', titleJapanese: 'Hagane no Renkinjutsushi', image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg', synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong.', episodes: 64, status: 'finished', rating: 9.1, genres: ['Action', 'Adventure', 'Drama'], year: 2009, studio: 'Bones' },
  { id: '21', title: 'One Punch Man', titleJapanese: 'One Punch Man', image: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg', synopsis: 'The story of Saitama, a hero that does it just for fun & can defeat his enemies with a single punch.', episodes: 24, status: 'finished', rating: 8.5, genres: ['Action', 'Comedy'], year: 2015, studio: 'Madhouse' },
  { id: '16498', title: 'Attack on Titan Season 2', titleJapanese: 'Shingeki no Kyojin Season 2', image: 'https://cdn.myanimelist.net/images/anime/4/84177.jpg', synopsis: 'The battle between humanity and the Titans continues.', episodes: 12, status: 'finished', rating: 8.5, genres: ['Action', 'Drama'], year: 2017, studio: 'Wit Studio' },
  { id: '38000', title: 'Demon Slayer', titleJapanese: 'Kimetsu no Yaiba', image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', synopsis: 'A family is attacked by demons and only two members survive.', episodes: 26, status: 'finished', rating: 8.6, genres: ['Action', 'Fantasy'], year: 2019, studio: 'ufotable' },
  { id: '40748', title: 'Jujutsu Kaisen', titleJapanese: 'Jujutsu Kaisen', image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', synopsis: 'A boy swallows a cursed talisman and becomes cursed himself.', episodes: 24, status: 'finished', rating: 8.7, genres: ['Action', 'Supernatural'], year: 2020, studio: 'MAPPA' },
  { id: '21519', title: 'Mob Psycho 100', titleJapanese: 'Mob Psycho 100', image: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg', synopsis: 'A psychic middle school boy tries to live a normal life.', episodes: 12, status: 'finished', rating: 8.6, genres: ['Action', 'Comedy', 'Supernatural'], year: 2016, studio: 'Bones' },
  { id: '31964', title: 'My Hero Academia', titleJapanese: 'Boku no Hero Academia', image: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg', synopsis: 'A boy without powers dreams of becoming a superhero.', episodes: 13, status: 'finished', rating: 8.0, genres: ['Action', 'Comedy'], year: 2016, studio: 'Bones' },
  { id: '1535', title: 'Death Note', titleJapanese: 'Death Note', image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg', synopsis: 'A high school student discovers a supernatural notebook.', episodes: 37, status: 'finished', rating: 8.6, genres: ['Mystery', 'Psychological', 'Thriller'], year: 2006, studio: 'Madhouse' },
  { id: '9253', title: 'Steins;Gate', titleJapanese: 'Steins;Gate', image: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg', synopsis: 'A self-proclaimed mad scientist discovers time travel.', episodes: 24, status: 'finished', rating: 9.1, genres: ['Sci-Fi', 'Thriller', 'Drama'], year: 2011, studio: 'White Fox' },
  { id: '50265', title: 'Spy x Family', titleJapanese: 'Spy x Family', image: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg', synopsis: 'A spy on an undercover mission gets married and adopts a child.', episodes: 12, status: 'finished', rating: 8.5, genres: ['Action', 'Comedy'], year: 2022, studio: 'Wit Studio' },
  { id: '44511', title: 'Chainsaw Man', titleJapanese: 'Chainsaw Man', image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg', synopsis: 'Denji has a simple dream—to live a happy and peaceful life.', episodes: 12, status: 'finished', rating: 8.5, genres: ['Action', 'Fantasy', 'Horror'], year: 2022, studio: 'MAPPA' },
  { id: '37521', title: 'Vinland Saga', titleJapanese: 'Vinland Saga', image: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg', synopsis: 'Thorfinn pursues a journey with his father\'s killer.', episodes: 24, status: 'finished', rating: 8.8, genres: ['Action', 'Adventure', 'Drama'], year: 2019, studio: 'Wit Studio' },
  { id: '30276', title: 'One Punch Man Season 2', titleJapanese: 'One Punch Man 2', image: 'https://cdn.myanimelist.net/images/anime/1247/112670.jpg', synopsis: 'Saitama continues his hero journey.', episodes: 12, status: 'finished', rating: 7.5, genres: ['Action', 'Comedy'], year: 2019, studio: 'J.C.Staff' },
  { id: '5114', title: 'Fullmetal Alchemist: Brotherhood', titleJapanese: 'Hagane no Renkinjutsushi: Fullmetal Alchemist', image: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg', synopsis: 'Edward and Alphonse Elric search for the Philosopher\'s Stone.', episodes: 64, status: 'finished', rating: 9.1, genres: ['Action', 'Adventure', 'Drama', 'Fantasy'], year: 2009, studio: 'Bones' },
  { id: '11061', title: 'Hunter x Hunter (2011)', titleJapanese: 'Hunter x Hunter', image: 'https://cdn.myanimelist.net/images/anime/1337/99013.jpg', synopsis: 'Gon Freecss aspires to become a Hunter.', episodes: 148, status: 'finished', rating: 9.0, genres: ['Action', 'Adventure', 'Fantasy'], year: 2011, studio: 'Madhouse' },
  { id: '28977', title: 'Gintama', titleJapanese: 'Gintama\'', image: 'https://cdn.myanimelist.net/images/anime/4/65539.jpg', synopsis: 'The adventures of Gintoki and his odd jobs continue.', episodes: 51, status: 'finished', rating: 9.0, genres: ['Action', 'Comedy', 'Sci-Fi'], year: 2015, studio: 'Bandai Namco Pictures' },
  { id: '20', title: 'Naruto', titleJapanese: 'Naruto', image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg', synopsis: 'Naruto Uzumaki dreams of becoming the greatest ninja.', episodes: 220, status: 'finished', rating: 8.0, genres: ['Action', 'Adventure'], year: 2002, studio: 'Pierrot' },
  { id: '1735', title: 'Naruto Shippuden', titleJapanese: 'Naruto: Shippuuden', image: 'https://cdn.myanimelist.net/images/anime/1565/111305.jpg', synopsis: 'Naruto continues his journey to become Hokage.', episodes: 500, status: 'finished', rating: 8.3, genres: ['Action', 'Adventure'], year: 2007, studio: 'Pierrot' },
  { id: '21', title: 'One Piece', titleJapanese: 'One Piece', image: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg', synopsis: 'Monkey D. Luffy sets off to become the Pirate King.', episodes: 1100, status: 'airing', rating: 8.7, genres: ['Action', 'Adventure', 'Fantasy'], year: 1999, studio: 'Toei Animation' },
  { id: '269', title: 'Bleach', titleJapanese: 'Bleach', image: 'https://cdn.myanimelist.net/images/anime/3/40451.jpg', synopsis: 'Ichigo Kurosaki becomes a Soul Reaper.', episodes: 366, status: 'finished', rating: 7.9, genres: ['Action', 'Adventure', 'Supernatural'], year: 2004, studio: 'Pierrot' },
  { id: '41467', title: 'Bleach: Thousand-Year Blood War', titleJapanese: 'Bleach: Sennen Kessen-hen', image: 'https://cdn.myanimelist.net/images/anime/1764/126627.jpg', synopsis: 'The final arc of Bleach begins.', episodes: 13, status: 'finished', rating: 9.1, genres: ['Action', 'Adventure', 'Supernatural'], year: 2022, studio: 'Pierrot' },
  { id: '523', title: 'Tonari no Totoro', titleJapanese: 'My Neighbor Totoro', image: 'https://cdn.myanimelist.net/images/anime/4/75923.jpg', synopsis: 'Two sisters discover friendly forest spirits.', episodes: 1, status: 'finished', rating: 8.3, genres: ['Adventure', 'Fantasy', 'Supernatural'], year: 1988, studio: 'Studio Ghibli' },
  { id: '199', title: 'Sen to Chihiro no Kamikakushi', titleJapanese: 'Spirited Away', image: 'https://cdn.myanimelist.net/images/anime/6/79597.jpg', synopsis: 'A girl enters a world of spirits and must save her parents.', episodes: 1, status: 'finished', rating: 8.8, genres: ['Adventure', 'Supernatural', 'Drama'], year: 2001, studio: 'Studio Ghibli' }
]

// Helper function with retry and delay
async function fetchWithRetry(url: string, retries: number = 2): Promise<Response | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }
      })
      
      if (response.status === 429 || response.status === 403) {
        // Rate limited - wait and retry
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
          continue
        }
        return null
      }
      
      if (response.ok) {
        return response
      }
    } catch (error) {
      if (i === retries) return null
    }
  }
  return null
}

// Transform Jikan anime to our format
function transformAnime(jikanAnime: any) {
  return {
    id: String(jikanAnime.mal_id),
    title: jikanAnime.title_english || jikanAnime.title,
    titleJapanese: jikanAnime.title_japanese,
    image: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url || '',
    synopsis: jikanAnime.synopsis || 'No synopsis available.',
    episodes: jikanAnime.episodes || 0,
    status: jikanAnime.status === 'Currently Airing' ? 'airing' : 
            jikanAnime.status === 'Not yet aired' ? 'upcoming' : 'finished',
    rating: jikanAnime.score || 0,
    genres: jikanAnime.genres?.map((g: any) => g.name) || [],
    year: jikanAnime.year || jikanAnime.aired?.prop?.from?.year || 2020,
    studio: jikanAnime.studios?.[0]?.name || 'Unknown Studio'
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action') || 'top'
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  const genre = searchParams.get('genre') || ''
  const limit = searchParams.get('limit') || '25'

  try {
    let url = ''
    
    switch (action) {
      case 'search':
        // Search anime by query
        url = `${JIKAN_API}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true`
        break
      
      case 'top':
        // Get top anime
        url = `${JIKAN_API}/top/anime?page=${page}&limit=${limit}&sfw=true`
        break
      
      case 'seasonal':
        // Get current season anime
        url = `${JIKAN_API}/seasons/now?page=${page}&limit=${limit}&sfw=true`
        break
      
      case 'upcoming':
        // Get upcoming anime
        url = `${JIKAN_API}/seasons/upcoming?page=${page}&limit=${limit}&sfw=true`
        break
      
      case 'genre':
        // Get anime by genre
        url = `${JIKAN_API}/anime?genres=${genre}&page=${page}&limit=${limit}&sfw=true&order_by=score&sort=desc`
        break
      
      case 'recommendations':
        // Get random top anime for recommendations
        url = `${JIKAN_API}/top/anime?page=${Math.floor(Math.random() * 5) + 1}&limit=${limit}&sfw=true`
        break
      
      case 'details':
        // Get single anime details
        const animeId = searchParams.get('id')
        if (!animeId) {
          return NextResponse.json({ error: 'Anime ID required' }, { status: 400 })
        }
        url = `${JIKAN_API}/anime/${animeId}/full`
        break
      
      default:
        url = `${JIKAN_API}/top/anime?page=${page}&limit=${limit}&sfw=true`
    }

    const response = await fetchWithRetry(url)

    // If API is unavailable, return fallback data
    if (!response) {
      console.log('Jikan API unavailable, using fallback data')
      const shuffled = [...FALLBACK_ANIME].sort(() => Math.random() - 0.5)
      const pageSize = parseInt(limit)
      const pageNum = parseInt(page)
      const startIdx = (pageNum - 1) * pageSize
      const paginatedData = shuffled.slice(startIdx, startIdx + pageSize)
      
      return NextResponse.json({
        success: true,
        anime: paginatedData,
        pagination: {
          currentPage: pageNum,
          lastPage: Math.ceil(FALLBACK_ANIME.length / pageSize),
          hasNextPage: startIdx + pageSize < FALLBACK_ANIME.length,
          totalItems: FALLBACK_ANIME.length
        },
        source: 'fallback'
      })
    }

    const data = await response.json()

    // Transform the data
    if (action === 'details') {
      return NextResponse.json({
        success: true,
        anime: transformAnime(data.data)
      })
    }

    const animeList = data.data.map(transformAnime)
    
    return NextResponse.json({
      success: true,
      anime: animeList,
      pagination: {
        currentPage: data.pagination?.current_page || 1,
        lastPage: data.pagination?.last_visible_page || 1,
        hasNextPage: data.pagination?.has_next_page || false,
        totalItems: data.pagination?.items?.total || animeList.length
      }
    })

  } catch (error) {
    console.error('Anime API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch anime data' },
      { status: 500 }
    )
  }
}
