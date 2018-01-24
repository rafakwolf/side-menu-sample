var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemDetailModel = Class.extend({
    init: function (detail) {
        this.DocumentNumber = detail.DocumentNumber;
        this.ItemCode = detail.ItemCode;
        this.ItemDescription = detail.ItemDescription;
        this.QuantityToRemove = detail.QuantityToRemove;
        this.QuantityRemoved = detail.QuantityRemoved;
    }
});

hbsis.wms.settings.MapBreakModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.WarehouseId = ko.observable();
        this.Type = ko.observable();
        this.Status = ko.observable();
        this.FromMaps = ko.observable();
        this.ToMaps = ko.observable();
        this.FromItemDetails = ko.observableArray();
        this.ToItemDetails = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.WarehouseId('');
        this.Type('');
        this.Status('');
        this.FromMaps('');
        this.ToMaps('');
        this.FromItemDetails.removeAll();
        this.ToItemDetails.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.WarehouseId(model.WarehouseId);
        this.Type(model.Type);
        this.Status(model.Status);
        this.FromMaps(model.FromMaps);
        this.ToMaps(model.ToMaps);

        for (var i = 0; i < model.FromItemDetails.length; i++) {
            this.FromItemDetails.push(new hbsis.wms.settings.ItemDetailModel(model.FromItemDetails[i]));
        }
        for (var i = 0; i < model.ToItemDetails.length; i++) {
            this.ToItemDetails.push(new hbsis.wms.settings.ItemDetailModel(model.ToItemDetails[i]));
        }
    }
});

hbsis.wms.settings.MapBreakViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Type"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.MapBreakModel());
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);

        $("#Type").select2("val", $("#Type").val(), true);
        $("#Status").select2("val", $("#Status").val(), true);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "Type" },
              { "mData": "Status" },
              { "mData": "FromMaps" },
              { "mData": "ToMaps" },
              { "mData": null }
            ],
            "aoColumnDefs": [
               {
                   "aTargets": [0],
                   "bSortable": true,
                   "bSearchable": true,
                   "mRender": function (data, type, row) {
                       if (row.WarehouseCode == null)
                           return "-";

                       return row.WarehouseCode;
                   }
               },

                {
                    "aTargets": [1],
                    "bSortable": false,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        if (row.Type == null)
                            return "-";
                        return resources.get(row.Type);
                    }
                },
                {
                    "aTargets": [2],
                    "bSortable": false,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        if (row.Status == null)
                            return "-";
                        return resources.get(row.Status);
                    }
                },
                {
                    "aTargets": [3],
                    "bSortable": false,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        if (row.FromMaps == null)
                            return "-";

                        return row.FromMaps;
                    }
                },
               {
                   "aTargets": [4],
                   "bSortable": true,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       if (row.ToMaps == null)
                           return "-";

                       return row.ToMaps;
                   }
               },

               {
                   "aTargets": [5],
                   "mData": null,
                   "sDefaultContent": self.settings.editMarkup,
                   "bSortable": false,
                   "bSearchable": false
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