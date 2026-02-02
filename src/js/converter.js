const tempArray = Array.from(document.querySelectorAll('temp'));
const velArray = Array.from(document.querySelectorAll('vel'));
const timeArray = Array.from(document.querySelectorAll('timestamp'));
const measArray = Array.from(document.querySelectorAll('meas'));

function toCelsius() {
    const convertedArray = tempArray.map(temp => {
        const number = Number.parseFloat(temp.innerText);
        const celsius = Number.parseFloat(Math.round((number - 32)/(1.8)));
        return celsius;
    });
    tempArray.forEach((el, index) => el.innerText = convertedArray[index]);
    measArray.forEach(meas => {
        if (meas.innerText === '°F') {
            meas.innerText = '°C'
        };
    });
};

function toFarenheit() {
    const convertedArray = tempArray.map(temp => {
        const number = Number.parseFloat(temp.innerText);
        const farenheit = Number.parseFloat(Math.round((number * 1.8)+(32)));
        return farenheit;
    });
    tempArray.forEach((el, index) => el.innerText = convertedArray[index]);
    measArray.forEach(meas => {
        if (meas.innerText === '°C') {
            meas.innerText = '°F'
        };
    });
};

function toKMH() {
    const convertedArray = velArray.map(vel => {
        const number = Number.parseFloat(vel.innerText);
        const KMH = Number(Math.round(number * 1.6));
        return KMH;
    });
    velArray.forEach((el, index) => el.innerText = convertedArray[index]);
    measArray.forEach(meas => {
        if(meas.innerText === 'mph') {
            meas.innerText = 'km/h';
        };
    });
};

function toMPH() {
    const convertedArray = velArray.map(vel => {
        const number = Number.parseFloat(vel.innerText);
        const MPH = Number(Math.round(number / 1.6));
        return MPH;
    });
    velArray.forEach((el, index) => el.innerText = convertedArray[index]);
    measArray.forEach(meas => {
        if(meas.innerText === 'km/h') {
            meas.innerText = 'mph';
        };
    });
};

function to24H() {
    const convertedArray = timeArray.map(el => {
        const [time, measure] = el.innerText.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12' && measure === 'AM') {
            hours = '00';
            return `${hours}:${minutes}`;
        } else if (measure === 'PM') {
            const timeCorrect = Number.parseInt(hours) + 12;
            return `${timeCorrect}:${minutes}`;
        } else if (measure === 'AM') {
            return time;
        };
    })
    timeArray.forEach((time, index) => time.innerText = convertedArray[index]);
};

function to12H() {
    const convertedArray = timeArray.map(time => {
        const currentTime = time.innerText;
        const timeCorrect = currentTime.split(':');
        const [hours, minutes] = timeCorrect;
        const fakeDate = new Date(1970, 0, 1, hours, minutes);
        const time12H = fakeDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        return time12H;
    });
    timeArray.forEach((time, index) => time.innerText = convertedArray[index]);
};

export function Converter() {
    return {
        toCelsius() {
            return toCelsius();
        },
        toFarenheit() {
            return toFarenheit();
        },
        toKMH() {
            return toKMH();
        },
        toMPH() {
            return toMPH();
        },
        to24H() {
            return to24H();
        },
        to12H() {
            return to12H();
        }
    };
};