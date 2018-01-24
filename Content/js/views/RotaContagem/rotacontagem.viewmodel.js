var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
var sequencia = 0;

hbsis.wms.settings.DetailModel = Class.extend({
    init: function(BomDetail) {
        if (!BomDetail) {
            this.EnderecoId = ko.observable();
            this.Sequencia = ko.observable();
            this.Endereco = ko.observable();
            this.Id = ko.observable();
        } else {
            this.EnderecoId = BomDetail.EnderecoId;
            this.RotaId = BomDetail.RotaId;
            this.Sequencia = BomDetail.Sequencia;
            this.Endereco = BomDetail.Endereco;
            this.Id = BomDetail.Id;
            if(BomDetail.Sequencia !== undefined){ sequencia = BomDetail.Sequencia;}
        }

    }
});
hbsis.wms.settings.RotaContagemModel = Class.extend({
    init: function() {
        this.Id = ko.observable();
        this.Descricao = ko.observable();
        this.Armazem = ko.observable();
        this.DataCriacao = ko.observable();
        this.ArmazemId = ko.observable();
        this.HeaderDetails = ko.observableArray();
    },
    clear: function() {
        this.Id("");
        this.Descricao("");
        this.Armazem("");
        this.DataCriacao("");
        this.ArmazemId("");
        this.HeaderDetails.removeAll();
    },
    load: function(model) {
        this.Id(model.Id);
        this.Descricao(model.Descricao);
        this.DataCriacao(model.DataCriacao);
        this.ArmazemId(model.ArmazemId);
        this.Armazem(model.Armazem);
        var details = model.HeaderDetails ? model.HeaderDetails : new Array();
        for (var i = 0; i < details.length; i++) {
            this.HeaderDetails.push(new hbsis.wms.settings.DetailModel(model.HeaderDetails[i]));
            var inputName = "#itemList" + i;
            hbsis.wms.settings.initAutoCompleteFunction(inputName,
                hbsis.wms.settings.locationAutocompleteUrl,
                hbsis.wms.settings.enderecoRender,
                2);
            $(inputName).select2("val", model.HeaderDetails[i].EnderecoId, true);
        }
    },
    newDetail: function(model) {
        var detail = new hbsis.wms.settings.DetailModel(model);
        detail.Sequencia = ++sequencia;
        model.HeaderDetails.push(detail);
        $("input[name^='itemList']")
            .each(function(item) {
                var inputName = "#itemList" + item;
                hbsis.wms.settings.initAutoCompleteFunction(inputName,
                    hbsis.wms.settings.locationAutocompleteUrl,
                    hbsis.wms.settings.enderecoRender,
                    2);
            });
    },
    removeDetail: function(model) {
        model.HeaderDetails.remove(model);
    }

});

function resetarSequencia() {
    sequencia = 0;
}

self: null;
hbsis.wms.settings.RotaContagemViewModel = hbsis.wms.CrudForm.extend({
    errorProcessAlert: "<div id=\"errorDetailContent\" class=\"alert alert-danger alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    crudModel: "",
    postDeleteItemUrl: "",
    init: function(opts) {
        this._super(opts);
        self = this;
        crudModel = this;
        this.initAutocomplete("#ArmazemId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#EnderecoId", this.settings.locationAutocompleteUrl, this.renderLocation, 2);

        hbsis.wms.settings.initAutoCompleteFunction = this.initAutocomplete;
        hbsis.wms.settings.locationAutocompleteUrl = this.settings.locationAutocompleteUrl;
        hbsis.wms.settings.enderecoRender = this.renderLocation;

        $("#datatable")
            .on("draw.dt",
                function() {
                    $('[data-toggle="tooltip"]').tooltip();
                });

        $("#ArmazemId").addClass("ignore");
        $("#EnderecoId").addClass("ignore");
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.RotaContagemModel());

    },
    renderWarehouse: function(warehouse) {
        return warehouse.ShortCode + " - " + warehouse.Name;
    },
    renderLocation: function(location) {
        return location.Code + " - " + location.Description;
    },
    clearSaveForm: function() {
        this._super();
        $("#ArmazemId").select2("val", "", true);
        $("#EnderecoId").select2("val", "", true);
        resetarSequencia();
    },
    edit: function(model) {
        this._super(model);
        $("#ArmazemId").select2("val", $("#ArmazemId").val(), true);
        $("#EnderecoId").select2("val", $("#EnderecoId").val(), true);
    },
    removeDetail: function(model) {

        var details = self.model().HeaderDetails;
        details.remove(model);
        resetarSequencia();
        for (var i = 0; i < details().length; i++) {
            if (document.getElementById(i))
                self.model().HeaderDetails()[i].Sequencia = document.getElementById(i).innerHTML = ++sequencia;
             
        }
    },
    save: function(e) {
        var errorContent = "#errorDetailContent";
        $(errorContent).remove();

        var errorMessage = "";
        ko.utils.arrayForEach(e.model().HeaderDetails(),
            function(detail) {
                if (!detail.EnderecoId) {
                    if (errorMessage !== "") {
                        errorMessage += "\n";
                    }
                    errorMessage += "Endereço não informado.";
                }
            });

        if (errorMessage != "") {
            var errorAlert = this.errorProcessAlert.replace("{errormessage}", errorMessage);
            $("#modelContentMessage").prepend(errorAlert);
        } else {
            this._super(e);
        }
    },
    getFormData: function() {
        var requestValue = $.toDictionary(ko.toJS(this.model()));
        return requestValue;
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
                { "mData": "Armazem" },
                { "mData": "Descricao" },
                { "mData": "DataCriacao" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Armazem);
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Descricao);
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "bSortable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.DataCriacao);
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
    },
    initAutocomplete: function(field, autocompleteUrl, render, minimumInput) {
        $(field)
            .select2({
                placeholder: resources.get("Search..."),
                minimumInputLength: minimumInput,
                ajax: {
                    url: autocompleteUrl,
                    dataType: "json",
                    data: function(term, page) {
                        return {
                            search: term,
                            start: 0,
                            length: 10
                        };
                    },
                    results: function(data, page) {
                        return { results: data.Rows };
                    }
                },
                id: function(data) { return data.Id; },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "" && id.split("-").length == 5) {
                        $.ajax(autocompleteUrl + "/" + id,
                            {
                                dataType: "json"
                            })
                            .done(function(data) { callback(data); });
                    }
                },
                width: "100%",
                formatResult: render,
                formatSelection: render,
                allowClear: true,
                escapeMarkup: function(m) { return m; }
            });
    }
});