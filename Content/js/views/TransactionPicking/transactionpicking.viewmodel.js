var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TransactionPickingsViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "OrderNumber" },
              { "mData": "OrderNumber" },
              { "mData": "PalletDescription" },
              { "mData": "ZoneName" },
              { "mData": "User" },
              { "mData": "PickingStatus" },
              { "mData": "ItemDescription" },
              { "mData": "Quantity" },
              { "mData": "PreviusLocationCode" },
              { "mData": "TargetLocationCode" },
              { "mData": "StartTranDate" },
              { "mData": "EndTranDate" },
              { "mData": "TimeRange" }
            ], "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return row.DeliveryDate;
                    }
                },
                 {
                     "aTargets": [1], "mData": null, "bSortable": true,
                     "bSearchable": false, "mRender": function (data, type, row) {
                         return row.OrderNumber;
                     }
                 },
                  {
                      "aTargets": [2], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          return row.PalletDescription;
                      }
                  },
                  {
                      "aTargets": [3], "mData": null, "bSortable": false,
                      "bSearchable": false, "mRender": function (data, type, row) {
                         return row.ZoneName;
                      }
                  },
                   {
                       "aTargets": [4], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row) {
                           return row.UserLogin;
                       }
                   },
                    {
                        "aTargets": [5], "mData": null, "bSortable": false,
                        "bSearchable": false, "mRender": function (data, type, row) {
                            if (row.PickingStatus) {
                                return resources.get(row.PickingStatus);
                            }
                            return "";
                        },
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            if (sData == "Em Execução") {
                                $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                            }
                            else if (sData == "Completo") {
                                $(nTd).css({ "font-weight": "bold", "color": "#228B22" });
                            }
                            else if (sData == "Carregado") {
                                $(nTd).css({ "font-weight": "bold", "color": "#228B22" });
                            }
                            else if (sData == "Conferido") {
                                $(nTd).css({ "font-weight": "bold", "color": "#228B22" });
                            }
                            else if (sData == "Separado") {
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
                            else if (sData == "Cancelado") {
                                $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                            }
                        }
                    },
                   {
                       "aTargets": [6], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row) {
                           if (row.ItemDescription) {
                               return row.ItemDescription;
                           }
                           return "";
                       }
                   },
                   {
                       "aTargets": [7],
                       "bSortable": false, "sClass": "text-center",
                       "bSearchable": false,
                       "mRender": function (data, type, row) {

                           if (row.Quantity == '0')
                               return "-";
                           return row.Quantity;
                       }
                   },
                  {
                      "aTargets": [8],
                      "bSortable": false, "sClass": "text-center",
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.PreviusLocationCode) {
                              return row.PreviusLocationCode;
                          }
                          return "-";
                      }
                  },
                   {
                       "aTargets": [9],
                       "bSortable": false, "sClass": "text-center",
                       "bSearchable": false,
                       "mRender": function (data, type, row) {
                           if (row.TargetLocationCode) {
                               return row.TargetLocationCode;
                           }
                           return "-";
                       }
                   },
                {
                    "aTargets": [10],
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.StartTranDate == null)
                            return "-";
                        return moment(row.StartTranDate).format("DD/MM/YY HH:mm:ss");
                    }
                },
               {
                   "aTargets": [11],
                   "bSortable": false, "sClass": "text-center",
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       if (row.EndTranDate == null)
                           return "-";
                       return moment(row.EndTranDate).format("DD/MM/YY HH:mm:ss");
                   }
               },
               {
                   "aTargets": [12],
                   "bSortable": false, "sClass": "text-center",
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       return row.TimeRange;                           
                   }
               },
            ]
        };
    }
});