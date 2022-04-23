<svelte:head>
	<title>Home | Civics.City Atlanta</title>
	<meta property="og:image" content="https://atlanta.civics.city/default.jpg">
	<meta name="description" content="Government Impacts Everyone">
    <meta property="og:title" content="Civics.City Atlanta">
    <meta property="og:url" content="https://atlanta.civics.city">
</svelte:head>
<script context="module">
	export const prerender = true;
</script>
<Hero/>
<div class="represents section">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h3>Who Represents Me?</h3>
			</div>
			<Represents showCouncil={true} />
		</div>
	</div>
</div>
<div class="resources section">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h3>Resources</h3>
			</div>
			<div class="col-12 col-lg-6 pt-4">
				<div class="block">
					<div class="title">How Do I Get Involved?</div>
					<div class="content text-center">
						<p><a class="btn btn-light" href="https://sos.ga.gov/index.php/Elections/register_to_vote" target="_blank"><b>Register to Vote</b></a></p>
						<p><a class="btn btn-light" href="https://www.atlantaga.gov/government/departments/city-planning/office-of-zoning-development/neighborhood-planning-unit-npu/npu-schedule" target="_blank"><b>Attend Your NPU Meetings</b></a></p>
					</div>
				</div>
				
			</div> 
			<div class="col-12 col-lg-6 pt-4">
				<div class="block">
					<div class="title">Legislation</div>
					<div class="content">
						<p><a href="http://atlantacityga.iqm2.com/Citizens/Default.aspx" target="_blank">View Pending Legislation <i class="material-icons tiny">open_in_new</i></a></p>
						<p><a href="https://library.municode.com/ga/atlanta/codes/code_of_ordinances" target="_blank">View Current Code of Ordinances <i class="material-icons tiny">open_in_new</i></a></p>
						<p><a href="https://citycouncil.atlantaga.gov/council-divisions/municipal-clerk/executive-orders" target="_blank">View Mayor's Executive Orders <i class="material-icons tiny">open_in_new</i></a></p>
					</div>
				</div> 
			</div>
			<div class="col-12 col-lg-6 pt-4">
				<div class="block">
					<div class="title">Police</div>
					<div class="content">
						<p><a href="https://acrbgov.org/" target="_blank">Atlanta Citizen Review Board <i class="material-icons tiny">open_in_new</i></a></p>
						<p><a href="http://opendataportal.azurewebsites.us/Default.aspx" target="_blank">View Crime Reports <i class="material-icons tiny">open_in_new</i></a></p>
						<p><a href="https://communitycrimemap.com/?address=atlanta%20ga&amp;type=advanced&amp;zoom=12&amp;crimeTypes=[1,6,7,8,10,11,12,13,14,15,16,17]" target="_blank">View Crime Map <i class="material-icons tiny">open_in_new</i></a></p>
						<p><a href="https://www.atlantapd.org/i-want-to/ops-reports" target="_blank">View Police Annual Reports <i class="material-icons tiny">open_in_new</i></a></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />
<style>

	.resources {
		background-color: #360030;
	}
	.crime {
		background-color: #151515;
	}
</style>

<script>
	import Hero from "$lib/Hero.svelte"
	import Represents from "$lib/Represents.svelte";
	import CrimeSummary from "$lib/CrimeSummary.svelte"
	import { onMount } from 'svelte';
	import { base, assets } from '$app/paths';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
onMount(() => {


});

</script>