var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.DetailModel = Class.extend({
    init: function (BomDetail) {
        if (!BomDetail) {
            this.Id = '00000000-0000-0000-0000-000000000000';
            this.ItemId = '';
            this.ItemName = '';
            this.Quantity = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
            this.CreatedDate = '';
            this.CreatedBy = '';
            this.UpdatedDate = '';
            this.UpdatedBy = '';
        } else {
            this.Id = BomDetail.Id;
            this.ItemId = BomDetail.ItemId;
            this.Quantity = BomDetail.Quantity;
            this.UpdatedBy = BomDetail.UpdatedBy || '';
            this.UpdatedDate = BomDetail.UpdatedDate;
        }
    }
});

hbsis.wms.settings.BillOfMaterialsHeaderModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.ItemId = ko.observable();
        this.ItemCode = ko.observable();
        this.ItemDescription = ko.observable();
        this.Enabled = ko.observable(false);
        this.WarehouseId = ko.observable();
        this.WarehouseName = ko.observable();
        this.IsGeneral = ko.observable(true);
        this.HeaderDetails = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.Enabled(false);
        this.WarehouseId('');
        this.WarehouseName('');
        this.ItemId('');
        this.ItemCode('');
        this.ItemDescription('');
        this.IsGeneral(true);
        this.HeaderDetails.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.ItemId(model.ItemId);
        this.ItemCode(model.ItemCode);
        this.ItemDescription(model.ItemDescription);
        this.Enabled(model.Enabled);
        if (model.WarehouseId) {
            this.WarehouseId(model.WarehouseId);
            this.WarehouseName(model.WarehouseName);
        }
        this.IsGeneral(model.IsGeneral);

        for (var i = 0; i < model.HeaderDetails.length; i++) {
            this.HeaderDetails.push(new hbsis.wms.settings.DetailModel(model.HeaderDetails[i]));
            var inputName = '#itemList' + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
            $(inputName).select2("val", model.HeaderDetails[i].ItemId, true);
        }
    },
    newDetail: function (model) {
        model.HeaderDetails.push(new hbsis.wms.settings.DetailModel());
        $("input[name^='itemList']").each(function (item) {
            var inputName = '#itemList' + item;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
        });
    },
    removeDetail: function (model) {
        model.HeaderDetails.remove(model);
    }
});

hbsis.wms.settings.BillOfMaterialsHeaderViewModel = hbsis.wms.CrudForm.extend({
    errorProcessAlert: "<div id=\"errorDetailContent\" class=\"alert alert-danger alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    crudModel: "",
    postDeleteItemUrl: "",
    init: function (opts) {
        this._super(opts);

        crudModel = this;
        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderItem, 2);

        hbsis.wms.settings.initAutoCompleteFunction = this.initAutocomplete;
        hbsis.wms.settings.itemAutocompleteUrl = this.settings.itemAutocompleteUrl;
        hbsis.wms.settings.itemRender = this.renderItem;

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
    clearSaveForm: function () {
        this._super();
        $("#Type").select2("val", "", true);
        $("#WarehouseId").select2("val", "", true);
        $("#ItemId").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#Type").select2("val", $("#Type").val(), true);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
    },
    removeDetail: function (model) {
        crudModel.model().HeaderDetails.remove(model);
    },
    save: function (e) {
        var errorContent = "#errorDetailContent";
        $(errorContent).remove();

        var errorMessage = "";
        ko.utils.arrayForEach(e.model().HeaderDetails(), function (detail) {
            if (!detail.ItemId) {
                if (errorMessage != "") {
                    errorMessage += "\n";
                }
                errorMessage += "Item não informado.";
            }
            if (detail.Quantity <= 0) {
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
              { "mData": "Enabled" },
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
                     if (row.ItemId != null) {
                         return "<a href=\"#\" data-toggle=\"tooltip\" data-placement=\"right\" title='" + row.ItemDescription + "'>" + row.ItemDescription + "</a>";
                     }
                     else {
                         return "-";
                     }
                 }
             },

             {
                 "aTargets": [3],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     return resources.get(row.Enabled);
                 }
             },
              {
                  "aTargets": [4],
                  "mData": null,
                  "bSortable": false,
                  "mRender": function (data, type, row) {
                      return row.UpdatedDate;
                  }
              },

              {
                  "aTargets": [5],
                  "mData": null,
                  "bSortable": false,
                  "mRender": function (data, type, row) {
                      return resources.get(row.UpdatedBy);
                  }
              },
              {
                  "aTargets": [6],
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