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

hbsis.wms.settings.ItemStockByProductFamilyModel = Class.extend({
    init: function () {

        this.ProductFamily = ko.observable();

    },
    clear: function () {
        this.ProductFamily();
    }
});

hbsis.wms.settings.ItemStockByProductFamilyViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Location_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);
        this.initAutocompleteMultiple("#ProductFamily", this.settings.productFamilyAutocompleteUrl, this.renderProductFamily);
        
        
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
        return ko.observable(new hbsis.wms.settings.ItemStockByProductFamilyModel());
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
    renderLocation: function (location){
        return location.Code
    },
    renderProductFamily: function (productFamily) {
        return productFamily.Name
    },
    productFamilyFind: function () {
        var self = this;
        self.ProductFamily = hbsis.wms.Helpers.querystring('ProductFamily');
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
    initAutocompleteMultiple: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            multiple: true,
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
                aoData.push({ "name": "ProductFamily", "value": $("#ProductFamily").val() });
            },
            "aoColumns": [
              { "mData": "Armazem" },
              { "mData": "Familia" },
              { "mData": "Item" },
              { "mData": "Lote" },
              { "mData": "EnderecoCodigo" },
              { "mData": "Quantidade" },
              { "mData": "DataValidade" },
              { "mData": "Status" },
              { "mData": "LPN" }
            ],
            "aoColumnDefs": [
                {
                "aTargets": [0],"mData": null,"bSortable": false,
                "bSearchable": false
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": false
                },
                 {
                     "aTargets": [2], "mData": null, "bSortable": false,
                     "bSearchable": false
                 },
                    {
                        "aTargets": [3], "mData": null, "bSortable": false, "sClass": "text-center",
                        "bSearchable": false, "mRender": function (data, type, row) {
                            if (row.Lote == null)
                                return "-";
                            else
                                return row.Lote;
                        }
                    },
                   {
                       "aTargets": [4], "mData": null, "bSortable": false,
                       "bSearchable": false
                   },
                    {
                        "aTargets": [8], "mData": null, "bSortable": false,
                        "bSearchable": false, "mRender": function (data, type, row)
                        {
                            if (row.LPN == null)
                                return "-";

                                return row.LPN;
                        }
                    },
                    {
                        "aTargets": [7], "mData": null, "bSortable": false,
                        "bSearchable": false, "mRender": function (data, type, row)
                        {
                            return resources.get(row.Status);
                        }
                    }
                   ,
                     {
                         "aTargets": [6],
                         "bSortable": false,
                         "bSearchable": false,
                         "mRender": function (data, type, row) {
                             if (row.DataValidade == null)
                                 return " - ";

                             return moment(row.DataValidade).format("DD/MM/YYYY");
                         }
                     }
]
            
};
    }
});