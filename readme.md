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

2. **Add images to `images/source/recipe-name/`**
    - `detail.png` (required)
    - `thumbnail.png` (optional)

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

- `npm run validate` - Check recipes
- `npm run dev` - Local server
- `npm run deploy` - Deploy to Cloudflare