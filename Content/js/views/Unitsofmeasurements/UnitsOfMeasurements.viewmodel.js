
var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.UnitsOfMeasurementModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.ItemId = ko.observable();
        this.AmountPerLayer = ko.observable();
        this.Layers = ko.observable();
        this.PackageWeight = ko.observable().formatacaoMonetariaSemCifrao();
        this.ConversionFactor = ko.observable().formatacaoMonetariaSemCifrao(3);
        this.ShowPallet = ko.observable();
        this.QuantidadeHectolitro = ko.observable();
        this.ReplenishmentRuleId = ko.observable();
        this.StoringRuleId = ko.observable();
        this.PickingRuleId = ko.observable();
        this.CountUnit = ko.observable();
        this.MovementUnit = ko.observable();
        this.ReceivingUnit = ko.observable();
        this.PickingUnit = ko.observable();
        this.LayerUnit = ko.observable();
        this.IndicadorCaixa = ko.observable();
        this.Tipo = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.ItemId('');
        this.AmountPerLayer('');
        this.Layers('');
        this.PackageWeight('');
        this.ConversionFactor('');
        this.ShowPallet(false);
        this.QuantidadeHectolitro('');
        this.ReplenishmentRuleId('');
        this.StoringRuleId('');
        this.PickingRuleId('');
        this.CountUnit(false);
        this.MovementUnit(false);
        this.ReceivingUnit(false);
        this.PickingUnit(false);
        this.LayerUnit(false);
        this.IndicadorCaixa(false);
        this.Tipo('');
    },
    load: function (model) {

        this.Id(model.Id);
        this.ItemId(model.ItemId);
        this.AmountPerLayer(model.AmountPerLayer);
        this.Layers(model.Layers);
        this.PackageWeight(model.PackageWeight);
        this.ConversionFactor(model.ConversionFactor);
        this.ShowPallet(model.ShowPallet);
        this.QuantidadeHectolitro(model.QuantidadeHectolitro);
        this.CountUnit(model.CountUnit);
        this.MovementUnit(model.MovementUnit);
        this.ReceivingUnit(model.ReceivingUnit);
        this.PickingUnit(model.PickingUnit);
        this.LayerUnit(model.LayerUnit);
        this.IndicadorCaixa(model.IndicadorCaixa);
        this.Tipo(model.Tipo);

        this.ReplenishmentRuleId(model.ReplenishmentRuleId);
        this.PickingRuleId(model.PickingRuleId);
        this.StoringRuleId(model.StoringRuleId);
    }
});
hbsis.wms.settings.UnitsOfMeasurementViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderItem);
        this.initAutocomplete("#ReplenishmentRuleId", this.settings.ruleProfileAutocompleteUrl, this.renderReplenishmentRule);
        this.initAutocomplete("#StoringRuleId", this.settings.ruleProfileAutocompleteUrl, this.renderStoringRule);
        this.initAutocomplete("#PickingRuleId", this.settings.ruleProfileAutocompleteUrl, this.renderPickingRule);
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Tipo" });
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.UnitsOfMeasurementModel());
    },
    renderStoringRule: function (rule) {
        return rule.RuleTypeName;
    },
    renderReplenishmentRule: function (rule) {
      
        return rule.RuleTypeName;
    },
    renderPickingRule: function (rule) {
        return rule.RuleTypeName;
    },
    renderItem: function (Item) {
        return Item.ShortCode + ' - ' + Item.ShortDescription;
    },
    getModelDescription: function (model) {
       return model.Name;
    },
    enableItem: function (enabled) {
        $("#ItemId").select2('enable', enabled);
    },
    clearSaveForm: function () {
        this._super();
        $("#ItemId").select2("val", "", true);
        $("#ReplenishmentRuleId").select2("val", "", true);
        $("#StoringRuleId").select2("val", "", true);
        $("#PickingRuleId").select2("val", "", true);
        $("#Tipo").select2("val", "", true);
        this.enableItem(true);
    },
    edit: function (model) {
        this._super(model);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
        $("#ReplenishmentRuleId").select2("val", $("#ReplenishmentRuleId").val(), true);
        $("#StoringRuleId").select2("val", $("#StoringRuleId").val(), true);
        $("#PickingRuleId").select2("val", $("#PickingRuleId").val(), true);
        $("#Tipo").select2("val", $("#Tipo").val(), true);
        this.enableItem(false);
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        var self = this;
        var ruleType;
        if(field == "#ReplenishmentRuleId"){
           ruleType = 1;
        } else if (field == "#StoringRuleId") {
            ruleType = 2;
        } else if (field == "#PickingRuleId") {
            ruleType = 3;
        } else {
            ruleType = 0;
        }
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 1,
            ajax: {
                url: ($.isFunction(autocompleteUrl) ?
                    $.proxy(autocompleteUrl, self) : autocompleteUrl),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10,
                        RuleType: ruleType
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
              { "mData": "ItemCode" },
              { "mData": "Name" },
              { "mData": "Description" },
              { "mData": "ConversionFactor" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [4],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },
              {
                  "aTargets": [3],
                  "mRender": function (data, type, row) {
                      return hbsis.wms.Helpers.formatarValorMonetarioSemCifrao(row.ConversionFactor, 3);
                  }
                },
                {
                "aTargets": [0], "mData": null, "bSortable": true,
                "bSearchable": false, "mRender": function (data, type, row)
                {
                    return row.ItemCode + " - " + row.ItemDescription;
                }
                },
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});