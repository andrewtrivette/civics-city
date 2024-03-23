'use strict';
const { https } = require('follow-redirects');
const aws = require('aws-sdk');

const promiseWhile = (data, condition, action) => {
	var whilst = (data) => {
		// console.log(data);
	  return condition(data) ?
		action(data).then(whilst) :
		Promise.resolve(data);
	}
	return whilst(data);
};
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports.run = async (event, context, callback) => {
  	const time = new Date();
  	// console.log(`Your cron function "${context.functionName}" ran at ${time}`);
const baseYear = event.year;
console.log(event);
	return new Promise((resolve1, reject1) => {
		var data = [];
		const get = (num) => {
			return new Promise((resolve, reject) => {
				var yesterday = new Date(Date.parse(`31 Dec ${baseYear} 00:00:00 UTC`));
				var yesterDate = yesterday.toISOString().split('T')[0];
				var monthStart = `${baseYear}-01-01`;
				https.get(`https://services3.arcgis.com/Et5Qfajgiyosiw4d/arcgis/rest/services/CrimeDataExport_2_view/FeatureServer/1/query?f=json&where=((report_Date >= timestamp '${monthStart}') AND (report_Date < timestamp '${yesterDate }'))&outFields=*&resultOffset=${num}`, (res) => {
				
					res.setEncoding('utf8');
					let rawData = '';
					res.on('data', (chunk) => { rawData += chunk; });
					res.on('end', () => {
						
						var json = JSON.parse(rawData);
						num = (json.exceededTransferLimit) ? num+2000 : false;
						data = [...data, json.features]
						resolve(num);
					});
				});
			})
		}

		promiseWhile(0, num => Number.isInteger(num), get).then(num => {
			// console.log('data', data.flat().length); 
			resolve1(data.flat())
		});
	}).then((data) => {
		return new Promise((resolve, reject) => {

			var files = {};
			var summaryFiles = {};
			var yearFile = Object.assign({}, { sum: {}, district: {}, npu: {} });
			
			
			var year = baseYear; //new Date().getFullYear();
			var yearSumKey = year+'-summary';
			files[yearSumKey] = Object.assign({}, { sum: {}, district: {}, npu: {} });

			var rows = data;
			rows.forEach(({ attributes: row}) => {
				var dat = new Date(row.report_Date);
				var year = dat.getFullYear();
				var month = (dat.getMonth()+1).toString().padStart(2, '0');
				// console.log(row.report_Date, dat, dat.getMonth(), month);
				var filename = year+'-'+month;

				if( !files.hasOwnProperty(filename) )
				{
					files[filename] = [];
				}

				files[filename].push(row);

				if( !summaryFiles.hasOwnProperty(month))
				{
					summaryFiles[month] = Object.assign({}, { sum: {}, district: {}, npu: {} });
				}
				var code = row['nibrs_code_name'];
				var codeMap = {
					"23H": "LARCENY-NON VEHICLE",
					"23F": "LARCENY-FROM VEHICLE",
					"13A": "AGG ASSAULT",
					"120": "ROBBERY",
					"240": "AUTO THEFT",
					"09A": "HOMICIDE",
					"220": "BURGLARY"
				};
				if( codeMap.hasOwnProperty(row.nibrs_code) )
				{
					code = codeMap[row.nibrs_code];
				}

				['district', 'npu'].forEach( group => 
				{
					var key = row[group.toUpperCase()];
					
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

					
				});

				if( !summaryFiles[month]['sum'].hasOwnProperty(code) )
				{
					summaryFiles[month]['sum'][code] = 0;
				}
				summaryFiles[month]['sum'][code]++;
				
				if( !yearFile['sum'].hasOwnProperty(code) )
				{
					yearFile['sum'][code] = 0;
				}
				yearFile['sum'][code]++;
			});


			var promises = [];
			Object.keys(summaryFiles).forEach( file => {
				promises.push(new Promise((resolve, reject) => {
					var opts = {
						ACL: 'public-read',
						Body: JSON.stringify(summaryFiles[file]), 
						Bucket: 'civics.city', 
						Key: 'atlanta/data/COBRA/archive/'+year+'-'+file+'-summary.json',
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
						Key: 'atlanta/data/COBRA/archive/'+file+'.json',
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
					Key: 'atlanta/data/COBRA/archive/'+year+'-summary.json',
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
					Body: JSON.stringify(summaryFiles), 
					Bucket: 'civics.city', 
					Key: 'atlanta/data/COBRA/archive/'+year+'-aggregate.json',
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
							Key: 'atlanta/data/COBRA/year-aggregate.json',
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
						Key: 'atlanta/data/COBRA/totals.json',
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
