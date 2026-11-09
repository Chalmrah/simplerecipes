import { raw } from 'hono/html'

// Inline SVG icons (Lucide-style strokes) so they inherit currentColor and render the same everywhere
const svg = (body: string, label?: string) => raw(
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'}>${body}</svg>`
)

export const icons = {
    clock: () => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    serves: () => svg('<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.5"/><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35"/><path d="M15.5 4.65a3.5 3.5 0 0 1 0 6.7"/>'),
    flame: () => svg('<path d="M12 22c4 0 7-2.8 7-6.8 0-3.2-2-5.7-3.6-7.4-.4 1.7-1.4 3-2.9 3.7.3-3.3-1.3-6.6-4-8.5.2 3.1-1.3 5.2-2.7 6.9C4.6 11.4 5 13.4 5 15.2 5 19.2 8 22 12 22z"/>'),
    search: () => svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    back: () => svg('<path d="M15 18l-6-6 6-6"/>'),
    print: () => svg('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    sun: () => svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: () => svg('<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'),
    auto: () => svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'),
}
