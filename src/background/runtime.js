import {analytics} from "./ga";
import {STORAGE_KEYS, URLS} from "../constants";
import storage from "./storage";

export const init = () => {
    chrome.runtime.onInstalled.addListener(details => {
        switch (details.reason) {
            case 'install':
                analytics.callEvent('General', 'Installed');
                storage.set(STORAGE_KEYS.SHOULD_RUN_ON_PAGE, false); // for now, auto set as default on start
                break;
            case 'update':
                analytics.callEvent('General', 'Updated');
                const prevVersion = details.previousVersion;
                if (prevVersion === "0.2.2" && details.reason === "update") {
                    //temp: change active users with on for hak part to off
                    storage.set(STORAGE_KEYS.SHOULD_RUN_ON_PAGE, false);
                }
                break;
        }
    });

    chrome.runtime.setUninstallURL(URLS.UNINSTALL);
};
