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
    const selected = select.querySelector('option[selected=""]');
    translator.changeFlag(selected.value);
    translator.translate(selected.value);
    localStorage.setItem('lang', selected.value);
});

// WEATHER MAIN
async function getWeather() {
    const weather = await fetch("/api/weather", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({loc: 'Brasilia'})
    });

    const weatherInfo = await weather.json();
    console.log(weatherInfo.data);
};

getWeather()