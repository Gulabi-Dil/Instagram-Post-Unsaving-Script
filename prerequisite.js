function getCookie(name) {
    return document.cookie.split('; ').find(r=>r.startsWith(name+'=')).split('=')[1];
}
const headers = {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'X-IG-App-ID': '936619743392459',
    'X-CSRFToken':getCookie('csrftoken'),
}

// Added: wrapper around fetch that auto-retries on rate limit (572/429) after a 3 min cooldown
async function fetchWithRetry(url, options = {}) {
    while (true) {
        const res = await fetch(url, options);
        if (res.status === 572 || res.status === 429) {
            console.log('Rate limit reached! Cooling down for 3 min...');
            await new Promise(resolve => setTimeout(resolve, 180000));
            continue;
        }
        return res;
    }
}
