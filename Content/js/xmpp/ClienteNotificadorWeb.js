$(function () {
    "use strict";

    var iniciarNotificador = function () {
        try {
            if ($.cookie('xmpp') === undefined) 
                return;
            
            var configuracoes = $
                .cookie('xmpp')
                .split('|');

            if (configuracoes.length <= 0) 
                return;
            
            var clienteXmpp = new ClienteXmpp(configuracoes[0], configuracoes[1], configuracoes[2]);
            var notificador = new NotificadorWeb();

            clienteXmpp.iniciarClienteXmpp();

            PubSub.subscribe('launcher.notificacoes', function (topico, registro) {
                var registroMensagem = JSON.parse(registro.data);
                notificador.criarDisplayNotificacao(registroMensagem.mensagemId, registroMensagem.usuarioId, registroMensagem.titulo, registroMensagem.mensagem);
            });
        } catch (erro) {
            console.log('Erro ao iniciar Notificador Web: ', erro);
        }
    };

    iniciarNotificador();
});