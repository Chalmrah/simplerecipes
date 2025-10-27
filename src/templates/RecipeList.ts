import { html } from 'hono/html'
import type { Recipe } from '../types'

export function RecipeList(recipes: [string, Recipe][]) {
    return html`
        <!DOCTYPE html>
        <html lang="en" data-theme="auto">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Recipe Collection</title>
            <style>
                :root {
                    --bg-primary: #ffffff;
                    --bg-secondary: #f8f9fa;
                    --text-primary: #212529;
                    --text-secondary: #6c757d;
                    --border-color: #dee2e6;
                    --accent-color: #0066cc;
                    --shadow: rgba(0, 0, 0, 0.1);
                    --card-bg: #ffffff;
                    --input-bg: #ffffff;
                }

                [data-theme="dark"] {
                    --bg-primary: #1a1a1a;
                    --bg-secondary: #2d2d2d;
                    --text-primary: #e9ecef;
                    --text-secondary: #adb5bd;
                    --border-color: #495057;
                    --accent-color: #4da6ff;
                    --shadow: rgba(0, 0, 0, 0.4);
                    --card-bg: #2d2d2d;
                    --input-bg: #2d2d2d;
                }

                @media (prefers-color-scheme: dark) {
                    [data-theme="auto"] {
                        --bg-primary: #1a1a1a;
                        --bg-secondary: #2d2d2d;
                        --text-primary: #e9ecef;
                        --text-secondary: #adb5bd;
                        --border-color: #495057;
                        --accent-color: #4da6ff;
                        --shadow: rgba(0, 0, 0, 0.4);
                        --card-bg: #2d2d2d;
                        --input-bg: #2d2d2d;
                    }
                }

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    max-width: 1200px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    transition: background-color 0.3s, color 0.3s;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                h1 {
                    margin: 0;
                }

                .theme-toggle {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 0.5rem;
                    cursor: pointer;
                    display: flex;
                    gap: 0.5rem;
                    transition: background-color 0.2s;
                }

                .theme-toggle:hover {
                    background: var(--border-color);
                }

                .theme-btn {
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 1.2rem;
                    opacity: 0.5;
                    transition: opacity 0.2s, background-color 0.2s;
                }

                .theme-btn.active {
                    opacity: 1;
                    background: var(--accent-color);
                }

                .subtitle {
                    color: var(--text-secondary);
                    margin-bottom: 1.5rem;
                }

                .search-container {
                    margin-bottom: 2rem;
                }

                .search-bar {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--input-bg);
                    color: var(--text-primary);
                    transition: border-color 0.2s;
                }

                .search-bar:focus {
                    outline: none;
                    border-color: var(--accent-color);
                }

                .search-bar::placeholder {
                    color: var(--text-secondary);
                }

                .results-info {
                    margin-top: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .recipe-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .recipe-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1.5rem;
                    transition: box-shadow 0.2s, border-color 0.2s;
                    cursor: pointer;
                }

                .recipe-card:hover {
                    box-shadow: 0 4px 12px var(--shadow);
                    border-color: var(--accent-color);
                }

                .recipe-card.hidden {
                    display: none;
                }

                .recipe-card h2 {
                    margin: 0 0 0.75rem 0;
                    color: var(--text-primary);
                    font-size: 1.25rem;
                }

                .recipe-meta {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    line-height: 1.8;
                }

                .recipe-meta div {
                    margin-bottom: 0.25rem;
                }

                .recipe-tags {
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border-color);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                a {
                    text-decoration: none;
                    color: inherit;
                }

                .spice {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .spice-none { color: var(--text-secondary); }
                .spice-mild { color: #28a745; }
                .spice-medium { color: #ffc107; }
                .spice-hot { color: #fd7e14; }
                .spice-extra-hot { color: #dc3545; }

                .no-results {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-secondary);
                    grid-column: 1 / -1;
                }

                .no-results.hidden {
                    display: none;
                }
            </style>
        </head>
        <body>
        <div class="header">
            <h1>🍳 Recipe Collection</h1>
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
                return html`
                    <a href="/recipe/${id}">
                        <div
                                class="recipe-card"
                                data-title="${recipe.title.toLowerCase()}"
                                data-tags="${tagsString}"
                        >
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

            // Load saved theme or default to auto
            const savedTheme = localStorage.getItem('theme') || 'auto';
            html.setAttribute('data-theme', savedTheme);

            // Update active button
            themeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === savedTheme);
            });

            // Theme button click handlers
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

                    card.classList.toggle('hidden', !matches);
                    if (matches) visibleCount++;
                });

                // Update results info
                if (searchTerm) {
                    resultsInfo.textContent = \`Showing \${visibleCount} of \${totalRecipes} recipes\`;
                } else {
                    resultsInfo.textContent = '';
                }

                // Show/hide no results message
                noResults.classList.toggle('hidden', visibleCount > 0);
            }

            searchInput.addEventListener('input', updateSearch);

            // Optional: Add keyboard shortcut (Ctrl/Cmd + K) to focus search
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