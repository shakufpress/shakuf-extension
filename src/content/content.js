import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    IFRAME_ID,
    INNER_IFRAME_ID,
    OVERLAY_MESSAGING,
    PAGE_MESSAGING,
    SHAKUF_MARKED_CLASSNAME,
    SHOULD_RUN_ON_PAGE
} from '../constants';
import Warning from '../warning/warning'

let shouldHideCheckInterval, active, hovered, cursorX, cursorY, injectedThisSession, shouldRun;
const marginOfHiding = 75;
const overlayWidth = 650;
const overlayHeight = 270;
const marginOnSideOfOverlayVsPage = 20;
const shouldHideCheckIntervalDurationInMs = 200;
const findingInPageIntervalDurationMs = 2000;

const SELECTORS_TO_SEARCH_ON = 'body *:not(iframe):not(script):not(img):not(br):not(.shakuf_marked):not(link):not(style)';
const SHAKUF_WARNING_ELEMENT_ID = 'shakuf_warning'

//  mouseover the relevant detected name should show the overlay:
document.addEventListener('mouseover', (nameElement) => {
    //  in case closed while on page, it won't work
    if (!shouldRun) {
        return;
    }
    //  a name got hovered
    if (nameElement.target && nameElement.target !== hovered && nameElement.target.className && nameElement.target.className === SHAKUF_MARKED_CLASSNAME) {
        active = true;
        hovered = nameElement.target;
        clearInterval(shouldHideCheckInterval);

        //  get the iframe and display it wheere needed
        const iframe = document.getElementById(IFRAME_ID);
        iframe.style.opacity = 1;
        const nameElementBoundaries = nameElement.target.getBoundingClientRect();
        // @formatter:off
        //  choosing the top/left of the overlay:
        iframe.style.left = `
                        ${
            Math.min(
                window.innerWidth - overlayWidth - marginOnSideOfOverlayVsPage,
                Math.max(
                    nameElementBoundaries.left + nameElementBoundaries.width / 2 - (overlayWidth / 2),
                    marginOnSideOfOverlayVsPage
                )
            )
        }px`;
        iframe.style.top = `
                        ${
            // top of element + height of element + overlayHeight get below fold (document.body.clientHeight):
            nameElement.clientY + nameElementBoundaries.height + overlayHeight > window.innerHeight ?
                Math.max(
                    0,
                    (nameElement.pageY - nameElementBoundaries.height - overlayHeight)
                ) :
                Math.max(
                    nameElement.pageY + nameElementBoundaries.height,
                    0
                )
        }px`;
        // @formatter:on
        const name = nameElement.target.innerText;
        gaTrack({category: 'Page', action: 'Hover', label: name, customDimensions: {cd2: location.hostname}})

        //  asking for hover event (background will trigger the overlay)
        chrome.runtime.sendMessage({
            action: OVERLAY_MESSAGING.SHAKUF_HOVER,
            name: name
        }, () => {
            iframe.style.display = 'block';
            shouldHideCheckInterval = setInterval(shouldHide.bind(null, name), shouldHideCheckIntervalDurationInMs);
        });
    }
});

//  clicking anywhere should hide the overlay:
document.addEventListener('click', (e) => {

    if (!active || e.target.className === SHAKUF_MARKED_CLASSNAME || e.target.id === IFRAME_ID || e.target.closest(`#${IFRAME_ID}`)) {
        return;
    }
    gaTrack({category: 'Page', action: 'Closed', label: name, customDimensions: {cd2: location.hostname}});
    active = false;
    hovered = false;
    clearInterval(shouldHideCheckInterval);
    const iframe = document.getElementById(IFRAME_ID);
    iframe.style.display = 'none';
    chrome.runtime.sendMessage({action: OVERLAY_MESSAGING.SHAKUF_UNHOVER}, () => {
        if (chrome.runtime.lastError) {
            //  nothing on page
        }
    });

});

//  for knowing where to put the overlay:
document.onmousemove = (e) => {
    if (!shouldRun) {
        return;
    }
    cursorX = e.clientX;
    cursorY = e.clientY;
};

const gaTrack = (gaEventParams) => {
    if (!gaEventParams) return;
    chrome.runtime.sendMessage({
        action: 'gaEvent',
        ga: {...gaEventParams}
    });
}

const fadeOut = (s) => {
    return new Promise(resolve => {
        (s.opacity -= .1) < 0 ?
            (() => {
                s.display = "none";
                resolve();
            })() :
            setTimeout(() => {
                if (hovered) {
                    return;
                }
                fadeOut(s);
            }, 40)
    });
};

const shouldHide = async (name) => {
    const iframe = document.getElementById(IFRAME_ID);
    if (active) {
        const b = iframe.getBoundingClientRect();
        if (!cursorX || !cursorY ||
            cursorX < (b.left - marginOfHiding) ||
            cursorX > (b.left + b.width + marginOfHiding) ||
            cursorY < (b.top - marginOfHiding) ||
            cursorY > (b.top + b.height + marginOfHiding)) {
            clearInterval(shouldHideCheckInterval);
            active = false;
            hovered = false;
            const s = iframe.style;
            await fadeOut(s);
            chrome.runtime.sendMessage({action: OVERLAY_MESSAGING.SHAKUF_UNHOVER, name: name}, () => {
                if (chrome.runtime.lastError) {
                    //  nothing on page
                }
            });
            gaTrack({category: 'Page', action: 'FadeOut', label: name, customDimensions: {cd2: location.hostname}})
        }
    }
};

// Injecting the overlay to the page once when relevant, ready for hover event
const injectOverlayToPageOnce = () => {
    if (!injectedThisSession) {
        injectedThisSession = true;
        //  removing iframes from before, probably bugs and earliy version:
        const alreadyInjectedIframe = document.getElementById(IFRAME_ID);
        alreadyInjectedIframe && alreadyInjectedIframe.parentElement.removeChild(alreadyInjectedIframe);
        //  injecting overlay iframe to page:
        const iframe = document.createElement('iframe');
        iframe.id = IFRAME_ID;
        //  once injected fully:
        iframe.onload = () => {
            //  css for the html around inner iframe:
            const bodyStyle = document.createElement('style');
            const linkStyle = document.createElement('link');
            bodyStyle.innerHTML = `body{margin:0;padding:0;}`;
            linkStyle.href = chrome.runtime.getURL('/content/content.css');
            linkStyle.type = 'text/css';
            linkStyle.rel = 'stylesheet';
            iframe.contentDocument.head.appendChild(bodyStyle);
            iframe.contentDocument.head.appendChild(linkStyle);
            //  injecting inner iframe with the overlay itself:
            const innerIframe = document.createElement('iframe');
            innerIframe.id = INNER_IFRAME_ID;
            innerIframe.src = chrome.runtime.getURL(`overlay/overlay.html?host=${location.hostname}`);
            iframe.contentDocument.body.appendChild(innerIframe);
        };
        //  injecting:
        document.body.appendChild(iframe);
    }
};

// having the logic on edited elements is bad, prevent it
const isElementCurrentlyBeingEdited = (e) => {
    if (e.textOnly) return false;
    if (e.node.closest('[contenteditable]') || e.node.getAttribute('[contenteditable]') === "true") return true;
    return false;
}

// find the names in the page:
    const findAndMarkInPage = async (names) => {
    requestAnimationFrame(() => {
        const relevantElements = [];
        const elements = Array.from(document.querySelectorAll(SELECTORS_TO_SEARCH_ON));
        elements.forEach(e => {
            if ((e.childNodes.length === 1 && e.childNodes[0].nodeName === '#text' && e.innerText)) {
                relevantElements.push({node: e});
            } else if (e.childNodes.length > 0) {
                const textNodes = Array.from(e.childNodes).filter(c => {
                    return c.nodeName === '#text'
                });
                if (textNodes.length > 0) {
                    textNodes.forEach(n => {
                        relevantElements.push({node: n, textOnly: true});
                    });
                }
            }
        });
        let replaced = 0;
        for (let element of relevantElements) {
            const regexAttribute = element.textOnly ? 'nodeValue' : 'innerText';
            for (let hk of names) {
                const re = new RegExp(hk.name, 'ig');
                const matching = element.node[regexAttribute].match(re);

                if (matching) {
                    // don't handle elements if they are inside inputs or editable nodes
                    if (isElementCurrentlyBeingEdited(element)) return;

                    gaTrack({
                        category: 'Page',
                        action: 'Found',
                        label: hk.name,
                        customDimensions: {cd2: location.hostname}
                    });

                    injectOverlayToPageOnce();

                    //  replacing the  nodes/texts to have a span with the hover listener and relevant design
                    if (element.textOnly) {
                        element.node.parentElement.innerHTML = element.node.parentElement.innerHTML.replace(re, `<shakufmark class='shakuf_marked' shakuf='${hk.id}'>${hk.name}</shakufmark>`);
                    } else {
                        element.node.innerHTML = element.node.innerHTML.replace(re, `<shakufmark class='shakuf_marked' shakuf='${hk.id}'>${hk.name}</shakufmark>`);

                    }

                    replaced++;
                    break;
                }
            }
        }
        setTimeout(findAndMarkInPage.bind(null, names), findingInPageIntervalDurationMs);
    });
};

const addComercialWarning = () => {
  const warningNode = document.getElementById(SHAKUF_WARNING_ELEMENT_ID);
  if (warningNode) return;

  const container = document.createElement('div');

  document.body.appendChild(container);
  document.body.insertBefore(container, document.body.firstChild);

  ReactDOM.render(<Warning />, container);
};

const findAndMarkCommercialsInPage = async (rules) => {
  if (!rules) return;

  requestAnimationFrame(() => {
    const targetNodes = rules
      .filter((rule) => new RegExp(rule.domain).test(window.location.hostname))
      .reduce((nodes, rule) => {
        const potenial = Array.from(document.querySelectorAll(rule.selector));

        const additionalNodes = potenial.filter(
          (node) =>
            node.innerText && new RegExp(rule.regexRule).test(node.innerText)
        );
        return [...nodes, ...additionalNodes];
      }, []);

    if (targetNodes.length > 0) {
      addComercialWarning();
    }

    setTimeout(
      findAndMarkCommercialsInPage.bind(null, rules),
      findingInPageIntervalDurationMs
    );
  });
};


// main logic
const onPageLogic = () => {
    //  get all relevant names for page so we'll search for them
    chrome.runtime.sendMessage({action: 'getNames'}, (names) => {
        if (chrome.runtime.lastError || !names) {
            return console.error(chrome.runtime.lastError);
        }
        findAndMarkInPage(names);
    });


    chrome.runtime.sendMessage({action: 'getRules'}, (rules) => {
        if (chrome.runtime.lastError || !rules) {
            return console.error(chrome.runtime.lastError);
        }
        findAndMarkCommercialsInPage(rules)
    });

    // const mock_rules = [{"id":"1","domain":"www\.ynet\.co\.il","selector":"span[data-text=true]","regexRule":"בשיתוף"},
    // {"id":"2","domain":"www\.ynet\.co\.il","selector":"span p:first-child","regexRule":"התכנים במדור זה מוגשים בשיתוף"},
    // {"id":"3","domain":"walla\.co\.il","selector":"div.author span","regexRule":"בשיתוף"},
    // {"id":"4","domain":"www\.mako\.co\.il","selector":"ul.icons-bar a","regexRule":"בשיתוף"},
    // ]
    // findAndMarkCommercialsInPage(mock_rules)
};

//  STARTING HERE: asking background if should runs
chrome.runtime.sendMessage({action: SHOULD_RUN_ON_PAGE}, (shouldRunOnPage) => {
    if (chrome.runtime.lastError) {
        return;
    }
    if (shouldRunOnPage) {
        shouldRun = true; // local flag
        onPageLogic();
    }
});

//  on page messaging listeners from background:
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case PAGE_MESSAGING.STOP:
            // stop from browser icon
            shouldRun = false;
            Array.from(document.querySelectorAll(`.${SHAKUF_MARKED_CLASSNAME}`)).forEach(e => {
                e.classList.add('shakuf_stopped');
            });
            break;
        case PAGE_MESSAGING.START:
            // start from browser icon
            shouldRun = true;
            Array.from(document.querySelectorAll(`.${SHAKUF_MARKED_CLASSNAME}`)).forEach(e => {
                e.classList.remove('shakuf_stopped');
            });
            onPageLogic();
            break;
    }
});
