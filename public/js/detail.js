(() => {
    document.getElementById('printBtn')?.addEventListener('click', () => window.print())

    // Tap an ingredient or step to tick it off while cooking
    document.querySelectorAll('.ingredients li, .steps li').forEach(li => {
        li.tabIndex = 0
        li.setAttribute('role', 'checkbox')
        li.setAttribute('aria-checked', 'false')
        const toggle = () => {
            const done = li.classList.toggle('done')
            li.setAttribute('aria-checked', String(done))
        }
        li.addEventListener('click', toggle)
        li.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                toggle()
            }
        })
    })
})()
