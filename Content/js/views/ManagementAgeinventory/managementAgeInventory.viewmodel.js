var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemStockWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});


hbsis.wms.settings.ItemStockLocationRefModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});
hbsis.wms.settings.LotRefModel = Class.extend({
    init: function (Model) {
        if (!Model) {
            Model = { Id: '', Number: '' };
        }

        this.Id = Model.Id;
        this.Number = Model.Number;
    }
});

hbsis.wms.settings.ManagementAgeInventoryModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Item = ko.observable();
        this.Quantity = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.ItemStockWarehouseModel());
        this.location = ko.observable(new hbsis.wms.settings.ItemStockLocationRefModel());
        this.Lot = ko.observable(new hbsis.wms.settings.LotRefModel());
        this.ExpirationDate = ko.observable();
        this.DaysToExpire = ko.observable();
        this.LotNumber = ko.observable();
        this.Status = ko.observable();
    },

    clear: function () {
        this.Id('');
        this.Item('');
        this.Quantity('');
        this.Warehouse('');
        this.location('');
        this.Lot('');
        this.ExpirationDate();
        this.DaysToExpire();
        this.LotNumber('');
        this.Status('');
        this.DaysToExpire('');



    },
    load: function (model) {
        this.Id(model.Id);
        this.Item(model.Item);
        this.Quantity(model.Quantity);
        this.Status(model.Status);
        this.location(model.location);
        this.Lot(model.Lot);
        this.ExpirationDate(model.ExpirationDate);
        this.DaysToExpire(model.DaysToExpire);
        this.LotNumber(model.LotNumber);
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel(model.Warehouse));


    }
});

hbsis.wms.settings.ManagementAgeInventoryViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    managementAgeMarkup: "<a class=\"label label-default managementAge\" href=\"#lock\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
            "<i class=\"fa fa-lock\" title=\"Bloquear\"></i></a> ",
    errorProcessAlert: "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    baseActionUrl: "",
    managementAgeUrl: "",
    init: function (opts) {

        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Location_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);

        this.baseActionUrl = this.settings.readBaseUrl;
        this.managementAgeUrl = this.settings.managementAgeUrl;

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
        return ko.observable(new hbsis.wms.settings.ManagementAgeInventoryModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLot: function (lot) {
        return lot.Number;
    },
    renderCompany: function (company) {
        return company.Name;
    },
    renderLocation: function (location) {
        return location.Code
    },
    daysToExpireFind: function () {
        var self = this;
        self.DaysToExpire = hbsis.wms.Helpers.querystring('DaysToExpire');
        self.dirty(true);
        self.refreshDatatable();
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
    getFormData: function () {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function (el) {
            return $.grep(self.model().AvailableZones(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },

    applyDatabind: function (ko) {
        var self = this;
        if (self.datatable != null) {
            self.document.on("click", self.settings.datatableId + " " + ".managementAge", function (e) {
                var row = $(this).parents('tr')[0];
                var model = self.datatable.fnGetData(row);
                self.makeManagementAge(model);
            });
        }

        this._super(ko);
    },
    makeManagementAge: function (model) {

        var self = this;
        var successResult = false;
        $.ajax({
            async: false,
            url: this.managementAgeUrl,
            data: model,
            dataType: "JSON",
            type: "POST",
            success: function (data, textStatus, jqXHR) {
                successResult = data.success;
                if (!successResult) {
                    var errorAlert = self.errorProcessAlert.replace("{errormessage}", data.error);
                    $("#modelContentMessage").prepend(errorAlert);
                }
            }
        });
        if (successResult) {
            document.location.href = this.baseActionUrl;
        }
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "DaysToExpire", "value": $("#DaysToExpire").val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "Location" },
                { "mData": "Lpn" },
                { "mData": "Item" },
                { "mData": "Item" },
                { "mData": "Quantity" },
                { "mData": "ExpirationDate" },
                { "mData": "Status" },
                { "mData": "DaysToExpire" },
                { "mData": "Color" },
                { "mData": null }
                //{"mData": "LotNumber"},
            ],

            "aoColumnDefs": [
            {
                "aTargets": [9],
                "mData": null,
                "sDefaultContent": self.managementAgeMarkup,
                "bSortable": false,
                "bSearchable": false,
                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
                    if (oData.Status == 'Available') {
                        $(nTd).children().children().removeClass("fa-lock");
                        $(nTd).children().children().addClass("fa-unlock");
                    } else {
                        $(nTd).children().children().removeClass("fa-unlock");
                        $(nTd).children().children().addClass("fa-lock");
                    }
                }
            },
            {
                "aTargets": [8],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if (oData.Color === 1) {
                        $(nTd).css('background-color', '#00FF00');
                    } else if (oData.Color === 2) {
                        $(nTd).css('background-color', '#FFFF00');
                    } else if (oData.Color === 3) {
                        $(nTd).css('background-color', '#FF0000');
                    }
                },
                "mRender": function(data, type, row) { return ''; }
            },
            {
                "aTargets": [0],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function(data, type, row) { return row.Location.Code; }
            },
            {
                "aTargets": [1],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                    if (row.Lpn == null)
                        return "-";
                    return row.Lpn.Number;
                }
            },
            {
                "aTargets": [2],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function(data, type, row) { return row.Item.Code; }
            },
            {
                "aTargets": [3],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function(data, type, row) { return row.Item.Description; }
            },
            {
                "aTargets": [5],
                "bSortable": true,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                    if (row.ExpirationDate == null)
                        return "-";
                    return moment(row.ExpirationDate).format("DD/MM/YYYY");
                }
            },
            {
                "aTargets": [6],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                    return resources.get(row.Status);
                },
                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
                    if (sData == "Disponível")
                        nTd.style.color = "#00B050";
                    else
                        nTd.style.color = "#FF0000";
                }
            },
            {
                "aTargets": [7],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                    if (row.DaysToExpire == null)
                        return "-";
                    return row.DaysToExpire;
                }
            }
            //{
            //    "aTargets": [3], "mData": null, "bSortable": false,
            //    "bSearchable": false, "mRender": function (data, type, row)
            //    { return row.Lot.Number; }
            //},
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