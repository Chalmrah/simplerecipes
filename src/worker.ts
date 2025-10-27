import { Hono } from 'hono'
import { RecipeList } from './templates/RecipeList'
import { RecipeDetail } from './templates/RecipeDetail'
import recipes from '../recipes.json'  // Changed path - now outside src/
import type { RecipeCollection } from './types'

const app = new Hono()

const typedRecipes = recipes as RecipeCollection

app.get('/', (c) => {
    const recipeEntries = Object.entries(typedRecipes)
    return c.html(RecipeList(recipeEntries))
})

app.get('/recipe/:id', (c) => {
    const recipe = typedRecipes[c.req.param('id')]
    if (!recipe) {
        return c.notFound()
    }
    return c.html(RecipeDetail(recipe))
})

export default app