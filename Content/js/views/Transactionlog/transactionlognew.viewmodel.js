var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TransactionLogNewViewModel = hbsis.wms.CrudForm.extend({
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
              { "mData": "Warehouse" },
              { "mData": "User" },
              { "mData": "CreatedDate" },
              { "mData": "TransactionLogType" },
              { "mData": "TransactionLogOperationType" },
              //{ "mData": null }
              
            ],"aoColumnDefs": [
                 {
                    "aTargets": [0],"mData": null,"bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        return row.Warehouse.ShortCode;                        
                    }
                 },
                 {
                     "aTargets": [1], "mData": null, "bSortable": false,
                     "bSearchable": false, "mRender": function (data, type, row) {
                         return row.User.Name + " (" +row.User.Login + ")";
                     }
                 },
                 {
                     "aTargets": [2], "mData": null, "bSortable": true,
                     "bSearchable": false, "mRender": function (data, type, row) {
                         return moment(row.CreatedDate).format("DD/MM/YY HH:mm:ss");
                     }
                 },

                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return resources.get(row.TransactionLogType)
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return resources.get(row.TransactionLogOperationType)
                    }
                },
                //{
                //    "aTargets": [5],
                //    "mData": null,
                //    "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                //  "<i class=\"fa fa-search\"></i></a> ",
                //    "bSortable": false,
                //    "bSearchable": false

                //},
                           
            ]
        };
    }
});