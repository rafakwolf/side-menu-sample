var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemColetaIdadeModel = Class.extend({
    init: function () {
        
        this.Id = ko.observable();
        this.ItemId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.ItemId('');
        
    },
    load: function (model) {
        this.Id(model.Id);
        this.ItemId(model.Id);
    }
});
hbsis.wms.settings.ItemColetaIdadeViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderItem);

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ItemColetaIdadeModel());
    },
    renderItem: function (Item) {
        return Item.ShortCode + ' - ' + Item.ShortDescription;
    },
    getModelDescription: function (model) {
        return model.Code;
    },
    clearSaveForm: function () {
        this._super();
        $("#ItemId").select2("val", "", true);
        
    },
    edit: function (model) {
        this._super(model);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
        
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
              { "mData": "ItemCode" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              
            {
                "aTargets": [0], "mData": null, "bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return row.ItemCode + " - " + row.ItemDescription;
                }
            },
            {
                "aTargets": [1], "mData": null, "bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row) {
                    debugger;
                    return self.settings.deleteMarkup;
                }
            }
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});