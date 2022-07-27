const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

/**
    https://gist.github.com/phil-kahrl/b3ddaee17b380356256f889432e44127
    Recursive method to list all the objects in an S3 bucket which may be paginated.
**/

const listObjects = (  
        resultList, // This is the list of combined results from all calls.
        NextContinuationToken // Tells S3 to get the next page of results.
    ) => {
    console.log('list object called, NextContinuationToken = ' + NextContinuationToken)
    // This function will return a Promise
    return new Promise( (resolve, reject) => {  
        // initialize an empty result list on the first call
        let list = resultList ? resultList : [] 
        var d = new Date();
        const params = {
            Bucket: "civics.city",
            Prefix: `atlanta/data/citizen/${d.getFullYear()}`,
            ContinuationToken: NextContinuationToken 
        };

        const request = s3.listObjectsV2(params);
        request.send((err, data) => {
            if (err) {
                reject(err)
            } else {
                // combine the master list with the result of this function call.
                list = list.concat(data.Contents) 
                if(data.IsTruncated) {
                    // if the data is truncated then call this function recursively
                    listObjects(list, data.NextContinuationToken).then( (list) => {
                        console.log(
                            'resolving for NextContinuationToken ' + 
                            data.NextContinuationToken
                        )
                        resolve(list)
                    })
                } else {
                    /* 
                    The termination condition for the recursion has been met,
                    (There are no more pages left in the bucket) so we resolve here.
                     */
                    console.log('done, resolving final result')
                    resolve(list)
                }
            }
        })
    })

}

module.exports = listObjects;