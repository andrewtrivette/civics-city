import {execSync} from 'child_process';

execSync('aws s3 sync ./atlanta s3://atlanta.civics.city --acl public-read');
execSync('aws cloudfront create-invalidation --distribution-id E1L64O4L39YXBP --paths "/*"');
console.log('completed!');