var hbsis = hbsis || { wms: {} };
var paginaAtualZero = true;  
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.ItemStockWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.settings.ItemStockLocationRefModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});

hbsis.wms.settings.LotRefModel = Class.extend({
    init: function (Model) {
        if (!Model) {
            Model = { Id: '', Number: '' };
        }

        this.Id = Model.Id;
        this.Number = Model.Number;
    }
});

hbsis.wms.settings.WorkQueueModel = Class.extend({
    init: function () {

    }
});

hbsis.wms.settings.WorkQueueViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Location_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);
        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#WorkType"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });

        $("#WorkType").val('');
        $("#WorkType").select2("val", $("#WorkType").val(), true);

        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);

        this.refreshDatatable();

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");
    },
    buscar: function() {
        paginaAtualZero = true;   
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
       // $("#datatable").DataTable().page('first');
        paginaAtualZero = false;
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
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                }
            }
        });
    },
    clearSaveForm: function () {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
        $("#Location_Id").select2("val", "", true);


    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#Location_Id").select2("val", $("#Location_Id").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.WorkQueueModel());
    },
    workTypeFind: function () {
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLot: function (lot) {
        return lot.Number;
    },
    renderCompany: function (company) {
        return company.Name;
    },
    renderLocation: function (location) {
        return location.Code
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
    getFormData: function () {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function (el) {
            return $.grep(self.model().AvailableZones(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                if ($("#WorkType").val() != "" && $("#Status").val() != "") {
                    aoData.push({ "name": "AllTypes", "value": "false" });
                } else {
                    aoData.push({ "name": "AllTypes", "value": "true" });
                }
                if ($("#WorkType").val() != "") {
                    aoData.push({ "name": "WQType", "value": "true" });
                    aoData.push({ "name": "WorkType", "value": $("#WorkType").val() });
                } else {
                    aoData.push({ "name": "WQType", "value": "false" });
                    aoData.push({ "name": "WorkType", "value": $("#WorkType").val() });
                }

                if ($("#Status").val() != "") {
                    aoData.push({ "name": "WQStatus", "value": "true" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                } else {
                    aoData.push({ "name": "WQStatus", "value": "false" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                }

                if (paginaAtualZero) {
                    aoData.push({ "name": "start", "value": 0 });
                }    

                
                aoData.push({"name": "EnderecoOrigem", "value": $("#origem").val()}),
                aoData.push({"name": "Placa", "value": $("#placa").val()}),
                aoData.push({"name": "Mapa", "value": $("#mapa").val()}),
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "DocumentNumber" },
              { "mData": "SequenceId" },
              { "mData": "LicensePlate" },
              { "mData": "FromLocationCode" },
              { "mData": "LocationCode" },
              { "mData": "PalletDescription" },
              { "mData": "Priority" },
              { "mData": "Status" },
              { "mData": "WorkType" },
              { "mData": "UserLogin" },              
              { "mData": "CreatedDate" },
                { "mData": "DataUltimaAssociacao" },
              { "mData": "CreatedDate" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return row.WarehouseCode;
                    }
                },
                  {
                      "aTargets": [1], "mData": null, "bSortable": false,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          if (row.DocumentNumber != null)
                              return row.DocumentNumber;
                          return '-';
                      }
                  },
                  {
                      "aTargets": [2], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.SequenceId != null)
                              return row.SequenceId;
                          return '-';
                      }
                  },

                  {
                      "aTargets": [3], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.LicensePlate != null)
                              return row.LicensePlate;
                          return '-';
                      }
                  },
                  {
                      "aTargets": [4], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.FromLocationCode != null) {
                              return resources.get(row.FromLocationCode);
                          } else {
                              return " - ";
                          }
                      }
                  },
                  {
                      "aTargets": [5], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.LocationCode != null)
                              return resources.get(row.LocationCode);
                          return " - ";
                      }
                  },
                  {
                      "aTargets": [6], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          if (row.PalletDescription != null)
                              return row.PalletDescription;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [7], "mData": null, "bSortable": true,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          return row.Priority;
                      }
                  },
                  {
                      "aTargets": [8], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          return resources.get(row.Status);
                      },
                      "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                          if (sData == "Associada") {
                              $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                          }
                          else if (sData == "Completa") {
                              $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                          }
                          else if (sData == "Não Associada") {
                              $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                          }
                          else if (sData == "Parcial") {
                              $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                          }
                          else if (sData == "Bloqueada") {
                              $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                          }
                          else if (sData == "Cancelada") {
                              $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                          }
                      }
                  },
                  {
                      "aTargets": [9], "mData": null, "bSortable": true,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          return resources.get(row.WorkType);
                      }
                  },
                  {
                      "aTargets": [10], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.UserLogin != null) {
                              return resources.get(row.UserLogin);
                          } else {
                              return " - ";
                          }
                      }
                  },
                  {
                      "aTargets": [11], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          return moment(row.CreatedDate).format("DD/MM/YY HH:mm");
                      }
                  },
                {
                    "aTargets": [12], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                        return row.DataUltimaAssociacao !== undefined && row.DataUltimaAssociacao !== null
                            ? moment(row.DataUltimaAssociacao).format("DD/MM/YY HH:mm:ss")
                            : null;
                    }
                },
                {
                    "aTargets": [13], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return moment(row.UpdatedDate).format("DD/MM/YY HH:mm");
                    }
                }
            ]

        };
    }
});