function getCookie(name) {
    return document.cookie.split('; ').find(r=>r.startsWith(name+'=')).split('=')[1];
}

const headers = {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'X-IG-App-ID': '936619743392459',
    'X-CSRFToken':getCookie('csrftoken'),
}

/*
wrote this to get total number of posts because just fetching using
fetch('/api/v1/feed/saved/posts/', {headers}).then(r=> r.json()).then(console.log)
returns only 21. This is because Instagram follows pagination with 21 posts visibale at one time in a page.
*/
async function getAllSaved() {
    let allPosts = [];
    let maxId = null;

    while (true) {
        const url = '/api/v1/feed/saved/posts/' + (maxId ? `?max_id=${maxId}` : '');
        const data = await fetch(url, { headers }).then(r => r.json());

        allPosts = allPosts.concat(data.items ?? []);
        console.log(`Fetched ${allPosts.length} so far...`);

        if (data.more_available && data.next_max_id) {
            maxId = data.next_max_id;
        } else {
            break;
        }
    }

    console.log('Total saved posts:', allPosts.length);
    return allPosts;
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
await getAllSaved();
await unsaveAllPosts()
