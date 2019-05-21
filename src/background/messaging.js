import {SHOULD_RUN_ON_PAGE, OVERLAY_MESSAGING, STORAGE_KEYS} from "../constants";
import storage from "./storage";

export const init = () => {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        switch (message.action) {
            case SHOULD_RUN_ON_PAGE:
                try {
                    const shouldRun = await storage.get(STORAGE_KEYS.SHOULD_RUN_ON_PAGE);
                    sendResponse(shouldRun !== false);
                } catch (e) {
                    console.error(e);
                    sendResponse(true);
                }
                break;
            case OVERLAY_MESSAGING.SHAKUF_HOVER:
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: OVERLAY_MESSAGING.SHOW_NAME,
                    name: message.name
                }, sendResponse);
                break;
            case OVERLAY_MESSAGING.SHAKUF_UNHOVER:
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: OVERLAY_MESSAGING.HIDE_NAME,
                    name: message.name
                }, sendResponse);
                break;
        }
        return true;
    });
};
