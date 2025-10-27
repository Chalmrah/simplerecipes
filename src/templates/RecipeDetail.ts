import { html } from 'hono/html'
import type { Recipe } from '../types'

function getSpiceDots(spiceLevel: string) {
    const levels = ['none', 'mild', 'medium', 'hot', 'extra hot']
    const activeLevel = levels.indexOf(spiceLevel)
    return levels.map((_, index) =>
        `<span class="spice-dot ${index <= activeLevel ? 'active' : ''}"></span>`
    ).join('')
}

export function RecipeDetail(recipe: Recipe) {
    return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${recipe.title}</title>
        <style>
          :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --text-primary: #212529;
            --text-secondary: #6c757d;
            --border-color: #dee2e6;
            --accent-color: #0066cc;
            --shadow: rgba(0, 0, 0, 0.1);
            --tag-bg: #e9ecef;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-primary: #1a1a1a;
              --bg-secondary: #2d2d2d;
              --text-primary: #e9ecef;
              --text-secondary: #adb5bd;
              --border-color: #495057;
              --accent-color: #4da6ff;
              --shadow: rgba(0, 0, 0, 0.4);
              --tag-bg: #343a40;
            }
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: background-color 0.3s, color 0.3s;
          }

          h1 {
            margin-bottom: 1rem;
            color: var(--text-primary);
          }

          h2 {
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
          }

          h3 {
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
          }

          .meta {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            color: var(--text-secondary);
            flex-wrap: wrap;
          }

          .meta span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin: 1rem 0;
          }

          .tag {
            background: var(--tag-bg);
            color: var(--text-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            border: 1px solid var(--border-color);
          }

          section {
            margin: 2rem 0;
            padding: 1.5rem;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
          }

          ul, ol {
            margin-left: 1.5rem;
            margin-top: 0.5rem;
          }

          li {
            margin-bottom: 0.5rem;
          }

          li strong {
            color: var(--accent-color);
          }

          a {
            color: var(--accent-color);
            text-decoration: none;
            transition: opacity 0.2s;
          }

          a:hover {
            opacity: 0.8;
            text-decoration: underline;
          }

          .back-link {
            display: inline-block;
            margin-top: 2rem;
            padding: 0.5rem 1rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }

          .spice-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
          }

          .spice-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--text-secondary);
          }

          .spice-dot.active {
            background: #dc3545;
          }
        </style>
      </head>
      <body>
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
      </body>
    </html>
  `
}