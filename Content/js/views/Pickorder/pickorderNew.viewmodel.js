var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.PoWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.management.AssociateUserIDModel = Class.extend({
    init: function (users) {

        if (!users) {
            users = { Id: '', Name: '' };            
        }

        this.Id = users.Id;
        this.Name = users.Name;
    }
});

hbsis.wms.management.ReleaseLoadsLocationModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});


hbsis.wms.management.ReleaseLoadsModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Code = ko.observable();
        this.Tipo = ko.observable();
        //this.Warehouse = ko.observable(new hbsis.wms.management.PoWarehouseModel());
        this.Warehouse = ko.observable();        

        this.UserId = ko.observable();
        this.Priority = ko.observable();


        this.UserIdFullPallet = ko.observable();
        this.PriorityFullPallet = ko.observable();

        this.UserIdMixedPallet = ko.observable();
        this.PriorityMixedPallet = ko.observable();
    },
    clear: function () {
        this.Code('');
    },
    load: function (model) {
        this.Id(model.Id);
        //this.Warehouse(new hbsis.wms.management.PoWarehouseModel(model.Warehouse));
        this.Warehouse(model.Warehouse);
        this.Code(model.Code);
        this.Priority(model.Priority);
    }
});


hbsis.wms.management.ReleaseLoadsViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment().add(1, 'days'),
    endDate: moment().add(1, 'days'),
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#UserId", this.settings.associateUserIDAutocompleteUrl, this.renderAssociateUserID);
        this.initAutocomplete("#UserIdFullPallet", this.settings.associateUserIDAutocompleteUrl, this.renderAssociateUserID);
        this.initAutocomplete("#UserIdMixedPallet", this.settings.associateUserIDAutocompleteUrl, this.renderAssociateUserID);


        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        var self = this;

        $("#datatable").on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);

    },
    edit: function (model) {
        this._super(model);
        $("#UserId").select2("val", $("#UsuarioId").val(), true);
    },
    initDatetimeRangePicker: function (field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function (start, end) {

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
    createModel: function () {
        return ko.observable(new hbsis.wms.management.ReleaseLoadsModel());
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
    },
    statusFinder: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    renderAssociateUserID: function (AssociateUserID) {
        return AssociateUserID.Name;
    },
    searchRequestDataPickArea: function (term, page) {
        var warehouse = $("#Warehouse_Id").val();
        if (warehouse) {
            return {
                search: term,
                start: 0,
                length: 10,
                field1: 'code',
                value1: String(warehouse)
            };
        }
        return {
            search: term,
            start: 0,
            length: 10
        };
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "status", "value": $("#Status").val() });
                if ($("#Status").val() != "") {
                    aoData.push({ "name": "allStatus", "value": "false" });
                } else {
                    aoData.push({ "name": "allStatus", "value": "true" });
                }
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              //{ "mData": "Warehouse" },
              { "mData": "Code" },
              { "mData": "Tipo" },
              { "mData": null },
              { "mData": null },
              { "mData": null },
              { "mData": null }
            ],
            "aoColumnDefs": [
                 //{
                 //    "aTargets": [0], "mData": null, "bSortable": false,
                 //    "bSearchable": true, "mRender": function (data, type, row)
                 //    {
                 //        return row.Warehouse.ShortCode;
                 //    }
                 //},
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.Code; }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.Tipo; }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row) {
                        if (row.LicensePlate == null)
                            return "-";
                        return row.LicensePlate;
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.DeliveryDate == null)
                            return "-";
                        return moment(row.DeliveryDate).format("DD/MM/YYYY");
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return resources.get(row.Status); },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                        else if (sData == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Novo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        }
                        else if (sData == "Parcial") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        }
                        else if (sData == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                        }
                        else if (sData == "Carregado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (sData == "Liberado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (sData == "Separado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                    }


                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Status == "New" || row.Status == "Released" || row.Status == "Hold") {
                            return self.settings.actionsMarkup;
                            //return '<input type="checkbox" class="loadId" value="' + row.Code + '" >';

                        } else {
                            return self.settings.actionsMarkup;

                            //return " - ";
                        }
                        
                    }
                }
            ]
        };
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
    }
});