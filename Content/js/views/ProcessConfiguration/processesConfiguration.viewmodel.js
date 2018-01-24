var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ProcessConfigurationModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.WarehouseId = ko.observable();
        this.WarehouseCode = ko.observable();
        this.ProcessId = ko.observable();
        this.ProcessDescription = ko.observable();
        this.Enabled = ko.observable();
        this.BarCode = ko.observable();
        this.Touch = ko.observable();
        this.Voice = ko.observable();
        this.RFID = ko.observable();
        this.IPS = ko.observable();
        this.StockControl = ko.observable();
        this.TaskInterleaving = ko.observable();
        this.UpdatedBy = ko.observable();
        this.UpdatedDate = ko.observable();

    },
    clear: function () {
        this.Id('');
        this.WarehouseId('');
        this.WarehouseCode('');
        this.ProcessId('');
        this.ProcessDescription('');
        this.Enabled('');
        this.BarCode('');
        this.Touch('');
        this.Voice('');
        this.RFID('');
        this.IPS('');
        this.StockControl('');
        this.TaskInterleaving('');
        this.UpdatedBy('');
        this.UpdatedDate('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.WarehouseId(model.WarehouseId);
        this.WarehouseCode(model.WarehouseCode);
        this.ProcessId(model.ProcessId);
        this.ProcessDescription(model.ProcessDescription);
        this.Enabled(model.Enabled);
        this.BarCode(model.BarCode);
        this.Touch(model.Touch);
        this.Voice(model.Voice);
        this.RFID(model.RFID);
        this.IPS(model.IPS);
        this.StockControl(model.StockControl);
        this.TaskInterleaving(model.TaskInterleaving);
        this.UpdatedBy(model.UpdatedBy);
        this.UpdatedDate(model.UpdatedDate);
    }
});

hbsis.wms.settings.ProcessConfigurationViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ProcessId", this.settings.processesAutocompleteUrl, this.renderProcess);
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ProcessId").select2("val", $("#ProcessId").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ProcessConfigurationModel());
    },

    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },

    renderProcess: function (process) {
        return process.Description;
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#ProcessId").select2("val", "", true);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        
        var self = this;
        return {
            "iDisplayLength": 25,
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "Description" },
              { "mData": "Enabled" },
              { "mData": "BarCode" },
              { "mData": "Touch" },
              { "mData": "Voice" },
              { "mData": "IPS" },
              { "mData": "StockControl" },
              { "mData": "TaskInterleaving" },
              { "mData": "UpdatedBy" },
              { "mData": "UpdatedDate" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {

                        if (row.WarehouseCode == null)
                            return "-";

                        return row.WarehouseCode;
                    }
                },
                {
                       "aTargets": [1], "mData": null, "bSortable": true,
                       "bSearchable": false, "mRender": function (data, type, row)
                       {

                           if (row.Description == null)
                               return "-";

                           return row.Description;
                       }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false,
                      "mRender": function (data, type, row) {
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
                    "aTargets": [3], "mData": null, "bSortable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.BarCode);
                      },

                      "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                          if (sData == "Sim") {
                              $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });                              
                          }                          
                          }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                       "mRender": function (data, type, row) {
                           return resources.get(row.Touch);
                       },

                       "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                           if (sData == "Sim") {
                               $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                           }
                       }
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                        "mRender": function (data, type, row) {
                            return resources.get(row.Voice);
                        },

                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            if (sData == "Sim") {
                                $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                            }
                        }
                },
                {
                    "aTargets": [6], "mData": null, "bSortable": false,
                        "mRender": function (data, type, row) {
                            return resources.get(row.IPS);
                        },

                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            if (sData == "Sim") {
                                $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                            }
                        }
                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, row) {
                        return resources.get(row.StockControl);
                    },
                    "bSortable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Sim") {
                            $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                        }
                    }
                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, row) {
                        return resources.get(row.TaskInterleaving);
                    },
                    "bSortable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Sim") {
                            $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                        }
                    }
                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, row) {
                        return resources.get(row.UpdatedBy);

                    }
                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, row) {
                        return row.UpdatedDate !== null ? moment(row.UpdatedDate).format("DD/MM/YYYY HH:mm:ss"): '-';
                    }
                },
                {
                    "aTargets": [11],
                    "mData": null,
                    "mRender": function (data, type, row) {
                        {
                            return self.settings.editMarkup;
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