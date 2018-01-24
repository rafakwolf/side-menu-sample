var hbsis = hbsis || { wms: {} };
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
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
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
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [2], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          return resources.get(row.SequenceId);
                      }
                  },

                  {
                      "aTargets": [3], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.LicensePlate != null)
                              return row.LicensePlate;
                          else
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
                          if (row.LocationCode != null) {
                              return resources.get(row.LocationCode);
                          } else {
                              return " - ";
                          }

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
                          if (sData == "Associado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                          }
                          else if (sData == "Completo") {
                              $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                          }
                          else if (sData == "Não Associado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                          }
                          else if (sData == "Parcial") {
                              $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                          }
                          else if (sData == "Bloqueado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                          }
                          else if (sData == "Cancelado") {
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
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return moment(row.UpdatedDate).format("DD/MM/YY HH:mm");
                    }
                }
            ]

        };
    }
});