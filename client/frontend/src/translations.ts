export type Language = 'fr' | 'nl'

export interface Translations {
  title: string
  searchPlaceholder: string
  searchButton: string
  welcome: string
  youAreAtTable: string
  congratulations: string
  languageSelector: {
    french: string
    dutch: string
  }
}

export const translations: Record<Language, Translations> = {
  fr: {
    title: 'Trouve ta table',
    searchPlaceholder: 'Recherche ton nom ou prénom...',
    searchButton: 'Nouvelle recherche',
    welcome: 'Bienvenue',
    youAreAtTable: 'Tu es sur la table',
    congratulations: '🎉 Félicitations ! 🎉',
    languageSelector: {
      french: 'Français',
      dutch: 'Nederlands'
    }
  },
  nl: {
    title: 'Vind je tafel',
    searchPlaceholder: 'Zoek je naam of voornaam...',
    searchButton: 'Nieuwe zoekopdracht',
    welcome: 'Welkom',
    youAreAtTable: 'Je zit aan tafel',
    congratulations: '🎉 Gefeliciteerd! 🎉',
    languageSelector: {
      french: 'Français',
      dutch: 'Nederlands'
    }
  }
}

export const getTranslation = (language: Language, key: keyof Translations): string => {
  const keys = key.split('.') as string[]
  let result: any = translations[language]

  for (const k of keys) {
    result = result[k]
  }

  return result || key
}
