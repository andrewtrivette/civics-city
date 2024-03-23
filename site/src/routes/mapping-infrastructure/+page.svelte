<script>
	import CyclingMap from '$lib/CyclingMap.svelte';
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
</script>

<svelte:head>
	<title>Atlanta Cycling Infrastructure | Civics.City Atlanta</title>
	<meta name="description" content="Bike Lanes, Paths, & Complete Streets" />
	<meta property="og:title" content="Atlanta Cycling Infrastructure | Civics.City Atlanta" />
	<meta property="og:description" content="Bike Lanes, Paths, & Complete Streets" />
	<meta property="og:url" content="https://atlanta.civics.city/mobility-infrastructure" />
	<meta property="og:image" content="https://atlanta.civics.city/mobility-infrastructure.png" />

	<script
		src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
		integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
		crossorigin=""></script>
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
			<h1>Atlanta Cycling Infrastructure</h1>
		</div>
		<CyclingMap />
	</div>
</div>
<GoogleAnalytics properties={['UA-1097544-80']} />
