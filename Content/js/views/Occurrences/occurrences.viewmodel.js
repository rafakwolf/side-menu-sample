var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.OccurrenceUserModel = Class.extend({
    init: function (user) {
        this.Id = user.Id;
        this.Name = user.Name;
    }
});

hbsis.wms.settings.OccurrenceWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.settings.OccurrenceModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Description = ko.observable();
        this.CreatedDate = ko.observable();
        this.Type = ko.observable('');
        this.Warehouse = ko.observable(new hbsis.wms.settings.OccurrenceWarehouseModel());

    },
    clear: function () {
        this.Id('');
        this.Type('');
    },
    load: function (model) {
        if (!model)
            return;

        var self = this;
    }
});

hbsis.wms.settings.OccurrencesViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function(opts) {
        this._super(opts);
        //this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        //this.initAutocomplete("#Location_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);

        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Type" });

        $("#Type").select2("val", "", true);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

    },
    initDatetimeRangePicker: function(field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function(start, end) {

                var startDate = start.format(resources.get('SmallDateFormat'));
                var endDate = end.format(resources.get('SmallDateFormat'));

                if (self.startDate != startDate) {
                    self.startDate = startDate;
                    self.dirty(true);
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                    self.dirty(true);
                }

                self.refreshDatatable();
            }
        });
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.OccurrenceModel());
    },
    getModelDescription: function(model) {
        return model.body;
    },
    renderWarehouse: function(warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    initProcessMultiSelect: function(field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 1000, sort: 'Name', direction: 'asc' },
            dataType: 'json',
            success: function(data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var messagesUsers = $.map(data.Rows, function(el) {
                        return new hbsis.wms.settings.MessageUserModel(el);
                    });
                    self.model().AvailableUsers(messagesUsers);
                    $(field).multiSelect();
                }
            }
        })
    },
    clearSaveForm: function() {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
    },
    edit: function(model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
    },
    typeFind: function() {
        var self = this;
        self.Type = hbsis.wms.Helpers.querystring('Type');
        self.dirty(true);
        self.refreshDatatable();
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
    getFormData: function() {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function(el) {
            return $.grep(self.model().AvailableZones(), function(el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },

    getDatatableConfig: function() {
        var self = this;
        return {
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "Type", "value": $("#Type").val() });

            },
            "aoColumns": [
                { "mData": "AuditInfo.CreatedDate" },
                { "mData": "Type" },
                { "mData": "User" },
                { "mData": "DocumentNumber" },
                { "mData": "Description" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        if (row.AuditInfo.CreatedDate == null)
                            return "NULO";

                        return moment(row.AuditInfo.CreatedDate).format("DD/MM/YYYY HH:mm:ss");
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Type);
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {

                        if (row.User != null)
                            return row.User.Name + " (" + row.User.Login + ")";
                        else
                            return "-";
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.DocumentNumber;

                    }
                },
                {
                    "aTargets": [4],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Description;

                    }
                },
            ]
        };
    }
});