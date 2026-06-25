/*
  js/main.js
  ------------------------------------------------------------
  This is the main interaction file for the prototype.

  What this file controls:
  1. Mobile menu open/close.
  2. Fade-in animation on scroll.
  3. Loading story cards from data/stories.json.
  4. Saving forms to localStorage.
  5. Rendering saved stories/journals/theories.
  6. Matching submitted story text to similar story tags.
  7. Drawing the Story Constellation visual.
  8. Loading shop products from data/products.json.
  9. Creating the 3D globe on atlas/interactive-globe.html.

  Prototype note:
  localStorage means data is saved only in the user's browser.
  A real app would replace this with Firebase, Supabase, or another backend.
*/

/* Short selector helpers so the code is easier to read. */
const $ = (query, root = document) => root.querySelector(query);
const $$ = (query, root = document) => [...root.querySelectorAll(query)];

/*
  rel(path)
  ------------------------------------------------------------
  Pages live in different folders. Example:
  - index.html is at root.
  - atlas/interactive-globe.html is one folder deep.

  This function calculates how many ../ pieces are needed to reach root files.
*/
function rel(path) {
  const depth = location.pathname.split('/').filter(Boolean).length - 1;
  return '../'.repeat(Math.max(depth, 0)) + path;
}

/* Mobile menu: used by the header on index.html and all matching pages. */
function initMenu() {
  const menu = $('#mobileMenu');
  const open = $('#menuOpen');
  const close = $('#menuClose');
  if (open && menu) open.onclick = () => menu.classList.add('open');
  if (close && menu) close.onclick = () => menu.classList.remove('open');
}

/* Fade-in on scroll for anything with class="fade-up". */
function initFade() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  $$('.fade-up').forEach(element => observer.observe(element));
}

/* Loads starter stories from JSON. These feed the archive cards and globe points. */
async function getStories() {
  try {
    return await fetch(rel('data/stories.json')).then(response => response.json());
  } catch (error) {
    console.warn('Could not load stories.json. Returning empty list.', error);
    return [];
  }
}

/* Generic localStorage save helper. Used by forms across the prototype. */
function save(key, object) {
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const savedObject = {
    ...object,
    id: Date.now(),
    created: new Date().toLocaleString()
  };
  existing.unshift(savedObject);
  localStorage.setItem(key, JSON.stringify(existing));
  return existing;
}

/* Generic localStorage get helper. */
function get(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

/* Generic renderer for saved entries. */
function renderSaved(key, selector) {
  const box = $(selector);
  if (!box) return;

  const items = get(key);

  if (!items.length) {
    box.innerHTML = '<p class="muted">Nothing saved yet.</p>';
    return;
  }

  box.innerHTML = items.map(item => `
    <div class="saved-item">
      <strong>${item.title || item.subject || item.name || 'Saved Entry'}</strong>
      <p>${item.story || item.message || item.notes || item.text || ''}</p>
      <button class="btn" onclick="deleteSaved('${key}', ${item.id}, '${selector}')">Delete</button>
    </div>
  `).join('');
}

/* Deletes one saved localStorage item and re-renders the same list. */
function deleteSaved(key, id, selector) {
  const filtered = get(key).filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
  renderSaved(key, selector);
}

/*
  Form connections:
  - #storyForm lives on submissions.html.
  - #journalForm lives on vault/journal pages.
  - #accessForm lives on homepage/patreon sections.
  - #theoryForm lives on community/fan theory pages.
*/
function initForms() {
  const storyForm = $('#storyForm');
  if (storyForm) {
    storyForm.onsubmit = async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(storyForm).entries());
      save('submittedStories', data);
      storyForm.reset();
      renderSaved('submittedStories', '#submittedStories');
      showMatches(data.story || '');
    };
    renderSaved('submittedStories', '#submittedStories');
  }

  const journalForm = $('#journalForm');
  if (journalForm) {
    journalForm.onsubmit = event => {
      event.preventDefault();
      save('journalEntries', Object.fromEntries(new FormData(journalForm).entries()));
      journalForm.reset();
      renderSaved('journalEntries', '#journalEntries');
    };
    renderSaved('journalEntries', '#journalEntries');
  }

  const accessForm = $('#accessForm');
  if (accessForm) {
    accessForm.onsubmit = event => {
      event.preventDefault();
      save('accessRequests', Object.fromEntries(new FormData(accessForm).entries()));
      accessForm.reset();
      alert('Request saved in this prototype.');
    };
  }

  const theoryForm = $('#theoryForm');
  if (theoryForm) {
    theoryForm.onsubmit = event => {
      event.preventDefault();
      save('fanTheories', Object.fromEntries(new FormData(theoryForm).entries()));
      theoryForm.reset();
      renderSaved('fanTheories', '#theoryList');
    };
    renderSaved('fanTheories', '#theoryList');
  }
}

/*
  Story matching:
  Reads the user-submitted story text, compares it to tags/matches in data/stories.json,
  then displays the closest matching cases. This powers the "you are not alone" concept.
*/
async function showMatches(text) {
  const box = $('#matches');
  if (!box) return;

  const stories = await getStories();
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);

  const scored = stories
    .map(story => ({
      story,
      score: story.matches.concat(story.tags).filter(tag =>
        words.some(word => tag.toLowerCase().includes(word) || word.includes(tag.toLowerCase()))
      ).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  box.innerHTML = '<h3>You are not alone.</h3>' + scored.map(({ story, score }) => `
    <div class="saved-item">
      <strong>${story.title}</strong>
      <p>${story.summary}</p>
      <span class="tiny">${score || 1} similar pattern${score === 1 ? '' : 's'} found</span>
    </div>
  `).join('');

  drawConstellation(scored.map(item => item.story));
}

/*
  Story Constellation:
  Draws a small visual map of connected experiences.
  This is a lightweight prototype of a future graph/network feature.
*/
function drawConstellation(items = []) {
  const constellation = $('#constellation');
  if (!constellation) return;

  constellation.innerHTML = '';

  const points = [
    [48, 45, 'YOU'],
    [20, 25, 'Mirror'],
    [75, 28, 'Storm'],
    [30, 76, 'Hotel'],
    [70, 74, 'Desert'],
    [52, 18, '3AM']
  ];

  points.forEach((point, index) => {
    const node = document.createElement('div');
    node.className = 'star-node';
    node.style.left = point[0] + '%';
    node.style.top = point[1] + '%';
    node.title = point[2];
    constellation.appendChild(node);

    if (index > 0) {
      const line = document.createElement('div');
      line.className = 'line';
      const startX = 48;
      const startY = 45;
      const endX = point[0];
      const endY = point[1];
      const length = Math.hypot(endX - startX, endY - startY);
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      line.style.left = startX + '%';
      line.style.top = startY + '%';
      line.style.width = length + '%';
      line.style.transform = `rotate(${angle}deg)`;
      constellation.appendChild(line);
    }
  });
}

/* Renders story cards on any page with data-story-grid. */
async function renderCards() {
  const grids = $$('[data-story-grid]');
  if (!grids.length) return;

  const stories = await getStories();

  grids.forEach(grid => {
    grid.innerHTML = stories.map(story => `
      <article class="card fade-up">
        <span class="tiny">${story.category}</span>
        <h3>${story.title}</h3>
        <p>${story.summary}</p>
        <p class="muted">${story.location}</p>
      </article>
    `).join('');
  });

  initFade();
}

/* Renders shop products from data/products.json. */
async function renderShop() {
  const grid = $('#productGrid');
  if (!grid) return;

  const products = await fetch(rel('data/products.json'))
    .then(response => response.json())
    .catch(() => []);

  grid.innerHTML = products.map(product => `
    <article class="product">
      <img src="${rel(product.image)}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.category} • ${product.price}</p>
      <button class="btn" onclick="save('cart', { title: '${product.name}', notes: '${product.price}' })">Add to cart</button>
    </article>
  `).join('');
}

/*
  3D Globe:
  Only runs on atlas/interactive-globe.html.
  Requires Three.js to be loaded on that page.

  Behavior:
  - Globe spins automatically.
  - Hovering a point pauses rotation.
  - Dragging rotates the globe manually.
*/
function initGlobe() {
  const canvas = $('#globeCanvas');
  if (!canvas || !window.THREE) return;

  getStories().then(stories => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 3.4;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(devicePixelRatio);

    const group = new THREE.Group();
    scene.add(group);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.22, 64, 64),
      new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.75, metalness: 0.2, emissive: 0x100702 })
    );
    group.add(globe);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.225, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff9e55, wireframe: true, transparent: true, opacity: 0.15 })
    );
    group.add(wire);

    const mainLight = new THREE.PointLight(0xff9e55, 2.4);
    mainLight.position.set(4, 3, 4);
    scene.add(mainLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const points = [];

    function latLonToVector(lat, lon, radius) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    stories.forEach(story => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xffcf9b })
      );
      marker.position.copy(latLonToVector(story.lat, story.lon, 1.32));
      marker.userData = story;
      group.add(marker);
      points.push(marker);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xff9e55, transparent: true, opacity: 0.22 })
      );
      glow.position.copy(marker.position);
      group.add(glow);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tooltip = $('#globeTip');
    let hovering = false;
    let dragging = false;
    let previousX = 0;
    let hoveredPoint = null;

    canvas.addEventListener('mousemove', event => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(points)[0];

      if (hit) {
        hovering = true;
        hoveredPoint = hit.object;
        if (tooltip) {
          tooltip.style.display = 'block';
          tooltip.style.left = event.clientX - rect.left + 16 + 'px';
          tooltip.style.top = event.clientY - rect.top + 16 + 'px';
          tooltip.innerHTML = `<strong>${hoveredPoint.userData.title}</strong><p>${hoveredPoint.userData.location}</p>`;
        }
      } else {
        hovering = false;
        hoveredPoint = null;
        if (tooltip) tooltip.style.display = 'none';
      }

      if (dragging) {
        group.rotation.y += (event.clientX - previousX) * 0.006;
        previousX = event.clientX;
      }
    });

    canvas.onmousedown = event => {
      dragging = true;
      previousX = event.clientX;
    };

    window.onmouseup = () => dragging = false;

    function animate() {
      requestAnimationFrame(animate);

      if (!hovering && !dragging) group.rotation.y += 0.002;

      points.forEach(point => {
        const scale = point === hoveredPoint ? 1.9 : 1;
        point.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12);
      });

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
  });
}

/* Initialize everything after HTML loads. */
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initFade();
  initForms();
  renderCards();
  renderShop();
  drawConstellation();
  initGlobe();
});



/* ============================================================
   COOKIE CONSENT BANNER
   ------------------------------------------------------------
   Professional prototype cookie banner:
   - Accept all
   - Reject non-essential
   - Manage preferences
   - Saves choice in localStorage

   Production note:
   Connect these preferences to your real analytics/marketing scripts.
   Do not load non-essential analytics or advertising scripts until consent
   is granted where required.
   ============================================================ */

function initCookieConsent() {
  const existingChoice = localStorage.getItem('cookieConsentChoice');
  if (existingChoice) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner-copy">
      <strong>We use cookies</strong>
      <p>We use necessary cookies to run the site and optional cookies to improve the experience, understand traffic, and support future marketing. You can accept, reject, or manage preferences.</p>
    </div>
    <div class="cookie-banner-actions">
      <button class="cookie-btn ghost" data-cookie-manage>Manage Preferences</button>
      <button class="cookie-btn ghost" data-cookie-reject>Reject</button>
      <button class="cookie-btn" data-cookie-accept>Accept</button>
    </div>
  `;

  const modal = document.createElement('div');
  modal.className = 'cookie-modal';
  modal.innerHTML = `
    <div class="cookie-modal-card">
      <button class="cookie-modal-close" aria-label="Close cookie preferences">×</button>
      <p class="kicker">Cookie Preferences</p>
      <h2>Manage Cookies</h2>
      <label><input type="checkbox" checked disabled> Necessary cookies <span>Required for forms, security, login, and cart functions.</span></label>
      <label><input type="checkbox" id="cookieAnalytics"> Analytics cookies <span>Help understand traffic and improve the website.</span></label>
      <label><input type="checkbox" id="cookieMarketing"> Marketing cookies <span>Support advertising, retargeting, and campaign measurement if enabled.</span></label>
      <label><input type="checkbox" id="cookieFunctional"> Functional cookies <span>Remember preferences and improve saved experiences.</span></label>
      <div class="cookie-modal-actions">
        <button class="cookie-btn ghost" data-cookie-save>Save Preferences</button>
        <button class="cookie-btn" data-cookie-accept-modal>Accept All</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
  document.body.appendChild(modal);

  const saveChoice = (choice) => {
    localStorage.setItem('cookieConsentChoice', JSON.stringify({
      ...choice,
      date: new Date().toISOString()
    }));
    banner.remove();
    modal.classList.remove('open');
  };

  banner.querySelector('[data-cookie-accept]').onclick = () => saveChoice({
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true
  });

  banner.querySelector('[data-cookie-reject]').onclick = () => saveChoice({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  banner.querySelector('[data-cookie-manage]').onclick = () => modal.classList.add('open');
  modal.querySelector('.cookie-modal-close').onclick = () => modal.classList.remove('open');

  modal.querySelector('[data-cookie-accept-modal]').onclick = () => saveChoice({
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true
  });

  modal.querySelector('[data-cookie-save]').onclick = () => saveChoice({
    necessary: true,
    analytics: !!document.getElementById('cookieAnalytics')?.checked,
    marketing: !!document.getElementById('cookieMarketing')?.checked,
    functional: !!document.getElementById('cookieFunctional')?.checked
  });
}

function initDataRequestForm() {
  const form = document.getElementById('dataRequestForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const request = Object.fromEntries(new FormData(form).entries());
    save('dataRequests', request);
    form.innerHTML = `
      <div class="success-message">
        <h3>Request saved.</h3>
        <p>This prototype saved the request locally. Before launch, connect this form to a real email inbox, CRM, or privacy request workflow.</p>
      </div>
    `;
  });
}


document.addEventListener('DOMContentLoaded', () => { initCookieConsent(); initDataRequestForm(); });



/* ============================================================
   ELEGANT MOBILE SITE DIRECTORY JS
   ------------------------------------------------------------
   Opens/closes the full site directory on phones.
   Desktop navbar remains unchanged.
   ============================================================ */

function initElegantMobileSiteDirectory() {
  const openBtn =
    document.getElementById("mobileMenuOpen") ||
    document.getElementById("menuOpen");

  const closeBtn = document.getElementById("mobileMenuClose");
  const menu = document.getElementById("mobileSiteMenu");

  if (!openBtn || !closeBtn || !menu) return;

  openBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // If an older mobile menu exists, close it so the new elegant directory is the one users see.
    const oldMenu = document.getElementById("mobileMenu");
    if (oldMenu) oldMenu.classList.remove("open");

    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("mobile-directory-open");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mobile-directory-open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("mobile-directory-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("mobile-directory-open");
    }
  });
}

document.addEventListener("DOMContentLoaded", initElegantMobileSiteDirectory);
