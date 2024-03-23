const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();
const URL_EXPIRATION_SECONDS = 300;

// Main Lambda entry point
exports.handler = async (event) => {
    return await getUploadURL(event);
};

const getUploadURL = async function (event) {
    let imageURL = null;
    let jsonURL = null;
    const ID = Date.now();
    var eventID = event.queryStringParameters.id.replace(/[^a-z0-9-]/g, "");

    var params = {
        Bucket: process.env.UploadBucket,
        Key: `event-${eventID}.json`,
    };
    let obj = await s3.getObject(params).promise();
    var eventList = JSON.parse(obj.Body.toString("utf-8"));

    // console.log(eventList)
    if (eventList.hasOwnProperty(eventID)) {
        imageURL = await s3.getSignedUrlPromise("putObject", {
            Bucket: process.env.UploadBucket,
            Key: `events/${eventID}/${ID}.jpg`,
            Expires: URL_EXPIRATION_SECONDS,
            ContentType: "image/jpeg",
            ACL: "public-read",
        });

        jsonURL = await s3.getSignedUrlPromise("putObject", {
            Bucket: process.env.UploadBucket,
            Key: `events/${eventID}/${ID}.json`,
            Expires: URL_EXPIRATION_SECONDS,
            ContentType: "application/json",
            ACL: "public-read",
        });
    }
    return JSON.stringify({
        imageURL,
        jsonURL,
        ID,
    });
};
