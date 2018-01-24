var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TipoClienteModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Nome = ko.observable();
        this.Armazem = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.Armazem('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Nome(model.Nome);
        this.Armazem(model.Armazem);
    }
});

hbsis.wms.settings.TipoClienteViewModel = hbsis.wms.CrudForm.extend({
    init: function(opts) {
        this._super(opts);
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.TipoClienteModel());
    },
    renderZone: function(zone) {
        return zone.Name;
    },
    getModelDescription: function(model) {
        return model.Name;
    },
    clearSaveForm: function() {
        this._super();
        
    },
    edit: function(model) {
        this._super(model);
        
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
                { "mData": "Nome" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [1],
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