var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RelationDockStageModel = Class.extend({
	init: function () {
	}
});

hbsis.wms.settings.RelationDockStageViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
	init: function (opts) {
	    this._super(opts);

	   
	},
	clearSaveForm: function () {
		this._super();
	},
	edit: function (model) {
		this._super(model);
	},
	createModel: function () {
	    return ko.observable(new hbsis.wms.settings.RelationDockStageViewModel());
	},
	getFormData: function () {
		return $.toDictionary(ko.toJS(this.model()));
	},
	getDatatableConfig: function () {
		var self = this;
		return {
			"aoColumns": [
              { "mData": "Warehouse" },
              { "mData": "Dock" },
              { "mData": "Stage" }
              
			],
			"aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row)
                    { return row.Warehouse.Code; }
                },
				{
				    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": false, "mRender": function (data, type, row)
				    {
				        return row.Dock.Code;
				    }
				},
				{
				    "aTargets": [2], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row)
				    { return row.Stage.Code; }
				},

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