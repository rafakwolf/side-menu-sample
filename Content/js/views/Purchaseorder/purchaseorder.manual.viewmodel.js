var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PoDetailModel = Class.extend({
    init: function (PurchaseOrderDetail) {
        if (!PurchaseOrderDetail) {
            this.Id = '00000000-0000-0000-0000-000000000000',
            this.Item = '';
            this.Unit = '';
            this.Quantity = '';
        } else {
            this.Id = PurchaseOrderDetail.Id;
            this.Item = PurchaseOrderDetail.ItemCode + ' - ' + PurchaseOrderDetail.ItemShortDescription;
            this.Quantity = PurchaseOrderDetail.Quantity;
            this.Unit = PurchaseOrderDetail.UnidadeMedidaId;
        }
    }
});

hbsis.wms.settings.PurchaseOrderModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Number = ko.observable();
        this.TaxInvoice = ko.observable();
        this.PlacaVeiculo = ko.observable();
        this.Detalhes = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.Number('');
        this.TaxInvoice('');
        this.PlacaVeiculo('');
        this.Detalhes.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.Number(model.Number);
        this.TaxInvoice(model.TaxInvoice);
        this.PlacaVeiculo(model.PlacaVeiculo);

        for (var i = 0; i < model.Detalhes.length; i++) {
            this.Detalhes.push(new hbsis.wms.settings.PoDetailModel(model.Detalhes[i]));
            var inputName = '#itemList_' + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2);
            $(inputName).select2("val", model.Detalhes[i].Item.Id, true);
            $(inputName).prop('disabled', true);


            unitListField = '#unitList_' + i;

            $(unitListField).parent().remove();
            $('.UnidadeMedida').hide();
            $('.act').hide();

            $('#save-modal .label-danger').parent().remove();
            $('.form-control').prop('disabled', true);
            $('#save').prop('disabled', true);

        }

    },
    newDetail: function (model) {
        model.Detalhes.push(new hbsis.wms.settings.PoDetailModel());
        $("input[name^='itemList']").each(function (item) {
            var inputName = '#itemList_' + item;
            hbsis.wms.settings.initAutoCompleteFunction(inputName, hbsis.wms.settings.itemAutocompleteUrl, hbsis.wms.settings.itemRender, 2, hbsis.wms.settings.onItemSelecting);
        });

        var unitListField = '';
        $("select[name^='unitList']").each(function (item) {
            unitListField = '#unitList_' + item;
            hbsis.wms.settings.unitRender(unitListField);
        });

        $(unitListField).prop('disabled', true);
    },
    removeDetail: function (model) {
        model.Detalhes.remove(model);
    }
});

hbsis.wms.settings.PurchaseOrderViewModel = hbsis.wms.CrudForm.extend({
    errorProcessAlert: "<div id=\"errorDetailContent\" class=\"alert alert-danger alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    startDate: moment(),
    endDate: moment(),
    crudModel: "",
    postDeleteItemUrl: "",
    init: function (opts) {
        this._super(opts);

        crudModel = this;

        this.initAutocomplete("#Item_Id", this.settings.itemAutocompleteUrl, this.renderItem, 2);

        hbsis.wms.settings.initAutoCompleteFunction = this.initAutocomplete;
        hbsis.wms.settings.itemAutocompleteUrl = this.settings.itemAutocompleteUrl;
        hbsis.wms.settings.itemRender = this.renderItem;
        hbsis.wms.settings.onItemSelecting = this.onItemSelecting;
        hbsis.wms.settings.unitRender = this.renderUnit;
        hbsis.wms.settings.showErrorMessage = this.showErrorMessage;
        hbsis.wms.settings.errorProcessAlert = this.errorProcessAlert;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");
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
    clearSaveForm: function () {
        this._super();
        $('#save').prop('disabled', false);
        $('.form-control').prop('disabled', false);
        $('.UnidadeMedida').show();
        $('.act').show();
    },
    edit: function (model) {
        this._super(model);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PurchaseOrderModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderItem: function (Item) {
        return Item.Code + ' - ' + Item.Description;
    },
    renderUnit: function (field) {
        $(field).select2({
            width: '100%',
            allowClear: true
        });
    },
    validaOrder: function (item) {
        if ($('#Number').val().length > 1) {
            var urlValida = window.location.href + '/Number/' + item.Number();
            $.ajax({
                type: "GET",
                url: urlValida,
                success: function (data) {
                    if (data === "true") {
                        alert('Ordem já cadastrada no sistema.');
                        $('#Number').val('');
                        $('#Number').focus();
                    }
                }
            });
        }

    },
    onItemSelecting: function (item) {
        var index = item.currentTarget.id;
        index = index.substr(index.indexOf("_") + 1);

        var field = "#unitList_" + index;

        $(field).find("option").remove().end();


        ko.utils.arrayForEach(item.object.AvailableUnitsOfMeasure, function (option) {
            $(field).append("<option value=\"" + option.Id + "\">" + option.Description + "</option>");
        });

        $(field).prop('disabled', false);
        $(field).select2({
            width: '100%',
            allowClear: true
        }).trigger('change');

    },

    removeDetail: function (model) {
        var currentId = model.Id;
        if (currentId == '00000000-0000-0000-0000-000000000000') {
            crudModel.model().Detalhes.remove(model);
        } else {
            $.ajax({
                async: false,
                url: postDeleteItemUrl + "/RemoveItemDetail/" + currentId,
                dataType: "JSON",
                type: "POST",
                success: function (data, textStatus, jqXHR) {
                    crudModel.model().Detalhes.remove(model);
                }
            });
        }
    },
    showErrorMessage: function (msg) {
        var errorAlert = hbsis.wms.settings.errorProcessAlert.replace("{errormessage}", "&#x26AB" + msg);
        $("#modelContentMessage").prepend(errorAlert);
    },
    save: function (e) {
        var errorContent = "#errorDetailContent";
        $(errorContent).remove();

        var hasError = false;

        if (!e.model().Number() || e.model().Number() === "") {
            this.showErrorMessage("Ordem não informada.");
            return;
        }

        if (!e.model().PlacaVeiculo() || e.model().PlacaVeiculo() === "") {
            this.showErrorMessage("Placa não informada.");
            return;
        }

        if (!e.model().Detalhes() || e.model().Detalhes().length == 0) {
            this.showErrorMessage("Nenhum item informado.");
            return;
        }

        ko.utils.arrayForEach(e.model().Detalhes(), function (detail) {
            if (!detail.Item) {
                hbsis.wms.settings.showErrorMessage("Item não informado.");
                hasError = true;
                return;
            }

            if (!detail.Unit) {
                hbsis.wms.settings.showErrorMessage("Unidade de Medida não informada.");
                hasError = true;
                return;
            }

            if (detail.Quantity <= 0) {
                hbsis.wms.settings.showErrorMessage("Quantidade não informada.");
                hasError = true;
                return;
            }
        });

        if (!hasError)
            this._super(e);
    },

    initAutocomplete: function (field, autocompleteUrl, render, minimumInput, onSelecting) {

        var select =
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

        if (onSelecting)
            select.on("select2-selecting", onSelecting);
    },
    getFormData: function () {
        var self = this;

        var modelPost = {
            Id: '' //this.model().Id
        }

        modelPost["Number"] = this.model().Number;
        modelPost["PlacaVeiculo"] = this.model().PlacaVeiculo;

        if (!this.model().TaxInvoice() || this.model().TaxInvoice() === '' || this.model().TaxInvoice().trim().length == 0)
            modelPost["TaxInvoice"] = '';
        else
            modelPost["TaxInvoice"] = this.model().TaxInvoice;

        var itensList = [];
        ko.utils.arrayForEach(this.model().Detalhes(), function (detail) {
            var itemDetail = { };
            itemDetail["ItemId"] = detail.Item;
            itemDetail["Quantity"] = detail.Quantity;
            itemDetail["UnidadeMedidaId"] = detail.Unit;

            itensList.push(itemDetail);
        });

        modelPost.Detalhes = itensList;

        //modelPost["Detalhes"] = JSON.stringify(itensList);
        return modelPost;
    },
    getDatatableConfig: function () {
        var self = this;
        var deleteMark = '';
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "WarehouseShortCode" },
              { "mData": "Number" },
              { "mData": "PlacaVeiculo" },
              { "mData": "Status" },
              { "mData": "TaxInvoice" },
              { "mData": null }
            ],
            "aoColumnDefs": [

               {
                   "aTargets": [0],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       return row.WarehouseShortCode;
                   }
               },
               {
                   "aTargets": [1],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false
               },
               {
                   "aTargets": [2],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false
               },
              {
                  "aTargets": [3],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      if (row.Status == 'Open') {
                          deleteMark = "<a class=\"label label-danger delete\" href=\"#delete\"><i class=\"fa fa-times\"></i></a>";
                      } else {
                          deleteMark = "";
                      }
                      return resources.get(row.Status);
                  }

              },
              {
                  "aTargets": [4],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      if (row.TaxInvoice === "undefined")
                          return "";

                      return row.TaxInvoice;
                  }
              },
               {
                   "aTargets": [5],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       if (row.Status == 'Open') {
                           deleteMark = "<a class=\"label label-danger delete\" href=\"#delete\"><i class=\"fa fa-times\"></i></a>";
                       } else {
                           deleteMark = "";
                       }
                       return "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                                      "<i class=\"fa fa-search\"></i></a> " + deleteMark;
                   }

               }
            ]
        };
    }
});