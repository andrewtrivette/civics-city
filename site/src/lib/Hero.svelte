<script>
    import Skyline from '$lib/skyline.svelte';
</script>
<div class="hero">
    <div class="svg">
        <Skyline />
        </div>
    <div class="content">
        <h3>Government Impacts Everyone</h3>
        <h4>Everyone should be able to participate.</h4>
    </div>
</div>

<style>
    .hero {
        color: white;
        padding: 0px;
        position: relative;
        border-bottom: 1px solid rgba(255,255,255,0.5);
        background-image: linear-gradient(45deg,rgb(0, 16, 51),#4f0074, rgb(255, 255, 159));
        min-height: 500px;
    }
    .hero .svg {
        width: 100%;
        opacity: 0.2;
        position: absolute;
        bottom: 0;
    }
    
    .hero .content {
        max-width: 1600px;
        margin: 0px;
        z-index: 2;
        position: absolute;
        inset: 30px 10%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    @media only screen and (max-width: 960px) {
        .hero .content {
            justify-content: flex-start;
        }
    }

    .hero h3,
    .hero h4 {
        background-color: rgba(20, 0, 20, 0.7);
        padding: 20px 30px;
        font-size: clamp( 2rem, 3vw, 3rem);
        backdrop-filter: blur(5px);
        margin: 10px;
        transform: rotate(-0.5deg);
        box-shadow: 4px 4px 4px black;
        text-align: center;
        color: white;
        align-self: flex-start;
    }
    .hero h4 {
        font-size: clamp( 1rem, 2.2vw, 2rem);
        transform: rotate(0.5deg);
        align-self: flex-end;
        justify-self:flex-end;
    }
</style>