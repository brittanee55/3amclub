# How the DO GOOD, STAY BAD / 3AM Club Prototype Connects

This project keeps Ashlee’s current public-facing brand structure and adds an interactive ecosystem around it.

## Main Flow

1. **index.html** is the front door. It preserves the campfire/night-sky feel and sends users into three paths:
   - **Stories** = episodes, submissions, case files.
   - **Vault** = journals, planners, workbooks, saved entries.
   - **Archive / Atlas** = 3D globe, lore, location networks, timelines.

2. **submissions.html** is where people share stories. The form saves locally in the browser and then connects the entry to the **Story Constellation** idea.

3. **constellation/** is the “you are not alone” layer. It groups similar experiences by words, tags, themes, and story patterns.

4. **atlas/** is the location layer. The 3D globe uses story data from `data/stories.json`. Each point can represent a submitted story, episode, entity, or location.

5. **vault/** and **planners/** are the interactive tools layer. They give users journals, mystery trackers, reflection tools, and workbooks that save using `localStorage`.

6. **community/** is the collaboration layer. It contains fan theories, discussion rooms, polls, leaderboards, and investigation rooms.

7. **shop/** keeps her current merch direction and adds future products like companion books, workbooks, journals, planners, bundles, and mystery boxes.

8. **patreon/** is the premium access layer. It gives a place for locked case files, bonus episodes, early access, private Discord, and premium companion books.

## Data Flow

- Static starter stories live in `data/stories.json`.
- Static starter merch lives in `data/products.json`.
- User-created entries are stored in the browser with `localStorage`.
- `js/main.js` reads those files and storage entries, then renders cards, saved entries, the constellation, and the globe.

## Important Prototype Note

This is a front-end prototype. It saves user entries only on the browser/device that typed them. For a real app, localStorage would be replaced by Firebase, Supabase, PostgreSQL, or another backend database.
