import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
// import { WiHumidity, WiStrongWind } from "react-icons/wi";
import axios from "axios";
import {
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiThermometer,
  WiThermometerExterior,
} from "react-icons/wi";
import "./index.css";


function AnalogClock({ hours, minutes, seconds }) {
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  return (
    <div className="relative w-96 h-96 border-4 border-white rounded-full flex justify-center items-center">
      {/* Clock center */}
      <div className="absolute w-4 h-4 bg-white rounded-full z-10"></div>

      {/* Hour Hand */}
      <div
        className="absolute w-[4px] h-24 bg-white top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>

      {/* Minute Hand */}
      <div
        className="absolute w-[3px] h-32 bg-gray-300 top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>

      {/* Second Hand */}
      <div
        className="absolute w-[2px] h-36 bg-red-500 top-1/2 left-1/2 origin-bottom"
        style={{
          transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
          transformOrigin: "50% 100%",
        }}
      ></div>

      {/* Clock Numbers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white text-lg font-bold"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-170px) rotate(-${
              i * 30
            }deg)`,
          }}
        >
          {i === 0 ? 12 : i}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [Search, setSearch] = useState("");
  const [Loading, setLoading] = useState(false);
  const API_KEY = "e97105be1a34aa4bf3aae55784ec9a1c";

  const [temprature, setTemprature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windspeed, setWindspeed] = useState(null);
  const [city, setCity] = useState("");
  const [weathericon, setWeathericon] = useState("01d");
  const [weatherDesc, setWeatherDesc] = useState("");
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const fetchCity = async () => {
    if (!Search.trim()) return; // Prevent empty searches

    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${Search}&appid=${API_KEY}&units=metric`
      );
      if (data) {
        setTemprature(data.main.temp);
        setHumidity(data.main.humidity);
        setCity(data.name);
        setWindspeed(data.wind.speed);
        setWeathericon(data.weather[0].icon);
        setWeatherDesc(data.weather[0].description);
        setMinTemp(data.main.temp_min);
        setMaxTemp(data.main.temp_max);
        setSunrise(data.sys.sunrise);
        setSunset(data.sys.sunset);
        setTimezone(data.timezone);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCity("city not found");
      setWeathericon("01d");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!timezone) return;
    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityTime = new Date(utcTime + timezone * 1000);

      setTime({
        hours: cityTime.getHours(),
        minutes: cityTime.getMinutes(),
        seconds: cityTime.getSeconds(),
      });
      setLocalTime(cityTime.toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const getBackgroundClass = () => {
    if (!timezone) return "bg-day"; // Default to daytime if no timezone is set
  
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + timezone * 1000);
    const hour = cityTime.getHours();
  
    if (hour >= 18 && hour < 20) return "bg-evening"; // Sunset 🌅
    if (hour >= 20 || hour < 6) return "bg-night"; // Night 🌙
    
    return "bg-day"; // Daytime 🌞
  };
  
  
  

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row justify-center items-center lg:justify-between h-screen text-white ${getBackgroundClass()} p-4`}>
      {/* Evening Sun */}
  {getBackgroundClass() === "bg-evening" && <div className="sun"></div>}

{/* Night Moon */}
{getBackgroundClass() === "bg-night" && <div className="moon"></div>}
        
        {/* Analog Clock - Left */}
    
        <div className="flex flex-col items-center ml-4 mb-6 lg:mb-0">
          <AnalogClock
            hours={time.hours}
            minutes={time.minutes}
            seconds={time.seconds}
          />
              <p className="mt-2 text-lg font-semibold">{city ? `${city} Analog Clock` : "City Clock"}</p>
        </div>
     

        {/* <div className="flex flex-col justify-center items-center h-screen text-white bg-gradient-to-r from-blue-500 via-blue-700 to-blue-400"> */}
        {/* search bar */}

        {/* Weather Card - Center */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-lg text-center border border-white/30">
        {/* <h1>Check Weather</h1> */}
          {/* Search Bar */}
          <div className="flex items-center bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full w-full max-w-md mx-auto mb-5 shadow-xl border border-white/30">
            <input
              type="text"
              placeholder="Search city..."
              value={Search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-white placeholder-gray-300 bg-transparent outline-none px-4 text-lg"
            />
            <FaSearch
              onClick={fetchCity}
              className="text-gray-500 cursor-pointer hover:text-white transition"
            />
          </div>
          {/* weather data */}
          <img
            src={`http://openweathermap.org/img/wn/${weathericon}@2x.png`}
            alt="Weather Icon"
            className="w-20 h-20 drop-shadow-lg mx-auto"
          />

          <p className="capitalize text-lg text-gray-200">
            {weatherDesc || "--"}
          </p>
          {/* <p className="text-lg mt-2">🕰️ Local Time: {localTime}</p> */}

          {/* Temprature and city */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-3 drop-shadow-md">
            {" "}
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r 
            ${
              temprature < 10
          ? "from-blue-400 to-blue-600"
          : temprature < 25
          ? "from-green-400 to-green-600"
          : temprature < 35
          ? "from-yellow-400 to-yellow-600"
          : "from-red-500 to-red-700"
              }`}
            >
              {Loading
                ? "loading..."
                : temprature !== null
                ? `${temprature}°C`
                : "--"}
            </span>
          </h1>
          <h2 className="text-2xl font-semibold text-white mt-1">
            {city || "Type city name to check weather"}
          </h2>
          {/* Weather Details */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-gray-200">
            {/* Max & Min Temperature */}
            <div className="flex flex-col items-center">
              <WiThermometer className="text-4xl text-red-400 drop-shadow-md" />
              <span>{maxTemp !== null ? `${maxTemp}°C` : "--"}</span>
              <p className="text-sm">Max Temp</p>
            </div>
            <div className="flex flex-col items-center">
              <WiThermometerExterior className="text-4xl text-blue-400 drop-shadow-md" />
              <span>{minTemp !== null ? `${minTemp}°C` : "--"}</span>
              <p className="text-sm">Min Temp</p>
            </div>

            {/* Humidity & Wind Speed */}
            <div className="flex flex-col items-center">
              <WiHumidity className="text-5xl text-blue-200 drop-shadow-md" />
              <span className="text-lg font-medium">
                {humidity !== null ? `${humidity}%` : "--"}
              </span>
              <p className="text-sm">Humidity</p>
            </div>
            <div className="flex flex-col items-center">
              <WiStrongWind className="text-5xl text-gray-300 drop-shadow-md" />
              <span className="text-lg font-medium">
                {windspeed !== null ? `${windspeed} km/hr` : "--"}
              </span>
              <p className="text-sm">Wind Speed</p>
            </div>
            {/* Sunrise & Sunset */}
            <div className="flex flex-col items-center">
              <WiSunrise className="text-4xl text-yellow-300 drop-shadow-md" />
              <span>
                {sunrise ? new Date(sunrise * 1000).toLocaleTimeString() : "--"}
              </span>
              <p className="text-sm">Sunrise</p>
            </div>
            <div className="flex flex-col items-center">
              <WiSunset className="text-4xl text-orange-300 drop-shadow-md" />
              <span>
                {sunset ? new Date(sunset * 1000).toLocaleTimeString() : "--"}
              </span>
              <p className="text-sm">Sunset</p>
            </div>
          </div>
        </div>
        {/* Digital Clock - Right */}
        <div className="text-3xl font-bold bg-black/40 px-6 py-3 rounded-lg mt-6 ml-2 lg:mt-0">
          {time.hours.toString().padStart(2, "0")}:
          {time.minutes.toString().padStart(2, "0")}:
          {time.seconds.toString().padStart(2, "0")}
          <p className="mt-2 text-lg font-semibold">{city ? `${city} Digital Clock` : "City Clock"}</p>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default App;
