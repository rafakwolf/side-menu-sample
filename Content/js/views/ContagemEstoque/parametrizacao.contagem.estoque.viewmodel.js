var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ParametrizacaoContagemEstoqueModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.AtividadeAgendamento = ko.observable();
        this.TipoSujeitoRevisao = ko.observable();
        this.IdTipoSujeitoRevisao = ko.observable();
        this.Curva = ko.observable();
        this.IdPerfilPermitido = ko.observable();
        this.Periodicidade = ko.observable();
        
        this.EhPeriodicidadeSemanal = ko.computed(function() {
            return this.Periodicidade() === "Semanal";
        }, this);

        this.EhContagemPorCurva = ko.computed(function() {
            return this.TipoSujeitoRevisao() === "PorCurva";
        }, this);

        this.Domingo = ko.observable();
        this.Segunda = ko.observable();
        this.Terca = ko.observable();
        this.Quarta = ko.observable();
        this.Quinta = ko.observable();
        this.Sexta = ko.observable();
        this.Sabado = ko.observable();

        this.Agendamentos = ko.observableArray();
        this.Acao = ko.observable();
        this.Acoes = ko.observableArray();
        this.IdAcaoTarefaSobrar = ko.observable();
        this.IdAcaoTarefaFaltar = ko.observable();
        this.IdAcaoTarefaTransferir = ko.observable();
        this.RecontarQuandoDivergir = ko.observable(false);

    },
    clear: function () {
        this.Id('');
        this.AtividadeAgendamento('');
        this.TipoSujeitoRevisao('');
        this.IdTipoSujeitoRevisao('');
        this.Curva('');
        this.IdPerfilPermitido('');
        this.IdAcaoTarefaSobrar('');
        this.IdAcaoTarefaFaltar('');
        this.IdAcaoTarefaTransferir('');
        this.RecontarQuandoDivergir(false);
        this.Acao('');
        this.Periodicidade('');

        this.Domingo(false);
        this.Segunda(false);
        this.Terca(false);
        this.Quarta(false);
        this.Quinta(false);
        this.Sexta(false);
        this.Sabado(false);

        this.Acoes.removeAll();
        this.Agendamentos.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.AtividadeAgendamento(model.AtividadeAgendamento);
        this.TipoSujeitoRevisao(model.TipoSujeitoRevisao);
        this.IdTipoSujeitoRevisao(model.IdTipoSujeitoRevisao);
        this.Curva(model.Curva);
        this.Periodicidade(model.Periodicidade);

        this.Domingo(model.Domingo);
        this.Segunda(model.Segunda);
        this.Terca(model.Terca);
        this.Quarta(model.Quarta);
        this.Quinta(model.Quinta);
        this.Sexta(model.Sexta);
        this.Sabado(model.Sabado);
        
        this.IdPerfilPermitido(model.IdPerfilPermitido);
        this.IdAcaoTarefaSobrar(model.IdAcaoTarefaSobrar);
        this.IdAcaoTarefaFaltar(model.IdAcaoTarefaFaltar);
        this.IdAcaoTarefaTransferir(model.IdAcaoTarefaTransferir);
        this.RecontarQuandoDivergir(model.RecontarQuandoDivergir);

        model.Agendamentos.forEach(function (agendamento, indice) {
            this.Agendamentos.push(agendamento);
        }.bind(this));
        model.Acoes.forEach(function (acao, indice) {
            this.Acoes.push(acao);
        }.bind(this));
    }
});
self: null;
hbsis.wms.settings.ParametrizacaoContagemEstoqueViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        self = this;

        this.autoCompleteTipoContagem("#IdTipoSujeitoRevisao", this.renderTipoContagem);
        this.initAutocomplete("#IdAcaoTarefaSobrar", this.obterUrlAcaoTarefaSobra(), this.renderAcaoTarefa);
        this.initAutocomplete("#IdAcaoTarefaFaltar", this.obterUrlAcaoTarefaFalta(), this.renderAcaoTarefa);
        this.initAutocomplete("#IdAcaoTarefaTransferir", this.obterUrlAcaoTarefaTransferencia(), this.renderAcaoTarefa);
        this.initAutocomplete("#IdPerfilPermitido", this.obterUrlPerfil(), this.renderProfile);
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Curva" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Periodicidade" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Acao" });
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#TipoSujeitoRevisao" });

        $("#TipoSujeitoRevisao").change(this.assuntoSelecionado);
        $(".clockpicker").clockpicker();
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ParametrizacaoContagemEstoqueModel());
    },
    renderProfile: function (profile) {
        return profile.Name;
    },
    renderTipoContagem: function (profile) {
        return profile.Descricao;
    },
    renderAcaoTarefa: function (acao) {
        return acao.Descricao;
    },
    clearSaveForm: function () {
        this._super();
        $("#AtividadeAgendamento").select2("val", "", true);
        $("#TipoSujeitoRevisao").select2("val", "", true);
        $("#IdTipoSujeitoRevisao").select2("val", "", true);
        $("#Curva").select2("val", "", true);
        $("#Periodicidade").select2("val", "", true);
        $("#IdPerfilPermitido").select2("val", "", true);
        $("#IdAcaoTarefaSobrar").select2("val", "", true);
        $("#IdAcaoTarefaFaltar").select2("val", "", true);
        $("#IdAcaoTarefaTransferir").select2("val", "", true);
        $("#RecontarQuandoDivergir").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#AtividadeAgendamento").select2("val", $("#AtividadeAgendamento").val(), true);
        $("#TipoSujeitoRevisao").select2("val", $("#TipoSujeitoRevisao").val(), true);
        $("#IdTipoSujeitoRevisao").select2("val", $("#IdTipoSujeitoRevisao").val(), true);
        $("#Curva").select2("val", $("#Curva").val(), true);
        $("#Periodicidade").select2("val", $("#Periodicidade").val(), true);
        $("#IdPerfilPermitido").select2("val", $("#IdPerfilPermitido").val(), true);
        $("#IdAcaoTarefaSobrar").select2("val", $("#IdAcaoTarefaSobrar").val(), true);
        $("#IdAcaoTarefaFaltar").select2("val", $("#IdAcaoTarefaFaltar").val(), true);
        $("#IdAcaoTarefaTransferir").select2("val", $("#IdAcaoTarefaTransferir").val(), true);
        $("#RecontarQuandoDivergir").select2("val", $("#RecontarQuandoDivergir").val(), true);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    tipoContagemSelecionada: function () {

        $("#IdTipoSujeitoRevisao").select2("val", "", true);
        this.autoCompleteTipoContagem("#IdTipoSujeitoRevisao", this.renderTipoContagem);
    },
    adicionarAgendamento: function () {
        var novoAgendamento = { Descricao: $('#inputHora').val() };
        this.model().Agendamentos.push(novoAgendamento);
    },
    excluirAgendamento: function () {
        self.model().Agendamentos.remove(this);
    },
    _obterAcaoSelecionada: function () {
        var nomeAcao = $("#Acao").val();

        var acoesAssociadas = [];
        $.ajax({
            url: this.settings.urlBase + "/Acao/" + nomeAcao + "/obter-associadas-enum",
            success: function (acoes) {
                for (var i = 0; i < acoes.length; i++) {
                    acoesAssociadas.push(acoes[i]);
                }
            },
            async: false
        });

        var acao = {
            Texto: $("#Acao :selected").text(),
            Acao: nomeAcao,
            AcoesAssociadas: acoesAssociadas
        };
        
        return acao;
    },    
    definirAcaoEAdicionarAcoesAssociadas: function () {
        var acaoSelecionada = this._obterAcaoSelecionada();
        self._obterAcoesAssociadas(acaoSelecionada, function (acoesAssociadas) {
            for (var i = 0; i < acoesAssociadas.length; i++) {
                var acaoAssociada = acoesAssociadas[i];
                this._definirAcaoSeAindaNaoEstiverDefinida(acaoAssociada);
            }
            this._definirAcaoSeAindaNaoEstiverDefinida(acaoSelecionada);
        }.bind(self));
    },
    _definirAcaoSeAindaNaoEstiverDefinida: function (acao) {
        var acaoContagemJaFoiSelecionada = false;
        var acoesDefinidas = JSON.parse(ko.toJSON(self.model().Acoes));

        for (var i = 0; i < acoesDefinidas.length; i++) {
            if (acoesDefinidas[i].Acao === acao.Acao) {
                acaoContagemJaFoiSelecionada = true;
                break;
            }
        }

        if (!acaoContagemJaFoiSelecionada) {
            this.model().Acoes.push(acao);
        }
    },
    _obterAcoesAssociadas: function (acao, callback) {
        var url = this.settings.urlBase + "/Acao/" + acao.Acao + "/obter-associadas";
        $.get(url)
            .done(function (acoesAssociadas) {
                callback(acoesAssociadas);
            }.bind(self));
    },
    excluirAcao: function () {
        var acaoSendoExcluida = this;

        var podeExcluir = true;
        var acoesDefinidas = JSON.parse(ko.toJSON(self.model().Acoes));
        for (var i = 0; i < acoesDefinidas.length; i++) {
            var acoesAssociadas = acoesDefinidas[i].AcoesAssociadas;
            for (var j = 0; j < acoesAssociadas.length; j++) {
                if (acoesAssociadas[j] === acaoSendoExcluida.Acao) {
                    podeExcluir = false;
                    break;
                }    
            }
        }

        if (podeExcluir)
            self.model().Acoes.remove(acaoSendoExcluida);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "AtividadeAgendamento" },
              { "mDAta": "Acoes" },
              { "mData": "Opcao" },
              { "mData": "Periodicidade" },
              { "mData": "Horarios" },
              { "mData": "NomePerfilPermitido" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                  {
                      "aTargets": [0],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.AtividadeAgendamento);
                      }
                  },
                  {
                      "aTargets": [1],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          var acoes = [];
                          for (var i = 0; i < row.Acoes.length; i++) {
                              acoes.push(row.Acoes[i].Texto);
                          }
                          return acoes.join('</br>');
                      }
                  },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Opcao;
                      }
                  },
                  {
                      "aTargets": [3],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.Periodicidade);
                      }
                  },
                  {
                      "aTargets": [4],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          var horarios = [];
                          for (var i = 0; i < row.Agendamentos.length; i++) {
                              horarios.push(row.Agendamentos[i].Descricao);
                          }
                          return horarios.join('</br>');
                      }
                  },
                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.NomePerfilPermitido;
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
    obterUrlAcaoTarefaSobra: function () {
        var urlBase = this.settings.urlBase;
        return urlBase + '/ConclusaoTarefa/sobra';
    },
    obterUrlAcaoTarefaFalta: function () {
        var urlBase = this.settings.urlBase;
        return urlBase + '/ConclusaoTarefa/falta';
    },
    obterUrlAcaoTarefaTransferencia: function () {
        var urlBase = this.settings.urlBase;
        return urlBase + '/ConclusaoTarefa/transferencia';
    },
    obterUrlPerfil: function () {
        var urlBase = this.settings.urlBase;
        return urlBase + '/Perfis';
    },
    validarAntesDeSalvar: function () {
        this.save();

        var etapaConfiguracao = gerenciadorErros.obterEtapaConfiguracaoComErro();
        if (etapaConfiguracao >= 0) {
            gerenciadorInterface.mostrarConfiguracao(etapaConfiguracao);
            var botaoParaAtivar = document.querySelectorAll('.btn-navegacao')[etapaConfiguracao];
            gerenciadorInterface.controlarBotaoAtivo(null, botaoParaAtivar);
        }

    },
    autoCompleteTipoContagem: function (field, render, searchRequestData) {
        var urlBase = this.settings.urlBase;
        var tipoContagem = $('#save-modal').find('#TipoSujeitoRevisao').val();
        var autocompleteUrl = urlBase + '/TipoSujeitoRevisao/' + tipoContagem;

        $(field).select2({
            minimumInputLength: 3,
            placeholder: resources.get('Procurando...'),
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
                    return { results: data };
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
        return $.toDictionary(ko.toJS(this.model()));
    }
});

function GerenciadorInterface() {
    var botoes = document.querySelectorAll('.btn-navegacao');
    for (var i = 0, len = botoes.length; i < len; i++) {
        botoes[i].addEventListener('click', this.controlarBotaoAtivo);
    }
}
GerenciadorInterface.prototype = {
    mostrarConfiguracao: function (configuracao) {

        var interfacesConfiguracao = document.querySelectorAll('[data-configuracao]');
        for (var i = 0, len = interfacesConfiguracao.length; i < len; i++) {
            var tela = interfacesConfiguracao[i];
            if (configuracao === i) {
                tela.classList.add("ativo");
            } else {
                tela.classList.remove("ativo");
            }
        }
    },
    controlarBotaoAtivo: function (evento, botao) {

        var botoesNavegacao = document.querySelectorAll('.btn-navegacao');
        for (var i = 0, len = botoesNavegacao.length; i < len; i++) {
            botoesNavegacao[i].classList.remove("ativo");
        }

        var botaoParaAtivar = null;
        if (evento)
            botaoParaAtivar = evento.path[1].tagName == 'A' ? evento.path[1] : evento.path[0];
        else if (botao)
            botaoParaAtivar = botao;

        $(botaoParaAtivar).addClass("ativo");
    }
};

function GerenciadorErros() { this.container = null; }
GerenciadorErros.prototype = {
    obterEtapaConfiguracaoComErro: function () {
        var campoComErro = document.querySelector('.field-validation-error');
        this._procurarContainer(campoComErro);
        if (this.container) return +this.container.getAttribute('data-configuracao');

        return false;
    },
    _procurarContainer: function (node) {
        if (!node)
            return;
        if (node.hasAttribute && node.hasAttribute('data-configuracao')) {
            this.container = node;
        } else {
            this._procurarContainer(node.parentNode);
        }
    }
};

window.gerenciadorInterface = new GerenciadorInterface();
window.gerenciadorErros = new GerenciadorErros();