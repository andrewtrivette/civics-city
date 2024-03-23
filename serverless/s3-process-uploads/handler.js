const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const listObjects = require('./listObjects')
exports.handler = (event, context, callback) => {
    let incidents = {};
    console.log(event.Records[0].s3.object);
    // callback(null, event);
    let eventID = event.Records[0].s3.object.key.match(/events\/(.*?)\//)[1] || 'test1';
    listObjects({
      Bucket: process.env.UploadBucket,
      Prefix: `events/${eventID}`
    }).then((data) => {
        let promises = [];
        data.map((fileInfo) => {
            if(fileInfo.Key.endsWith('.json') ) {
                promises.push(new Promise((resolve, reject) => {
                    s3.getObject({
              				Bucket: process.env.UploadBucket, 
              				Key: fileInfo.Key
              			}, function(err, data) {
              				if( err ) reject(err);
              				var json = JSON.parse(data.Body.toString('utf-8'));
              				resolve(json);
              			});
                }));
            }
        });
        
        Promise.all(promises).then( (results) => {
            var geoJSON =  {
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "EPSG:4326" } },
                "features": []
            };
            geoJSON.features = results.map( (json) => {
                delete json.metadata;
                var geometry = (json.hasOwnProperty('lng') ) ? {
                            "type": "Point",
                            "coordinates": [
                                json.lng,
                                json.lat
                            ]
                        } : {
                            "type": "LineString",
                            "coordinates": JSON.parse(json.path)
                        }
                 return {
                    "type": "Feature",
                    "id": json.ID,
                    "geometry": geometry,
                    "properties": json
                }
            });
        	s3.putObject({
    				ACL: 'public-read',
    				Body: JSON.stringify(geoJSON), 
    				Bucket: process.env.UploadBucket, 
    				Key: `event-${eventID}.geojson`,
    				ContentType: 'application/json'
    			}, (err, data) => {
        		if( err ) console.log(err);
        		callback(null, 'success')
        	});
        });
        
    })
   

};
