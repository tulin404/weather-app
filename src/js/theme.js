// UI THEME
const themeMoon = document.getElementById('dark-icon');
const themeSun = document.getElementById('light-icon');
const forecastItems = document.querySelectorAll('#forecast-container > div');

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
    if (!document.documentElement.classList.contains('dark')) {
        forecastItems.forEach(item => item.classList.remove('sm:bg-input'));
    } else {
        forecastItems.forEach(item => item.classList.add('sm:bg-input'));
    };
});

window.addEventListener('load', () => {
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
});

// IMAGES
const imgs = Array.from(document.querySelectorAll('img'));

window.addEventListener('load', () => {
    const now = new Date();
    if (now.getHours() > 18) {
        const newImgArray = imgs.map(img => img.src.replaceAll('day', 'night'));
        imgs.forEach((img, index) => {
            img.src = newImgArray[index];
        });
    } else {
        const newImgArray = imgs.map(img => img.src.replaceAll('night', 'day'));
        imgs.forEach((img, index) => {
            img.src = newImgArray[index];
        });
    };
});