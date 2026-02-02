const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('previous');
const forecastContainer = document.getElementById('forecast-container');

nextBtn.addEventListener('click', () => {
    forecastContainer.scrollBy({
        left: forecastContainer.clientWidth,
        behavior: 'smooth',
        inline: 'start'
    });
});

previousBtn.addEventListener('click', () => {
    forecastContainer.scrollBy({
        left: -96,
        behavior: 'smooth',
        inline: 'start'
    });
  });