var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TipoInsumoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Descricao = ko.observable();
        this.Armazem = ko.observable();
        this.ExecutaFefo = ko.observable();
        this.RegiaoId = ko.observable();
        this.Prioridade = ko.observable();
        this.ParticipaCalculoRelatorio = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Descricao('');
        this.Armazem('');
        this.ExecutaFefo(false);
        this.RegiaoId('');
        this.Prioridade('');
        this.ParticipaCalculoRelatorio(false);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Descricao(model.Descricao);
        this.Armazem(model.Armazem);
        this.ExecutaFefo(model.ExecutaFefo);
        this.RegiaoId(model.RegiaoId);
        this.Prioridade(model.Prioridade);
        this.ParticipaCalculoRelatorio(model.ParticipaCalculoRelatorio);
    }
});

hbsis.wms.settings.TipoInsumoViewModel = hbsis.wms.CrudForm.extend({
    init: function(opts) {
        this._super(opts);

        this.initAutocomplete("#RegiaoId", this.settings.zoneAutoCompleteUrl, this.renderZone);
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.TipoInsumoModel());
    },
    renderZone: function(zone) {
        return zone.Name;
    },
    getModelDescription: function(model) {
        //return model.Name;
        return model.Descricao;
    },
    clearSaveForm: function() {
        this._super();
        $("#RegiaoId").select2("val", "", true);
    },
    edit: function(model) {
        this._super(model);
        $("#RegiaoId").select2("val", $("#RegiaoId").val(), true);
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
                { "mData": "Descricao" },
                { "mData": "Prioridade" },
                { "mData": null }
            ],
            "aoColumnDefs": [
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
    initAutocomplete: function(field, autocompleteUrl, render, searchRequestData) {
        $(field)
            .select2({
                placeholder: resources.get('Search...'),
                minimumInputLength: 3,
                ajax: {
                    url: autocompleteUrl,
                    dataType: 'json',
                    data: function(term, page) {
                        if (searchRequestData) {
                            return searchRequestData(term, page);
                        }
                        return {
                            search: term,
                            start: 0,
                            length: 10
                        };
                    },
                    results: function(data, page) {
                        return { results: data.Rows };
                    }
                },
                id: function(data) { return data.Id; },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "") {
                        $.ajax(autocompleteUrl + "/" + id,
                            {
                                dataType: "json"
                            })
                            .done(function(data) { callback(data); });
                    }
                },
                width: '100%',
                formatResult: render,
                formatSelection: render,
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
    },
    getFormData: function() {
        return $.toDictionary(ko.toJS(this.model()));
    }
});