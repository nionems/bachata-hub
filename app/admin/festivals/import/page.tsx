'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DANCE_STYLES, AUSTRALIAN_STATES } from '@/lib/constants'
import { toast } from 'sonner'
import { Loader2, Search, ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FestivalDraft {
  name: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  location: string
  country: string
  eventLink: string
  ticketLink: string
  danceStyles: string[]
  ambassadorCode: string
  googleMapLink: string
}

const EMPTY: FestivalDraft = {
  name: '', description: '', imageUrl: '', startDate: '', endDate: '',
  location: '', country: '', eventLink: '', ticketLink: '',
  danceStyles: ['Bachata'], ambassadorCode: '', googleMapLink: '',
}

export default function ImportFestivalPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draft, setDraft] = useState<FestivalDraft | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const handleScrape = async () => {
    if (!url.trim()) return
    setIsScraping(true)
    setDraft(null)
    setImagePreview('')
    try {
      const res = await fetch('/api/admin/scrape-festival', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Scrape failed'); return }
      setDraft({ ...EMPTY, ...data })
      setImagePreview(data.imageUrl || '')
      toast.success('Details extracted — review and save')
    } catch {
      toast.error('Could not reach the URL')
    } finally {
      setIsScraping(false)
    }
  }

  const set = (field: keyof FestivalDraft, value: any) =>
    setDraft(prev => prev ? { ...prev, [field]: value } : prev)

  const toggleStyle = (style: string) => {
    if (!draft) return
    const cur = draft.danceStyles
    set('danceStyles', cur.includes(style) ? cur.filter(s => s !== style) : [...cur, style])
  }

  const handleSave = async () => {
    if (!draft) return
    if (!draft.name) { toast.error('Festival name is required'); return }
    setIsSaving(true)
    try {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...draft,
          state: 'N/A',
          featured: 'no',
          published: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Save failed'); return }
      toast.success(`${draft.name} added!`)
      router.push('/admin/dashboard')
    } catch {
      toast.error('Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Import International Festival</h1>
          </div>
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Paste the festival's website URL and we'll extract the details automatically.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://example-festival.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScrape()}
              className="flex-1"
            />
            <Button onClick={handleScrape} disabled={isScraping || !url.trim()}>
              {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {isScraping ? 'Analyzing…' : 'Analyze'}
            </Button>
          </div>
        </div>

        {/* Draft Form */}
        {draft && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800">Review & Edit Details</h2>

            {/* Image preview */}
            {imagePreview && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                <Image src={imagePreview} alt="Preview" fill className="object-contain" unoptimized />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Image URL</label>
              <Input value={draft.imageUrl} onChange={e => { set('imageUrl', e.target.value); setImagePreview(e.target.value) }} className="mt-1" placeholder="https://…" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Festival Name *</label>
              <Input value={draft.name} onChange={e => set('name', e.target.value)} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input type="date" value={draft.startDate} onChange={e => set('startDate', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input type="date" value={draft.endDate} onChange={e => set('endDate', e.target.value)} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Location / City</label>
                <Input value={draft.location} onChange={e => set('location', e.target.value)} className="mt-1" placeholder="e.g. Barcelona" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <Input value={draft.country} onChange={e => set('country', e.target.value)} className="mt-1" placeholder="e.g. Spain" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={draft.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Event Website</label>
                <Input value={draft.eventLink} onChange={e => set('eventLink', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ticket Link</label>
                <Input value={draft.ticketLink} onChange={e => set('ticketLink', e.target.value)} className="mt-1" placeholder="https://tickets…" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Ambassador Code</label>
              <Input value={draft.ambassadorCode} onChange={e => set('ambassadorCode', e.target.value)} className="mt-1" placeholder="Optional discount code" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Dance Styles</label>
              <div className="flex flex-wrap gap-2">
                {DANCE_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${draft.danceStyles.includes(style) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-primary'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isSaving ? 'Saving…' : 'Save Festival'}
              </Button>
              <Button variant="outline" onClick={() => setDraft(null)}>Reset</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
