var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.LiberacaoCargaModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.NumeroDocumento = ko.observable();
        this.Prioridade = ko.observable();
        this.Usuario = ko.observable();
        this.Veiculo = ko.observable();
        this.PlacaVeiculo = ko.observable();
        this.ClienteNome = ko.observable();
        this.TipoCliente = ko.observable();
        this.RangeFEFO = ko.observable();
        this.Curva = ko.observable();
        this.DetalhesItem = ko.observableArray();
        this.DetalhesTarefas = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.NumeroDocumento('');
        this.Prioridade('');
        this.Usuario('');
        this.PlacaVeiculo('');
        this.Veiculo('');
        this.ClienteNome('');
        this.TipoCliente('');
        this.RangeFEFO('');
        this.Curva('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArmazem(model.CodigoArmazem);
        this.NumeroDocumento(model.NumeroDocumento);
        this.Prioridade('');
        this.Usuario(model.Usuario);
        this.Veiculo(model.Veiculo);
        this.PlacaVeiculo(model.PlacaVeiculo);
        this.ClienteNome(model.ClienteNome);
        this.TipoCliente(model.TipoCliente);
        this.RangeFEFO(model.RangeFEFO);
        this.Curva(model.Curva);
    }
});

hbsis.wms.management.DTDetailModel = Class.extend({
    init: function (model) {
        this.Id = model.Id;
        this.Codigo = model.Codigo;
        this.Descricao = model.Descricao;
        this.QtdeTotal = model.QtdeTotal;
        this.Divergencia = model.Divergencia;
        this.QuantidadeInformada = model.QuantidadeInformada;
        this.Status = model.Status;
        this.UnidadeMedida = model.UnidadeMedida;

        this.Editar = function () {
            return self.management.editMarkup;

        };
    }
});

hbsis.wms.management.TarefasExecutadaDetailModel = Class.extend({
    init: function (model) {
        this.TarefaCodigo = model.TarefaCodigo;
        this.ItemCodigo = model.ItemCodigo;
        this.ItemDescricao = model.ItemDescricao;
        this.Quantidade = model.Quantidade;
        this.LoteNumero = model.LoteNumero;
        this.EnderecoOrigem = model.EnderecoOrigem;
        this.Validade = model.Validade;
    }
});


hbsis.wms.management.ItensImportadosDetailModel = Class.extend({
    init: function (model) {
        this.ItemCodigo = model.ItemCodigo;
        this.ItemDescricao = model.ItemDescricao;
        this.QuantidadeSolicitada = model.QuantidadeSolicitada;
        this.QuantidadeExcutada = model.QuantidadeExcutada;
        this.UnidadeMedidaDescricao = model.UnidadeMedidaDescricao;
    }
});

function clearAllMessages() {
    $("#releaseLoadsErrorMessage").remove();
    $("#releaseLoadsSuccessMessage").remove();
};

function showErrorMessage(message) {
    clearAllMessages();
    var errorProcessAlert =
        "<div id=\"releaseLoadsErrorMessage\" class=\"alert alert-danger alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errorMessage}</div>";
    var errorAlert = errorProcessAlert.replace("{errorMessage}", message);
    $("#modelContentMessage").prepend(errorAlert);
};

function showSuccessMessage(message) {
    clearAllMessages();
    var successProcess =
        "<div id=\"releaseLoadsSuccessMessage\" class=\"alert alert-success alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>{successMessage}</div>";
    var successAlert = successProcess.replace("{successMessage}", message);
    $("#modelContentMessage").prepend(successAlert);
}

hbsis.wms.management.LiberacaoCargaViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#Usuario", this.settings.userAutocompleteUrl, this.renderAssociateUserID, true);
        this.initAutocomplete("#Veiculo", this.settings.vehicleAutocompleteUrl, this.renderAssociateVehicleID, false);
        
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        var self = this;

        $("#datatable").on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);
    },
    edit: function (model) {
        this._super(model);
        var currentModel = this.model();
        $("#Usuario").select2("val", $("#Usuario").val(), true);
        $("#Veiculo").select2("val", $("#Veiculo").val(), true);
        currentModel.DetalhesItem.removeAll();
        currentModel.DetalhesTarefas.removeAll();

        $.ajax({
            async: true,
            url: location.href + "/BuscarDetalhes/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                currentModel.RangeFEFO(data.RangeFEFO);
                currentModel.Curva(data.Curva);
                $.each(data, function (i, item) {
                    if (i == 'ItensImportados') {
                        for (var i = 0; i < item.length; i++) {
                            currentModel.DetalhesItem.push(new hbsis.wms.management.ItensImportadosDetailModel(item[i]));
                        }
                    }
                    
                    if (i == 'TarefasExecutadas') {
                        for (var i = 0; i < item.length; i++) {
                            currentModel.DetalhesTarefas.push(new hbsis.wms.management.TarefasExecutadaDetailModel(item[i]));
                        }
                    }
                });
            }
        });

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
    createModel: function () {
        return ko.observable(new hbsis.wms.management.LiberacaoCargaModel());
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    clearSaveForm: function () {
        this._super();
    },
    renderAssociateUserID: function (user) {
        return user.Name;
    },
    renderAssociateVehicleID: function (veiculo) {
        return veiculo.LicensePlate;
    },
    statusFinder: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    searchRequestDataPickArea: function (term, page) {
        var warehouse = $("#Warehouse_Id").val();
        if (warehouse) {
            return {
                search: term,
                start: 0,
                length: 10,
                field1: 'code',
                value1: String(warehouse)
            };
        }
        return {
            search: term,
            start: 0,
            length: 10
        };
    },
    myAction: function () {
        console.log("hi");
        return true;
    },
    getDatatableConfig: function () {
        var self = this;

        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "status", "value": $("#Status").val() });
                if ($("#Status").val() != "") {
                    aoData.push({ "name": "allStatus", "value": "false" });
                } else {
                    aoData.push({ "name": "allStatus", "value": "true" });
                }
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": null },
                { "mData": "CodigoArmazem" },
                { "mData": "NumeroDocumento" },
                { "mData": "PlacaVeiculo" },
                { "mData": null },
                { "mData": null },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Status != "Conferida" && row.Status != "Concluida" && row.Status != "Carregado" && row.Status != "Cancelado" ) {
                            return '<input type="checkbox" class="loadId" value="' + row.NumeroDocumento + '" >';
                        } else {
                            return " - ";
                        }

                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.CodigoArmazem; }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.NumeroDocumento; }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row) {
                        if (row.PlacaVeiculo == null)
                            return "-";
                        return row.PlacaVeiculo;
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Data == null)
                            return "-";
                        return row.Data;
                    }
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function(data, type, row) {
                         return '<span id="status' + resources.get(row.NumeroDocumento) + '">' + resources.get(row.Status) + '</span></div>';
                         //return resources.get(row.Status);
                    },

                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (oData.Status == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                        else if (oData.Status  == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (oData.Status  == "Novo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        }
                        else if (oData.Status  == "Parcial") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        }
                        else if (oData.Status  == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                        }
                        else if (oData.Status  == "Carregado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (oData.Status  == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (oData.Status  == "Liberado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (oData.Status == "EmEspera") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        }
                        else if (oData.Status == "Conferida") {
                            $(nTd).css({ "font-weight": "bold", "color": "#008000" });
                        }
                        else if (oData.Status == "Execucao") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                    }
                },
                {
                    "aTargets": [6], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        var htmlComDados = [];
                        htmlComDados.push('<div id="' + row.NumeroDocumento + '">');
                        htmlComDados.push('<select style="display:none" id="select_' + row.NumeroDocumento + '"></select>');
                        htmlComDados.push('<span id="' + row.NumeroDocumento + '">' + row.BoxCode + '</span>');
                        htmlComDados.push('<input type="hidden" id="idBox_' + row.NumeroDocumento + '" value="' + row.BoxId + '" />');
                        htmlComDados.push('<input type="hidden" id="codigoBox_' + row.NumeroDocumento + '" value="' + row.BoxCode + '" />');
                        htmlComDados.push('</div>');

                        if (row.BoxCode != null) {
                            return htmlComDados.join('');
                        } else {
                            return '<div id="' + row.NumeroDocumento + '"><select style="display:none" id="select_' + row.NumeroDocumento + '"></select>' +
                                '<span id="' + row.NumeroDocumento + '"> - </span></div>';
                        }
                    }
                },
                {
                    "aTargets": [7],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        var html = self.settings.editPriority;
                        html +=
                               "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#detalhe-modal\" data-toggle=\"modal\">" +
                               "<i class=\"fa fa-search\"></i></a>";
                        return html;
                    }


                }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, multiselect, minimumInput) {
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
            tags: multiselect,
            escapeMarkup: function (m) { return m; }
        });
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});