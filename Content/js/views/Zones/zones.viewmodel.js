var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ZoneModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
        this.WarehouseId = ko.observable();
        this.IsGeneral = ko.observable(false);
        this.IntegrationCode = ko.observable();
        this.LayerPickerZone = ko.observable(false);
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
        this.IsGeneral(false);
        this.WarehouseId('');
        this.IntegrationCode('');
        this.LayerPickerZone(false);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
        this.WarehouseId(model.WarehouseId);
        this.IsGeneral(model.IsGeneral);
        this.IntegrationCode(model.IntegrationCode);
        this.LayerPickerZone(model.LayerPickerZone);
    }
});

hbsis.wms.settings.ZonesViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ZoneModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "WarehouseId" },
              { "mData": "Name" },
              { "mData": "Description" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return row.WarehouseCode;
                    }
                },

                {
                  "aTargets": [3],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
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
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});