let dclCounter = 0;
const dcl = e => {
    dclCounter++, DEVELOPMENT_MODE && console.log(e)
},
    parseDomainFromUrl = e => {
        let t, n;
        return n = document.createElement("a"), n.href = e, t = n.hostname, t
    },
    parseProtocolFromUrl = e => {
        let t, n;
        return n = document.createElement("a"), n.href = e, t = n.protocol, t
    },
    getDomainObj = () => ({
        name: "",
        alltime: {
            seconds: 0
        },
        days: {}
    }),
    getDayObj = () => ({
        seconds: 0
    }),
    getTimeObj = () => ({
        day: {
            tens: 0,
            units: 0,
            implicitlyActive: !1,
            unit: TIME_UNIT_DAY
        },
        hour: {
            tens: 0,
            units: 0,
            implicitlyActive: !1,
            unit: TIME_UNIT_HOUR
        },
        minute: {
            tens: 0,
            units: 0,
            implicitlyActive: !1,
            unit: TIME_UNIT_MINUTE
        },
        second: {
            tens: 0,
            units: 0,
            implicitlyActive: !1,
            unit: TIME_UNIT_SECOND
        }
    }),
    getDateString = e => {
        let t, n, r, o, l;
        return n = e ? new Date(e) : new Date, r = n.getFullYear(), o = n.getMonth() + 1, o = o < 10 ? "0" + o : o, l = n.getDate(), l = l < 10 ? "0" + l : l, t = r + "-" + o + "-" + l, t
    },
    getClosestMatchingAncestor = (e, t) => {
        do {
            if (e.matches(t)) return e;
            e = e.parentNode
        } while (e.parentNode)
    },
    addDelegateEventListener = (e, t, n) => {
        let r;
        document.addEventListener(t, t => {
            t.stopPropagation(), r = getClosestMatchingAncestor(t.target, e), r && n(t, r)
        })
    },
    addMultipleDelegatedEventListeners = (e, t, n) => {
        let r, o = t.split(",");
        for (r = 0; r < o.length; r++) addDelegateEventListener(e, o[r].trim(), n)
    },
    addMultiEventListener = (e, t, n, r) => {
        let o, l = t.split(",");
        for (o = 0; o < l.length; o++) e.addEventListener(l[o], e => {
            n(e, this)
        }, r)
    },
    getHSL = (e, t) => {
        let n, r, o, l;
        return r = e * (300 / (t = t || 1)), o = 100, l = 50, n = "hsl(" + r + ", 100%, 50%)", n
    },
    getDateDiffDays = (e, t) => {
        let n, r, o;
        return r = new Date(e), o = new Date(t), n = parseInt(r.getTime() - o.getTime()) / 864e5, n = Math.abs(n), n
    },
    getTotalSecondsForDate = (e, t) => {
        let n = 0;
        for (let r in e) e.hasOwnProperty(r) && e[r].days[t] && (n += e[r].days[t].seconds);
        return n
    },
    getPercentageString = (e, t) => {
        let n = parseInt(100 * e).toString(),
            r = n.substr(0, n.length - 2) || 0,
            o = n.substr(-2);
        return o < 10 && (o = "0" + parseInt(o)), t && r < 10 && (r = "0" + parseInt(r)), r + "." + o + " %"
    },
    getBadgeTimeString = e => {
        let t = "";
        return t = e < 60 ? e + "s" : e < 59999 ? parseInt(e / 60) + "m" : parseInt(e / 60 / 60) + " h", t
    },
    getIdleTimeComputedString = e => {
        let t;
        return t = e <= 90 ? e + " seconds" : parseInt(e / 60) + " minutes", t
    },
    getIdleTimeComputedFromRaw = e => {
        let t = IDLE_TIME_TABLE[e];
        return void 0 === t && (t = IDLE_TIME_DEFAULT, console.error("Undefined raw value: " + e)), t
    },
    getIdleTimeRawFromComputed = e => {
        let t = IDLE_TIME_TABLE.indexOf(e);
        return -1 === t && (t = IDLE_TIME_TABLE.indexOf(IDLE_TIME_DEFAULT), console.error("Computed value with no match: " + e)), t
    },
    getSliderComputedFromRaw = (e, t, n) => {
        let r = e[n];
        return void 0 === r && (r = t, console.error("Undefined raw value: " + n)), r
    },
    getSliderRawFromComputed = (e, t, n) => {
        let r = e.indexOf(n);
        return -1 === r && (r = e.indexOf(t), console.error("Computed value with no match: " + n)), r
    },
    getDatesSparse = (e, t) => {
        let n, r = [],
            o = new Date(e);
        for (r.push(e), n = 0; n < t; n++) o.setDate(o.getDate() + 1), r.push(getDateString(o));
        return r
    },
    convertArrayToCsv = (e, t, n) => {
        let r, o, l, a, i, d = "",
            s = [];
        for (r = getDateDiffDays(t, n), s = getDatesSparse(t, r), o = Object.keys(e).sort(), d = "Domain," + s.join(",") + "\n", l = 0; l < o.length; l++) {
            for (d += o[l], a = 0; a < s.length; a++) i = e[o[l]].days[s[a]], d += "," + (i ? i.seconds : 0);
            d += "\n"
        }
        return d
    },
    initiateDownload = (e, t, n) => {
        let r = new Blob(e, {
            type: t
        }),
            o = window.URL.createObjectURL(r),
            l = document.createElement("a");
        var a;
        l.href = o, l.download = n, l.style.display = "none", document.body.appendChild(l), l.click(), a = "Download initiated.", dclCounter++, DEVELOPMENT_MODE && console.log(a)
    },
    hex = e => {
        let t = [],
            n = new DataView(e);
        for (let e = 0; e < n.byteLength; e += 4) {
            let r = "00000000",
                o = (r + n.getUint32(e).toString(16)).slice(-r.length);
            t.push(o)
        }
        return t.join("")
    },
    sha256 = e => {
        let t = new TextEncoder("utf-8").encode(e);
        return crypto.subtle.digest("SHA-256", t).then(e => hex(e))
    },
    getAvailableElementWidth = e => {
        let t = 0;
        return t += parseInt(window.getComputedStyle(e).getPropertyValue("width")), t -= parseInt(window.getComputedStyle(e).getPropertyValue("padding-left")), t -= parseInt(window.getComputedStyle(e).getPropertyValue("padding-right")), t -= parseInt(window.getComputedStyle(e).getPropertyValue("border-left-width")), t -= parseInt(window.getComputedStyle(e).getPropertyValue("border-right-width")), t
    };