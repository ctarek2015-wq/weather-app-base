import { useState } from "react";
import axios from "axios";
import "./App.css";

const GEO_API = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_ICON_URL = "https://openweathermap.org/img/wn";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const handleSubmit = (event) => {
    event.preventDefault();
    const city = cityInput.trim();

    if (!city) {
      setErrorMessage("Please enter a city name first.");
      return;
    }

    if (!OPEN_WEATHER_API_KEY) {
      setErrorMessage(
        "Missing API key. Add VITE_OPEN_WEATHER_API_KEY in your .env file and restart Vite."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    axios
      .get(`${GEO_API}?q=${encodeURIComponent(city)}&limit=1&appid=${OPEN_WEATHER_API_KEY}`)
      .then((response) => {
        const cityGeoData = response.data?.[0];

        if (!cityGeoData) {
          throw new Error(`Could not find coordinates for "${city}".`);
        }

        return cityGeoData;
      })
      .then((cityGeoData) =>
        axios.get(
          `${WEATHER_API}?lat=${cityGeoData.lat}&lon=${cityGeoData.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
        )
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || error.message || "Unable to fetch weather right now.";
        setWeatherData(null);
        setErrorMessage(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasWeather = Boolean(weatherData);
  const iconCode = weatherData?.weather?.[0]?.icon;
  const iconUrl = iconCode ? `${WEATHER_ICON_URL}/${iconCode}@2x.png` : "";
  const weatherText = weatherData?.weather?.[0]?.description || "";

  return (
    <div className="app-shell">
      <h1>Weather App</h1>
      <p className="instructions">Enter a city name to see the latest weather conditions.</p>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          aria-label="City input"
          value={cityInput}
          onChange={(event) => setCityInput(event.target.value)}
          placeholder="e.g. London"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Check Weather"}
        </button>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {hasWeather && !errorMessage && (
        <section className="weather-card" aria-live="polite">
          <h2>
            {weatherData.name}, {weatherData.sys?.country}
          </h2>
          <div className="weather-main">
            {iconUrl && <img src={iconUrl} alt={weatherText} className="weather-icon" />}
            <p className="temp">{Math.round(weatherData.main.temp)}°C</p>
          </div>
          <p className="desc">{weatherText}</p>
          <div className="details">
            <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} m/s</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
