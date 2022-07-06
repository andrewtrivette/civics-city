<svelte:head>
    <title>Fixing Atlanta Traffic | Civics.City Atlanta</title>
    <meta name="description" content="Fixing Atlanta Traffic">
    <meta property="og:title" content="Fixing Atlanta Traffic | Civics.City Atlanta">
    <meta property="og:image" content="https://atlanta.civics.city/default.jpg">
    <meta property="og:description" content="Fixing Atlanta Traffic">
    <meta property="og:url" content="https://atlanta.civics.city/fixing-atl-traffic/">
</svelte:head>


<RoadAnimation4/>
<div class="container mt-5">
    <div class="row justify-content-center">
		<div class="col-12 text-center">
			<h1>Fixing ATL Traffic</h1>
        </div>
        <div class="col-12 col-lg-8 mt-4 text-lg">
            <aside class="note">
                <p>There's a lot of hubris in that title, so you know this is going to come up short!</p>
                <p>This is an introduction to some smart approaches to traffic in a modern city.</p>
                <p>Now, let us rush in where smarter angels fear to trod!</p>
            </aside>
            
        </div>
        <div class="col-12 col-lg-8 mt-4 text-lg">
            <p>We know that the length of our drive to work has a huge impact on our <a href="https://peoplescience.maritz.com/Articles/2020/Swerving-Into-The-Carpool-Lane">life satisfaction.</a></p>

            <p>Every week we waste precious hours of our lives sitting endlessly in traffic jams, getting more stressed out with each rude or distracted driver around us.</p>
            
            <p>So can we truly fix our traffic?</p>

            <p>There's a lot of <b>good news</b> there, and some of it is counterintuitive, so buckle up!</p>
            <p>Let's start with what we know <b>isn't</b> going to work.</p>
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-8 mt-5 text-center">
            <h2>The Ghosts of Traffic Past and Future</h2>
        </div>
        <div class="col-12 col-lg-8 mt-4 text-lg">
           <ol>
               <li>
                    <p><b>Only focusing on expanding roads.</b></p>
                    <p>We know that adding lanes doesn't ease congestion for long, if at all. We can look at our own highways, and around the country to see the metro regions that have endlessly tried to expand their roads without success.</p>
                    <aside class="concern">
                        <p><b>Don't we have to expand roads because of population growth?</b></p>
                        <p>Between 1993 and 2017, we increased the number of lane-miles by 42% in our largest cities, even though the population only increased by 32%. The result? congestion increased by 144%! <a href="https://t4america.org/maps-tools/congestion-con/" target="_blank" class="fs-6">Source</a></p>
                    </aside>
                    <p>The video belows is a great explainer for this concept.</p>
                    <iframe class="youtube-video" width="800" src="https://www.youtube-nocookie.com/embed/2z7o3sRxA5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br/>
                    <hr />
                    <br />
               </li>
               <li>
                    <p><b>Autonomous vehicles</b></p>
                    <p>When these finally hit the road, it's going to take a decade or more before we see enough being built and sold to have any potential impact on traffic. Until then, they'll sit in regular traffic, surrounded by humans driving&hellip; well &hellip;humanly.</p> <p>We'll also have to take into account that when vehicles are fully autonomous, we'll send them out more for errands, grocery pick up, etc. further increasing the number of vehicles on the road at any given time.</p>
                    <hr />
                    <br />
               </li>
           </ol>
           <p>So what does work?!</p> 
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-8 mt-5 text-center">
            <h2>This One(+) Weird Trick to Solve Traffic!</h2>
        </div>
        <div class="col-12 col-lg-8 mt-4 text-lg">
            <ol>
                <li>
                    <p><b>HOW we design roads is often more important than how large they are!</b></p>
                    <p>NYC found, for instance, that reconfiguring their traffic flows and adding bike lanes actually <a href="https://www.fastcompany.com/3035580/new-york-citys-protected-bike-lanes-have-actually-sped-up-its-car-traffic">improved travel time for cars</a>. And reduced pedestrian and cyclists injuries and death as well!</p>
                    <p>At first this seems counterintuitive, right? If we remove a lane for bikes or buses, won't the remaining lanes be more congested?</p>
                    <p>The key is the <em>rate of flow</em>. One lane moving consistently moves more cars than two lanes stuck in a traffic jam.</p>
                    <p><b>Take this simple example:</b></p>
                    <RoadAnimation2/>
                    <br/>
                    <p><b>Now, even if we take a car lane out, we still have a better average rate of flow. (Bonus, there's also now room for bike lanes which can further reduce the number of cars on that road)</b></p>
                    <RoadAnimation3/>
                    <br/>
                    <p>There are so many little design tweaks that can make an astounding difference to the rate of flow!</p>
                    <hr />
                    <br />
                </li>
                <li>
                    <p><b>Building infrastructure for other transit modes can reduce congestion</b></p>
                    <p>Look around in the next traffic jam you're in. In Atlanta, you're likely to see around <a href="https://atlantaregional.org/whats-next-atl/articles/data-dive-how-metro-atl-gets-to-work/" target="_blank">77%</a> of the cars only have one person in them. That's a lot of road space and fuel  needed to move one person around!</p>
                        
                    <RoadAnimation labels={true} />
                    <p class="text-end"><a href="https://nacto.org/publication/transit-street-design-guide/introduction/why/designing-move-people/" target="_blank" class="fs-6">Data Source: NACTO</a></p>
                    <br />
                        
                    <p>In many ways, a car is one of the most inefficient ways to get a lot of people through the city. For some it's necessary or preferable though, and making sure our infrastructure safely supports these other modes benefits them as well!</p>
                    <p>Setting aside lanes in dense population areas for a bus lane or bike lanes, at first <i>seems</i> like it will be worse for cars. But in reality, it can be a win-win for everyone</p>
                    <aside class="concern">
                        <p><b>This only works if enough people switch to the alternate modes</b></p>
                        <p>Very true! Fortunately there is already a demand for these alternate modes, and the more complete and safe the routes, the more desirable they will become to even more folks!</p>
                        <p>We see this in cities all over the country as they modernize their infrastructure.</p>
                    </aside>
                    <br />
                </li>
                <li>
                    <p><b>Alternatives to cars decrease congestion and increase quality of life</b></p>
                    <p>Driving can be one of the worst ways to commute from a quality of life perspective. But for those who have to, let's make it the best commute possible! And for those who want to use other methods, let's make that possible. Everyone benefits when we diversify our options!</p>
                    <aside class="note">
                        <p>Some folks have hang-ups about certain transportation options like cycling, buses, rail, etc. Sometimes these modes get tangled up in our notions about freedom, poverty, elitism, etc. <b>This is worth some introspection!</b> The stigmas we assign to things tend to not reflect reality. Give one a try! Hop on a bike or a bus with an open mind, and see if it challenges your expectations.</p>
                    </aside>
                    <br/>
                    <hr />
                    <br />
                </li>
                <li>
                    <p><b>Car crashes snarl traffic, and we can reduce them!</b></p>
                    <p>In Georgia, 76% of crashes are caused by behaviors like distractions, impairment or driving too fast. <a href="https://gdot.numetric.net/crash-data#/a7fae23c-ffac-4c53-b6a9-c26f9baf60db?view_id=3" target="_blank" class="fs-6">Source: GDOT</a></p>
                    <p>We treat crashes as an unavoidable fact of life, and most of us have been involved in at least one. We know it only takes a small mistake to create a ton of damage, even to the point of injury or death.</p>
                    <p>But crashes aren't unavoidable! In regions that have had success in reducing crashes, they create what is often called "forgiving infrastructure". It's the idea that we should build infrastructure that accounts for the fact that we make mistakes.</p>
                    <p>Here are a few examples:</p>
                    <ol type="a">
                        <li>
                            <p><em>Lowering Speed Limits</em></p>
                            <p>Suggesting this to your average commuter should only be done if you have access to private security! But,  counterintuitively, it gets us to our destinations faster on average.</p>
                            <p>We know lower speeds reduces crashes, reduces some of the aggressive driving that snarls rush hour, and saves lives.</p>
                        </li>
                        <li>
                            <p><em>Traffic Calming</em></p>
                            <p>In some areas, we can make adjustments to roads that allow cars to travel at safe reasonable speeds, but make them difficult to race on. This can be adding things like speed tables (speed bumps are so last century), putting slight curves in roads, narrowing lanes, etc.</p>
                            <p>These are often especially effective in residential areas.</p>
                        </li>
                        <li>
                            <p>This list could go on, with things like <em>preventing right turns on red</em>, or <em>making pedestrian crossings safer</em>, or <em>automated speed enforcement</em> (not privately-run!) in high crash areas and school zones, <em>or protecting bike lanes</em>, etc.</p>
                            <p>Every road needs a different set of solutions. But each can be effective in different contexts in creating safer roads with fewer crashes.</p>
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
        <div class="col-12"><hr></div>
        <div class="col-12 col-lg-8 mt-5 text-center">
            <h2>Conclusion</h2>
        </div>
        <div class="col-12 col-lg-8 mt-4 text-lg">
            <p>Sometimes, it really <em>is</em> possible to have a win-win. Building forgiving infrastructure for all modes of transport increases the quality of life for drivers, cyclists, pedestrians, and transit riders!</p>
        </div>
    </div>
</div>

<GoogleAnalytics properties={[ 'UA-1097544-80' ]} />

<script>
import RoadAnimation from '$lib/RoadAnimation.svelte';
import RoadAnimation2 from '$lib/RoadAnimation2.svelte';
import RoadAnimation3 from '$lib/RoadAnimation3.svelte';
import RoadAnimation4 from '$lib/RoadAnimation4.svelte';
import { base, assets } from '$app/paths';
export const prerender = true;
import { GoogleAnalytics } from '@beyonk/svelte-google-analytics'
</script>