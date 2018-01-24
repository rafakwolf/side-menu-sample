var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.ClienteModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.WarehouseId = ko.observable();
        this.TipoClienteId = ko.observable();
        this.Nome = ko.observable();
        this.Codigo =  ko.observable();
    },
    clear: function () {
        this.Id('');
        this.WarehouseId('');
        this.TipoClienteId('');
        this.Nome('');
        this.Codigo('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.WarehouseId(model.WarehouseId);
        this.TipoClienteId(model.TipoClienteId);
        this.Nome(model.Nome);
        this.Codigo(model.Codigo);
    }
});

hbsis.wms.management.ClienteViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#TipoClienteId", this.settings.tipoClienteFabricaAutocompleteUrl, this.renderTipoCliente);
        

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.management.ClienteModel());
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
    //searchRequestDataPickArea: function (term, page) {
    //    var warehouse = $("#WarehouseId").val();
    //    if (warehouse) {
    //        return {
    //            search: term,
    //            start: 0,
    //            length: 10,
    //            field1: 'warehouse',
    //            value1: String(warehouse)
    //        };
    //    }
    //    return {
    //        search: term,
    //        start: 0,
    //        length: 10
    //    };
    //},
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Codigo" },
              { "mData": "Nome" },
              { "mData": "TipoClienteNome" },
              { "mData": null }
            ],
            "aoColumnDefs": [
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