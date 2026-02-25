async function getAllSaved() {
    let allPosts = [];
    let maxId = null;
    while (true) {
        const url = '/api/v1/feed/saved/posts/' + (maxId ? `?max_id=${maxId}` : '');
        const data = await fetchWithRetry(url, { headers }).then(r => r.json()); // changed: fetch -> fetchWithRetry
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

await getAllSaved();
