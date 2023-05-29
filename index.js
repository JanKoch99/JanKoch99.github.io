let summeEvang,summeRom,summeUbrige, summeKonfessionsAngehorige,
    summeTagesstätte,
    summeSteuerfusse,
    summeAusländer,
    summeBevolkerung;

let currentMaxValue = "100%"
let currentMinValue = "0%"


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
/*    if (arraySet === -1){
        return -1;
    }*/
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
var scrollVis = function () {
    // main svg used for visualization
    let tooltipP = null;

    var svg = null;
    // d3 selection that will be used
    // for displaying visualizations
    var g = null;
    var path = null;
    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [function () {
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

            d3.json("resources/geojson/thurgau-gemeinde.geojson").then(GeoData => {
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
            .attr("fill", switchDropDownData(    {
                id: 0,
                name: "svp",
                color: '#008C43'
            }, "Ausländeranteil"))
            .style("visibility", "hidden")


                g.select("#nav")
            .attr("class", "conclusion")
            .attr('opacity', 0);


    }
    var setupSections = function () {

        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = showMap1;
        activateFunctions[2] = showMap2;
        activateFunctions[3] = showMap3;
        activateFunctions[4] = showMap4;
        activateFunctions[5] = showMap5;
        activateFunctions[6] = showMap6;
        activateFunctions[7] = showMap7;
        activateFunctions[8] = showMap8;
        activateFunctions[9] = showMap9;
        activateFunctions[10] = showMap10;
        activateFunctions[11] = showMap11;
        activateFunctions[12] = showMap12;
        activateFunctions[13] = showConclusion;
    };


    function showTitle() {
        g.selectAll("path")
            .style("visibility", "hidden")
        d3.select("#tooltip").style("opacity", 0)
        d3.select("#switch").style("opacity", 0)

        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 1.0);
    }

    function showMap1() {
        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 0);
        g.selectAll("path")
            .transition()
            .duration(0)
            .style("visibility", "visible")
            .attr("fill", switchDropDownData({
                id: 0,
                name: "svp",
                color: '#008C43'
            }, "Ausländeranteil"))
    }

    function showMap5() {
        switchDropDownData({
            id: 0,
            name: "svp",
            color: '#008C43'
        }, "Kitaplätze")
    }
    function showMap8() {
        switchDropDownData({
            id: 0,
            name: "svp",
            color: '#008C43'
        }, "Sozialhilfe")
    }
    function showMap2() {
        switchDropDownData({
            id: 1,
            name: "sp",
            color: '#F40022'
        }, "Ausländeranteil")
    }
    function showMap6() {
        switchDropDownData({
            id: 1,
            name: "sp",
            color: '#F40022'
        },  "Kitaplätze")
    }
    function showMap9() {
        switchDropDownData({
            id: 1,
            name: "sp",
            color: '#F40022'
        }, "Sozialhilfe")
    }
    function showMap3() {
        switchDropDownData({
            id: 2,
            name: "fdp",
            color: '#104FA0'
        }, "Ausländeranteil")
    }
    function showMap7() {
        switchDropDownData({
            id: 2,
            name: "fdp",
            color: '#104FA0'
        }, "Kitaplätze")
    }
    function showMap10() {
        switchDropDownData({
            id: 2,
            name: "fdp",
            color: '#104FA0'
        }, "Gemeindesteuerfüsse")
    }
    function showMap4() {
        switchDropDownData({
            id: 3,
            name: "gp",
            color: '#85B514'
        },  "Ausländeranteil")
    }
    function showMap11() {
        switchDropDownData({
            id: 4,
            name: "cvp",
            color: '#FF9B00'
        }, "Konfession(Römisch-Katholisch)")
    }
    function showMap12() {

        g.selectAll('.conclusion')
            .transition()
            .duration(0)
            .attr('opacity', 0);

        g.selectAll("path")
            .transition()
            .duration(0)
            .style("visibility", "visible")
            .attr("fill",         switchDropDownData(    {
                id: 4,
                name: "cvp",
                color: '#FF9B00'
            }, "Konfession(Evangelisch-reformiert)"))

        document.getElementById("nextSectionButton").classList.add("d-none")
    }
    function showConclusion() {
        g.selectAll("path")
            .style("visibility", "hidden")
        d3.select("#tooltip").style("opacity", 0)

        g.selectAll('.conclusion')
            .transition()
            .duration(0)
            .attr('opacity', 1.0);
        d3.select("#switch").style("opacity", 1)

        document.getElementById("nextSectionButton").classList.remove("d-none")

    }

    function setFilling(selectedPartei,topic) {

        let data = partei_starken_Array;
        let interpolator = d3.interpolate("#FFF", selectedPartei.color)

        var cScale = d3.scaleSequential()
            .interpolator(interpolator)
            .domain([0, 99]);

        g.selectAll(".map-number1").style("fill", (d) => {
            for (let i = 0; i < partei_starken_Array.length; i++) {
                if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")) {
                    return "#1b95e0"
                }
                if (data[i] !== undefined && data[i] !== null && matcher(d.properties.gem_name.toString().toLowerCase(), data[i].gemeindeName.toLowerCase())) {
                    let toNorm, maxValue;
                    let themeArray = sortData(translationSelectedTheme(activeIndex), getSectionName(activeIndex),false)
                    if (themeArray === -1 || getSectionName(activeIndex) === -1){
                        throw "SectionNotAvailable"
                    }
                    if (themeArray[i] !== undefined) {
                        toNorm = themeArray[i][getSectionName(activeIndex)]
                        maxValue = themeArray[themeArray.length - 1][getSectionName(activeIndex)]
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
                    //erklärung 3. methode:
                    // korrelationsfaktor * (normWert+/-parteistärke)
                    // wenn diff/summe gross => skaliert stärker
                    // wenn diff/summe klein => weniger
                    //+/- => ? welches die bessere wahl, denke summe

                    let c
                    if(selectedPartei.name === "svp") {
                        c = ((1-normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*2)
                    }
                    if(selectedPartei.name === "sp") {
                        if (topic === "Ausländeranteil") {
                            c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*6)
                        }
                        if (topic === "Sozialhilfe") {
                            c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*7)
                        }
                        if (topic === "Kitaplätze") {
                            c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*6)
                        }
                    }
                    if(selectedPartei.name === "gp" && topic ==="Ausländeranteil") {
                        c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*10)
                    }
                    if(selectedPartei.name === "fdp") {
                        c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*9)
                    }
                    if (selectedPartei.name === "cvp") {
                        if (topic === "Konfession(Römisch-Katholisch)") {
                            c = ((normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*10)
                        }
                        if (topic === "Konfession(Evangelisch-reformiert)") {
                            c = ((1-normalized)*partei_starken_Array[i].parteien[selectedPartei.name].value*3)
                        }
                    }

                    if (c < 0){
                        c*=-1
                    }
                    //console.log(c, partei_starken_Array[i].gemeindeName)
                    return cScale(10+c);
                }
            }

        })
    }

    function toolTipText(parteiInFocus, d) {
        let text
        let themeArray = translationSelectedTheme(activeIndex)
        let gemeindeName = d.properties.gem_name;
        for (let i = 0; i < partei_starken_Array.length; i++) {
            if (matcher(gemeindeName.toString().toLowerCase(), partei_starken_Array[i].gemeindeName.toLowerCase())) {
                switch (parteiInFocus) {
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
                    // Ausländeranteil
                    case 1:{}
                    case 2:{}
                    case 3:{}
                    case 4:{
                        text += "\nAusländeranteil:\n" +
                            (themeArray[i].auslaenderanteil !== undefined ?
                                ((Math.round(themeArray[i].auslaenderanteil*100)) + "%")

                                : "Keine Daten vorhanden")

                        break;
                    }
                    //Kitaplätze
                    case 5:{}
                    case 6:{}
                    case 7:{
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
                    //Sozialhilfe/einwohner
                    case 8:{}
                    case 9:{
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
                    //gemeindesteuerfüsse
                    case 10:{
                        text += "\nSteuerfüsse: " + (themeArray[i].gemeindesteuerfuss !== undefined ?
                        "\n" + themeArray[i].gemeindesteuerfuss + "\t/\t" +summeSteuerfusse + "\t=\t"+ Math.round((themeArray[i].gemeindesteuerfuss/summeSteuerfusse)*10000)/100 + "%" :
                        'Keine Daten vorhanden');
                        break;
                    }
                    case 11:{//konfession römisch
                        let thisK = 0;
                        for (let k = 0; k< wohnbevoelkerung_Array.length; k++){
                            if (matcher(themeArray[i].gemeindeName,wohnbevoelkerung_Array[k].gemeindeName)){
                                thisK = k;
                            }
                        }
                        text += "\nKonfessionszugehörigkeit:\n" +
                            "Römisch Katholisch Einwohner d. Gemeinde / Römisch Katholische Gesamteinwohnerzahl des Kantons: " + (themeArray[i].rom !== undefined ?
                                (themeArray[i].rom + "\t/\t" + summeRom + "\t=\t" +  Math.round((themeArray[i].rom/summeRom)*10000)/100 + "%"
                                    + "\nRömisch-Katholisch d. Gemeinde / Einwohnerzahl d. Gemeinde=\t" + themeArray[i].rom + " / " + wohnbevoelkerung_Array[thisK].bevoelkerung + "\t=\t" +  Math.round((themeArray[i].rom/wohnbevoelkerung_Array[thisK].bevoelkerung)*10000)/100 + "%")
                                : "Keine Daten vorhanden")
                        break;
                    }
                    case 12:{//konfession evang
                        let thisK = 0;
                        for (let k = 0; k< wohnbevoelkerung_Array.length; k++){
                            if (matcher(themeArray[i].gemeindeName,wohnbevoelkerung_Array[k].gemeindeName)){
                                thisK = k;
                            }
                        }                            text += "\nKonfessionszugehörigkeit:\n" +
                                "Evangelisch reformiert Einwohner d. Gemeinde / Evangelisch reformiert Gesamteinwohnerzahl des Kantons: " + (themeArray[i].evang !== undefined ?
                                    (themeArray[i].evang + "\t/\t" + summeEvang + "\t=\t" +  Math.round((themeArray[i].evang/summeEvang)*10000)/100 + "%"
                                        + "\nEvangelisch-reformiert d. Gemeinde/ Einwohnerzahl d. Gemeinde =\t" + themeArray[i].evang + " / " + wohnbevoelkerung_Array[thisK].bevoelkerung + "\t=\t" +  Math.round((themeArray[i].evang/wohnbevoelkerung_Array[thisK].bevoelkerung)*10000)/100 + "%")
                                    : "Keine Daten vorhanden")
                        break;
                    }
                    default:{
                        text += 'Keine Daten vorhanden';
                        break;
                    }
                }
            }
        }
        return text;
    }

    function tooltip(selectedParteiNumber) {
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
                    text = toolTipText(selectedParteiNumber, d);
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
        one = one.split(' ');
        two = two.split(' ');
        if (one[0].startsWith(two[0])){
            return true;
        }

    }

    function getSectionName(sectionNumber){
        switch (sectionNumber) {
            case 1:{
                return "auslaenderanteil"
            }
            case 2:{
                return "auslaenderanteil"
            }
            case 3:{
                return "auslaenderanteil"
            }
            case 4:{
                return "auslaenderanteil"
            }
            case 5: {
                return "kindertagesstaetten"
            }
            case 6: {
                return "kindertagesstaetten"
            }
            case 7: {
                return "kindertagesstaetten"
            }
            case 8:{
                return "brutto_sozialhilfe_je_einwohner"
            }
            case 9: {
                return "brutto_sozialhilfe_je_einwohner"
            }
            case 10:{
                return "gemeindesteuerfuss"
            }
            case 11:{
                return "rom"
            }
            case 12:{
                return "evang"
            }
        }
        return -1
    }
    function translationSelectedTheme(sectionNumber){
        switch (sectionNumber){
            case 1:{// svp ausländeranteil
                return auslaenderAnteil_Anteil
            }
            case 2:{ // sp ausländeranteil
                return auslaenderAnteil_Anteil
            }
            case 3:{ // fdp ausländeranteil
                return auslaenderAnteil_Anteil
            }
            case 4:{ // GP ausländeranteil
                return auslaenderAnteil_Anteil
            }
            case 5:{ // SVP Kitaplätze
                return kindertagesstaette_Array
            }
            case 6:{ // SP Kitaplätze
                return kindertagesstaette_Array
            }
            case 7:{ // FDP Kitaplätze
                return kindertagesstaette_Array
            }
            case 8:{ // SVP Sozialhilfe
                return sozAusgabe_Array
            }
            case 9:{ // SP Sozialhilfe
                return sozAusgabe_Array
            }
            case 10:{ // FDP GemeindeSteuerfüsse
                return steuerfuesse_Array
            }
            case 11:{ // CVP Konfession (röm-kath)
                return konfessionszug_Array
            }
            case 12:{ // CVP Konfession (evang-ref)
                return konfessionszug_Array
            }
            default:{
                return -1
            }
        }
        return -1
    }
    function changeTextForSections(){
        try {
            if (activeIndex >0) {
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
                                partei: sortedParteien[i].parteien['svp'].value,
                                selected: 100*(selectedArray[j][getSectionName(activeIndex)] / summe(selectedArray, getSectionName(activeIndex)))
                            })
                        }
                    }
                }
                //console.log(array)

                var stats = new Statistics(array, vars)
                var R = stats.linearRegression('partei', 'selected')
/*                console.log('svp' +" section: " + activeIndex);
                console.log("LinReg:", R)
                console.log("CorrCoeff:", R.correlationCoefficient)*/
                return R.correlationCoefficient
            }
        }
        catch (e){
            console.log(e)
        }

    }

    function switchDropDownData(selectedPartei,topic) {
        try {
            //changeTextForSections()
            setFilling(selectedPartei,topic)
            tooltip(selectedPartei.id);

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
                //console.log(e)

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
