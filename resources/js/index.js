/*https://bost.ocks.org/mike/map/
https://github.com/zcreativelabs/SfGZ-d3-map
https://medium.com/@mila_frerichs/how-to-create-a-simple-tooltip-in-d3-js-45040afada07
scroller: https://towardsdatascience.com/how-i-created-an-interactive-scrolling-visualisation-with-d3-js-and-how-you-can-too-e116372e2c73
https://info474-s17.github.io/book/scrolling.html
Rewind map:https://observablehq.com/@bumbeishvili/rewind-geojson */

let partei_starken_Array = [
    {
        'gemeindeName': "",
        'parteien' : {
            'edu' : {
                'Name' : "edu",
                'Value' : 0
            },
            'bdp' : {
                'Name' : "bdp",
                'Value' : 0
            },
            'evp' : {
                'Name' : "evp",
                'Value' : 0
            },
            'glp' : {
                'Name' : "glp",
                'Value' : 0
            },
            'svp' : {
                'Name' : "svp",
                'Value' : 0
            },
            'cvp' : {
                'Name' : "cvp",
                'Value' : 0
            },
            'fdp' : {
                'Name' : "fdp",
                'Value' : 0
            },
            'gp'  : {
                'Name' : "gp",
                'Value' : 0
            },
            'sp'  : {
                'Name' : "sp",
                'Value' : 0
            },
        }
    }
];
let wohnbev_Array = [{
    gemeindeName: '',
    jahr: 0,
    bewilligung_code: 0,
    anzahl_personen: 0
}]
let energie_Array = [
    {
        gemeindeName: '',
        jahr: 0,
        einwohner: 0,
        total_energie: 0,
        energiebezugsflache: 0,
        elektrizität: 0,
        solarwarme: 0,
        umweltwarme: 0,
        fernwaerme: 0,
        holzenergie: 0,
        erdgas: 0,
        erdoelbrennstoffe: 0,
        andere: 0,
        erneuerbare_energie: 0,
        fossile_energie: 0
    }
]
let responseF, setNumber = 0;
/*thurgau-gemeinde.geojson*/
/**
 * gets the json data of thurgau and projects them
 */
d3.json("/resources/geojson/thurgau-gemeinde.geojson")
    .then((gemeinde) => {

        const dropDownThemen = [
            {
                id: 0,
                name: "partei_starken"
            },
            {
                id: 1,
                name: "wohnbevölkerung"
            },
            {
                id: 2,
                name: "energie"
            },
            {
                id: 3,
                name: "steuerfüsse"
            },
        ]
        let currentlySelectedDD = dropDownThemen[0];


        //projection
        const width = window.innerWidth
        const height = window.innerHeight

        const svg = d3.select("svg").attr("viewBox", "0 0 800 600")
        let translation = {width: width/2,height:  height/2};
        let scale = 1;
        let center = {x: 1.25, y: 0.5};
        const projection = projectIT(d3, translation, center,scale);
        const path = d3.geoPath().projection(projection);

        //display on map
        let counter = -1;
        let set = currentlySelectedDD.name
        fuse(set).then(data => {
            svg.selectAll("path")
                .data(gemeinde.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("stroke", "#000")
                .attr("stroke-width", d => {
                    if (d.properties.gem_name !== null && d.properties.gem_name[0] !== 'Bodensee (TG)') {
                        return 1
                    } else {
                        return 0
                    }
                })
                .style("fill", d => {
                    if (d.properties.gem_name !== null && d.properties.gem_name[0] !== 'Bodensee (TG)') {
                        //console.log(MAX.filter(mx => mx.canton === d.properties.gem_name[0]))
                        //console.log(d.properties.gem_name.includes(MAX[0].canton))
                        //console.log(MIN)
                        /*counter++;
                        return choosingColorD(set, d, data, counter);*/
                        return "#ff0000"
                    }

                })
                .style("opacity", d => {
                    counter++;
                    return choosingOpacity(set, d, data, counter)
                })



                const DDfilter = d3.select('#filter').on("change", (e) => {
                    currentlySelectedDD = dropDownThemen[e.target.value];
                    //displayOnMap(currentlySelectedDD.name, svg, gemeinde, path, counter)
                    /*svg.selectAll("path").transition()
                        .duration(250)
                        .attr("fill", (d) => {
                            return "#008C95"
                        })

                     */
                })
                //tooltip
            let count= 0;
            svg.selectAll("path")
                .on("mouseover", (e, d) => {
                    let currentTheme = translationSelectedTheme(currentlySelectedDD.id)
                    let svp;
                    let gemeindeName = d.properties.gem_name;
                    for (let i= 0; i < currentTheme.length; i++) {
                        //console.log(d.properties.gem_name + ' ' + currentTheme[i].gemeindeName )
                        if (gemeindeName == currentTheme[i].gemeindeName) {
                            svp = currentTheme[i].parteien.svp.value
                        }
                    }

                    d3.select("#info")
                        .style("color", "#ff0000")
                        .style("opacity", choosingOpacity(currentlySelectedDD.name, d, currentlySelectedDD.id, count))
                        .text(gemeindeName + " — " + (svp !== undefined ? ("svp:" + svp + "%") : ''))
                        .style("visibility", "visible");

                })

        })
    })

function translationSelectedTheme(selectedDropDownID){
    switch (selectedDropDownID){
        case 0:{
            return partei_starken_Array;
        }
        case 1:{
            return wohnbev_Array;
        }
        case 2: {
            return energie_Array;
        }
    }
}


async function fuse(set){
    let responseE = await fetchThis(set);
    let jsonDataE = await responseE.json();
    if (set === "partei_starken"){
        for (let i = 0; i < jsonDataE.records.length; i++){ // 80
            if (i === 0){
                partei_starken_Array.splice(0,1,);
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
        responseF = partei_starken_Array;
        setNumber = 0;
        partei_starken_Array = sortData(partei_starken_Array, "parteien.svp.value");
    }
    if (set === "wohnbevölkerung"){
        for (let i = 0; i < jsonDataE.records.length; i++){
            if (i === 0){
                wohnbev_Array.splice(0,1,);
            }
            let fields = jsonDataE.records[i].fields;
            wohnbev_Array.push({
                gemeindeName: fields['gemeinde_name'],
                anzahl_personen: fields['anzahl_personen'],
                jahr: fields ['jahr'],
                bewilligung_code: fields ['bewilligung_code']
            })
        }
        responseF = wohnbev_Array;
        setNumber = 1;
        wohnbev_Array = sortData(wohnbev_Array, "anzahl_personen")
    }
    if (set === "energie") {
        for (let i = 0; i< jsonDataE.records.length; i++) {
            if (i === 0) {
                energie_Array.splice(0,1,);
            }
            let fields = jsonDataE.records[i].fields;
            energie_Array.push({
                gemeindeName: fields['gemeinde_name'],
                jahr: fields['jahr'],
                einwohner: fields['einwohner'],
                total_energie: fields['total'],
                energiebezugsflache: fields['energiebezugsflaeche'],
                elektrizität: fields['elektrizitaet'],
                solarwarme: fields['solarwaerme'],
                umweltwarme: fields['umweltwaerme'],
                fernwaerme: fields['fernwaerme'],
                holzenergie: fields['holzenergie'],
                erdgas: fields['erdgas'],
                erdoelbrennstoffe: fields['erdoelbrennstoffe'],
                andere: fields['andere'],
                erneuerbare_energie: this.elektrizität + this.solarwarme + this.umweltwarme + this.fernwaerme + this.holzenergie,
                fossile_energie: this.erdgas + this.erdoelbrennstoffe + this.andere
            })
        }
        responseF = energie_Array;
        setNumber = 2;
    }
    if (set === "steuerfüsse"){
        //left out
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
        case "steuerfüsse":
            dataset = "sk-stat-70"
            query = "2022"
            break;
        case "wohnbevölkerung":
            dataset = "sk-stat-61"
            query = "2022"
            break;
        case "energie":
            dataset = "div-energie-5"
            query = "2020"
            break;
        default:
            console.log("Not sure what to Fetch");
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


/**
 * projection of the map
 * @param dD map element (d3)
 * @param translation
 * @param center
 * @returns {*} projection for more procession
 */
function projectIT(dD, translation, center, scale){
    return dD.geoMercator()
        .translate([translation.width, translation.height])
        .rotate([-7.43864, -46.95108, 0])
        .center([center.x, center.y])
        .scale(80000 * scale)
}

/**
 * chooses colors for the heighest and lowest numbers given
 * @param d gemeinden from map
 * @param data gemeinden from dataset
 * @param i index for gemeinden from dataset
 * @returns {string} --> color
 */
function choosingColorD(set, d, setnumber, i){
    let data = translationSelectedTheme(setNumber);
    //example for coloring the parties
    if (data[i] !== undefined && data[i] !== null) {
        if (set === 'partei_starken') {
            if (data[i].parteien.svp.value >= 40) {
                return "#ff0000"
            }
        }
        if (set === "wohnbevölkerung") {
            if (data[i].bewilligung_code === 3) {
                return "#008C95"
            }
        }
    }
}

function choosingOpacity(set, d, setnumber, i){
    let data = translationSelectedTheme(setNumber);
    //example for coloring the parties
    if (data[i] !== undefined && data[i] !== null) {
        if (set === 'partei_starken') {
            return `${data[i].parteien.svp.value}%`
        }
        if (set === "wohnbevölkerung") {
            if (data[i].bewilligung_code === 3) {
                return "#008C95"
            }
        }
    }
}


function sortData(arraySet, field) {
    return arraySet.sort((a,b) => {
        return (a[field] - b[field])
    })
}