var hbsis = hbsis || { wms: {} };
hbsis.wms.inventory = hbsis.wms.inventory || {};

hbsis.wms.inventory.ManterRotaViewModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Nome = ko.observable();
        this.Endereco = ko.observable();
        this.Sequencia = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.Endereco('');
        this.Sequencia('');
    },
    load: function (model) {
        this.Endereco(model.Nome);
    }
});

hbsis.wms.inventory.ManterRotaViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#LocalizacaoRotaContagens", this.settings.locationAutocompleteUrl, this.renderAssociateLocationID);
    },
    renderAssociateLocationID: function (code) {
        return Location.Code;
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.inventory.ManterRotaViewModel());
    },
    getModelDescription: function (model) {
        return model.Nome;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Nome" },
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
                          return self.settings.deleteMarkup;
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