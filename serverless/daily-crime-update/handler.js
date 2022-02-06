'use strict';
const cheerio = require('cheerio');
const { https } = require('follow-redirects');
const aws = require('aws-sdk');
const fs = require('fs');
const unzipper = require('unzipper');
const CSVToJSON = require('csvtojson');
var turf = require('@turf/turf');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
module.exports.run = async (event, context, callback) => {
  	const time = new Date();
  	// console.log(`Your cron function "${context.functionName}" ran at ${time}`);

	return new Promise((resolve, reject) => {
		https.get('https://www.atlantapd.org/i-want-to/crime-data-downloads', (res) => {
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				resolve(rawData);
			});
		});
	}).then(( html ) => {
		// Extract url from html
		return new Promise((resolve, reject) => {
			const $ = cheerio.load(html);
			$('a').each(function(i, el) {
				if( $(this).text().startsWith('COBRA-'+time.getFullYear()))
				{
					resolve( $(this).attr('href') );
				}
			});
			reject('url not found');
		});
	}).then(( url ) => {
		// Get zip file from url
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream("/tmp/cobra-data.zip");
			https.get('https://www.atlantapd.org'+url, response => {
				console.log('statusCode:', response.statusCode);
				console.log('headers:', response.headers);
				let body = '';
				// response.on('data', (chunk) => { body += chunk; });
				response.pipe(file);
				file.on('finish', () => {
					// fs.readFile('/tmp/cobra-data.zip', function (err, file_buffer) {
						resolve();
					// });
				});
			});
		});
	}).then(() => {
		// extract zip file (temp upload to s3)
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream("/tmp/cobra-data.csv");
			file.on('finish', () => {
				fs.readFile('/tmp/cobra-data.csv', function (err, file_buffer) {
					resolve(file_buffer);
				});
			});
			
			fs.createReadStream('/tmp/cobra-data.zip')
			.pipe(unzipper.Parse())
			.on('entry', function (entry) {
			  const fileName = entry.path;
			  const type = entry.type; // 'Directory' or 'File'
			  const size = entry.vars.uncompressedSize; // There is also compressedSize;
			  if (fileName.endsWith('csv')) {
				entry.pipe(file);
			  } else {
				entry.autodrain();
			  }
			});
		});
	}).then((file_buffer) => {
		// extract zip file (temp upload to s3)
		return new Promise((resolve, reject) => {
			var opts = {
				ACL: 'public-read',
				Body: file_buffer, 
				Bucket: 'civics.city', 
				Key: 'cobra-data.csv',
				ContentType: 'text/csv'
			};
			s3.putObject(opts, (err, data) => {
				if( err ) reject(err);

				resolve(data);
			});
		});
	}).then((data) => {
		return new Promise((resolve, reject) => {
			var groups = {
                district: {},
                npu: {}
            };
			var sum = {};
			var files = {};
			var summaryFiles = {};
			var yearFile = Object.assign({sum}, groups);
			
			
			var year = new Date().getFullYear();
			var yearSumKey = year+'-summary';
			files[yearSumKey] = Object.assign({sum}, groups);
            
			var districts = JSON.parse(fs.readFileSync('./council-districts.geojson'));

			CSVToJSON().fromFile('/tmp/cobra-data.csv')
			.then(rows => {
				rows.forEach(row => {
					var dat = row['rpt_date'].match(/([0-9]+)\/([0-9]+)\/([0-9]+)/);
					var year = dat[3];
					var month = dat[1].padStart(2, '0');
					var filename = year+'-'+month;

					if( !files.hasOwnProperty(filename) )
					{
						files[filename] = [];
					}

					var pt = turf.point([row.long, row.lat]);
					var district = 0;
					districts.features.forEach((feature) => {
						if( turf.booleanPointInPolygon(pt, feature.geometry) )
						{
							district = feature.properties.NAME;
						}
					});
					row.district = district;
					files[filename].push(row);

					// var monthSumKey = filename+'-summary';
					if( !summaryFiles.hasOwnProperty(month))
					{
						summaryFiles[month] = Object.assign({sum}, groups);
					}
					for( var group in groups )
					{
						var key = row[group];
						var code = row['UC2_Literal'];
						// Refactor as function that accepts filename key and object
						// Add to Monthly Summaries
						if( !summaryFiles[month][group].hasOwnProperty(key) )
						{
							summaryFiles[month][group][key] = {};
						}
						if( !summaryFiles[month][group][key].hasOwnProperty(code) )
						{
							summaryFiles[month][group][key][code] = 0;
						}
						summaryFiles[month][group][key][code]++

						if( !summaryFiles[month]['sum'].hasOwnProperty(code) )
						{
							summaryFiles[month]['sum'][code] = 0;
						}
						summaryFiles[month]['sum'][code]++;

						// Add to Yearly Summary
						if( !yearFile[group].hasOwnProperty(key) )
						{
							yearFile[group][key] = {};
						}
						if( !yearFile[group][key].hasOwnProperty(code) )
						{
							yearFile[group][key][code] = 0;
						}
						yearFile[group][key][code]++

						if( !yearFile['sum'].hasOwnProperty(code) )
						{
							yearFile['sum'][code] = 0;
						}
						yearFile['sum'][code]++;
					}
				});


				var promises = [];
				Object.keys(summaryFiles).forEach( file => {
					promises.push(new Promise((resolve, reject) => {
						var opts = {
							ACL: 'public-read',
							Body: JSON.stringify(summaryFiles[file]), 
							Bucket: 'civics.city', 
							Key: 'atlanta/data/COBRA/'+year+'-'+file+'-summary.json',
							ContentType: 'application/json'
						};
						s3.putObject(opts, (err, data) => {
							if( err ) reject(err);
			
							resolve(data);
						});
					}) );
				});
				Object.keys(files).forEach( file => {
					promises.push(new Promise((resolve, reject) => {
						var opts = {
							ACL: 'public-read',
							Body: JSON.stringify(files[file]), 
							Bucket: 'civics.city', 
							Key: 'atlanta/data/COBRA/'+file+'.json',
							ContentType: 'application/json'
						};
						s3.putObject(opts, (err, data) => {
							if( err ) reject(err);
			
							resolve(data);
						});
					}) );
				});
				promises.push(new Promise((resolve, reject) => {
					var opts = {
						ACL: 'public-read',
						Body: JSON.stringify(yearFile), 
						Bucket: 'civics.city', 
						Key: 'atlanta/data/COBRA/'+year+'-summary.json',
						ContentType: 'application/json'
					};
					s3.putObject(opts, (err, data) => {
						if( err ) reject(err);
		
						resolve(data);
					});
				}) );

				promises.push(new Promise((resolve, reject) => {
					var opts = {
						ACL: 'public-read',
						Body: JSON.stringify(files), 
						Bucket: 'civics.city', 
						Key: 'atlanta/data/COBRA/'+year+'-aggregate.json',
						ContentType: 'application/json'
					};
					s3.putObject(opts, (err, data) => {
						if( err ) reject(err);
		
						resolve(data);
					});
				}) );

				Promise.all(promises).then((results) => {
					// get years-aggregate
					return new Promise((resolve, reject) => {
						s3.getObject({
							Bucket: "civics.city", 
							Key: "atlanta/data/COBRA/year-aggregate.json"
						}, function(err, data) {
							if (err) console.log(err, err.stack); // an error occurred
							var json = JSON.parse(data.Body.toString('utf-8'));
							// Replace or add current year data
							json[year] = yearFile;
							var opts = {
								ACL: 'public-read',
								Body: JSON.stringify(json), 
								Bucket: 'civics.city', 
								Key: 'atlanta/data/COBRA/year-aggregate-test.json',
								ContentType: 'application/json'
							};
							// Save updated aggregate data
							s3.putObject(opts, (err, data) => {
								if( err ) reject(err);
								resolve(json);
							});
							// successful response
							
						});
					});
				}).then((result) =>{
					// summarize all aggregate in years-aggregate
					var summary = {};
					var years = Object.keys(result);
					years.forEach((yearKey) => {
						
						var year = result[yearKey];

						var groupKeys = Object.keys(year);
						console.log({groupKeys})
						
						groupKeys.forEach(groupKey => {
							var group = year[groupKey];
							if( !summary.hasOwnProperty(groupKey) )
							{
								summary[groupKey] = group;
							}
							else
							{
								if( groupKey == 'sum')
								{
									summary[groupKey] = sumObjects( summary[groupKey], group );
								}
								else
								{
									var subGroupKeys = Object.keys(group);
									subGroupKeys.forEach(subGroupKey => {
										var subGroup = group[subGroupKey];
										if( !summary[groupKey].hasOwnProperty(subGroupKey) )
										{
											summary[groupKey][subGroupKey] = subGroup;
										}
										else
										{
											summary[groupKey][subGroupKey] = sumObjects( summary[groupKey][subGroupKey], subGroup );
										}
										
									})
								}
							}
						})
					});
					// save to totals.js
					return new Promise((resolve, reject) => {
						var opts = {
							ACL: 'public-read',
							Body: JSON.stringify(summary), 
							Bucket: 'civics.city', 
							Key: 'atlanta/data/COBRA/totals-test.json',
							ContentType: 'application/json'
						};
						// Save updated aggregate data
						s3.putObject(opts, (err, data) => {
							if( err ) reject(err);
							resolve(summary);
						});
					});
				}).then(result => result);
			});
		});
	});

	function sumObjects( obj1, obj2 )
	{
		var obj2Keys = Object.keys(obj2);
		obj2Keys.forEach(obj2Key => {
			if( !obj1.hasOwnProperty(obj2Key) )
			{
				obj1[obj2Key] = obj2[obj2Key];
			}
			else
			{
				obj1[obj2Key] += obj2[obj2Key];
			}
		});
		return obj1;
	}
};
