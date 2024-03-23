<svelte:head>
    <title>Moving Atlanta's Traffic Forward | Civics.City Atlanta</title>
    <meta name="description" content="Modern Approaches to a 20th Century Problem">
    <meta property="og:title" content="Moving Atlanta's Traffic Forward | Civics.City Atlanta">
    <meta property="og:image" content="https://atlanta.civics.city/moving-atl-traffic-forward.jpg">
    <meta property="og:description" content="Modern Approaches to a 20th Century Problem">
    <meta property="og:url" content="https://atlanta.civics.city/moving-atlanta-traffic-forward/">
</svelte:head>


<FixingTrafficHeader/>
<div class="container mt-5">
    <div class="row justify-content-center">
		<div class="col-12 text-center">
			<h1>Moving Atlanta's Traffic Forward</h1>
        </div>
        <div class="col-12 col-lg-10 mt-4 text-lg">
            <p>We know that the length of our drive to work has a huge impact on our <a href="https://peoplescience.maritz.com/Articles/2020/Swerving-Into-The-Carpool-Lane">life satisfaction.</a></p>

            <p>Every week we waste precious hours of our lives sitting in endless traffic jams, getting more stressed by the minute.</p>
            
            <p>So can we truly "fix" our traffic?</p>

            <p>There's a lot of <b>good news</b> there, and some of it is counterintuitive, so buckle up!</p>
            <p>Let's start with what we know <em>isn't</em> going to work.</p>
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-10 mt-5 text-center">
            <h2>The Ghosts of Traffic Past &amp; Future</h2>
        </div>
        <div class="col-12 col-lg-10 mt-4 text-lg">
           <ol class="px-md-0">
               <li>
                    <p><b><u>Only</u> focusing on expanding roads.</b></p>
                    <p>We know that adding lanes doesn't ease congestion for long, <em>if at all</em>. Around the country we see metro regions endlessly trying to expand their roads without success.</p>
                    <aside class="concern p-2 px-md-3 p-lg-4">
                        <p><b>Don't we have to expand roads because of population growth?</b></p>
                        <p class="mb-0">Between 1993 and 2017, we increased the number of lane-miles by 42% in our largest cities, even though the population only increased by 32%. The result? <a href="https://t4america.org/maps-tools/congestion-con/" target="_blank"  rel="noreferrer" class="fs-6">Congestion increased by 144%!</a></p>
                    </aside>
                    <p>The video below is a great explainer for this concept.</p>
                    <iframe class="youtube-video" width="800" src="https://www.youtube-nocookie.com/embed/2z7o3sRxA5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br/>
                    <hr />
                    <br />
               </li>
               <li>
                    <p><b>Autonomous vehicles</b></p>
                    <p>When these finally hit the road, it's going to take a decade, or more, before we see enough being built to have any potential impact. Until then, they'll sit in regular traffic surrounded by humans driving&hellip; well &hellip;humanly.</p>
                    <p>Additionally, when vehicles are fully autonomous, we'll send them out more for errands, grocery pick up, etc., further increasing the number of vehicles on the road at any given time.</p>
                    <hr />
                    <br />
               </li>
           </ol>
           <p>So what does work?!</p> 
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-10 mt-5 text-center">
            <h2>This One(+) Weird Trick to Solve Traffic!</h2>
        </div>
        <div class="col-12 col-lg-10 mt-4 text-lg">
            <ol class="px-md-0">
                <li>
                    <p><b>HOW we design roads is often more important than how large they are!</b></p>
                    <p>NYC found, for instance, that reconfiguring their traffic flows and adding bike lanes actually <a href="https://www.fastcompany.com/3035580/new-york-citys-protected-bike-lanes-have-actually-sped-up-its-car-traffic" target="_blank" rel="noreferrer">improved travel time for cars</a>. And reduced pedestrian and cyclists injuries and death as well!</p>
                    <p>At first this seems counterintuitive, right? If we remove a lane for bikes or buses, won't the remaining lanes be more congested?</p>
                    <p>The key is the <em>rate of flow</em>. One lane moving consistently moves more cars than two lanes stuck in a traffic jam.</p>
                    <p><b>Take this oversimplified example:</b></p>
                    <br />
                    <LaneFlowBefore/>
                    <br/>
                    <LaneFlowAfter/>
                    <p>There are so many similar design tweaks that can make an astounding difference to the rate of flow!</p>
                    <hr />
                    <br />
                </li>
                <li>
                    <p><b>Building a variety of transit options can reduce congestion</b></p>
                    <p>Look around in the next traffic jam you're in. In Atlanta, you're likely to see around <a href="https://atlantaregional.org/whats-next-atl/articles/data-dive-how-metro-atl-gets-to-work/" target="_blank" rel="noreferrer">77%</a> of the cars only have one person in them. That's a lot of space and fuel  needed to move <em>one person</em> around!</p>
                        
                    <RateOfFlowNacto labels={true} />
                    <p class="text-end"><a href="https://nacto.org/publication/transit-street-design-guide/introduction/why/designing-move-people/" target="_blank" rel="noreferrer" class="fs-6">Data Source: NACTO</a></p>
                    <br />
                        
                    <p>A car can be one of the most inefficient ways to get a lot of people through the city. For some they are necessary or preferable though. Making sure we have a variety of reliable travel options benefits everyone!</p>
                    <aside class="concern p-2 px-md-3 p-lg-4">
                        <p><b>This only works if enough people switch to the alternate modes</b></p>
                        <p class="mb-0">Very true! Fortunately there is already a demand for more varied, complete and safe options! And demand increases in cities that they modernize their infrastructure.</p>
                    </aside>
                    <p>Setting aside lanes in dense population areas for a bus lane or bike lanes, intuitively <i>feels</i> like it will be worse for cars. But as modern metro areas are discovering, it can be a win for everyone.</p>
                    <aside class="note p-2 px-md-3 p-lg-4">
                        <p>Some folks have hang-ups about certain transportation options like cycling, buses, rail, etc. Sometimes these modes get tangled up in our notions about freedom, poverty, elitism, etc. <b>This is worth some introspection!</b> The stigmas we accept tend to not reflect reality. Give one a try! Hop on a bike or a bus with an open mind, and see if it challenges your expectations.</p>
                    </aside>
                    <hr />
                    <br />
                </li>
                <li>
                    <p><b>Car crashes snarl traffic, and we can reduce them!</b></p>
                    <p>In Georgia, <a href="https://gdot.numetric.net/crash-data#/a7fae23c-ffac-4c53-b6a9-c26f9baf60db?view_id=3" target="_blank" rel="noreferrer">76% of crashes</a> are caused by behaviors like distractions, impairment or driving too fast.</p>
                    <p>We treat crashes as an unavoidable fact of life. We know it only takes a <em>small mistake</em> to create a <b>ton of damage</b>, even to the point of injury or death.</p>
                    <p>But <b>crashes aren't unavoidable!</b> In regions that have had success in reducing crashes, they create what is often called <em>"forgiving infrastructure"</em>. It's the idea that we should build infrastructure that accounts for the fact that <b>we all make mistakes</b>.</p>
                    <p>A couple of examples:</p>
                    <ol type="a">
                        <li>
                            <p><em>Lowering Speed Limits</em></p>
                            <p>Suggesting this to an ATL commuter should typically only be done if you have access to private security!</p>
                            <p>But counterintuitively, it gets us to our destinations <b>faster on average</b>. A reduction in only 5mph can <a href="https://ssti.us/2018/10/01/lowering-speed-limits-can-reduce-crashes/" target="_blank" rel="noreferrer">reduce crashes by nearly 50%.</a></p>
                            <p>And more people <a href="https://nacto.org/publication/city-limits/the-need/speed-kills/" target="_blank" rel="noreferrer">get to their destination alive.</a></p>
                        </li>
                        <li>
                            <p><em>Traffic Calming</em></p>
                            <p>In some areas we can make adjustments to roads that allow cars to travel at safe reasonable speeds, but make them <b>difficult to race on</b>. This can be adding things like speed tables (speed bumps are so last century), putting slight curves in roads, narrowing lanes, etc.</p>
                        </li>
                    </ol>
                    <p>This list could go on, with things like <em>preventing right turns on red</em>, or <em>making pedestrian crossings safer</em>, or <em>automated speed enforcement</em> (not privately-run!) in high crash areas and school zones, <em>or protecting bike lanes</em>.</p>
                    <p>Every road needs a <b>different set of solutions</b>. But each can be effective in different contexts in creating safer roads with fewer crashes.</p>
                </li>
            </ol>
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-10 mt-5 text-center">
            <h2>Conclusion</h2>
        </div>
        <div class="col-12 col-lg-10 mt-4 text-lg">
            <p>Sometimes, it really <em>is</em> possible to have a win-win. Building forgiving infrastructure for all modes of transport increases the quality of life for drivers, cyclists, pedestrians, and mass transit riders!</p>
            <aside class="action text-center p-2 px-md-3 p-lg-4">
                <p><b>Looking for something you can do in the short-term to improve ATL traffic?</b></p>
                <p>Transform your commute with help from</p>
                <p class="text-center"><a class="btn btn-primary" href="https://gacommuteoptions.com/" target="_blank" rel="noreferrer">GA Commute Options</a></p>
            </aside>
            
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-10 mt-5 text-center">
            <h2>Additional Reading</h2>
        </div>
        <div class="col-12 col-lg-10 mt-4 text-lg mb-5">
            <ul>
                <li><a href="https://nacto.org/publication/urban-street-design-guide/" target="_blank" rel="noreferrer">Urban Street Design Guide (NACTO)</a></li>
                <li><a href="https://peoplescience.maritz.com/Articles/2020/Swerving-Into-The-Carpool-Lane" target="_blank" rel="noreferrer">Swerving Into the Carpool Lane</a></li>
                <li><a href="https://www.fastcompany.com/3035580/new-york-citys-protected-bike-lanes-have-actually-sped-up-its-car-traffic" target="_blank" rel="noreferrer">NYC Bike Lanes Analysis</a></li>
                <li><a href="https://www.youtube.com/watch?v=F4kmDxcfR48&list=PLJp5q-R0lZ0-l3puEmrvn-593mRVV6AZr" target="_blank" rel="noreferrer">Not Just Bikes, a YouTube channel focused on city and road design ideas</a></li>
            </ul>
        </div>
    </div>
</div>

<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import RateOfFlowNacto from '$lib/RateOfFlowNacto.svelte';
import LaneFlowBefore from '$lib/LaneFlowBefore.svelte';
import LaneFlowAfter from '$lib/LaneFlowAfter.svelte';
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
import FixingTrafficHeader from '$lib/FixingTrafficHeader.svelte';
</script>