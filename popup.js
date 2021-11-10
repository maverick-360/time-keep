const backgroundJS = chrome.extension.getBackgroundPage(),
    htmlTemplates = document.querySelector(".js-templates");
let data, html, ranks = {};
const getDomainsData = (e, t) => {
    let a, n, s, r, o, l, d, i, c, u = 0;
    if (o = getDateDiffDays(backgroundJS.dates.today, backgroundJS.dates.start) + 1, a = {
        range: e,
        resolution: t,
        dateStart: backgroundJS.dates.start,
        daysSinceStart: o,
        domains: [],
        total: {
            name: "Total",
            time: 0,
            percentage: 100,
            percentageText: "100.00 %"
        }
    }, n = backgroundJS.domains, e === RANGE_TODAY)
        for (l in s = backgroundJS.dates.today, r = backgroundJS.seconds.today, n) n.hasOwnProperty(l) && n[l].days.hasOwnProperty(s) && (d = n[l].days[s].seconds / r * 100, i = getPercentageString(d), c = d > GRAPH_MIN_PERCENTAGE_TO_INCLUDE, u += c ? 1 : 0, a.domains.push({
            name: n[l].name,
            time: n[l].days[s].seconds,
            percentage: d,
            percentageString: i,
            graphed: c
        }));
    if (e === RANGE_AVERAGE)
        for (l in r = backgroundJS.seconds.alltime / o, n) n.hasOwnProperty(l) && (d = n[l].alltime.seconds / r * 100 / o, i = getPercentageString(d), c = d > GRAPH_MIN_PERCENTAGE_TO_INCLUDE, u += c ? 1 : 0, a.domains.push({
            name: n[l].name,
            time: parseInt(n[l].alltime.seconds / o),
            percentage: d,
            percentageString: i,
            graphed: c
        }));
    if (e === RANGE_ALLTIME)
        for (l in r = backgroundJS.seconds.alltime, n) n.hasOwnProperty(l) && (d = n[l].alltime.seconds / r * 100, i = getPercentageString(d), c = d > GRAPH_MIN_PERCENTAGE_TO_INCLUDE, u += c ? 1 : 0, a.domains.push({
            name: n[l].name,
            time: n[l].alltime.seconds,
            percentage: d,
            percentageString: i,
            graphed: c
        }));
    for (a.total.time = r, a.domains.sort((e, t) => t.percentage - e.percentage), l = 0; l < a.domains.length; l++) a.domains[l].graphed && (a.domains[l].color = getHSL(l, u));
    return a
},
    updateDoughnutInfotext = (e, t, a) => {
        document.querySelector("#doughnut-" + e + " .foreign-object .name").innerHTML = t, document.querySelector("#doughnut-" + e + " .foreign-object .percentage").innerHTML = a
    },
    renderUIRange = (e, t, a, n, s) => {
        let r = getDomainsData(e, t);
        a && renderUIRangeDoughnut(r, e), n && renderUIRangeTable(r, e), s && countRanks(r.domains, e)
    },
    renderUIRangeTable = (e, t) => {
        let a = tplHtmlTable(e);
        htmlRenderInto("table-" + t, a)
    },
    renderUIRangeDoughnut = (e, t) => {
        let a = tplElementDoughnut(e, backgroundJS.settings.graphGap);
        elementInsertInto("doughnut-" + t, a)
    },
    countRanks = (e, t) => {
        let a;
        for (ranks[t] = {
            total: e.length,
            domains: {}
        }, a = 0; a < e.length; a++) ranks[t].domains[e[a].name] = a + 1
    },
    renderControlIdleTime = () => {
        let e = {
            min: 0,
            max: [IDLE_TIME_TABLE.length - 1],
            raw: getSliderRawFromComputed(IDLE_TIME_TABLE, IDLE_TIME_DEFAULT, backgroundJS.settings.idleTime),
            computed: getIdleTimeComputedString(backgroundJS.settings.idleTime),
            default: getIdleTimeComputedString(IDLE_TIME_DEFAULT)
        };
        html = tplHtmlIdleTimeControl(e), htmlRenderInto("idle-time", html)
    },
    renderControlGraphGap = () => {
        let e = {
            min: 0,
            max: [GRAPH_GAP_TABLE.length - 1],
            raw: getSliderRawFromComputed(GRAPH_GAP_TABLE, GRAPH_GAP_DEFAULT, backgroundJS.settings.graphGap)
        };
        html = tplHtmlGraphGapControl(e), htmlRenderInto("graph-gap", html)
    };
let renderControlBadgeDisplay = () => {
    let e = {
        checked: backgroundJS.settings.badgeDisplay
    };
    html = tplHtmlBadgeDisplayControl(e), htmlRenderInto("badge-display", html)
};
const clearOverallStats = () => {
    document.querySelector("#pseudomodal .container.stats .stats-wrapper .text").innerHTML = "", document.querySelector("#pseudomodal .container.stats .stats-wrapper .charts").innerHTML = "", document.querySelector("#pseudomodal .container.stats .stats-wrapper").dataset.statsReady = "0"
};
let renderUI = () => {
    renderUIRange(RANGE_TODAY, RESOLUTION_HOURS, !0, !0, !0), renderUIRange(RANGE_AVERAGE, RESOLUTION_HOURS, !0, !0, !1), renderUIRange(RANGE_ALLTIME, RESOLUTION_DAYS, !0, !0, !0), renderControlIdleTime(), renderControlGraphGap(), renderControlBadgeDisplay(), document.querySelector("#pseudomodal .container.stats .stats-wrapper .text").innerHTML = "", document.querySelector("#pseudomodal .container.stats .stats-wrapper .charts").innerHTML = "", document.querySelector("#pseudomodal .container.stats .stats-wrapper").dataset.statsReady = "0", dcl("UI rendered")
};
const screenshotUIShow = () => {
    document.querySelector("html").classList.add("screenshot-mode"), document.querySelector("footer").style.display = "none", screenshotUICaptureShow(), chrome.permissions.contains({
        origins: ["<all_urls>"]
    }, e => {
        if (chrome.runtime.lastError && chrome.runtime.lastError.message && dcl("Screenshot - permission.contains: " + chrome.runtime.lastError.message), e) {
            if (!backgroundJS.settings.screenshotInstructionsRead) {
                let e = htmlTemplates.querySelector("#screenshot-info-instructions-list"),
                    t = document.importNode(e.content, !0);
                elementInsertIntoElement(document.querySelector(".screenshot-info .instructions .list"), t), document.querySelector(".screenshot-overlay").style.display = "block", document.querySelector(".screenshot-info").style.display = "block", document.querySelector(".screenshot-info .instructions").style.display = "block", document.querySelector(".screenshot-info .permission-grant").style.display = "none", backgroundJS.setScreenshotInstructionsRead(!0), backgroundJS.saveScreenshotInstructionsRead()
            }
        } else document.querySelector(".screenshot-overlay").style.display = "block", document.querySelector(".screenshot-info").style.display = "block", document.querySelector(".screenshot-info .instructions").style.display = "none", document.querySelector(".screenshot-info .permission-grant").style.display = "block"
    })
},
    screenshotUIHide = () => {
        document.querySelector(".screenshot-overlay").style.display = "none", document.querySelector(".screenshot-info").style.display = "none"
    },
    screenshotUICaptureShow = () => {
        document.querySelector(".screenshot-capture").style.display = "block"
    },
    screenshotUICaptureHide = () => {
        document.querySelector(".screenshot-capture").style.display = "none"
    },
    renderScreenshotUI = () => {
        window.location.search === SCREENSHOT_MODE_QUERY && (SCREENSHOT_MODE = !0, screenshotUIShow())
    },
    initialize = () => {
        renderUI(), window.location.search === SCREENSHOT_MODE_QUERY && (SCREENSHOT_MODE = !0, screenshotUIShow()), dcl("Application initialized")
    };
renderUI(), window.location.search === SCREENSHOT_MODE_QUERY && (SCREENSHOT_MODE = !0, screenshotUIShow()), dcl("Application initialized"), addMultipleDelegatedEventListeners("body", "click", (e, t) => {
    if (e.detail >= 2)
        if (document.selection && document.selection.empty) document.selection.empty();
        else if (window.getSelection) {
            window.getSelection().removeAllRanges()
        }
}), addMultipleDelegatedEventListeners(".doughnut .group", "click,mouseover,mouseout", (e, t) => {
    let a, n, s = "",
        r = "",
        o = t.parentNode.getAttribute("wt:range"),
        l = t.getAttribute("wt:connect-id"),
        d = t.getAttribute("wt:url"),
        i = t.getAttribute("wt:no-data"),
        c = !1;
    if ("click" === e.type) "other" !== d && window.open("http://" + d);
    else {
        let d = document.querySelectorAll("#table-" + o + ' tr.domain[data-connect-id="' + l + '"]');
        if ("mouseover" === e.type) {
            let e = document.querySelectorAll("#doughnut-" + o + " .group");
            for (a = 0; a < e.length; a++) e[a].classList.remove("active");
            t.classList.add("active"), s = t.getAttribute("wt:name"), r = t.getAttribute("wt:percentage-string");
            let l = document.querySelectorAll("#table-" + o + " tr.domain");
            if (l)
                for (n = 0; n < l.length; n++) l[n].classList.remove("active");
            if (d)
                for (n = 0; n < d.length; n++) d[n].classList.add("active")
        } else if (SCREENSHOT_MODE) c = !0;
        else if (t.classList.remove("active"), d.length > 0)
            for (n = 0; n < d.length; n++) d[n].classList.remove("active");
        "false" === i && !1 === c && updateDoughnutInfotext(o, s, r)
    }
}), addMultipleDelegatedEventListeners(".datatable tbody tr", "click,mouseover,mouseout", (e, t) => {
    let a, n = "",
        s = "",
        r = t.parentNode.parentNode.dataset.range,
        o = t.dataset.connectId,
        l = t.dataset.url;
    if ("click" === e.type && t.classList.contains("domain")) renderDomainStats({
        contextEl: t,
        range: r,
        connectId: o,
        url: l
    });
    else {
        let d = document.querySelector("#doughnut-" + r + ' .group[wt\\:connect-id="' + o + '"]');
        if (d) {
            if ("mouseover" === e.type) {
                let e = document.querySelectorAll("#table-" + r + " tr.domain");
                if (e)
                    for (a = 0; a < e.length; a++) e[a].classList.remove("active");
                d.classList.add("active"), n = d.getAttribute("wt:name"), s = d.getAttribute("wt:percentage-string")
            }
            if ("mouseout" === e.type && d.classList.remove("active"), t.classList.contains("stats")) {
                let t = document.querySelector("#table-" + r + ' tr.domain[data-url="' + l + '"]');
                "mouseover" === e.type ? t.classList.add("active") : t.classList.remove("active")
            }
            updateDoughnutInfotext(r, n, s)
        }
    }
}), addMultipleDelegatedEventListeners(".chart-days .chart .days g.group", "mouseover,mouseout", (e, t) => {
    let a = t.closest(".chart-days").querySelector(".info .date"),
        n = t.closest(".chart-days").querySelector(".info .time"),
        s = t.getAttribute("wt:date"),
        r = t.getAttribute("wt:time");
    "mouseover" === e.type ? (a.innerHTML = s, n.innerHTML = tplHtmlTimeObjectFragment({
        value: r,
        resolution: RESOLUTION_HOURS
    })) : "mouseout" === e.type && (a.innerHTML = "&nbsp;", n.innerHTML = "&nbsp;")
}), addMultipleDelegatedEventListeners(".chart-daynames .chart .daynames g.group", "mouseover,mouseout", (e, t) => {
    let a = t.closest(".chart-daynames").querySelector(".info .percentage"),
        n = t.closest(".chart-daynames").querySelector(".info .time"),
        s = t.getAttribute("wt:percentage-string"),
        r = t.getAttribute("wt:time");
    "mouseover" === e.type ? (n.innerHTML = tplHtmlTimeObjectFragment({
        value: r,
        resolution: RESOLUTION_DAYS
    }), a.innerHTML = s) : "mouseout" === e.type && (n.innerHTML = "&nbsp;", a.innerHTML = "&nbsp;")
}), addMultipleDelegatedEventListeners(".chart-types a", "click", (e, t) => {
    e.preventDefault();
    let a = t.dataset.visibility;
    document.getElementById("wrapper").dataset.visibility = a
}), addMultipleDelegatedEventListeners("#pseudomodal .menu a", "click", (e, t) => {
    e.preventDefault();
    let a = t.getAttribute("id");
    if ("screenshot" !== a) document.querySelector("#pseudomodal").dataset.visibility = a;
    else if (SCREENSHOT_MODE) {
        document.querySelector("#pseudomodal").dataset.visibility = a;
        let e = htmlTemplates.querySelector("#screenshot-info-instructions-list"),
            t = document.importNode(e.content, !0);
        elementInsertIntoElement(document.querySelector("#pseudomodal .container.screenshot .list"), t)
    }
    if ("stats" === a) {
        let e = document.querySelector("#pseudomodal .container.stats .stats-wrapper");
        if ("1" !== e.dataset.statsReady) {
            dcl("Stats overall - render");
            let t = getAvailableElementWidth(e),
                a = getOverallData(),
                n = htmlTemplates.querySelector("#stats-overall");
            tplElementStatsOverall(a, n.content);
            let s = document.importNode(n.content, !0);
            if (elementInsertIntoElement(e.querySelector(".text"), s), a.days.visited > 0) {
                let n = htmlTemplates.querySelector("#stats-charts");
                tplElementStatsCharts(a, n.content);
                let s = document.importNode(n.content, !0);
                elementInsertIntoElement(e.querySelector(".charts"), s);
                let r = tplElementChartStatsDays({
                    chartWidth: t,
                    chartHeight: CHART_STATS_HEIGHT_DAYS,
                    stepHeightMin: CHART_STATS_STEP_HEIGHT_MIN,
                    timeValueMax: a.timeValues.max,
                    daysTotal: a.days.total,
                    days: a.dates.days
                });
                elementInsertIntoElement(e.querySelector(".chart-days .chart"), r);
                let o = tplElementChartStatsDaynames({
                    chartWidth: t,
                    chartHeight: CHART_STATS_HEIGHT_DAYNAMES,
                    stepHeightMin: CHART_STATS_STEP_HEIGHT_MIN,
                    daynames: a.dates.daynames
                });
                elementInsertIntoElement(e.querySelector(".chart-daynames .chart"), o)
            }
            e.dataset.statsReady = "1"
        }
    }
}), addMultipleDelegatedEventListeners("#pseudomodal #idle-time .slider", "input,change", (e, t) => {
    let a = t.value,
        n = getIdleTimeComputedFromRaw(a),
        s = getIdleTimeComputedString(n);
    document.querySelector("#pseudomodal #idle-time .display").innerHTML = s, "change" === e.type && (backgroundJS.setIdleTime(n), backgroundJS.saveIdleTime(), dcl("Idle time saved: " + n))
}), addMultipleDelegatedEventListeners("#pseudomodal #graph-gap .slider", "input,change", (e, t) => {
    let a = t.value,
        n = getSliderComputedFromRaw(GRAPH_GAP_TABLE, GRAPH_GAP_DEFAULT, a);
    document.querySelector("#pseudomodal #graph-gap .display").innerHTML = a, "change" === e.type && (backgroundJS.setGraphGap(n), backgroundJS.saveGraphGap(), renderUIRange(RANGE_TODAY, RESOLUTION_HOURS, !0, !1, !1), renderUIRange(RANGE_AVERAGE, RESOLUTION_DAYS, !0, !1, !1), renderUIRange(RANGE_ALLTIME, RESOLUTION_DAYS, !0, !1, !1), dcl("Graph gap saved: " + n))
}), addMultipleDelegatedEventListeners("#pseudomodal #badge-display .checkbox", "change", (e, t) => {
    let a = t.checked;
    "change" === e.type && (backgroundJS.setBadgeDisplay(a), backgroundJS.saveBadgeDisplay(), backgroundJS.updateDomains(!0), dcl("Badge display saved: " + a))
}), addMultipleDelegatedEventListeners("#pseudomodal .trigger", "click", (e, t) => {
    e.preventDefault(), t.parentNode.querySelector(".confirm").classList.add("visible")
}), addMultipleDelegatedEventListeners("#pseudomodal .confirm .cancel", "click", (e, t) => {
    e.preventDefault(), t.parentNode.classList.remove("visible")
}), addMultipleDelegatedEventListeners("#pseudomodal .options-clear-all", "click", (e, t) => {
    let a = t.querySelector(".text"),
        n = t.querySelector(".loading");
    e.preventDefault(), t.classList.contains("active") ? (t.classList.remove("active"), a.innerText = a.dataset.default, n.classList.remove("running"), backgroundJS.clearAllGeneratedData(), renderUI(), dcl("All data cleared")) : (t.classList.add("active"), a.innerText = a.dataset.active, n.classList.add("running", "warning"), n.querySelector(".shifter").style.animationDuration = INTERVAL_UI_LOADING + "ms", setTimeout(() => {
        t.classList.remove("active"), a.innerText = a.dataset.default, n.classList.remove("running")
    }, INTERVAL_UI_LOADING))
}), addMultipleDelegatedEventListeners("#pseudomodal .options-reset-settings", "click", (e, t) => {
    let a = t.querySelector(".text"),
        n = t.querySelector(".loading");
    e.preventDefault(), t.classList.contains("active") ? (t.classList.remove("active"), a.innerText = a.dataset.default, n.classList.remove("running"), backgroundJS.settings.idleTime = IDLE_TIME_DEFAULT, backgroundJS.saveIdleTime(), backgroundJS.settings.graphGap = GRAPH_GAP_DEFAULT, backgroundJS.saveGraphGap(), backgroundJS.settings.badgeDisplay = BADGE_DISPLAY_DEFAULT, backgroundJS.saveBadgeDisplay(), backgroundJS.updateDomains(!0), renderUI(), dcl("Settings reset")) : (t.classList.add("active"), a.innerText = a.dataset.active, n.classList.add("running", "warning"), n.querySelector(".shifter").style.animationDuration = INTERVAL_UI_LOADING + "ms", setTimeout(() => {
        t.classList.remove("active"), a.innerText = a.dataset.default, n.classList.remove("running")
    }, INTERVAL_UI_LOADING))
}), addMultipleDelegatedEventListeners("#pseudomodal .options-export-csv", "click", (e, t) => {
    e.preventDefault();
    let a = convertArrayToCsv(backgroundJS.domains, backgroundJS.dates.start, backgroundJS.dates.today);
    initiateDownload([a], "octet/stream", "webtime-tracker-" + backgroundJS.dates.today + ".csv")
}), addMultipleDelegatedEventListeners("#pseudomodal .options-backup", "click", (e, t) => {
    let a, n, s = {
        domains: backgroundJS.domains,
        dates: {
            start: backgroundJS.dates.start
        },
        seconds: {
            alltime: backgroundJS.seconds.alltime
        },
        settings: backgroundJS.settings
    },
        r = JSON.stringify(s);
    e.preventDefault(), sha256(r).then(e => {
        a = {
            content: s,
            hash: {
                sha256: e
            }
        }, n = JSON.stringify(a), initiateDownload([n], "octet/stream", "time-keep-backup-" + backgroundJS.dates.today + ".json")
    })
}), addMultipleDelegatedEventListeners("#pseudomodal .options-restore", "click", (e, t) => {
    let a = t.querySelector('input[type="file"]');
    a.value = null, a.click()
}), addMultipleDelegatedEventListeners("#screenshot", "click", (e, t) => {
    if (!SCREENSHOT_MODE) {
        let e = window.location.href + SCREENSHOT_MODE_QUERY,
            t = window.innerWidth;
        t -= window.innerHeight <= document.body.scrollHeight ? SCROLLBAR_WIDTH : 0;
        let a = window.innerHeight,
            n = Math.round(screen.availWidth / 2 - t / 2);
        dcl(screen.availWidth);
        let s = 40;
        window.open(e, "_blank", "width=" + t + ",height=" + a + ",left=" + n + ",top=" + s + ",resizable=yes,location=no,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no")
    }
}), addMultipleDelegatedEventListeners('#pseudomodal .options-restore input[type="file"]', "change", (e, t) => {
    let a, n = e.target.files[0],
        s = new FileReader;
    s.onload = e => {
        a = e.target.result, restoreFromJson(a)
    }, s.readAsText(n)
}), addMultipleDelegatedEventListeners(".screenshot-info .ok", "click", (e, t) => {
    document.querySelector(".screenshot-overlay").style.display = "none", document.querySelector(".screenshot-info").style.display = "none"
}), addMultipleDelegatedEventListeners(".screenshot-info .permission-grant", "click", (e, t) => {
    chrome.permissions.request({
        origins: ["<all_urls>"]
    }, e => {
        chrome.runtime.lastError && chrome.runtime.lastError.message && dcl("Screenshot - permission.request: " + chrome.runtime.lastError.message), screenshotUIShow()
    })
}), addMultipleDelegatedEventListeners(".screenshot-capture .capture", "click", (e, t) => {
    e.preventDefault(), console.log("Screenshot - start"), document.querySelector(".screenshot-capture").style.display = "none", setTimeout(() => {
        chrome.tabs.captureVisibleTab(null, {
            format: "png"
        }, e => {
            if (chrome.runtime.lastError && chrome.runtime.lastError.message) dcl("Screenshot - error: " + chrome.runtime.lastError.message);
            else {
                let t = e.split(",")[0].split(":")[1].split(";")[0],
                    a = window.atob(e.split(",")[1]),
                    n = new Uint8Array(a.length);
                for (let e = 0; e < a.length; e++) n[e] = a.charCodeAt(e);
                let s = (new Date).toISOString().replace(/[T:]/g, "-").split(".")[0];
                initiateDownload([n], t, "webtime-tracker-screenshot-" + s + ".png"), screenshotUICaptureShow()
            }
        })
    }, SCREENSHOT_WAIT)
});
const restoreFromJson = e => {
    let t = document.querySelector("#pseudomodal .options-restore"),
        a = t.querySelector(".text"),
        n = t.querySelector(".loading");
    const s = () => {
        a.innerText = a.dataset.warning, n.classList.add("blinking", "warning"), n.querySelector(".shifter").style.animationDuration = UI_LOADING_BLINKING_INTERVAL + "ms", n.querySelector(".shifter").style.animationIterationCount = UI_LOADING_BLINKING_COUNT, setTimeout(() => {
            a.innerText = a.dataset.default, n.classList.remove("blinking")
        }, UI_LOADING_BLINKING_INTERVAL * UI_LOADING_BLINKING_COUNT)
    };
    let r, o;
    try {
        o = JSON.parse(e), r = JSON.stringify(o.content)
    } catch (e) {
        s()
    }
    sha256(r).then(e => {
        o.hash.sha256 === e || SKIP_RESTORE_HASH_CHECK ? (o.hash.sha256 !== e && dcl("Restore - hashes mismatch!"), backgroundJS.domains = o.content.domains, backgroundJS.dates.start = o.content.dates.start, backgroundJS.seconds.today = getTotalSecondsForDate(o.content.domains, getDateString()), backgroundJS.seconds.alltime = o.content.seconds.alltime, backgroundJS.settings = o.content.settings, backgroundJS.saveDomains(), backgroundJS.saveDateStart(), backgroundJS.saveSecondsAlltime(), backgroundJS.saveIdleTime(), backgroundJS.saveGraphGap(), renderUI(), a.innerText = a.dataset.restored, n.classList.add("blinking", "success"), n.querySelector(".shifter").style.animationDuration = UI_LOADING_BLINKING_INTERVAL + "ms", n.querySelector(".shifter").style.animationIterationCount = UI_LOADING_BLINKING_COUNT, setTimeout(() => {
            a.innerText = a.dataset.default, n.classList.remove("blinking")
        }, UI_LOADING_BLINKING_INTERVAL * UI_LOADING_BLINKING_COUNT), dcl("Restore - done!")) : (s(), dcl("Restore - data corrupted"))
    })
},
    renderDomainStats = e => {
        let t;
        if ("1" !== e.contextEl.dataset.statsReady) {
            dcl(`Rendering stats for: ${e.url}`);
            let a = getDomainData(e.url);
            a = Object.assign(a, e), a.color = e.contextEl.querySelector(".label span").style.color;
            let n = htmlTemplates.querySelector("#stats-domain");
            tplElementStatsDomain(a, n.content);
            let s = document.importNode(n.content, !0);
            elementInsertAfterElement(e.contextEl, s), t = document.querySelector("#table-" + e.range + ' tr.stats[data-url="' + e.url + '"]');
            let r = htmlTemplates.querySelector("#stats-charts");
            tplElementStatsCharts(a, r.content);
            let o = document.importNode(r.content, !0);
            elementAppendToElement(t.querySelector(".content"), o);
            let l = getAvailableElementWidth(t.querySelector(".content")),
                d = tplElementChartStatsDays({
                    chartWidth: l,
                    chartHeight: CHART_STATS_HEIGHT_DAYS,
                    stepHeightMin: CHART_STATS_STEP_HEIGHT_MIN,
                    timeValueMax: a.timeValues.max,
                    daysTotal: a.days.total,
                    days: a.dates.days
                });
            elementInsertIntoElement(t.querySelector(".chart-days .chart"), d);
            let i = tplElementChartStatsDaynames({
                chartWidth: l,
                chartHeight: CHART_STATS_HEIGHT_DAYNAMES,
                stepHeightMin: CHART_STATS_STEP_HEIGHT_MIN,
                daynames: a.dates.daynames
            });
            elementInsertIntoElement(t.querySelector(".chart-daynames .chart"), i), e.contextEl.dataset.statsReady = "1"
        }
        "1" === e.contextEl.dataset.statsVisible ? (document.querySelector("#table-" + e.range + ' tr.stats[data-url="' + e.url + '"]').style.display = "none", e.contextEl.dataset.statsVisible = "0") : (document.querySelector("#table-" + e.range + ' tr.stats[data-url="' + e.url + '"]').style.display = "table-row", e.contextEl.dataset.statsVisible = "1")
    },
    getDomainData = e => {
        let t, a, n, s, r, o, l, d = Number.MAX_SAFE_INTEGER,
            i = Number.MIN_SAFE_INTEGER,
            c = backgroundJS.dates.start,
            u = backgroundJS.dates.start,
            m = backgroundJS.dates.today,
            g = backgroundJS.dates.start,
            p = [],
            S = 0,
            y = backgroundJS.domains[e],
            h = getDateDiffDays(backgroundJS.dates.today, backgroundJS.dates.start) + 1;
        for (o = getDatesSparse(backgroundJS.dates.start, h - 1), l = [0, 0, 0, 0, 0, 0, 0], t = 0; t < o.length; t++) s = o[t], r = 0, y.days.hasOwnProperty(o[t]) && (S++, r = y.days[s].seconds, c = r < d ? s : c, u = r > i ? s : u, d = r < d ? r : d, i = r > i ? r : i, m = s < m ? s : m, g = s > g ? s : g), n = (new Date(s).getDay() + 6) % 7, l[n] += r, p.push({
            date: s,
            seconds: r
        });
        return a = {
            days: {
                total: h,
                domain: S
            },
            timeValues: {
                min: d,
                max: i
            },
            visits: {
                first: m,
                last: g
            },
            ranks: {
                [RANGE_TODAY]: {
                    position: ranks[RANGE_TODAY].domains[e] || "-",
                    total: ranks[RANGE_TODAY].total
                },
                [RANGE_ALLTIME]: {
                    position: ranks[RANGE_ALLTIME].domains[e],
                    total: ranks[RANGE_ALLTIME].total
                }
            },
            times: {
                [RANGE_TODAY]: y.days[backgroundJS.dates.today] && y.days[backgroundJS.dates.today].seconds || 0,
                [RANGE_AVERAGE]: parseInt(y.alltime.seconds / h),
                [RANGE_AVERAGE + "-pure"]: parseInt(y.alltime.seconds / S),
                [RANGE_ALLTIME]: y.alltime.seconds
            },
            dates: {
                start: backgroundJS.dates.start,
                today: backgroundJS.dates.today,
                timeMin: c,
                timeMax: u,
                days: p,
                daynames: l
            }
        }, a
    },
    getOverallData = () => {
        let e, t, a, n, s, r, o, l, d, i, c = Number.MAX_SAFE_INTEGER,
            u = Number.MIN_SAFE_INTEGER,
            m = backgroundJS.dates.start,
            g = backgroundJS.dates.start,
            p = backgroundJS.dates.today,
            S = backgroundJS.dates.start,
            y = [],
            h = 0,
            E = getDateDiffDays(backgroundJS.dates.today, backgroundJS.dates.start) + 1;
        for (o in d = getDatesSparse(backgroundJS.dates.start, E - 1), i = [0, 0, 0, 0, 0, 0, 0], s = {}, backgroundJS.domains)
            if (backgroundJS.domains.hasOwnProperty(o))
                for (n in l = backgroundJS.domains[o].days, l) l.hasOwnProperty(n) && (s[n] = s[n] || {
                    seconds: 0
                }, s[n].seconds += l[n].seconds);
        for (e = 0; e < d.length; e++) n = d[e], r = 0, s.hasOwnProperty(d[e]) && (r = s[n].seconds, m = r < c ? n : m, g = r > u ? n : g, c = r < c ? r : c, u = r > u ? r : u, p = n < p ? n : p, S = n > S ? n : S), a = (new Date(n).getDay() + 6) % 7, i[a] += r, r > 0 && h++, y.push({
            date: n,
            seconds: r
        });
        return t = {
            days: {
                total: E,
                visited: h
            },
            timeValues: {
                min: c === Number.MAX_SAFE_INTEGER ? 0 : c,
                max: u === Number.MIN_SAFE_INTEGER ? 0 : u
            },
            visits: {
                first: p,
                last: S
            },
            times: {
                [RANGE_TODAY]: backgroundJS.seconds.today,
                [RANGE_AVERAGE]: parseInt(backgroundJS.seconds.alltime / E),
                [RANGE_AVERAGE + "-pure"]: h > 0 ? parseInt(backgroundJS.seconds.alltime / h) : 0,
                [RANGE_ALLTIME]: backgroundJS.seconds.alltime
            },
            dates: {
                start: backgroundJS.dates.start,
                today: backgroundJS.dates.today,
                timeMin: m,
                timeMax: g,
                days: y,
                daynames: i
            }
        }, t
    };