var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', "https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=ATFmpM10EdGnaqk6xdcBDEpRbP0G43yi&origin=HOU&destination=LON&departure_date=2018-12-25&adults=1&children=1&number_of_results=5");
ourRequest.onload = function () {
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData.results[0]);
};
ourRequest.send();

$(document).ready(() => {
    $('input[name="daterange"]').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
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

