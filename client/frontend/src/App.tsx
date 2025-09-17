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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    const durationMs = 3000
    setTimeout(() => setShowGif(false), durationMs)
  }

  function backToSearch() {
    setSelected(null)
    setShowGif(false)
    setQuery('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  // Auto retour à l'accueil après 10 secondes sur la page de résultat
  useEffect(() => {
    if (!showGif && selected) {
      // Démarrer le timeout de 10 secondes
      timeoutRef.current = setTimeout(() => {
        backToSearch()
      }, 10000)
    }

    // Nettoyer le timeout si on change de page ou si le composant se démonte
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [showGif, selected])

  const gifSrc = buildGifSrc(selected)
  const tableLabel = selected?.nom_table ? `${selected.nom_table}` : (selected ? `${selected.table}` : '')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 text-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Titre uniquement sur la page de recherche */}
        {!selected && (
          <>
            <div className="hero-image-container">
              <img
                src="/home-site-weeding.jpeg"
                alt="Mariage"
                className="hero-image"
              />
            </div>
            <div className="title-container">
              <h1 className="main-title">
                Retrouvez votre table
              </h1>
              <div className="title-decoration"></div>
            </div>
          </>
        )}

        {/* Barre de recherche centrée et courte */}
        {!selected && (
          <div className="flex justify-center mb-8">
            <div className="search-container">
              <div className="search-input-wrapper">
                {/* Icône de recherche */}
                <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher votre nom ou prénom..."
                  className="search-input"
                />

                {/* Bouton clear */}
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="clear-button"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Résultats de recherche */}
              {!!results.length && (
                <div className="search-results">
                  <ul>
                    {results.map((g, idx) => (
                      <li
                        key={`${g.nom}-${g.prenom}-${idx}`}
                        className="search-result-item"
                        onClick={() => onPick(g)}
                      >
                        <div className="search-result-avatar">
                          <span>
                            {g.prenom.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="search-result-name">
                          <span>{g.prenom} {g.nom}</span>
                        </div>
                        <div className="search-result-arrow">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zone d'affichage GIF avec design amélioré */}
        {showGif && selected && (
          <div className="gif-container">
            <div className="gif-wrapper">
              <img
                src={gifSrc}
                alt="Celebration"
                className="gif-image"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default.gif' }}
              />
            </div>
            <div className="gif-text">
              🎉 Félicitations ! 🎉
            </div>
          </div>
        )}

        {/* Résultat: bienvenue + table en gros et vert + bouton retour */}
        {!showGif && selected && (
          <div className="result-container">
            <div className="welcome-section">
              <div className="welcome-decoration"></div>
              <p className="welcome-text">Bienvenue</p>
              <p className="guest-name">{selected.prenom} {selected.nom}</p>
              <div className="welcome-decoration"></div>
            </div>
            <div className="table-section">
              <p className="table-label">Vous êtes sur la table</p>
              <div className="table-number-container">
                <p className="table-number">{tableLabel}</p>
                <div className="table-sparkles">✨</div>
              </div>
            </div>
            <div className="button-section">
              <button
                type="button"
                onClick={backToSearch}
                className="back-button"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
