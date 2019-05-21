export default class Storage {
    static get(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response[key]);
                }
            })
        });
    }

    static set(key, value) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({[key]: value}, response => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            })
        });
    }
}
