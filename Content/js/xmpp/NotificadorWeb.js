"use strict";
var NotificadorWeb = function () {};
NotificadorWeb.prototype = {
    notificarLeitura: function (usuarioId, mensagemId) {
        var urlBase = "http://" + window.location.hostname + ":8001";
        var token = $.cookie('token');
        $.ajax({
            type: 'POST',
            url: urlBase + '/wms/api-gateway/notificacoes/mensagem/confirmar-leitura/',
            data: {
                UsuarioId: usuarioId,
                MensagemId: mensagemId
            },
            crossDomain: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            }
        })
            .done(function () {
                PubSub.publish('notificacoes-leitura-confirmada');
            })
            .fail(function (erro) {
                console.log("falha", erro);
            });
    },
    criarDisplayNotificacao: function (mensagemId, usuarioId, titulo, mensagem) {
        var ctx = this;
        var display = '<div class="modal fade colored-header" data-backdrop="static" id="notificacao-' + mensagemId + '"  role="dialog"><div class="modal-dialog modal-lg" role="document"><div class="' +
                'modal-content"><div class="modal-header"><button type="button" class="close" dat' +
                'a-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></bu' +
                'tton><h4 class="modal-title">' + titulo + '</h4></div><div class="modal-body">' + mensagem + '</div><div class="modal-footer"><button type="button" class="btn btn-default" da' +
                'ta-dismiss="modal" id="btn-notificador-' + mensagemId + '">Confirmar leitura</button></div></div></div></div>';

        $('#notificador').append(display);
        $('#notificacao-' + mensagemId).modal('show');
        $('#notificacao-' + mensagemId).on("hidden.bs.modal", function () {
            $('#notificacao-' + mensagemId).remove();
            ctx.notificarLeitura(usuarioId, mensagemId);
        });
    }
};