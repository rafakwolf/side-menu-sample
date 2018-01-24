var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

var StatusOrdemDescargaEnum = {
    Pendente: 'Pendente',
    AguardandoExecucao: 'AguardandoExecucao',
    Execucao: 'Execucao',
    Concluida: 'Concluida',
    ConcluidaDivergente: 'ConcluidaDivergente',
    AguardandoArquivoBlitz: 'AguardandoArquivoBlitz',
    AguardandoAprovacao: 'AguardandoAprovacao'
};

hbsis.wms.settings.CargaRecebimentoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.NumeroRecebimento = ko.observable();
        this.PlacaVeiculo = ko.observable();
        this.IdVeiculo = ko.observable();
        this.StatusOrdemDescarga = ko.observable();
        this.Details = ko.observable(new hbsis.wms.settings.RecebimentoDetailModel());
        this.DetailsRefugo = ko.observableArray();
        this.ExisteRefugo = ko.observable();
        this.VeiculoEditavel = ko.observable();
        this.QuantidadeVezesConferida = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.CodigoArmazem('');
        this.NumeroRecebimento('');
        this.PlacaVeiculo('');
        this.IdVeiculo('');
        this.StatusOrdemDescarga('');
        this.Details(new hbsis.wms.settings.RecebimentoDetailModel());
        this.DetailsRefugo.removeAll();
        this.VeiculoEditavel(false);
        this.QuantidadeVezesConferida('-');
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArmazem(model.CodigoArmazem);
        this.NumeroRecebimento(model.NumeroRecebimento);
        this.PlacaVeiculo(model.PlacaVeiculo);
        this.IdVeiculo(model.IdVeiculo);
        this.StatusOrdemDescarga(model.StatusOrdemDescarga);
        this.ExisteRefugo(model.ExisteRefugo);
        this.VeiculoEditavel(model.VeiculoEditavel);
        this.QuantidadeVezesConferida(model.QuantidadeVezesConferida);
        this.Details();
    }
});

/* --- Detalhes do recebimento de AG --- */
function Item(
    id,
    codigo,
    descricao,
    status,
    quantidadePrevista,
    quantidadeConferida,
    diferenca,
    quantidadeAprovada,
    unidadeDeMedida
) {
    this.Id = id;
    this.Codigo = codigo;
    this.Descricao = descricao;
    this.StatusOrdemDescarga = status;
    this.QuantidadePrevista = quantidadePrevista;
    this.QuantidadeConferida = quantidadeConferida;
    this.Diferenca = diferenca;
    this.QuantidadeAprovada = quantidadeAprovada;
    this.UnidadeDeMedida = unidadeDeMedida;

}

hbsis.wms.settings.RecebimentoDetailModel = Class.extend({
    init: function (model) {
        this.Id = ko.observable(model ? model.Id : null);
        this.Justificativa = ko.observable(model ? model.Justificativa : null);
        this.Itens = ko.observableArray();

        if (model && model.Itens.length > 0) {
            model.Itens.map(function (item) {
                this.Itens.push(new Item(
                    item.Id,
                    item.Codigo,
                    item.Descricao,
                    item.Status,
                    item.QuantidadePrevista,
                    item.QuantidadeConferida,
                    item.Diferenca,
                    item.QuantidadeAprovada,
                    item.UnidadeDeMedida
                ));
            }.bind(this));
        }
    }
});

/* --- */

hbsis.wms.settings.RefugoDetailModel = Class.extend({
    init: function (model) {
        this.Id = model.Id;
        this.Ocorrencia = model.OcorrenciaDescricao;
        this.Quantidade = model.Quantidade;
        this.Fotos = model.Fotos;

        this.Editar = function () {
            return self.settings.editMarkup;
        };
    }
});

hbsis.wms.settings.CargaRecebimentoViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    urlGetItemsConfered: "",
    fotoURL: ko.observable(),
    statusOD: ko.observable(),
    init: function (opts) {
        
        this._super(opts);

        this.initAutocomplete("#IdVeiculo", this.settings.vehicleAutocompleteUrl, this.renderVehicle);

        this.fotoURL(this.settings.fotoEndereco + '/DownloadFoto/');
        this.urlGetItemsConfered = this.settings.cargaRecebimentoUrl;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#StatusOrdemDescarga"
        });

        $("#IdVeiculo").addClass("ignore");
        $("#StatusOrdemDescarga").val('');
        $("#StatusOrdemDescarga").select2("val", $("#StatusOrdemDescarga").val(), true);
    },

    
    _exibirMensagem: function (alert) {
        this._limparMensagens();
        $("#formularioAprovacaoOD .modal-body").prepend(alert);
    },

    _limparMensagens: function() {
        if (document.getElementById('MSG')) {
            $("#MSG").remove();
        }
    },

    cancelarAprovacaoOD: function () {
        if (document.getElementById('MSG')) {
            $("#MSG").remove();
        }

        this.statusOD('');
    },

    pendenteOuAguardandoExecucao: function(statusOD) {
        return statusOD == StatusOrdemDescargaEnum.Pendente || statusOD == StatusOrdemDescargaEnum.AguardandoExecucao;
    },

    aguardandoAprovacaoOuConcluidaComDivergencia: function(statusOD) {
        return statusOD == StatusOrdemDescargaEnum.AguardandoAprovacao || statusOD == StatusOrdemDescargaEnum.ConcluidaDivergente;
    },

    concluido: function(statusOD) {
        return statusOD == StatusOrdemDescargaEnum.Concluida || statusOD == StatusOrdemDescargaEnum.ConcluidaDivergente;
    },

    conferindoOuConferido: function(statusOD) {
        return statusOD == StatusOrdemDescargaEnum.Execucao
            || statusOD == StatusOrdemDescargaEnum.AguardandoAprovacao
            || statusOD == StatusOrdemDescargaEnum.ConcluidaDivergente
            || statusOD == StatusOrdemDescargaEnum.Concluida;
    },

    ehAdmin: function () {
        console.log(this.settings.usuarioAdmin == 'True' ? true : false);
        return this.settings.usuarioAdmin == 'True' ? true : false;
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

                if (self.startDate !== startDate) {
                    self.startDate = startDate;
                    self.dirty(true);
                }
                if (self.endDate !== endDate) {
                    self.endDate = endDate;
                    self.dirty(true);
                }
                self.refreshDatatable();
            }
        });
    },
    clearSaveForm: function () {
        this._super();
        $("#Id").select2("val", "", true);
        $("#IdVeiculo").select2("val", "", true);

        // limpar mensagem aqui
        this._limparMensagens();
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.CargaRecebimentoModel());
    },
    renderVehicle: function (veiculo) {
        return veiculo.LicensePlate;
    },
    getModelDescription: function (model) {
        return model.NumeroRecebimento;
    },
    obterUrlSalvar: function (id) {
        return this.form.attr('action') + "/LiberarOD" + "/" + id;
    },
    obterUrlAprovar: function (id) {
        return this.form.attr('action') + "/AprovarOD" + "/" + id;
    },
    salvarForm: function (modal) {
        var statusOD = this.model().StatusOrdemDescarga();
        if (statusOD == StatusOrdemDescargaEnum.AguardandoAprovacao) {
            this.salvarFormularioAprovacaoOD(modal);
        } else {
            this.salvarFormulationLiberacaoOD(modal);
        }
    },

    salvarFormulationLiberacaoOD: function (formulario) {
        $('#btSalvar').prop('disabled', true);
        var id = this.form.find("#Id").val();
        var data = this.getFormData.call(this);
        var url = this.obterUrlSalvar(id);
        var self = this;
        $.ajax({
            type: self.editMode() ? "PUT" : "POST",
            url: url,
            data: data,
            success: function (data, textStatus, jqXHR) {
                self.dirty(true);
                self.refreshDatatable();

                if ($.isFunction(self.settings.onSaveSuccess)) {
                    self.settings.onSaveSuccess.apply(self, arguments);
                }

                if ($.isFunction(self.settings.onChange)) {
                    self.settings.onChange.apply(self, arguments);
                }

                if (!self.editMode()) {
                    self.clearSaveForm();

                    if (data.id != '') {
                        var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegisteredSuccessfully') + '</div>';

                        self._exibirMensagem(alert);

                    }
                    else if (data.length > 1) {
                        var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + data.length + resources.get('ManyRegisteredSuccessfully') + '</div>';

                        self._exibirMensagem(alert);

                    }

                } else {
                    var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegistryEditedWithSuccess') + '</div>';

                    self._exibirMensagem(alert);
                }
                $('#btSalvar').prop('disabled', false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#btSalvar').prop('disabled', false);
                if (document.getElementById('MSG')) {
                    $("#MSG").remove();
                }

                if (jqXHR.status == 500) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Ocorreu um erro interno do servidor!</div>";

                    self._exibirMensagem(error);
                    return;
                }
                if (jqXHR.status == 300) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Não existem modificações para serem salvas. Favor verificar!</div>";

                    self._exibirMensagem(error);
                    return;
                }
                if (jqXHR.status == 400) {
                    this.results = new hbsis.wms.ErrorHandler(jqXHR);

                    var alert = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>";

                    if (this.results.hasErrors()) {
                        alert += "<ul>";
                        for (var i = 0; i < this.results.errors.length; i++) {
                            alert += "<li>" + this.results.errors[i].Errors[0] + "</li>";
                        }
                        alert += "</ul></div>";

                        self._exibirMensagem(alert);
                    }

                    return;
                }
                if (jqXHR.status == 401) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + resources.get('Unauthorized error user') + "</div>";

                    self._exibirMensagem(error);
                    return;
                }
                if (jqXHR.status == 302) {
                    var url = /<a href=\"(.*)\">here<\/a>/.exec(jqXHR.responseText)[1];
                    location.href = url;
                }

                else {
                    var message = JSON.parse(jqXHR.responseText).message;
                    if (message) {

                        var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + JSON.parse(jqXHR.responseText).message + "</div>";

                        self._exibirMensagem(alert);
                    }
                }

                if ($.isFunction(self.settings.onSaveError)) {
                    self.settings.onSaveError.apply(self, arguments);
                }
            }
        }).always(function () {
            delete loader;
        });
    },

    salvarFormularioAprovacaoOD: function (formulario) {
        var model = this.model();
        var formularioEstahValido = $(formulario).valid();
        if (formularioEstahValido) {
            var self = this;
            var dadosParaSalvar = JSON.parse(ko.toJSON(this.model().Details()));
            var url = this.obterUrlAprovar(dadosParaSalvar.Id);

            $.ajax({
                async: true,
                url: url,
                dataType: "JSON",
                data: dadosParaSalvar,
                type: "PUT",
                success: function () {
                    self.dirty(true);
                    self.refreshDatatable();

                    var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegistryEditedWithSuccess') + '</div>';
                    self._exibirMensagem(alert);

                    self.statusOD(StatusOrdemDescargaEnum.ConcluidaDivergente);
                    model.StatusOrdemDescarga(StatusOrdemDescargaEnum.ConcluidaDivergente);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (document.getElementById('MSG')) {
                        $("#MSG").remove();
                    }

                    if (jqXHR.status == 500) {
                        var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Ocorreu um erro interno do servidor!</div>";

                        self._exibirMensagem(error);
                        return;
                    }
                    if (jqXHR.status == 300) {
                        var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Não existem modificações para serem salvas. Favor verificar!</div>";

                        self._exibirMensagem(error);
                        return;
                    }
                    if (jqXHR.status == 400) {
                        this.results = new hbsis.wms.ErrorHandler(jqXHR);

                        var alert = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>";

                        if (this.results.hasErrors()) {
                            alert += "<ul>";
                            for (var i = 0; i < this.results.errors.length; i++) {
                                alert += "<li>" + this.results.errors[i].Errors[0] + "</li>";
                            }
                            alert += "</ul></div>";

                            self._exibirMensagem(alert);
                        }

                        return;
                    }
                    if (jqXHR.status == 401) {
                        var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + resources.get('Unauthorized error user') + "</div>";

                        self._exibirMensagem(error);
                        return;
                    }
                    if (jqXHR.status == 302) {
                        var url = /<a href=\"(.*)\">here<\/a>/.exec(jqXHR.responseText)[1];
                        location.href = url;
                    }

                    else {
                        var message = JSON.parse(jqXHR.responseText).message;
                        if (message) {

                            var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                                "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + JSON.parse(jqXHR.responseText).message + "</div>";

                            self._exibirMensagem(alert);
                        }
                    }

                    if ($.isFunction(self.settings.onSaveError)) {
                        self.settings.onSaveError.apply(self, arguments);
                    }
                }
            });
        }
    },

    edit: function (model) {
        this._super(model);
        var self = this;
        var currentModel = this.model();
        $("#IdVeiculo").select2("val", model.IdVeiculo, true);

        $.ajax({
            async: true,
            url: this.urlGetItemsConfered + "/BuscarDetalhes/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {

                self.statusOD(currentModel.StatusOrdemDescarga());
                currentModel.Details(new hbsis.wms.settings.RecebimentoDetailModel(data.detalhes));

                if (data.errosUnidadeMedida.length > 0) {

                    var erro = "";
                    for (var i = 0; i < data.errosUnidadeMedida.length; i++)
                        erro += data.errosUnidadeMedida[i] + "!</br/>";

                    error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + erro + "</div>";

                    self._exibirMensagem(error);
                    self.statusOD(0);
                }
            }
        });

        $.ajax({
            async: true,
            url: this.urlGetItemsConfered + "/BuscarRefugos/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                currentModel.DetailsRefugo.removeAll();
                $.each(data, function (i, item) {
                    currentModel.DetailsRefugo.push(new hbsis.wms.settings.RefugoDetailModel(item));
                });
                $("[rel='lightbox']").slimbox({
                    counterText: 'Imagem {x} de {y}'
                }, function (el) {
                    return [el.href, el.title + '<br /><a href="' + el.href + '"><i class="fa fa-arrow-down"></i>Salvar esta imagem</a>'];
                });
            }
        });
    },

    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
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
            escapeMarkup: function (m) { return m; }
        });
    },
    getFormData: function () {
        var self = this;
        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "NumeroRecebimento", "value": $('#NumeroRecebimento').val() });
                aoData.push({ "name": "Veiculo", "value": $('#IdVeiculo').val() });
                aoData.push({ "name": "StatusOrdemDescarga", "value": $('#StatusOrdemDescarga').val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });

                if ($("#StatusOrdemDescarga").val() !== "") {
                    aoData.push({ "name": "NRIStatus", "value": "true" });
                    aoData.push({ "name": "StatusOrdemDescarga", "value": $("#StatusOrdemDescarga").val() });
                } else {
                    aoData.push({ "name": "NRIStatus", "value": "false" });
                    aoData.push({ "name": "StatusOrdemDescarga", "value": $("#StatusOrdemDescarga").val() });
                }
            },

            "aoColumns": [
              { "mData": "CodigoArmazem" },
              { "mData": "NumeroRecebimento" },
              { "mData": "PlacaVeiculo" },
              { "mData": "StatusOrdemDescarga" },
              { "mData": "QuantidadeVezesConferida" },
              { "mData": null }

            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.CodigoArmazem;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": false
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.PlacaVeiculo == null)
                            return '-';
                        return row.PlacaVeiculo;
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.StatusOrdemDescargaDescricao);
                    },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        var field = sData.split("<")[0].replace(/\s+/g, '');
                        if (field == "Pendente") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c", "width": "98px" });
                        } else if (field == "Conferido") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "Liberado" || field == "Executando") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        } else if (field == "Conferidocomdivergência") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "AguardandoArquivoBlitz") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        } else if (field == "AguardandoAprovação") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.QuantidadeVezesConferida == null)
                            return '-';
                        return row.QuantidadeVezesConferida;
                    }
                },
                {
                    "aTargets": [5],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        var html = "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#modalAprovarOD\" data-toggle=\"modal\">" +
                                "<i class=\"fa fa-pencil\"></i></a> ";

                        if (row.ExisteRefugo == true) {
                            html +=
                                "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#refugo-modal\" data-toggle=\"modal\">" +
                                "<i class=\"fa fa-flask\"></i></a>";
                        }
                        return html;
                    }
                }
            ]
        };
    }
});