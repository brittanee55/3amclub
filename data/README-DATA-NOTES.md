# Data Folder Notes

JSON files cannot safely contain comments, so notes live here instead.

## stories.json
Used by:
- Homepage "Live From The Archive" cards
- Story matching / Story Constellation
- 3D globe pins

Important fields:
- `title`: Display title.
- `category`: Used for filtering/grouping.
- `location`: Display location.
- `lat` / `lon`: Globe coordinates.
- `tags`: Visible themes.
- `matches`: Keywords used for similar-experience matching.

## products.json
Used by:
- shop/shop-home.html
- js/main.js renderShop()

Important fields:
- `name`: Product title.
- `category`: Apparel, mug, hat, digital, etc.
- `price`: Display price.
- `image`: Relative image path.
