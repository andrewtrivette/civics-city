<div class="hero">
	<div class="content">
    	<h3>Government Impacts Everyone</h3>
    	<h4>Everyone should be able to participate.</h4>
	</div>
</div>

<style>
    .hero {
    min-height: 500px;
    height: 10vh;
    color: white;
    padding: 50px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}
.hero::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; 
    height: 100%;
    background-image: url('../../static/skyline.jpg');
    background-size: cover;
    background-position: bottom center;
    filter: grayscale(.5) brightness(0.6) contrast(1);
    z-index: 0;
  }
  .hero::after {
    content: '';
    position: absolute;
    inset: 0 0 0 0;
    background-color: rgba(0, 100, 255, 0.15);
    z-index: 1;
}
  .hero .content {
      max-width: 1280px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
  }
  .hero .content::after {
      content: '';
      display: table-cell;
  }
.hero h3,
.hero h4 {
    background-color: rgb(100, 0, 100);
    padding: 20px 30px;
    display: inline-block;
    font-size: clamp( 2rem, 3vw, 3rem);
    backdrop-filter: blur(5px) brightness(0.2);
    margin: 10px 0;
    transform: rotate(-0.5deg);
    box-shadow: 4px 4px 0px black;
    text-align: center;
}
.hero h4 {
    font-size: clamp( 1rem, 2.2vw, 2rem);;
    float: right;
    transform: rotate(0.5deg)
}
</style>