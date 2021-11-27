import {init as apiInit} from './api';
import {init as contextMenuInit} from './contextMenus';
import {init as runtimeInit} from './runtime';
import {init as messagingInit} from './messaging';
import {injectToAllTabs} from './inject';
import {analytics} from "./ga";
import storage from "./storage";
import {STORAGE_KEYS} from "../constants";

(async () => {
    //  Install/Update logic:
    runtimeInit();
    //  Messaging logic between content and background:
    await messagingInit();
//  Api used for getting data from Shakuf servers:
    await apiInit();
//  Context menu, used for opting out:
    await contextMenuInit();
//  Injecting to all open tabs:
    await injectToAllTabs();
//  Count daily users of the extension:
    analytics.dailyUsers();
})();



