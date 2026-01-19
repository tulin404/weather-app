const themeMoon = document.getElementById('dark-icon');
const themeSun = document.getElementById('light-icon');

window.addEventListener('click', (e) => {
    if (e.target.id === 'dark-icon' || e.target.id === 'light-icon') {
        themeMoon.classList.toggle('theme');
        themeSun.classList.toggle('theme');
        document.documentElement.classList.toggle('dark');
    };
    if (e.target.id === 'dark-icon') {
        localStorage.setItem('theme', 'light');
    } else if (e.target.id === 'light-icon') {
        localStorage.setItem('theme', 'dark');
    };
});

if (localStorage.getItem('theme') === null) {
    if (window.matchMedia('(prefers-color-scheme: dark)')) {
        document.documentElement.classList.add('dark');
        themeSun.classList.toggle('theme');
    } else {
        document.documentElement.classList.remove('dark');
        themeMoon.classList.toggle('theme');
    };
} else {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.remove('dark');
        themeMoon.classList.toggle('theme');
    } else if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        themeSun.classList.toggle('theme');
    };
};

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
            return 
        } else if (localStorage.getItem('measure') === 'farenheit') {
            farenheit.classList.toggle('font-medium');
            convertToF();
        };
    };
});
