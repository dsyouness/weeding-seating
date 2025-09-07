import { useEffect, useMemo, useRef, useState } from 'react'
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
  const inputRef = useRef<HTMLInputElement | null>(null)

  const results = useMemo(() => {
    const q = normalize(query)
    if (!q) return [] as Guest[]
    return guests
      .filter(g => normalize(g.nom).includes(q) || normalize(g.prenom).includes(q))
      .slice(0, 8)
  }, [guests, query])

  function onPick(guest: Guest) {
    setSelected(guest)
    setShowGif(true)
    const durationMs = 2500
    setTimeout(() => setShowGif(false), durationMs)
  }

  function backToSearch() {
    setSelected(null)
    setShowGif(false)
    setQuery('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const gifSrc = buildGifSrc(selected)
  const tableLabel = selected?.nom_table ? `${selected.nom_table}` : (selected ? `${selected.table}` : '')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight">
          Retrouvez votre table
        </h1>

        {/* Barre de recherche centrée et courte */}
        {!selected && (
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-sm mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tapez votre prénom ou nom"
                className="w-full rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg px-6 py-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-transparent placeholder-gray-400 mx-auto block"
              />
              {!!results.length && (
                <ul className="absolute left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
                  {results.map((g, idx) => (
                    <li
                      key={`${g.nom}-${g.prenom}-${idx}`}
                      className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-gray-800"
                      onClick={() => onPick(g)}
                    >
                      <span className="font-medium">{g.prenom} {g.nom}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Zone d'affichage GIF avec ratio et centrage */}
        {showGif && selected && (
          <div className="mt-8">
            <div className="mx-auto w-full max-w-xs aspect-square bg-black/80 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={gifSrc}
                alt="Celebration"
                className="w-full h-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default.gif' }}
              />
            </div>
          </div>
        )}

        {/* Résultat: bienvenue + table en gros et vert + bouton retour */}
        {!showGif && selected && (
          <div className="mt-10 text-center space-y-6">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">Bienvenue {selected.prenom} {selected.nom}</p>
            </div>
            <div className="space-y-2">
              <p className="text-base text-gray-600">Vous êtes sur la table:</p>
              <p className="text-6xl sm:text-7xl font-black text-green-600 tracking-tight">{tableLabel}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={backToSearch}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-6 py-3 text-base font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Chercher ma table
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
