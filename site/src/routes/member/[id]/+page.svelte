<svelte:head>
    <title>City Council Member | Civics.City Atlanta</title>
    <meta property="og:image" content="https://atlanta.civics.city/default.jpg">
</svelte:head>

<script>
   /** @type {import('./$types').PageData} */
    export let data;
    let id = data.params.id;
    import MemberProfile from "$lib/MemberProfile.svelte";
    import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
   
   console.log(data);
</script>
    
<MemberProfile id={id} />
<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />