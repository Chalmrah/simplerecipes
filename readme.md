# Cook.Chalmrah.co.uk

Recipe website on Cloudflare Workers with search, themes, and image optimization.

## Setup

```bash
npm install
npx wrangler login
npm run dev  # http://localhost:8787
```

## Add a Recipe

1. **Create `recipes/recipe-name.yaml`**
   ```yaml
   title: Recipe Name
   total_time: 30 minutes
   serving_size: 4
   spice_index: medium        # none|mild|medium|hot|extra hot
   image: img/recipe-name
   tags:
     - category
     - type
   
   components:
     - name: Main
       ingredients:
         - item: ingredient
           quantity: 200g
       method:
         - Step 1
         - Step 2
   ```

2. **Add images to `images/source/recipe-name/`** (png, jpg or webp)
    - `detail.jpg` (required; cropped to 16:9 for the recipe page)
    - `thumbnail.jpg` (optional; cropped to 4:3 for the card, defaults to the detail image)

   Leave out `image:` (or the folder) and the recipe gets a coloured letter tile instead.

3. **Test**
   ```bash
   npm run validate
   npm run dev
   ```

## Deploy

```bash
npm run deploy
```

## Commands

- `npm run validate` - Check recipes against the schema and image folders
- `npm run dev` - Build once, then serve on http://localhost:8787
- `npm run dev:watch` - Same, but rebuilds when a recipe YAML changes (a broken YAML keeps the last good build)
- `npm run typecheck` - TypeScript check
- `npm run deploy` - Deploy to Cloudflare