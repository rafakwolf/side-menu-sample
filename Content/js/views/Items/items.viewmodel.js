var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.ShortCode = ko.observable();
        this.Description = ko.observable();
        this.ShortDescription = ko.observable();
        this.ConversionItem = ko.observable(false);
        this.Code = ko.observable();
        this.AlternativeCode = ko.observable();
        this.UpcNumber = ko.observable();
        this.SerialNumber = ko.observable();
        this.LotControl = ko.observable();
        this.ExpirationDateControl = ko.observable(false);
        this.ManufactoryDateRequest = ko.observable(false);
        this.ShelfLife = ko.observable();
        this.ExpirationWindow = ko.observable();
        this.DefaultQualityLocId = ko.observable();
        this.DefaultCrossDockLocId = ko.observable();
        this.Inspection = ko.observable(false);
        this.AllowSVAreceipt = ko.observable(false);
        this.AllowVQMreceipt = ko.observable(false);
        this.ProductClassId = ko.observable();
        this.Curva = ko.observable();
        this.AllowCrossDocking = ko.observable(false);
        this.Weight = ko.observable().formatacaoMonetariaSemCifrao();
        this.IsPallet = ko.observable(false);
        this.IsChapatex = ko.observable(false);
        this.Tipo = ko.observable();
        this.Classificacao = ko.observable();
        this.CodigoBarras = ko.observable();
        this.ArmazemId = ko.observable();
        this.ArmazemNome = ko.observable();
        this.EhGeral = ko.observable(true);
    },
    clear: function () {
        this.Id(null);
        this.ShortCode('');
        this.Description('');
        this.ShortDescription('');
        this.ConversionItem(false);
        this.Code('');
        this.AlternativeCode('');
        this.UpcNumber('');
        this.SerialNumber('');
        this.LotControl(false);
        this.ExpirationDateControl(false);
        this.ManufactoryDateRequest(false);
        this.ShelfLife('');
        this.ExpirationWindow('');
        this.Inspection(false);
        this.AllowSVAreceipt(false);
        this.AllowVQMreceipt(false);
        this.DefaultQualityLocId('');
        this.DefaultCrossDockLocId('');
        this.ProductClassId('');
        this.Curva('');
        this.AllowCrossDocking(false);
        this.Weight('');
        this.IsPallet(false);
        this.IsChapatex(false);
        this.Tipo('');
        this.Classificacao('');
        this.CodigoBarras('');
        this.ArmazemId('');
        this.ArmazemNome('');
        this.EhGeral(true);
    },
    load: function (model) {
        this.Id(model.Id);
        this.ShortCode(model.ShortCode);
        this.Description(model.Description);
        this.ShortDescription(model.ShortDescription);
        this.ConversionItem(model.ConversionItem);
        this.Code(model.Code);
        this.AlternativeCode(model.AlternativeCode);
        this.UpcNumber(model.UpcNumber);
        this.SerialNumber(model.SerialNumber);
        this.LotControl(model.LotControl);
        this.ExpirationDateControl(model.ExpirationDateControl);
        this.ManufactoryDateRequest(model.ManufactoryDateRequest);
        this.ShelfLife(model.ShelfLife);
        this.ExpirationWindow(model.ExpirationWindow);
        this.Inspection(model.Inspection);
        this.AllowSVAreceipt(model.AllowSVAreceipt);
        this.AllowVQMreceipt(model.AllowVQMreceipt);
        this.DefaultQualityLocId(model.DefaultQualityLocId);
        this.DefaultCrossDockLocId(model.DefaultCrossDockLocId);
        this.ProductClassId(model.ProductClassId);
        this.Curva(model.Curva);
        this.AllowCrossDocking(model.AllowCrossDocking);
        this.Weight(model.Weight);
        this.IsPallet(model.IsPallet);
        this.IsChapatex(model.IsChapatex);
        this.Tipo(model.Tipo);
        this.Classificacao(model.Classificacao);
        this.CodigoBarras(model.CodigoBarras);
        if (model.ArmazemId) {
            this.ArmazemId(model.ArmazemId);
            this.ArmazemNome(model.ArmazemNome);
        }
        this.EhGeral(model.EhGeral);
    }
});
hbsis.wms.settings.ItemsViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#ArmazemId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#DefaultQualityLocId", this.settings.defaultQualityLocAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#DefaultCrossDockLocId", this.settings.defaultCrossDockLocAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#ProductClassId", this.settings.productClassAutocompleteUrl, this.renderProductClass);
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Tipo" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Classificacao" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Curva" });

        $("#ArmazemId").addClass("ignore");
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ItemModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLocation: function (location) {
        return location.Code + ' - ' + location.Description;
    },
    renderProductClass: function (productClass) {
        return productClass.ProductFamilyName + ' - ' + productClass.Name;
    },
    getModelDescription: function (model) {
        return model.ShortCode + ' - ' + model.ShortDescription;
    },
    clearSaveForm: function () {
        this._super();
        $("#DefaultQualityLocId").select2("val", "", true);
        $("#DefaultCrossDockLocId").select2("val", "", true);
        $("#form-tabs a:first").tab('show');
        $("#ProductClassId").select2("val", "", true);
        $("#Tipo").select2("val", "", true);
        $("#Classificacao").select2("val", "", true);
        $("#Curva").select2("val", "", true);
        $("#ArmazemId").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#DefaultQualityLocId").select2("val", $("#DefaultQualityLocId").val(), true);
        $("#DefaultCrossDockLocId").select2("val", $("#DefaultCrossDockLocId").val(), true);
        $("#ProductClassId").select2("val", $("#ProductClassId").val(), true);
        $("#Tipo").select2("val", $("#Tipo").val(), true);
        $("#Classificacao").select2("val", $("#Classificacao").val(), true);
        $("#Curva").select2("val", $("#Curva").val(), true);
        $("#ArmazemId").select2("val", $("#ArmazemId").val(), true);
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 2,
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
            escapeMarkup: function (m) { return m; }
        });
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ArmazemId" },
              { "mData": "ShortCode" },
              { "mData": "Description" },
              { "mData": "ShortDescription" },
              { "mData": "ProductClassName" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.ArmazemNome);
                    }
                }, {
                    "aTargets": [3], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.ShortDescription == 'New') {
                            return '-';
                        }
                        return resources.get(row.ShortDescription);
                    }
                }, {
                    "aTargets": [4],
                    "mData": null,
                    "bSortable": true,
                    "mRender": function (data, type, row) {
                        return row.ProductClassName;
                    }
                }, {
                    "aTargets": [5],
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