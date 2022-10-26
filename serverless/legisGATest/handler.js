var https = require('https');
var crypto = require('crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function fetch(opts, callback ) {
    https.get(opts, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
  
              callback(rawData);
            } catch (e) {
                console.error(e.message);
            }
        });
        
    }).on('error', (e) => {
        console.error(e);
    });
}

exports.handler = (event, context, callback) => {
    var timestamp = Date.now();
    var part1 = "QFpCwKfd7"
    var part2 = "fjVEXFFwSu36BwwcP83xYgxLAhLYmKk"
    var part3 = "letvarconst"
    var key = part1 + part2 + part3 + timestamp;

    var hash = crypto.createHash('sha512');

    var data = hash.update(key, 'utf-8');

    var gen_hash= data.digest('hex');

    fetch({
        hostname: 'www.legis.ga.gov',
        path: '/api/authentication/token?key='+gen_hash+'&ms='+timestamp,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
        }
    }, (data) => {
        // console.log( data, JSON.parse(data) );
        fetch({
            hostname: 'www.legis.ga.gov',
            path: '/api/meetings?startDate=Mon%20Aug%2029%202022',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
                'Authorization': 'Bearer '+JSON.parse(data)
            }
        }, (data1) => {
            // console.log( JSON.parse(data) );
            callback(null, {
                statusCode: 200,
                body: data1,
            })
            
        })
    })
};
