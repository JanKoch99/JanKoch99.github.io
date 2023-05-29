let summeEvang,summeRom,summeUbrige, summeKonfessionsAngehorige,
    summeTagesstätte,
    summeSteuerfusse,
    summeAusländer,
    summeBevolkerung;

let partei_starken_Array = [
    {
        'gemeindeName': "",
        'parteien': {
            'evp': {
                'Name': "Evangelische Volkspartei",
                'Value': 0,
            },
            'glp': {
                'Name': "Grünliberale Partei",
                'Value': 0,
            },
            'svp': {
                'Name': "Schweizerische Volkspartei",
                'Value': 0,
            },
            'cvp': {
                'Name': "Die Mitte",
                'Value': 0,
            },
            'fdp': {
                'Name': "Die Liberalen",
                'Value': 0,
            },
            'gp': {
                'Name': "GRÜNE Partei",
                'Value': 0,
            },
            'sp': {
                'Name': "Sozialdemokratische Partei",
                'Value': 0,
            },
        }
    }
];
let konfessionszug_Array = [
    {
        'gemeindeName': '',
        'evang': 0,
        'rom': 0,
        'ubrige': 0
    }
]
let kindertagesstaette_Array = [
    {
        'gemeindeName': "",
        'kindertagesstaetten': 0
    }
]
let steuerfuesse_Array = [
    {
        'gemeindeName': "",
        'gemeindesteuerfuss': 0
    }
]
let sozAusgabe_Array = [
    {
        'gemeindeName': "",
        'brutto_sozialhilfe_je_einwohner': 0
    }
]
let auslaenderAnteil_Anteil = [
    {
        'gemeindeName': "",
        'auslaenderanteil': 0
    }
]
let auslaenderInt_Array = [
    {
        'gemeindeName': "",
        'auslaender': 0
    }
]
let wohnbevoelkerung_Array = [
    {
        'gemeindeName': "",
        'bevoelkerung': 0
    }
]
let responseF = []

async function fuse(wholeSet) {
    for (let k = 0; k < wholeSet.length; k++) {
        let set = wholeSet[k]
        let responseE = await fetchThis(set);
        let jsonDataE = await responseE.json();
        if (set === "partei_starken") {
            for (let i = 0; i < jsonDataE.records.length; i++) { // 80
                if (i === 0) {
                    partei_starken_Array.splice(0, 1,);
                }
                let fields = jsonDataE.records[i].fields;
                partei_starken_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    parteien: {
                        evp: {
                            value: fields['evp']
                        },
                        glp: {
                            value: fields['glp']
                        },
                        svp: {
                            value: fields['svp']
                        },
                        cvp: {
                            value: fields['cvp']
                        },
                        fdp: {
                            value: fields['fdp']
                        },
                        gp: {
                            value: fields['gp']
                        },
                        sp: {
                            value: fields['sp']
                        }
                    }
                })
            }
            partei_starken_Array = sortData(partei_starken_Array, "parteien.svp.value");
            responseF.push(partei_starken_Array);
        }
        if (set === "konfessionszugehoerigkeit") {
            for (let i = 0; i < jsonDataE.records.length; i++) {
                if (i === 0) {
                    konfessionszug_Array.splice(0, 1);
                }
                let fields = jsonDataE.records[i].fields;
                let foundKonfession = konfessionszug_Array.find(item => item.gemeindeName === fields['gemeinde_name']);
                if (foundKonfession !== undefined) {
                    if (fields['konfession_bezeichnung'] === 'Evangelisch-reformiert') {
                        foundKonfession.evang = fields['anzahl_personen']
                    }
                    if (fields['konfession_bezeichnung'] === 'Römisch-katholisch') {
                        foundKonfession.rom = fields['anzahl_personen']
                    }
                    if (fields['konfession_bezeichnung'] === 'Übrige') {
                        foundKonfession.ubrige = fields['anzahl_personen']
                    }
                } else {
                    let evang, rom, ubrige;
                    if (fields['konfession_bezeichnung'] === 'Evangelisch-reformiert') {
                        evang = fields['anzahl_personen']
                    }
                    if (fields['konfession_bezeichnung'] === 'Römisch-katholisch') {
                        rom = fields['anzahl_personen']
                    }
                    if (fields['konfession_bezeichnung'] === 'Übrige') {
                        ubrige = fields['anzahl_personen']
                    }
                    konfessionszug_Array.push({
                        gemeindeName: fields['gemeinde_name'],
                        evang: evang,
                        rom: rom,
                        ubrige: ubrige
                    })
                }
            }
            responseF.push(konfessionszug_Array);
            summeEvang = summe(konfessionszug_Array, "evang")
            summeRom = summe(konfessionszug_Array, "rom")
            summeUbrige = summe(konfessionszug_Array, "ubrige")
            summeKonfessionsAngehorige = summeEvang + summeRom + summeUbrige
        }
        if (set === "kindertagesstaette") {
            for (let i = 0; i < jsonDataE.records.length; i++) {
                if (i === 0) {
                    kindertagesstaette_Array.splice(0, 1);
                }
                let fields = jsonDataE.records[i].fields;
                kindertagesstaette_Array.push({
                    gemeindeName: fields['politische_gemeinde'],
                    kindertagesstaetten: fields['anzahl_platze']
                })
            }
            kindertagesstaette_Array = sortData(kindertagesstaette_Array, "kindertagesstaetten");
            summeTagesstätte = summe(kindertagesstaette_Array, "kindertagesstaetten")
            responseF.push(kindertagesstaette_Array);
        }
        if (set === "steuerfuesse") {
            for (let i = 0; i < jsonDataE.records.length; i++) {
                if (i === 0) {
                    steuerfuesse_Array.splice(0, 1);
                }
                let fields = jsonDataE.records[i].fields;
                steuerfuesse_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    gemeindesteuerfuss: fields['gemeindesteuerfuss']
                })
            }
            steuerfuesse_Array = sortData(steuerfuesse_Array, "gemeindesteuerfuss");
            summeSteuerfusse = summe(steuerfuesse_Array, "gemeindesteuerfuss")
            responseF.push(steuerfuesse_Array);
        }
        if (set === "sozAusgabe") {
            for (let i = 0; i < jsonDataE.records.length; i++) {
                if (i === 0) {
                    sozAusgabe_Array.splice(0, 1);
                }
                let fields = jsonDataE.records[i].fields;
                sozAusgabe_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    brutto_sozialhilfe_je_einwohner: fields['brutto_sozialhilfe_je_einwohner']
                })
            }
            sozAusgabe_Array = sortData(sozAusgabe_Array, "brutto_sozialhilfe_je_einwohner");
            responseF.push(sozAusgabe_Array);
        }
        if (set === "auslaenderAnteil_Anteil") {
            for (let i = 0; i < jsonDataE.records.length; i++) {
                if (i === 0) {
                    auslaenderInt_Array.splice(0, 1);
                }
                let fields = jsonDataE.records[i].fields;
                let foundAuslaender = auslaenderInt_Array.find(item => item.gemeindeName === fields['gemeinde_name'])
                if (foundAuslaender !== undefined) {
                    foundAuslaender.auslaender = parseInt(foundAuslaender.auslaender) + parseInt(fields['anzahl_personen'])
                } else {
                    auslaenderInt_Array.push({
                        gemeindeName: fields['gemeinde_name'],
                        auslaender: parseInt(fields['anzahl_personen'])
                    })
                }
            }

            let bevoelkerung = await (await fetchingGeneralData('sk-stat-56', "2022", "80")).json()

            for (let i = 0; i < bevoelkerung.records.length; i++) {
                if (i === 0) {
                    wohnbevoelkerung_Array.splice(0, 1);
                }
                let fields = bevoelkerung.records[i].fields;
                wohnbevoelkerung_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    bevoelkerung: parseInt(fields['anzahl_personen'])
                })
            }
            for (let j = 0; j < auslaenderInt_Array.length; j++) {
                if (j === 0) {
                    auslaenderAnteil_Anteil.splice(0, 1);
                }
                let bev = wohnbevoelkerung_Array.find(item => item.gemeindeName === auslaenderInt_Array[j].gemeindeName)
                if (bev !== undefined) {
                    auslaenderAnteil_Anteil.push({
                        gemeindeName: auslaenderInt_Array[j].gemeindeName,
                        auslaenderanteil: auslaenderInt_Array[j].auslaender / bev.bevoelkerung
                    })
                }

            }
            auslaenderAnteil_Anteil = sortData(auslaenderAnteil_Anteil, "auslaenderanteil");
            summeAusländer = summe(auslaenderInt_Array, "auslaender")
            summeBevolkerung = summe(wohnbevoelkerung_Array, "bevoelkerung")
            responseF.push(auslaenderAnteil_Anteil);
        }
    }

    return responseF
}

/**
 * gives params for indicated set and calls the real fetching
 * @param set
 * @returns {Promise<Response>}
 */
async function fetchThis(set) {
    let dataset;
    let query;
    let rows = 80;
    let sort;
    switch (set) {
        case "partei_starken":
            dataset = "sk-stat-9";
            query = "2020";
            break;
        case "konfessionszugehoerigkeit": {
            dataset = "sk-stat-62";
            query = "2022";
            rows = 240
            break;
        }
        /*https://data.tg.ch/explore/dataset/djs-gs-7/api/?sort=ort*/
        case "kindertagesstaette": {
            dataset = "djs-gs-7";
            query = "";
            break;
        }
        /*https://data.tg.ch/explore/dataset/sk-stat-69/information/*/
        case "steuerfuesse":
            dataset = "sk-stat-69"
            query = "2022"
            break;
        /*https://data.tg.ch/explore/dataset/sk-stat-54/information/*/
        case "sozAusgabe":
            dataset = "sk-stat-54"
            query = "2021"
            break;

        case "auslaenderAnteil_Anteil":
            /*https://data.tg.ch/explore/dataset/sk-stat-61/api/?sort=jahr&q=%222022%22*/
            dataset = "sk-stat-61"
            query = "2022"
            rows = 230
            break;
    }
    return await fetchingGeneralData(dataset, query, rows, sort);
}

/**
 * getting the data from the api with given parameters
 * @param dataset
 * @param query
 * @param rows
 * @param sort
 * @returns {Promise<Response>}
 */
async function fetchingGeneralData(dataset, query, rows, sort) {
    let url = "https://data.tg.ch/api/records/1.0/search/?";
    url += "dataset=" + dataset;
    if (sort !== undefined) {
        url += "&sort=" + sort;
    }
    if (rows !== undefined) {
        url += "&rows=" + rows;
    }
    if (query !== undefined) {
        url += "&q=" + query;
    }
    return await fetch(url);
}
function sortData(arraySet, field, partei = false) {
    if (!partei) {
        return arraySet.sort((a, b) => {
            /*Prevent undefined to go at the top of the list*/
            if (a[field] === undefined) {
                return -1
            }
            if (b[field] === undefined) {
                return 1
            }
            return (a[field] - b[field])
        })
    }
    return arraySet.sort((a, b) => {
        /*Prevent undefined to go at the top of the list*/
        if (a.parteien[field].value === undefined) {
            return -1
        }
        if (b.parteien[field].value === undefined) {
            return 1
        }
        return (a.parteien[field].value - b.parteien[field].value)
    })
}
const dropDownThemen = [
    {
        id: 0,
        name: "svp",
        color: '#008C43'
    },
    {
        id: 1,
        name: "sp",
        color: '#F40022'

    },
    {
        id: 2,
        name: "fdp",
        color: '#104FA0'
    },
    {
        id: 3,
        name: "gp",
        color: '#85B514'
    },
    {
        id: 4,
        name: "cvp",
        color: '#FF9B00'
    },
    {
        id: 5,
        name: "glp",
        color: '#9BCF2D'
    },
    {
        id: 6,
        name: "evp",
        color: '#F7DA00'
    }
]
let currentlySelectedDD = dropDownThemen[0];

let currentMaxValue = "100%"
let currentMinValue = "0%"
var scrollVis = function () {
    // main svg used for visualization
    let tooltipP = null;

    var svg = null;
    // d3 selection that will be used
    // for displaying visualizations
    var u = null;
    var g = null;
    var path = null;
    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [function () {
    }];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [function () {
    }];
    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.


    var lastIndex = -1;

    var activeIndex = 0;

    //projection
    const width = window.innerWidth / 2
    const height = window.innerHeight
    var margin = {top: 0, left: 20, bottom: 40, right: 20};


    var chart = function (selection) {
        selection.each(function (APIData) {
            // create svg and give it a width and height
            svg = d3.select(this).selectAll('svg').data([APIData]);
            var svgE = svg.enter().append('svg');
            // @v4 use merge to combine enter and existing selection
            svg = svg.merge(svgE);
            svg.attr('width', width + margin.left + margin.right);
            svg.attr('height', height + margin.top + margin.bottom);

            svg.attr("viewBox", "0 0 " + width + " " + height)
            svg.append('g');


            // this group element will be used to contain all
            // other elements.
            g = svg.select('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            d3.json("../geojson/thurgau-gemeinde.geojson").then(GeoData => {
                const projection = d3.geoMercator().fitSize([width, height], GeoData)
                path = d3.geoPath().projection(projection);
                setupVis(GeoData);
                setupSections();
            });
        });
        //  });
    };
    var setupVis = function (gemeindeData) {


        //mine
        g.append('text')
            .attr('class', 'title openvis-title')
            .attr('x', width / 2)
            .attr('y', height / 7)
            .attr("font-size", () => {
                return width / 10
            })
            .text('2023');

        g.append('text')
            .attr('class', 'sub-title openvis-title')
            .attr('x', width / 2)
            .attr('y', (height / 7) + (height / 7))
            .attr("font-size", () => {
                return width / 15
            })
            .text('OpenData Visualisierung');


        var mapE = g.selectAll("path")
            .data(gemeindeData.features)
        var map = mapE.enter()
            .append("path")
            .attr("class", "map-number1")
        map = map.merge(mapE)
            .attr("d", path)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("fill", switchDropDownData(currentlySelectedDD, false, false))
            .style("visibility", "hidden")

        g.selectAll("#colorscale").style("opacity", 0)
    }
    var setupSections = function () {

        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = showMapOne;
        activateFunctions[2] = showMapTwo;
        activateFunctions[3] = showMapTwoAHalf;
        activateFunctions[4] = showMapThree;
        activateFunctions[5] = showMapFour;
        activateFunctions[6] = showMapFive;
        activateFunctions[7] = showMapSix;
        activateFunctions[8] = showMapSeven;


        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
    };


    function showTitle() {
        g.selectAll("path")
            .style("visibility", "hidden")
        d3.select("#tooltip").style("opacity", 0)
        d3.select("#colorscale").style("opacity", 0)

        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 1.0);
    }

    function showMapOne() {
        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 0);
        g.selectAll("path")
            .transition()
            .duration(0)
            .style("visibility", "visible")
            .attr("fill", switchDropDownData(currentlySelectedDD, true, true))
    }

    function showMapTwo() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapTwoAHalf() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapThree() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapFour() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapFive() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapSix() {
        switchDropDownData(currentlySelectedDD, true, false)
    }
    function showMapSeven() {
        switchDropDownData(currentlySelectedDD, true, false)
    }

    function drawScale(id, interpolator) {
        let maxPercentElement =  document.getElementById('text100');
        let minPercentElement = document.getElementById('text0')
        if (maxPercentElement) {
            maxPercentElement.innerHTML = currentMaxValue
            minPercentElement.innerHTML = currentMinValue
        }
        var data = Array.from(Array(100).keys());

        var cScale = d3.scaleSequential()
            .interpolator(interpolator)
            .domain([0, 99]);

        var xScale = d3.scaleLinear()
            .domain([0, 99])
            .range([100, width - 100]);
        d3.select("#" + id).style("opacity", 1)
        if (u !== null) {
            u.transition().duration(0).style("background-color", (d) => {
                let c = cScale(d)
                return c
            })
        } else {
            u = d3.select("#" + id)
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "colorscale")
                .style('position', 'absolute')
                .style("left", (d) => Math.floor(xScale(d)) + "px")
                .style("top", innerHeight / 9 + "px")
                .style("height", 40 + "px")
                .style("width", (d) => {
                    if (d === 99) {
                        return 6 + "px";
                    }
                    return (Math.floor(xScale(d + 1)) - Math.floor(xScale(d)) + 1) + "px";
                })
                //instead of filling.. nur e zwüschelösig
                .style("background-color", (d) => {
                    let c = cScale(d)
                    return c
                })
                .style("border", "1px solid black")

            d3.select("#" + id).append("text")
                .style('position', 'absolute')
                .style("top", (innerHeight / 9) - 30 + "px")
                .style("left", Math.floor(xScale(0)) + "px")
                .attr("font-size", 20)
                .attr("fill", "red")
                .attr("id", "text0")
                .text(currentMinValue);

            d3.select("#" + id).append("text")
                .style('position', 'absolute')
                .style("top", (innerHeight / 9) - 30 + "px")
                .style("left", Math.floor(xScale(100)) - 39 + "px")
                .attr("font-size", 20)
                .attr("fill", "red")
                .attr("id", "text100")
                .text(currentMaxValue);

        }
    }

    function setFilling(selectedDD, isOtherArray) {
        let data = partei_starken_Array;
        let interpolator = d3.interpolate("#FFF", selectedDD.color)
        let partei;
        if (isOtherArray){
            partei = currentlySelectedDD
        }else {
            partei = selectedDD
        }
        data = sortData(data, partei.name, true)

        var cScale = d3.scaleSequential()
            .interpolator(interpolator)
            .domain([0, 99]);

        g.selectAll(".map-number1").style("fill", (d) => {
            let toNorm, maxValue;
            if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")) {
                return "#1b95e0"
            }
            if (isOtherArray) {
                let themeArray = sortData(translationSelectedTheme(activeIndex), getSelection(activeIndex), false)
                if (activeIndex === 5) {
                    themeArray = sortData(konfessionszug_Array, "evang")
                }
                if (activeIndex === 6) {
                    themeArray = sortData(konfessionszug_Array, "rom")
                }
                if (activeIndex === 7) {
                    themeArray = sortData(konfessionszug_Array, "ubrige")
                }
                for (let i = 0; i < themeArray.length; i++) {

                    if (data[i] !== undefined && data[i] !== null && matcher(d.properties.gem_name.toString().toLowerCase(), data[i].gemeindeName.toLowerCase())) {
                        let toNorm, maxValue;
                        let themeArray = sortData(translationSelectedTheme(activeIndex), getSectionName(activeIndex),false)
                        if (themeArray === -1 || getSectionName(activeIndex) === -1){
                            throw "SectionNotAvailable"
                        }
                        if (themeArray[i] !== undefined) {
                            toNorm = parseFloat(themeArray[i][getSectionName(activeIndex)])
                            maxValue = parseFloat(themeArray[themeArray.length - 1][getSectionName(activeIndex)])
                        }
                        else {
                            return cScale(0)
                        }

                        if (toNorm === undefined) {
                            return cScale(0)
                        }
                        let normalized = toNorm / maxValue
                        if (normalized > 1) {
                            normalized = 1;
                        }
                        return cScale(100 * normalized)//return cScale(0)
                    }
                }
                console.log("outside undefined")

                return cScale(0)
            }


            else{
                for (let i = 0; i < partei_starken_Array.length; i++) {
                    if (data[i] !== undefined && data[i] !== null && matcher(d.properties.gem_name.toString().toLowerCase(), data[i].gemeindeName.toLowerCase())) {

                        switch (currentlySelectedDD.id) {
                            case 0:
                                toNorm = data[i].parteien.svp.value
                                maxValue = data[data.length - 1].parteien.svp.value
                                break;
                            case 1:
                                toNorm = data[i].parteien.sp.value
                                maxValue = data[data.length - 1].parteien.sp.value
                                break;
                            case 2:
                                toNorm = data[i].parteien.fdp.value
                                maxValue = data[data.length - 1].parteien.fdp.value
                                break;
                            case 3:
                                toNorm = data[i].parteien.gp.value
                                maxValue = data[data.length - 1].parteien.gp.value
                                break;
                            case 4:
                                toNorm = data[i].parteien.cvp.value
                                maxValue = data[data.length - 1].parteien.cvp.value
                                break;
                            case 5:
                                toNorm = data[i].parteien.glp.value
                                maxValue = data[data.length - 1].parteien.glp.value
                                break;
                            case 6:
                                toNorm = data[i].parteien.evp.value
                                maxValue = data[data.length - 1].parteien.evp.value
                                break;
                            default:
                                toNorm = 0;
                                maxValue = 1;
                        }
                        currentMaxValue = maxValue.toFixed(2) + "%"
                        currentMinValue = "0%"
                        if (toNorm === undefined) {
                            return cScale(0)
                        }
                        let normalized = toNorm / maxValue
                        if (normalized > 1) {
                            normalized = 1;
                        }
                        return cScale(100 * normalized)
                    }
                }
            }

/*            for (let i = 0; i < partei_starken_Array.length; i++) {
                if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")) {
                    return "#1b95e0"
                }
                if (data[i] !== undefined && data[i] !== null && matcher(d.properties.gem_name.toString().toLowerCase(), data[i].gemeindeName.toLowerCase())) {
                    let toNorm, maxValue;
                    let done = false;
                    if (isOtherArray) {
                        let themeArray = translationSelectedTheme(activeIndex)
                        if (activeIndex === 5) {
                            themeArray = sortData(konfessionszug_Array, "evang")
                        }
                        if (activeIndex === 6) {
                            themeArray = sortData(konfessionszug_Array, "rom")
                        }
                        if (activeIndex === 7) {
                            themeArray = sortData(konfessionszug_Array, "ubrige")
                        }

                        if (activeIndex === 2) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].kindertagesstaetten
                                maxValue = themeArray[themeArray.length - 1].kindertagesstaetten
                                done = true;
                                currentMaxValue = ((maxValue / summeTagesstätte) * 100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }
                        } else if (activeIndex === 3) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].brutto_sozialhilfe_je_einwohner
                                maxValue = themeArray[themeArray.length - 1].brutto_sozialhilfe_je_einwohner
                                done = true;
                                currentMaxValue = maxValue
                                currentMinValue = 0
                            } else {
                                return cScale(0)
                            }
                        } else if (activeIndex === 4) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].gemeindesteuerfuss
                                maxValue = themeArray[themeArray.length - 1].gemeindesteuerfuss
                                done = true
                                currentMaxValue = ((maxValue / summeSteuerfusse) * 100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }

                        } else if (activeIndex === 5) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].evang
                                maxValue = themeArray[themeArray.length - 1].evang
                                done = true
                                currentMaxValue = ((maxValue / summeEvang) * 100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }

                        } else if (activeIndex === 6) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].rom
                                maxValue = themeArray[themeArray.length - 1].rom
                                done = true
                                currentMaxValue = ((maxValue / summeRom) * 100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }

                        } else if (activeIndex === 7) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].ubrige
                                maxValue = themeArray[themeArray.length - 1].ubrige
                                done = true
                                currentMaxValue = ((maxValue / summeUbrige) * 100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }

                        } else if (activeIndex === 8) {
                            if (themeArray[i] !== undefined) {
                                toNorm = themeArray[i].auslaenderanteil
                                maxValue = themeArray[themeArray.length - 1].auslaenderanteil
                                done = true
                                currentMaxValue = (maxValue*100).toFixed(2) + "%"
                                currentMinValue = "0%"
                            } else {
                                return cScale(0)
                            }

                        }
                    }
                    if (!isOtherArray || !done) {

                        switch (currentlySelectedDD.id) {
                            case 0:
                                toNorm = data[i].parteien.svp.value
                                maxValue = data[data.length - 1].parteien.svp.value
                                break;
                            case 1:
                                toNorm = data[i].parteien.sp.value
                                maxValue = data[data.length - 1].parteien.sp.value
                                break;
                            case 2:
                                toNorm = data[i].parteien.fdp.value
                                maxValue = data[data.length - 1].parteien.fdp.value
                                break;
                            case 3:
                                toNorm = data[i].parteien.gp.value
                                maxValue = data[data.length - 1].parteien.gp.value
                                break;
                            case 4:
                                toNorm = data[i].parteien.cvp.value
                                maxValue = data[data.length - 1].parteien.cvp.value
                                break;
                            case 5:
                                toNorm = data[i].parteien.glp.value
                                maxValue = data[data.length - 1].parteien.glp.value
                                break;
                            case 6:
                                toNorm = data[i].parteien.evp.value
                                maxValue = data[data.length - 1].parteien.evp.value
                                break;
                            default:
                                toNorm = 0;
                                maxValue = 1;
                        }
                        currentMaxValue = maxValue.toFixed(2) + "%"
                        currentMinValue = "0%"
                    }

                    if (toNorm === undefined) {
                        return cScale(0)
                    }
                    let normalized = toNorm / maxValue
                    if (normalized > 1) {
                        normalized = 1;
                    }
                    return cScale(100* normalized)
                }
            }*/

        })
    }
    
    function toolTipText(selectedDDNumber, d, dropDownVisible) {
        let text
        let themeArray = translationSelectedTheme(activeIndex)
        let gemeindeName = d.properties.gem_name;
        for (let i = 0; i < partei_starken_Array.length; i++) {
            if (matcher(gemeindeName.toString().toLowerCase(), partei_starken_Array[i].gemeindeName.toLowerCase())) {
                switch (selectedDDNumber) {
                    case 0: {
                        let svp = partei_starken_Array[i].parteien.svp.value
                        text = gemeindeName + " — " + "svp: " + (svp !== undefined ? (svp) : '0') + "%";
                        break;
                    }
                    case 1: {
                        let sp = partei_starken_Array[i].parteien.sp.value
                        text = gemeindeName + " — " + "sp: " + (sp !== undefined ? (sp) : '0') + "%";
                        break;
                    }
                    case 2: {
                        let fdp = partei_starken_Array[i].parteien.fdp.value
                        text = gemeindeName + " — " + "fdp: " + (fdp !== undefined ? (fdp) : '0') + "%";
                        break;
                    }
                    case 3: {
                        let gp = partei_starken_Array[i].parteien.gp.value
                        text = gemeindeName + " — " + "gp: " + (gp !== undefined ? (gp) : '0') + "%";
                        break;
                    }
                    case 4: {
                        let cvp = partei_starken_Array[i].parteien.cvp.value
                        text = gemeindeName + " — "+ "cvp: " + (cvp !== undefined ? (cvp) : '0') + "%";
                        break;
                    }
                    case 5: {
                        let glp = partei_starken_Array[i].parteien.glp.value
                        text = gemeindeName + " — " + "glp: " + (glp !== undefined ? (glp) : '0') + "%";
                        break;
                    }
                    case 6: {
                        let evp = partei_starken_Array[i].parteien.evp.value
                        text = gemeindeName + " — " + "evp: " + (evp !== undefined ? (evp) : '0') + "%";
                        break;
                    }
                    default: {
                        text = partei_starken_Array[i].gemeindeName
                    }
                }
                switch (activeIndex){
                    case -1:{
                        break;
                    }
                    case 0:{
                        break;
                    }
                    case 1:{
                        break;
                    }
                    case 2:{ //mapOne
                        if (themeArray[i] !== undefined) {
                            text += "\nKindertagesstätte: " + (themeArray[i].kindertagesstaetten === undefined ?
                                'Keine Daten vorhanden' :
                                themeArray[i].kindertagesstaetten + "\t/\t" + summeTagesstätte + "\t=\t" +(Math.round((themeArray[i].kindertagesstaetten/summeTagesstätte)*10000)/100 +"%")) ;
                        }
                        else{
                            text += "\nKindertagesstätte: " + 'Keine Daten vorhanden';
                        }
                        break;

                    }

                    case 3:{ //mapOneAHalf
                        if (themeArray[i] !== undefined) {
                            text += "\nBrutto Sozialhilfeausgaben/einwohner: " +
                                (themeArray[i].brutto_sozialhilfe_je_einwohner !== undefined ?
                                    themeArray[i].brutto_sozialhilfe_je_einwohner :
                                    'Keine Daten vorhanden');
                        }else{
                            text += "\nBrutto Sozialhilfeausgaben/einwohner: " + 'Keine Daten vorhanden';

                        }
                        break;
                    }
                    case 4:{//MapTwo
                        if (!dropDownVisible){
                            text += "\nSteuerfüsse: " + (themeArray[i].gemeindesteuerfuss !== undefined ?
                                "\n" + themeArray[i].gemeindesteuerfuss + "\t/\t" +summeSteuerfusse + "\t=\t"+ Math.round((themeArray[i].gemeindesteuerfuss/summeSteuerfusse)*10000)/100 + "%" :
                                'Keine Daten vorhanden');
                        }
                        break;
                    }
                    case 5:{//MApThree
                        if (!dropDownVisible){
                            let thisK = 0;
                            for (let k = 0; k< wohnbevoelkerung_Array.length; k++){
                                if (matcher(themeArray[i].gemeindeName,wohnbevoelkerung_Array[k].gemeindeName)){
                                    thisK = k;
                                }
                            }
                            text += "\nKonfessionszugehörigkeit:\n" +
                                "Evangelisch reformiert Einwohner d. Gemeinde / Evangelisch reformiert Gesamteinwohnerzahl des Kantons: " + (themeArray[i].evang !== undefined ?
                                    (themeArray[i].evang + "\t/\t" + summeEvang + "\t=\t" +  Math.round((themeArray[i].evang/summeEvang)*10000)/100 + "%"
                                    + "\nEvangelisch-reformiert d. Gemeinde/ Einwohnerzahl d. Gemeinde=\t" + themeArray[i].evang + " / " + wohnbevoelkerung_Array[thisK].bevoelkerung + "\t=\t" +  Math.round((themeArray[i].evang/wohnbevoelkerung_Array[thisK].bevoelkerung)*10000)/100 + "%")
                                    : "Keine Daten vorhanden")
                        }
                        break;
                    }
                    case 6:{//Mapfour
                        if (!dropDownVisible){
                            let thisK = 0;
                            for (let k = 0; k< wohnbevoelkerung_Array.length; k++){
                                if (matcher(themeArray[i].gemeindeName,wohnbevoelkerung_Array[k].gemeindeName)){
                                    thisK = k;
                                }
                            }
                            text += "\nKonfessionszugehörigkeit:\n" +
                                "Römisch Katholisch Einwohner d. Gemeinde / Römisch Katholische Gesamteinwohnerzahl des Kantons: " + (themeArray[i].rom !== undefined ?
                                    (themeArray[i].rom + "\t/\t" + summeRom + "\t=\t" +  Math.round((themeArray[i].rom/summeRom)*10000)/100 + "%"
                                        + "\nRömisch-Katholisch d. Gemeinde/ Einwohnerzahl d. Gemeinde=\t" + themeArray[i].rom + " / " + wohnbevoelkerung_Array[thisK].bevoelkerung + "\t=\t" +  Math.round((themeArray[i].rom/wohnbevoelkerung_Array[thisK].bevoelkerung)*10000)/100 + "%")
                                    : "Keine Daten vorhanden")
                        }
                        break;
                    }
                    case 7:{//Mapfour
                        if (!dropDownVisible){
                            let thisK = 0;
                            for (let k = 0; k< wohnbevoelkerung_Array.length; k++){
                                if (matcher(themeArray[i].gemeindeName,wohnbevoelkerung_Array[k].gemeindeName)){
                                    thisK = k;
                                }
                            }
                            text += "\nKonfessionszugehörigkeit:\n" +
                                "\"Übrige Einwohner d. Gemeinde / übrige Gesamteinwohnerzahl des Kantons:: " + (themeArray[i].ubrige !== undefined ?
                                    (themeArray[i].ubrige + "\t/\t" + summeUbrige + "\t=\t" +  Math.round((themeArray[i].ubrige/summeUbrige)*10000)/100 + "%"
                                        + "\nÜbrige d. Gemeinde / Einwohnerzahl d. Gemeinde=\t" + themeArray[i].ubrige + " / " + wohnbevoelkerung_Array[thisK].bevoelkerung + "\t=\t" +  Math.round((themeArray[i].ubrige/wohnbevoelkerung_Array[thisK].bevoelkerung)*10000)/100 + "%")
                                    : "Keine Daten vorhanden")
                        }
                        break;
                    }
                    case 8:{//MapFive
                        if (!dropDownVisible){
                            text += "\nAusländeranteil:\n" +
                                (themeArray[i].auslaenderanteil !== undefined ?
                                    ((Math.round(themeArray[i].auslaenderanteil*100)) + "%")

                                    : "Keine Daten vorhanden")
                        }
                        break;
                    }
                }
            }
        }
        return text;
    }

    function tooltip(selectedDDNumber, dropDownVisible) {
        let text
        g.selectAll(".map-number1")
            .on("mouseover", function(e,d) {
                d3.select('#vis').selectAll('tooltip').remove();
                tooltipP = d3.select('#tooltip').append('p').attr('class', 'tooltip');

                d3.select("#tooltip").style("opacity", 1)

                if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")){
                    e.target.attributes.getNamedItem("stroke").value = "#000";
                    text = "Bodensee"

                }else {
                    e.target.attributes.getNamedItem("stroke").value = "#FFF";
                    text = toolTipText(selectedDDNumber, d, dropDownVisible);
                }
                e.target.attributes.getNamedItem("stroke-width").value = 5;

                tooltipP
                    .style('position', 'absolute')
                    .style('z-index', 10000000)
                    .style("color", "black")
                    .style("font-weight", "bold")
                    .style("white-space", "pre-line")
                    .style("left", (d3.pointer(e)[0]) - 150 + "px")
                    .style("top", (d3.pointer(e)[1] - 50) + "px")
                    .text(text)
            })

            .on("mousemove", function (e){
                    tooltipP
                        .style("left", (d3.pointer(e)[0] - 150) + "px")
                        .style("top", (d3.pointer(e)[1] - 100) + "px")
            })
            .on("mouseout", () => {
                g.selectAll("path").attr("stroke", "#000").attr("stroke-width", "1")
                tooltipP.remove();
            })

    }
    function matcher(one, two){
        if (one !== undefined && two !== undefined) {
            one = one.split(' ');
            two = two.split(' ');
            if (one[0].startsWith(two[0])) {
                return true;
            }
        }
        else{
            return false;
        }
    }


    d3.select('#filter').on("change", (e) => {
        currentlySelectedDD = dropDownThemen[e.target.value];
        switchDropDownData(currentlySelectedDD, true, true)

    });

    function getSectionName(sectionNumber){
        switch (sectionNumber) {
            case -1:{
                break;
            }
            case 0:{
                break;
            }
            case 1:{
                break;
            }
            case 2: {
                return "kindertagesstaetten"
            }
            case 3:{ //mapOnAhalf
                return "brutto_sozialhilfe_je_einwohner"
            }
            case 4:{//MapTwo
                return "gemeindesteuerfuss"
            }
            case 5:{//MApThree
                return "evang"
            }
            case 6:{//Mapfour
                return "rom"
            }
            case 7:{//Mapfour
                return "ubrige"
            }
            case 8:{//Mapfour
                return "auslaenderanteil"
            }
        }
        return "partei"
    }
    function translationSelectedTheme(sectionNumber){
        switch (sectionNumber){
            case -1:{
                break;
            }
            case 0:{
                break;
            }
            case 1:{
                break;
            }
            case 2:{ //mapOne
                return kindertagesstaette_Array
            }
            case 3:{ //mapOnAhalf
                return sozAusgabe_Array
            }
            case 4:{//MapTwo
                return steuerfuesse_Array
            }
            case 5:{//MApThree
                return konfessionszug_Array
            }
            case 6:{//Mapfour
                return konfessionszug_Array
            }
            case 7:{//Mapfour
                return konfessionszug_Array
            }
            case 8:{//MapFive
                return auslaenderAnteil_Anteil
            }
            default:{
                return partei_starken_Array
            }
        }
        return partei_starken_Array
    }
    function changeTextForSections(){
        try {
            if (activeIndex >1) {
                //https://thisancog.github.io/statistics.js/inc/correlation.html
                let selectedArray = translationSelectedTheme(activeIndex)
                let sortedParteien = sortData(partei_starken_Array, "gemeindeName", false)
                selectedArray = sortData(selectedArray, "gemeindeName", false)


                var array = []
                var vars = {partei: 'interval', selected: 'interval'}

                for (let i = 0; i < sortedParteien.length; i++) {
                    for (let j = 0; j < selectedArray.length; j++) {
                        if (matcher(sortedParteien[i].gemeindeName, selectedArray[j].gemeindeName)) {
                            array.push({
                                gemeindeName: sortedParteien[i].gemeindeName,
                                partei: sortedParteien[i].parteien[currentlySelectedDD.name].value,
                                selected: 100*(selectedArray[j][getSectionName(activeIndex)] / summe(selectedArray, getSectionName(activeIndex)))
                            })
                        }
                    }
                }
                //console.log(array)

                var stats = new Statistics(array, vars)
                var R = stats.linearRegression('partei', 'selected')
                return R.correlationCoefficient
            }
        }
        catch (e){
            console.log(e)
        }

    }

    function switchDropDownData(selectedDD, showAll, DropDownSectionVisible) {
        try {
            changeTextForSections()
            setFilling(selectedDD, !DropDownSectionVisible)
            if (showAll || showAll === undefined) {
                tooltip(selectedDD.id, DropDownSectionVisible);
                drawScale("colorscale", d3.interpolate("#FFF", selectedDD.color))
            }
        }catch (e){
            console.log(e)
        }
    }

    /**
     * activate -
     *
     * @param index - index of the activated section
     */
    chart.activate = function (index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach( (i) => {
            try {
                activateFunctions[i]()
            }
            catch (e){
                window.scroll(top)
            }
        })
        lastIndex = activeIndex;
    };

    // return chart function
    return chart;
}

function summe(themeArray, param){
    let sum =0;
    for (let i =0; i < themeArray.length; i++){
        sum+= parseFloat(themeArray[i][param])
        //console.log(i+ "\t" + sum + "\t" + param)
    }
    return sum
}

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis()
    d3.select('#vis')
        .datum(data)
        .call(plot);



    // setup scroll functionality
    d3.selectAll(".lastStep").style("min-height", innerHeight/1.5 + "px")
    d3.selectAll(".firstStep").style("margin-top", innerHeight/20 + "px")
    d3.selectAll(".step").style("margin-bottom", innerHeight/5 + "px")
    var scroll = scroller()
        .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling


    scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
        .style('opacity', function (d, i) {
            return i === index ? 1 : 0.2;
        });

    // activate current section
        plot.activate(index);

    });


}

let set = ["partei_starken", "konfessionszugehoerigkeit", "kindertagesstaette", "steuerfuesse", "sozAusgabe", "auslaenderAnteil_Anteil"]
document.getElementById("spinner").classList.remove("d-none")
document.getElementById("content").classList.add("invisible")
fuse(set).then(data => {
    display(data)
    document.getElementById("spinner").classList.add("d-none")
    document.getElementById("content").classList.remove("invisible")
})

window.addEventListener("load", (event) => {
    let filter = document.getElementById('filter')
    filter.value = 0
})