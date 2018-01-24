$.fn.dataTable.minLengthFilter = function (opts) {

    // Configuration options
    var conf = $.extend({
        minLength: 3
    }, opts);

    return function (oSettings) {
        var filter = $(oSettings.nTableWrapper).find(" .dataTables_filter input").val();
        return (filter && (filter.length == 0 || filter.length >= conf.minLength));
    };
};

//
// Pipelining function for DataTables. To be used to the `ajax` option of DataTables
//
$.fn.dataTable.pipeline = function (opts, data) {
    // Configuration options
    var conf = $.extend({
        pages: 1,     // number of pages to cache
        url: '',      // script url
        data: data,   // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);

    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function (request, drawCallback, settings) {
        var ajax = false;
        var requestStart = request.start;
        var drawStart = request.start;
        var requestLength = request.length;
        var requestEnd = requestStart + requestLength;

        if (settings.clearCache) {
            // API requested that the cache be cleared
            ajax = true;
            settings.clearCache = false;
        }
        else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
        }
        else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                  JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                  JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
        ) {
            // properties changed (ordering, columns, searching)
            ajax = true;
        }

        // Store the request for checking next time around
        cacheLastRequest = $.extend(true, {}, request);

        if (ajax) {
            // Need data from the server
            if (requestStart < cacheLower) {
                requestStart = requestStart - (requestLength * (conf.pages - 1));

                if (requestStart < 0) {
                    requestStart = 0;
                }
            }

            cacheLower = requestStart;
            cacheUpper = requestStart + (requestLength * conf.pages);

            request.start = requestStart;
            request.length = requestLength * conf.pages;

            // Provide the same `data` options as DataTables.
            if ($.isFunction(conf.data)) {
                // As a function it is executed with the data object as an arg
                // for manipulation. If an object is returned, it is used as the
                // data object to submit
                var d = conf.data(request);
                if (d) {
                    $.extend(request, d);
                }
            }
            else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
            }

            var defaultRequest = conf.data();
            defaultRequest.echo = request.draw;
            defaultRequest.start = request.start;
            defaultRequest.length = request.length;
            defaultRequest.bRegex = request.search.regex;
            defaultRequest.search = request.search.value;
            defaultRequest.direction = request.order[0].dir;
            defaultRequest.sort = request.columns[request.order[0].column].data;

            settings.jqXHR = $.ajax({
                "type": conf.method,
                "url": conf.url,
                "data": defaultRequest,
                "dataType": "json",
                "cache": false,
                "success": function (json) {

                    var datatableJson = {
                        sEcho: request.draw,
                        iTotalRecords: json.RowCount,
                        iTotalDisplayRecords: json.FilteredRowCount || json.RowCount,
                        aaData: json.Rows
                    };

                    cacheLastJson = $.extend(true, {}, datatableJson);

                    if (cacheLower != drawStart) {
                        datatableJson.aaData.splice(0, drawStart - cacheLower);
                    }
                    if (requestLength >= -1) {
                        datatableJson.aaData.splice(requestLength, datatableJson.aaData.length);
                    }

                    drawCallback(datatableJson);
                }
            });
        }
        else {
            json = $.extend(true, {}, cacheLastJson);
            json.draw = request.draw; // Update the echo for each response
            json.aaData.splice(0, requestStart - cacheLower);
            json.aaData.splice(requestLength, json.aaData.length);

            drawCallback(json);
        }
    }
};

// Register an API method that will empty the pipelined data, forcing an Ajax
// fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTable.Api.register('clearPipeline()', function () {
    return this.iterator('table', function (settings) {
        settings.clearCache = true;
    });
});