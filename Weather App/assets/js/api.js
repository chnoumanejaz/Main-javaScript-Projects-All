<<<<<<< HEAD
'use strict';

const api_key = 'ae5150cfd1c6f300e7de80439855dace';

/**
 * Fetch data from api
 * @param {string} URL api url
 * @param {function} callback callback
 */
// Fetching data from Api
export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${api_key}`)
    .then(res => res.json())
    .then(data => callback(data));
    // .catch(err => {throw new Error('Network Error! Please check your internet Connection :(')});
};

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
  },
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
  },
  airPollution(lat, lon){
    return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
  },
  reverseGeo(lat, lon){
    return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },
  geo(query){
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
}
};
=======
>>>>>>> df942f72149f35120e8ecf83b4a3213fb320d7a3
