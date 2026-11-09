(() => {
    const input = document.getElementById('searchInput')
    const info = document.getElementById('resultsInfo')
    const empty = document.getElementById('noResults')
    const cards = Array.from(document.querySelectorAll('.recipe-card'))
    if (!input) return

    function update() {
        // Every word must appear somewhere in title, tags or ingredients
        const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean)
        let visible = 0

        for (const card of cards) {
            const haystack = card.dataset.search || ''
            const match = terms.every(term => haystack.includes(term))
            card.hidden = !match
            if (match) visible++
        }

        info.textContent = terms.length ? `Showing ${visible} of ${cards.length}` : ''
        empty.hidden = visible > 0
    }

    input.addEventListener('input', update)

    // Restore a search after back-navigation (browsers keep the input value)
    if (input.value) update()

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault()
            input.focus()
            input.select()
        } else if (e.key === 'Escape' && document.activeElement === input && input.value) {
            input.value = ''
            update()
        }
    })
})()
