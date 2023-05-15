let partei_starken_Array = [
    {
        'gemeindeName': "",
        'parteien' : {
            'edu' : {
                'Name' : "Die Eidgenössisch-Demokratische Union",
                'Value' : 0,
            },
            'bdp' : {
                'Name' : "Bürgerlich-Demokratische Partei",
                'Value' : 0,
            },
            'evp' : {
                'Name' : "Evangelische Volkspartei",
                'Value' : 0,

            },
            'glp' : {
                'Name' : "Grünliberale Partei",
                'Value' : 0,

            },
            'svp' : {
                'Name' : "Schweizerische Volkspartei",
                'Value' : 0,
            },
            'cvp' : {
                'Name' : "Die Mitte",
                'Value' : 0,
            },
            'fdp' : {
                'Name' : "Die Liberalen",
                'Value' : 0,
            },
            'gp'  : {
                'Name' : "GRÜNE Partei",
                'Value' : 0,
            },
            'sp'  : {
                'Name' : "Sozialdemokratische Partei",
                'Value' : 0,
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

let responseF = [], setNumber = 0;
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
    },
    {
        id: 7,
        name: "bdp",
        color: '#FFDE00'
    },
    {
        id: 8,
        name: "edu",
        color: '#000000'
    },
]
let currentlySelectedDD = dropDownThemen[0];
var scrollVis = function () {
    // main svg used for visualization

    var svg = null;
    // d3 selection that will be used
    // for displaying visualizations
    var u = null;
    var g = null;
    var path = null;
    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [function () {}];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [function (){}];
    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.


    var lastIndex = -1;

    var activeIndex = 0;

    //projection
    const width = window.innerWidth/2
    const height = window.innerHeight
    var margin = { top: 0, left: 20, bottom: 40, right: 20 };


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
            .attr('y', height / 9)
            .attr("font-size", () => {
                return width/10
            })
            .text('2023');

        g.append('text')
            .attr('class', 'sub-title openvis-title')
            .attr('x', width / 2)
            .attr('y', (height / 9) + (height / 7))
            .attr("font-size", () => {
                return width/15
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
            .attr("stroke-width", (d) => {
                if (d.properties.gem_name !== null && !matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")) {
                    return 1
                } else {
                    return 0
                }
            }).attr("fill",  (d) => {
                if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")){
                    return "#ffffff"
                }
                else{
                    switchDropDownData(currentlySelectedDD, false, false)
                }
            }).style("visibility", "hidden")
        /*            .attr("id", (d,i) => {
                        return "mapPath" + i
                    })*/

        //g.selectAll("path").attr("opacity", 0);

        g.selectAll("#colorscale").style("opacity", 0)


        /*        const projection = d3.geoMercator().fitSize([width/2, height/2], gemeindeData)
        const path2 = d3.geoPath().projection(projection);
        var map2E = mapE.clone()
        var map2 = map2E.enter().attr("class", "map-number2")
        map2.merge(map2E).attr("d", path2)
            .attr("stroke", "#000")
            .attr("stroke-width", (d) => {
                if (d.properties.gem_name !== null && !matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")) {
                    return 1
                } else {
                    return 0
                }
            }).attr("fill",  (d) => {
            if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")){
                return "#ffffff"
            }
            else{
                switchDropDownData(currentlySelectedDD,false)
            }
        })*/



    }
    var setupSections = function () {

        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = showMapOne;
        activateFunctions[2] = showMapTwo;
        activateFunctions[3] = showMapThree;
        activateFunctions[4] = showMapFour;
        activateFunctions[5] = showMapFive;


        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < 9; i++) {
            updateFunctions[i] = function () {};
        }
    };



    function showTitle() {
        g.selectAll(".map-number1")
            .transition("hidemap")
            .duration(0)
            .style("visibility", "hidden")
        d3.select("#tooltip").style("opacity", 0)
        d3.select("#colorscale").style("opacity", 0)

        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 1.0);
    }

    function drawScale(id, interpolator) {


        var data = Array.from(Array(100).keys());

        var cScale = d3.scaleSequential()
            .interpolator(interpolator)
            .domain([0,99]);

        var xScale = d3.scaleLinear()
            .domain([0,99])
            .range([100, width-100]);
        d3.select("#" + id).style("opacity", 1)
        if (u !== null){
            u.transition().duration(0).style("background-color", (d) => {
                let c = cScale(d)
                return c
            })
        }else {
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
                .style("top", (innerHeight / 9)-30 + "px")
                .style("left", Math.floor(xScale(0)) + "px")
                .attr("font-size", 20)
                .attr("fill", "red")
                .text("0%");

            d3.select("#" + id).append("text")
                .style('position', 'absolute')
                .style("top", (innerHeight / 9)-30 + "px")
                .style("left", Math.floor(xScale(100))-39 + "px")
                .attr("font-size", 20)
                .attr("fill", "red")
                .text("100%");
        }
    }

    function showMapOne() {
        g.selectAll('.openvis-title')
            .transition()
            .duration(0)
            .attr('opacity', 0);
        g.selectAll(".map-number1")
            .style("visibility", "visible")
            .attr("fill",  (d) => {
                if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")){
                    return "#ffffff"
                }
                else{
                    switchDropDownData(currentlySelectedDD, true, true)
                }
            })
        drawScale("colorscale", d3.interpolate("#FFF", currentlySelectedDD.color))
    }

    function showMapTwo() {
        currentlySelectedDD = dropDownThemen[1]; //sp

        switchDropDownData(currentlySelectedDD, true, false)
    }

    function showMapThree() {
        currentlySelectedDD = dropDownThemen[2]; //fdp

        switchDropDownData(currentlySelectedDD, true,false)
    }

    function showMapFour() {
        currentlySelectedDD = dropDownThemen[4]; //cvp

        switchDropDownData(currentlySelectedDD, true,false)
    }
    function showMapFive() {
        currentlySelectedDD = dropDownThemen[6]; //evp

        switchDropDownData(currentlySelectedDD, true,false)
    }
    function setOppacity(selectedDDNumber){
            g.selectAll(".map-number1")
                .style("opacity", (d) => {
                    let op;
                    for (let i = 0; i < partei_starken_Array.length; i++) {
                        let optemp = choosingOpacity(selectedDDNumber, d, partei_starken_Array, i)
                        if (optemp) {
                            op = optemp;
                        }
                    }
                    return op
                })

    }
    function choosingOpacity(selectedDDNumber, d, data, i){
        if (matcher(d.properties.gem_name.toString().toLowerCase(), "bodensee")){
            return "0%"
        }
        if (data[i] !== undefined && data[i] !== null && matcher(d.properties.gem_name.toString().toLowerCase(), data[i].gemeindeName.toLowerCase())) {
            switch (selectedDDNumber) {
                case 0:
                    if (data[i].parteien.svp.value === undefined) {
                        return '0%'
                    }
                    return `${data[i].parteien.svp.value}%`
                case 1:
                    if (data[i].parteien.sp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.sp.value * 5 + 10}%`
                case 2:
                    if (data[i].parteien.fdp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.fdp.value * 5 + 10}%`
                case 3:
                    if (data[i].parteien.gp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.gp.value * 5 + 10}%`
                case 4:
                    if (data[i].parteien.cvp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.cvp.value * 5 + 10}%`
                case 5:
                    if (data[i].parteien.glp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.glp.value * 5 + 10}%`
                case 6:
                    if (data[i].parteien.evp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.evp.value * 5 + 10}%`
                case 7:
                    if (data[i].parteien.bdp.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.bdp.value * 5 + 10}%`
                case 8:
                    if (data[i].parteien.edu.value === undefined) {
                        return '10%'
                    }
                    return `${data[i].parteien.edu.value * 5 + 10}%`
                default:
                    return '0%'
            }
        }
    }
    function setFilling(selectedDD) {
        let data = partei_starken_Array;
        g.selectAll(".map-number1").style("fill", (d) => {
            for (let i = 0; i < data.length; i++) {
                if (d.properties.gem_name !== null && d.properties.gem_name !== undefined && data[i] !== null && data[i] !== undefined) {
                        return selectedDD.color
                }
            }
        })
    }

    function toolTipText(selectedDDNumber, d, dropDownVisible) {
        let text
        let themeArray = translationSelectedTheme(selectedDDNumber)
        let gemeindeName = d.properties.gem_name;
        for (let i = 0; i < partei_starken_Array.length; i++) {
            if (matcher(gemeindeName.toString().toLowerCase(), partei_starken_Array[i].gemeindeName.toLowerCase())) {
                switch (selectedDDNumber) {
                    case 0: {
                        let svp = partei_starken_Array[i].parteien.svp.value
                        text = gemeindeName + " — " + "svp: " + (svp !== undefined ? (svp) : '0') + "%";
                        if (!dropDownVisible){

                        }
                        break;
                    }
                    case 1: {
                        let sp = partei_starken_Array[i].parteien.sp.value
                        text = gemeindeName + " — " + "sp: " + (sp !== undefined ? (sp) : '0') + "%";
                        if (!dropDownVisible) {
                            if (themeArray[0][i] !== undefined) {
                                text += "\nKindertagesstätte: " + (themeArray[0][i].kindertagesstaetten === undefined ? 'Keine Daten vorhanden' : themeArray[0][i].kindertagesstaetten);
                                text += "\nBruttosozial/einwohner: " + (themeArray[1][i].brutto_sozialhilfe_je_einwohner !== undefined ? themeArray[1][i].brutto_sozialhilfe_je_einwohner : '');
                            }
                        }
                        break;
                    }
                    case 2: {
                        let fdp = partei_starken_Array[i].parteien.fdp.value
                        text = gemeindeName + " — " + "fdp: " + (fdp !== undefined ? (fdp) : '0') + "%";
                        if (!dropDownVisible){
                            text += "\nSteuerfüsse: " + (themeArray[i].gemeindesteuerfuss !== undefined ? themeArray[i].gemeindesteuerfuss: '');
                        }
                        break;
                    }
                    case 3: {
                        let gp = partei_starken_Array[i].parteien.gp.value
                        text = gemeindeName + " — " + "gp: " + (gp !== undefined ? (gp) : '0') + "%";
                        if (!dropDownVisible){

                        }
                        break;
                    }
                    case 4: {
                        let cvp = partei_starken_Array[i].parteien.cvp.value
                        text = gemeindeName + " — " + "cvp: " + (cvp !== undefined ? (cvp) : '0') + "%";
                        if (!dropDownVisible){
                            text += "\nKonfessionszugehörigkeit:\n" +
                                "Evangelisch reformiert: " + (themeArray[i].evang !== undefined ? themeArray[i].evang : "") +
                                "\nRömisch Katholisch: " + (themeArray[i].rom !== undefined ? themeArray[i].rom : "") +
                                "\nÜbrige: " + (themeArray[i].ubrige !== undefined ? themeArray[i].ubrige : "")
                        }
                        break;
                    }
                    case 5: {
                        let glp = partei_starken_Array[i].parteien.glp.value
                        text = gemeindeName + " — " + "glp: " + (glp !== undefined ? (glp) : '0') + "%";
                        if (!dropDownVisible){

                        }
                        break;
                    }
                    case 6: {
                        let evp = partei_starken_Array[i].parteien.evp.value
                        text = gemeindeName + " — " + "evp: " + (evp !== undefined ? (evp) : '0') + "%";
                        if (!dropDownVisible){
                            text += "\nKonfessionszugehörigkeit:\n" +
                                "Evangelisch reformiert: " + (themeArray[i].evang !== undefined ? themeArray[i].evang : "") +
                                "\nRömisch Katholisch: " + (themeArray[i].rom !== undefined ? themeArray[i].rom : "") +
                                "\nÜbrige: " + (themeArray[i].ubrige !== undefined ? themeArray[i].ubrige : "")
                        }
                        break;
                    }
                    case 7: {
                        let bdp = partei_starken_Array[i].parteien.bdp.value
                        text = gemeindeName + " — " + "bdp: " + (bdp !== undefined ? (bdp) : '0') + "%";
                        if (!dropDownVisible){

                        }
                        break;
                    }
                    case 8: {
                        let edu = partei_starken_Array[i].parteien.edu.value
                        text = gemeindeName + " — " + "edu: " + (edu !== undefined ? (edu) : '0') + "%";
                        if (!dropDownVisible){

                        }
                        break;
                    }
                    default: {
                        text = partei_starken_Array[i].gemeindeName
                    }
                }
            }
        }
        return text;
    }

    function tooltip(selectedDDNumber, dropDownVisible) {
        let tooltipP = null;

        g.selectAll(".map-number1")
            .on("mouseover", function(e, d) {
                tooltipP = d3.select('#tooltip').append('p').attr('class', 'tooltip');
                d3.select('#vis').selectAll('tooltip').remove();

                e.target.attributes.getNamedItem("stroke").value = "#FFF";
                e.target.attributes.getNamedItem("stroke-width").value = 5;

            })

            .on("mousemove", function (e,d){
                let text = toolTipText(selectedDDNumber, d, dropDownVisible);
                d3.select("#tooltip").style("opacity", 1)

                tooltipP
                    .style('position', 'absolute')
                    .style('z-index', 10000000)
                    .style("color", "black")
                    .style("font-weight", "bold")
                    .style("left", (d3.pointer(e)[0])+ "px")
                    .style("top", (d3.pointer(e)[1] -50) + "px")
                    .text(text)

            })
            .on("mouseout", (e) => {
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


    d3.select('#filter').on("change", (e) => {
        currentlySelectedDD = dropDownThemen[e.target.value];
        switchDropDownData(currentlySelectedDD, true, true);
    });

    function translationSelectedTheme(selectedDropDownID){
        switch (selectedDropDownID){
            case 0:{//svp
                break;
            }
            case 1:{//sp
                return [kindertagesstaette_Array, sozAusgabe_Array]
            }
            case 2:{ //fdp
                return steuerfuesse_Array
            }
            case 3:{//die Grünen
                break;
            }
            case 4:{//cvp
                return konfessionszug_Array
            }
            case 5:{//glp
                break;
            }
            case 6:{//evp
                return konfessionszug_Array
            }
            case 7:{//bdp
                break;
            }
            case 8:{// edu
                break;
            }
        }
        return 0

    }

    function switchDropDownData(selectedDD, showAll, DropDownSectionVisible) {
        try {
            setFilling(selectedDD)
            if (showAll || showAll === undefined) {
                setOppacity(selectedDD.id);
                tooltip(selectedDD.id, DropDownSectionVisible);
                drawScale("colorscale", d3.interpolate("#FFF", selectedDD.color))
            }
        }catch (e){
            console.log("switchDropDownData Didnt Work")
        }
//        g.selectAll(".map-number1").data(translationSelectedTheme(set)).transition().delay(100).duration(1000)
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
                console.log("Scroll to Top and reload Page")
            }
        })
        lastIndex = activeIndex;
    };

    /**
     * update
     *
     * @param index
     * @param progress
     */
    chart.update = function (index, progress) {
        try {
        updateFunctions[index](progress);
        } catch (e){
            console.log("Scroll to Top and reload Page")
        }
    };

    // return chart function
    return chart;
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
    d3.selectAll(".lastStep").style("height", innerHeight/2 + "px")
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

    scroll.on('progress', function (index, progress) {
        plot.update(index, progress);
    });

}


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
                        edu: {
                            value: fields['edu']
                        },
                        bdp: {
                            value: fields['bdp']
                        },
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
            setNumber = 0;
        }
        if (set === "konfessionszugehoerigkeit") {
            for (let i = 0; i<jsonDataE.records.length; i++) {
                if (i === 0) {
                    konfessionszug_Array.splice(0,1);
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

        }
        if (set === "kindertagesstaette") {
            for (let i = 0; i<jsonDataE.records.length; i++) {
                if (i === 0) {
                    kindertagesstaette_Array.splice(0,1);
                }
                let fields = jsonDataE.records[i].fields;
                kindertagesstaette_Array.push({
                    gemeindeName: fields['politische_gemeinde'],
                    kindertagesstaetten: fields['anzahl_platze']
                })
            }
            kindertagesstaette_Array = sortData(kindertagesstaette_Array, "kindertagesstaetten");
            responseF.push(kindertagesstaette_Array);
        }
        if (set === "steuerfuesse") {
            for (let i = 0; i<jsonDataE.records.length; i++) {
                if (i === 0) {
                    steuerfuesse_Array.splice(0,1);
                }
                let fields = jsonDataE.records[i].fields;
                steuerfuesse_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    gemeindesteuerfuss: fields['gemeindesteuerfuss']
                })
            }
            steuerfuesse_Array = sortData(steuerfuesse_Array, "gemeindesteuerfuss");
            responseF.push(steuerfuesse_Array);
        }
        if (set === "sozAusgabe") {
            for (let i = 0; i<jsonDataE.records.length; i++) {
                if (i === 0) {
                    sozAusgabe_Array.splice(0,1);
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
            for (let i = 0; i<jsonDataE.records.length; i++) {
                if (i === 0) {
                    auslaenderInt_Array.splice(0,1);
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

            for (let i = 0; i<bevoelkerung.records.length; i++) {
                if (i === 0) {
                    wohnbevoelkerung_Array.splice(0,1);
                }
                let fields = bevoelkerung.records[i].fields;
                wohnbevoelkerung_Array.push({
                    gemeindeName: fields['gemeinde_name'],
                    bevoelkerung: parseInt(fields['anzahl_personen'])
                })
            }
            for (let j = 0; j<auslaenderInt_Array.length; j++) {
                if (j === 0) {
                    auslaenderAnteil_Anteil.splice(0,1);
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
async function fetchThis(set){
    let dataset;
    let query;
    let rows = 80;
    let sort;
    switch (set){
        case "partei_starken":
            dataset = "sk-stat-9";
            query = "2020";
            break;
        case "konfessionszugehoerigkeit":{
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
    if (rows !== undefined){
        url+= "&rows=" + rows;
    }
    if (query !== undefined){
        url+="&q=" + query;
    }
    return await fetch(url);
}
function sortData(arraySet, field) {
    return arraySet.sort((a,b) => {
        return (a[field] - b[field])
    })
}

let set = ["partei_starken", "konfessionszugehoerigkeit", "kindertagesstaette", "steuerfuesse", "sozAusgabe", "auslaenderAnteil_Anteil"]
fuse(set).then(data => {
    display(data)
})
