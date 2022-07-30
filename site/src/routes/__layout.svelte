<script>
	import '../app.css';
</script>

<header>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container">
			
			<a class="navbar-brand" href="/">Civics.City: Atlanta<span class="badge">BETA</span></a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							City Council
						  </a>
						  <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
							<li><a sveltekit:reload class="nav-link" href="/city-council">District Map</a></li>
							<li><a sveltekit:reload class="nav-link" href="/city-council/#members">Members</a></li>
							<li><a sveltekit:reload class="nav-link" href="/meeting/">Agendas & Minutes</a></li>
						  </ul>
						
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							Issues
						  </a>
						  <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
							<li><a sveltekit:reload class="nav-link" href="/public-safety">Crime & Safety</a></li>
							<li><a sveltekit:reload class="nav-link" href="/transportation">Transportation</a></li>
						  </ul>
						
					</li>
				</ul>
			  </div>
			<span class="navbar-text text-white">
			A Citizen's View of Atlanta
			</span>
		</div>
	</nav>
</header>
<main>
	<slot />
</main>

<footer class="page-footer p-5">
	<div class="container">
		<div class="row">
			<div class="col-12 col-lg-6">
				<div class="fs-5"><b>About</b></div>
				<p>Citizens deserve easy, accessible access to their city government, on a wide range of devices. That access should be organized and formatted in a citizen-directed way. This is the beginning of an attempt to aggregate some of the important information of the city in such a way.</p>
				
			</div>
			<div class="col-12 col-lg-6">
				<div class="fs-5"><b>Disclaimer</b></div>
				<p>Every attempt is made to ensure everything is accurate and up-to-date, however no warranty is made about the accuracy of the information. This is a personal project. Errors may happen.</p>
				<p>&copy; 2022 <a href="mailto:andrew.trivette+civics@gmail.com">Andrew Trivette</a> All Rights Reserved</p>
			</div>
		</div>
		<div class="row mt-5">
			<div class="col-12 text-center">
				<div class="fs-5"><b>Related Projects</b></div>
				<p><img src="https://kurious.io/icons/maskable_icon.png" alt="kurious.io" class="rounded-circle me-2" width="60" /><a href="https://www.kurious.io" target="_blank">kurious.io</a> tackles challenging civic and philosophical topics in short-form, approachable ways</p>
			</div>
		</div>
	</div>
</footer>

