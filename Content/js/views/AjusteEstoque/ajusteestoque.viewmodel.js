var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.AjusteEstoqueModel = Class.extend({
	init: function () {
		this.Id = ko.observable();
		this.Armazem = ko.observable();
		this.ItemCodigo = ko.observable();
		this.ItemDescricao = ko.observable();
		this.EnderecoCodigo = ko.observable();
		this.DataExpiracao = ko.observable();
		this.Quantidade = ko.observable();
		this.QuantidadeInformada = ko.observable();
		this.Usuario = ko.observable();
		this.Data = ko.observable();
		this.Diferenca = ko.observable();
	},
	clear: function () {
		this.Id('');
		this.Armazem('');
		this.ItemCodigo('');
		this.ItemDescricao('');
		this.EnderecoCodigo('');
		this.DataExpiracao('');
		this.Quantidade('');
		this.QuantidadeInformada('');
		this.Usuario('');
		this.Data('');
		this.Diferenca('');
	},
	load: function (model) {
		this.Id(model.Id);
		this.Armazem(model.Armazem);
		this.ItemCodigo(model.ItemCodigo);
		this.ItemDescricao(model.ItemDescricao);
		this.EnderecoCodigo(model.EnderecoCodigo);
		this.DataExpiracao(model.DataExpiracao);
		this.Quantidade(model.Quantidade);
		this.QuantidadeInformada(model.QuantidadeInformada);
		this.Usuario(model.Usuario);
		this.Data(model.Data);
		this.Diferenca(model.Diferenca);
		var self = this;
	}
});

hbsis.wms.settings.AjusteEstoqueViewModel = hbsis.wms.CrudForm.extend({
	startDate: moment(),
	endDate: moment(),
	urlGetItemsConfered: "",
	init: function (opts) {
		this._super(opts);
		var start = hbsis.wms.Helpers.querystring('startDate');
		if (start) {
			this.startDate = moment(start, 'DD/MM/YYYY');
		}

		var end = hbsis.wms.Helpers.querystring('endDate');
		if (end) {
			this.endDate = moment(end, 'DD/MM/YYYY');
		}

		this.initDatetimeRangePicker("#reportrange");
	},
	initDatetimeRangePicker: function (field) {
		var self = this;
		hbsis.wms.Helpers.initDatetimeRangePicker({
			field: field,
			config: {
				startDate: self.startDate,
				endDate: self.endDate
			},
			callback: function (start, end) {
				var startDate = start.format(resources.get('SmallDateFormat'));
				var endDate = end.format(resources.get('SmallDateFormat'));

				if (self.startDate !== startDate) {
					self.startDate = startDate;
					self.dirty(true);
				}
				if (self.endDate !== endDate) {
					self.endDate = endDate;
					self.dirty(true);
				}
				self.refreshDatatable();
			}
		});
	},
	clearSaveForm: function () {
		this._super();
	},
	createModel: function () {
		return ko.observable(new hbsis.wms.settings.AjusteEstoqueModel());
	},
	getModelDescription: function (model) {
		return model.NumeroRecebimento;
	},
	filterChange: function () {
		var self = this;
		self.dirty(true);
		self.refreshDatatable();
	},
	getFormData: function () {
		var self = this;
		return $.toDictionary(ko.toJS(this.model()));
	},
	getDatatableConfig: function () {
		var self = this;
		return {
			"fnServerParams": function (aoData) {
				aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
				aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
			},

			"aoColumns": [
			  { "mData": "Armazem" },
			  { "mData": "ItemCodigo" },
			  { "mData": "ItemDescricao" },
			  { "mData": "CodigoEndereco" },
			  { "mData": "DataExpiracao" },
			  { "mData": "Quantidade" },
			  { "mData": "QuantidadeInformada" },
			  { "mData": "Diferenca" },
			  { "mData": "Usuario" },
			  { "mData": "Data" }
			],
			"aoColumnDefs": [
				{
					"aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false
				},
				{
					"aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false
				},
				{
					"aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false
				},
				{
					"aTargets": [3], "mData": null, "bSortable": true, "bSearchable": false
				},
				{
					"aTargets": [4], "mData": null, "bSortable": true, "bSearchable": false
				},
				{
					"aTargets": [5], "mData": null, "bSortable": false, "bSearchable": false
				},
				{
					"aTargets": [6], "mData": null, "bSortable": false, "bSearchable": false
				},
				{
					"aTargets": [7], "mData": null, "bSortable": true, "bSearchable": false
				},
				{
					"aTargets": [8], "mData": null, "bSortable": true, "bSearchable": false
				},
				{
					"aTargets": [9], "mData": null, "bSortable": false, "bSearchable": false
				}
			]
		};
	}
});