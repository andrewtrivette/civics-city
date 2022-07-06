'use strict';
const { https } = require('follow-redirects');
const aws = require('aws-sdk');
const fs = require('fs');
const unzipper = require('unzipper');
// Incomplete. Does not save file out yet
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
module.exports.run = async (event, context, callback) => {
  	const time = new Date();
  	// console.log(`Your cron function "${context.functionName}" ran at ${time}`);

	return new Promise((resolve, reject) => {
		// Get zip file from url
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream("/tmp/google-map.kmz");
			https.get('https://www.google.com/maps/d/kml?mid=1rIxBqs46TPEBA-qBkrUKyMWewgXwrmc', response => {
				console.log('statusCode:', response.statusCode);
				console.log('headers:', response.headers);
				response.pipe(file);
				file.on('finish', () => {

						resolve();

				});
			});
		});
	}).then(() => {
		// extract zip file (temp upload to s3)
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream("/tmp/google-map.kml");
			file.on('finish', () => {
				fs.readFile('/tmp/google-map.kml', function (err, file_buffer) {
					console.log(file_buffer);
					resolve(file_buffer);
				});
			});
			
			fs.createReadStream('/tmp/google-map.kmz')
			.pipe(unzipper.Parse())
			.on('entry', function (entry) {
			  const fileName = entry.path;
			  console.log(filename);
			//   const type = entry.type; // 'Directory' or 'File'
			//   const size = entry.vars.uncompressedSize; // There is also compressedSize;
			//   if (fileName.endsWith('kml')) {
				entry.pipe(file);
			//   } else {
			// 	entry.autodrain();
			//   }
			});
		});
	}).then((file_buffer) => {
		// extract zip file (temp upload to s3)
		console.log({ file_buffer });
		return new Promise((resolve, reject) => {
			var opts = {
				ACL: 'public-read',
				Body: file_buffer, 
				Bucket: 'civics.city', 
				Key: 'atlanta/data/google-map.kml',
				ContentType: 'application/vnd.google-earth.kml+xml'
			};
			s3.putObject(opts, (err, data) => {
				if( err ) reject(err);

				resolve(data);
			});
		});
	}).then(result => result);

};
