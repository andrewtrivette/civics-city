export function get( url, callback )
{
    fetch(url)
    .then(function(res) {
        return res.json()
    })
    .then(callback);
}

export function getCSV( url, callback )
{
    fetch(url)
    .then(function(res) {
        return res.text()
    })
    .then(function(text) {
        var csv = text.split("\n");
        var headers = csv.shift().split(',');
        csv = csv.map((row, index) => {
            var cols = row.split(',');
            var tempRow = cols.map((col, i) => {
                return [ headers[i], col]
            });
            return Object.fromEntries(tempRow);
        })
        callback(csv);
    });
}

export function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
export function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
export function deleteCookie(name) { setCookie(name, '', -1); }
