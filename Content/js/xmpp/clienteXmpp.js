'use strict';

function ClienteXmpp(usuario, host, servidor) {
    this.usuario = usuario;
    this.host = host;
    this.servidor = servidor;

    if (usuario === undefined || usuario === '') 
        throw 'Usuário xmpp invalido!';
    
    if (host === undefined || host === '') 
        throw 'Host invalido!';
    
    if (servidor === undefined || servidor === '') 
        throw 'Servidor invalido!';
    
    this.urlHttpBind = 'http://' + servidor + '/http-bind/';
    this.jid = usuario + '@' + host;
    this.senha = '@servidor123';
    this.registrarUsuarioXmpp = this.registrarUsuarioXmpp.bind(this);
    this.conectarXmpp = this.conectarXmpp.bind(this);
    this.iniciarClienteXmpp = this.iniciarClienteXmpp.bind(this);
    this.aoRegistrar = this.aoRegistrar.bind(this);
    this.aoConectar = this.aoConectar.bind(this);
    this.aoReceberMensagem = this.aoReceberMensagem.bind(this);
};

ClienteXmpp.prototype = {
    iniciarClienteXmpp: function(){
        try{
            this.conexao = new Strophe.Connection(this.urlHttpBind);
            this.registrarUsuarioXmpp();
            PubSub.subscribe('CONECTAR_XMPP', this.conectarXmpp);
        }catch(erro){
            console.log("Erro ao executar cliente Xmpp: ", erro);
        }
    },
    aoRegistrar: function(status){
        switch (status) {
                case Strophe.Status.REGISTER:
                    this.conexao.register.fields.username = this.usuario;
                    this.conexao.register.fields.password = this.senha;
                    this.conexao.register.submit();
                    break;
                case Strophe.Status.REGISTERED:
                    console.log('usuário registrado');
                    PubSub.publish('CONECTAR_XMPP');
                    break;
                case Strophe.Status.CONFLICT:
                    console.log('usuário ja registrado');
                    PubSub.publish('CONECTAR_XMPP');
                    break;
                case Strophe.status.REGIFAIL:
                    console.log('servidor não suporta In-Band Registration');
                    break;
                default: console.log('default ', status); break;
        }
        
    },
    registrarUsuarioXmpp : function(){
        this.conexao.disconnect();
        this.conexao = new Strophe.Connection(this.urlHttpBind);
        this.conexao.register.connect(this.servidor, this.aoRegistrar, 60, 1);
    },
    aoConectar: function(status){
        switch (status) {
            case Strophe.Status.CONNECTING:
                console.log("Connectando ao servidor xmpp ...");
                break;
            case Strophe.Status.CONNFAIL:
                console.log("falhou ao se connectar ao servidor xmpp.");
                break;
            case Strophe.Status.AUTHFAIL:
                console.log("Não conseguiu autenticar no servidor xmpp.");
                break;
            case Strophe.Status.CONNECTED:
                console.log("conectado ao servidor xmpp.");
                this.conexao.addHandler(this.aoReceberMensagem, null, 'message', null, null, null);
                this.conexao.send($pres());
                break;
            default:
                console.log("erro desconhecido");
                break;
        }
    },
    conectarXmpp: function(){
        this.conexao.disconnect();
        this.conexao = new Strophe.Connection(this.urlHttpBind);
        this.conexao.connect(this.jid, this.senha, this.aoConectar);
    },
    aoReceberMensagem: function(mensagem){
        var corpoMensagem = mensagem.getElementsByTagName('body')[0].innerHTML;
        var notificacao = JSON.parse(corpoMensagem);
        if (notificacao.tipo === undefined) 
            notificacao = JSON.parse(notificacao);
        PubSub.publish(notificacao.tipo, notificacao);
        return true;
    }
}