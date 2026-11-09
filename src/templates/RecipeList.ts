import { html } from 'hono/html'
import type { BuildInfo, Recipe } from '../types'
import { icons } from './icons'
import { Layout } from './Layout'
import { MetaRow, RecipeImage } from './shared'

function searchText(recipe: Recipe) {
    const ingredients = recipe.components.flatMap(c => c.ingredients.map(i => i.item))
    return [recipe.title, ...(recipe.tags ?? []), ...ingredients].join(' ').toLowerCase()
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
})

export function RecipeList(recipes: [string, Recipe][], build: BuildInfo) {
    return Layout({
        title: "Chal's Recipes",
        description: `${recipes.length} home-cooked recipes`,
        page: 'list',
        scripts: ['/js/search.js'],
        body: html`
            <div class="intro">
                <h1>What are we cooking?</h1>
                <p class="subtitle">${recipes.length} recipes</p>
            </div>

            <div class="search" role="search">
                <label for="searchInput" class="visually-hidden">Search recipes</label>
                ${icons.search()}
                <input
                    type="search"
                    class="search-input"
                    id="searchInput"
                    placeholder="Search by name, tag or ingredient"
                    autocomplete="off"
                    spellcheck="false"
                />
                <kbd class="search-hint">Ctrl K</kbd>
            </div>
            <p class="results-info" id="resultsInfo" aria-live="polite"></p>

            <ul class="recipe-grid" id="recipeGrid">
                ${recipes.map(([id, recipe]) => html`
                    <li class="recipe-card" data-search="${searchText(recipe)}">
                        <a href="/recipe/${id}" class="recipe-link">
                            <div class="recipe-media">
                                ${RecipeImage(recipe, 'thumbnail', 'recipe-image')}
                            </div>
                            <div class="recipe-content">
                                <h2>${recipe.title}</h2>
                                <div class="meta">${MetaRow(recipe)}</div>
                                ${recipe.tags?.length ? html`
                                    <ul class="tags">
                                        ${recipe.tags.map(tag => html`<li class="tag">${tag}</li>`)}
                                    </ul>
                                ` : ''}
                            </div>
                        </a>
                    </li>
                `)}
            </ul>

            <div class="empty-state" id="noResults" hidden>
                <h2>No recipes match</h2>
                <p>Try an ingredient, a tag like “vegetarian”, or a shorter search.</p>
            </div>

            <footer class="about">
                <p class="build">
                    Built <time datetime="${build.builtAt}">${dateFormat.format(new Date(build.builtAt))}</time>
                    · commit <code>${build.commit}</code>
                </p>
            </footer>
        `,
    })
}
