function GerenciadorGrafico(url, container) {
	this.url = url;
	this.container = container;
    this.totalEquipamentos = 0;
	this.configuracoesGrafico = new ConfiguracaoGrafico();
}

GerenciadorGrafico.prototype = {
	gerarGrafico: function() {
	    this.configuracoesGrafico.definirCategoria("equipamento");

	    this._inicializarGrafico();
	    setInterval(this._inicializarGrafico.bind(this), 10000);
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
	    this.totalEquipamentos = dados.length;
	    this.configuracoesGrafico.limparColunas();

	    var dadosTratados = [];
	    dados.map(function (planejamentoParaUsuario, indice) {
	        var descricaoUsuario = planejamentoParaUsuario.NomeUsuario + " (" + planejamentoParaUsuario.NomeEquipamento + ")";
		    var linhaGrafico = { "equipamento": descricaoUsuario };
		    planejamentoParaUsuario.TarefasPlanejadas.map(function (tarefa, indice) {
		        linhaGrafico[tarefa.Id] = tarefa.TamanhoEmMinutos;
		        this.configuracoesGrafico.definirColuna(tarefa);
		    }.bind(this));

		    dadosTratados.push(linhaGrafico);
		}.bind(this));

	    return dadosTratados;
	},

	_atualizarGrafico: function () {
	    var configuracoes = this.configuracoesGrafico.obterConfiguracoes();
	    if (configuracoes.dataProvider.length === 0) {
	        $("#" + this.container).text("Nenhum login logado no Task Interleaving.");
	        return;
	    }

	    AmCharts.makeChart(this.container, configuracoes);
	    document.getElementById(this.container).style.height = this.totalEquipamentos * 200 + "px";
	}
};