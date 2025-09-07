import { useEffect, useMemo, useState } from 'react'
import './index.css'
import type { Guest } from './types'

function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  useEffect(() => {
    fetch('/api/guests')
      .then(r => r.json())
      .then(data => setGuests(data.guests || []))
      .catch(() => setGuests([]))
  }, [])
  return guests
}

function normalize(s: string) {
  return (s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function buildGifSrc(guest: Guest | null): string {
  const name = (guest?.gif_name || '').trim()
  const file = name.length > 0 ? name : 'default.gif'
  return '/' + file
}

export default function App() {
  const guests = useGuests()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [showGif, setShowGif] = useState(false)

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return [] as Guest[]
    return guests
      .filter(g => normalize(g.nom).includes(q) || normalize(g.prenom).includes(q))
      .slice(0, 10)
  }, [guests, query])

  function onPick(guest: Guest) {
    setSelected(guest)
    setShowGif(true)
    const durationMs = 2500
    setTimeout(() => setShowGif(false), durationMs)
  }

  const gifSrc = buildGifSrc(selected)
  const tableLabel = selected?.nom_table ? `Table ${selected.nom_table}` : (selected ? `Table ${selected.table}` : '')

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Retrouvez votre table</h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            placeholder="Tapez votre prénom ou nom"
            className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {!!results.length && !selected && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow max-h-64 overflow-auto">
              {results.map((g, idx) => (
                <li
                  key={`${g.nom}-${g.prenom}-${idx}`}
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                  onClick={() => onPick(g)}
                >
                  {g.prenom} {g.nom}
                </li>
              ))}
            </ul>
          )}
        </div>

        {showGif && selected && (
          <div className="mt-8 flex justify-center">
            <img
              src={gifSrc}
              alt="Celebration"
              className="w-full max-w-md rounded-lg shadow"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default.gif' }}
            />
          </div>
        )}

        {!showGif && selected && (
          <div className="mt-10 text-center">
            <p className="text-lg">Invité:</p>
            <p className="text-2xl font-bold">{selected.prenom} {selected.nom}</p>
            <p className="mt-4 text-3xl font-extrabold text-indigo-600">{tableLabel}</p>
          </div>
        )}
      </div>
    </div>
  )
}