var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemStockWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.settings.ProcessModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Description = ko.observable();
        this.Type = ko.observable();
        this.UpdatedBy = ko.observable();
        this.UpdatedDate = ko.observable();

    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Description('');
        this.Type('');
        this.UpdatedBy('');
        this.UpdatedDate('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Description(model.Description);
        this.Type(model.Type);
        this.UpdatedBy(model.UpdatedBy);
        this.UpdatedDate(model.UpdatedDate);
    }
    
});

hbsis.wms.settings.ProcessesViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Type"
        });
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ProcessModel());
    },

    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#Type").select2("val", "", true);
        $("#Warehouse_Id").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#Type").select2("val", $("#Type").val(), true);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        
        var self = this;
        return {
            "iDisplayLength": 50,
            "aoColumns": [
              { "mData": "Description" },
              { "mData": "Name" },
              { "mData": "Type" },
              { "mData": "UpdatedBy" },
              { "mData": "UpdatedDate" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                   {
                       "aTargets": [0],
                       "mRender": function (data, type, row) {
                           {
                               return row.Description;
                           }
                       }
                   },


                  {
                      "aTargets": [1],
                      "mRender": function (data, type, row) {
                          return resources.get(row.Name);

                      }
                  },



                  {
                      "aTargets": [2],
                      "mRender": function (data, type, row) {
                          return resources.get(row.Type);

                      }
                  },
                  {
                      "aTargets": [3],
                      "mRender": function (data, type, row) {
                          return resources.get(row.UpdatedBy);

                      }
                  },
                  {
                      "aTargets": [4],
                      "mRender": function (data, type, row) {
                          return moment(row.DataHora).format("DD/MM/YYYY HH:mm:ss");

                      }
                  },
                {
                  "aTargets": [5],
                  "mData": null,
                  "mRender": function (data, type, row) {
                      {
                          return self.settings.actionsMarkup;
                      }
                  },
                  "bSortable": false,
                  "bSearchable": false
              },
             
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function (data, page) {
                    return { results: data.Rows };
                }
            },
            id: function (data) { return data.Id; },
            initSelection: function (element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function (data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,

        });
    }
});