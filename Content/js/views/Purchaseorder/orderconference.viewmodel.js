var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.PoWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.settings.PoCompanyModel = Class.extend({
    init: function (Company) {
        if (!Company) {
            Company = { Id: '', Name: '' };
        }

        this.Id = Company.Id;
        this.Name = Company.Name;
    }
});

hbsis.wms.settings.PoDetailModel = Class.extend({
    init: function (model) {
        this.ItemCode = model.ItemCode;
        this.ItemName = model.ItemName;
        this.OrderItemUMName = model.OrderItemUMName;
        this.OrderItemQuantity = parseFloat(model.OrderItemQuantity).toFixed(2);
        this.ConferedItemUMName = model.ConferedItemUMName;
        this.ConferedQuantity = parseFloat(model.ConferedQuantity).toFixed(2);
        this.DifferenceUMName = model.DifferenceUMName;
        this.DifferenceQuantity = parseFloat(model.DifferenceQuantity).toFixed(2);
        this.OrderItemTypeName = model.OrderItemTypeName;

        this.OrderQuantityUM = function () {
            if (this.OrderItemUMName) {
                return this.OrderItemQuantity + " " + this.OrderItemUMName;
            }
            return "";
        };

        this.ConferedQuantityUM = function () {
            if (this.ConferedItemUMName) {
                return this.ConferedQuantity + " " + this.ConferedItemUMName;
            }
            return "";
        };

        this.DifferenceQuantityUM = function () {
            if (this.DifferenceUMName) {
                return this.DifferenceQuantity + " " + this.DifferenceUMName;
            }
            return "";
        };

        this.Missing = function () {
            return this.DifferenceQuantity < 0;
        };
    }
});

hbsis.wms.settings.PurchaseOrderModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Number = ko.observable();
        this.Status = ko.observable();
        this.Date = ko.observable();
        this.Vehicle = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.PoWarehouseModel());
        this.Details = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.Number('');
        this.Status('');
        this.Date('');
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel());
        this.Vehicle('');
        this.Details.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.Number(model.Number);
        this.Status(model.Status);
        this.Date(model.Date);
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel(model.Warehouse));
        this.Vehicle(model.VehicleId);
    }
});

hbsis.wms.settings.PurchaseOrderViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    urlGetItemsConfered: "",
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.urlGetItemsConfered = this.settings.itemsConferedUrl;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
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

                if (self.startDate !== startDate) {
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
    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PurchaseOrderModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    edit: function (model) {        
        this._super(model);
        var currentModel = this.model();        
        $.ajax({
            async: true,
            url: this.urlGetItemsConfered + "/GetConfered/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                currentModel.Details.removeAll();
                $.each(data, function (i, item) {
                    
                    currentModel.Details.push(new hbsis.wms.settings.PoDetailModel(item));
                });
            }
        });
    },
    filterChange: function () {
        var self = this;
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
        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {                
                aoData.push({ "name": "order", "value": $('#Number').val() });
                aoData.push({ "name": "licensePlate", "value": $('#VehicleId').val() });
                aoData.push({ "name": "status", "value": $('#Status').val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "Warehouse" },
              { "mData": "Number" },
              { "mData": "VehicleId" },
              { "mData": "Status" },
              { "mData": null }

            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Warehouse.ShortCode;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": false
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.Status);
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false,
                    "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                    "<i class=\"fa fa-search\"></i></a> "
                }
            ]
        };
    }
});