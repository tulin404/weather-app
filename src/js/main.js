// MEASUREMENT
import { Converter } from "./converter.js";
const converter = Converter();
const celsius = document.getElementById('celsius');
const farenheit = document.getElementById('farenheit');

celsius.addEventListener('click', (e) => {
    if (localStorage.getItem('measure') === 'celsius') {
        return;
    } else {
        celsius.classList.toggle('font-medium');
        farenheit.classList.toggle('font-medium');
        localStorage.setItem('measure', 'celsius');
        convertToC();
    };
});

farenheit.addEventListener('click', (e) => {
    if (localStorage.getItem('measure') === 'farenheit') {
        return;
    } else {
        celsius.classList.toggle('font-medium');
        farenheit.classList.toggle('font-medium');
        localStorage.setItem('measure', 'farenheit');
        convertToF();
    };
});

function convertToC() {
    converter.toCelsius();
    converter.toKMH();
    converter.to24H();
};

function convertToF() {
    converter.toFarenheit();
    converter.toMPH();
    converter.to12H();
};

window.addEventListener('load', () => {
    if (localStorage.getItem('measure') === null) {
        localStorage.setItem('measure', 'celsius');
        celsius.classList.toggle('font-medium');
    } else {
        if (localStorage.getItem('measure') === 'celsius') {
            celsius.classList.toggle('font-medium');
            return;
        } else if (localStorage.getItem('measure') === 'farenheit') {
            farenheit.classList.toggle('font-medium');
            convertToF();
        };
    };
});

// FLAG
import {Translator} from "./translator.js";

const translator = Translator();

window.addEventListener('load', () => {
    if (localStorage.getItem('lang') === null) {
        const localLang = navigator.language.slice(0, 2);
        translator.changeFlag(localLang);
        translator.translate(localLang);
    } else {
        const lang = localStorage.getItem('lang');
        translator.changeFlag(lang);
        translator.translate(lang);
    };
});

const select = document.querySelector('select');
select.addEventListener('change', (e) => {
    const value = select.value;
    translator.changeFlag(value);
    translator.translate(value);
    localStorage.setItem('lang', value);
});

// PAGE ELEMENTS
const currentLoc = document.getElementById('header-current-loc');
const mainDate = document.getElementById('main-date');
const mainCondition = document.getElementById('main-condition');
const mainIcon = document.getElementById('main-weather-icon');
const mainTemp = document.getElementById('main-temp');
const mainMaxTemp = document.getElementById('main-max-temp');
const mainMinTemp = document.getElementById('main-min-temp');
const rainChance = document.getElementById('rain-chance');
const precip = document.getElementById('precip');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const uvIndexImg = document.getElementById('uv-img');
const uvIndex = document.getElementById('uv-index');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const moonphaseImg = document.getElementById('moonphase-img');
const moonphase = document.getElementById('moonphase');
const alertsContainer = document.getElementById('alerts-container');
const headline = document.getElementById('headline');
const description = document.getElementById('description');
const forecastContainer = document.getElementById('forecast-container');
const dailyDays = Array.from(document.getElementsByClassName('daily-day'));
const dailyImgs = Array.from(document.getElementsByClassName('daily-img'));
const dailyPrec = Array.from(document.getElementsByClassName('daily-prec'));
const dailyMinTemps = Array.from(document.getElementsByClassName('daily-min-temp'));
const dailyMaxTemps = Array.from(document.getElementsByClassName('daily-max-temp'));

// WEATHER MAIN
const weatherInput = document.getElementById('search');
weatherInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const deleteKeys = ['ar', 'bn', 'de', 'en', 'es', 'fr', 'hi', 'it', 'pt-BR', 'ru', 'ur', 'zh-Hans']
        deleteKeys.forEach(key => localStorage.removeItem(key));
        e.preventDefault();
        weatherInput.blur();
        const weatherObj = await getWeather(weatherInput.value);
        const weatherData = await weatherObj.data;
        localStorage.setItem('lastSearch', weatherInput.value);
        weatherInput.value = '';
        forecastContainer.replaceChildren();
        changeInfo(weatherData);
        console.log(weatherData);
        translator.changeFlag(localStorage.getItem('lang'));
        translator.translate(localStorage.getItem('lang'));
        if (localStorage.getItem('measure') === 'farenheit') {
            convertToF();
        };
    };
});

function changeInfo(obj) {
    changeLoc(obj);
    changeDateMain(obj);
    changeConditionMain(obj.days[0]);
    changeIconMain(obj);
    changeMainTemps(obj);
    changeTodaysConditions(obj.days[0]);
    changeHourlyForecast(obj);
    changeAlerts(obj);
    change7DayForecastDays(obj);
    change7DayForecast(obj);
};

async function getWeather(location) {
    const loadingWrapper = document.getElementById('loading');
    try {
        document.documentElement.classList.toggle('overflow-hidden');
        document.documentElement.classList.toggle('pointer-events-none');
        loadingWrapper.classList.toggle('hidden');
    
        const weather = await fetch("/api/weather", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({loc: location})
        });

        if (!weather.ok) {
            throw new Error(weather);
        };

        const info = await weather.json();
        return info;
    } catch(error) {
        console.log(error);
    } finally {
        document.documentElement.classList.toggle('overflow-hidden');
        document.documentElement.classList.toggle('pointer-events-none');
        loadingWrapper.classList.toggle('hidden');
    };
};


// WEATHER HELPERS
function isNight(obj) {
    const now = obj.currentConditions.datetime.slice(0, 2);
    return (Number(now) > 18);
}

function changeLoc(obj) {
    const rawLoc = obj.resolvedAddress;
    const locArr = obj.resolvedAddress.split(', ');
    if (locArr[1] !== undefined) {
        const loc = `${locArr[0]}, ${locArr[1]}`;
        currentLoc.innerText = loc;
    } else {
        currentLoc.innerText = rawLoc;
    }
};

function changeDateMain(obj) {
    const epochInMs = obj.days[0].datetimeEpoch * 1000;
    const date = new Date(epochInMs);
    const formater = new Intl.DateTimeFormat('en-US', {
        timeZone: obj.timezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    mainDate.innerText = formater.format(date).toString();
};

function changeConditionMain(firstDay) {
    const condition = firstDay.description;
    mainCondition.innerText = condition;
};

function changeIconMain(obj) {
    const icon = `${obj.days[0].icon}.svg`
    let source;
    if (isNight(obj)) {
        source = `public/night/${icon}`
    } else {
        source = `public/day/${icon}`
    };
    mainIcon.src = source;
};

function changeMainTemps(obj) {
    mainTemp.innerText = obj.currentConditions.temp;
    mainMaxTemp.innerText = obj.days[0].tempmax;
    mainMinTemp.innerText = obj.days[0].tempmin;
};

function changeTodaysConditions(firstDay) {
    rainChance.innerText = `${firstDay.precipprob}%`;
    precip.innerText = `${firstDay.precip} mm`;
    wind.innerText = firstDay.windspeed;
    humidity.innerText = `${firstDay.humidity}%`;
    pressure.innerText = `${firstDay.pressure} hPa`;
    sunrise.innerText = firstDay.sunrise;
    sunset.innerText = firstDay.sunset;

    // IMAGE CASE
    const uvNum = firstDay.uvindex;
    uvIndexImg.src = `public/misc/uv-index-${uvNum}.svg`;
    uvIndex.innerText = uvNum;
    const textMoonPhase = moonPhaseToText(firstDay.moonphase);
    moonphaseImg.src = `public/misc/${textMoonPhase[1]}.svg`
    moonphase.innerText = textMoonPhase[0];
    console.log(textMoonPhase)
};

function changeHourlyForecast (obj) {
    const current = obj.currentConditions.datetime.slice(0, 2);
    const dayZeroFiltered = obj.days[0].hours.filter(hour => {
        const hourSlice = Number(hour.datetime.slice(0, 2));
        return hourSlice > current;
    });

    function isNightForImg(hour) {
        return hour.icon.includes('night')? 'night' : 'day'
    };

    const timeArr = [...dayZeroFiltered, ...obj.days[1].hours].splice(0, 24);
    console.log(timeArr);
    timeArr.forEach(hour => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('sm:bg-input', 'rounded-sm', 'sm:px-2', 'sm:py-1', 'flex', 'flex-col', 'justify-between', 'items-center', 'text-center', 'text-xl', 'gap-2')
        newDiv.innerHTML = 
        `<p id="for-time"><timestamp class="text-nowrap">${hour.datetime.slice(0, 5)}</timestamp></p>
        <div id="for-icon"><img src="public/static/${isNightForImg(hour)}/${hour.icon}.svg" alt="" class="sm:h-8 sm:w-8 md:h-12 md:w-12 h-6 w-6"></div>
        <div class="text-nowrap"><temp>${String(hour.temp)}</temp> <meas></meas>°C</div>`
        forecastContainer.appendChild(newDiv);
    });
};

function changeAlerts(obj) {
    if (obj.alerts.length > 0) {
        alertsContainer.classList.toggle('hidden');
        headline.innerText = obj.alerts[0].event;
        description.innerText = obj.alerts[0].description;
    } else {
        return;
    }
};

function change7DayForecastDays(obj) {
    const correctArray = obj.days.slice(1, 8);
    const formater = new Intl.DateTimeFormat('en-US', {
        timeZone: obj.timezone,
        weekday: 'long',
    });
    const weekDays = correctArray.map(day => {
        const date = new Date(day.datetimeEpoch * 1000);
        const dateFormatted = formater.format(date).toString();
        return dateFormatted;
    });
    console.log(correctArray);
    weekDays.forEach((day, index) => dailyDays[index].innerText = day);
};

function change7DayForecast(obj) {
    const correctArray = obj.days.slice(1, 8);
    correctArray.forEach((day, index) => {
        dailyImgs[index].src = `public/day/${day.icon}.svg`;
        dailyPrec[index].innerText = `${day.precipprob}%`;
        dailyMinTemps[index].innerText = `${day.tempmin}`;
        dailyMaxTemps[index].innerText = `${day.tempmax}`;
    });
};

function moonPhaseToText(moonphase) {
  if (moonphase === 0 || moonphase === 1) return ["New Moon", "moon-new"];
  if (moonphase < 0.25) return ["Waxing Crescent", "moon-waxing-gibbous"];
  if (moonphase === 0.25) return ["First Quarter", "moon-first-quarter"];
  if (moonphase < 0.5) return ["Waxing Gibbous", "moon-waxing-gibbous"];
  if (moonphase === 0.5) return ["Full Moon", "moon-full"];
  if (moonphase < 0.75) return ["Waning Gibbous", "moon-waning-gibbous"];
  if (moonphase === 0.75) return ["Last Quarter", "moon-last-quarter"];
  if (moonphase > 0.75) return ["Waning Crescent", "moon-waning-crescent"];
};

// AUTOMATIC SEARCH

async function getCity() {
    const raw = await fetch('/api/ip');
    const ip = await raw.json();
    return ip.data.city;
};

window.addEventListener('load', async (e) => {
    if (localStorage.getItem('lastSearch') !== null) {
        const weatherObj = await getWeather(localStorage.getItem('lastSearch'));
        const weatherData = await weatherObj.data;
        changeInfo(weatherData);
        translator.changeFlag(localStorage.getItem('lang'));
        translator.translate(localStorage.getItem('lang'));
    } else {
        const city = await getCity();
        const weatherObj = await getWeather(city);
        const weatherData = await weatherObj.data;
        changeInfo(weatherData);
        translator.changeFlag(localStorage.getItem('lang'));
        translator.translate(localStorage.getItem('lang'));
    };
    if (localStorage.getItem('measure') === 'farenheit') {
        convertToF();
    };
});