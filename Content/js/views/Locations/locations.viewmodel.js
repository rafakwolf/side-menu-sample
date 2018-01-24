var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.LocationZonesModel = Class.extend({
    init: function (Zone) {
        this.Id = Zone.Id;
        this.Name = Zone.Name;
    }
});

hbsis.wms.settings.LocationModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Code = ko.observable();
        this.Description = ko.observable();
        this.WarehouseId = ko.observable();
        this.Enabled = ko.observable(false);
        this.LocationTypeId = ko.observable();
        this.MaterialHandling = ko.observable();
        this.ProductClassId = ko.observable();
        this.WeightCapacity = ko.observable().formatacaoMonetariaSemCifrao();
        this.Length = ko.observable().formatacaoMonetariaSemCifrao();
        this.Width = ko.observable().formatacaoMonetariaSemCifrao();
        this.Height = ko.observable().formatacaoMonetariaSemCifrao();
        this.Zones = ko.observableArray([]);
        this.ZonesIds = ko.observableArray([]);
        this.AvailableZones = ko.observableArray([]);
        this.MinCapacity = ko.observable();
        this.OcupacaoMaxima = ko.observable();
        this.PickAreaId = ko.observable();
        this.PickPutFlow = ko.observable();
        this.StockState = ko.observable('Vazio');
        this.Curva = ko.observable('');
        this.MovementState = ko.observable('Liberado');
        this.DefaultLocation = ko.observable(false);
        this.IpsTagId = ko.observable();
        this.OcupacaoAtual = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Code('');
        this.Description('');
        this.WarehouseId('');
        this.Enabled(false);
        this.LocationTypeId('');
        this.MaterialHandling('');
        this.ProductClassId('');
        this.WeightCapacity('');
        this.Length('');
        this.Width('');
        this.Height('');
        this.Zones([]);
        this.MinCapacity('');
        this.OcupacaoMaxima('');
        this.PickAreaId('');
        this.PickPutFlow('');
        this.StockState('Vazio');
        this.Curva('');
        this.MovementState('Liberado');
        this.DefaultLocation(false);
        this.IpsTagId('');
        this.OcupacaoAtual('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Curva(model.Curva);
        this.Code(model.Code);
        this.Description(model.Description);
        this.WarehouseId(model.WarehouseId);
        this.Enabled(model.Enabled);
        this.DefaultLocation(model.DefaultLocation);

        this.LocationTypeId(model.LocationTypeId);
        this.MaterialHandling(model.MaterialHandling);
        this.ProductClassId(model.ProductClassId);

        this.WeightCapacity(model.WeightCapacity);
        this.Length(model.Length);
        this.Width(model.Width);
        this.Height(model.Height);

        this.MinCapacity(model.MinCapacity);
        this.OcupacaoMaxima(model.OcupacaoMaxima);

        this.PickAreaId(model.PickAreaId);

        this.PickPutFlow(model.PickPutFlow);
        this.StockState(model.StockState);
        this.Curva(model.Curva);
        this.MovementState(model.MovementState);
        this.IpsTagId(model.IpsTagId);
        this.OcupacaoAtual(model.OcupacaoAtual);

        var self = this;

        this.Zones($.map(model.Zones, function (el) {
            return $.grep(self.AvailableZones(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.ZonesIds($.map(this.Zones(), function (el) {
            return el.Id;
        }));
    }
});

hbsis.wms.settings.LocationViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.filtrarAtivos = true;

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ProductClassId", this.settings.productClassAutocompleteUrl, this.renderProductClass);
        this.initAutocomplete("#LocationTypeId", this.settings.locationTypeAutocompleteUrl, this.renderLocationType);
        this.initAutocomplete("#PickAreaId", this.settings.pickareaAutocompleteUrl, this.renderPickArea, this.searchRequestDataPickArea);
        this.initProcessMultiSelect("#Zones", this.settings.zoneAutocompleteUrl);

        var self = this;

        $("#LocationTypeId").on("select2-selecting",
            function (e) {
                self.validateProductClass.call(self, e.val);
            }
        );

        $("#WarehouseId").on("select2-selecting",
            function (e) {
                self.validatePickArea.call(self, e.val);
            }
        );

        $("#WarehouseId").on("select2-clearing",
            function (e) {
                self.validatePickArea.call(self);
            }
        );

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#MaterialHandling"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#StockState"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Curva"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#MovementState"
        });

        $("#PickAreaId").addClass("ignore");

        this.validatePickArea();
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.LocationModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLocationType: function (locationType) {
        return locationType.Name;
    },
    renderProductClass: function (productClass) {
        return productClass.Name;
    },
    renderPickArea: function (pickArea) {
        return pickArea.Code + ' - ' + pickArea.Description;
    },
    enableProductClass: function (enabled) {
        $("#ProductClassId").select2("enable", enabled);
    },
    validateProductClass: function (val) {
        this.enableProductClass(!(val == this.settings.stageLocationType));
    },
    validatePickArea: function (val) {
        if (val)
            $("#PickAreaId").select2("enable", true);
        else
            $("#PickAreaId").select2("enable", false);
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#LocationTypeId").select2("val", "", true);
        $("#MaterialHandling").select2("val", "", true);
        $("#ProductClassId").select2("val", "", true);
        $("#PickAreaId").select2("val", "", true);
        this.enableProductClass(true);
        $("#form-tabs a:first").tab('show');
        $("#Zones").multiSelect('refresh');
        this.validatePickArea();
        $("#Curva").select2("val", "", true);
        $("#StockState").select2("enable", true);
        $("#MovementState").select2("enable", true);
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#LocationTypeId").select2("val", $("#LocationTypeId").val(), true);
        $("#MaterialHandling").select2("val", $("#MaterialHandling").val(), true);
        $("#ProductClassId").select2("val", $("#ProductClassId").val(), true);
        $("#PickAreaId").select2("val", $("#PickAreaId").val(), true);
        this.validateProductClass($("#LocationTypeId").val());
        $("#Zones").multiSelect('refresh');
        this.validatePickArea($("#WarehouseId").val());
        $("#StockState").select2("val", $("#StockState").val(), true);
        $("#MovementState").select2("val", $("#MovementState").val(), true);
        $("#Curva").select2("val", $("#Curva").val(), true);
    },
    searchRequestDataPickArea: function (term, page) {
        var warehouse = $("#WarehouseId").val();
        if (warehouse) {
            return {
                search: term,
                start: 0,
                length: 10,
                field1: 'warehouse',
                value1: String(warehouse)
            };
        }
        return {
            search: term,
            start: 0,
            length: 10
        };
    },
    setFiltroAtivoTrue: function() {
        var self = this;
        self.filtrarAtivos = true;
        self.dirty(true);
        self.refreshDatatable();
    },
    setFiltroAtivoFalse: function() {
        var self = this;
        self.filtrarAtivos = false;
        self.dirty(true);
        self.refreshDatatable();
    },
    setFiltroTodos: function () {
        var self = this;
        self.filtrarAtivos = null;
        self.dirty(true);
        self.refreshDatatable();
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "FiltrarAtivo", "value": self.filtrarAtivos });
            },
            "loader" : $("#loader"),
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "Code" },
              { "mData": "Description" },
              { "mData": "MaterialHandling" },
              { "mData": "LocationTypeName" },
              { "mData": "ProductClassName" },
              { "mData": "Curva" },
              { "mData": "Enabled" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                  {
                      "aTargets": [0],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.WarehouseCode;
                      }
                  },

                      {
                          "aTargets": [1], "mData": null, "bSortable": true,
                          "bSearchable": false, "mRender": function (data, type, row) {
                              if (row.Code == null)
                                  return "-";
                              return row.Code;
                          }
                      },

                       {
                           "aTargets": [2], "mData": null, "bSortable": true,
                           "bSearchable": false, "mRender": function (data, type, row) {
                               if (row.Description == null)
                                   return "-";
                               return row.Description;
                           }
                       },

                       {
                           "aTargets": [3],
                           "mData": null,
                           "bSortable": false,
                           "mRender": function (data, type, row) {
                               return resources.get(row.MaterialHandling);
                           }
                       },

                         {
                             "aTargets": [4],
                             "mData": null,
                             "bSortable": true,
                             "mRender": function (data, type, row) {
                                 return row.LocationTypeName;
                             }
                         },
                        {
                             "aTargets": [5],
                             "mData": null,
                             "bSortable": true,
                             "mRender": function (data, type, row) {
                                 return row.ProductClassName;
                             }
                         },
                        {
                             "aTargets": [6],
                             "mData": null,
                            "bSortable": false,
                            "bSearchable": false,
                             "mRender": function (data, type, row) {
                                 return row.Curva;
                             }
                         },
                          {
                              "aTargets": [7],
                              "mData": null,
                              "mRender": function (data, type, row) {
                                  return resources.get(row.StockState + "");
                              }
                          },
                          {
                              "aTargets": [8],
                              "mData": null,
                              "mRender": function (data, type, row) {
                                  return resources.get(row.Enabled + "");
                              }
                          },
                {
                    "aTargets": [9],
                    "mData": null,
                    "sDefaultContent": self.settings.editMarkup,
                    "bSortable": false,
                    "bSearchable": false
                },
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, searchRequestData) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {

                    if (searchRequestData) {
                        return searchRequestData(term, page);
                    }

                    return {
                        search: term,
                        start: 0,
                        length: 100
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
            escapeMarkup: function (m) { return m; }
        });
    },
    getFormData: function () {
        var self = this;
        this.model().Zones($.map(this.model().ZonesIds(), function (el) {
            return $.grep(self.model().AvailableZones(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    initProcessMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Code', direction: 'asc' },
            dataType: 'json',
            success: function(data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var locationZones = $.map(data.Rows, function(el) {
                        return new hbsis.wms.settings.LocationZonesModel(el);
                    });
                    self.model().AvailableZones(locationZones);
                    $(field).multiSelect();
                }
            }
        });
    }
});