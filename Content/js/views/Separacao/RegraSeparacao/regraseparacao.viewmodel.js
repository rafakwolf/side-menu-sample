var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RegraSeparacaoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Nome = ko.observable();
        this.Descricao = ko.observable();
        this.ArmazemId = ko.observable();
        this.Ativo = ko.observable();
        this.ArmazemCodigo = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.Descricao('');
        this.ArmazemId('');
        this.Ativo('');
        this.ArmazemCodigo('');

    },
    load: function (model) {
        this.Id(model.Id);
        this.Nome(model.Nome);
        this.Descricao(model.Descricao);
        this.ArmazemId(model.ArmazemId);
        this.Ativo(model.Ativo);
        this.ArmazemCodigo(model.ArmazemCodigo);
    }
});

hbsis.wms.settings.RegraSeparacaoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.RegraSeparacaoModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ArmazemCodigo" },
              { "mData": "Nome" },
              { "mData" : "Ativo" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return row.ArmazemCodigo;
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true,
                    "mRender": function (data, type, row) {
                        return resources.get(row.Ativo);
                    },

                    "fnCreatedCell": function (nTd, sData) {
                        if (sData == "Sim") {
                            $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                        }
                        else
                            if (sData == "Não") {
                                $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                            }
                    }
                },
                {
                    "aTargets": [3],
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
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});