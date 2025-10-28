import { html } from 'hono/html'
import type { Recipe } from '../types'

export function RecipeList(recipes: [string, Recipe][]) {
    return html`
        <!DOCTYPE html>
        <html lang="en" data-theme="auto">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Chal's Recipes</title>
            <link rel="stylesheet" href="/css/base.css" />
            <link rel="stylesheet" href="/css/list.css" />
        </head>
        <body>
        <div class="header">
            <h1>Chal's Recipes</h1>
            <div class="theme-toggle">
                <button class="theme-btn" data-theme="light" title="Light mode">☀️</button>
                <button class="theme-btn active" data-theme="auto" title="Auto (System)">⚙️</button>
                <button class="theme-btn" data-theme="dark" title="Dark mode">🌙</button>
            </div>
        </div>
        <p class="subtitle">Total recipes: ${recipes.length}</p>

        <div class="search-container">
            <input
                    type="text"
                    class="search-bar"
                    id="searchInput"
                    placeholder="Search recipes by name or tags..."
                    autocomplete="off"
            />
            <div class="results-info" id="resultsInfo"></div>
        </div>

        <div class="recipe-grid" id="recipeGrid">
            ${recipes.map(([id, recipe]) => {
                const spiceClass = `spice-${recipe.spice_index.replace(' ', '-')}`
                const tagsString = recipe.tags.join(',').toLowerCase()
                const imagePath = recipe.image ? `/${recipe.image}/thumbnail.webp` : '/img/placeholder.webp'

                return html`
                    <a href="/recipe/${id}">
                        <div
                                class="recipe-card"
                                data-title="${recipe.title.toLowerCase()}"
                                data-tags="${tagsString}"
                        >
                            <img
                                    src="${imagePath}"
                                    alt="${recipe.title}"
                                    class="recipe-image"
                                    loading="lazy"
                            />
                            <div class="recipe-content">
                                <h2>${recipe.title}</h2>
                                <div class="recipe-meta">
                                    <div>⏱️ ${recipe.total_time}</div>
                                    <div>🍽️ Serves ${recipe.serving_size}</div>
                                    <div class="${spiceClass}">
                                        🌶️ ${recipe.spice_index}
                                    </div>
                                </div>
                                <div class="recipe-tags">
                                    ${recipe.tags.join(' • ')}
                                </div>
                            </div>
                        </div>
                    </a>
                `
            })}
            <div class="no-results hidden" id="noResults">
                <h3>No recipes found</h3>
                <p>Try a different search term</p>
            </div>
        </div>

        <script>
            // Theme toggle functionality
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

            // Search functionality
            const searchInput = document.getElementById('searchInput');
            const recipeCards = document.querySelectorAll('.recipe-card');
            const resultsInfo = document.getElementById('resultsInfo');
            const noResults = document.getElementById('noResults');
            const totalRecipes = recipeCards.length;

            function updateSearch() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                let visibleCount = 0;

                recipeCards.forEach(card => {
                    const title = card.dataset.title;
                    const tags = card.dataset.tags;
                    const matches = title.includes(searchTerm) || tags.includes(searchTerm);

                    card.parentElement.classList.toggle('hidden', !matches);
                    if (matches) visibleCount++;
                });

                if (searchTerm) {
                    resultsInfo.textContent = \`Showing \${visibleCount} of \${totalRecipes} recipes\`;
                } else {
                    resultsInfo.textContent = '';
                }

                noResults.classList.toggle('hidden', visibleCount > 0);
            }

            searchInput.addEventListener('input', updateSearch);

            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        </script>
        </body>
        </html>
    `
}