var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.LocationTypeModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
        this.Fixed = ko.observable();
        this.Acronym = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
        this.Fixed(false);
        this.Acronym('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
        this.Fixed(model.Fixed);
        this.Acronym(model.Acronym);
    }
});

hbsis.wms.settings.LocationTypesViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.LocationTypeModel());
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Name" },
              { "mData": "Acronym" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [2],
                  "mData": null,
                  "mRender": function (data, type, row) {
                      if (row.Fixed) {
                          return "";
                      } else {
                          return self.settings.actionsMarkup;
                      }
                  },
                  "bSortable": false,
                  "bSearchable": false
              },

              {
                  "aTargets": [1],
                  
                  "mRender": function (data, type, row) {                                            
                     return row.Acronym;
                  },
                  "bSortable": true,
                  "bSearchable": true
              },

              {
                  "aTargets": [0],
                  "mRender": function (data, type, row) {
                      
                      if (row.Name == null)
                          return "-";

                      return row.Name;

                      //if (row.Fixed)
                      //{
                      //    return resources.get(row.Acronym);
                      //}
                      //else
                      //{
                      //    return row.Name;
                      //}
                  }
              }
            ]
        };
    }
});