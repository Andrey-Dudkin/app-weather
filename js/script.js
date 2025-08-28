// * app weather
const API_KEY = '481f8be2183063374f98ed48a3b7368d'
const forma = document.querySelector('#forma')
const formaInput = document.querySelector('#form-input')
const blockForData = document.querySelector('.weather-data')
const loder = document.querySelector('.loader')
const error = document.querySelector('.error')
const cityName = 'Washington'
function renderWeatherData(data) {
  const img = document.querySelector('.weather-data__img')
  const temp = document.querySelector('.weather-data__gradus')
  const nameCity = document.querySelector('.weather-data__city-name')
  const humidity = document.querySelector('.weather-data-humidity__air')
  const wind = document.querySelector('.weather-data-wind__speed')
  temp.innerText = Math.round(data.temp) + '°C'
  nameCity.innerText = data.name
  humidity.innerText = data.humidity + '%'
  wind.innerText = data.wind + ' km/h'

  const nameImages = {
    Clear: `images-sun`,
    Clouds: `images-clouds`,
    Rain: `images-rain`,
    Fog: `images-mist`,
    Drizzle: 'images-drizzele',
    Snow: 'images-show',
  }
  if (nameImages[data.main]) {
    img.src = `./img/images/${nameImages[data.main]}.png`
  }
}
const homeWeather = async nameCity => {
  const ciryInfo = await getGeo(nameCity)
  const weatherInfo = await getWeather(ciryInfo[0]['lat'], ciryInfo[0]['lon'], ciryInfo[0]['name'])
  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    humidity: weatherInfo.main.humidity,
    wind: weatherInfo.wind.speed,
    main: weatherInfo.weather[0]['main'],
  }
  console.log(weatherInfo.weather[0]['main'])
  renderWeatherData(weatherData)
}
const submitData = async e => {
  e.preventDefault()
  if (formaInput.value.trim() === '') {
    formaInput.style.borderColor = 'red'
    formaInput.focus()
    return
  } else {
    formaInput.focus()
    formaInput.style.borderColor = 'var(--main-color)'
  }
  const city = formaInput.value.trim()
  formaInput.value = ''
  const ciryInfo = await getGeo(city)
  const weatherInfo = await getWeather(ciryInfo[0]['lat'], ciryInfo[0]['lon'], ciryInfo[0]['name'])
  const weatherData = {
    name: weatherInfo.name,
    temp: weatherInfo.main.temp,
    humidity: weatherInfo.main.humidity,
    wind: weatherInfo.wind.speed,
    main: weatherInfo.weather[0]['main'],
  }
  console.log(weatherInfo.weather[0]['main'])
  renderWeatherData(weatherData)
}
forma.addEventListener('submit', submitData)

const getGeo = async nameCity => {
  blockForData.style.display = 'none'
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${nameCity}&appid=${API_KEY}`
  loder.style.display = 'block'
  try {
    const response = await fetch(geoUrl)
    const dsta = await response.json()
    if (!response.ok || dsta.length === 0) {
      loder.style.display = 'none'
      blockForData.style.display = 'none'
      error.textContent = 'Error: City not found'
    } else {
      loder.style.display = 'none'
      blockForData.style.display = 'flex'
      error.textContent = ''
    }
    return dsta
  } catch {
    error.textContent = 'Error: data not loaded'
    loder.style.display = 'none'
  }
}
const getWeather = async (lat, lon, city) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
  try {
    const response = await fetch(weatherUrl)
    const dsta = await response.json()
    return dsta
  } catch {
    error.textContent = 'Error: data not loaded'
    loder.style.display = 'none'
  }
}

homeWeather(cityName)
