import React from 'react'
import type { Language } from './translations'

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="language-selector">
      <div className="language-flags">
        <button
          onClick={() => onLanguageChange('fr')}
          className={`flag-button ${currentLanguage === 'fr' ? 'active' : ''}`}
          title="Français"
        >
          <span className="flag-icon">🇫🇷</span>
          <span className="flag-text">FR</span>
        </button>
        <button
          onClick={() => onLanguageChange('nl')}
          className={`flag-button ${currentLanguage === 'nl' ? 'active' : ''}`}
          title="Nederlands"
        >
          <span className="flag-icon">🇳🇱</span>
          <span className="flag-text">NL</span>
        </button>
      </div>
    </div>
  )
}
