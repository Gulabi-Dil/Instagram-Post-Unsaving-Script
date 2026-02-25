function getCookie(name) {
    return document.cookie.split('; ').find(r=>r.startsWith(name+'=')).split('=')[1];
}
const headers = {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'X-IG-App-ID': '936619743392459',
    'X-CSRFToken':getCookie('csrftoken'),
}

// Added: wrapper around fetch that auto-retries on rate limit (572/429) after a 2 min cooldown
async function fetchWithRetry(url, options = {}) {
    while (true) {
        const res = await fetch(url, options);
        if (res.status === 572 || res.status === 429) {
            console.log('Rate limited, cooling down 2 min...');
            await new Promise(resolve => setTimeout(resolve, 120000));
            continue;
        }
        return res;
    }
}

async function unsaveAllPosts() {
    let totalUnsaved = 0;
    let nextMaxId = null;
    while (true) {
        const url = nextMaxId
            ? `/api/v1/feed/saved/posts/?max_id=${nextMaxId}`
            : `/api/v1/feed/saved/posts/`;
        const res = await fetchWithRetry(url, { headers, credentials: 'include' }) // changed: fetch -> fetchWithRetry
        const data = await res.json()
        if (!data.items || data.items.length === 0) {
            console.log(`Done! Total unsaved: ${totalUnsaved}`)
            break;
        }
        for (const item of data.items) {
            const id = item.media.pk
            const unsave = await fetchWithRetry(`/api/v1/web/save/${id}/unsave/`, { // changed: fetch -> fetchWithRetry
                method: 'POST',
                headers,
                credentials: 'include'
            })
            const r = await unsave.json()
            totalUnsaved++
            console.log(`Unsaved ${totalUnsaved}: ${id} — ${r.status}`)
            await new Promise(resolve => setTimeout(resolve, 20))
        }
        if (!data.more_available) {
            console.log(`Done! Total unsaved: ${totalUnsaved}`)
            break;
        }
        nextMaxId = data.next_max_id
        await new Promise(resolve => setTimeout(resolve, 70))
    }
}

await unsaveAllPosts();
