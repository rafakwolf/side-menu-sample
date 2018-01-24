var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ClassificacaoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Nome = ko.observable();
        this.PontuacaoLimite = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.PontuacaoLimite('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Nome(model.Nome);
        this.PontuacaoLimite(model.PontuacaoLimite);
    }
});

hbsis.wms.settings.ClassificacaoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ClassificacaoModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        console.log(model);
        this._super(model);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Nome" },
              { "mData": "PontuacaoLimite" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false
                },
                {
                    "aTargets": [2],
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
        console.log("entrou");
        return $.toDictionary(ko.toJS(this.model()));
    }
});