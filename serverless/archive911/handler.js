var https = require('https');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    var url = 'https://citizen.com/api/incident/trending?lowerLatitude=33.625249354183026&lowerLongitude=-84.63821546736415&upperLatitude=33.924761459162&upperLongitude=-84.1565686518137&fullResponse=true&limit=1000';

    https.get(url, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
    
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {

            var data = JSON.parse(rawData);

            data.results.map(async (listing) => {
                var d = new Date(listing.ts);
                var year = d.toLocaleDateString('en-US', {timeZone: 'America/New_York', year: 'numeric'});
                var month = d.toLocaleDateString('en-US', {timeZone: 'America/New_York', month: 'numeric'});
                var date = d.toLocaleDateString('en-US', {timeZone: 'America/New_York', day: 'numeric'});
                var filename = 'atlanta/data/citizen/'+year+'/'+month+'/'+date+'/'+listing.key+'.json';
                var opts = {
          				ACL: 'public-read',
          				Body: JSON.stringify(listing), 
          				Bucket: 'civics.city', 
          				Key: filename,
          				ContentType: 'application/json'
          			};
          			await s3.putObject(opts, (err, data) => {
          				if( err ) console.log(err);
          			});
          			
            })
          
        } catch (e) {
          console.error(e.message);
        }
      });
    
    }).on('error', (e) => {
      console.error(e);
    });
};
