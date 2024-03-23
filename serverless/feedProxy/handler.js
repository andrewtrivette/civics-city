const https = require("https");
const querystring = require("querystring");
var crypto = require("crypto");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    console.log("event", event);
    var query = querystring.stringify(event.queryStringParameters);
    // console.log(event.path+'?'+query);
    var today = new Intl.DateTimeFormat("en-US").format(Date.now());
    // console.log(today);
    var md5sum = crypto.createHash("md5");
    md5sum.update(today + "-" + event.path + "?" + query);
    const filename = md5sum.digest("hex");

    const params = {
        Bucket: "civics.city",
        Key: "/cache/" + filename,
    };

    s3.getObject(params, function (err, data) {
        if (err) {
            // console.log(err, err.stack); // an error occurred
            const req = https.request(
                event.queryStringParameters.url,
                (res) => {
                    let body = "";
                    // console.log('Status:', res.statusCode);
                    // console.log('Headers:', JSON.stringify(res.headers));
                    res.setEncoding("utf8");
                    res.on("data", (chunk) => (body += chunk));
                    res.on("end", () => {
                        // console.log('Successfully processed HTTPS response');
                        // If we know it's JSON, parse it
                        if (
                            res.headers["content-type"] === "application/json"
                        ) {
                            body = JSON.parse(body);
                        }
                        const destparams = {
                            Bucket: "civics.city",
                            Key: "cache/" + filename,
                            Body: body,
                            ContentType: res.headers["content-type"],
                            ACL: "public-read",
                        };

                        // var putResult = await s3.putObject(destparams).promise();
                        s3.putObject(destparams, function (err, data) {
                            if (err) console.log(err);
                            callback(null, {
                                statusCode: 302,
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Methods":
                                        "POST,GET,OPTIONS",
                                    "Access-Control-Allow-Headers": "*",
                                    "cache-control": "max-age=360",
                                    Location:
                                        "https://civics.city/cache/" +
                                        filename,
                                },
                            });
                        });
                    });
                }
            );
            req.on("error", function (err) {
                callback(err);
            });
            req.end();
        } else {
            callback(null, {
                statusCode: 302,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
                    "Access-Control-Allow-Headers": "*",
                    "cache-control": "max-age=360",
                    Location:
                        "https://civics.city/cache/" +
                        filename,
                },
            });
        }
    });
};
