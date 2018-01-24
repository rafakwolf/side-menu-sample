var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.ConfiguracaoFefoClienteModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.WarehouseId = ko.observable();
        this.Curva = ko.observable();
        this.Range = ko.observable();
        this.VidaUtil = ko.observable();
        this.TipoClienteId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.WarehouseId('');
        this.Curva('');
        this.Range('');
        this.VidaUtil('');
        this.TipoClienteId('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.WarehouseId(model.WarehouseId);
        this.Curva(model.Curva);
        this.Range(model.Range);
        this.VidaUtil(model.VidaUtil);
        this.TipoClienteId(model.TipoClienteId);
    }
});

hbsis.wms.management.ConfiguracaoFefoClienteViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#TipoClienteId", this.settings.tipoClienteFabricaAutocompleteUrl, this.renderTipoCliente);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.management.ConfiguracaoFefoClienteModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderTipoCliente: function (tipocliente) {
        return tipocliente.Nome;
    },
    renderLocation: function (location) {
        return location.Code + ' - ' + location.Description;
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#TipoClienteId").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#TipoClienteId").select2("val", $("#TipoClienteId").val(), true);

    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "TipoClienteNome" },
              { "mData": "Range" },
              { "mData": "Curva" },
              { "mData": "VidaUtil" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [4],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, minimumInput) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: minimumInput,
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
                if (id !== "" && id.split("-").length == 5) {
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