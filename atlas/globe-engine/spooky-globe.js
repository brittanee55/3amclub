/* =========================================================
   3AM CLUB / INTERACTIVE ATLAS GLOBE
   ---------------------------------------------------------
   This creates the spinning globe using Globe.gl.
   Features:
   - Auto-rotates when idle
   - Hovering a point pauses rotation
   - Clicking a point opens the story/location panel
   - Category filters update visible points
   ========================================================= */

function spookyAtlasTemplate(location) {
  return `
    <div class="spooky-globe-tooltip">
      <strong>${location.name}</strong>
      <span>${location.summary}</span>
    </div>
  `;
}

function renderSpookyLocationPanel(location) {
  const panel = document.getElementById("locationInfoPanel");
  if (!panel || !location) return;

  panel.innerHTML = `
    <p class="kicker">Selected Story Node</p>
    <h2>${location.name}</h2>
    <p>${location.summary}</p>

    <div class="location-pill-row">
      ${(location.themes || []).map((theme) => `<span>${theme}</span>`).join("")}
    </div>

    <div class="location-connection-card">
      <h3>Connected Stories</h3>
      <ul>${(location.stories || []).map((item) => `<li>${item}</li>`).join("") || "<li>More stories coming soon.</li>"}</ul>
    </div>

    <div class="location-connection-card">
      <h3>Entity / Pattern</h3>
      <ul>${(location.entities || []).map((item) => `<li>${item}</li>`).join("") || "<li>Unknown pattern.</li>"}</ul>
    </div>

    <div class="location-connection-card">
      <h3>Related Rooms</h3>
      <ul>${(location.related || []).map((item) => `<li>${item}</li>`).join("") || "<li>Community rooms coming soon.</li>"}</ul>
    </div>
  `;
}

function getFilteredSpookyLocations(category) {
  const data = window.SPOOKY_ATLAS_LOCATIONS || [];
  if (!category || category === "all") return data;
  return data.filter((location) => location.category === category);
}

function setupSpookyGlobeFilters(globeInstance) {
  const buttons = document.querySelectorAll("[data-spooky-globe-filter]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.spookyGlobeFilter;

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      globeInstance.pointsData(getFilteredSpookyLocations(category));
    });
  });
}

function initSpookyAtlasGlobe() {
  const globeElement = document.getElementById("atlasGlobe");
  if (!globeElement) return;

  if (typeof Globe === "undefined") {
    globeElement.innerHTML = `
      <div class="globe-error">
        <h3>3D globe library did not load</h3>
        <p>Open this page with Live Server and make sure internet is active.</p>
      </div>
    `;
    return;
  }

  const locations = window.SPOOKY_ATLAS_LOCATIONS || [];

  const globeInstance = Globe()(globeElement)
    .width(globeElement.clientWidth || 980)
    .height(globeElement.clientHeight || 720)
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("https://unpkg.com/three-globe/example/img/night-sky.png")
    .pointsData(locations)
    .pointLat((location) => location.lat)
    .pointLng((location) => location.lng)
    .pointAltitude((location) => location.altitude || 0.075)
    .pointRadius(0.58)
    .pointColor((location) => location.color || "#ff9e55")
    .pointLabel(spookyAtlasTemplate)
    .onPointClick((location) => {
      renderSpookyLocationPanel(location);
      globeInstance.pointOfView(
        {
          lat: location.lat,
          lng: location.lng,
          altitude: 1.55
        },
        1000
      );
    })
    .onPointHover((location) => {
      const controls = globeInstance.controls();
      if (!controls) return;
      controls.autoRotate = !location;
    });

  globeInstance.controls().autoRotate = true;
  globeInstance.controls().autoRotateSpeed = 0.35;

  globeInstance.pointOfView({ lat: 30, lng: -90, altitude: 2.15 }, 1200);

  setupSpookyGlobeFilters(globeInstance);
  renderSpookyLocationPanel(locations[0]);

  window.addEventListener("resize", () => {
    globeInstance.width(globeElement.clientWidth);
    globeInstance.height(globeElement.clientHeight);
  });
}

document.addEventListener("DOMContentLoaded", initSpookyAtlasGlobe);
