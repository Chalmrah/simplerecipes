import { html } from 'hono/html'
import type { Recipe } from '../types'
import { icons } from './icons'
import { Layout } from './Layout'
import { MetaRow, RecipeImage } from './shared'

export function RecipeDetail(recipe: Recipe) {
    const multiple = recipe.components.length > 1

    return Layout({
        title: `${recipe.title} · Chal's Recipes`,
        description: `${recipe.title}: ${recipe.total_time}, serves ${recipe.serving_size}`,
        page: 'detail',
        scripts: ['/js/detail.js'],
        body: html`
            <nav class="toolbar">
                <a href="/" class="button button-ghost">${icons.back()} All recipes</a>
                <button type="button" class="button button-ghost" id="printBtn">${icons.print()} Print</button>
            </nav>

            <article class="recipe">
                <header class="recipe-header">
                    ${RecipeImage(recipe, 'detail', 'recipe-hero')}
                    <h1>${recipe.title}</h1>
                    <div class="meta">${MetaRow(recipe)}</div>
                    ${recipe.tags?.length ? html`
                        <ul class="tags">
                            ${recipe.tags.map(tag => html`<li class="tag">${tag}</li>`)}
                        </ul>
                    ` : ''}
                </header>

                ${recipe.components.map(component => html`
                    <section class="component">
                        ${multiple ? html`<h2 class="component-title">${component.name}</h2>` : ''}
                        <div class="component-body">
                            <div class="ingredients">
                                <h3>Ingredients</h3>
                                <ul>
                                    ${component.ingredients.map(ing => html`
                                        <li>
                                            <span class="qty">${ing.quantity}</span>
                                            <span class="item">${ing.item}</span>
                                        </li>
                                    `)}
                                </ul>
                            </div>
                            <div class="method">
                                <h3>Method</h3>
                                <ol class="steps">
                                    ${component.method.map(step => html`<li>${step}</li>`)}
                                </ol>
                            </div>
                        </div>
                    </section>
                `)}

                ${recipe.plating?.length ? html`
                    <section class="component plating">
                        <h2 class="component-title">To serve</h2>
                        <ol class="steps">
                            ${recipe.plating.map(step => html`<li>${step}</li>`)}
                        </ol>
                    </section>
                ` : ''}
            </article>

            <a href="/" class="button button-ghost back-bottom">${icons.back()} Back to all recipes</a>
        `,
    })
}
