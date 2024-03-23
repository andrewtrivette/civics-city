<script>
	import BikeLaneCitationsCharts from '$lib/BikeLaneCitationsCharts.svelte';
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
</script>

<svelte:head>
	<title>Bike Lane Citations Dashboard | Civics.City Atlanta</title>
	<meta name="description" content="Bike Lane Citations in Atlanta" />
	<meta property="og:title" content="Bike Lane Citations Dashboard | Civics.City Atlanta" />
	<meta property="og:description" content="Bike Lane Citations in Atlanta" />
	<meta property="og:url" content="https://atlanta.civics.city/bike-lane-citations" />
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
			<h1>Bike Lane Citations Dashboard</h1>
		</div>
		<BikeLaneCitationsCharts />
	</div>
</div>
<GoogleAnalytics properties={['UA-1097544-80']} />
