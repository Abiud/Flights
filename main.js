var ourRequest = new XMLHttpRequest();

var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

let startDate;
let endDate;
let cor_arr = [];
let places = [];
const api = 'ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi';
let url = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${api}`;

$(document).ready(function () {
    $("#search").click(function (e) {
        a = b;
        e.preventDefault();
        const firstCity = $("#aa-search-input").val();
        const secondCity = $("#aa-search-input2").val();
        startDate = $("#date").data('daterangepicker').startDate.format('YYYY-MM-DD');
        endDate = $("#date").data('daterangepicker').endDate.format('YYYY-MM-DD');
        adults = $('#people').val();
        if (!adults) {
            adults = 1;
        }
        res = urlMaker(firstCity, secondCity, startDate, endDate, adults);
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

function urlMaker(origin, destination, start, end, people) {
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

    return `${url}&origin=${origin}&destination=${destination}&departure_date=${start}${(end == "") ? '' : "&return_date=" + end}&number_of_results=1&adults=${people}`;
    // https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi&origin=HOU&destination=LON&departure_date=2018-12-25&adults=1&children=1&number_of_results=5&fbclid=IwAR2QjxawL-O_95UHajFwU_A31xnWL2BtU-Fat7Rs-Fhxn_XDxcaPRGui8Hw
}

function getFlight(req) {
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: req
    }).done(function (data) {
        plotMap(data);
        showDetails(data);
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
    x = d.results[0].itineraries[0].outbound;
    $('#options').slideUp();
    $('#details').slideDown();
    $('.total_price').text(`$${d.results[0].fare.total_price}`);
    $('.refund').text(`${x.duration} hours`);
    $('.dep1').text(`From: ${dFormat(x.flights[0].departs_at)}`);
    $('.arr1').text(`To: ${dFormat(x.flights[0].arrives_at)}`);
    $('.air1').text(`Airline: ${x.flights[0].operating_airline}`);
    $('.city1').html(`<p>Departure: ${places[0].city}<span class="country1"></span></p>`);
    $('.country1').text(`, ${places[0].country}`);
    if (x.flights.length == 2) {
        $('.city2').html(`<p>Destination: ${places[1].city}<span class="country2"></span></p>`);
        $('.country2').text(`, ${places[1].country}`);
        $('.dep2').text(`From: ${dFormat(x.flights[1].departs_at)}`);
        $('.arr2').text(`To: ${dFormat(x.flights[1].arrives_at)}`);
        $('.air2').text(`Airline: ${x.flights[1].operating_airline}`);
        $('#arrow2').hide();
    } else if (x.flights.length > 2) {
        $('#info-body > div').removeClass('col-sm-4');
        $('#info-body > div').addClass('col-sm-3');
        $('.city2').html(`<p>${places[1].city}<span class="country2"></span></p>`);
        $('.dep2').text(`From: ${dFormat(x.flights[1].departs_at)}`);
        $('.arr2').text(`To: ${dFormat(x.flights[1].arrives_at)}`);
        $('.air2').text(`Airline: ${x.flights[1].operating_airline}`);
        $('#info-body > div').attr('hidden', false);
        $('.city3').html(`<p>Destination: ${places[2].city}<span class="country2"></span></p>`);
        $('.dep3').text(`From: ${dFormat(x.flights[2].departs_at)}`);
        $('.arr3').text(`To: ${dFormat(x.flights[2].arrives_at)}`);
        $('.air3').text(`Airline: ${x.flights[2].operating_airline}`);
    }
}

function dFormat(date) {
    return moment(date).format('MM/DD/YY HH:mm');
}


b = a = {
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
    /**
     * Create the map
     */
    var map = AmCharts.makeChart("chartdiv", a);
}

function readFile() {
    $.getJSON("./airports.json", function (data) {
        cor_arr = data;
    });
}

function search(airport) {
    return cor_arr[airport];
}

function plotMap(data) {
    x = data.results[0].itineraries[0].outbound;
    storeObj = [];
    for (let i = 0; i < x.flights.length; i++) {
        if (i > 0) {
            storeObj.push(search(x.flights[i].destination.airport));
        } else {
            storeObj.push(search(x.flights[i].origin.airport));
        }
        a.dataProvider.images.unshift({
            "svgPath": targetSVG,
            "title": storeObj[i].city,
            "latitude": storeObj[i].latitude,
            "longitude": storeObj[i].longitude
        });
        places.push({
            "city": storeObj[i].city,
            "country": storeObj[i].country
        });
    }
    if (storeObj.length == 1) {
        a.dataProvider.lines.unshift({
            "id": "line1",
            "arc": -0.85,
            "alpha": 0.3,
            "latitudes": [storeObj[0].latitude, storeObj[1].latitude],
            "longitudes": [storeObj[0].longitude, storeObj[1].longitude]
        });
    } else if (storeObj.length == 2) {
        a.dataProvider.lines.push({
            "id": "line1",
            "arc": -0.85,
            "alpha": 0.3,
            "latitudes": [storeObj[0].latitude, storeObj[1].latitude],
            "longitudes": [storeObj[0].longitude, storeObj[1].longitude]
        })
    } else if (storeObj.length == 3) {
        a.dataProvider.lines.push({
            "id": "line1",
            "arc": -0.85,
            "alpha": 0.3,
            "latitudes": [storeObj[0].latitude, storeObj[1].latitude, storeObj[2].latitude],
            "longitudes": [storeObj[0].longitude, storeObj[1].longitude, storeObj[2].longitude]
        },
            {
                "id": "line2",
                "alpha": 0,
                "color": "#000000",
                "latitudes": [storeObj[0].latitude, storeObj[1].latitude, storeObj[2].latitude],
                "longitudes": [storeObj[0].longitude, storeObj[1].longitude, storeObj[2].longitude]
            });
    }

    generateChart();
}