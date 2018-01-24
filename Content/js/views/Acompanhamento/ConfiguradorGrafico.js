function ConfiguracaoGrafico() {
	this.amCharts = {
		"type": "serial",
		graphs: [],
		"valueAxes": [{
			"stackType": "regular",
			"axisAlpha": 0.5,
			"gridAlpha": 0
		}],
		"rotate": true,
		"categoryAxis": {
			"gridPosition": "start",
			"axisAlpha": 0,
			"gridAlpha": 0,
			"position": "left"
		}
	};
}

ConfiguracaoGrafico.prototype = {
	obterConfiguracoes: function() {
		return this.amCharts;
	},

	definirDados: function(dados) {
		this.amCharts.dataProvider = dados;
	},

	definirCategoria: function(classificador) {
		this.amCharts.categoryField = classificador;
	},

	definirColuna: function (tarefa) {
	    var expressaoTextual = tarefa.EhSetup ? "" : tarefa.DescricaoTamanho;
	    var descricaoProcesso = resources.get(tarefa.Processo);
	    var textoBalao = tarefa.EhSetup
            ? "<b><span style='color:#7a81be'>[[title]]</b></span><br><span style='font-size:12px'>Deslocamento: <b>" + tarefa.DescricaoTamanho + "</b></span>"
            : this._montarDescricaoTarefa(descricaoProcesso, tarefa);
        this.amCharts.graphs.push({
		    "balloonText": textoBalao,
			"fillAlphas": 2.8,
			"borderColor": "#333",
			"borderAlpha": 2.5,
            "plotAreaBorderAlpha":2.5,
            "plotAreaBorderColor": "#333",
            "lineColor": "#000",
            "labelText": expressaoTextual,
			"lineAlpha": 1.3,
			"title": "",
			"type": "column",
			"fillColors": this.obterCorProcesso(tarefa.Processo),
		    "valueField": tarefa.Id
		});
	},

	obterCorProcesso: function (processo) {
        if (processo == "loading") {
            return "#009BA8";
        }
        if (processo == "loading.bulk") {
            return "#146EB4";
        }
        return "#FFF";
    },

    limparColunas: function() {
        this.amCharts.graphs.length = 0;
    },

    _montarDescricaoTarefa: function (descricaoProcesso, tarefa) {
        return "<div class=\"texto-balao\">" + descricaoProcesso + "</div>" +
               "<div class=\"texto-balao\"> Tarefa:" + tarefa.NumeroTarefa + " Mapa: " + tarefa.NumeroDocumento + "</div>" +
               "<div class=\"texto-balao\" >" + tarefa.DescricaoPalete + "</div>" +
               "<div class=\"texto-balao\">" + tarefa.DescricaoTamanho + "</div>";
    }
};