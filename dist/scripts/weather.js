// API Related Data
const apiKey = "eda8d98890214bab926190059241708";
const apiUrl = "http://api.weatherapi.com/v1/forecast.json";

// Get the location of the user
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Can't Access Locatoin please Allow The Browser To Use Current Location"
        );
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by this browser.");
  }
}

// Fetch Weather Data From The API
let fetchedData;
async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `${apiUrl}?key=${apiKey}&q=${lat},${lon}&days=3`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    fetchedData = data;
    console.log(data);
    updateWeatherUI(data, 0);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function updateWeatherUI(data, day) {
  let forToday = day === -1 ? true : false;
  const today = new Date();
  const forecast = data.forecast.forecastday;
  const dayBefore = forecast[day + 1]; // Assuming first item is today's data

  // Update UI elements for date and temperature
  const month = dayBefore.date.substring(5, 7);
  const mon = setMonth(month);

  document.querySelector(".date .month").textContent = mon;
  document.querySelector(
    ".date .day"
  ).textContent = `${dayBefore.date.substring(8, 10)},`; // Day
  document.querySelector(
    ".date .year"
  ).textContent = `${dayBefore.date.substring(0, 4)}`; // Year

  document.querySelector(
    ".current-temp"
  ).textContent = `${dayBefore.day.avgtemp_c}°C`;
  document.querySelector(".current-day").textContent = new Date(
    dayBefore.date
  ).toLocaleDateString("en-US", { weekday: "long" });

  document.querySelector(
    ".condition"
  ).textContent = `${data.current.condition.text}`;

  document.querySelector(".loc .city").textContent = `${data.location.name}, `;
  document.querySelector(
    ".loc .country"
  ).textContent = `${data.location.country}`;

  // Update Forecast for the hour
  const forecastHour = data.forecast.forecastday[day + 1].hour;
  const forecastHourDiv = document.querySelector(".hours");
  const currentHour = parseInt(data.current.last_updated.substring(11, 13), 10); // Current hour in 24-hour format

  // Calculate the range of hours to display
  const startHour = forToday ? currentHour - 2 : 0;
  const endHour = startHour + 9;

  forecastHourDiv.innerHTML = "";

  // Filter and display hours within the range
  forecastHour.forEach((hour) => {
    const hourTime = parseInt(hour.time.substring(11, 13), 10); // Hour in 24-hour format

    // Check if the hour is within the desired range
    if (hourTime >= startHour && hourTime < endHour) {
      let iconClass = "";
      const hourN = new Date(hour.time); // Assuming hour.time is a string that can be parsed to a Date object
      const hourOfDay = hourN.getHours(); // Get the hour part from the Date object

      // Define daytime and nighttime hours
      const isDaytime = hourOfDay >= 6 && hourOfDay < 18; // 6 AM to 6 PM

      if (isDaytime) {
        iconClass = "fa-solid fa-sun";
      } else {
        iconClass = "fa-solid fa-moon";
      }

      const hourDiv = document.createElement("div");
      hourDiv.className =
        "hour flex flex-col gap-4 px-4 py-7 rounded-full items-center font-semibold text-lg";
      hourDiv.classList.add(
        hourTime === currentHour ? "bg-selected" : "bg-cyan"
      );
      hourDiv.classList.add(hourTime === currentHour && "-translate-y-2");
      hourDiv.innerHTML = `
        <div class="hour-time">${hour.time.substring(11, 16)}</div>
        <i class="${iconClass} fa-2x"></i>
        <div class="hour-temp">${hour.temp_c}°C</div>
      `;
      forecastHourDiv.appendChild(hourDiv);
    }
  });
}

function setMonth(month) {
  let mon = "null";
  switch (month) {
    case "01":
      mon = "Jan";
      break;
    case "02":
      mon = "Feb";
      break;
    case "03":
      mon = "Mar";
      break;
    case "04":
      mon = "Apr";
      break;
    case "05":
      mon = "May";
      break;
    case "06":
      mon = "Jun";
      break;
    case "07":
      mon = "Jul";
      break;
    case "08":
      mon = "Aug";
      break;
    case "09":
      mon = "Sep";
      break;
    case "10":
      mon = "Oct";
      break;
    case "11":
      mon = "Nov";
      break;
    case "12":
      mon = "Dec";
      break;
  }

  return mon;
}

let lastClickedButton = null; // Track the last clicked button

document.addEventListener("DOMContentLoaded", () => {
  getUserLocation();

  // Add event listeners for buttons
  document.querySelector(".yesterday-btn").addEventListener("click", () => {
    updateWeatherUI(fetchedData, -1);
    setSelectedButton(document.querySelector(".yesterday-btn"));
  });

  document.querySelector(".today-btn").addEventListener("click", () => {
    updateWeatherUI(fetchedData, 0);
    setSelectedButton(document.querySelector(".today-btn"));
  });

  document.querySelector(".tommorow-btn").addEventListener("click", () => {
    updateWeatherUI(fetchedData, 1);
    setSelectedButton(document.querySelector(".tommorow-btn"));
  });
});

// Function to update the selected button style
function setSelectedButton(selectedButton) {
  // Remove 'text-selected' class from the previously selected button
  if (lastClickedButton) {
    lastClickedButton.classList.remove("text-cyan");
  }

  // Add 'text-selected' class to the newly selected button
  selectedButton.classList.add("text-cyan");

  // Update the last clicked button tracker
  lastClickedButton = selectedButton;
}
