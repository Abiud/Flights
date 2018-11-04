var ourRequest = new XMLHttpRequest();

let startDate;
let endDate;
let cor_arr = [];
const api = 'ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi';
let url = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${api}`;

$(document).ready(function () {
    $("#search").click(function (e) {
        e.preventDefault();
        const firstCity = $("#aa-search-input").val();
        const secondCity = $("#aa-search-input2").val();
        startDate = $("#date").data('daterangepicker').startDate.format('YYYY-MM-DD');
        endDate = $("#date").data('daterangepicker').endDate.format('YYYY-MM-DD');
        res = urlMaker(firstCity, secondCity, startDate, endDate);
        getFlight(res);
    });

    $(document).ajaxStart(() => {
        $('#chartdiv').addClass('overlay');
        $('.spinner').attr('hidden', false);  // show Loading Div
    }).ajaxStop(() => {
        $('.spinner').attr('hidden', true); // hide loading div
        $('#chartdiv').removeClass('overlay');
    });

    generateChart();
});

function urlMaker(origin, destination, start, end) {
    if (origin == '') {
        $('#aa-search-input').addClass('warning');
        return;
    } else {
        $('#aa-search-input').removeClass('warning');
    }

    if (destination == '') {
        $('#aa-search-input2').addClass('warning');
        return;
    } else {
        $('#aa-search-input2').removeClass('warning');
    }

    if (start == end) {
        end = '';
    }

    return `${url}&origin=${origin}&destination=${destination}&departure_date=${start}${(end == "") ? '' : "&return_date=" + end}&number_of_results=1&adults=1`;
    // https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi&origin=HOU&destination=LON&departure_date=2018-12-25&adults=1&children=1&number_of_results=5&fbclid=IwAR2QjxawL-O_95UHajFwU_A31xnWL2BtU-Fat7Rs-Fhxn_XDxcaPRGui8Hw
}

function getFlight(req) {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: req
    }).done(function (data) {
        showDetails(data);
        plotMap(data);
        console.log(a);
    }).fail((err) => {
        if (err.status == 400) {
            $('#exampleModal').modal('show');
        }
    });
}
// , function (start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
// }

$(document).ready(() => {
    readFile();
    $('input[name="daterange"]').daterangepicker({
        opens: 'center'
    }, {
            function(start, end) {
                startDate = start.format('YYYY-MM-DD');
                endDate = end.format('YYYY-MM-DD');
            }
        });

    $(window).resize(function () {
        /*If browser resized, check width again */
        if ($(window).width() < 514) {
            $('.card').removeClass('fixed-top');
            $('#chartdiv').removeClass('chart');
        } else {
            $('.card').addClass('fixed-top');
            $('#chartdiv').addClass('chart');
        }
    });
});

function showDetails(d) {
    console.log(d);
    x = d.results[0].itineraries[0].outbound;
    $('#options').slideUp();
    $('#details').slideDown();
    $('.total_price').text(d.results[0].fare.total_price);
    $('.refund').text(x.duration);
    $('.dep1').text(dFormat(x.flights[0].departs_at));
    $('.arr1').text(dFormat(x.flights[0].arrives_at));
    $('.air1').text(x.flights[0].operating_airline);
    if (x.flights.length == 2) {
        $('.dep2').text(dFormat(x.flights[1].departs_at));
        $('.arr2').text(dFormat(x.flights[1].arrives_at));
        $('.air2').text(x.flights[1].operating_airline);
    } else if (x.flights.length > 2) {
        $('#info-body > div').removeClass('col-sm-4');
        $('#info-body > div').addClass('col-sm-3');
        $('.dep2').text(dFormat(x.flights[1].departs_at));
        $('.arr2').text(dFormat(x.flights[1].arrives_at));
        $('.air2').text(x.flights[1].operating_airline);
        $('#info-body > div').attr('hidden', false);
        $('.dep3').text(dFormat(x.flights[2].departs_at));
        $('.arr3').text(dFormat(x.flights[2].arrives_at));
        $('.air3').text(x.flights[2].operating_airline);
    }
}

function dFormat(date) {
    return moment(date).format('MM/DD/YY HH:mm');
}


a = {
    "type": "map",
    "theme": "dark",


    "dataProvider": {
        "map": "worldLow",
        "zoomLevel": 1,
        "zoomLongitude": 0,
        "zoomLatitude": 30,

        "lines": [],
        "images": [{
            "svgPath": planeSVG,
            "positionOnLine": 0,
            "color": "#000000",
            "alpha": 0.1,
            "animateAlongLine": true,
            "lineId": "line2",
            "flipDirection": true,
            "loop": true,
            "scale": 0.03,
            "positionScale": 1.3
        }, {
            "svgPath": planeSVG,
            "positionOnLine": 0,
            "color": "#585869",
            "animateAlongLine": true,
            "lineId": "line1",
            "flipDirection": true,
            "loop": true,
            "scale": 0.03,
            "positionScale": 1.8
        }]
    },

    "areasSettings": {
        "unlistedAreasColor": "#8dd9ef"
    },

    "imagesSettings": {
        "color": "#585869",
        "rollOverColor": "#585869",
        "selectedColor": "#585869",
        "pauseDuration": 0.2,
        "animationDuration": 2.5,
        "adjustAnimationSpeed": true
    },

    "linesSettings": {
        "color": "#585869",
        "alpha": 0.4
    },

    "export": {
        "enabled": true
    }

}


function generateChart(info) {
    // CHART
    /**
         * SVG path for target icon
         */
    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    /**
     * SVG path for plane icon
     */
    var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";

    /**
     * Create the map
     */
    var map = AmCharts.makeChart("chartdiv", a);
}

// {
//     "type": "map",
//     "theme": "dark",


//     "dataProvider": {
//         "map": "worldLow",
//         "zoomLevel": 3,
//         "zoomLongitude": -55,
//         "zoomLatitude": 42,

//         "lines": [{
//             "id": "line1",
//             "arc": -0.85,
//             "alpha": 0.3,
//             "latitudes": [51.1657, 43.8163, 34.3, 23],
//             "longitudes": [19.4515, -79.4287, -118.15, -82]
//         }, {
//             "id": "line2",
//             "alpha": 0,
//             "color": "#000000",
//             "latitudes": [48.8567, 43.8163, 34.3, 23],
//             "longitudes": [2.3510, -79.4287, -118.15, -82]
//         }],
//         "images": [{
//             "svgPath": targetSVG,
//             "title": "Germany",
//             "latitude": 51.1657,
//             "longitude": 19.4515
//         }, {
//             "svgPath": targetSVG,
//             "title": "Toronto",
//             "latitude": 43.8163,
//             "longitude": -79.4287
//         }, {
//             "svgPath": targetSVG,
//             "title": "Los Angeles",
//             "latitude": 34.3,
//             "longitude": -118.15
//         }, {
//             "svgPath": targetSVG,
//             "title": "Havana",
//             "latitude": 23,
//             "longitude": -82
//         }, {
//             "svgPath": planeSVG,
//             "positionOnLine": 0,
//             "color": "#000000",
//             "alpha": 0.1,
//             "animateAlongLine": true,
//             "lineId": "line2",
//             "flipDirection": true,
//             "loop": true,
//             "scale": 0.03,
//             "positionScale": 1.3
//         }, {
//             "svgPath": planeSVG,
//             "positionOnLine": 0,
//             "color": "#585869",
//             "animateAlongLine": true,
//             "lineId": "line1",
//             "flipDirection": true,
//             "loop": true,
//             "scale": 0.03,
//             "positionScale": 1.8
//         }]
//     },

//     "areasSettings": {
//         "unlistedAreasColor": "#8dd9ef"
//     },

//     "imagesSettings": {
//         "color": "#585869",
//         "rollOverColor": "#585869",
//         "selectedColor": "#585869",
//         "pauseDuration": 0.2,
//         "animationDuration": 2.5,
//         "adjustAnimationSpeed": true
//     },

//     "linesSettings": {
//         "color": "#585869",
//         "alpha": 0.4
//     },

//     "export": {
//         "enabled": true
//     }

// }


function readFile() {
    $.getJSON("./airports.json", function (data) {
        cor_arr = data;
    });
}

function search(airport) {
    return cor_arr.filter(item => {
        return item.iata == airport;
    });
}

function plotMap(data) {

}