import {HEBREW_LOOKUP} from "../constants";
const url = 'https://shakuf.press/hak/settings.json';
const fetchInterval = 1000 * 60 * 60 * 24;
let data = {};
let names = [];

const decodeString = (str) => {
    return str.replace(/&#(\d+);/g,  (match, number) => {
        return String.fromCharCode(number);
    });
};

const prepareData = (json) => {
    json.src.forEach(hk => {
        if (json.src[HEBREW_LOOKUP.HIDE_IN_SITE]) {
            return;
        }
        if (!hk[HEBREW_LOOKUP.NAME]) {
            return;
        }

        Object.keys(hk).forEach(e => {
            hk[e] = decodeString(hk[e]);
        });

        const name = hk[HEBREW_LOOKUP.NAME];
        names.push({name: name, id: hk['#']});
        data[name] = hk;
    });
    json.images.forEach(hk => {
        const name = decodeString(hk.name);
        if (!name || !data[name]) {
            return;
        }
        data[decodeString(hk.name)].imgSrc = hk.src;
    })
};

const fetchData = async () => {
    try {
        names = [];
        data = {};
        let response = await fetch(url);
        let json = await response.json();
        prepareData(json);
        //  console.log(data, names);
    } catch (e) {
        //  error
    }
};

export const init = async () => {

    await fetchData();
    setInterval(fetchData, fetchInterval);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'getNames':
                sendResponse(names);
                break;
            case 'getName':
                sendResponse(data[message.name]);
                break;
        }
        return true;
    })
};