var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.WarehouseModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.ShortCode = ko.observable();
        this.AllowModifyOrderStatus = ko.observable(false);
        this.AllowNegativeInventory = ko.observable(false);
        this.AutomaticLoadRelease = ko.observable(false);
        this.AllowPickByPallet = ko.observable(false);
        this.UnbCode = ko.observable();
        this.EhFabrica = ko.observable(false);
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.ShortCode('');
        this.AllowModifyOrderStatus(false);
        this.AllowNegativeInventory(false);
        this.AutomaticLoadRelease(false);
        this.AllowPickByPallet(false);
        this.EhFabrica(false);
        this.UnbCode('');
   
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.ShortCode(model.ShortCode);
        this.AllowModifyOrderStatus(model.AllowModifyOrderStatus);
        this.AllowNegativeInventory(model.AllowNegativeInventory);
        this.AutomaticLoadRelease(model.AutomaticLoadRelease);
        this.AllowPickByPallet(model.AllowPickByPallet);
        this.EhFabrica(model.EhFabrica);
        this.UnbCode(model.UnbCode);
    }
});

hbsis.wms.settings.WarehouseViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.WarehouseModel());
    },
    getModelDescription: function (model) {
        return model.ShortCode + ' - ' + model.Name;
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ShortCode" },
              { "mData": "Name" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [2],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              }
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});