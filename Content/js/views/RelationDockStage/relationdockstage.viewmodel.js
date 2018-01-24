var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RDSLocationModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});


hbsis.wms.settings.RDSModel = Class.extend({
    init: function () {
        this.Dock = ko.observable();
    },
    clear: function () {
        this.Dock();

    },
    load: function (model) {

    }
});


hbsis.wms.settings.RDSViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Dock", this.settings.dockAutocompleteUrl, this.renderLocation);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.RDSModel());
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    clearSaveForm: function () {
        this._super();
        $("#Dock").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#Dock").select2("val", $("#Dock").val(), true);


    },
    renderLocation: function (location) {
        return location.Code
    },
    dockFind: function () {
        var self = this;
        self.Dock = hbsis.wms.Helpers.querystring('Dock');
        self.dirty(true);
        self.refreshDatatable();

    },

    updateList: function() {
        var self = this;
        self.refreshDatatable();

    },

    initAutocomplete: function (field, autocompleteUrl, render, minimumInput) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: minimumInput,
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
                if (id !== "" && id.split("-").length == 5) {
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
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "Dock", "value": $("#Dock").val() });
            },
            "aoColumns": [
              { "mData": "Warehouse.Name" },
              { "mData": "Stage" },
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [0], "mData": null, "bSortable": false,
                  "bSearchable": false, "mRender": function (data, type, row)
                  { return row.Warehouse.Name; }
              },
              {
                  "aTargets": [1], "mData": null, "bSortable": false,
                  "bSearchable": false, "mRender": function (data, type, row)
                  { return row.Dock.Code; }
              },
              {
                  "aTargets": [2], "mData": null, "bSortable": false,
                  "bSearchable": false, "mRender": function (data, type, row)
                  { return row.Stage.Code; }
              },

               {
                   "aTargets": [3], "mData": null, "bSortable": false,
                   "bSearchable": false, "mRender": function (data, type, row)
                   { return '<input type="text" tipo="pick" value="' + row.PickFlow + '" stage="' + row.Stage.Id + '" dock="' + row.Dock.Id + '">'; }
               },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return '<input type="text" tipo="put" value="' + row.PutFlow + '" stage="' + row.Stage.Id + '" dock="' + row.Dock.Id + '">'; }
                },

            ]


        };
    }
});