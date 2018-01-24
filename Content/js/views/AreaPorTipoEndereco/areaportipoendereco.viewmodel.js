var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.AreaPorTipoEnderecoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArea = ko.observable();
        this.TipoEnderecoId = ko.observable();
        this.TipoEndereco = ko.observable();
        this.Armazem = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.CodigoArea('');
        this.TipoEnderecoId('');
        this.TipoEndereco('');
        this.Armazem('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArea(model.CodigoArea);
        this.TipoEnderecoId(model.TipoEnderecoId);
        this.TipoEndereco(model.TipoEndereco);
        this.Armazem(model.Armazem);
    }
});

hbsis.wms.settings.AreaPorTipoEnderecoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#TipoEnderecoId", this.settings.locationTypeAutocompleteUrl, this.renderLocationType);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.AreaPorTipoEnderecoModel());
    },
    renderLocationType: function (locationType) {
        return locationType.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#form-tabs a:first").tab('show');
        $("#TipoEnderecoId").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#form-tabs a:first").tab('show');
        $("#TipoEnderecoId").select2("val", $("#TipoEnderecoId").val(), true);
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "CodigoArea" },
              { "mData": "TipoEndereco" },
              { "mData": "Armazem" },
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