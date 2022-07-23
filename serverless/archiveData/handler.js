var https = require('https');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => {
    var sources = JSON.parse(fs.readFileSync('./daily-sources.json'));
    var newSources = [];
    sources.map(source => {
        if( !source.hasOwnProperty('variables') )
        {
            newSources.push(source);
        }
        else
        {
            var variable = Object.keys(source.variables)[0];
            source.variables[variable].map(item => {
                var tempSource = source.source.replace('['+variable+']', item);
                var tempDestination = source.destination.replace('['+variable+']', item);
                newSources.push({
                    source: tempSource,
                    destination: tempDestination,
                    type: source.type
                })
            })
        }
    });
    var d = new Date();
    var i = 0;
    var promises = [];
    newSources.forEach( ( source, index) => {
        if( source.type == 'daily'
            || ( source.type == 'weekly' && d.getDay() == 0 )
            || ( source.type == 'monthly' && d.getDate() == 1 )
            || ( source.type == 'quarterly' 
                    && [0, 3, 6, 9].indexOf(d.getMonth()) != -1 
                    && d.getDate() == 2 )
            || ( source.type == 'yearly' 
                    && d.getMonth() == 0 
                    && d.getDate() == 3 ) 
        )
        {
            promises.push( 
                new Promise(( resolve, reject ) => {
                    setTimeout( () => {
                        console.log(source.destination)
                        https.get(source['source'], (res) => {
    
                            res.setEncoding('utf8');
                            let rawData = '';
                            res.on('data', (chunk) => { rawData += chunk; });
                            res.on('end', () => {
                                try {
    
                                    fs.writeFileSync('./'+source['destination'], rawData); 
                                    resolve(); 
                                    
                                } catch (e) {
                                    console.error(e.message);
                                }
                            })
                        });
                        console.log(Date.now())
                        resolve(source);
                    }, 500*i );
                })
            );
            i++;
        } 
    });
    Promise.all(promises).then( (data) => {
        console.log(data);
        callback(null, data)
    })
};    
