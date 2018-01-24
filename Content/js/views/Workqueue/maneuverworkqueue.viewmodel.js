var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ManeuverWorkQueueModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Priority = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Priority('');


    },
    load: function (model) {
        this.Id(model.Id);
        this.Priority(model.Priority);

    }
});

hbsis.wms.settings.ManeuverWorkQueueViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start) {
            this.startDate = moment(start, 'DD/MM/YYYY');
        }

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        this.initDatetimeRangePicker("#reportrange");
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ManeuverWorkQueueModel());
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
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
              { "mData": "SequenceId" },
              { "mData": "LicensePlate" },
              { "mData": "FromLocation" },
              { "mData": "Location" },
              { "mData": "Priority" },
              { "mData": "Status" },
              { "mData": "CreatedBy" },
			  { "mData": "AuditInfo.CreatedDate" },
              { "mData": null }
            ],
            "aoColumnDefs": [

                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.Warehouse.ShortCode;

                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.SequenceId != null)
                            return row.SequenceId;
                        else
                            return '-';
                    }
                },
				{
				    "aTargets": [3], "mData": null, "bSortable": true, "bSearchable": false, "mRender": function (data, type, row) {
				        if (row.FromLocation != null)
				            return row.FromLocation.Code;
				        else
				            return '-';
				    }
				},
				{
				    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
				        if (row.Location != null)
				            return row.Location.Code;
				        else
				            return '-';
				    }
				},
                {
                    "aTargets": [6], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return resources.get(row.Status); },

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
                    }
                },
                {
                    "aTargets": [7], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row)
                    { return row.User.Login; }
                },
                {
                    "aTargets": [8], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return moment(row.AuditInfo.CreatedDate).format("DD/MM/YY HH:mm");
                    }
                },
                {
                    "aTargets": [9],
                    "mData": null,
                    "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                  "<i class=\"fa fa-pencil\"></i></a> ",
                    "bSortable": false,
                    "bSearchable": false

                }
            ]
        };
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
});