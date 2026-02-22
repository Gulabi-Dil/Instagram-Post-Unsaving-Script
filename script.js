function getCookie(name) {
    return document.cookie.split('; ').find(r=>r.startsWith(name+'=')).split('=')[1];
}

const headers = {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'X-IG-App-ID': '936619743392459',
    'X-CSRFToken':getCookie('csrftoken'),
}

async function unsaveAllPosts() {
    let totalUnsaved = 0;
    let nextMaxId = null;
    while (true) {
        const url = nextMaxId
            ? `/api/v1/feed/saved/posts/?max_id=${nextMaxId}`
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
