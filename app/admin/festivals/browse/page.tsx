'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Globe, Download, Search, CheckSquare, Square } from 'lucide-react'
import Link from 'next/link'

interface FestivalStub {
  url: string
  dateText: string
  name: string
  city: string
  country: string
  startDate: string
  locationRaw: string
}

export default function BrowseBachataWorldPage() {
  const router = useRouter()
  const [festivals, setFestivals] = useState<FestivalStub[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')

  useEffect(() => {
    fetch('/api/admin/browse-bachataworld', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setFestivals(data)
        else toast.error(data.error || 'Failed to load festivals')
      })
      .catch(() => toast.error('Could not reach BachataWorld'))
      .finally(() => setIsLoading(false))
  }, [])

  const countries = useMemo(() => {
    const set = new Set(festivals.map(f => f.country).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [festivals])

  const filtered = useMemo(() => {
    return festivals.filter(f => {
      const matchCountry = countryFilter === 'all' || f.country === countryFilter
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.city.toLowerCase().includes(search.toLowerCase())
      return matchCountry && matchSearch
    })
  }, [festivals, countryFilter, search])

  const toggle = (url: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url); else next.add(url)
      return next
    })
  }

  const toggleAll = () => {
    if (filtered.every(f => selected.has(f.url))) {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(f => next.delete(f.url)); return next })
    } else {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(f => next.add(f.url)); return next })
    }
  }

  const handleImport = async () => {
    if (selected.size === 0) return
    setIsImporting(true)
    try {
      const urls = Array.from(selected)
      // Import in batches of 10 (Firestore 'in' query limit)
      let totalImported = 0, totalSkipped = 0, totalErrors = 0
      for (let i = 0; i < urls.length; i += 10) {
        const batch = urls.slice(i, i + 10)
        const res = await fetch('/api/admin/import-bachataworld', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ urls: batch }),
        })
        const data = await res.json()
        if (!res.ok) { toast.error(data.error || 'Import failed'); break }
        totalImported += data.imported || 0
        totalSkipped += data.skipped || 0
        totalErrors += data.errors || 0
      }
      toast.success(`Imported ${totalImported} festival${totalImported !== 1 ? 's' : ''}${totalSkipped ? `, ${totalSkipped} already existed` : ''}${totalErrors ? `, ${totalErrors} failed` : ''}`)
      setSelected(new Set())
      if (totalImported > 0) {
        setTimeout(() => router.push('/admin/dashboard?tab=festivals'), 1500)
      }
    } catch {
      toast.error('Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every(f => selected.has(f.url))

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold leading-tight">Browse BachataWorld Festivals</h1>
              <p className="text-xs text-gray-500">Source: bachataworld.com · {festivals.length} festivals found</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
              <span className="text-3xl font-bold text-purple-600">{festivals.length}</span>
              <span className="text-sm text-gray-500 leading-tight">festivals<br />available</span>
            </div>
            {(search || countryFilter !== 'all') && (
              <div className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
                <span className="text-3xl font-bold text-indigo-500">{filtered.length}</span>
                <span className="text-sm text-gray-500 leading-tight">matching<br />filters</span>
              </div>
            )}
            {selected.size > 0 && (
              <div className="bg-purple-50 rounded-xl shadow-sm px-5 py-3 flex items-center gap-3">
                <span className="text-3xl font-bold text-purple-700">{selected.size}</span>
                <span className="text-sm text-purple-600 leading-tight">selected<br />to import</span>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search name or city…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
            </div>
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            >
              {countries.map(c => <option key={c} value={c}>{c === 'all' ? 'All Countries' : c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500">{selected.size} selected</span>
            <Button
              onClick={handleImport}
              disabled={selected.size === 0 || isImporting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Download className="h-4 w-4 mr-1" />}
              {isImporting ? 'Importing…' : `Import ${selected.size > 0 ? selected.size : ''}`}
            </Button>
          </div>
        </div>

        {/* Festival list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading BachataWorld festivals…
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Select all header */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100"
              onClick={toggleAll}
            >
              {allFilteredSelected
                ? <CheckSquare className="h-4 w-4 text-purple-600 shrink-0" />
                : <Square className="h-4 w-4 text-gray-400 shrink-0" />}
              <span className="text-xs font-medium text-gray-600">
                {allFilteredSelected ? 'Deselect all' : `Select all ${filtered.length} visible`}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No festivals match your filter</div>
            ) : (
              filtered.map(f => (
                <div
                  key={f.url}
                  onClick={() => toggle(f.url)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selected.has(f.url) ? 'bg-purple-50' : ''}`}
                >
                  {selected.has(f.url)
                    ? <CheckSquare className="h-4 w-4 text-purple-600 shrink-0" />
                    : <Square className="h-4 w-4 text-gray-300 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.city}{f.city && f.country ? ', ' : ''}{f.country}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-600 font-medium">{f.dateText}</p>
                    <p className="text-xs text-gray-400">{f.startDate?.slice(0, 4)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Data sourced from{' '}
          <a href="https://www.bachataworld.com/festivals" target="_blank" rel="noopener" className="underline">bachataworld.com</a>
          {' '}— always verify event details before promoting.
        </p>
      </div>
    </div>
  )
}
