const img = document.getElementById('img-flag');
const options = Array.from(document.querySelectorAll('option'));

function changeFlag(value) {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption !== undefined) {
        img.src = `public/flags/${value}.svg`;
        selectedOption.selected = true;
    } else if(selectedOption === undefined) {
        img.src = `public/flags/en.svg`;
        const enOpt = options.find(option => option.value === 'en');
        enOpt.selected = true;
    };
};

const allTxtsElements = Array.from(document.querySelectorAll('.translate'));
const allTxts = allTxtsElements.map(element => element.innerText);
const loadingWrapper = document.querySelector('#loading');

async function translate(lng) {
    
    if (localStorage.getItem(lng) && localStorage.getItem(lng) !== null) {
        const cache = JSON.parse(localStorage.getItem(lng));
        allTxtsElements.forEach((element, index) => {
            element.innerText = cache[index];
        });
    } else {
        try {
            document.documentElement.classList.toggle('overflow-hidden');
            document.documentElement.classList.toggle('pointer-events-none');
            loadingWrapper.classList.toggle('hidden');

            const raw = await fetch('/api/translate', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    text: [...allTxts],
                    lang: lng
                })
            });
            
            const data = await raw.json();
            console.log(data);
            console.log(typeof data)
            console.log(typeof data.translated)
            if (!Array.isArray(data.translated)) {
                throw new Error("API não retornou um array de traduções");
            }
            localStorage.setItem(lng, JSON.stringify(data.translated));
            allTxtsElements.forEach((text, index) => {
                text.innerText = data.translated[index];
            })
        } catch(error) {
            console.error(error.message);
        } finally {
            document.documentElement.classList.toggle('overflow-hidden');
            document.documentElement.classList.toggle('pointer-events-none');
            loadingWrapper.classList.toggle('hidden');
        };
    }
};

export function Translator() {
    return {
        changeFlag(value) {
            return changeFlag(value);
        },
        translate(lng) {
            return translate(lng);
        }
    };
};