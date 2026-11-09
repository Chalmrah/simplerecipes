import { html, raw } from 'hono/html'
import type { Recipe, SpiceLevel } from '../types'
import { icons } from './icons'

const SPICE_LEVELS: SpiceLevel[] = ['none', 'mild', 'medium', 'hot', 'extra hot']

export function spiceClass(level: SpiceLevel) {
    return `spice-${level.replace(' ', '-')}`
}

/** Four chillies, filled up to the recipe's heat level. */
export function SpiceMeter(level: SpiceLevel) {
    const active = SPICE_LEVELS.indexOf(level)
    const label = level === 'none' ? 'Not spicy' : `Spice: ${level}`
    return html`
        <span class="spice ${spiceClass(level)}" title="${label}">
            ${icons.flame()}
            <span class="spice-label">${level === 'none' ? 'No heat' : level}</span>
            <span class="spice-dots" aria-hidden="true">${raw(
                SPICE_LEVELS.slice(1).map((_, i) => `<span class="spice-dot${i < active ? ' active' : ''}"></span>`).join('')
            )}</span>
        </span>
    `
}

export function MetaRow(recipe: Recipe) {
    return html`
        <span class="meta-item">${icons.clock()} ${recipe.total_time}</span>
        <span class="meta-item">${icons.serves()} Serves ${recipe.serving_size}</span>
        <span class="meta-item">${SpiceMeter(recipe.spice_index)}</span>
    `
}

// Stable per-recipe hue for the no-photo fallback, so cards without images still look distinct
function hueFor(text: string) {
    let hash = 0
    for (const ch of text) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0
    return [18, 32, 145, 200, 265, 340][hash % 6]
}

export function RecipeImage(recipe: Recipe, variant: 'thumbnail' | 'detail', className: string) {
    if (recipe.image) {
        return html`<img
            src="/${recipe.image}/${variant}.webp"
            alt=""
            class="${className}"
            ${variant === 'thumbnail' ? raw('loading="lazy" decoding="async" width="640" height="480"') : raw('fetchpriority="high" width="1200" height="675"')}
        />`
    }
    return html`<div class="${className} image-fallback" style="--hue: ${hueFor(recipe.title)}" aria-hidden="true">
        <span>${recipe.title.charAt(0)}</span>
    </div>`
}
