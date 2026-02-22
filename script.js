async function unsaveAllPosts() {
    let totalUnsaved = 0;
    let nextId = null;
    while (true) {
        const url = nextId
            ? `/api/v1/feed/saved/posts/?max_id=${nextId}`
            : `/api/v1/feed/saved/posts/`;

        const res = await fetch(url, { headers, credentials: 'include' })
        const data = await res.json()

        if (!data.items || data.items.length === 0) {
            console.log(`Done! Total unsaved: ${totalUnsaved}`)
            break;
        }

        for (const item of data.items) {
            const id = item.media.pk
            const unsave = await fetch(`/api/v1/web/save/${id}/unsave/`, {
                method: 'POST',
                headers,
                credentials: 'include'
            })
            const r = await unsave.json()
            totalUnsaved++
            console.log(`Unsaved ${totalUnsaved}: ${id} — ${r.status}`)
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        if (!data.more_available) {
            console.log(`Done! Total unsaved: ${totalUnsaved}`)
            break;
        }

        nextMaxId = data.next_max_id
        await new Promise(resolve => setTimeout(resolve, 1000)) //if instagram logs out, then change to 1500 to prevent breaching the rate limit
    }
}

unsaveAllPosts()
