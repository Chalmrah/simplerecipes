(() => {
    const root = document.documentElement
    const buttons = document.querySelectorAll('.theme-btn')

    function apply(theme) {
        root.dataset.theme = theme
        buttons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme)))
    }

    apply(root.dataset.theme || 'auto')

    buttons.forEach(btn => btn.addEventListener('click', () => {
        apply(btn.dataset.theme)
        try { localStorage.setItem('theme', btn.dataset.theme) } catch (e) { /* private mode */ }
    }))
})()
