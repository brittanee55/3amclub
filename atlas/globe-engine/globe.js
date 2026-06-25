/* =========================================================
   3D-GLOBE / GLOBE.JS
   Creates the interactive Atlas globe.
   ========================================================= */

async function initAtlasGlobe() {
  const globeElement = document.getElementById("atlasGlobe");

  if (!globeElement) return;

  if (typeof Globe === "undefined") {
    globeElement.innerHTML = `
      <div class="globe-error">
        <div>
          <h3>3D globe library did not load</h3>
          <p>Please use Live Server and make sure your internet connection is active.</p>
        </div>
      </div>
    `;
    console.error("Globe.gl did not load.");
    return;
  }

  const locations = await window.loadAtlasLocations();

  if (!locations.length) {
    globeElement.innerHTML = `
      <div class="globe-error">
        <div>
          <h3>No Atlas locations loaded</h3>
          <p>Please check data/locations.json.</p>
        </div>
      </div>
    `;
    return;
  }

  const globeInstance = Globe()(globeElement)
    .width(globeElement.clientWidth || 900)
    .height(globeElement.clientHeight || 680)
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("https://unpkg.com/three-globe/example/img/night-sky.png")
    .pointsData(locations)
    .pointLat((location) => location.lat)
    .pointLng((location) => location.lng)
    .pointAltitude((location) => location.altitude || 0.07)
    .pointRadius(0.55)
    .pointColor((location) => location.color || "#d9a441")
    .pointLabel((location) => `
      <div style="
        background: rgba(2, 8, 6, 0.94);
        padding: 12px;
        border: 1px solid #d9a441;
        color: #f5ead8;
        max-width: 260px;
        font-family: Arial, sans-serif;
      ">
        <strong>${location.name}</strong><br>
        <span>${location.summary}</span>
      </div>
    `)
    .onPointClick((location) => {
      window.renderAtlasLocationPanel(location);
      globeInstance.pointOfView(
        {
          lat: location.lat,
          lng: location.lng,
          altitude: 1.6
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

  globeInstance.pointOfView({ lat: 25, lng: -40, altitude: 2.4 });

  window.AtlasGlobe = globeInstance;

  window.setupGlobeFilterControls(globeInstance);
  window.setupGlobeJumpButtons(globeInstance);

  window.addEventListener("resize", () => {
    globeInstance
      .width(globeElement.clientWidth || 900)
      .height(globeElement.clientHeight || 680);
  });
}

document.addEventListener("DOMContentLoaded", initAtlasGlobe);
