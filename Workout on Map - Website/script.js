'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Instructions message
const message = document.querySelector('.message');
//delete btn
const deleteBtn = document.querySelector('.deleteBtn');

// --------------
// workout class
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // arrray of [latitude , longitude]
    this.distance = distance; // in km
    this.duration = duration; // in meters
  }

  _createDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

const checck = new Workout(125, 12, 225);
// --------------
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._createDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

// --------------
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevetionGain) {
    super(coords, distance, duration);
    this.elevetionGain = elevetionGain;
    this.calcSpeed();
    this._createDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// --------------
class App {
  #mapEvent;
  #map;
  #clicked = false;
  #workout = [];
  // #noWorkout = true;
  constructor() {
    this._getPosition();

    // get data from local storage
    this._getLocalData();

    // listing for the event when the form is get submited
    form.addEventListener('submit', this._newWorkout.bind(this));
    // changing the input field
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    // delete btn ...
    deleteBtn.addEventListener('click', this._reset);  
    // instruction message
    message.style.fontSize = '1.5rem';
    message.style.marginTop = '5rem';
    
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(
            'You have to allow the location to map your workout on the map. 🙂'
          );
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    // render marker from the local storage
    this.#workout.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    if (!this.#clicked) {
      this.#mapEvent = mapE;
      message.style.display = 'none';
      form.classList.remove('hidden');
      inputDistance.focus();
      const { lat, lng } = this.#mapEvent.latlng;

      this.#clicked = true;
      L.marker(
        { lat, lng },
        {
          opacity: 0.3,
        }
      ).addTo(this.#map);
    }
  }

  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _moveToPopup(event) {
    const workoutEl = event.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workout.find(
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, 19, {
      animate: true,
      pan: {
        duration: 0.5,
      },
    });
  }

  _newWorkout(event) {
    
    // helper functions
    const validateInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    // check positive
    const checkPositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();
    // get data from the form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // validations
      if (
        !validateInputs(distance, duration, cadence) ||
        !checkPositive(distance, duration, cadence)
      ) {
        return alert('input field values must be positive 🙄');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevetion = +inputElevation.value;
      // validations
      if (
        !validateInputs(distance, duration, elevetion) ||
        !checkPositive(distance, duration)
      ) {
        alert('input field values must be positive 🙄');
      }
      if (elevetion === 0) {
        alert('Elevation value should not be 0');
      }
      workout = new Cycling([lat, lng], distance, duration, elevetion);
    }

    this.#workout.push(workout);
    // -------
    // marker on the map
    this._renderWorkoutMarker(workout);
    // workout on the list
    this._renderWorkout(workout);

    // clear input form fields
    this._hideForm();

    // local storage use to store the data
    this._localStorage();
  }

  // render the workout on the map
  checkCount = this.#workout.length;
  
  _renderWorkoutMarker(workout) {
    if (this.#clicked) {
      this.checkCount++;
      if(this.checkCount === this.#workout.length)
        this.#clicked = false;
      L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
          })
        )
        .setPopupContent(
          `${workout.type === 'cycling' ? '🚴‍♀️ ' : '🏃‍♂️ '} ${workout.description}`
        )
        .openPopup();
    }
  }
  // local storage use
  _localStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workout));
  }

  _getLocalData() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workout = data;
    this.#workout.forEach(work => {
      this._renderWorkout(work);
      message.style.display = 'none';
      this.#clicked = true;
    });
  }

  _renderWorkout(workout) {
    // delete btn
    if(this.#workout.length > 0)
      deleteBtn.classList.remove('deleteBtn--hidden');
    else
      deleteBtn.classList.add('deleteBtn--hidden');
    
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'cycling' ? '🚴‍♀️ ' : '🏃‍♂️ '
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;
    if (workout.type === 'running') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>
      `;
    }
    if (workout.type === 'cycling') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevetionGain}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
      `;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  
  // delete all the data from the local storage
  _reset()
  {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

// creating the new app Object from the class
const app = new App();
