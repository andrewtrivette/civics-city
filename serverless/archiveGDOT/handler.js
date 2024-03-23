const fetch = require('node-fetch');
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
exports.handler = async (event) => {
    
    
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    function parseCookies(rawCookies) {
    
        return rawCookies.map((entry) => {
            const parts = entry.split(';');
            const cookiePart = parts[0];
            return cookiePart;
        }).join(';');
    }



    var response = await fetch('https://gdot.aashtowaresafety.net/crash-data#/', {
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        }
    });

    var d = new Date();
    var headers = await response.headers.raw();
    console.log(headers);
    var cookies = parseCookies(headers['set-cookie']);
    var body = {
        "options":{
            "type":"GET_ALL_GEO",
            "docType":"4edb66cf-364d-4206-a888-46d321b5735d",
            "returnFormat":{
                "format":"Array"
            },
            "size":10000,
            "defaultFilters":[
                {
                    "coordinates":[
                        [
                            [-86.79516519306188,35.8366370369673],
                            [-83.90705974476401,36.30352402714031],
                            [-81.82762382198872,35.8366370369673],
                            [-80.44133320680544,33.84571480984488],
                            [-78.8239941557587,31.709070664773122],
                            [-80.6723816426697,29.522043743999106],
                            [-86.33306832133411,29.522043743999106],
                            [-86.79516519306188,35.8366370369673]]
                        ],
                        "displayName":"Map Filter",
                        "field":"Geometry",
                        "filter":"geoshape",
                        "key":"__NuMap_Filter_Key__",
                        "must":true,
                        "relation":"intersects",
                        "selectionValue":0,
                        "shape":"Polygon"
                    },
                    {
                        "displayName":"Map Filter",
                        "field":"Geopoint",
                        "filter":"geopolygon",
                        "key":"__NuMap_Filter_Key__",
                        "must":true,
                        "points":[
                            {"lat":35.8366370369673,"lon":-86.79516519306188},{"lat":36.30352402714031,"lon":-83.90705974476401},{"lat":35.8366370369673,"lon":-81.82762382198872},{"lat":33.84571480984488,"lon":-80.44133320680544},{"lat":31.709070664773122,"lon":-78.8239941557587},{"lat":29.522043743999106,"lon":-80.6723816426697},{"lat":29.522043743999106,"lon":-86.33306832133411},{"lat":35.8366370369673,"lon":-86.79516519306188}
                        ],
                        "selectionValue":1
                    }
                ],
                "includes":["geopoint","KABCO Severity","DateofIncidentDte"],
                "filters":[
                    {
                        "key":"4edb66cf-364d-4206-a888-46d321b5735d_CityNameTxt_ComboBox_5000",
                        "filter":"term",
                        "field":"CityNameTxt",
                        "value":"Atlanta",
                        "must":true,
                        "displayName":"Area: City: Atlanta"
                    },
                    {
                        "datasetId":"6b454c2a-8f9f-43cc-b237-5ab1481d96b6",
                        "displayName":"Date and Time of Incident (Year)",
                        "field":"DateofIncidentDte",
                        "filter":"script",
                        "key":"DateofIncidentDte-year",
                        "pseudo":"year",
                        "script":{
                            "params":{
                                "field":"DateofIncidentDte",
                                "param1":2017,
                                "param2":2022
                            },
                            "script":"betweenyears"
                        },
                        "selectionValue":[
                            "2017",
                            "2022"
                        ]
                    }
                ]
            },
            "params":{}
        }

        // console.log(JSON.stringify(body));

        var response = await fetch('https://gdot.aashtowaresafety.net/api/query/search', {
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'cookie': cookies,
                'content-type': 'application/json',
                'referer': 'https://gdot.numetric.net/crash-data'
            },
            method: 'POST',
            body: JSON.stringify(body)
        });


        var json = await response.text();

        var filename = 'atlanta/data/gdot_crashes.json';
        var opts = {
  			ACL: 'public-read',
  			Body: JSON.stringify(json), 
  			Bucket: 'civics.city', 
  			Key: filename,
  			ContentType: 'application/json'
  		};
  		await s3.putObject(opts, (err, data) => {
  			if( err ) console.log(err);
  		});
};
