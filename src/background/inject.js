import {PAGE_MESSAGING} from "../constants";

const manifest = chrome.runtime.getManifest();
const scripts = [].concat(manifest.content_scripts[0].js);
const cssFiles = manifest.content_scripts[0].css;


const getAllTabs = () => {
    return new Promise((resolve, reject) => {
        const tabs = [];
        chrome.windows.getAll(
            {
                populate: true
            },
            windows => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                windows.forEach(window => {
                    window.tabs.forEach(tab => {
                        tabs.push(tab);
                    });
                });
                resolve(tabs);
            }
        );
    })
};

export const updateAllTabsWithRunningState = async (shouldRun) => {
    try {
        const tabs = await getAllTabs();
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {action: shouldRun ? PAGE_MESSAGING.START : PAGE_MESSAGING.STOP}, () => {
                if (chrome.runtime.lastError) {
                    //  nothing
                }
            })
        });
    } catch (e) {
        console.error(e);
    }
};

export const injectToAllTabs = async () => {
    try {
        const tabs = await getAllTabs();
        tabs.forEach(tab => {
            cssFiles.forEach(cssFile => {
                chrome.tabs.insertCSS(tab.id, {
                    file: cssFile,
                    runAt: 'document_end'
                }, () => {
                    if (chrome.runtime.lastError) {
                        // nothing
                    }
                });
            });
            scripts.forEach(script => {
                chrome.tabs.executeScript(tab.id, {
                    file: script,
                    runAt: 'document_end'
                }, () => {
                    if (chrome.runtime.lastError) {
                        // nothing
                    }
                });
            });
        });
    } catch (e) {
        console.error(e);
    }
};
