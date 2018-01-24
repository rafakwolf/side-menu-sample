$.fn.dataTable.requestArrayToObject = function (aoData) {
    var columns = 0;
    var request = {};
    var sortColumn = -1;
    for (var i = 0, iLen = aoData.length ; i < iLen ; i++) {
        switch (aoData[i].name) {
            case 'sEcho':
                request['echo'] = aoData[i].value;
                break;
            case 'iDisplayStart':
                request['start'] = aoData[i].value;
                break;
            case 'iDisplayLength':
                request['length'] = aoData[i].value;
                break;
            case 'iColumns':
                columns = aoData[i].value;
                break;
            case 'sSearch':
                request['search'] = aoData[i].value;
                break;
            case 'iSortCol_0':
                sortColumn = aoData[i].value;
                break;
            case 'sSortDir_0':
                request['direction'] = aoData[i].value;
                break;
            default:
                if (aoData[i].name.indexOf('iSortCol_') == -1 &&
                    aoData[i].name.indexOf('iSortDir_') == -1 &&
                    aoData[i].name.indexOf('bRegex_') == -1 &&
                    aoData[i].name.indexOf('sSearch_') == -1 &&
                    aoData[i].name.indexOf('bSearchable_') == -1 &&
                    aoData[i].name.indexOf('bSortable_') == -1 &&
                    aoData[i].name.indexOf('mDataProp_') == -1)
                    request[aoData[i].name] = aoData[i].value;
        }
    }

    if (sortColumn > -1) {
        request['sort'] = $.grep(aoData, function (el, index) {
            return (el.name == 'mDataProp_' + sortColumn);            
        })[0].value;
    }

    return request;
};

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

$.fn.dataTable.pipeline = function (opts) {
    // Configuration options
    var conf = $.extend({
        pages: 1,     // number of pages to cache
        url: '',      // script url
        data: null,   // function or object with parameters to send to the server
        // matching how `ajax.data` works in DataTables
        method: 'GET' // Ajax HTTP method
    }, opts);

    // Private variables for storing the cache
    var cacheLower = -1;
    var cacheUpper = null;
    var cacheLastRequest = null;
    var cacheLastJson = null;

    return function (sSource, aoData, fnCallback, oSettings) {
        var ajax = false;
        var request = $.fn.dataTable.requestArrayToObject(aoData);
        var requestStart = request.start;
        var requestLength = request.length;
        var requestEnd = requestStart + requestLength;
        
        if (oSettings.bClearCache) {
            // API requested that the cache be cleared
            ajax = true;
            oSettings.bClearCache = false;
        } else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
            // outside cached data - need to make a request
            ajax = true;
        } else if (request.sort !== cacheLastRequest.sort ||
                  request.search !== cacheLastRequest.search ||
                  request.direction !== cacheLastRequest.direction
        ) {
            // propertie sdatachanged (ordering, direction, searching)
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
                var d = conf.data(aoData);
                if (d) {
                    $.extend(request, d);
                }
            }
            else if ($.isPlainObject(conf.data)) {
                // As an object, the data given extends the default
                $.extend(request, conf.data);
            }

            oSettings.jqXHR = $.ajax({
                "type": conf.method,
                "url": conf.url,
                "data": request,
                "dataType": "json",
                "cache": false,
                "success": function (json) {

                    var datatableJson = {
                        sEcho : request.echo,
                        iTotalRecords : json.RowCount,
                        iTotalDisplayRecords : json.FilteredRowCound || json.RowCount,
                        aaData: json.Rows
                    };

                    cacheLastJson = $.extend(true, {}, datatableJson);

                    if (cacheLower != requestStart) {
                        datatableJson.aaData.splice(0, requestStart - cacheLower);
                    }

                    if (requestLength > 0) {
                        datatableJson.aaData.splice(requestLength, datatableJson.aaData.length);
                    }

                    fnCallback(datatableJson);
                }
            });
        }
        else {
            json = jQuery.extend(true, {}, cacheLastJson);
            json.sEcho = request.echo; /* Update the echo for each response */
            json.aaData.splice(0, requestStart - cacheLower);
            json.aaData.splice(requestLength, json.aaData.length);
            fnCallback(json);
            return;
        }
    }
};

// Register an API method that will empty the pipelined data, forcing an Ajax
// fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTableExt.oApi.fnClearPipeline = function (oSettings) {
    oSettings.bClearCache = true;
    return this;
};