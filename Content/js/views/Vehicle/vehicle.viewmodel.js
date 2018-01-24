var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.VehicleModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Status = ko.observable();
        this.WarehouseId = ko.observable();
        this.Bays = ko.observable();
        this.BaySize = ko.observable();
        this.Description = ko.observable();
        this.LicensePlate = ko.observable();
        this.ActualLocationId = ko.observable();
        this.CarrierId = ko.observable();
        this.LastEntrance = ko.observable();
        this.LastDeparture = ko.observable();
        this.LastKilometrage = ko.observable();
        this.Tipo = ko.observable();
        this.UseManeuver = ko.observable(false);
    },
    clear: function () {
        this.Id('');
        this.Status('');
        this.WarehouseId('');
        this.Bays('');
        this.BaySize('');
        this.Description('');
        this.LicensePlate('');
        this.ActualLocationId();
        this.CarrierId();
        this.LastEntrance('');
        this.LastDeparture('');
        this.LastKilometrage('');
        this.Tipo('');
        this.UseManeuver(false);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Status(model.Status);
        this.Bays(model.Bays);
        this.BaySize(model.BaySize);
        this.WarehouseId(model.WarehouseId);
        this.Description(model.Description);
        this.LicensePlate(model.LicensePlate);
        this.ActualLocationId(model.ActualLocationId);
        this.CarrierId(model.CarrierId);
        this.LastKilometrage(model.LastKilometrage);
        this.UseManeuver(model.UseManeuver);
        this.Tipo(model.Tipo);
    }
});

hbsis.wms.management.VehicleViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ActualLocationId", this.settings.locationAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#CarrierId", this.settings.carrierAutocompleteUrl, this.renderCarrier);
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Tipo" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#BaySize" });
        var self = this;

        $("#datatable").on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $("#ActualLocationId").addClass("ignore");
        $("#CarrierId").addClass("ignore");
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.management.VehicleModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderCarrier: function (carrier) {
        return carrier.Name;
    },
    renderLocation: function (location) {
        return location.Code + ' - ' + location.Description;
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    clearSaveForm: function () {
        this._super();
        $("#ActualLocationId").select2("val", "", true);
        $("#WarehouseId").select2("val", "", true);
        $("#CarrierId").select2("val", "", true);
        $("#Tipo").select2("val", "", true);
        $("#BaySize").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#ActualLocationId").select2("val", $("#ActualLocationId").val(), true);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#CarrierId").select2("val", $("#CarrierId").val(), true);
        $("#Tipo").select2("val", $("#Tipo").val(), true);
        $("#BaySize").select2("val", $("#BaySize").val(), true);
    },
    searchRequestDataPickArea: function (term, page) {
        var warehouse = $("#WarehouseId").val();
        if (warehouse) {
            return {
                search: term,
                start: 0,
                length: 10,
                field1: 'warehouse',
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
            "aoColumns": [
              { "mData": "WarehouseName" },
              { "mData": "Status" },
              { "mData": "Description" },
              { "mData": "LicensePlate" },
              { "mData": "Bays" },
              { "mData": "ActualLocationDescription" },
              { "mData": "CarrierName" },
              { "mData": "LastEntrance" },
              { "mData": "LastDeparture" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [0], "mData": null, "bSortable": false,
                  "bSearchable": false, "mRender": function(data, type, row) {
                       return row.WarehouseName;
                  }
              },
                {
                    "aTargets": [1],
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.Status);
                    }
                },

              {
                  "aTargets": [5],
                  "bSortable": true,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.ActualLocationDescription;
                  }
              },
              {
                  "aTargets": [6],
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.CarrierName;
                  }
              },
              {
                  "aTargets": [7],
                  "bSortable": true,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      if (row.LastEntrance == null)
                          return "-";
                      return moment(row.LastEntrance).format("DD/MM/YYYY");
                  }
              },
              {
                  "aTargets": [8],
                  "bSortable": true,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      if (row.LastDeparture == null)
                          return "-";
                      return moment(row.LastDeparture).format("DD/MM/YYYY");
                  }
              },
              {
                  "aTargets": [9],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
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
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});