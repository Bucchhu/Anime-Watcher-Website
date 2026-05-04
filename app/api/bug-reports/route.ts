import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const BUG_REPORTS_DIR = path.join(process.cwd(), 'data', 'corrections', 'bug-reports')

// GET - List all bug reports
export async function GET() {
  try {
    const files = await fs.readdir(BUG_REPORTS_DIR)
    const bugReports = files.filter(f => f.startsWith('bug_') && f.endsWith('.txt'))
    
    const reports = await Promise.all(
      bugReports.map(async (filename) => {
        const content = await fs.readFile(path.join(BUG_REPORTS_DIR, filename), 'utf-8')
        return { filename, content }
      })
    )
    
    return NextResponse.json({ reports })
  } catch {
    return NextResponse.json({ reports: [] })
  }
}

// POST - Create new bug report
export async function POST(request: NextRequest) {
  try {
    const { reportedBy, severity, description, steps, expected, actual } = await request.json()
    
    // Generate bug ID
    const files = await fs.readdir(BUG_REPORTS_DIR)
    const bugFiles = files.filter(f => f.startsWith('bug_'))
    const bugId = `BUG-${String(bugFiles.length + 1).padStart(3, '0')}`
    
    const date = new Date().toISOString().split('T')[0]
    const filename = `bug_${String(bugFiles.length + 1).padStart(3, '0')}_${date}.txt`
    
    const content = `Bug ID: ${bugId}
Reported By: ${reportedBy}
Date: ${date}
Severity: ${severity}
Status: Open

Description:
${description}

Steps to Reproduce:
${steps}

Expected Behavior:
${expected}

Actual Behavior:
${actual}

Screenshots/Logs:
None provided
`
    
    await fs.writeFile(path.join(BUG_REPORTS_DIR, filename), content)
    
    return NextResponse.json({ success: true, bugId, filename })
  } catch (error) {
    console.error('Failed to create bug report:', error)
    return NextResponse.json({ error: 'Failed to create bug report' }, { status: 500 })
  }
}
