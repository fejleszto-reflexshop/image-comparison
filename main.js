let items = [];
let doneList = [];
let cnt = 0;

let isUploadBtnPressed = false;

const divWrapper = document.querySelector('.wrapper');

const h3Title = document.getElementById('title');

const img = document.getElementById('image');

const url = document.getElementById('url');

const size = document.getElementById('size');

const btnNext = document.getElementById('next');

const btnDone = document.getElementById('done');

const uploadBtn = document.getElementById('upload');


window.addEventListener('beforeunload', (e) => {
    if (doneList.length === 0 && !isUploadBtnPressed) {
        e.preventDefault();
        e.returnValue = '';
    }
});

async function getImages() {
    const apiCall = await fetch('', {
        method: 'GET'
    });

    const data = await apiCall.json();

    data.forEach(item => {
        items.push(item);
    });
}

function getImageSize(imageUrl) {
    return new Promise((resolve, reject) => {
        const tempImg = new Image();

        tempImg.onload = () => {
            resolve({
                width: tempImg.naturalWidth,
                height: tempImg.naturalHeight
            });
        };

        tempImg.onerror = () => {
            reject('Nem sikerült betölteni a képet.');
        };

        tempImg.src = imageUrl;
    });
}

await getImages();

await buildPreview(0);

async function buildPreview(position) {
    if (!items[position]) return;

    divWrapper.style.cssText = `
        min-height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        flex-direction: column;
        text-align: center;
        box-sizing: border-box;
        padding: 20px;
    `;

    divWrapper.id = position.toString();

    h3Title.innerText = items[position].cikkszam_termeknev;

    img.src = items[position].kep_link;

    url.innerHTML = 'Termek link';
    url.href = items[position].termek_link;

    size.innerHTML = 'Képméret betöltése...';

    try {
        const imageSize = await getImageSize(items[position].kep_link);

        currentOriginalWidth = imageSize.width;
        currentOriginalHeight = imageSize.height;

        updateSizeText();
    } catch (error) {
        currentOriginalWidth = 0;
        currentOriginalHeight = 0;

        size.innerHTML = 'Nem sikerült lekérni a képméretet.';
        console.error(error);
    }
}

async function increment() {
    ++cnt;

    if (cnt < items.length) {
        await buildPreview(cnt);
    }
}

btnNext.addEventListener('click', async function () {
    await increment();
});

btnDone.addEventListener('click', async function () {
    let current_image = document.getElementById('title').innerHTML;

    doneList.push(current_image);

    document.querySelector('footer').innerHTML = 'Items in done list: ' + doneList.length.toString();

    await increment();
});

uploadBtn.addEventListener('click', async function () {
    isUploadBtnPressed = true;

    const apiCall = await fetch('', {
        method: 'POST',
        body: JSON.stringify({ "images": doneList })
    });

    const data = await apiCall.json();

    alert(data.r);

    doneList = [];

    document.querySelector('footer').innerHTML = 'Items in done list: ' + doneList.length.toString();
});