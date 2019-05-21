class Analytics {
    constructor() {
        this.trackingID = 'UA-113074932-3';
        this.version = chrome.runtime.getManifest().version;
        this.customDimensions = {dimension1: this.version};

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            switch (message.action) {
                case 'gaEvent':
                    this.callEvent(message.ga.category, message.ga.action, message.ga.label, message.ga.value, message.ga.customDimensions);
                    break;
            }
            return true;
        });

        this.injectGA();
    }

    injectGA() {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            (i[r] =
                i[r] ||
                function () {
                    (i[r].q = i[r].q || []).push(arguments);
                }),
                (i[r].l = Date.now());
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(
            window,
            document,
            'script',
            'https://www.google-analytics.com/analytics.js',
            'ga'
        );
        window['ga']('create', this.trackingID, 'auto');
        window['ga']('set', 'checkProtocolTask', () => {
        });
    }


    dailyActiveUser() {
        if (!localStorage.installedAt) {
            localStorage.installedAt = new Date().getTime();
        }
        const installedAt = localStorage.installedAt;
        const age = Math.floor(
            (new Date().getTime() - parseInt(installedAt)) /
            (1000 * 60 * 60 * 24)
        );
        const lastAge = localStorage.lastAge;
        if (!lastAge || parseInt(age) > parseInt(lastAge)) {
            localStorage.lastAge = age;
            this.callEvent('General', 'Daily User', age);
        }
    }

    dailyUsers() {
        setTimeout(this.dailyActiveUser.bind(this), 5 * 1000);
        setInterval(this.dailyActiveUser.bind(this), 1000 * 60 * 60);
    }

    callEvent(category, action, label, value, customDimensions) {
        const allCustomDimensions = Object.assign(
            {},
            this.customDimensions,
            customDimensions
        );

        //  console.log(category, action, label, value, allCustomDimensions);
        window['ga']('send', 'event', category, action, label, value, allCustomDimensions);
    }
}


export const analytics = new Analytics();
