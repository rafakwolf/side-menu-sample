var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.LoteModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.DataFabricacao = ko.observable();
        this.CodigoLote = ko.observable();
        this.Linha = ko.observable();
        this.Item = ko.observable();
    },

    //clear: function() {
    //    this.Id('');
    //    this.DataFabricacao('');
    //    this.CodigoLote('');
    //    this.DescricaoItem('');
    //},

    //load: function(model) {
    //    this.Id(model.Id);
    //    this.DataFabricacao(model.DataFabricacao);
    //    this.CodigoLote(model.CodigoLote);
    //    this.DescricaoItem(model.DescricaoItem);
    //}
});

hbsis.wms.settings.LoteViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    //managementAgeMarkup: "<a class=\"label label-default managementAge\" href=\"#lock\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
    //        "<i class=\"fa fa-lock\" title=\"Bloquear\"></i></a> ",
    //errorProcessAlert: "<div class=\"alert alert-danger alert-white-alt rounded\">" +
    //            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
    //            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    baseActionUrl: "",
    managementAgeUrl: "",

    init: function (opts) {

        this._super(opts);
        this.baseActionUrl = this.settings.readBaseUrl;
        this.managementAgeUrl = this.settings.managementAgeUrl;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        //this.initDatetimeRangePicker("#reportrange"); //TODO relatório...
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

                self.refreshDatatable();
            }
        });
    },

    clearSaveForm: function () {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
        $("#Location_Id").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#Location_Id").select2("val", $("#Location_Id").val(), true);


    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.LoteModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    //renderWarehouse: function (warehouse) {
    //    return warehouse.ShortCode + ' - ' + warehouse.Name;
    //},
    //renderLot: function (lot) {
    //    return lot.Number;
    //},
    //renderCompany: function (company) {
    //    return company.Name;
    //},
    //renderLocation: function (location) {
    //    return location.Code
    //},
    //daysToExpireFind: function () {
    //    var self = this;
    //    self.DaysToExpire = hbsis.wms.Helpers.querystring('DaysToExpire');
    //    self.dirty(true);
    //    self.refreshDatatable();
    //},
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
    getFormData: function () {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function (el) {
            return $.grep(self.model().AvailableZones(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },

    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "CodigoLote" },
              { "mData": "DataFabricacao" },
              { "mData": "Linha" },
              { "mData": "Item" },
            ],

            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                         return row.CodigoLote;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                        return row.DataFabricacao;
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                         return row.Item;
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                        return row.Linha;
                    }
                }
            ]
        };
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
    }
});