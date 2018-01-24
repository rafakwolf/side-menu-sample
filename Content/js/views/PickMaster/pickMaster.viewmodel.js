var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PickMasterModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.OrderNumber = ko.observable();
        this.PalletDescription = ko.observable();
        this.StatusPickMaster = ko.observable();
        this.UserId = ko.observable();
        this.AssociateUserId = ko.observable();
        this.AssociateUserFlag = ko.observable();
        this.WarehouseId = ko.observable();
               
    },
    clear: function () {
        this.Id('');
        this.OrderNumber('');
        this.PalletDescription('');
        this.StatusPickMaster('');
        this.UserId('');
        this.AssociateUserId('');
        this.AssociateUserFlag(false);
        this.WarehouseId('');   
    },
    load: function (model) {
        this.Id(model.Id);
        this.OrderNumber(model.OrderNumber);
        this.PalletDescription(model.PalletDescription);
        this.StatusPickMaster(model.StatusPickMaster);
        this.UserId(model.UserId);
        this.AssociateUserId(model.AssociateUserId);
        this.AssociateUserFlag(model.AssociateUserFlag);
        this.WarehouseId(model.WarehouseId);    
    }
});

hbsis.wms.settings.PickMasterViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#AssociateUserId", this.settings.associateUserIDAutocompleteUrl, this.renderAssociateUserID);

        hbsis.wms.Helpers.initAutoCompleteEnum({field: "#Type"});

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
            },

            });
        },

    clearSaveForm: function () {
        this._super();
        $("#Type").select2("val", "", true);
        $("#WarehouseId").select2("val", "", true);
        $("#AssociateUserId").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#Type").select2("val", $("#Type").val(), true);
        $("#AssociateUserId").select2("val", $("#AssociateUserId").val(), true);

    },

    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PickMasterModel());
    },

    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderAssociateUserID: function (AssociateUserID) {
        return AssociateUserID.Name;
    },
    renderProfile: function (profile) {
        return profile.Name;
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

  

   
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },

            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),

            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "OrderNumber" },
              { "mData": "PalletDescription" },
              { "mData": "Priority" },
              { "mData": "StatusPickMaster" },
              { "mData": "ZoneName" },
              { "mData": "UserName" },
              { "mData": "CreatedDate" },
              { "mData": "OrderDate" },
              { "mData": "AssociateUserName" },       
              { "mData": null }

            ],
            "aoColumnDefs": [
              {
                  "aTargets": [10],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },
              {
                  "aTargets": [0], "mData": null, "bSortable": false,
                  "bSearchable": false, "mRender": function (data, type, row) {
                      if (row.WarehouseCode == null)
                          return "-";

                      return row.WarehouseCode;
                  }
              },
                {
                    "aTargets": [1], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return (row.OrderNumber); }
                },

                {
                    "aTargets": [2], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        if (row.BulkPallet)
                            return (row.PalletDescription + ' <strong>(F)</strong>');
                        else
                            if (row.IsRepack)
                                return (row.PalletDescription + ' <strong>(R)</strong>');
                        else
                            return (row.PalletDescription + ' ');
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return resources.get(row.StatusPickMaster); },

                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                        else if (sData == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Conferido") {
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
                        else if (sData == "Expedido") {
                            $(nTd).css({ "font-weight": "bold", "color": "#008000" });
                        }
                        else if (sData == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });

                        }
                    }
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.ZoneName == null)
                            return "-";

                        return row.ZoneName;
                    }

                },
              {
                    "aTargets": [6], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        if (row.UserName == null)
                            return "-";

                        return row.UserName;
                    }
              },   
              {
                  "aTargets": [7],
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {

                      return moment(row.CreatedDate).format("DD/MM/YY HH:mm");
                  }
              },
                {
                    "aTargets": [8], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return moment(row.OrderDate).format("DD/MM/YY");
                    }         
                },

                  {
                      "aTargets": [9], "mData": null, "bSortable": false,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          if (row.AssociateUserName == null)
                              return "-";

                          return row.AssociateUserName;
                      }
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
    }
});
