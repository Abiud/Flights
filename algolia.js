var client = algoliasearch('SCYZ1SP4ED', '0cc2796f4e2293606fb3a67e289a8317');
var index = client.initIndex('cities');
//initialize autocomplete on search input (ID selector must match)
$('#aa-search-input').autocomplete(
    { hint: false }, [
        {
            source: $.fn.autocomplete.sources.hits(index, { hitsPerPage: 5 }),
            //value to be displayed in input control after user's suggestion selection
            displayKey: 'city',
            //hash of templates used when rendering dataset
            templates: {
                //'suggestion' templating function used to render a single suggestion
                suggestion: function (suggestion) {
                    return '<span>' +
                        suggestion._highlightResult.city.value + '</span> <span>' +
                        suggestion._highlightResult.iata.value + '</span>';
                }
            }
        }
    ]);

$('#aa-search-input2').autocomplete(
    { hint: false }, [
        {
            source: $.fn.autocomplete.sources.hits(index, { hitsPerPage: 5 }),
            //value to be displayed in input control after user's suggestion selection
            displayKey: 'city',
            //hash of templates used when rendering dataset
            templates: {
                //'suggestion' templating function used to render a single suggestion
                suggestion: function (suggestion) {
                    return '<span>' +
                        suggestion._highlightResult.city.value + '</span> <span>' +
                        suggestion._highlightResult.iata.value + '</span>';
                }
            }
        }
    ]);