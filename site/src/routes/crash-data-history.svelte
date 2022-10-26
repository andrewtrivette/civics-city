<script>

	import CrashMapHistory from '$lib/CrashMapHistory.svelte';
	import CrashTrends from '$lib/CrashTrends.svelte';
	export const prerender = true;
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
</script>

<svelte:head>
	<title>Atlanta Crash Dashboard | Civics.City Atlanta</title>
	<meta name="description" content="The State of Road Safety in Atlanta" />
	<meta property="og:title" content="Atlanta Crash Dashboard | Civics.City Atlanta" />
	<meta property="og:description" content="The State of Road Safety in Atlanta" />
	<meta property="og:url" content="https://atlanta.civics.city/mobility" />
	<meta property="og:image" content="https://atlanta.civics.city/mobility.png" />

	<script
		src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
		integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
		crossorigin=""></script>
	<script
		src="https://unpkg.com/leaflet-webgl-heatmap@0.2.7/src/webgl-heatmap/webgl-heatmap.js"></script>
	<script
		src="https://unpkg.com/leaflet-webgl-heatmap@0.2.7/dist/leaflet-webgl-heatmap.min.js"></script>
	<link
		rel="stylesheet"
		href="//unpkg.com/leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css"
		type="text/css"
	/>
	<script src="//unpkg.com/leaflet-gesture-handling"></script>
</svelte:head>

<div class="container mt-4">
	<div class="row">
		<div class="col-12 text-center">
			<h1>Atlanta Crash Historical Trends</h1>
		</div>
		<CrashMapHistory />
		<CrashTrends />
	</div>
</div>
<GoogleAnalytics properties={['UA-1097544-80']} />
