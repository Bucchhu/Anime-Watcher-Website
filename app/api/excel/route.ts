import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import {
  createInitialUsersWorkbook,
  createInitialWatchlistWorkbook,
  createInitialAnimeWorkbook,
  createInitialLogsWorkbook,
  workbookToBase64
} from '@/lib/excel-service'

// GET - Download Excel files or get initial data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fileType = searchParams.get('type') // users, watchlist, anime, logs
  const format = searchParams.get('format') // base64 or download

  let workbook: XLSX.WorkBook

  switch (fileType) {
    case 'users':
      workbook = createInitialUsersWorkbook()
      break
    case 'watchlist':
      workbook = createInitialWatchlistWorkbook()
      break
    case 'anime':
      workbook = createInitialAnimeWorkbook()
      break
    case 'logs':
      workbook = createInitialLogsWorkbook()
      break
    default:
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  if (format === 'download') {
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileType}.xlsx"`
      }
    })
  }

  // Return as base64 for client-side processing
  const base64 = workbookToBase64(workbook)
  return NextResponse.json({ data: base64, type: fileType })
}
