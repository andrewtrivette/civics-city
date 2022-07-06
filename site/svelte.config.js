import adapter from '@sveltejs/adapter-static';
var council = [
	2085, 
    1017, 
    1673, 
    2086, 
    2080, 
    1674, 
    2081, 
    2082, 
    2083, 
    1005, 
    1009, 
    1310, 
    1677, 
    1278,
    1678,
    2084
].map(item => '/member/'+item)
var districts = [1,2,3,4,5,6,7,8,9,10,11,12].map(item => '/district/'+item);
var entries = council.concat(districts, ['/meeting/']);
const handleError = ({ status, path, referrer, referenceType }) => {
	// if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
	console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'atlanta',
			assets: 'atlanta',
			fallback: null,
			precompress: false
		}),
        trailingSlash: 'always',
		// hydrate the <div id="svelte"> element in src/app.html
		// target: '#svelte',
        prerender: {
            enabled: true,
            entries: entries,
            onError: handleError,
            default: true
        },
        // paths: {
        //     base: '/atlanta'
        // }
	}
};

export default config;
