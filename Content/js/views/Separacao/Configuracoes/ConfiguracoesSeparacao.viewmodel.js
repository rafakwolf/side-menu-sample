function ConfiguracoesRemuneracaoVariavel() {
    this.ativo = ko.observable(false);
    this.formulaRetornavel = ko.observable("");
    this.formulaDescartavel = ko.observable("");
    this.formulaGeral = ko.observable("");
    this.pontuacaoPaleteFacil = ko.observable();
    this.pontuacaoPaleteMedio = ko.observable();
    this.pontuacaoPaleteDificil = ko.observable();
    this.cotaParaDistribuicao = ko.observable();
    this.valorPonto = ko.observable().formatacaoMonetariaSemCifrao(2);
    this.consideraValorPonto = ko.observable(false);
    this.percentualDesmonte = ko.observable();
}

ConfiguracoesRemuneracaoVariavel.prototype = {
    carregarDados: function (dados) {
        this.ativo(dados.ativo);
        this.formulaRetornavel(dados.formulaRetornavel);
        this.formulaDescartavel(dados.formulaDescartavel);
        this.formulaGeral(dados.formulaGeral);
        this.pontuacaoPaleteFacil(dados.pontuacaoPaleteFacil);
        this.pontuacaoPaleteMedio(dados.pontuacaoPaleteMedio);
        this.pontuacaoPaleteDificil(dados.pontuacaoPaleteDificil);
        this.valorPonto(dados.valorPonto);
        this.consideraValorPonto(dados.consideraValorPonto);
        this.cotaParaDistribuicao(dados.cota);
        this.percentualDesmonte(dados.percentualDesmonte);
    }
};

function Patente() {
    this.Nome = ko.observable();
    this.PontuacaoLimite = ko.observable(0);
}
function importarValorPontoLote() {
    var botaoImportarValorPontoLote = $('#btnImportarValorPontoLote');
    var arquivoValorPontoLote = $('#fileValorPontoLote');
    var imgUpload = $('#imgLoadinUpload');
    imgUpload.hide();
    botaoImportarValorPontoLote.attr({
        'disabled': true
    });
    arquivoValorPontoLote.change(function(e) {
        botaoImportarValorPontoLote.attr({
            'disabled': false
        })
    }).bind(this);


    var aoCarregarArquivo = function() {
        var arquivoCsv = fr.result;
        var linhasCsv = arquivoCsv.split('\n');

        var valorPontoLote = [];

        for (var index = 1, size = linhasCsv.length; index < size; index++) {
            if (linhasCsv[index] !== '') {
                var valores = linhasCsv[index].split(';');
                valorPontoLote.push({
                    CodigoArmazem: valores[0].replace('\r', ''),
                    ValorPonto: valores[1].replace('\r', '')
                });
            }
        }

        var cookie = $.cookie('token');
        $.ajax({
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: 'http://' + window.location.hostname + ':8001/wms/api-gateway/separacao/configuracoes/remuneracao-variavel/valor-ponto-lote',
            headers: {
                "Authorization": cookie
            },
            data: JSON.stringify(valorPontoLote)
        }).done(function(resposta) {
            var respostaData = resposta.data;
            $("#AlertRemuneracaoVariavel").empty();
            $("#AlertRemuneracaoVariavel").append(AlertSucesso('Valores de ponto atualizados com sucesso!'));
            imgUpload.hide();
        }).fail(function(erro) {
            $('#AlertRemuneracaoVariavel').empty();
            $("#AlertRemuneracaoVariavel").append(AlertErro('Houve um erro ao importar os valores do ponto. Por favor, verifique o arquivo e tente novamente'));
            imgUpload.hide();
        });

    }.bind(this);

    botaoImportarValorPontoLote.click(function(e) {
        e.preventDefault();
        imgUpload.show();
        arquivo = arquivoValorPontoLote[0].files.item(0);
        var fileType = arquivo.name.split('.')[1].toUpperCase();
        if (fileType === null || fileType !== 'CSV') {
            alert('arquivo invalido');
            return;
        }
        fr = new FileReader();
        fr.onload = aoCarregarArquivo;
        fr.readAsText(arquivo);
    }).bind(this);
}

Patente.prototype = {
    carregarDados: function (dados) {
        this.Nome(dados.Nome);
        this.PontuacaoLimite(dados.PontuacaoLimite);
    }
}

function Penalidade() {
    this.Id = ko.observable();
    this.Nome = ko.observable();
    this.Valor = ko.observable(0);
    this.Porcentagem = ko.observable(true);
    this.Ativo = ko.observable(true);
    this.PenalidadeAutomatica = ko.observable(false);
}
Penalidade.prototype = {
    carregarDados: function (dados) {
        this.Id(dados.Id);
        this.Nome(dados.Nome);
        this.Valor(dados.Valor);
        this.Porcentagem(dados.Porcentagem);
        this.Ativo(dados.Ativo);
        this.PenalidadeAutomatica(dados.PenalidadeAutomatica);
    }
}


var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ConfiguracoesSeparacaoModel = Class.extend({
    init: function () {
        this.ConfiguracoesRemuneracaoVariavel = ko.observable(new ConfiguracoesRemuneracaoVariavel());
        this.Patente = ko.observable(new Patente());
        this.Penalidade = ko.observable(new Penalidade());
        this.Patentes = ko.observableArray();
        this.Penalidades = ko.observableArray();

        var cookie = $.cookie('token');

        importarValorPontoLote();   

        $.ajax({
            type: 'GET',
            url: 'http://' + window.location.hostname + ':8001/wms/api-gateway/separacao/configuracoes/obter',
            headers: { "Authorization": cookie }
        }).done(function (resposta) {
            var respostaData = resposta.data;
            this.ConfiguracoesRemuneracaoVariavel().carregarDados(respostaData.configuracoesSeparacaoDaRemuneracaoVariavel);
            this.Patentes(respostaData.patentes);

            $("[name='ativo']").bootstrapSwitch();
            $("[name='porcentagem']").bootstrapSwitch();
            $("[name='consideraValorPonto']").bootstrapSwitch();
        }.bind(this));

        $.ajax({
            type: 'GET',
            url: 'http://' + window.location.hostname + ':8001/wms/api-gateway/remuneracao-variavel/penalidade',
            headers: { "Authorization": cookie }
        }).done(function (resposta) {
            this.Penalidades(resposta.data);

            $("[name='PenalidadeAtiva']").bootstrapSwitch();
        }.bind(this));
    },
    clear: function () {
        this.Patente(new Patente());
        this.Penalidade(new Penalidade());
        $("#novaPenalidade [name='nome']").attr('disabled', false);
    },
    load: function (model) {
    }
});

var contextoAplicadorPenalidades = null;
hbsis.wms.settings.ConfiguracoesSeparacaoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        contextoAplicadorPenalidades = this;
    },

    clearSaveForm: function () {
        this._super();
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ConfiguracoesSeparacaoModel());
    },
    edit: function (model) {
        this._super(model);
    },
    editarPenalidade: function () {
        $('#' + this.id).val();
        $('#IdPenalidade').val(this.id);
        $("#novaPenalidade [name='nome']").val(this.nome);
        $("#novaPenalidade [name='nome']").attr('disabled', this.penalidadeAutomatica);
        $("#novaPenalidade [name='valor']").val(this.valor);


        $("#novaPenalidade [name='porcentagem']").attr('checked', this.porcentagem);
        $("#novaPenalidade [name='porcentagem']").bootstrapSwitch('destroy');
        $("#novaPenalidade [name='porcentagem']").bootstrapSwitch();

        $("#novaPenalidade [name='PenalidadeAtiva']").attr('checked', this.ativo);
        $("#novaPenalidade [name='PenalidadeAtiva']").bootstrapSwitch('destroy');
        $("#novaPenalidade [name='PenalidadeAtiva']").bootstrapSwitch();

        $('#criarNovaPenalidade').modal('show');


    },
    salvarPatente: function () {
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'http://' + window.location.hostname +
                ':8001/wms/api-gateway/separacao/classificacoes',
            headers: { "Authorization": $.cookie('token') },
            data: {
                Nome: self.model().Patente().nome,
                PontuacaoLimite: self.model().Patente().pontuacaoLimite
            },
            success: function (data) {
            },
            error: function () {
                alert();
            }
        });
    },
    salvarPenalidade: function () {
        var estahAtivo = $("#PenalidadeAtiva").is(':checked');
        var porcentagemAtivo = $("#porcentagem").is(':checked');
        var tipo;
        if ($('#IdPenalidade').val() == "") {
            tipo = 'POST';
        } else {
            tipo = 'PUT';
        }
        $.ajax({
            dataType: "json",
            type: tipo,
            url: 'http://' + window.location.hostname +
                ':8001/wms/api-gateway/remuneracao-variavel/penalidade',
            headers: { "Authorization": $.cookie('token') },
            data: {
                Id: $('#IdPenalidade').val(),
                Nome: $("#novaPenalidade [name='nome']").val(),
                Valor: $("#novaPenalidade [name='valor']").val(),
                Porcentagem: porcentagemAtivo,
                Ativo: estahAtivo
            },
            success: function () {
                if ($('#IdPenalidade').val() == "") {
                    $("#ModelAlertPenalidades").empty();
                    $("#ModelAlertPenalidades").append(AlertSucesso('Penalidade salva com sucesso'));
                } else {
                    $("#ModelAlertPenalidades").empty();
                    $("#ModelAlertPenalidades").append(AlertSucesso('Penalidade atualizada com sucesso'));
                }
                BuscarPenalidades();
                // self.model().init();

            },
            error: function () {
                $("#ModelAlertPenalidades").empty();
                $("#ModelAlertPenalidades").append(AlertErro('Erro ao salvar penalidade. Verifique os valores e tente novamente'));
            }
        });
    },
    deletarPenalidade: function () {
        indicePenalidade = $('#' + this.id).val();

        $.ajax({
            dataType: "json",
            type: 'DELETE',
            url: 'http://' + window.location.hostname +
                ':8001/wms/api-gateway/remuneracao-variavel/penalidade/deletar',
            headers: { "Authorization": $.cookie('token') },
            data: {
                Id: this.id
            },
            success: function () {
                $("#AlertPenalidades").empty();
                $("#AlertPenalidades").append(AlertSucesso('Penalidade deletada com sucesso'));
                BuscarPenalidades();
            },
            error: function () {
                $("#AlertPenalidades").empty();
                $("#AlertPenalidades").append(AlertErro('Erro ao deletar penalidade. Tente novamente'));
            }
        });
    },
    salvarConfiguracoesRemuneracaoVariavel: function () {
        var self = this;
        var estahAtivo = $("#ativo").is(':checked');
        var consideraValorDoPonto = $("#consideraValorPonto").is(':checked');        

        if (self.model().ConfiguracoesRemuneracaoVariavel().valorPonto() <= 0 && consideraValorDoPonto){
            $('#AlertRemuneracaoVariavel').empty();
            $("#AlertRemuneracaoVariavel").append(AlertErro('É necessário informar um valor para o ponto maior do que zero, quando considerar valor estiver ativo.'));
            return;
        }        

        var request = $.ajax({
            url: 'http://' + window.location.hostname + ':8001/wms/api-gateway/separacao/configuracoes/remuneracao-variavel/atualizar',
            method: "POST",
            headers: { "Authorization": $.cookie('token') },
            data: {
                FormulaGeral: self.model().ConfiguracoesRemuneracaoVariavel().formulaGeral,
                FormulaRetornavel: self.model().ConfiguracoesRemuneracaoVariavel().formulaRetornavel,
                FormulaDescartavel: self.model().ConfiguracoesRemuneracaoVariavel().formulaDescartavel,
                Ativo: estahAtivo,
                PontuacaoPaleteFacil: self.model().ConfiguracoesRemuneracaoVariavel().pontuacaoPaleteFacil,
                PontuacaoPaleteMedio: self.model().ConfiguracoesRemuneracaoVariavel().pontuacaoPaleteMedio,
                PontuacaoPaleteDificil: self.model().ConfiguracoesRemuneracaoVariavel().pontuacaoPaleteDificil,
                ValorPonto: self.model().ConfiguracoesRemuneracaoVariavel().valorPonto().toString().replace('.',','),
                ConsideraValorPonto: consideraValorDoPonto,
                Cota: self.model().ConfiguracoesRemuneracaoVariavel().cotaParaDistribuicao,
                PercentualDesmonte: self.model().ConfiguracoesRemuneracaoVariavel().percentualDesmonte
            }
        });

        request.done(function () {
            $("#AlertRemuneracaoVariavel").empty();
            $("#AlertRemuneracaoVariavel").append(AlertSucesso('Registro atualizado com sucesso'));
        });

        request.fail(function () {
            $('#AlertRemuneracaoVariavel').empty();
            $("#AlertRemuneracaoVariavel").append(AlertErro('Houve um erro ao salvar as configuração da remuneração. Por favor, verifique os valores e tente novamente'));
        });
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});


function AlertSucesso(mensagem) {
    var successProcess = "<div class=\"alert alert-success alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + mensagem + "</div>";

    return successProcess;
}

function AlertErro(mensagem) {
    var errorProcessAlert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div> " + mensagem + "</div>";

    return errorProcessAlert;
}

function BuscarPenalidades() {
    var cookie = $.cookie('token');
    $.ajax({
        type: 'GET',
        url: 'http://' +
            window.location.hostname +
            ':8001/wms/api-gateway/remuneracao-variavel/penalidade',
        headers: { "Authorization": cookie }
    }).done(function (resposta) {
        contextoAplicadorPenalidades.model().Penalidades(resposta.data);
   }.bind(this));
}