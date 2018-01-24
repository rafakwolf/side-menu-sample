﻿var hbsis = hbsis || { wms: {} };
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

hbsis.wms.settings.ItemStockInventoryModel = Class.extend({
    init: function () {
        //this.Id = ko.observable();
        //this.Item = ko.observable();
        //this.Quantity = ko.observable();
        //this.Warehouse = ko.observable(new hbsis.wms.settings.ItemStockWarehouseModel());
        //this.location = ko.observable(new hbsis.wms.settings.ItemStockLocationRefModel());
        //this.Lot = ko.observable(new hbsis.wms.settings.LotRefModel());
        //this.ExpirationDate = ko.observable();
        //this.LotNumber = ko.observable();
        //this.Status = ko.observable();        
        
    }
});

hbsis.wms.settings.ItemStockInventoryViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function(opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Location_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);


        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");
    },
    initDatetimeRangePicker: function(field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function(start, end) {

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
    clearSaveForm: function() {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
        $("#Location_Id").select2("val", "", true);


    },
    edit: function(model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#Location_Id").select2("val", $("#Location_Id").val(), true);


    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.ItemStockInventoryModel());
    },
    getModelDescription: function(model) {
        return model.Number;
    },
    renderWarehouse: function(warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLot: function(lot) {
        return lot.Number;
    },
    renderCompany: function(company) {
        return company.Name;
    },
    renderLocation: function(location) {
        return location.Code
    },
    initAutocomplete: function(field, autocompleteUrl, render) {

        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function(term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function(data, page) {
                    return { results: data.Rows };
                }
            },
            id: function(data) { return data.Id; },
            initSelection: function(element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function(data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,
            escapeMarkup: function(m) { return m; }
        });
    },
    getFormData: function() {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function(el) {
            return $.grep(self.model().AvailableZones(), function(el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "Warehouse" },
                { "mData": "Item" },
                { "mData": "Item" },
                { "mData": "LotNumber" },
                { "mData": "Location" },
                { "mData": "Quantity" },
                { "mData": "ExpirationDate" },
                { "mData": "Status" },
                { "mData": "Lpn" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Warehouse.ShortCode;
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Item.Code;
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Item.Description;
                    }
                },
                //{
                //    "aTargets": [3], "mData": null, "bSortable": false,
                //    "bSearchable": false, "mRender": function (data, type, row)
                //    { return row.Lot.Number; }
                //},
                {
                    "aTargets": [4],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Location.Code;
                    }
                },
                {
                    "aTargets": [8],
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
                    "aTargets": [7],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Status);
                    }
                },
                {
                    "aTargets": [6],
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        if (row.ExpirationDate == null)
                            return null;

                        return moment(row.ExpirationDate).format("DD/MM/YYYY");
                    }
                }
            ]

        };
    }
});