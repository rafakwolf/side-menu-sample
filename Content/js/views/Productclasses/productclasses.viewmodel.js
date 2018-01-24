var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ProductClassModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
        this.OverflowClass = ko.observable();
        this.ProductFamilyId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
        this.OverflowClass('');
        this.ProductFamilyId('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
        this.OverflowClass(model.OverflowClass);
        this.ProductFamilyId(model.ProductFamilyId);
    }
});

hbsis.wms.settings.ProductClassesViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initOverflowClassAutocomplete();
        this.initAutocomplete("#ProductFamilyId", this.settings.productFamilyAutocompleteUrl, this.renderProductFamily);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ProductClassModel());
    },
    renderOverflowClass: function (overflowClass) {
        return overflowClass.Name;
    },
    renderProductFamily: function (productFamily) {
        return  productFamily.ProductSegmentName + ' - ' + productFamily.Name ;
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    edit: function (model) {
        this._super(model);
        $("#OverflowClass").select2("val", $("#OverflowClass").val(), true);
        $("#ProductFamilyId").select2("val", $("#ProductFamilyId").val(), true);
    },
    clearSaveForm: function () {
        this._super();
        $("#OverflowClass").select2("val", "", true);
        $("#ProductFamilyId").select2("val", "", true);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ProductFamilyName" },  
              { "mData": "Name" },
              { "mData": null }
            ],
            "aoColumnDefs": [
               {
                   "aTargets": [0], "mData": null, "bSortable": true,
                   "bSearchable": false, "mRender": function (data, type, row) {
                       return resources.get(row.ProductFamilyName);
                   }
               },
               {
                   "aTargets": [1], "mData": null, "bSortable": true,
                   "bSearchable": false, "mRender": function (data, type, row) {
                       return resources.get(row.Name);
                   }
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
    initOverflowClassAutocomplete: function () {
        var self = this;
        $("#OverflowClass").select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: self.settings.overflowClassAutocompleteUrl,
                dataType: 'json',
                data: function (term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function (data, page) {
                    return {
                        results: $.map(data.Rows, function (el, index) {
                            return (el.Id == self.model().Id()) ? null : el;                                
                        })
                    };
                }
            },
            id: function (data) { return data.Id; },
            initSelection: function (element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(self.settings.overflowClassAutocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function (data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: self.renderOverflowClass,
            formatSelection: self.renderOverflowClass,
            allowClear: true,
            escapeMarkup: function (m) { return m; }
        });
    }
});