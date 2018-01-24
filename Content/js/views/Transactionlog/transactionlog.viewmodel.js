var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TransactionLogsViewModel = hbsis.wms.CrudForm.extend({
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
              { "mData": "User" },              
              { "mData": "Process" },
              { "mData": "GenericAttribute2" },
              { "mData": "Item" },
              { "mData": "Quantity" },
              { "mData": "PreviusLocation" },
              { "mData": "TargetLocation" },
              { "mData": "StartTranDate" },
              { "mData": "EndTranDate" },
              { "mData": "TimeRange" }
            ],"aoColumnDefs": [
                 {
                     "aTargets": [0], "mData": null, "bSortable": false,
                     "bSearchable": false, "mRender": function (data, type, row)
                     { return row.User.Name; }
                 },

                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.Process) {
                            return row.Process.Description;
                        } else {
                            return row.ProcessName;
                        }
                    }
                },

                {
                    "aTargets": [2],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.GenericAttribute2) {
                            return row.GenericAttribute2;
                        } else {
                            return "-";
                        }
                    }
                },

                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.Item) {
                            return row.Item.Code + ' - ' + row.Item.Description;
                        } else {
                            return "-";
                        }
                    }
                },  

                  {
                      "aTargets": [5],
                      "bSortable": false, "sClass": "text-center",
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.PreviusLocation == null)
                              return "-";
                          return row.PreviusLocation.Code;
                      }
                  },

                   {
                       "aTargets": [6],
                       "bSortable": false, "sClass": "text-center",
                       "bSearchable": false,
                       "mRender": function (data, type, row) {
                           if (row.TargetLocation == null)
                               return "-";
                           return row.TargetLocation.Code;
                       }
                   },

                {
                    "aTargets": [7],
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.StartTranDate == null)
                            return "-";
                        return moment(row.StartTranDate).format("DD/MM/YY HH:mm:ss");
                    }
                },


               {
                   "aTargets": [8],
                   "bSortable": false, "sClass": "text-center",
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       if (row.EndTranDate == null)
                           return "-";
                       return moment(row.EndTranDate).format("DD/MM/YY HH:mm:ss");
                   }
               },              
            ]
        };
    }
});