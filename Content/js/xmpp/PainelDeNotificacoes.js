$(function () {
    "use strict";

    var btnVerificarNotificacoes = $("#btnVerificarNotificacoes");
    var displayNotificador = new NotificadorWeb();
    var usuarioId = $.cookie('xmpp').split('|')[3];
    var urlBase = "http://" + window.location.hostname + ":8001";
    var token = $.cookie('token');
    var painelLargura = 450;

    var legendarStatus = function (status) {
        if (status === 3)
            return 'Lido';
        return 'Não lido';
    };

    var criarLinhaNotificacao = function (displayNotificador, mensagemId, usuarioId, titulo, conteudo, status) {
        var linkNotificacao = $('<a href="#"><div class="alert' + (status === 3 ? " bg-info" : " bg-warning") + ' "><div class="row"><div class="col-md-8">' + titulo + '</div><div class="col-md-4">' + legendarStatus(status) + '</div></div></div> </a>');

        linkNotificacao.on('click', function (e) {
            displayNotificador.criarDisplayNotificacao(mensagemId, usuarioId, titulo, conteudo);
        });

        return linkNotificacao;
    };

    var criarDisplay = function (largura, alinhamentoEsquerdo) {
        var overlayNotificador = $('<div id="overlay-notificador"></div>');
        var notificador = $('<div id="painel-notificacoes"></div>');
        var titulo = $('<div><h4>Notificações</h4><div class="row"><div class="col-md-8"><strong>Título</strong></div> <div class="col-md-4"><strong>Status</strong></div></div><hr/></div>');
        var painelNotificacoes = $('<div id="painel-notificacoes-container"></div>');
        var painelNotificacoesLista = $('<div id="painel-notificacoes-lista"></div>');

        notificador.css({
            top: 55,
            left: (alinhamentoEsquerdo - largura),
            width: largura
        });

        overlayNotificador.on('click', function (e) {
            e.preventDefault();
            if (e.target === overlayNotificador[0]) {
                overlayNotificador.empty();
                overlayNotificador.remove();
            }
        });


        painelNotificacoes.append(titulo);
        painelNotificacoes.append(painelNotificacoesLista);

        notificador.append(painelNotificacoes);
        overlayNotificador.append(notificador);
        $('body').append(overlayNotificador);

        return painelNotificacoesLista;
    };

    PubSub.subscribe('notificacoes-leitura-confirmada', function () {
        var painelNotificacoes = $('#painel-notificacoes-lista');
        painelNotificacoes.empty();
        buscarMensagensVigentes(painelNotificacoes);

    });

    $(window).resize(function () {
        var btnVerificarNotificacoes = $("#btnVerificarNotificacoes");
        var alinhamentoEsquerdo = btnVerificarNotificacoes.offset().left + btnVerificarNotificacoes.width();

        $('#painel-notificacoes')
            .css({
                top: 55,
                left: alinhamentoEsquerdo - painelLargura,
                width: painelLargura
            });
    });

    var buscarMensagensVigentes = function (painelNotificoes) {
        var token = $.cookie('token');
        $.ajax({
                type: 'GET',
                url: urlBase + '/wms/api-gateway/notificacoes/mensagem/mensagens-usuario/' + usuarioId,
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token)
                }
            })
            .done(function (notificacoes) {
                notificacoes.data.map(function(notificacao){
                    adicionarNotificacoes(painelNotificoes, notificacao.mensagemId, notificacao.usuarioId, notificacao.titulo, notificacao.conteudo, notificacao.status);
                });
            })
            .fail(function (erro) {
                console.log("falha", erro);
            });
    };

    var adicionarNotificacoes = function (notificador, mensagemId, usuarioId, titulo, corpo, status) {
        notificador.append(criarLinhaNotificacao(displayNotificador, mensagemId, usuarioId, titulo, corpo, status));
    }

    btnVerificarNotificacoes.on('click', function (evento) {
        evento.preventDefault();
        var retanguloBotao = evento.currentTarget.getBoundingClientRect();
        var alinhamentoEsquerdo = retanguloBotao.left + (retanguloBotao.width / 2);
        var painelNotificacoes = criarDisplay(painelLargura, alinhamentoEsquerdo);
        buscarMensagensVigentes(painelNotificacoes);
    });

});