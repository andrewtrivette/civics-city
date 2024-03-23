// var https = require('https');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const listObjects = require('./listObjects')
exports.handler = (event, context, callback) => {
    let incidents = {};

    var d = new Date();

    if( d.getDate() == 1 )
    {
        d.setMonth( d.getMonth() - 1 );
    }
    var month = d.getMonth() + 1;

    const params = {
        Bucket: "civics.city",
        Prefix: `atlanta/data/citizen/Traffic Related/${d.getFullYear()}/${month}`
    };
    listObjects(params).then((data) => {
        console.log({length: data.length})
        let promises = [];
        data.map((fileInfo) => {
            promises.push(new Promise((resolve, reject) => {
                s3.getObject({
    				Bucket: "civics.city", 
    				Key: fileInfo.Key
    			}, function(err, data) {
    				if( err ) reject(err);
    				var json = JSON.parse(data.Body.toString('utf-8'));
    				
    				resolve(json);
    			});
            }));
        });
        
        Promise.all(promises).then((results) => {
            results.map(json => {
                if( json.hasOwnProperty('categories') )
				{
				    json.categories.map(category => {
				        if( !incidents.hasOwnProperty(category) )
				        {
				            incidents[category] = [];
				        }
					    incidents[category].push({
					        location: json.ll,
					        time: json.ts,
					        title: json.title,
					        src: json.source,
					        severity: json.severity,
					        key: json.key
					    });
					})
				}
            });
            var body = JSON.stringify(incidents)
            var opts = {
        		ACL: 'public-read',
        		Body: body, 
        		Bucket: 'civics.city', 
        		Key: `atlanta/data/citizen/summary-${d.getFullYear()}-${month}.json`,
        		ContentType: 'application/json'
        	};
        	s3.putObject(opts, (err, data) => {
        		if( err ) callback(err);
        		// Get all monthly summaries and aggregate
        		listObjects({
                    Bucket: "civics.city",
                    Prefix: `atlanta/data/citizen/summary-${d.getFullYear()}-`
                }).then((data) => {
                    console.log({length: data.length})
                    let promises = [];
                    data.map((fileInfo) => {
                        promises.push(new Promise((resolve, reject) => {
                            s3.getObject({
                				Bucket: "civics.city", 
                				Key: fileInfo.Key
                			}, function(err, data) {
                				if( err ) reject(err);
                				var json = JSON.parse(data.Body.toString('utf-8'));
                				
                				resolve(json);
                			});
                        }));
                    });
                    
                    Promise.all(promises).then((results) => {
            		    var merged = [];
                        results.map(json => {
                            console.log(Object.keys(json))
                            if( json.hasOwnProperty('Traffic Related') )
            				{
            				    console.log(json['Traffic Related'].length)
            				    merged = merged.concat(json['Traffic Related'])
            				}
                        });
                        var opts = {
                    		ACL: 'public-read',
                    		Body: JSON.stringify({ 'Traffic Related': merged}), 
                    		Bucket: 'civics.city', 
                    		Key: `atlanta/data/citizen/summary-${d.getFullYear()}.json`,
                    		ContentType: 'application/json'
                    	};
                    	s3.putObject(opts, (err, data) => {
                    		if( err ) callback(err);
                    		callback(null, 'success')
                    	});
            		});
        		});
        	}); 
        });
    })
};
