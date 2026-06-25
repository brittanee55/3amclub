# File-by-File Notes

## Root files
- `index.html`: Cinematic homepage. Connects to all main sections. Loads `css/style.css` and `js/main.js`.
- `about.html`: Preserves Ashlee’s “Hi, I’m Ashlee” personal brand section and introduces the stronger mission.
- `submissions.html`: Story submission form + Story Constellation preview.
- `contact.html`: Simple contact page that matches the brand.

## CSS
- `css/style.css`: Main visual system: colors, hero, smoke, cards, forms, shop, atlas, constellation, responsive pieces.
- `css/animations.css`: Reserved for extra animation modules.
- `css/responsive.css`: Reserved for mobile-specific overrides.

## JavaScript
- `js/main.js`: The brain of the prototype. Handles mobile menu, scroll animations, forms, saved entries, story matching, constellation, shop rendering, and 3D globe.
- Other JS files are placeholders for future separation. For now, most code lives in `main.js` so it is easier to understand.

## Data
- `data/stories.json`: Starter story/case records used by story cards, the matching feature, and the globe.
- `data/products.json`: Starter merch/shop records used by the shop page.

## Assets
- `assets/images/site/`: Reference screenshots and generated UI imagery.
- `assets/images/merch/`: Merch images inspired by the existing shop direction.
- `assets/images/site/hero-forest-campfire.svg`: Lightweight hero art used for the homepage background.

## Feature folders
Each folder contains a landing page plus future pages. The future pages use the same shared CSS/JS and are ready to expand.
