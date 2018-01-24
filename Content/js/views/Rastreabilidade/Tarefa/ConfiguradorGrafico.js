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
    obterConfiguracoes: function () {
        return this.amCharts;
    },

    definirDados: function (dados) {
        this.amCharts.dataProvider = dados;
    },

    definirCategoria: function (classificador) {
        this.amCharts.categoryField = classificador;
    },

    definirColuna: function (tarefa) {
        var expressaoTextual = "";
        var textoBalao = this._montarDescricaoTarefa(tarefa);
        this.amCharts.graphs.push({
            "balloonText": textoBalao,
            "fillAlphas": 0.8,
            "labelText": tarefa.Esforco + " (min)",
            //"lineAlpha": 0.3,
            //"title": "",
            "type": "column",
            "borderColor": "#333",
            "borderAlpha": 2.5,
            "plotAreaBorderAlpha": 2.5,
            "plotAreaBorderColor": "#333",
            "lineColor": "#000",
            //"labelText": expressaoTextual,
            "lineAlpha": 1.3,
            "title": "",
            //"type": "column",
            //"lineColor": tarefa.UltimoEvento == null ? "#FFF" : null,
            "fillColors": this.obterCorProcesso(tarefa.Processo),
            "valueField": tarefa.IdEvento
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

    limparColunas: function () {
        this.amCharts.graphs.length = 0;
    },

    _montarDescricaoTarefa: function (tarefa) {
        if (tarefa.UltimoEvento == null) {
            return "<div class=\"texto-balao\"> Tempo sem estar associado a nenhuma tarefa. </br>" +
                " Esfor&ccedil;o: " +
                tarefa.Esforco + "(min)" +
                "</div>";
        } else {
            return "<div class=\"texto-balao\"> Evento : " + tarefa.UltimoEvento + "</div>"+
                   "<div class=\"texto-balao\"> Esfor&ccedil;o: " + tarefa.Esforco + " (min)</div>" +
                   "<div class=\"texto-balao\"> Mapa: " + tarefa.NumeroDocumento + " - "  + tarefa.DescricaoPalete + " </div>";
        }

    }
};