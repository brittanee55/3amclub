/* =========================================================
   3D-GLOBE / GLOBE-DATA.JS
   Loads Atlas location data from data/locations.json.
   Includes a built-in fallback so the globe still works if
   the JSON file cannot be fetched.
   ========================================================= */

const ATLAS_LOCATION_FALLBACK = [
  {
    id: "washington-dc",
    name: "Washington D.C.",
    country: "United States",
    category: "intelligence",
    lat: 38.9072,
    lng: -77.0369,
    altitude: 0.08,
    color: "#d9a441",
    summary: "Federal agencies, national security, congressional oversight, public records, intelligence policy, and public accountability.",
    themes: ["CIA", "Congress", "National Security", "Public Records", "Oversight"],
    episodes: ["the-intelligence-game", "whistleblowers-government-secrecy"],
    books: ["legacy-of-ashes", "the-brothers"],
    concepts: ["intelligence-agencies", "oversight", "source-literacy"],
    timelineEvents: ["cia-established-1947", "cold-war-intelligence"]
  },
  {
    id: "langley",
    name: "Langley, Virginia",
    country: "United States",
    category: "intelligence",
    lat: 38.9517,
    lng: -77.1467,
    altitude: 0.09,
    color: "#61d6a2",
    summary: "CIA headquarters context, institutional intelligence history, secrecy, oversight, and public debate.",
    themes: ["CIA", "Intelligence History", "Secrecy", "Government"],
    episodes: ["the-intelligence-game"],
    books: ["legacy-of-ashes", "inside-the-company"],
    concepts: ["intelligence-agencies", "covert-action"],
    timelineEvents: ["cia-established-1947"]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    category: "media",
    lat: 51.5074,
    lng: -0.1278,
    altitude: 0.07,
    color: "#d9a441",
    summary: "Diplomacy, media systems, parliament, monarchy, international law, and intelligence history.",
    themes: ["Diplomacy", "Media", "Parliament", "Monarchy"],
    episodes: ["media-narratives-public-opinion"],
    books: ["manufacturing-consent"],
    concepts: ["media-systems", "public-opinion", "propaganda"],
    timelineEvents: ["printing-press-revolution"]
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    category: "history",
    lat: 52.52,
    lng: 13.405,
    altitude: 0.075,
    color: "#f1d083",
    summary: "Post-war Europe, Cold War division, intelligence competition, alliances, espionage, and reconstruction.",
    themes: ["Cold War", "Post-War Europe", "Alliances", "Espionage"],
    episodes: ["the-intelligence-game"],
    books: ["the-spy-and-the-traitor"],
    concepts: ["cold-war", "espionage", "geopolitics"],
    timelineEvents: ["cold-war-intelligence"]
  },
  {
    id: "egypt",
    name: "Egypt",
    country: "Egypt",
    category: "history",
    lat: 26.8206,
    lng: 30.8025,
    altitude: 0.07,
    color: "#d9a441",
    summary: "Ancient civilization, symbolism, architecture, mythology, astronomy, spirituality, and historical memory.",
    themes: ["Ancient Egypt", "Symbolism", "Architecture", "Mythology"],
    episodes: ["ancient-symbols-lost-civilizations"],
    books: ["ancient-civilization-reader"],
    concepts: ["civilization", "symbolism", "mythology"],
    timelineEvents: ["ancient-egyptian-civilization"]
  },
  {
    id: "greece",
    name: "Greece",
    country: "Greece",
    category: "history",
    lat: 39.0742,
    lng: 21.8243,
    altitude: 0.07,
    color: "#61d6a2",
    summary: "Ancient philosophy, democracy, mythology, civilization, language, and historical influence.",
    themes: ["Philosophy", "Democracy", "Mythology", "Civilization"],
    episodes: ["ancient-symbols-lost-civilizations"],
    books: ["greek-philosophy-reader"],
    concepts: ["democracy", "philosophy", "mythology"],
    timelineEvents: ["ancient-greek-thought"]
  },
  {
    id: "new-york",
    name: "New York City",
    country: "United States",
    category: "media",
    lat: 40.7128,
    lng: -74.006,
    altitude: 0.07,
    color: "#f1d083",
    summary: "Media institutions, finance, publishing, journalism, public narratives, and cultural influence.",
    themes: ["Media", "Finance", "Publishing", "Journalism"],
    episodes: ["media-narratives-public-opinion"],
    books: ["manufacturing-consent"],
    concepts: ["media-systems", "public-opinion", "propaganda"],
    timelineEvents: ["internet-public-infrastructure"]
  },
  {
    id: "california",
    name: "California",
    country: "United States",
    category: "psychology",
    lat: 36.7783,
    lng: -119.4179,
    altitude: 0.065,
    color: "#61d6a2",
    summary: "Technology, psychology, wellness culture, media production, and emerging learning systems.",
    themes: ["Technology", "Psychology", "Wellness", "Media"],
    episodes: ["trauma-memory-nervous-system"],
    books: ["the-body-keeps-the-score"],
    concepts: ["nervous-system-regulation", "trauma", "memory"],
    timelineEvents: ["trauma-research-expands"]
  },
  {
    id: "india",
    name: "India",
    country: "India",
    category: "spirituality",
    lat: 20.5937,
    lng: 78.9629,
    altitude: 0.07,
    color: "#d9a441",
    summary: "Spiritual traditions, consciousness, meditation, philosophy, identity, and meaning.",
    themes: ["Meditation", "Consciousness", "Philosophy", "Spirituality"],
    episodes: ["consciousness-meaning-reality"],
    books: ["consciousness-reality-reader"],
    concepts: ["consciousness", "awareness", "meaning"],
    timelineEvents: ["consciousness-traditions"]
  }
];

window.AtlasGlobeData = {
  locations: [],
  filteredLocations: [],
  activeFilter: "all"
};

async function loadAtlasLocations() {
  try {
    const response = await fetch("../data/locations.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Could not load locations.json");
    }

    const locations = await response.json();
    window.AtlasGlobeData.locations = locations;
    window.AtlasGlobeData.filteredLocations = locations;
    return locations;
  } catch (error) {
    console.warn("Using built-in Atlas location fallback:", error);
    window.AtlasGlobeData.locations = ATLAS_LOCATION_FALLBACK;
    window.AtlasGlobeData.filteredLocations = ATLAS_LOCATION_FALLBACK;
    return ATLAS_LOCATION_FALLBACK;
  }
}

function filterAtlasLocations(category) {
  window.AtlasGlobeData.activeFilter = category;

  if (category === "all") {
    window.AtlasGlobeData.filteredLocations = window.AtlasGlobeData.locations;
  } else {
    window.AtlasGlobeData.filteredLocations = window.AtlasGlobeData.locations.filter((location) => {
      return location.category === category;
    });
  }

  return window.AtlasGlobeData.filteredLocations;
}

function findAtlasLocationById(locationId) {
  return window.AtlasGlobeData.locations.find((location) => location.id === locationId);
}

window.loadAtlasLocations = loadAtlasLocations;
window.filterAtlasLocations = filterAtlasLocations;
window.findAtlasLocationById = findAtlasLocationById;
