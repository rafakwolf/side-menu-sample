var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.MenuModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Title = ko.observable();
        this.Icon = ko.observable();
        this.ProcessId = ko.observable();
        this.ProcessDescription = ko.observable();
        this.ParentId = ko.observable();
        this.ParentTitle = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Title('');
        this.Icon('');
        this.ProcessId('');
        this.ProcessDescription('');
        this.ParentId('');
        this.ParentTitle('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Title(model.Title);
        this.Icon(model.Icon);
        this.ProcessId(model.ProcessId);
        this.ProcessDescription(model.ProcessDescription);
        this.ParentId(model.ParentId);
        this.ParentTitle(model.ParentTitle);
    }
});

hbsis.wms.settings.MenuViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#ProcessId", this.settings.ProcessAutocompleteUrl, this.renderProcess);
        this.initAutocomplete("#ParentId", this.settings.ParentAutocompleteUrl, this.renderParent);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.MenuModel());
    },
    clearSaveForm: function () {
        this._super();
        $("#ProcessId").select2("val", "", true);
        $("#ParentId").select2("val", "", true);
    },
    renderProcess: function (s) {
        return s.Description;
    },
    renderParent: function (s) {
        return s.Title;
    },
    edit: function (model) {
        this._super(model);
        $("#ProcessId").select2("val", $("#ProcessId").val(), true);
        $("#ParentId").select2("val", $("#ParentId").val(), true);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "Title" },
              { "mData": "ParentTitle" },
              { "mData": "ProcessDescription" },
              { "mData": "Icon" },
              
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [4],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": true,
                  "bSearchable": false
              },

               {
                   "aTargets": [0],
                   "bSortable": true,
                   "bSearchable": true,
                   "mRender": function (data, type, row) {
                       if (row.Title == null)
                           return "____";

                       return row.Title;
                   }
               },

                {
                    "aTargets": [1],
                    "bSortable": true,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        if (row.ParentTitle == null)
                            return "____";

                        return row.ParentTitle;
                    }
                },
               {
                   "aTargets": [2],
                   "bSortable": true,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       if (row.ProcessDescription == null)
                           return "-";

                       return row.ProcessDescription;
                   }
               },
                

             
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
    }
});