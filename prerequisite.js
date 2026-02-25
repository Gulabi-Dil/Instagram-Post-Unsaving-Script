function getCookie(name) {
    return document.cookie.split('; ').find(r=>r.startsWith(name+'=')).split('=')[1];
}
const headers = {
    'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'X-IG-App-ID': '936619743392459',
    'X-CSRFToken':getCookie('csrftoken'),
}
