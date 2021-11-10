var domains = {},
    dates = {
        today: getDateString(),
        start: ""
    },
    seconds = {
        today: 0,
        alltime: 0
    };
let timeIntervals = {
    update: 0,
    save: 0
};
var settings = {
    idleTime: IDLE_TIME_DEFAULT,
    graphGap: GRAPH_GAP_DEFAULT,
    badgeDisplay: BADGE_DISPLAY_DEFAULT,
    screenshotInstructionsRead: SCREENSHOT_INSTRUCTIONS_READ_DEFAULT
};
let domainsChanged = !1;
const STORAGE_DOMAINS = "domains",
    STORAGE_DATE_START = "date-start",
    STORAGE_SECONDS_ALLTIME = "seconds-alltime",
    STORAGE_IDLE_TIME = "idle-time",
    STORAGE_GRAPH_GAP = "graph-gap",
    STORAGE_BADGE_DISPLAY = "badge-display",
    STORAGE_SCREENSHOT_INSTRUCTIONS_READ = "storage-instructions-read";

function loadDomains(a) {
    storageLocal.load("domains", {}, e => {
        a(e), dcl(`Domains loaded: ${Object.keys(domains).length} domains`)
    })
}

function saveDomains() {
    storageLocal.save("domains", domains, () => {
        domainsChanged = !1, dcl(`Domains saved: ${Object.keys(domains).length} domains`)
    })
}

function clearAllGeneratedData() {
    domains = {}, saveDomains(), seconds.today = 0, seconds.alltime = 0, saveSecondsAlltime(), dates.start = dates.today, saveDateStart(), dcl("Clear all generated data: done")
}

function loadDateStart(a) {
    storageLocal.load("date-start", a, a => {
        dates.start = a["date-start"], saveDateStart(), dcl(`Start date loaded: ${a["date-start"]}`)
    })
}

function saveDateStart() {
    storageLocal.save("date-start", dates.start, () => {
        dcl(`Start date saved: ${dates.start}`)
    })
}

function loadSecondsAlltime() {
    storageLocal.load("seconds-alltime", 0, a => {
        seconds.alltime = a["seconds-alltime"], saveSecondsAlltime(), dcl("Seconds alltime loaded: " + a["seconds-alltime"])
    })
}

function saveSecondsAlltime() {
    storageLocal.save("seconds-alltime", seconds.alltime, () => {
        dcl(`Seconds alltime saved: ${seconds.alltime}`)
    })
}

function loadIdleTime() {
    storageLocal.load("idle-time", IDLE_TIME_DEFAULT, a => {
        settings.idleTime = a["idle-time"], saveIdleTime(), dcl(`Idle time loaded: ${a["idle-time"]}`)
    })
}

function saveIdleTime() {
    storageLocal.save("idle-time", settings.idleTime, () => {
        dcl(`Idle time saved: ${settings.idleTime}`)
    })
}

function setIdleTime(a) {
    settings.idleTime = parseInt(a) || IDLE_TIME_DEFAULT
}

function loadGraphGap() {
    storageLocal.load("graph-gap", GRAPH_GAP_DEFAULT, a => {
        settings.graphGap = a["graph-gap"], saveGraphGap(), dcl(`Graph gap loaded: ${a["graph-gap"]}`)
    })
}

function saveGraphGap() {
    storageLocal.save("graph-gap", settings.graphGap, () => {
        dcl(`Graph gap saved: ${settings.graphGap}`)
    })
}

function setGraphGap(a) {
    let e = parseFloat(a);
    settings.graphGap = isFinite(e) ? e : GRAPH_GAP_DEFAULT
}

function loadBadgeDisplay() {
    storageLocal.load("badge-display", BADGE_DISPLAY_DEFAULT, a => {
        settings.badgeDisplay = a["badge-display"], saveBadgeDisplay(), dcl(`Badge display loaded: ${a["badge-display"]}`)
    })
}

function saveBadgeDisplay() {
    storageLocal.save("badge-display", settings.badgeDisplay, () => {
        dcl(`Badge display saved: ${settings.badgeDisplay}`)
    })
}

function setBadgeDisplay(a) {
    settings.badgeDisplay = "boolean" == typeof a ? a : BADGE_DISPLAY_DEFAULT
}

function loadScreenshotInstructionsRead() {
    storageLocal.load("storage-instructions-read", SCREENSHOT_INSTRUCTIONS_READ_DEFAULT, a => {
        settings.screenshotInstructionsRead = a["storage-instructions-read"], saveScreenshotInstructionsRead(), dcl(`Storage instructions set loaded: ${a["storage-instructions-read"]}`)
    })
}

function saveScreenshotInstructionsRead() {
    storageLocal.save("storage-instructions-read", settings.screenshotInstructionsRead, () => {
        dcl(`Storage instructions set saved: ${settings.screenshotInstructionsRead}`)
    })
}

function setScreenshotInstructionsRead(a) {
    settings.screenshotInstructionsRead = "boolean" == typeof a ? a : SCREENSHOT_INSTRUCTIONS_READ_DEFAULT
}

function setBadge(a, e) {
    settings.badgeDisplay || (e = ""), chrome.browserAction.setBadgeText({
        tabId: a,
        text: e
    })
}

function updateDomains(a) {
    let e, t, s, d = getDateString();
    dates.today !== d && (dates.today = d, seconds.today = 0), chrome.windows.getLastFocused({
        populate: !0
    }, d => {
        for (let a in d.tabs)
            if (d.tabs.hasOwnProperty(a) && !0 === d.tabs[a].active) {
                s = d.tabs[a];
                break
            } chrome.idle.queryState(settings.idleTime, o => {
                d.id, d.focused;
                let n = s.id;
                s.url;
                if (e = parseDomainFromUrl(s.url), t = parseProtocolFromUrl(s.url), (d.focused && "active" === o || a) && -1 === BLACKLIST_DOMAIN.indexOf(e) && -1 === BLACKLIST_PROTOCOL.indexOf(t) && "" !== e) {
                    dcl("LOG (" + dates.today + "): " + e), domains.hasOwnProperty(e) || (domains[e] = getDomainObj(), domains[e].name = e);
                    let t = domains[e];
                    t.days[dates.today] = t.days[dates.today] || getDayObj(), a || (t.alltime.seconds += INTERVAL_UPDATE_S, t.days[dates.today].seconds += INTERVAL_UPDATE_S, seconds.today += INTERVAL_UPDATE_S, seconds.alltime += INTERVAL_UPDATE_S, domainsChanged = !0), setBadge(n, getBadgeTimeString(t.days[dates.today].seconds))
                }
            })
    })
}
chrome.tabs.onActivated.addListener(a => {
    let e, t = a.tabId;
    chrome.tabs.get(t, a => {
        e = parseDomainFromUrl(a.url), setBadge(t, ""), domains[e] && domains[e].days[dates.today] && setBadge(t, getBadgeTimeString(domains[e].days[dates.today].seconds))
    })
}), dcl("Webtime Tracker - background.js loaded"), loadDateStart(dates.today), loadSecondsAlltime(), loadIdleTime(), loadGraphGap(), loadBadgeDisplay(), loadScreenshotInstructionsRead(), loadDomains(a => {
    domains = a.domains || [], seconds.today = getTotalSecondsForDate(domains, getDateString())
}), timeIntervals.update = window.setInterval(() => {
    updateDomains()
}, INTERVAL_UPDATE_MS), timeIntervals.save = window.setInterval(() => {
    domainsChanged && (saveDomains(), saveSecondsAlltime(), chrome.storage.local.getBytesInUse(null, a => {
        dcl("Total storage used: " + a + " B")
    }))
}, INTERVAL_SAVE_MS);