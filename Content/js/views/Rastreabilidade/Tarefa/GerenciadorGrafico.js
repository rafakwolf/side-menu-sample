function GerenciadorGrafico(url, container) {
	this.url = url;
	this.container = container;
    this.totalUsuario = 0;
	this.configuracoesGrafico = new ConfiguracaoGrafico();
}

GerenciadorGrafico.prototype = {
	gerarGrafico: function() {
	    this.configuracoesGrafico.definirCategoria("login");

	    this._inicializarGrafico();

	    setInterval(this._inicializarGrafico.bind(this), 60000);
	},

    _inicializarGrafico: function() {
        this._obterDados().done(function () {
            this._atualizarGrafico();
        }.bind(this));
    },

	_obterDados: function() {
		return $.get(this.url)
			.done(function (data) {
				var dados = this._tratarDados(data);
				this.configuracoesGrafico.definirDados(dados);
			}.bind(this));
	},

	_tratarDados: function (dados) {
	    this.totalUsuario = dados.length;
	    this.configuracoesGrafico.limparColunas();

	    var dadosTratados = [];
	    dados.map(function (rastreabilidade, indice) {
	        var linhaGrafico = { "usuario": rastreabilidade.Usuario };

	        rastreabilidade.Dados.map(function (tarefa, indice) {
	            linhaGrafico[tarefa.IdEvento] = tarefa.Esforco;
	            this.configuracoesGrafico.definirColuna(tarefa);
	        }.bind(this));

	        dadosTratados.push(linhaGrafico);
	    }.bind(this));

	    return dadosTratados;
	},

	_atualizarGrafico: function () {
	    var configuracoes = this.configuracoesGrafico.obterConfiguracoes();
	    AmCharts.makeChart(this.container, configuracoes);
	    document.getElementById(this.container).style.height = this.totalUsuario * 240 + "px";
	}
};