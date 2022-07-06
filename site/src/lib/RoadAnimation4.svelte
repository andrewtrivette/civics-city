<figure>
    <div class="road">
        <div class="lane"></div>
        <div class="lane"></div>
        <div class="lane"></div>
        <div class="lane"></div>
        <div class="lane"></div>
    </div>
    <div class="cars">
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
        <div class="group">
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
            <div class="car">🚘</div>
        </div>
    </div>
    <div class="signs">
        <div class="sign">Bridge Melted Ahead</div>
        <div class="sign">285 Cattle Crossing</div>
        <div class="sign">Today's Car Crash on Your Left</div>
        <div class="sign">Pollen: Low Visibility</div>
        <div class="sign">Next Exit: 25 minutes</div>
        <div class="sign">Traffic is Broken</div>
    </div>
</figure>

<style>
@import url('https://fonts.googleapis.com/css2?family=Codystar&display=swap');

figure {
    background-image: linear-gradient(45deg,rgb(0,16,51),#4f0074,rgb(255,255,159));
    padding: 0;
    margin: 0 auto;
    aspect-ratio: 5/1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: space-around;
    justify-content: center;
    overflow: hidden;
    position: relative;
    perspective: 50px;
}
.road {
    background-color: #0e182e;
    height: 1900px;
    position: absolute;
    left: -300px;
    right: -300px;
    bottom: 0;
    transform-origin: 0 100%;
    transform: rotateX(80deg);
    display: flex;
    z-index: -15;
    /* perspective: 450px; */
    border: 15px solid rgb(128, 128, 128);
    border-width: 0 300px;
}
.lane {
    width: 20%;
    border: 15px dashed white;
    border-width: 0 5px;
}
.lane:first-child {
    border-left-style: solid;
}
.lane:last-child {
    border-right-style: solid;
}
.cars {
    width: 90%;
    margin: 0 5%;
    height: 100%;
    text-align: center;
    perspective: 50px;
}
.group {
    position: absolute;
    bottom: 0;
    transform-origin: 0 0%;
    left: 50%;
    width: 100%;
    text-align: center;
    display: flex;
    line-height: 1;
    perspective: 50px;
}
.group:nth-child(8) {
    transform: translate3d(-50%, 0, 0);
}
.group:nth-child(7) {
    transform: translate3d(-50%, 0vh, -25px);
}
.group:nth-child(6) {
    transform: translate3d(-50%, 0vh, -50px);
}
.group:nth-child(5) {
    transform: translate3d(-50%, 0, -75px);
}
.group:nth-child(4) {
    transform: translate3d(-50%, 0, -100px);
}
.group:nth-child(3) {
    transform: translate3d(-50%, 0, -125px);
}
.group:nth-child(2) {
    transform: translate3d(-50%, 0, -150px);
}
.group:nth-child(1) {
    transform: translate3d(-50%, 0, -175px) ;
}

.car {
    font-size: 15vw;
    filter: saturate(0.1);
    position: relative;
    display: block;
    line-height: 1;
    width: 20%;
    margin: 0;
    animation: shift 1s linear infinite;
}

/* .car::after {
    content: '🤬';
    position: absolute;
    font-size: 3vw;
    top: 38%;
    left: 35%;
    filter: sepia(100%) saturate(100%) hue-rotate(220deg) 
} */

.group .car:nth-child(odd) {
    filter: saturate(0) hue-rotate(220deg);
    animation: shift 1s linear .2s infinite;
}
.group .car:nth-child(3n) {
    filter: saturate(0.2);
    animation: shift 1s linear .1s infinite;
}
.group .car:nth-child(5n) {
    filter:saturate(0.3);
    animation: shift 1s linear .3s infinite;
}

.group:nth-child(3n) .car:nth-child(odd) {
    filter: saturate(0);
    animation: shift 1s linear .5s infinite;
}
.group:nth-child(3n) .car:nth-child(3n) {
    filter: saturate(0.6);
    animation: shift 1s linear .6s infinite;
}
.group:nth-child(3n) .car:nth-child(5n) {
    filter:saturate(0.5) hue-rotate(160deg);
    animation: shift 1s linear .7s infinite;
}

.group:nth-child(even) .car:nth-child(even) {
    filter: saturate(0.5);
    animation: shift 1s linear .8s infinite;
}
.group:nth-child(odd) .car:nth-child(odd) {
    filter: saturate(0.2) hue-rotate(60deg);
    animation: shift 1s linear .9s infinite;
}
.group:nth-child(even) .car:nth-child(5n) {
    filter:saturate(0.3);
    animation: shift 1s linear .75s infinite;
}

.signs {
    position: absolute;
    z-index: 20;
    color: rgb(255, 255, 149);
    background-color: rgb(0, 0, 0);
    padding: 0.5% 1%;
    font-family: 'Codystar', sans-serif;
    border-radius: 5px;
    border: 5px solid white;
    left: 20%;
    width: 60%;
    top: 5%;
    font-size: 2vw;
    font-weight: bold;
    text-align: center;
    height: calc( 4vw + 1%);
}
.signs::after {
    content: '';
    display: block;
    border: 6px solid #ccc;
    border-width: 6px 0;
    position: absolute;
    left: -100%;
    width: 300%;
    z-index: -5;
    top: -12px;
    bottom: -12px;
}
.signs .sign {
    opacity: 0;
    position: absolute;
    inset: 0;
}
.signs .sign:nth-child(1) {
    animation: display 2s linear forwards;
}
.signs .sign:nth-child(2) {
    animation: display 2s linear 2s forwards;
}
.signs .sign:nth-child(3) {
    animation: display 2s linear 4s forwards;
}
.signs .sign:nth-child(4) {
    animation: display 2s linear 6s forwards;
}
.signs .sign:nth-child(5) {
    animation: display 2s linear 8s forwards;
}
.signs .sign:nth-child(6) {
    animation: displayEnd 2s linear 10s forwards;
}

@keyframes display {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
@keyframes displayEnd {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}

@keyframes shift {
    0% {
        line-height: 1.005;
    }
    25% {
        line-height: 1;
    }
    50% {
        line-height: .995;
    }
    75% {
        line-height: 1;
    }
    100% {
        line-height: 1.005;
    }
}


@media (max-width: 768px ) 
{
    figure {
        aspect-ratio: 7/2;
    }
    .signs {
        top: 15%;
        left: 10%;
        padding: 1%;
        width: 80%;
        height: calc( 8vw + 2%);
    }
    .signs .sign {
        
        font-size: 4vw;
    }
}

</style>