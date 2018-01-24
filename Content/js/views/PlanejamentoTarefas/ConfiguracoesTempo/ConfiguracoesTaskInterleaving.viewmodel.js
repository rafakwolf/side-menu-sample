var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

var _opts;
var Id;
var totalCarregamento;
var totalPuxada;
var totalRetornoRota;
var carregamentoPaleteFechado;
var carregamentoPaleteMisto;
var puxadaDescarregamento;
var retornoRotaDescarregamento;

hbsis.wms.settings.ConfiguracoesTaskInterleavingModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
	    this.TempoPuxadaDescarregamento = ko.observable();
	    this.TempoPuxada = ko.observable();
	    this.TempoCarregamento = ko.observable();
	    this.TempoCarregamentoPaleteFechado = ko.observable();
	    this.TempoCarregamentoPaleteMisto = ko.observable();
	    this.TempoRetornoRota = ko.observable();
	    this.TempoRetornoRotaDescarregamento = ko.observable();
	},
    clear: function () {
	    this.TempoPuxadaDescarregamento('');
	    this.TempoPuxada('');
	    this.TempoCarregamento('');
	    this.TempoCarregamentoPaleteFechado('');
	    this.TempoCarregamentoPaleteMisto('');
	    this.TempoRetornoRota('');
	    this.TempoRetornoRotaDescarregamento('');
	},
    load: function (model) {
        Id = model.Id;
	    totalCarregamento = model.TempoCarregamento;
	    totalPuxada = model.TempoPuxada;
	    totalRetornoRota = model.TempoRetornoRota;
	    carregamentoPaleteFechado = model.TempoCarregamentoPaleteFechado;
	    carregamentoPaleteMisto = model.TempoCarregamentoPaleteMisto;
	    puxadaDescarregamento = model.TempoPuxadaDescarregamento;
	    retornoRotaDescarregamento = model.TempoRetornoRotaDescarregamento;

	    this.Id(model.Id);
	    this.TempoPuxadaDescarregamento(model.TempoPuxadaDescarregamento);
	    this.TempoPuxada(model.TempoPuxada);
	    this.TempoCarregamento(model.TempoCarregamento);
	    this.TempoCarregamentoPaleteFechado(model.TempoCarregamentoPaleteFechado);
	    this.TempoCarregamentoPaleteMisto(model.TempoCarregamentoPaleteMisto);
	    this.TempoRetornoRota(model.TempoRetornoRota);
	    this.TempoRetornoRotaDescarregamento(model.TempoRetornoRotaDescarregamento);
	}
});

hbsis.wms.settings.ConfiguracoesTaskInterleavingViewModel = hbsis.wms.CrudForm.extend({
	startDate: moment(),
	endDate: moment(),
	init: function (opts) {
	    _opts = opts;
	    this._super(opts);
	    var self = this;
	    $.get('http://' + window.location.hostname + ':8001/wms/api-gateway/task-interleaving/configuracoes/' + opts.armazemId, function (resposta) {
	        $("#TempoCarregamento").val(resposta.data.tempoCarregamento);
	        $("#TempoPuxada").val(resposta.data.tempoPuxada);
	        $("#TempoRetornoRota").val(resposta.data.tempoRetornoRota);
	        $("#TempoCarregamentoPaleteFechado").val(resposta.data.tempoCarregamentoPaleteFechado);
	        $("#TempoCarregamentoPaleteMisto").val(resposta.data.tempoCarregamentoPaleteMisto);
	        $("#TempoPuxadaDescarregamento").val(resposta.data.tempoPuxadaDescarregamento);
	        $("#TempoRetornoRotaDescarregamento").val(resposta.data.tempoRetornoRotaDescarregamento);

	        totalCarregamento = resposta.data.tempoCarregamento;
	        totalPuxada = resposta.data.tempoPuxada;
	        totalRetornoRota = resposta.data.tempoRetornoRota;
	        carregamentoPaleteFechado = resposta.data.tempoCarregamentoPaleteFechado;
	        carregamentoPaleteMisto = resposta.data.tempoCarregamentoPaleteMisto;
	        puxadaDescarregamento = resposta.data.tempoPuxadaDescarregamento;
	        retornoRotaDescarregamento = resposta.data.tempoRetornoRotaDescarregamento;
	    });
	},
	createModel: function () {
	    return ko.observable(new hbsis.wms.settings.ConfiguracoesTaskInterleavingModel());
	},
	edit: function (model) {
	    this._super(model);

	    $("#TempoCarregamento").val($("#TempoCarregamento").val());
	    $("#TempoPuxada").val($("#TempoPuxada").val());
	    $("#TempoRetornoRota").val($("#TempoRetornoRota").val()),
	    $("#TempoCarregamentoPaleteFechado").val($("#TempoCarregamentoPaleteFechado").val()),
	    $("#TempoCarregamentoPaleteMisto").val($("#TempoCarregamentoPaleteMisto").val()),
	    $("#TempoPuxadaDescarregamento").val($("#TempoPuxadaDescarregamento").val());
	    $("#TempoRetornoRotaDescarregamento").val($("#TempoRetornoRotaDescarregamento").val());

	},
	getModelDescription: function (model) {
		return model.body;
	},
	clearSaveForm: function () {
		this._super();
	},
    initDatatable: function() {
        return null;
    },
    salvar: function () {
        //var model = this.model();
        $.ajax({
            dataType: "json",
            type: 'POST',
            url: 'http://' + window.location.hostname + ':8001/wms/api-gateway/task-interleaving/configuracoes/',
            data: {
                ArmazemId: _opts.armazemId,
                TempoCarregamento: $("#TempoCarregamento").val(),
                TempoPuxada: $("#TempoPuxada").val(),
                TempoRetornoRota: $("#TempoRetornoRota").val(),
                TempoCarregamentoPaleteFechado: $("#TempoCarregamentoPaleteFechado").val(),
                TempoCarregamentoPaleteMisto: $("#TempoCarregamentoPaleteMisto").val(),
                TempoPuxadaDescarregamento: $("#TempoPuxadaDescarregamento").val(),
                TempoRetornoRotaDescarregamento: $("#TempoRetornoRotaDescarregamento").val()
            },
            success: function (data) {
            },
            error: function () {
                alert();
            }
        });
    },
    cancelar: function () {
        $("#TempoCarregamento").val(totalCarregamento);
        $("#TempoPuxada").val(totalPuxada);
        $("#TempoRetornoRota").val(totalRetornoRota),
	    $("#TempoCarregamentoPaleteFechado").val(carregamentoPaleteFechado),
	    $("#TempoCarregamentoPaleteMisto").val(carregamentoPaleteMisto),
	    $("#TempoPuxadaDescarregamento").val(puxadaDescarregamento);
        $("#TempoRetornoRotaDescarregamento").val(retornoRotaDescarregamento);
    }
});