var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.FechamentoLinhaModel = Class.extend({
    init: function () {
        this.QuantidadeAbastecimentoRealizado = ko.observable();
        this.PercentualAbastecimentoRealizado = ko.observable();
        this.QuantidadePerdasLogisticaEntrada = ko.observable();
        this.PercentualPerdasLogisticaEntrada = ko.observable();
        this.ItensFechamento = ko.observableArray([]);
    },
    clear: function () {
        this.QuantidadeAbastecimentoRealizado('');
        this.PercentualAbastecimentoRealizado('');
        this.QuantidadePerdasLogisticaEntrada('');
        this.PercentualPerdasLogisticaEntrada('');
        this.ItensFechamento([]);
    },
    load: function (model) {
        this.QuantidadeAbastecimentoRealizado(model.QuantidadeAbastecimentoRealizado);
        this.PercentualAbastecimentoRealizado(model.PercentualAbastecimentoRealizado);
        this.QuantidadePerdasLogisticaEntrada(model.QuantidadePerdasLogisticaEntrada);
        this.PercentualPerdasLogisticaEntrada(model.PercentualPerdasLogisticaEntrada);
        for (var i = 0; i < model.ItensFechamentoLinha.length; i++) {
            var item = new hbsis.wms.settings.ItensFechamentoLinhaModel();
            item.load(model.ItensFechamentoLinha[i]);
            this.ItensFechamento().push(item);
        }
    }
});

hbsis.wms.settings.ItensFechamentoLinhaModel = Class.extend({
    init: function () {
        this.LinhaProducao = ko.observable();
        this.SKU = ko.observable();
        this.Endereco = ko.observable();
        this.Lote = ko.observable();
        this.Status = ko.observable();
        this.QuantidadeCaixa = ko.observable();
        this.QuantidadePalete = ko.observable();
    },
    clear: function () {
        this.LinhaProducao('');
        this.SKU('');
        this.Endereco('');
        this.Lote('');
        this.Status('');
        this.QuantidadeCaixa('');
        this.QuantidadePalete('');
    },
    load: function (model) {
        this.LinhaProducao(model.LinhaProducao);
        this.SKU(model.SKU);
        this.Endereco(model.Endereco);
        this.Lote(model.Lote);
        this.Status(model.Status);
        this.QuantidadeCaixa(model.QuantidadeCaixa);
        this.QuantidadePalete(model.QuantidadePalete);
    }
});

hbsis.wms.settings.FechamentoLinhaViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    motivo: ko.observable(""),
    relatorio: ko.observable(),
    urlDetalhe: "",
    carregarRelatorio: function (relatorio) {
        this.relatorio(relatorio);
    },
    init: function (opts) {
        this._super(opts);
        this.urlDetalhe = this.settings.urlDetalhe;

        hbsis.wms.Helpers.initDatetimePicker({
            id: "#Inicio",
            config: {
                format: 'dd/mm/yyyy HH:ii',
                autoclose: true,
                todayHighlight: true,
                startDate: new Date(),
                language: resources.get('DatetimePicker.Language')
            }
        });

        hbsis.wms.Helpers.initDatetimePicker({
            id: "#Fim",
            config: {
                format: 'dd/mm/yyyy hh:ii',
                autoclose: true,
                todayHighlight: true,
                startDate: new Date(),
                language: resources.get('DatetimePicker.Language')
            }
        });

        var start = moment().startOf('month');
        if (start) {
            this.startDate = moment(start, 'DD/MM/YYYY');
        }

        var end = moment().endOf('month');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        this.initDatetimeRangePicker("#reportrange");
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.FechamentoLinhaModel());
    },
    getModelDescription: function (model) {
        return model.CodigoItem;
    },
    edit: function (model) {
        var uriget = this.urlDetalhe + '?id=' + model.Id;

        $.get(uriget, function (data) {
            $("#modal-detalhes-partial").html(data);
            $("#modal-detalhes").modal();
        });
        return;
    },
    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            //"bFilter": false,
            //"bPaginate": false,
            //"iDisplayLength": 99999,
            //"fnServerParams": function (aoData) {

            //},
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "CodigoArmazem" },
                { "mData": "LinhaProducaoCodigo" },
                { "mData": "LinhaProducao" },
                { "mData": "Inicio" },
                { "mData": "Fim" },
                { "mData": "UsuarioCadastro" },
                { "mData": "DataCadastro" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [6], "mData": null, "bSortable": false, "bSearchable": false
                },
                {
                    "aTargets": [7],
                    "mData": null,
                    "sDefaultContent": self.settings.editMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
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

                if (self.startDate != startDate) {
                    self.startDate = startDate;
                    self.dirty(true);
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                    self.dirty(true);
                }

                self.refreshDatatable();
            }
        });
    },
    //getDatatableConfig: function () {
    //    var self = this;
    //    return {
    //        "bFilter": false,
    //        "bPaginate": false,
    //        "iDisplayLength": 99999,
    //        "fnServerParams": function (aoData) {

    //        },

    //        "aoColumns": [
    //          { "mData": "LinhaProducao" },
    //          { "mData": "SKU" },
    //          { "mData": "Endereco" },
    //          { "mData": "Lote" },
    //          { "mData": "Status" },
    //          { "mData": "QuantidadeCaixa" },
    //          { "mData": "QuantidadePalete" }
    //        ],
    //        "aoColumnDefs": [
    //            {
    //                "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [2], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [5], "mData": null, "bSortable": false, "bSearchable": false
    //            },
    //            {
    //                "aTargets": [6], "mData": null, "bSortable": false, "bSearchable": false
    //            }
    //        ]
    //    };
    //}
});