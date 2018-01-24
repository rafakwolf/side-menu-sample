var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.ReasonModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Codigo = ko.observable();
        this.Nome = ko.observable();
        this.Tipo = ko.observable();
        this.ObservacaoObrigatoria =  ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.Codigo('');
        this.Tipo('');
        this.ObservacaoObrigatoria(false);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Codigo(model.Codigo);
        this.Nome(model.Nome);
        this.Tipo(model.Tipo);
        this.ObservacaoObrigatoria(model.ObservacaoObrigatoria);
    }
});

hbsis.wms.settings.ReasonsViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Tipo"
        });

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ReasonModel());
    },
    renderProfile: function (profile) {
        return profile.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#form-tabs a:first").tab('show');
        $("#Tipo").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#form-tabs a:first").tab('show');
        $("#Tipo").select2("val", $("#Tipo").val(), true);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "Codigo" },
              { "mData": "Nome" },
              { "mData": "Tipo" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [3],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },
              {
                  "aTargets": [2],
                  "mData": null,
                  "bSortable": false,
                   "mRender": function (data, type, row) {
                       return resources.get(row.Tipo);
                  }
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