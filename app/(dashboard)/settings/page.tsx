'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { downloadExcelFile, submitBugReport } from '@/lib/store'
import { Download, FileSpreadsheet, Bug, FolderOpen, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [bugForm, setBugForm] = useState({
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    description: '',
    steps: '',
    expected: '',
    actual: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    const result = await submitBugReport({
      reportedBy: user.username,
      ...bugForm
    })

    if (result.success) {
      setSubmitted(true)
      setBugForm({
        severity: 'Medium',
        description: '',
        steps: '',
        expected: '',
        actual: ''
      })
      setTimeout(() => setSubmitted(false), 3000)
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your data files and report issues
        </p>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Data Files</TabsTrigger>
          <TabsTrigger value="bugs">Bug Reports</TabsTrigger>
          <TabsTrigger value="corrections">Corrections Folder</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Excel Data Files
              </CardTitle>
              <CardDescription>
                Download your data as Excel (.xlsx) files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">users.xlsx</h3>
                        <p className="text-sm text-muted-foreground">All registered users data</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadExcelFile('users')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">watchlist.xlsx</h3>
                        <p className="text-sm text-muted-foreground">Your watchlist data</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadExcelFile('watchlist')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">anime.xlsx</h3>
                        <p className="text-sm text-muted-foreground">Anime database</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadExcelFile('anime')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">logs.xlsx</h3>
                        <p className="text-sm text-muted-foreground">System activity logs</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadExcelFile('logs')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bugs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-primary" />
                Submit Bug Report
              </CardTitle>
              <CardDescription>
                Found an issue? Report it here and it will be saved to the corrections folder
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold">Bug Report Submitted!</h3>
                  <p className="text-muted-foreground">Thank you for helping improve AniTracker</p>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      value={bugForm.severity}
                      onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => 
                        setBugForm(prev => ({ ...prev, severity: value }))
                      }
                    >
                      <SelectTrigger id="severity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the bug in detail..."
                      value={bugForm.description}
                      onChange={(e) => setBugForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steps">Steps to Reproduce</Label>
                    <Textarea
                      id="steps"
                      placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                      value={bugForm.steps}
                      onChange={(e) => setBugForm(prev => ({ ...prev, steps: e.target.value }))}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected">Expected Behavior</Label>
                      <Textarea
                        id="expected"
                        placeholder="What should happen?"
                        value={bugForm.expected}
                        onChange={(e) => setBugForm(prev => ({ ...prev, expected: e.target.value }))}
                        required
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actual">Actual Behavior</Label>
                      <Textarea
                        id="actual"
                        placeholder="What actually happened?"
                        value={bugForm.actual}
                        onChange={(e) => setBugForm(prev => ({ ...prev, actual: e.target.value }))}
                        required
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Bug Report'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corrections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Corrections Folder Structure
              </CardTitle>
              <CardDescription>
                Overview of the error tracking folder system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 space-y-1">
                <div className="text-foreground">data/</div>
                <div className="text-foreground pl-4">corrections/</div>
                <div className="pl-8 text-muted-foreground">logs.txt <span className="text-xs">(System activity logs)</span></div>
                <div className="text-foreground pl-8">bug-reports/</div>
                <div className="pl-12 text-muted-foreground">README.txt <span className="text-xs">(Bug report template)</span></div>
                <div className="pl-12 text-muted-foreground">bug_001_*.txt <span className="text-xs">(Individual bug reports)</span></div>
                <div className="text-foreground pl-8">fixes/</div>
                <div className="pl-12 text-muted-foreground">README.txt <span className="text-xs">(Fix report template)</span></div>
                <div className="pl-12 text-muted-foreground">fix_001_*.txt <span className="text-xs">(Individual fix reports)</span></div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Log Levels</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-16 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-center text-xs">INFO</span>
                      <span className="text-muted-foreground">General information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-center text-xs">WARN</span>
                      <span className="text-muted-foreground">Warning messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 px-2 py-1 bg-red-500/20 text-red-400 rounded text-center text-xs">ERROR</span>
                      <span className="text-muted-foreground">Error conditions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-center text-xs">DEBUG</span>
                      <span className="text-muted-foreground">Debug information</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
