<svelte:head>
    <title>Atlanta Public Safety | Civics.City Atlanta</title>
    <meta name="description" content="Crime & Public Safety">
    <meta property="og:image" content="https://atlanta.civics.city/public-safety.png">
</svelte:head>

<div class="container mt-4">
    <div class="row justify-content-center mb-5">
		<div class="col-12 text-center mb-4">
			<h1>Atlanta Public Safety</h1>
        </div>
        <div class="col-12 col-lg-4">
            <a sveltekit:reload class="link-card" href="/crime-dashboard">Atlanta Crime Dashboard</a>
        </div>
        <div class="col-12 col-lg-4">
            <a sveltekit:reload class="link-card" href="/crime-wave">Understanding ATL Crime Trends</a>
        </div>
    </div>
    <div class="col-12 text-center">
        <p>District-level Crime Stats available on the individual <a sveltekit:reload href="/city-council">District pages</a>.</p>
    </div>
</div>
<style>
    .link-card {
        display: block;
        border-bottom: 1px solid rgba(255,255,255,0.5);
        background-image: linear-gradient(45deg,rgb(0, 16, 51),#4f0074);
        color: white;
        font-weight: bold;
        font-family: 'Exo', sans-serif;
        padding: 2rem 1rem;
        position: relative;
        text-decoration: none;
        font-size: 2rem;
        text-align: center;
        border: 1px solid rgb(100, 100, 100);
        text-shadow: 1px 1px 2px #4f0074;
    }
    .link-card::before {
        content: '';
        background-image: url("/skyline.svg");
        inset: 0;
        position: absolute;
        background-repeat: no-repeat;
        background-position: bottom;
        opacity: 0.1;
    }
</style>
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'

</script>