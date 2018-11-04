var ourRequest = new XMLHttpRequest();

let startDate;
let endDate;
const api = 'ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi';
let url = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${api}`;

$(document).ready(function () {
    $("button").click(function (e) {
        e.preventDefault();
        const firstCity = $("#aa-search-input").val();
        const secondCity = $("#aa-search-input2").val();
        startDate = $("#date").data('daterangepicker').startDate.format('YYYY-MM-DD');
        endDate = $("#date").data('daterangepicker').endDate.format('YYYY-MM-DD');
        res = urlMaker(firstCity, secondCity, startDate, endDate);
        getFlight(res);
    });

    $(document).ajaxStart(() => {
        console.log('hi');
        $('#chartdiv').addClass('overlay');
        $('.spinner').attr('hidden', false);  // show Loading Div
    }).ajaxStop(() => {
        $('.spinner').attr('hidden', true); // hide loading div
        $('#chartdiv').removeClass('overlay');
    });
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
        console.log('one way trip');
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
        console.log(data.results[0]);
    }).fail((err) => {
        if (err.status == 400) {
            $('#myModal').modal('show');
        }
    });

}
// , function (start, end, label) {
//     console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
// }

$(document).ready(() => {
    $('input[name="daterange"]').daterangepicker({
        opens: 'center'
    }, {
            function(start, end) {
                console.log(start);
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

