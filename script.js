const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const forecastList = document.getElementById("forecast-list");

const updateBackgroundImage = () => {
  const now = new Date();
  const hours = now.getHours();

  let imagePath;
  if(hours<5){
    imagePath="images/night.jpg";
  }
  else if (hours< 9) {
    imagePath = "images/morning.jpg";
  } else if (hours < 15) {
    imagePath = "images/afternoon.jpg";
  } else if (hours < 18) {
    imagePath = "images/evening.jpg";
  } else if (hours < 23) {
    imagePath = "images/night.jpg";
  }
  document.body.style.backgroundImage=`url('${imagePath}')`;
};

const fetchWeather = async (city) => {
  try {
    const apiKey = "11a40072de363fa8aa8dfc98fdbab21d"; // Replace with your API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const [weatherData, forecastData] = await Promise.all([
      weatherResponse.json(),
      forecastResponse.json()
    ]);

    displayCurrentWeather(weatherData);
    displayWeatherForecast(forecastData.list);
    updateBackgroundImage();
    } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const displayCurrentWeather = (data) => {
  const cityNameElement = document.getElementById("city-name");
  const updatedTimeElement = document.getElementById("updated-time");
  const weatherIconElement = document.getElementById("weather-icon");
  const tempElement = document.getElementById("temp");
  const descriptionElement = document.getElementById("description");

  cityNameElement.textContent = data.name;
  updatedTimeElement.textContent = `Updated at ${new Date().toLocaleTimeString()}`;
  weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  weatherIconElement.alt = data.weather[0].description;
  tempElement.textContent = `${data.main.temp}°C`; 
  descriptionElement.textContent = data.weather[0].description;
};

const displayWeatherForecast = (forecastData) => {
  forecastList.innerHTML = "";

  for (let i = 0; i < forecastData.length; i += 8) {
    const forecast = forecastData[i];
    const forecastItem = document.createElement("li");
    forecastItem.textContent = `${forecast.dt_txt}: ${forecast.main.temp}°C, ${forecast.weather[0].description}`;
    forecastList.appendChild(forecastItem);
  }
};

searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
  }
});
