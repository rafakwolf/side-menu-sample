var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.LinhaProducaoModel = Class.extend({
    init: function () {
        
        this.Id = ko.observable();
        this.Code = ko.observable();
        this.Description = ko.observable();
        this.Status = ko.observable();
        this.InputLocationId = ko.observable();
        this.OutputLocationId = ko.observable();
        this.EnderecoEsperaId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Code('');
        this.Description('');
        this.Status("Stopped");
        this.InputLocationId('');
        this.OutputLocationId('');
        this.EnderecoEsperaId('');

    },
    load: function (model) {
        
        this.Id(model.Id);
        this.Code(model.Code);
        this.Description(model.Description);
        this.Status(model.Status);
        this.InputLocationId(model.InputLocationId);
        this.OutputLocationId(model.OutputLocationId);
        this.EnderecoEsperaId(model.EnderecoEsperaId);
    }
});
hbsis.wms.settings.LinhaProducaoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#InputLocationId", this.settings.defaultLocationAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#OutputLocationId", this.settings.defaultLocationAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#EnderecoEsperaId", this.settings.esperaLocationAutocompleteUrl, this.renderLocation);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
        $("#Status").select2("enable", false);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.LinhaProducaoModel());
    },
    renderLocation: function (location) {
        return location.Code + ' - ' + location.Description;
    },
    getModelDescription: function (model) {
        return model.Code;
    },
    clearSaveForm: function () {
        this._super();
        $("#InputLocationId").select2("val", "", true);
        $("#OutputLocationId").select2("val", "", true);
        $("#EnderecoEsperaId").select2("val", "", true);
        $("#Status").select2("val", "Stopped", true);
    },
    edit: function (model) {
        this._super(model);
        $("#InputLocationId").select2("val", $("#InputLocationId").val(), true);
        $("#OutputLocationId").select2("val", $("#OutputLocationId").val(), true);
        $("#EnderecoEsperaId").select2("val", $("#EnderecoEsperaId").val(), true);
        $("#Status").select2("val", $("#Status").val(), true);
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 2,
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Code" },
              { "mData": "Description" },
              { "mData": "Status" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              
            {
                "aTargets": [0], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return row.Code;
                }
            },
            {
                "aTargets": [1], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return row.Description;
                }
            },
            {
                "aTargets": [2], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return resources.get(row.Status);
                }
            },
            {
                "aTargets": [3], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row) {
                    if (row.InputLocationCode) {
                        return row.InputLocationCode + " - " + row.InputLocationDescription;
                    }
                    return "";
                }
            },
            {
                "aTargets": [4], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row) {
                    if (row.OutputLocationCode) {
                        return row.OutputLocationCode + " - " + row.OutputLocationDescription;
                    }
                    return "";
                }
            },
            {
                "aTargets": [5],
                "mData": null,
                "sDefaultContent": self.settings.actionsMarkup,
                "bSortable": false,
                "bSearchable": false
            }
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});