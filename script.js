const processForecast = (forecast) => {
  const result = {
    city: forecast.city,
    daysList: [],
  };
  const dates = [];
  for (const obj of forecast.list) {
    const curDate = obj.dt_txt.split(" ");
    if (curDate[0] === dates[dates.length - 1]) {
      const dayObj = result.daysList[result.daysList.length - 1];
      if (dayObj.maxTemp < obj.main.temp_max)
        dayObj.maxTemp = obj.main.temp_max;
      if (dayObj.minTemp > obj.main.temp_min)
        dayObj.minTemp = obj.main.temp_min;
      dayObj.timeList.push({
        time: curDate[1],
        temp: obj.main.temp,
        feelsLike: obj.main.feels_like,
        humidity: obj.main.humidity,
      });
    } else {
      dates.push(curDate[0]);
      result.daysList.push({
        date: curDate[0],
        maxTemp: obj.main.temp_max,
        minTemp: obj.main.temp_min,
        humidity: obj.main.humidity,
        timeList: [
          {
            time: curDate[1],
            temp: obj.main.temp,
            feelsLike: obj.main.feels_like,
            humidity: obj.main.humidity,
          },
        ],
      });
    }
  }
  return result;
};

const getWeather = async (place) => {
  const key = "6193f8a4630776e79d0122a0ec5d2ddf";
  const request = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${key}`;
  const response = await fetch(request);
  const result = await response.json();
  // console.log(result);
  console.log(processForecast(result));
  return processForecast(result);
};

let celsius = true;
let lastResult = undefined;
let lastTimeIndex = 0;

const toCelsius = (temp) => Math.round((temp - 273) * 10) / 10;
const toFarenheit = (temp) => Math.round((temp - 273) * 1.8 + 32);
const switchUnits = (e) => {
  celsius = !celsius;
  e.target.textContent = !celsius ? "Switch to °C" : "Switch to °F";
  if (lastResult) {
    redrawWeather(lastResult, celsius);
    redrawHourlyList(lastResult.daysList[lastTimeIndex].timeList, celsius);
  }
};

const removeChildren = (node) => {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
};

const redrawHourlyList = (dataList, celsius) => {
  const container = document.getElementById("weather-by-time");
  const convFunc = celsius ? toCelsius : toFarenheit;
  removeChildren(container);
  for (const entry of dataList) {
    const item = document.createElement("div");
    item.className = "time-item";
    const temp = document.createElement("h3");
    temp.textContent = `${convFunc(entry.temp)}${celsius ? "°C" : "°F"}`;
    item.appendChild(temp);
    const time = document.createElement("p");
    time.textContent = entry.time.slice(0, entry.time.length - 3);
    item.appendChild(time);
    container.appendChild(item);
  }
};

const redrawWeather = (obj, celsius) => {
  const cityElem = document.querySelector("#selected-day h1");
  const tempElem = document.querySelector("#selected-day h2");
  const feelsElem = document.querySelector("#selected-day .feels span");
  const humElem = document.querySelector("#selected-day .humidity span");

  const convFunc = celsius ? toCelsius : toFarenheit;
  cityElem.textContent = obj.name;
  tempElem.textContent = `${convFunc(obj.daysList[0].timeList[0].temp)}${
    celsius ? "°C" : "°F"
  }`;
  feelsElem.textContent = `${convFunc(obj.daysList[0].timeList[0].feelsLike)}${
    celsius ? "°C" : "°F"
  }`;
  humElem.textContent = `${obj.daysList[0].timeList[0].humidity}%`;
};

const fetchUpdate = async (place) => {
  const result = await getWeather(place);
  lastResult = result;
  redrawWeather(result, celsius);
  redrawHourlyList(result.daysList[0].timeList, celsius);
};

const processForm = async (e) => {
  e.preventDefault();
  const place = document.querySelector("form #place").value;
  fetchUpdate(place);
};

document.querySelector("form").addEventListener("submit", processForm);
document.getElementById("unit-switch").addEventListener("click", switchUnits);
document.getElementById("test").addEventListener("click", () => {
  lastResult
    ? redrawHourlyList(lastResult.daysList[1].timeList, celsius)
    : console.log("no list");
});

fetchUpdate("tokyo");
