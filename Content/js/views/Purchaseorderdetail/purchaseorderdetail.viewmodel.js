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

hbsis.wms.settings.PurchaseOrderDetailModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Number = ko.observable();
        this.Status = ko.observable();
        this.Date = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.PoWarehouseModel());
        this.ExpectedArrival = ko.observable();
        this.Customer =  ko.observable(new hbsis.wms.settings.PoCompanyModel());
        this.Vendor =  ko.observable(new hbsis.wms.settings.PoCompanyModel());
        this.Carrier = ko.observable(new hbsis.wms.settings.PoCompanyModel());
      //  this.Details = ko.observable();
    }
});

hbsis.wms.settings.PurchaseOrderDetailViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Carrier_Id", this.settings.carrierAutocompleteUrl, this.renderCompany);
        this.initAutocomplete("#Vendor_Id", this.settings.vendorAutocompleteUrl, this.renderCompany);
        this.initAutocomplete("#Customer_Id", this.settings.customerAutocompleteUrl, this.renderCompany);
        this.initDatetimeRangePicker("#reportrange");

    },
    initDatetimeRangePicker: function(field) {
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            callback: function() { 
                alert('clicou!!!');
            }
        });
    },
    clearSaveForm: function () {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
        $("#Carrier_Id").select2("val", "", true);
        $("#Vendor_Id").select2("val", "", true);
        $("#Customer_Id").select2("val", "", true);
     

    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#Carrier_Id").select2("val", $("#Carrier_Id").val(), true);
        $("#Vendor_Id").select2("val", $("#Vendor_Id").val(), true);
        $("#Customer_Id").select2("val", $("#Customer_Id").val(), true);

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PurchaseOrderDetailModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderCompany: function (company) {
        return company.Name;
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
                { "mData": "Warehouse" },
              { "mData": "Item" },
              { "mData": "Description" },
              { "mData": "Quantity" },
              { "mData": "State" },
              { "mData": "Carrier" },
              { "mData": "Vendor" },
              { "mData": "ExpectedArrival" },
            { "mData": "DateArrival" }
            
            ]
            ,
            "aoColumnDefs": [
                 {
                     "aTargets": [1],
                     "mData": null,
                     "bSortable": false,
                     "bSearchable": false,
                     "mRender": function (data, type, row) {
                         return row.Item.Code;
                     }
                 },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Item.Description;
                      }
                  },
                    {
                        "aTargets": [4],
                        "mData": null,
                        "bSortable": false,
                        "bSearchable": false,
                        "mRender": function (data, type, row) {
                            return resources.get(row.State);
                        }
                    },
                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Carrier.Name;
                      }
                  },
                    {
                        "aTargets": [6],
                        "mData": null,
                        "bSortable": false,
                        "bSearchable": false,
                        "mRender": function (data, type, row) {
                            return row.Vendor.Name;
                        }
                    },
                     {
                         "aTargets": [7],
                         "mData": null,
                         "bSortable": false,
                         "bSearchable": false,
                         "mRender": function (data, type, row) {
                             return hbsis.wms.Helpers.formatarDataDDMMYYYY(row.ExpectedArrival);
                         }
                     },
                      {
                          "aTargets": [8],
                          "mData": null,
                          "bSortable": false,
                          "bSearchable": false,
                          "mRender": function (data, type, row) {
                              return hbsis.wms.Helpers.formatarDataDDMMYYYY(row.DateArrival);
                          }
                      }

             ]
        };
    }
});