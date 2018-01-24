var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PickConferenceModel = Class.extend({
    init: function () { }
});

hbsis.wms.settings.PickConferenceViewModel = hbsis.wms.CrudForm.extend({
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

        this.initDateTimePicker("#reportrange");
    },

    initDateTimePicker: function (field) {
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
                { "mData": "PickMaster" },
                { "mData": "PickMaster" },
                { "mData": "FromLocation" },
                { "mData": "Status" },
                { "mData": "User" },
                { "mData": "AuditInfo.UpdatedDate" }
            ],

            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.Warehouse.ShortCode;
                    }
                },

                {
                    "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.PickMaster.OrderNumber;
                    }
                },

                {
                    "aTargets": [2], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.PickMaster.PalletDescription;
                    }
                },

                {
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.FromLocation.Description;
                    }
                },

                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {                        
                        return resources.get(row.Status);
                    }
                },

                {
                    "aTargets": [5], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {                        
                        if (row.Status != 'Unassigned')
                            return row.User.Name;
                        else
                            return "";
                    }
                },

                {
                    "aTargets": [6], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Status != 'Unassigned')
                            return moment(row.AuditInfo.UpdatedDate).format("DD/MM/YY HH:mm");
                        else
                            return "";
                    }
                }
            ]

        };
    }
});