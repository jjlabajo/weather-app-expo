export type LanguageCode = 'en' | 'es' | 'fr';

export const translations = {
  en: {
    // Weather States
    clearSky: 'Clear sky',
    mainlyClear: 'Mainly clear',
    partlyCloudy: 'Partly cloudy',
    overcast: 'Overcast',
    fog: 'Fog',
    drizzle: 'Drizzle',
    rain: 'Rain',
    snow: 'Snow',
    rainShowers: 'Rain showers',
    snowShowers: 'Snow showers',
    thunderstorm: 'Thunderstorm',
    unknown: 'Unknown',

    // Home
    detectingLocation: 'Detecting location...',
    fetchingWeather: 'Fetching weather...',
    locationDenied: 'Location permission denied or unavailable.',
    failedFetch: 'Failed to fetch weather data.',
    tryAgain: 'Try Again',
    highlights: "Today's Highlights",
    high: 'High',
    low: 'Low',

    // Search
    searchPlaceholder: 'Search for a city...',
    noLocations: 'No locations found',
    popularCities: 'Popular Cities',
    sunnyClear: 'Sunny / Clear',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    stormy: 'Stormy',
    moreCities: 'More Cities',

    // Details
    forecastTitle: '8-Day Forecast',
    today: 'Today',

    // Settings
    account: 'Account',
    preferences: 'Preferences',
    appInfo: 'App Info',
    tempUnit: 'Temperature Unit',
    tempUnitSub: 'Choose unit to display temperature',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    languageLabel: 'Language',
    languageSub: 'Select your display language',
    version: 'Version',
    dataSource: 'Data Source',
    signInAppleText: 'Sign in with Apple to securely back up your weather preferences and synchronize them across your devices.',
    signInApple: 'Sign in with Apple',
    signOut: 'Sign Out',
    syncing: 'Syncing settings online...',
    synced: 'Preferences synced to Apple account',
  },
  es: {
    // Weather States
    clearSky: 'Cielo despejado',
    mainlyClear: 'Mayormente despejado',
    partlyCloudy: 'Parcialmente nublado',
    overcast: 'Nublado',
    fog: 'Niebla',
    drizzle: 'Llovizna',
    rain: 'Lluvia',
    snow: 'Nieve',
    rainShowers: 'Chubascos de lluvia',
    snowShowers: 'Chubascos de nieve',
    thunderstorm: 'Tormenta eléctrica',
    unknown: 'Desconocido',

    // Home
    detectingLocation: 'Detectando ubicación...',
    fetchingWeather: 'Obteniendo clima...',
    locationDenied: 'Permiso de ubicación denegado o no disponible.',
    failedFetch: 'Error al obtener los datos del clima.',
    tryAgain: 'Intentar de nuevo',
    highlights: 'Destacados de hoy',
    high: 'Máx',
    low: 'Mín',

    // Search
    searchPlaceholder: 'Buscar una ciudad...',
    noLocations: 'No se encontraron ubicaciones',
    popularCities: 'Ciudades populares',
    sunnyClear: 'Soleado / Despejado',
    cloudy: 'Nublado',
    rainy: 'Lluvioso',
    stormy: 'Tormentoso',
    moreCities: 'Más ciudades',

    // Details
    forecastTitle: 'Pronóstico de 8 días',
    today: 'Hoy',

    // Settings
    account: 'Cuenta',
    preferences: 'Preferencias',
    appInfo: 'Información de la aplicación',
    tempUnit: 'Unidad de temperatura',
    tempUnitSub: 'Elija la unidad para mostrar la temperatura',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    languageLabel: 'Idioma',
    languageSub: 'Seleccione su idioma de visualización',
    version: 'Versión',
    dataSource: 'Fuente de datos',
    signInAppleText: 'Inicie sesión con Apple para respaldar de forma segura sus preferencias climáticas y sincronizarlas entre sus dispositivos.',
    signInApple: 'Iniciar sesión con Apple',
    signOut: 'Cerrar sesión',
    syncing: 'Sincronizando configuraciones en línea...',
    synced: 'Preferencias sincronizadas con la cuenta de Apple',
  },
  fr: {
    // Weather States
    clearSky: 'Ciel dégagé',
    mainlyClear: 'Principalement dégagé',
    partlyCloudy: 'Partiellement nuageux',
    overcast: 'Couvert',
    fog: 'Brouillard',
    drizzle: 'Bruine',
    rain: 'Pluie',
    snow: 'Neige',
    rainShowers: 'Averses de pluie',
    snowShowers: 'Averses de neige',
    thunderstorm: 'Orage',
    unknown: 'Inconnu',

    // Home
    detectingLocation: 'Détection de l’emplacement...',
    fetchingWeather: 'Obtention de la météo...',
    locationDenied: 'Autorisation d’emplacement refusée ou indisponible.',
    failedFetch: 'Échec de la récupération des données météo.',
    tryAgain: 'Réessayer',
    highlights: 'Points forts d’aujourd’hui',
    high: 'Max',
    low: 'Min',

    // Search
    searchPlaceholder: 'Rechercher une ville...',
    noLocations: 'Aucun emplacement trouvé',
    popularCities: 'Villes populaires',
    sunnyClear: 'Ensoleillé / Dégagé',
    cloudy: 'Nuageux',
    rainy: 'Pluvieux',
    stormy: 'Orageux',
    moreCities: 'Plus de villes',

    // Details
    forecastTitle: 'Prévisions sur 8 jours',
    today: 'Aujourd’hui',

    // Settings
    account: 'Compte',
    preferences: 'Préférences',
    appInfo: 'Informations sur l’application',
    tempUnit: 'Unité de température',
    tempUnitSub: 'Choisissez l’unité d’affichage de la température',
    celsius: 'Celsius (°C)',
    fahrenheit: 'Fahrenheit (°F)',
    languageLabel: 'Langue',
    languageSub: 'Sélectionnez votre langue d’affichage',
    version: 'Version',
    dataSource: 'Source de données',
    signInAppleText: 'Connectez-vous avec Apple pour sauvegarder vos préférences météo et les synchroniser sur vos appareils.',
    signInApple: 'Se connecter avec Apple',
    signOut: 'Se déconnecter',
    syncing: 'Synchronisation des paramètres en ligne...',
    synced: 'Préférences synchronisées avec le compte Apple',
  }
};
