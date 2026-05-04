import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LOGS_FILE = path.join(process.cwd(), 'data', 'corrections', 'logs.txt')

// GET - Read logs
export async function GET() {
  try {
    const content = await fs.readFile(LOGS_FILE, 'utf-8')
    return NextResponse.json({ logs: content })
  } catch {
    return NextResponse.json({ logs: '' })
  }
}

// POST - Add new log entry
export async function POST(request: NextRequest) {
  try {
    const { level, module, message, userId } = await request.json()
    
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]
    const userPart = userId ? ` [User: ${userId}]` : ''
    const logEntry = `[${timestamp}] [${level}] [${module}]${userPart} - ${message}\n`
    
    await fs.appendFile(LOGS_FILE, logEntry)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to write log:', error)
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 })
  }
}
