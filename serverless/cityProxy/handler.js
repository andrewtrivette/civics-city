var https = require('https');
var crypto = require('crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function get( opts ) {
    return new Promise((resolve, reject) => {
        https.get(opts, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    resolve(rawData);
                } catch (e) {
                    reject(e.message);
                }
            });
        }).on('error', (e) => {
            reject(e);
        });
    })
}

exports.handler = async (event) => {
    var part1 = "QFpCwKfd7"
    var part2 = "fjVEXFFwSu36BwwcP83xYgxLAhLYmKk"
    var part3 = "letvarconst"
    var timestamp = Date.now();
    var key = part1 + part2 + part3 + timestamp;

    var hash = crypto.createHash('sha512').update(key, 'utf-8').digest('hex');

    var auth = await get({
        hostname: 'www.legis.ga.gov',
        path: '/api/authentication/token?key='+hash+'&ms='+timestamp
    });
    var startDate = new Date('2022-08-20');
    var data = await get({
        hostname: 'www.legis.ga.gov',
        path: '/api/meetings?startDate='+encodeURIComponent(startDate.toDateString()), //Mon%20Aug%2029%202022',
        headers: {
            'Authorization': 'Bearer '+JSON.parse(auth)
        }
    });
    return data;
};