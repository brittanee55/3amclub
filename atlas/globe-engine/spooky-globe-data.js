/* =========================================================
   3AM CLUB / SPOOKY ATLAS DATA
   ---------------------------------------------------------
   These are starter paranormal story pins for the interactive globe.
   Later, real submissions can be added here or loaded from a backend.
   ========================================================= */

window.SPOOKY_ATLAS_LOCATIONS = [
  {
    id: "smoky-mountains",
    name: "Smoky Mountains Cabin",
    country: "United States",
    category: "haunted",
    lat: 35.6532,
    lng: -83.5070,
    altitude: 0.08,
    color: "#ff9e55",
    summary: "A secluded cabin, footsteps around the porch, power going out, and the feeling of being somewhere you should not be.",
    themes: ["Haunted Places", "Cabin", "Footsteps", "Warning"],
    stories: ["Smoky Mountains Cabin Story"],
    entities: ["Unknown Presence"],
    related: ["Haunted Places", "Forest Encounters"]
  },
  {
    id: "national-parks",
    name: "National Parks Cluster",
    country: "United States",
    category: "forest",
    lat: 44.4280,
    lng: -110.5885,
    altitude: 0.1,
    color: "#ffb36b",
    summary: "A cluster for stories tied to parks, campgrounds, forests, missing time, strange sounds, and warnings in the woods.",
    themes: ["National Parks", "Missing Time", "Forest", "Whistling"],
    stories: ["National Parks Listener Stories"],
    entities: ["Unknown Forest Presence"],
    related: ["Missing Time", "Strange Sounds"]
  },
  {
    id: "mirror-guest",
    name: "Mirror Guest Case",
    country: "United States",
    category: "mirror",
    lat: 39.8283,
    lng: -98.5795,
    altitude: 0.09,
    color: "#f7d7a3",
    summary: "A guest asked for every mirror to be covered before sundown. The story connects to reflection fear, layered voices, and something trying to get in.",
    themes: ["Mirrors", "Doorways", "Layered Voices", "3AM"],
    stories: ["The Mirror Guest"],
    entities: ["Mirror Entity"],
    related: ["Shadow Stories", "Doorway Sightings"]
  },
  {
    id: "appalachia",
    name: "Appalachia Story Region",
    country: "United States",
    category: "folklore",
    lat: 37.5600,
    lng: -82.4000,
    altitude: 0.08,
    color: "#d88946",
    summary: "Older-than-memory mountain lore, warnings, cabin stories, and strange figures at the edges of the woods.",
    themes: ["Appalachia", "Folklore", "Old Mountains", "Warnings"],
    stories: ["Appalachia Compilation"],
    entities: ["Woods Presence"],
    related: ["Haunted Forests", "Spiritual Warnings"]
  },
  {
    id: "world-cup-ufo",
    name: "2026 World Event Watch",
    country: "North America",
    category: "ufo",
    lat: 25.7617,
    lng: -80.1918,
    altitude: 0.12,
    color: "#ff7b35",
    summary: "A watch node for strange sky predictions, UFO rumors, and global-event theories connected to the 2026 World Cup.",
    themes: ["UFO", "World Event", "Predictions", "Sky Watch"],
    stories: ["Thanks, I Hate This: UFO Prediction"],
    entities: ["Unknown Aerial Phenomena"],
    related: ["UFO Room", "Government Mysteries"]
  },
  {
    id: "pokemon-ai-data",
    name: "AI Mapping / Drone Data Story",
    country: "Global",
    category: "technology",
    lat: 37.7749,
    lng: -122.4194,
    altitude: 0.11,
    color: "#ff9e55",
    summary: "A current-events node for strange technology headlines, mapping data, AI training, drones, and the feeling that the weird is becoming real.",
    themes: ["AI", "Mapping", "Drones", "Data"],
    stories: ["Thanks, I Hate This: Mapping Data"],
    entities: ["Technology Anxiety"],
    related: ["Government Mysteries", "Conspiracy Network"]
  }
];

window.SPOOKY_ATLAS_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "haunted", label: "Haunted" },
  { id: "forest", label: "Forest" },
  { id: "mirror", label: "Mirrors" },
  { id: "folklore", label: "Folklore" },
  { id: "ufo", label: "UFO" },
  { id: "technology", label: "Technology" }
];
