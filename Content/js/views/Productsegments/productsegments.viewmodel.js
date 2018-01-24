var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ProductSegmentsModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
    }
});

hbsis.wms.settings.ProductSegmentsViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
    	return ko.observable(new hbsis.wms.settings.ProductSegmentsModel());
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Name" },
              { "mData": "Description" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [2],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },

               {
                   "aTargets": [1],
                   "mData": null,
                   "sDefaultContent": self.settings.actionsMarkup,
                   "bSortable": true,
                   "bSearchable": false
               }
            ]
        };
    }
});