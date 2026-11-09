import { html } from 'hono/html'
import { Layout } from './Layout'

export function NotFound(heading = 'Recipe not found', message = "That page doesn't exist, or the recipe has been renamed.") {
    return Layout({
        title: `${heading} · Chal's Recipes`,
        page: 'error',
        body: html`
            <div class="empty-state">
                <h1>${heading}</h1>
                <p>${message}</p>
                <a href="/" class="button">Browse all recipes</a>
            </div>
        `,
    })
}
