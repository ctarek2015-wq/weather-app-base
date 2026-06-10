# Coding Bootcamp: Weather App

A small React + Vite app that fetches current weather for a city using the OpenWeather APIs.

## Setup

1. Install dependencies

```bash
npm install
```

2. Add your API key

```bash
cp .env.example .env
```

Edit `.env` and replace `your_open_weather_api_key_here` with your real Open Weather API key.

3. Run dev server

```bash
npm run dev
```

Open `http://localhost:5173`.

## What it does

- Takes a city name from an input field
- Calls Open Weather Geocoding API to get city coordinates
- Uses chained `.then(...)` calls to fetch current weather by coordinates
- Shows temperature, description, icon, humidity, wind, and feels-like
- Updates weather when user submits a new city (or the same city again)
