var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.UserPalletModel = Class.extend({
    init: function () {
    },
    clear: function () {
    },
    load: function (model) {
    }
});

hbsis.wms.settings.UserPalletViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");
    },
    initDatetimeRangePicker: function (field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function (start, end) {
                var startDate = start.format(resources.get('SmallDateFormat'));
                var endDate = end.format(resources.get('SmallDateFormat'));

                if (self.startDate != startDate) {
                    self.startDate = startDate;
                    self.dirty(true);
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                    self.dirty(true);
                }

                self.refreshPlot();
            }
        });
    },
    clearSaveForm: function () {
        this._super();
    },
    refreshPlot: function () {
        var items = [];
        var ticksU = [];
        var metas = [];
        $.ajax({
            url: this.urlUserPallet,
            dataType: 'json',
            data: { "startDate": this.startDate, "endDate": this.endDate }
        }).done(function (data) {
            
            for (var i = 0; i < data.Rows.length; i++) {
                var row = data.Rows[i];
                items.push([i, parseInt(row.TotalPalete)]);
                ticksU.push([i, row.User.Login + " - " + row.User.Name ]);
                metas.push([i, parseInt(row.Terminus)]);
            }

            console.log(items);
            console.log(ticksU);
            console.log(metas);
            var data1 = [
                       {
                           label: "Total de Paletes",
                           data: items,
                           bars: {
                               show: true,
                               barWidth: 0.4,
                               fillColor: "rgba(220,220,220,0.5)",
                               lineWidth: 2,
                               order: 1,
                               fillColor: "#00FF7F"
                           },
                           color: "#00FF7F"
                       },
                       {
                           label: "Metas por Palete",
                           data: metas,
                           bars: {
                               show: true,
                               barWidth: 0.4,
                               fill: false,
                               lineWidth: 2,
                               order: 2,
                               fillColor: "#FF0000"
                           },
                           color: "#FF0000"
                       }]

            data = items;

            var dataset = [{ label: "", data: data1, color: "#5482FF" }];

            $.plot($("#flot-placeholder"), data1,
                {
                    series: {
                        shadowSize: 1
                    },
                    bars: {
                        align: "center",
                        barWidth: 0.1
                    },
                    xaxis: {
                        axisLabel: "-",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: 'Verdana, Arial',
                        axisLabelPadding: 5
                        , ticks: ticksU
                    },
                    yaxis: {
                        axisLabel: "-",
                        axisLabelUseCanvas: true,
                        axisLabelFontSizePixels: 12,
                        axisLabelFontFamily: 'Verdana, Arial',
                        axisLabelPadding: 5,
                        //tickFormatter: function (v, axis) {
                        //    return v;
                        //}
                    },
                    legend: {
                        noColumns: 0,
                        backgroundOpacity: 0.2,
                        labelBoxBorderColor: "",
                        position: "",


                    },
                    grid: {
                        hoverable: true,
                        borderWidth: 0,
                        backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
                    }
                }

            );

            $("#flot-placeholder").UseTooltip();

        });


    },
    edit: function (model) {
        this._super(model);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.UserPalletModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    initAutocomplete: function (field, autocompleteUrl, render) {

        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function (data, page) {
                    return { results: data.Rows };
                }
            },
            id: function (data) { return data.Id; },
            initSelection: function (element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function (data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,
            escapeMarkup: function (m) { return m; }
        });
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "Warehouse" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return row.Warehouse.ShortCode; }
                }
            ]
        };
    }
});