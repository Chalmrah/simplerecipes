import { html } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'
import { icons } from './icons'

type Content = HtmlEscapedString | Promise<HtmlEscapedString>

interface LayoutProps {
    title: string
    description?: string
    page: 'list' | 'detail' | 'error'
    body: Content
    scripts?: string[]
}

export function Layout({ title, description, page, body, scripts = [] }: LayoutProps) {
    return html`<!DOCTYPE html>
<html lang="en" data-theme="auto">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${description ? html`<meta name="description" content="${description}" />` : ''}
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#faf7f2" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#171513" media="(prefers-color-scheme: dark)" />
    <script>try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'auto'}catch(e){}</script>
    <link rel="stylesheet" href="/css/base.css" />
    ${page === 'error' ? '' : html`<link rel="stylesheet" href="/css/${page}.css" />`}
</head>
<body class="page-${page}">
    <header class="site-header">
        <a href="/" class="brand">Chal's Recipes</a>
        <div class="theme-toggle" role="group" aria-label="Colour theme">
            <button type="button" class="theme-btn" data-theme="light" title="Light" aria-label="Light theme">${icons.sun()}</button>
            <button type="button" class="theme-btn" data-theme="auto" title="Match system" aria-label="Match system theme">${icons.auto()}</button>
            <button type="button" class="theme-btn" data-theme="dark" title="Dark" aria-label="Dark theme">${icons.moon()}</button>
        </div>
    </header>
    <main class="container">
        ${body}
    </main>
    <script src="/js/theme.js" defer></script>
    ${scripts.map(src => html`<script src="${src}" defer></script>`)}
</body>
</html>`
}
