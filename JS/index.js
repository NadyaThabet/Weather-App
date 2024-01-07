let searchInpt = document.querySelector(".search");
let findBtn = document.querySelector("#findBtn");
let forecastInfo = document.querySelector("#forecastInfo");
let tBody = document.querySelector("#tBody");
let body = document.body;
let logo = document.querySelector("#logo");
let customToggler = document.querySelector("#customToggler");
let tableTh = document.querySelectorAll(".tableTh");
let tableTd;

let forecastDay;
let city;
let searchTimeout;

async function getUserLocation() {
  try {
    let response = await fetch("https://ipinfo.io/json?token=db8bab68b8d018");
    let data = await response.json();

    city = data.city;
  } catch (error) {
    console.error("Error fetching IP geolocation:", error);
  }
}

getUserLocation();

async function getWeather() {
  await getUserLocation();
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=6c43e0586fa84e79823151555233012&q=${city}&days=3`
  );
  let finalResponse = await response.json();
  forecastDay = finalResponse.forecast.forecastday;
  let userLocation = finalResponse.location.name;

  displayDays(forecastDay, userLocation);
}

getWeather();

function formatDate(forcastedDate) {
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(forcastedDate);
  let dayOfWeek = daysOfWeek[date.getDay()];
  let dayOfMonth = date.getDate();
  let monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );

  return {
    dayOfWeek,
    dayOfMonth,
    monthName,
  };
}

function setBackgroundBasedOnTime() {
  let currentHour = new Date().getHours();

  if (currentHour >= 6 && currentHour < 18) {
    body.style.backgroundImage = "url('imgs/day.jpg')";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.color = "black";
    logo.style.color = "black";
    findBtn.style.color = "black";
    for (let i = 0; i < tableTh.length; i++) {
      tableTh[i].style.color = "black";
    }

    if (tableTd && tableTd.length > 0) {
      for (let i = 0; i < tableTd.length; i++) {
        tableTd[i].style.color = "black";
      }
    }
  } else {
    body.style.backgroundImage = "url('imgs/night.jpg')";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.color = "white";
    logo.style.color = "white";
    findBtn.style.color = "white";
    customToggler.style.backgroundColor = "rgb(233, 233, 233)";
    for (let i = 0; i < tableTh.length; i++) {
      tableTh[i].style.color = "white";
    }

    if (tableTd && tableTd.length > 0) {
      for (let i = 0; i < tableTd.length; i++) {
        tableTd[i].style.color = "white";
      }
    }
  }
}

setBackgroundBasedOnTime();

function displayDays(forecastDays, userLocation) {
  let forecastInfo = document.querySelector("#forecastInfo");
  let cityHTML = `<div><h1>${userLocation}</h1></div>`;
  forecastInfo.innerHTML = cityHTML;

  let tr = "";

  for (let i = 0; i < forecastDays.length && i < 3; i++) {
    let currentDayData = forecastDays[i].hour.find((hour) => {
      return (
        new Date(hour.time_epoch * 1000).getHours() === new Date().getHours()
      );
    });

    if (currentDayData) {
      let formattedDate = formatDate(forecastDays[i].date);
      let formattedMinutes =
        new Date().getMinutes() < 10
          ? `0${new Date().getMinutes()}`
          : new Date().getMinutes();

      if (i === 0) {
        let forecastHTML = `
          <div class="forecast-item">
            <div class="forecast-date">
              <h5 class="day">${formattedDate.dayOfWeek},</h5>
              <h5 class="date">${formattedDate.dayOfMonth}${
          formattedDate.monthName
        }</h5>
            </div>
            <div class="forecast-time">
              <h5 class="hour">${new Date().getHours()}:${formattedMinutes} ${
          new Date().getHours() >= 12 ? "PM" : "AM"
        }</h5>
            </div>
          </div>
        `;
        forecastInfo.innerHTML += forecastHTML;

        let trs = `
          <div class="hour-info">
            <div class="icon-div">
              <img class="icon" src="${currentDayData.condition.icon}" alt="icon" />
            </div>
            <div class="inf">
              <h2>${currentDayData.temp_c} °C</h2>
              <h2>${currentDayData.condition.text}</h2>
            </div>
            <div class="cells">
              <span class="cell"><i class="fa-solid fa-umbrella"></i> ${currentDayData.chance_of_rain}%</span>
              <span class="cell"><i class="fa-solid fa-wind"></i> ${currentDayData.wind_kph}km/h</span>
              <span class="cell"><i class="fa-regular fa-compass"></i> ${currentDayData.wind_dir}</span>
            </div>
          </div>
        `;
        forecastInfo.innerHTML += trs;
      } else {
        let formattedDay = formattedDate.dayOfWeek;
        tr += `
          <tr class="w-100">
            <td class="bg-transparent tableTd">${formattedDay}</td>
            <td class="bg-transparent tableTd">${currentDayData.temp_c} °C</td>
            <td class="bg-transparent tableTd">${currentDayData.condition.text}</td>
            <td class="bg-transparent tableTd">${currentDayData.chance_of_rain}%</td>
            <td class="bg-transparent tableTd">${currentDayData.wind_kph}km/h</td>
          </tr>`;
      }
    }
  }

  tBody.innerHTML = tr;

  tableTd = document.querySelectorAll(".tableTd");

  setBackgroundBasedOnTime();
}

searchInpt.addEventListener("keyup", function () {
  clearTimeout(searchTimeout);

  if (searchInpt.value.length >= 3) {
    searchTimeout = setTimeout(async function () {
      let searchTerm = searchInpt.value.toLowerCase();
      let response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=6c43e0586fa84e79823151555233012&q=${searchTerm}&days=3`
      );
      let finalResponse = await response.json();
      let forecastDaySearch = finalResponse.forecast.forecastday;
      let forecastDaySearchLocation = finalResponse.location.name;

      displayDays(forecastDaySearch, forecastDaySearchLocation);
    }, 500);
  } else if (searchInpt.value.length < 3) {
    getWeather();
  }
});

findBtn.addEventListener("click", function (e) {
  e.preventDefault();
});
