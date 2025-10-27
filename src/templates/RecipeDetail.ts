import { html, raw } from 'hono/html'
import type { Recipe } from '../types'

function getSpiceDots(spiceLevel: string) {
    const levels = ['none', 'mild', 'medium', 'hot', 'extra hot']
    const activeLevel = levels.indexOf(spiceLevel)
    return raw(levels.map((_, index) =>
        `<span class="spice-dot ${index <= activeLevel ? 'active' : ''}"></span>`
    ).join(''))
}

export function RecipeDetail(recipe: Recipe) {
    const imagePath = recipe.image ? `/${recipe.image}/detail.webp` : '/img/placeholder.webp'

    return html`
        <!DOCTYPE html>
        <html lang="en" data-theme="auto">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${recipe.title}</title>
            <link rel="stylesheet" href="/css/base.css" />
            <link rel="stylesheet" href="/css/detail.css" />
        </head>
        <body>
        <div class="theme-toggle">
            <button class="theme-btn" data-theme="light" title="Light mode">☀️</button>
            <button class="theme-btn active" data-theme="auto" title="Auto (System)">⚙️</button>
            <button class="theme-btn" data-theme="dark" title="Dark mode">🌙</button>
        </div>

        <img
                src="${imagePath}"
                alt="${recipe.title}"
                class="recipe-header-image"
        />

        <h1>${recipe.title}</h1>

        <div class="meta">
            <span>⏱️ ${recipe.total_time}</span>
            <span>🍽️ Serves ${recipe.serving_size}</span>
            <span class="spice-indicator">
            🌶️ ${recipe.spice_index}
            ${getSpiceDots(recipe.spice_index)}
          </span>
        </div>

        <div class="tags">
            ${recipe.tags.map(tag => html`<span class="tag">${tag}</span>`)}
        </div>

        ${recipe.components.map(component => html`
            <section>
                <h2>${component.name}</h2>

                <h3>Ingredients</h3>
                <ul>
                    ${component.ingredients.map(ing => html`
                        <li><strong>${ing.quantity}</strong> ${ing.item}</li>
                    `)}
                </ul>

                <h3>Method</h3>
                <ol>
                    ${component.method.map(step => html`<li>${step}</li>`)}
                </ol>
            </section>
        `)}

        ${recipe.plating && recipe.plating.length > 0 ? html`
            <section>
                <h2>Plating</h2>
                <ol>
                    ${recipe.plating.map(step => html`<li>${step}</li>`)}
                </ol>
            </section>
        ` : ''}

        <a href="/" class="back-link">← Back to all recipes</a>

        <script>
            const html = document.documentElement;
            const themeButtons = document.querySelectorAll('.theme-btn');

            const savedTheme = localStorage.getItem('theme') || 'auto';
            html.setAttribute('data-theme', savedTheme);

            themeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === savedTheme);
            });

            themeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    html.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);

                    themeButtons.forEach(b => {
                        b.classList.toggle('active', b.dataset.theme === theme);
                    });
                });
            });
        </script>
        </body>
        </html>
    `
}