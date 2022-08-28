const getWeather = async (place) => {
  const key = "6193f8a4630776e79d0122a0ec5d2ddf";
  const request = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${key}`;
  const response = await fetch(request);
  const result = await response.json();
  console.log(result);
  return result;
};

const round = (num) => Math.round(num * 10) / 10;
const toCelsius = (temp) => temp - 273;
const toFarenheit = (temp) => (temp - 273) * 1.8 + 32;

const redrawWeather = (obj, celsius) => {
  const cityElem = document.querySelector("#one-day h1");
  const tempElem = document.querySelector("#one-day h2");
  const feelsElem = document.querySelector("#one-day .feels span");
  const humElem = document.querySelector("#one-day .humidity span");

  const convFunc = celsius ? toCelsius : toFarenheit;
  cityElem.textContent = obj.name;
  tempElem.textContent = round(convFunc(obj.main.temp));
  feelsElem.textContent = round(convFunc(obj.main.feels_like));
  humElem.textContent = `${obj.main.humidity}%`;
};

const processForm = async (e) => {
  e.preventDefault();
  const place = document.querySelector("form #place").value;
  const result = await getWeather(place);
  redrawWeather(result, true);
};

document.querySelector("form").addEventListener("submit", processForm);
// getWeather("izhevsk");
