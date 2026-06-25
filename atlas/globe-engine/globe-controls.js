/* =========================================================
   3D-GLOBE / GLOBE-CONTROLS.JS
   Handles filters, fly-to-location buttons, and info panel.
   ========================================================= */

function formatAtlasId(id) {
  if (!id) return "";
  return String(id)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderAtlasList(items) {
  if (!items || !items.length) return "<li>More connections coming soon.</li>";
  return items.map((item) => `<li>${formatAtlasId(item)}</li>`).join("");
}

function renderAtlasLocationPanel(location) {
  const panel = document.getElementById("locationInfoPanel");

  if (!panel || !location) return;

  panel.innerHTML = `
    <p class="eyebrow">Selected Location</p>

    <h2>${location.name}</h2>

    <p>${location.summary}</p>

    <div class="location-pill-row">
      ${(location.themes || [])
        .map((theme) => `<span>${theme}</span>`)
        .join("")}
    </div>

    <div class="location-connection-card">
      <h3>Connected Episodes</h3>
      <ul>${renderAtlasList(location.episodes)}</ul>
    </div>

    <div class="location-connection-card">
      <h3>Books & Sources</h3>
      <ul>${renderAtlasList(location.books)}</ul>
    </div>

    <div class="location-connection-card">
      <h3>Concepts</h3>
      <ul>${renderAtlasList(location.concepts)}</ul>
    </div>

    <div class="location-connection-card">
      <h3>Timeline Events</h3>
      <ul>${renderAtlasList(location.timelineEvents)}</ul>
    </div>
  `;
}

function setupGlobeFilterControls(globeInstance) {
  const filterButtons = document.querySelectorAll("[data-globe-filter]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.globeFilter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filteredLocations = window.filterAtlasLocations(category);
      globeInstance.pointsData(filteredLocations);
    });
  });
}

function setupGlobeJumpButtons(globeInstance) {
  const jumpButtons = document.querySelectorAll(".location-jump-btn");

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const locationId = button.dataset.locationId;
      const location = window.findAtlasLocationById(locationId);

      if (!location) return;

      globeInstance.pointOfView(
        {
          lat: location.lat,
          lng: location.lng,
          altitude: 1.7
        },
        1000
      );

      renderAtlasLocationPanel(location);

      const globeElement = document.getElementById("atlasGlobe");

      if (globeElement) {
        globeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

window.renderAtlasLocationPanel = renderAtlasLocationPanel;
window.setupGlobeFilterControls = setupGlobeFilterControls;
window.setupGlobeJumpButtons = setupGlobeJumpButtons;
