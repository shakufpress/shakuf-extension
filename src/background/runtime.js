import {analytics} from "./ga";
import {URLS} from "../constants";

export const init = () => {
    chrome.runtime.onInstalled.addListener(details => {
        switch (details.reason) {
            case 'install':
                analytics.callEvent('General', 'Installed');
                break;
            case 'update':
                analytics.callEvent('General', 'Updated');
                break;
        }
    });

    chrome.runtime.setUninstallURL(URLS.UNINSTALL);
};
