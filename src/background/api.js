import {HEBREW_LOOKUP} from "../constants";

const url = 'https://shakuf.press/hak/settings.json';
const ext_rules_url = 'https://shakuf.press/hak/ext/ext_rules.json';
const stagingUrl = 'https://shakuf.press/hak_staging/settings.json';
const fetchInterval = 1000 * 60 * 60 * 24;
let data = {};
let names = [];
let rules = [];


const decodeString = (str) => {
    return str.replace(/&#(\d+);/g, (match, number) => {
        return String.fromCharCode(number);
    });
};

const prepareData = (json) => {
    const currentKnesset = json.texts && json.texts.find(e => {
        return e[HEBREW_LOOKUP.ATTRIBUTE_NAME] === HEBREW_LOOKUP.CURRENT_KNESSET;
    });

    //  new way, delete old after having in production
    if (currentKnesset && currentKnesset[HEBREW_LOOKUP.ATTRIBUTE_VALUE]) {
        const hakData = Object.values(json.src[currentKnesset[HEBREW_LOOKUP.ATTRIBUTE_VALUE]]);
        hakData.forEach(hk => {
            if (hk[HEBREW_LOOKUP.HIDE_IN_SITE]) {
                return;
            }

            if (!hk[HEBREW_LOOKUP.NAME]) {
                return;
            }

            hk.imgSrc = hk.image_filename;
            let name = hk[HEBREW_LOOKUP.NAME];
            if (["'", "׳"].includes(name[name.length - 1])) {
                name = name.substring(0, name.length - 1);
            }
            names.push({name: name, id: hk['id']});
            data[name] = hk;

            if (hk[HEBREW_LOOKUP.NICKNAME] && hk[HEBREW_LOOKUP.NICKNAME] !== hk[HEBREW_LOOKUP.NAME]) {
                hk[HEBREW_LOOKUP.NICKNAME].split(',').forEach(nickName => {
                    names.push({name: nickName, id: hk['id']});
                    data[nickName] = hk;
                })
            }

        });

        return;
    }


    // old way to delete:
    json.src.forEach(hk => {
        if (hk[HEBREW_LOOKUP.HIDE_IN_SITE]) {
            return;
        }

        if (!hk[HEBREW_LOOKUP.NAME]) {
            return;
        }

        Object.keys(hk).forEach(e => {
            hk[e] = decodeString(hk[e]);
        });

        let name = hk[HEBREW_LOOKUP.NAME];
        if (["'", "׳"].includes(name[name.length - 1])) {
            name = name.substring(0, name.length - 1);
        }
        names.push({name: name, id: hk['#']});
        data[name] = hk;
    });
    json.images.forEach(hk => {
        const name = hk.name;
        if (!name || !data[name]) {
            return;
        }
        data[hk.name].imgSrc = hk.src;
    });

};

const fetchData = async () => {
    try {
        names = [];
        data = {};
        let response = await fetch(url + '?cb=' +  new Date().getTime());
        let json = await response.json();
        prepareData(json);
        //  console.log(data, names);
    } catch (e) {
        //  error
    }
};

const fetchRules = async () => {
    try {
        rules = [];
        let response = await fetch(ext_rules_url);
        return await response.json();
    } catch (e) {
        conosle.error(e)
    }
};

const updateRules = async () => {
    try {
        rules = await fetchRules()
    } catch (e) {
        conosle.error(e)
    }
};

export const init = async () => {
    await fetchData();
    await updateRules();
    setInterval(fetchData, fetchInterval);
    setInterval(updateRules, fetchInterval);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'getRules':
                sendResponse(rules);
                break;
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
