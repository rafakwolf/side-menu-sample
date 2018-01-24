var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ProductfamilysModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
        this.ProductSegmentId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
        this.ProductSegmentId('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
        this.ProductSegmentId(model.ProductSegmentId);
    }
});

hbsis.wms.settings.ProductfamilysViewModel = hbsis.wms.CrudForm.extend({
    init: function(opts) {
        this._super(opts);
        this.initAutocomplete("#ProductSegmentId", this.settings.productSegmentAutocompleteUrl, this.renderProductSegment);

    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.ProductfamilysModel());
    },
    renderProductSegment: function(segment) {
        return segment.Name;
    },
    clearSaveForm: function() {
        this._super();
        $("#ProductSegmentId").select2("val", "", true);
    },
    edit: function(model) {
        this._super(model);
        $("#ProductSegmentId").select2("val", $("#ProductSegmentId").val(), true);
    },
    getModelDescription: function(model) {
        return model.Name;
    },
    initAutocomplete: function(field, autocompleteUrl, render) {

        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function(term, page) {
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
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function(data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,
            escapeMarkup: function(m) { return m; }
        });
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
                { "mData": "Name" },
                { "mData": "ProductSegmentName" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Name);
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.ProductSegmentName);
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false
                },
            ]
        };
    }
});