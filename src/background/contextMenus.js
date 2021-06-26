import storage from './storage';
import {RUNNING_TYPES, STORAGE_KEYS} from '../constants/';
import {updateAllTabsWithRunningState} from "./inject";

const MENU_IDS = {
    WEBSITE: 'website_links',
    CONTACT: 'website_contact',
    ON_OFF: 'turnoffon',
    ON_OFF_COMMERCIAL_WARNING: 'on_off_commercial_warning'
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
    const initialShouldCommercialRunOnPage = await storage.get(STORAGE_KEYS.SHOULD_COMMERCIAL_RUN_ON_PAGE);

    chrome.contextMenus.create(
        {
            id: MENU_IDS.ON_OFF,
            title: !initialShouldRunOnPage ? 'הפעל את מפת ההח״כים' : 'כבה את מפת הח״כים',
            contexts: ["page_action"],
            onclick: async () => {
                const currentShouldRunOnPage = await storage.get(STORAGE_KEYS.SHOULD_RUN_ON_PAGE);
                const nextState = currentShouldRunOnPage === false;
                try {
                    await storage.set(STORAGE_KEYS.SHOULD_RUN_ON_PAGE, nextState);
                } catch (e) {
                    console.error(e);
                }
                updateAllTabsWithRunningState(nextState, RUNNING_TYPES.HAK);
                chrome.contextMenus.update(
                    MENU_IDS.ON_OFF,
                    {
                        title: nextState ? 'כבה את מפת ההח״כים' : 'הפעל את מפת הח״כים'
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError);
                        }
                    });
            }
        },
        () => {

        });

    chrome.contextMenus.create(
        {
            id: MENU_IDS.ON_OFF_COMMERCIAL_WARNING,
            title: !initialShouldCommercialRunOnPage ? 'הפעל זיהוי פרסום סמוי' : 'כבה זיהוי פרסום סמוי',
            contexts: ["page_action"],
            onclick: async () => {
                const currentShouldRunOnPage = await storage.get(STORAGE_KEYS.SHOULD_COMMERCIAL_RUN_ON_PAGE);
                const nextState = currentShouldRunOnPage === false;
                try {
                    await storage.set(STORAGE_KEYS.SHOULD_COMMERCIAL_RUN_ON_PAGE, nextState);
                } catch (e) {
                    console.error(e);
                }
                updateAllTabsWithRunningState(nextState, RUNNING_TYPES.COMMERCIAL);
                chrome.contextMenus.update(
                    MENU_IDS.ON_OFF_COMMERCIAL_WARNING,
                    {
                        title: nextState ? 'כבה זיהוי פרסום סמוי' : 'הפעל זיהוי פרסום סמוי'
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError);
                        }
                    });
            }
        },
        () => {

        });
};

export const init = async () => {
    try {
        await removeAllContextMenus();
        await createWebsiteMenuItem();
        await createContactMenuItem();
        createStateMenuItem();
    } catch (e) {
        console.error(e);
    }
};
