import storage from './storage';
import {STORAGE_KEYS} from '../constants/';
import {updateAllTabsWithRunningState} from "./inject";

const MENU_IDS = {
    WEBSITE: 'website_links',
    CONTACT: 'website_contact',
    ON_OFF: 'turnoffon'

};
const removeAllContextMenus = () => {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.removeAll(() => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        })
    })
};

const createWebsiteMenuItem = () => {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(
            {
                id: MENU_IDS.WEBSITE,
                title: 'לאתר שקוף',
                contexts: ["page_action"],
                onclick: () => {
                    window.open('https://shakuf.press');
                }
            },
            () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            })
    });
};

const createContactMenuItem = () => {
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(
            {
                id: MENU_IDS.CONTACT,
                title: 'בעיה? שאלה? צרו קשר',
                contexts: ["page_action"],
                onclick: () => {
                    window.open('https://shakuf.press/contact/');
                }
            },
            () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            })
    });
};

const createStateMenuItem = async () => {
    const initialShouldRunOnPage = await storage.get(STORAGE_KEYS.SHOULD_RUN_ON_PAGE);
    return new Promise((resolve, reject) => {
        chrome.contextMenus.create(
            {
                id: MENU_IDS.ON_OFF,
                title: initialShouldRunOnPage === false ? 'הדלק תוסף' : 'כבה תוסף',
                contexts: ["page_action"],
                onclick: async () => {
                    const currentShouldRunOnPage = await storage.get(STORAGE_KEYS.SHOULD_RUN_ON_PAGE);
                    const nextState = currentShouldRunOnPage === false;
                    try {
                        await storage.set(STORAGE_KEYS.SHOULD_RUN_ON_PAGE, nextState);
                    } catch (e) {
                        console.error(e);
                    }
                    updateAllTabsWithRunningState(nextState);
                    chrome.contextMenus.update(
                        MENU_IDS.ON_OFF,
                        {
                            title: nextState ? 'כבה תוסף' : 'הדלק תוסף'
                        }, () => {
                            if (chrome.runtime.lastError) {
                                console.error(chrome.runtime.lastError);
                            }
                        });
                }
            },
            () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            })
    });
};

export const init = async () => {
    try {
        await removeAllContextMenus();
        await createWebsiteMenuItem();
        await createContactMenuItem();
        await createStateMenuItem();
    } catch (e) {
        console.error(e);
    }
};
