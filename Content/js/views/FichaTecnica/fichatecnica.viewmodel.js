var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.DetailModel = Class.extend({
    init: function (BomDetail) {
        if (!BomDetail) {
            this.Id = '00000000-0000-0000-0000-000000000000';
            this.TipoInsumoId = '';
            this.Quantidade = '';
            this.Prioridade = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
            this.CreatedDate = '';
            this.CreatedBy = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
            this.Similares = ko.observableArray();
        } else {
            this.Id = BomDetail.Id;
            this.TipoInsumoId = BomDetail.TipoInsumoId;
            this.Quantidade = BomDetail.Quantidade;
            this.Prioridade = BomDetail.Prioridade;
            this.UpdatedBy = BomDetail.UpdatedBy || '';
            this.UpdatedDate = BomDetail.UpdatedDate;
            this.Similares = ko.observableArray(BomDetail.Similares);
        }
    },
    load: function (BomDetail) {
        this.Id = BomDetail.Id;
        this.TipoInsumoId = BomDetail.TipoInsumoId;
        this.Quantidade = BomDetail.Quantidade;
        this.Prioridade = BomDetail.Prioridade;
        this.UpdatedBy = BomDetail.UpdatedBy || '';
        this.UpdatedDate = BomDetail.UpdatedDate;

        for (var i = 0; i < model.Similares().length; i++) {
            this.Similares().push(new hbsis.wms.settings.SimilaresDetailModel(model.Similares[i]));
            var inputName = '#itemListSimilar' + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
            //$(inputName).select2("val", model.HeaderDetails[i].ItemId, true);
        }
    }
});

hbsis.wms.settings.SimilaresDetailModel = Class.extend({
    init: function (Similares) {
        if (!Similares) {
            this.Id = '00000000-0000-0000-0000-000000000000';
            this.ItemId = '';
            this.Principal = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
            this.CreatedDate = '';
            this.CreatedBy = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
        } else {
            this.Id = Similares.Id;
            this.ItemId = Similares.ItemId;
            this.Principal = Similares.Principal;
            this.UpdatedBy = Similares.UpdatedBy || '';
            this.UpdatedDate = Similares.UpdatedDate;
        }
    },
    load: function (Similares) {
        this.Id = Similares.Id;
        this.ItemId = Similares.TipoInsumoId;
        this.Principal = Similares.Quantidade;
        this.Prioridade = Similares.Prioridade;
        this.UpdatedBy = Similares.UpdatedBy || '';
        this.UpdatedDate = Similares.UpdatedDate;

        for (var i = 0; i < model.Similares().length; i++) {
            this.Similares().push(new hbsis.wms.settings.SimilaresDetailModel(model.Similares[i]));
            var inputName = '#itemListSimilar' + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
            //$(inputName).select2("val", model.HeaderDetails[i].ItemId, true);
        }
    },
});

hbsis.wms.settings.BillOfMaterialsHeaderModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.ItemId = ko.observable();
        this.ItemCode = ko.observable();
        this.ItemDescricao = ko.observable();
        this.WarehouseId = ko.observable();
        this.WarehouseName = ko.observable();
        this.QuantidadeHectoLitros = ko.observable();
        this.HeaderDetails = ko.observableArray();
        this.detail = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.WarehouseId('');
        this.WarehouseName('');
        this.ItemId('');
        this.ItemCode('');
        this.ItemDescricao('');
        this.HeaderDetails.removeAll();
        this.QuantidadeHectoLitros(1);
        this.detail('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.ItemId(model.ItemId);
        this.ItemCode(model.ItemCode);
        this.ItemDescricao(model.ItemDescricao);
        this.QuantidadeHectoLitros(model.QuantidadeHectoLitros);
        if (model.WarehouseId) {
            this.WarehouseId(model.WarehouseId);
            this.WarehouseName(model.WarehouseName);
        }

        for (var i = 0; i < model.HeaderDetails.length; i++) {
            this.HeaderDetails.push(new hbsis.wms.settings.DetailModel(model.HeaderDetails[i]));
            var inputName = '#itemList' + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName,
                hbsis.wms.settings.tipoInsumoAutocompleteUrl2,
                hbsis.wms.settings.renderTipoInsumo,
                2);
            //$(inputName).select2("val", model.HeaderDetails[i].ItemId, true);
        }
    },
    newDetail: function (model) {
        model.HeaderDetails.push(new hbsis.wms.settings.DetailModel());
        $("input[name^='itemList']").each(function (item) {
            var inputName = '#itemList' + item;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.tipoInsumoAutocompleteUrl2, hbsis.wms.settings.renderTipoInsumo, 2);
        });
    },
    removeDetail: function (model) {
        model.HeaderDetails.remove(model);
    },

    clicaCheckBox: function (model) {
        debugger;
        model.detail().Similares().remove(model);
    },
    newDetailSimilar: function (model) {
        if (!model.detail().Similares())
            model.detail().Similares([]);

        model.detail().Similares.push(new hbsis.wms.settings.SimilaresDetailModel());
        $("input[name^='itemListSimilar']").each(function (item) {
            var inputName = '#itemListSimilar' + item;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
        });
    }
});

hbsis.wms.settings.BillOfMaterialsHeaderViewModel = hbsis.wms.CrudForm.extend({
    errorProcessAlert: "<div id=\"errorDetailContent\" class=\"alert alert-danger alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    crudModel: "",
    detail: {},
    postDeleteItemUrl: "",
    init: function (opts) {
        this._super(opts);
        crudModel = this;
        //this.clearOnSave(false);
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderItem, 2);
        this.initAutocomplete("#TipoInsumoId", this.settings.tipoInsumoAutocompleteUrl, this.tipoInsumoRender);

        hbsis.wms.settings.initAutoCompleteFunction = this.initAutocomplete;
        hbsis.wms.settings.itemAutocompleteUrl = this.settings.itemAutocompleteUrl;
        hbsis.wms.settings.tipoInsumoAutocompleteUrl2 = this.settings.tipoInsumoAutocompleteUrl;

        hbsis.wms.settings.itemRender = this.renderItem;
        hbsis.wms.settings.renderTipoInsumo = this.tipoInsumoRender;


        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Type"
        });

        $("#datatable").on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $("#WarehouseId").addClass("ignore");
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.BillOfMaterialsHeaderModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderItem: function (Item) {
        return Item.Code + ' - ' + Item.Description;
    },
    tipoInsumoRender: function (tipoinsumo) {
        return tipoinsumo.Descricao;
    },
    clearSaveForm: function () {

        this._super();
        $("#Type").select2("val", "", true);
        $("#WarehouseId").select2("val", "", true);
        $("#ItemId").select2("val", "", true);
        $("#TipoInsumoId").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#Type").select2("val", $("#Type").val(), true);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
        $("#TipoInsumoId").select2("val", $("#TipoInsumoId").val(), true);
    },
    removeDetail: function (model) {
        crudModel.model().HeaderDetails.remove(model);
    },

    removeSimilares: function (model) {
        debugger;
        for (var i = 0; i < crudModel.model().HeaderDetails().length; i++) {
            if (crudModel.model().HeaderDetails()[i].Id == model.DetalheFichaTecnica) {
                crudModel.model().HeaderDetails()[i].Similares.remove(model);
            }
        }
    },

    clicaCheckBox: function (model) {
        //debugger;

        //for (var i = 0; i < crudModel.model().HeaderDetails().length; i++) {
        //    if (crudModel.model().HeaderDetails()[i].Id == model.DetalheFichaTecnica) {

        //        for (var is = 0; is < crudModel.model().HeaderDetails()[i].Similares().length; is++)
        //        {
        //            var i = 1;
        //        }
        //    }
        //}
    },

    editarItem: function (detail) {
        crudModel.model().detail(detail);
        $("input[name^='itemListSimilar']").each(function (item) {
            var inputName = '#itemListSimilar' + item;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
        });
    },

    abreSimilares: function (model) {


    },
    save: function (e) {
        var errorContent = "#errorDetailContent";
        $(errorContent).remove();

        var errorMessage = "";
        ko.utils.arrayForEach(e.model().HeaderDetails(), function (detail) {
            if (!detail.TipoInsumoId) {
                if (errorMessage != "") {
                    errorMessage += "\n";
                }
                errorMessage += "Item não informado.";
            }
            if (detail.Quantidade <= 0) {
                if (errorMessage != "") {
                    errorMessage += "\n";
                }
                errorMessage += "Quantidade não informada.";
            }
        });

        if (errorMessage != "") {
            var errorAlert = this.errorProcessAlert.replace("{errormessage}", errorMessage);
            $("#modelContentMessage").prepend(errorAlert);
        } else {
            this._super(e);
        }
    },
    getModelDescription: function (model) {
        if (model.ItemId)
            return model.ItemDescription;
        else
            return model.Name;
    },
    getFormData: function () {
        var requestValue = $.toDictionary(ko.toJS(this.model()));
        return requestValue;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "WarehouseId" },
              { "mData": "ItemId" },
              { "mData": "ItemId" },
              { "mData": "UpdatedDate" },
              { "mData": "UpdatedBy" },
              { "mData": null }
            ],
            "aoColumnDefs": [
             {
                 "aTargets": [0],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     return resources.get(row.WarehouseName);
                 }
             },

             {
                 "aTargets": [1],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     if (row.ItemId != null)
                         return row.ItemCode;
                     else
                         return "-";
                 }
             },

             {
                 "aTargets": [2],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     if (row.ItemId != null)
                         return row.ItemDescricao;
                     else
                         return "-";
                 }
             },
              {
                  "aTargets": [3],
                  "mData": null,
                  "bSortable": false,
                  "mRender": function (data, type, row) {
                      return row.UpdatedDate;
                  }
              },

              {
                  "aTargets": [4],
                  "mData": null,
                  "bSortable": false,
                  "mRender": function (data, type, row) {
                      return resources.get(row.UpdatedBy);
                  }
              },
              {
                  "aTargets": [5],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, minimumInput) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: minimumInput,
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
                if (id !== "" && id.split("-").length == 5) {
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
    }
});