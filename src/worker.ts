import { Hono } from 'hono'
import { RecipeList } from './templates/RecipeList'
import { RecipeDetail } from './templates/RecipeDetail'
import { NotFound } from './templates/NotFound'
import recipes from '../recipes.json'
import buildInfo from '../build-info.json'
import type { RecipeCollection } from './types'

const typedRecipes = recipes as RecipeCollection

// Built once per isolate; recipes.json is static for the lifetime of a deploy
const sortedEntries = Object.entries(typedRecipes)
    .sort(([, a], [, b]) => a.title.localeCompare(b.title))

const app = new Hono()

app.use('*', async (c, next) => {
    await next()
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    if (c.res.status === 200) {
        c.header('Cache-Control', 'public, max-age=300')
    }
})

app.get('/', (c) => c.html(RecipeList(sortedEntries, buildInfo)))

app.get('/recipe/:id', (c) => {
    const id = c.req.param('id')
    // hasOwn so ids like "constructor" don't resolve to Object.prototype members
    if (!Object.hasOwn(typedRecipes, id)) {
        return c.notFound()
    }
    return c.html(RecipeDetail(typedRecipes[id]))
})

app.notFound((c) => c.html(NotFound(), 404))

app.onError((err, c) => {
    console.error(err)
    return c.html(NotFound('Something went wrong', 'That page failed to load. Try again in a moment.'), 500)
})

export default app
