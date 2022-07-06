<figure>
    <div class="wrapper alternate">
        <div class="road north">
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
        <div class="road west cross">
            <div class="lane bikes"></div>
            <div class="lane"></div>
            <div class="lane"></div>
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
            <div class="lane bikes"></div>
        </div>
        <div class="road east cross">
            <div class="lane bikes">
            </div>
            <div class="lane">
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
                <div class="car"></div>
            </div>
            <div class="lane"></div>
            <div class="lane"></div>
            <div class="lane bikes"></div>
        </div>
        <div class="road south">
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
        <div class="center"></div>
    </div>
</figure>

<style>
figure {
    overflow: hidden;
    width: 1024px;
    aspect-ratio: 2/1;
    margin: 20px -100px;
    max-width: calc(100% + 200px);
    filter: saturate(.5)
}
.wrapper {
    /* width: 1024px; */
    background-color: rgb(70, 70, 70);
    aspect-ratio: 1;
    margin: -25% auto;
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 1fr 33.33% 1fr;

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
}
.south {
    grid-column: 2 / span 1;
    grid-row: 3 / span 1;
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
    border: 3px dashed white;
    border-width: 0 3px;
    width: 25%;
    display: flex;
    gap: 20px;
    align-items:center;
    justify-content: space-around;
}
.road.cross .lane {
    width: 100%;
    height: 25%;
    border-width: 3px 0;
    align-content: space-around;
    justify-content:  flex-start;
}
.road.cross .lane.bikes {
    height: 12.5%;
    background-color: green;
}
.lane:nth-child(2) {
    border-right: 3px solid yellow;
    margin-right: 3px;
}
.lane:nth-child(3) {
    border-left: 3px solid yellow;
    margin-left: 3px;
}
.road.cross .lane:nth-child(2) {
    border-bottom: none;
    border-right-width: 0;
    margin-right: 0;
}
.road.cross .lane:nth-child(3) {
    border: 3px solid yellow;
    border-width: 3px 0;
    margin-left: 0;
}
.road.cross .lane:nth-child(4) {
    border-top: none;
    border-right-width: 0;
    margin-right: 0;
}
.road.west .lane:nth-child(1n+3) {
    border-right: 15px solid white;
    flex-direction: row-reverse;
}
.road.south .lane:nth-child(1n+3) {
    border-top: 15px solid white;
    flex-direction: column;
}
.road.north .lane:nth-child(-n+2) {
    border-bottom: 15px solid white;
    flex-direction: column-reverse;
}
.road.east .lane:nth-child(-n+3) {
    border-left: 15px solid white;
}
.cars {
    grid-column: 1 / span 3;
    grid-row: 1 / span 3;
    background-color: white;
    opacity: 0.5;
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
    /* transform-origin: center center; */
}
.car:before {
    content: '';
    height: 16px;
    border: 10px solid #222;
    width: 70%;
    border-color: #222 transparent #222 transparent;
    border-width: 16px 3px 16px 3px ;
    display: block;
}

.road.cross .car {
    height: 60%;
    width: auto;
    flex-direction: row;
    aspect-ratio: 16/9;
}
.road.cross .car:before {
    border-color: transparent #222 transparent #222;
    border-width: 3px 16px 3px 16px;
    width:16px;
    height: 70%;
}
.car {
    border-color: rgb(184, 0, 0);
}
.road .lane .car::after {
    content: '';
    display: block;
    position: absolute;
    border-radius: 15px;    
    height: 5px;
    width: calc( 100% - 30px );
    top: auto;
    bottom: 0;
    border: 5px solid rgb(184, 0, 0);
    border-width: 0 15px;
}
.road.north .lane .car::after {
    top: 0;
    bottom: auto;
}
.road.east .lane .car::after,
.road.west .lane .car::after {
    width: 5px;
    height: calc( 100% - 30px );
    left: 0;
    border-width: 15px 0;
}
.road.east .lane .car::after {
    left: auto;
    right: 0;
}
.road.west .lane:nth-child(4) .car:nth-child(1)::after {
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
.road.west .lane:nth-child(4) .car:nth-child(1) {
    animation: firstCarTurnLeft 10s linear infinite;
    margin-right: 100px;
}
@keyframes firstCarTurnLeft {
    0% {
        transform: rotate(0deg) translate(-0px, 0px);
    }
    10% {
        transform: rotate(-45deg) translate(100px, 0px);
    }
    20% {
        transform: rotate(0deg) translate(100px, -170%);
    }
    100% {
        transform: rotate(0deg) translate(100px, -170%);
    }
}
.road.west .lane:nth-child(4) .car:nth-child(2) {
    margin-right: 100px;
}
.road.west .lane:nth-child(4) .car:nth-child(n+2) {
    animation: westCarsForward 10s linear infinite;
}
@keyframes westCarsForward {
    0% {
        transform: translate(0, 0);
    }
    5% {
        transform: translate(50px, 0);
    }
    100% {
        transform: translate(1800px,0);
    }
}



.road.east .lane:nth-child(2) .car:nth-child(1)::after {
    animation: eastTurnSignalLeft 1s linear infinite;
}
@keyframes eastTurnSignalLeft {
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
.road.east .lane:nth-child(2) .car:nth-child(1) {
    animation: eastFirstCarTurnLeft 10s linear infinite;
    margin-left: 100px;
}
@keyframes eastFirstCarTurnLeft {
    0% {
        transform: rotate(0deg) translate(-0px, 0px);
    }
    10% {
        transform: rotate(-45deg) translate(-100px, 0px);
    }
    20% {
        transform: rotate(0deg) translate(-100px, 85px);
    }
    100% {
        transform: rotate(0deg) translate(-100px, 85px);
    }
}
.road.east .lane:nth-child(2) .car:nth-child(2) {
    margin-left: 100px;
}
.road.east .lane:nth-child(2) .car:nth-child(n+2) {
    animation: eastCarsForward 10s linear infinite;
}
@keyframes eastCarsForward {
    0% {
        transform: translate(0, 0);
    }
    5% {
        transform: translate(-50px, 0);
    }
    100% {
        transform: translate(-1800px,0);
    }
}

</style>