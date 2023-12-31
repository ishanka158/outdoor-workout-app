'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {

    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords,disance,duration){
        this.coords = coords;
        this.disance = disance;
        this.duration = duration;
    }
}

class Running extends Workout{
    constructor(coords,disance,duration,cadence){
        super(coords,disance,duration);
        this.cadence = cadence;
        this.calcPace();
    }
    calcPace(){
        this.pace = this.duration/this.disance;
        return this.pace;
    }
}

class Cycling extends Workout {
    constructor(coords,disance,duration,elevationGain){
        super(coords,disance,duration);
        this.elevationGain = elevationGain;
    }
    calcSpeed(){
        this.speed = this.disance / (this.duration/60);
        return  this.speed;
    }
}

// const run1 = new Running([39,-12],5.2,24,178)
// const cycling1 = new Cycling([39,-12],27,95,523)

// console.log(run1,cycling1)

class App{
    #map;
    #mapEvent;

    constructor(){
        this._getPosition();

        form.addEventListener('submit',this._newWorkout.bind(this));   
       
        inputType.addEventListener('change',this._togleElevationFeild);
    }

    _getPosition(){
        if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),     
        function(){
            alert('could not get your position');
        }
    );

    }

    _loadMap(position){
        
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},15z?entry=ttu`);

                        
            this.#map = L.map('map').setView([latitude, longitude], 14);
            
            L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            
            this.#map.on('click',this._showForm.bind(this));
        }
    

    _showForm(mapE){
        this.#mapEvent = mapE;
                form.classList.remove('hidden');
                inputDistance.focus();
    }

    _togleElevationFeild(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e){
        e.preventDefault();

        const validInputs = (...inputs)=> inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp=>inp>0);

        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;

        if(type==='running'){
            const cadence = +inputCadence.value;
            //if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence))
            if(!validInputs(distance,duration,cadence) || allPositive(distance,duration,cadence)) return alert('Input have to be positive number')
        }


        if(type==='cycling'){
            const elevation = +inputElevation.value;
            if(!validInputs(distance,duration,cadence) || allPositive(distance,duration)) return alert('Input have to be positive number')

        }
    
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

         const {lat,lng} = this.#mapEvent.latlng;

                L.marker([lat,lng]).addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth:250,
                    minWidth:100,
                    autoClose:false,
                    closeOnClick:false,
                    className: 'running-popup'
                }))
                .setPopupContent('Workout')
                .openPopup();
    }

}


const app = new App();
app._getPosition();

   
    