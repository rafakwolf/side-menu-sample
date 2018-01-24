var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TaskInterleavingModel = Class.extend({

    init: function () {
        this.Id = ko.observable();
        this.ProcessDescription = ko.observable();
        this.UserName = ko.observable();
        this.Enabled = ko.observable();
        this.Sequence = ko.observable();
        this.WarehouseId = ko.observable();
        this.ProcessId = ko.observable();
        this.UserId = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.ProcessDescription('');
        this.UserName('');
        this.Enabled('');
        this.Sequence('');
        this.WarehouseId('');
        this.ProcessId('');
        this.UserId('');
        
    },
    load: function (model) {
        this.Id(model.Id);
        this.ProcessDescription(model.ProcessDescription);
        this.UserName(model.UserName);
        this.Enabled(model.Enabled);
        this.Sequence(model.Sequence);
        this.WarehouseId(model.WarehouseId);
        this.ProcessId(model.ProcessId);
        this.UserId(model.UserId);
    }
});

hbsis.wms.settings.TaskInterleavingViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ProcessId", this.settings.processesAutocompleteUrl, this.renderProcess);
        this.initAutocomplete("#UserId", this.settings.userAutocompleteUrl, this.renderUser);
    },

    deleteUrl: function (model) {
        return "TaskInterleaving/" + model.Id;
    },

    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ProcessId").select2("val", $("#ProcessId").val(), true);
        $("#UserId").select2("val", $("#UsuarioId").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.TaskInterleavingModel());
    },

    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },

    renderProcess: function (process) {
        return process.Description;
    },

    renderUser: function (u) {
        return u.Name;
    },

    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#ProcessId").select2("val", "", true);
        $("#UserId").select2("val", "", true);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {

        var self = this;
        return {
            "iDisplayLength": 25,
            "aoColumns": [
              { "mData": "UserName" },
              { "mData": "ProcessDescription" },
              { "mData": "Sequence" },
              { "mData": "Enabled" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {

                        if (row.UserName == null)
                            return "-";

                        return row.UserName;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {

                        if (row.ProcessDescription == null)
                            return "-";

                        return row.ProcessDescription;
                    }
                },
                {
                     "aTargets": [2], "mData": null, "bSortable": true,
                     "bSearchable": false, "mRender": function (data, type, row) {

                         if (row.Sequence== null)
                             return "-";

                         return row.Sequence;
                     }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return resources.get(row.Enabled);
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
                    "aTargets": [4],
                    "mData": null,
                    "mRender": function (data, type, row) {
                        {
                            return self.settings.actionsMarkup;
                        }
                    },
                    "bSortable": false,
                    "bSearchable": false
                }
            ],
            "aaSorting": [[1, "asc"]]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 0,
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