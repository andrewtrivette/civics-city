const https = require('https');
var crypto = require('crypto');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    
    var query = event.rawQueryString;
    console.log( event )
    var path = event.pathParameters.proxy;
    // Create a hashed filename based on today's date to allow for 1 day caching of calls
    var today = new Intl.DateTimeFormat('en-US').format(Date.now());
    var md5sum = crypto.createHash('md5');
    md5sum.update(today+'-'+path+'?'+query);
    const filename = md5sum.digest('hex');
    
    const params = {
        Bucket: 'civics.city',
        Key: 'atlanta/data/cache/'+filename+'.json',
    };

    var approvedDomains = [
      'atlantacityga.iqm2.com'
    ];
    
    var pathArr = path.split('/')
    var requestedDomain = pathArr.shift();
    var domain = ( approvedDomains.indexOf(requestedDomain) != -1 ) ? requestedDomain : approvedDomains[0];

    // Check if cached file already exists. If so, redirect to it. 
    // Otherwise, make the api call, cache response, and redirect to it
    s3.getObject(params, function(err, data) {
        if (err) {
            const req = https.request({
              hostname: domain,
              port: 443,
              path: '/'+pathArr.join('/')+'?'+query,
              method: 'GET'
            }, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => body += chunk);
                    res.on('end', () => {
                        if (res.headers['content-type'] === 'application/json') {
                            body = JSON.parse(body);
                        }
                        const destparams = {
                            Bucket: 'civics.city',
                            Key: 'atlanta/data/cache/'+filename+'.json',
                            Body: body,
                            ContentType: "application/json",
                            ACL: 'public-read'
                        };
        
                        s3.putObject(destparams, function(err, data) {
                            if( err ) console.log(err);
                            callback(null, {
                                statusCode: 302,
                                headers: {
                                    "Access-Control-Allow-Origin": "*", 
                                    "Access-Control-Allow-Methods": "POST,GET,OPTIONS", 
                                    "Access-Control-Allow-Headers": "*", 
                                    "cache-control": "max-age=360",
                                    "Location": 'https://civics.city/atlanta/data/cache/'+filename+'.json',
                                }
                             });
                        });
                });
            });
            req.on('error', function(err) { callback(err); });
            req.end();
        }
        else {
            callback(null, {
                statusCode: 302,
                headers: {
                    "Access-Control-Allow-Origin": "*", 
                    "Access-Control-Allow-Methods": "POST,GET,OPTIONS", 
                    "Access-Control-Allow-Headers": "*", 
                    "cache-control": "max-age=360",
                    "Location": 'https://civics.city/atlanta/data/cache/'+filename+'.json',
                }
             });
        }
    });
};
