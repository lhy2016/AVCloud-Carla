export function getCookie(key) {
    var ret = {}
    var cookie = document.cookie.split(";");
    for (var pair of cookie) {
        pair = pair.trim()
        var arr = pair.split("=")
        ret[arr[0]] = arr[1]
    }
    return ret[key]
}