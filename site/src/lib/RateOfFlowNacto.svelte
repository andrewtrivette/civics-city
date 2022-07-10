<div id="road-animation" class={labels && 'labels'}>
    <div class="road">
        <div class="lane cars">
            <div class="title">Cars: <b>600 - 1,600</b></div>
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
            <div class="car"></div>
        </div>
        <div class="lane buses">
            <div class="title">Buses: <b>4,000 - 8,000</b></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
            <div class="bus"></div>
        </div>
        <div class="lane transit">
            <div class="title">Train: <b>10,000 - 25,000</b></div>
            <div class="train"></div>
            <div class="train"></div>
            <div class="train"></div>
            <div class="train"></div>
            <div class="train"></div>
        </div>
        <div class="lane multi">
            <div class="title">Bikes: <b>7,500</b></div>
            <div class="bikes">
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>  
            </div>
            <div class="bikes">
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
                <div class="bike"></div>
            </div>
        </div>
    </div>   
    
    <caption>Transportation Type: People per Hour</caption>
</div>

<style>

#road-animation {
    background-color: #222;
    padding: 0;
    /* max-width: 1024px; */
    margin:20% auto;
    
    
    overflow: hidden;
    /* gap: 4%; */
    position: relative;
    filter: saturate(.5);
    transform: scale(1.25);
}
.road {
    border: 40px solid #D7D7D9;
    border-width: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: space-around;
    justify-content: center;
    position: relative;
    height: 400px;
}
caption {
    width: 100%;
    font-size: 16px;
    color: white;
    background-color: #111;
    display: block;
    text-align: center;
}
.lane,
.bikes {
    border: 3px dashed #D7D7D9;
    border-width: 3px 0;
    width: 200%;
    height: 25%;
    background-color: #333;
    display: flex;
    align-items: center;
    margin-left: -50%;
    position: relative;
    box-sizing: content-box;
}

.bikes:nth-child(2) {
    border-top: none;
}
.bikes:last-child {
    border-bottom: none;
}

.title {
    position: absolute;
    background-color: rgba(0,0,0,0.8);
    left: 25%;
    z-index: 1001;
    padding: 10px 15px;
    font-size: 0.9rem;
    backdrop-filter: blur( 5px);
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    border-radius: 0 10px 10px 0;
}

.labels .title {
    opacity: 1;
}
.car,
.bus,
.train,
.bike {
    --gap: 20px;
    height: 80%;
    border-radius: 5px;
    margin: 0 var(--gap);
    display: flex;
    align-items: center;
    justify-content: space-around;
    animation-fill-mode: forwards;
}
@keyframes carShift {
    0% {
        transform: translateX(calc(-50% - var(--gap)));
    }
    100% {
        transform: translateX(calc( 50% + var(--gap) ));
    }
}
.car {
    aspect-ratio: 16/9;
    background-color: #D95F18;
    animation: carShift 4s linear infinite;
}
.car:before,
.car:after {
    content: '';
    width:0;
    border: 10px solid #222;
    height: 70%;
    border-color: transparent transparent transparent #222;
    border-width: 3px 0 3px 20px;
    display: block;
}
.car:after {
    border-color: transparent #222 transparent transparent;
    border-width: 3px 20px 3px 0;
}

.lane.buses {
    background-color: #A6261B;
}
.bus {
    --gap: 360px;
    background-color: white;
    aspect-ratio: 6/1;
    height: 90%;
    margin: 0 var(--gap);
    animation: carShift 10s linear infinite;
}

.lane.transit {
    background-color: black;
    position: relative;
}
.lane.transit:before,
.lane.transit:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: rgba(255,255,255,0.1);
    top: 25%;
}
.lane.transit:after {
    top: auto;
    bottom: 25%;
}
.train {
    --gap: 5px;
    background-color: silver;
    aspect-ratio: 8/1;
    margin: 0 var(--gap);
    animation: carShift 4s linear infinite;
    height: 90%;
}
.bus::before,
.train::before {
    height: 100%;
    aspect-ratio: 1;
    content: '';
    width: 60px;
    border-left: 20px solid #D95F18;
    background-color: #fcb117;
    border-right: 20px solid #1E91D9;
    transform: skewX(-50deg)
}
.lane.multi {
    flex-direction: column;
    /* border: none !important; */
    margin: 0;
}
.lane.multi .bikes {
    background-color: #297373;
    width: 100%;
    height: 50%;
    box-sizing: content-box;
}
.lane.multi .title {
    left:0;
}
.lane.multi .bikes:nth-child(even) .bike {
    /* transform: rotate(18deg); */
    animation-direction: reverse;
}
.bike {
    --gap: 10px;
    height: 10%;
    aspect-ratio: 4/1;
    background-color: white;
    margin: 0 var(--gap);
    animation: bikeShift 2s infinite linear;
    text-align: center;
    box-sizing: content-box;
}
.bike:nth-child(even) {
    margin-top: -20px;
}
.bike:nth-child(odd) {
    margin-bottom: -20px;
} 
.bike::before {
    content: '';
    background-color: white;
    height: 150%;
    aspect-ratio: 1;
    border-radius: 100%;
    display: block;
    margin: -5% auto -10% auto;
}
@keyframes bikeShift {
    0% {
        transform: translateX(calc(-100% - var(--gap)));
    }
    100% {
        transform: translateX(calc( 175% + var(--gap)*2 ));
    }
}

</style>

<script>
    export let labels;
</script>