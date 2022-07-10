<figure>
    <div class="wrapper alternate">
        <div class="road north">
            <div class="lane">
                <div class="car"></div>
            </div>
            <div class="lane">
                <div class="car"></div>
            </div>
            <div class="lane"></div>
            <div class="lane"></div>
        </div>
        <div class="road west cross">
            <div class="lane"></div>
            <div class="lane"></div>
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
        </div>
        <div class="road east cross">
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
            <div class="lane"></div>
            <div class="lane"></div>
            
        </div>
        <div class="road south">
            <div class="lane"></div>
            <div class="lane"></div>
            <div class="lane">
                <div class="car"></div>
            </div>
            <div class="lane">
                <div class="car"></div>
            </div>
        </div>
        <div class="center"></div>

    </div>
    <caption>Before: 4 lanes inefficiently used</caption>
</figure>

<style>
figure {
    width: 1024px;
    aspect-ratio: 2/1;
    margin: 20px 0;
    max-width: 100%;
    filter: saturate(.5);
    --stripe-width: 3px;
    --stop-width: 15px;
    transform: scale(1.25)
}
@media (max-width: 768px) {
    figure {
        --strip-width: 1px;
        --stop-width: 5px;
    }
}
caption {
    width: 100%;
    font-size: 16px;
    color: white;
    background-color: #111;
    display: block;
    text-align: center;
}
.wrapper {
    /* width: 1024px; */
    background-color: rgb(70, 70, 70);
    aspect-ratio: 2/1;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 1fr 66% 1fr;
    overflow: hidden;
}
.road,
.center {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    align-content: space-around;
    justify-content: center;
    background-color: #222;
}
.road.cross {
    flex-direction: column;
}
.north {
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;
    overflow: hidden;
}
.south {
    grid-column: 2 / span 1;
    grid-row: 3 / span 1;
    overflow: hidden;
}
.east {
    grid-column: 3 / span 1;
    grid-row: 2 / span 1;
}
.west {
    grid-column: 1 / span 1;
    grid-row: 2 / span 1;
}
.center {
    grid-column: 2 / span 1;
    grid-row: 2 / span 1;
}
.lane {
    border: var(--stripe-width) dashed white;
    border-width: 0 var(--stripe-width);
    width: 25%;
    display: flex;
    gap: 20px;
    align-items:center;
    justify-content: space-around;
}
.road.cross .lane {
    width: 100%;
    height: 25%;
    border-width: var(--stripe-width) 0;
    align-content: space-around;
}
.lane:nth-child(2) {
    border-right: var(--stripe-width) solid yellow;
    margin-right: var(--stripe-width);
}
.lane:nth-child(3) {
    border-left: var(--stripe-width) solid yellow;
    margin-left: var(--stripe-width);
}
.road.cross .lane:nth-child(2) {
    border-bottom: var(--stripe-width) solid yellow;
    border-right-width: 0;
    margin-bottom: var(--stripe-width);
    margin-right: 0;
}
.road.cross .lane:nth-child(3) {
    border-top: var(--stripe-width) solid yellow;
    border-left-width: 0;;
    margin-top: var(--stripe-width);
    margin-left: 0;
}
.road.west .lane:nth-child(1n+3) {
    border-right: var(--stop-width) solid white;
    flex-direction: row-reverse;
}
.road.south .lane:nth-child(1n+3) {
    border-top: var(--stop-width) solid white;
    flex-direction: column;
}
.road.north .lane:nth-child(-n+2) {
    border-bottom: var(--stop-width) solid white;
    flex-direction: column-reverse;
}
.road.east .lane:nth-child(-n+2) {
    border-left: var(--stop-width) solid white;
}

.car {
    aspect-ratio: 9/16;
    background-color: #D95F18;
    width: 60%;
    border-radius: 5px;
    display: flex;
    align-items:center;
    justify-content: space-around;
    flex-direction: column;
    position: relative;
    transform-origin: center center;
    border-color: rgb(184, 0, 0);
    --window-height: 10px;
    --window-slope: 3px;
}
@media (max-width: 768px) {
    .car {
        --window-height: 6px;
        --window-slope: 2px;
    }
}
.road.cross .car {
    height: 60%;
    width: auto;
    flex-direction: row;
    aspect-ratio: 16/9;
}
/* Car Windows */
.car:before {
    content: '';
    height: 50%;
    border: 10px solid #222;
    width: 80%;
    border-color: #222 transparent #222 transparent;
    border-width: var(--window-height) var(--window-slope);
    display: block;
}
.road.cross .car:before {
    border-color: transparent #222 transparent #222;
    border-width:  var(--window-slope) var(--window-height);
    width:50%;
    height: 80%;
}

/* Tail Lights */
.road .lane .car::after {
    content: '';
    display: block;
    position: absolute;    
    height: 8%;
    width:100%;
    top: auto;
    bottom: 0;
    border: 5px solid rgb(184, 0, 0);
    border-width: 0 var(--window-height);
}
.road.north .lane .car::after {
    top: 0;
    bottom: auto;
}
.road.east .lane .car::after,
.road.west .lane .car::after {
    top:0;
    width: 8%;
    height: auto;
    bottom: 0;
    left: 0;
    border-width: var(--window-height) 0;
}
.road.east .lane .car::after {
    left: auto;
    right: 0;
}
.road.west .lane:nth-child(3) .car:nth-child(1)::after {
    animation: turnSignalLeft 1s linear infinite;
}
@keyframes turnSignalLeft {
    0% {
        border-top-color: inherit;
    }
    50% {
        border-top-color: transparent;
    }
    100% {
        border-top-color: inherit;
    }
}

.road.east .lane:nth-child(2) .car:nth-child(1)::after {
    animation: turnSignalRight 1s linear infinite;
}
@keyframes turnSignalRight {
    0% {
        border-bottom-color: inherit;
    }
    50% {
        border-bottom-color: transparent;
    }
    100% {
        border-bottom-color: inherit;
    }
}

.road.east .lane:nth-child(2) .car:nth-child(2) {
    animation: secondCarLeft 15s linear infinite;
}
@keyframes secondCarLeft {
    0% {
        transform: rotate(0deg) translate(0px, 0px);
    }
    20% {
        transform: rotate(45deg) translate(0px, 0px);
    }
    30% {
        transform: rotate(0deg) translate(-100px, -190%);
    }
    100% {
        transform: translate(-800px, -200%);
    }
}

.road.east .lane:nth-child(2) .car:nth-child(3) {
    animation: thirdCarLeft 15s linear infinite;
}
@keyframes thirdCarLeft {
    0% {
        transform: rotate(0deg) translate(0px, 0px);
    }
    40% {
        transform: rotate(45deg) translate(0px, 0px);
    }
    50% {
        transform: rotate(0deg) translate(-100px, -190% );
    }
    100% {
        transform: translate(-600px, -200%);
    }
}

.road.east .lane:nth-child(1) .car:nth-child(1) {
    animation: flowFirstCar 15s linear infinite;
}
@keyframes flowFirstCar {
    0% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate( -1000px, 0px);
    }
}

.road.east .lane:nth-child(1) .car:nth-child(2) {
    animation: flowSecondCar 15s linear infinite;
}
@keyframes flowSecondCar {
    10% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate(-900px, 0px );
    }
}

.road.east .lane:nth-child(1) .car:nth-child(3) {
    animation: flowThirdCar 15s linear infinite;
}
@keyframes flowThirdCar {
    0% {
        transform: translate(0px, 0px);
    }
    30% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate(-700px, 0px );
    }
}



.road.west .lane:nth-child(3) .car:nth-child(2) {
    animation: secondCarLeft1 15s linear infinite;
}
@keyframes secondCarLeft1 {
    0% {
        transform: rotate(0deg) translate(0px, 0px);
    }
    20% {
        transform: rotate(45deg) translate(0px, 0px);
    }
    30% {
        transform: rotate(0deg) translate(100px, 190%);
    }
    100% {
        transform: translate(800px, 200%);
    }
}

.road.west .lane:nth-child(3) .car:nth-child(3) {
    animation: thirdCarLeft1 15s linear infinite;
}
@keyframes thirdCarLeft1 {
    0% {
        transform: rotate(0deg) translate(0px, 0px);
    }
    40% {
        transform: rotate(45deg) translate(0px, 0px);
    }
    50% {
        transform: rotate(0deg) translate(100px, 190% );
    }
    100% {
        transform: translate(600px, 200%);
    }
}

.road.west .lane:nth-child(4) .car:nth-child(1) {
    animation: flowFirstCar1 15s linear infinite;
}
@keyframes flowFirstCar1 {
    0% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate( 1000px, 0px);
    }
}

.road.west .lane:nth-child(4) .car:nth-child(2) {
    animation: flowSecondCar1 15s linear infinite;
}
@keyframes flowSecondCar1 {
    10% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate(900px, 0px );
    }
}

.road.west .lane:nth-child(4) .car:nth-child(3) {
    animation: flowThirdCar1 15s linear infinite;
}
@keyframes flowThirdCar1 {
    0% {
        transform: translate(0px, 0px);
    }
    30% {
        transform: translate(0px, 0px);
    }
    100% {
        transform: translate(700px, 0px );
    }
}

</style>