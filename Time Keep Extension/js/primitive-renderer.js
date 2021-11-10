const htmlRenderInto = (t, e) => {
    document.getElementById(t).innerHTML = e
},
    elementInsertInto = (t, e) => {
        let s = document.getElementById(t);
        s.innerHTML = "", s.appendChild(e)
    },
    elementInsertIntoElement = (t, e) => {
        t.innerHTML = "", t.appendChild(e)
    },
    elementAppendToElement = (t, e) => {
        t.appendChild(e)
    },
    elementInsertAfterElement = (t, e) => {
        t.parentNode.insertBefore(e, t.nextSibling)
    },
    tplHtmlTable = t => {
        let e, s, r, a, n, i = [];
        for (i.push("<thead>"), i.push("<tr>"), i.push('    <td colspan="4">'), t.range === RANGE_TODAY ? i.push("        Today data ") : t.range === RANGE_AVERAGE ? i.push("        Daily averages since " + t.dateStart + " (" + t.daysSinceStart + " day" + (t.daysSinceStart > 1 ? "s" : "") + ")") : t.range === RANGE_ALLTIME && i.push("        Aggregate data since " + t.dateStart + " (" + t.daysSinceStart + " day" + (t.daysSinceStart > 1 ? "s" : "") + ")"), i.push("    </td>"), i.push("</tr>"), i.push("</thead>"), i.push("<tbody>"), e = 0; e < t.domains.length; e++) s = t.domains[e], r = helperGetTimeObj(s.time, t.resolution), a = s.graphed ? s.name : "other", n = s.graphed ? s.color : GRAPH_COLOR_OTHER, i.push('    <tr class="domain" data-connect-id="' + a + '" data-url="' + s.name + '" data-percentage-string="' + s.percentageString + '">'), i.push('        <td class="label">'), i.push('            <span style="color: ' + n + ';">&#x2b24;</span>'), i.push("        </td>"), i.push('        <td class="name">'), i.push("            " + s.name), i.push("        </td>"), i.push('        <td class="percentage">'), i.push("            " + s.percentageString), i.push("        </td>"), i.push('        <td class="time">'), "h" !== t.resolution && i.push('            <span class="time-day">' + tplHtmlTableTimeFragment(r.day) + "</span>"), i.push('            <span class="time-hour">' + tplHtmlTableTimeFragment(r.hour) + "</span>"), i.push('            <span class="time-minute">' + tplHtmlTableTimeFragment(r.minute) + "</span>"), i.push('            <span class="time-second">' + tplHtmlTableTimeFragment(r.second) + "</span>"), i.push("        </td>"), i.push("    </tr>");
        return i.push("</tbody>"), i.push("<tfoot>"), t.domains.length > 0 ? (r = helperGetTimeObj(t.total.time, t.resolution), i.push('    <tr class="padder">'), i.push('        <td colspan="4">'), i.push("        </td>"), i.push("    </tr>"), i.push('    <tr class="domain">'), i.push('        <td class="label">'), i.push("        </td>"), i.push('        <td class="name">'), i.push("            Total"), i.push("        </td>"), i.push('        <td class="percentage">'), i.push("            100.00 %"), i.push("        </td>"), i.push('        <td class="time">'), "h" !== t.resolution && i.push('            <span class="time-day">' + tplHtmlTableTimeFragment(r.day) + "</span>"), i.push('            <span class="time-hour">' + tplHtmlTableTimeFragment(r.hour) + "</span>"), i.push('            <span class="time-minute">' + tplHtmlTableTimeFragment(r.minute) + "</span>"), i.push('            <span class="time-second">' + tplHtmlTableTimeFragment(r.second) + "</span>"), i.push("        </td>"), i.push("    </tr>")) : (i.push('    <tr class="nodata">'), i.push('        <td colspan="4">'), i.push("            No data collected for this period yet."), i.push("        </td>"), i.push("    </tr>")), i.push("</tfoot>"), i.join("")
    },
    tplHtmlTableTimeFragment = t => {
        let e = [];
        return e.push('<span class="digit-tens ' + (t.implicitlyActive || t.tens > 0 ? "active" : "") + '">'), e.push("" + t.tens), e.push("</span>"), e.push('<span class="digit-units ' + (t.implicitlyActive || t.tens > 0 || t.units > 0 ? "active" : "") + '">'), e.push("" + t.units), e.push(t.unit), e.push("</span>"), e.join("")
    },
    tplHtmlTimeObjectFragment = t => {
        let e = [],
            s = helperGetTimeObj(t.value, t.resolution);
        return "h" !== t.resolution && e.push('<span class="time-day">' + tplHtmlTableTimeFragment(s.day) + "</span>"), e.push('<span class="time-hour">' + tplHtmlTableTimeFragment(s.hour) + "</span>"), e.push('<span class="time-minute">' + tplHtmlTableTimeFragment(s.minute) + "</span>"), e.push('<span class="time-second">' + tplHtmlTableTimeFragment(s.second) + "</span>"), e.join("")
    },
    tplHtmlIdleTimeControl = t => {
        let e = [];
        return e.push('<input tabindex="-1" class="slider" type="range" min="' + t.min + '" max="' + t.max + '" value="' + t.raw + '"/>'), e.push("<br/>"), e.push('Stop tracking if no <span title="Mouse or keyboard">activity</span> detected for <span class="display">' + t.computed + "</span>"), e.join("")
    },
    tplHtmlGraphGapControl = t => {
        let e = [];
        return e.push('<input tabindex="-1" class="slider" type="range" min="' + t.min + '" max="' + t.max + '" value="' + t.raw + '"/>'), e.push("<br/>"), e.push('Gap between graph parts: <span class="display">' + t.raw + "</span>"), e.join("")
    },
    tplHtmlBadgeDisplayControl = t => {
        let e = [];
        return e.push("<label>"), e.push('<input tabindex="-1" class="checkbox" type="checkbox" ' + (t.checked ? "checked" : "") + " />"), e.push("Display time tracker in icon"), e.push("</label>"), e.join("")
    },
    tplElementStatsDomain = (t, e) => {
        let s = e.querySelector("tr.stats");
        s.querySelector("td").classList.add("stats"), s.classList.add("stats"), s.dataset.connectId = t.connectId, s.dataset.url = t.url, e.querySelector("tr.stats td.label").querySelector(".border").style.background = t.color;
        let r = e.querySelector("tr.stats td.content");
        return r.querySelector(".url").setAttribute("href", "http://" + t.url), r.querySelector(".url").textContent = t.url, r.querySelector(".rank-" + RANGE_TODAY + "-position").textContent = t.ranks[RANGE_TODAY].position, r.querySelector(".rank-" + RANGE_TODAY + "-total").textContent = t.ranks[RANGE_TODAY].total, r.querySelector(".rank-" + RANGE_ALLTIME + "-position").textContent = t.ranks[RANGE_ALLTIME].position, r.querySelector(".rank-" + RANGE_ALLTIME + "-total").textContent = t.ranks[RANGE_ALLTIME].total, e.querySelector(".time-min-date").textContent = t.dates.timeMin, e.querySelector(".time-max-date").textContent = t.dates.timeMax, e.querySelector(".time-min").innerHTML = tplHtmlTimeObjectFragment({
            value: t.timeValues.min,
            resolution: RESOLUTION_HOURS
        }), e.querySelector(".time-max").innerHTML = tplHtmlTimeObjectFragment({
            value: t.timeValues.max,
            resolution: RESOLUTION_HOURS
        }), r.querySelector(".days-domain").textContent = t.days.domain, r.querySelector(".days-total").textContent = t.days.total, r.querySelector(".visits-first").textContent = t.visits.first, r.querySelector(".visits-last").textContent = t.visits.last, r.querySelector(".time-" + RANGE_TODAY).innerHTML = tplHtmlTimeObjectFragment({
            value: t.times[RANGE_TODAY],
            resolution: RESOLUTION_HOURS
        }), r.querySelector(".time-" + RANGE_AVERAGE).innerHTML = tplHtmlTimeObjectFragment({
            value: t.times[RANGE_AVERAGE],
            resolution: RESOLUTION_HOURS
        }), r.querySelector(".time-" + RANGE_AVERAGE + "-pure").innerHTML = tplHtmlTimeObjectFragment({
            value: t.times[RANGE_AVERAGE + "-pure"],
            resolution: RESOLUTION_HOURS
        }), r.querySelector(".time-" + RANGE_ALLTIME).innerHTML = tplHtmlTimeObjectFragment({
            value: t.times[RANGE_ALLTIME],
            resolution: RESOLUTION_DAYS
        }), e
    },
    tplElementStatsOverall = (t, e) => (e.querySelector(".days-visited").textContent = t.days.visited, e.querySelector(".days-total").textContent = t.days.total, e.querySelector(".visits-first").textContent = t.visits.first, e.querySelector(".visits-last").textContent = t.visits.last, e.querySelector(".time-min-date").textContent = t.dates.timeMin, e.querySelector(".time-max-date").textContent = t.dates.timeMax, e.querySelector(".time-min").innerHTML = tplHtmlTimeObjectFragment({
        value: t.timeValues.min,
        resolution: RESOLUTION_HOURS
    }), e.querySelector(".time-max").innerHTML = tplHtmlTimeObjectFragment({
        value: t.timeValues.max,
        resolution: RESOLUTION_HOURS
    }), e.querySelector(".time-" + RANGE_TODAY).innerHTML = tplHtmlTimeObjectFragment({
        value: t.times[RANGE_TODAY],
        resolution: RESOLUTION_HOURS
    }), e.querySelector(".time-" + RANGE_AVERAGE).innerHTML = tplHtmlTimeObjectFragment({
        value: t.times[RANGE_AVERAGE],
        resolution: RESOLUTION_HOURS
    }), e.querySelector(".time-" + RANGE_AVERAGE + "-pure").innerHTML = tplHtmlTimeObjectFragment({
        value: t.times[RANGE_AVERAGE + "-pure"],
        resolution: RESOLUTION_HOURS
    }), e.querySelector(".time-" + RANGE_ALLTIME).innerHTML = tplHtmlTimeObjectFragment({
        value: t.times[RANGE_ALLTIME],
        resolution: RESOLUTION_DAYS
    }), e),
    tplElementStatsCharts = (t, e) => {
        let s = e.querySelector(".chart-days");
        return s.querySelector(".info .left strong").textContent = t.dates.start, s.querySelector(".info .right strong").textContent = t.dates.today, e
    },
    tplElementDoughnut = (t, e) => {
        let s, r, a, n, i, l, u = GRAPH_SIZE,
            p = u / 2 * .6,
            c = 2 * p * .9,
            o = 2 * p * .5,
            m = u / 2 - c / 2,
            d = u / 2 - o / 2,
            h = 0,
            g = {
                name: "other",
                percentage: 0,
                color: GRAPH_COLOR_OTHER
            },
            A = !0,
            b = "http://www.w3.org/2000/svg",
            S = document.createElementNS(b, "svg:svg");
        for (S.setAttribute("xmlns:wt", "http://www.example.com/webtime-tracker"), S.setAttribute("class", "doughnut"), S.setAttribute("wt:range", t.range), S.setAttribute("width", u), S.setAttribute("height", u), S.setAttribute("viewBox", "0 0 " + u + " " + u), S.setAttribute("shape-rendering", "geometricPrecision"), S.style.background = "#ffffff", l = 0; l < t.domains.length; l++) A = !1, s = t.domains[l], s.graphed ? (tplElementDoughnutWedgeFragment(s, {
            percentageStart: h,
            noData: A,
            graphGap: e,
            graphSize: u,
            doughnut: S
        }), h += s.percentage) : g.percentage += s.percentage;
        return g.percentage > 0 && (g.percentageString = getPercentageString(g.percentage), tplElementDoughnutWedgeFragment(g, {
            percentageStart: h,
            noData: A,
            graphGap: e,
            graphSize: u,
            doughnut: S
        })), A && (g.name = "", g.percentage = 100, g.percentageString = "No data available", tplElementDoughnutWedgeFragment(g, {
            percentageStart: h,
            noData: A,
            graphGap: e,
            graphSize: u,
            doughnut: S
        })), r = document.createElementNS(b, "circle"), r.setAttribute("cx", u / 2), r.setAttribute("cy", u / 2), r.setAttribute("r", p), r.setAttribute("fill", "#ffffff"), S.appendChild(r), a = document.createElementNS(b, "foreignObject"), a.setAttribute("x", m), a.setAttribute("y", d), a.setAttribute("width", c), a.setAttribute("height", o), a.setAttribute("class", "foreign-object"), n = document.createElement("body"), i = document.createElement("div"), i.setAttribute("class", "percentage"), A && (i.innerHTML = "No data available"), n.appendChild(i), i = document.createElement("div"), i.setAttribute("class", "name"), n.appendChild(i), a.appendChild(n), S.appendChild(a), S
    },
    tplElementDoughnutWedgeFragment = (t, e) => {
        let s, r, a, n, i, l, u, p, c, o, m, d, h, g, A, b = "http://www.w3.org/2000/svg",
            S = 2 * Math.PI / 100,
            y = e.graphSize / 2,
            E = e.graphSize / 2,
            T = e.graphSize / 2 - 4,
            O = e.graphSize / 2 - 2,
            R = e.graphSize / 2,
            H = e.graphSize / 2 - 2,
            N = 100 === t.percentage ? 0 : e.graphGap;
        if (i = S * e.percentageStart, l = S * (e.percentageStart + t.percentage - N), a = document.createElementNS(b, "circle"), e.noData) s = document.createElementNS(b, "circle"), s.setAttribute("cx", y), s.setAttribute("cy", E), s.setAttribute("r", R), r = document.createElementNS(b, "circle");
        else if (0 === i && 100 === t.percentage) s = document.createElementNS(b, "circle"), s.setAttribute("cx", y), s.setAttribute("cy", E), s.setAttribute("r", T), r = document.createElementNS(b, "circle"), r.setAttribute("cx", y), r.setAttribute("cy", E), r.setAttribute("r", R), a.setAttribute("cx", y), a.setAttribute("cy", E), a.setAttribute("r", H);
        else {
            s = document.createElementNS(b, "path"), p = y + T * Math.sin(i), d = E - T * Math.cos(i), c = y + T * Math.sin(l), h = E - T * Math.cos(l);
            let t = 0;
            l - i > Math.PI && (t = 1), A = "M " + y + "," + E, A += " L " + p + "," + d, A += " A " + T + "," + T, A += " 0 " + t + " 1 ", A += c + "," + h, A += " Z", s.setAttribute("d", A), r = document.createElementNS(b, "path"), u = y + O * Math.sin(i), m = E - O * Math.cos(i), p = y + R * Math.sin(i), d = E - R * Math.cos(i), c = y + R * Math.sin(l), h = E - R * Math.cos(l), o = y + O * Math.sin(l), g = E - O * Math.cos(l), t = 0, l - i > Math.PI && (t = 1), A = "M " + u + "," + m, A += " L " + p + "," + d, A += " A " + R + "," + R, A += " 0 " + t + " 1 ", A += c + "," + h, A += " L " + o + "," + g, A += " A " + O + "," + O, A += " 0 " + t + " 0 ", A += u + "," + m, A += " Z", r.setAttribute("d", A)
        }
        s.setAttribute("class", "wedge"), s.setAttribute("fill", t.color), r.setAttribute("class", "edge"), r.setAttribute("fill", t.color), a.setAttribute("class", "white"), a.setAttribute("fill", "#ffffff"), n = document.createElementNS(b, "g"), n.setAttribute("class", "group"), n.setAttribute("wt:connect-id", t.name), n.setAttribute("wt:name", t.name), n.setAttribute("wt:url", t.name), n.setAttribute("wt:percentage-string", t.percentageString), n.setAttribute("wt:no-data", e.noData), n.appendChild(r), n.appendChild(a), n.appendChild(s), e.doughnut.appendChild(n)
    },
    tplElementChartStatsDays = t => {
        let e, s, r, a, n, i = t.chartWidth,
            l = t.chartHeight,
            u = t.days;
        for (e = 0; e < u.length; e++) u[e].height = u[e].seconds / t.timeValueMax * l;
        let p = "http://www.w3.org/2000/svg",
            c = document.createElementNS(p, "svg:svg");
        c.setAttribute("xmlns:wt", "http://www.example.com/webtime-tracker"), c.setAttribute("class", "chart-stats days"), c.setAttribute("width", i), c.setAttribute("height", l), c.setAttribute("viewBox", "0 0 " + i + " " + l), c.setAttribute("shape-rendering", "geometricPrecision");
        let o = i / t.daysTotal;
        for (e = 0; e < u.length; e++) s = Math.max(t.stepHeightMin, u[e].height), r = document.createElementNS(p, "rect"), r.setAttribute("class", "rect active"), r.setAttribute("stroke-width", 0), r.setAttribute("x", e * o), r.setAttribute("y", l - s), r.setAttribute("width", o), r.setAttribute("height", s), a = document.createElementNS(p, "rect"), a.setAttribute("class", "rect inactive"), a.setAttribute("stroke-width", 0), a.setAttribute("x", e * o), a.setAttribute("y", 0), a.setAttribute("width", o), a.setAttribute("height", l - s), n = document.createElementNS(p, "g"), n.setAttribute("class", "group"), n.appendChild(r), n.appendChild(a), n.setAttribute("wt:date", u[e].date), n.setAttribute("wt:time", u[e].seconds), c.appendChild(n);
        return c
    },
    tplElementChartStatsDaynames = t => {
        let e, s, r, a, n, i = t.chartWidth,
            l = t.chartHeight - 20,
            u = Math.max(...t.daynames),
            p = t.daynames.reduce((t, e) => t + e),
            c = [];
        for (e = 0; e < t.daynames.length; e++) c[e] = {
            seconds: t.daynames[e],
            height: t.daynames[e] / u * l
        };
        let o = "http://www.w3.org/2000/svg",
            m = document.createElementNS(o, "svg:svg");
        m.setAttribute("xmlns:wt", "http://www.example.com/webtime-tracker"), m.setAttribute("class", "chart-stats daynames"), m.setAttribute("width", i), m.setAttribute("height", l), m.setAttribute("viewBox", "0 0 " + i + " " + l), m.setAttribute("shape-rendering", "geometricPrecision");
        let d = i / t.daynames.length;
        for (e = 0; e < c.length; e++) s = Math.max(t.stepHeightMin, c[e].height), r = document.createElementNS(o, "rect"), r.setAttribute("class", "rect active"), r.setAttribute("stroke-width", 0), r.setAttribute("x", e * d), r.setAttribute("y", l - s), r.setAttribute("width", d), r.setAttribute("height", s), a = document.createElementNS(o, "rect"), a.setAttribute("class", "rect inactive"), a.setAttribute("stroke-width", 0), a.setAttribute("x", e * d), a.setAttribute("y", 0), a.setAttribute("width", d), a.setAttribute("height", l - s), n = document.createElementNS(o, "g"), n.setAttribute("class", "group"), n.appendChild(r), n.appendChild(a), n.setAttribute("wt:dayname", e), n.setAttribute("wt:time", c[e].seconds), n.setAttribute("wt:percentage-string", getPercentageString(c[e].seconds / p * 100, !0)), m.appendChild(n);
        return m
    },
    helperGetTimeObj = (t, e) => {
        let s;
        e !== RESOLUTION_HOURS && (e = RESOLUTION_DAYS);
        let r = !1,
            a = getTimeObj();
        return s = parseInt(t / 86400), a.day.tens = parseInt(s / 10), a.day.units = s % 10, a.day.implicitlyActive = !!r, r = r || a.day.tens > 0 || a.day.units > 0, e === RESOLUTION_DAYS ? (s = parseInt(t % 86400), s = parseInt(s / 3600), a.hour.tens = parseInt(s / 10), a.hour.units = s % 10, a.hour.implicitlyActive = !!r, r = r || a.hour.tens > 0 || a.hour.units > 0) : (s = parseInt(t / 3600), a.hour.tens = parseInt(s / 10), a.hour.units = s % 10, a.hour.implicitlyActive = !!r, r = r || a.hour.tens > 0 || a.hour.units > 0), s = parseInt(t % 86400), s = parseInt(s % 3600), s = parseInt(s / 60), a.minute.tens = parseInt(s / 10), a.minute.units = s % 10, a.minute.implicitlyActive = !!r, r = r || a.minute.tens > 0 || a.minute.units > 0, s = parseInt(t % 86400), s = parseInt(s % 3600), s = parseInt(s % 60), a.second.tens = parseInt(s / 10), a.second.units = s % 10, a.second.implicitlyActive = !!r, a
    };