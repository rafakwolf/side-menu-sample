var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.OrderReceiptModel = Class.extend({
    init: function () {

    },
    clear: function () {

    },
    load: function (model) {
        if (!model)
            return;

        var self = this;
    }
});

hbsis.wms.settings.OcorrenciaSeparacaoPorPesoViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

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
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.OrderReceiptModel());
    },
    getModelDescription: function (model) {
        return model.body;
    },
    clearSaveForm: function () {
        this._super();

    },
    edit: function (model) {
        this._super(model);

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
                    { "mData": "NumeroOrdem" },
                    { "mData": "DescricaoPalete" },
                    { "mData": "CodItem" },
                    { "mData": "DescricaoItem" },
                    { "mData": "QuantidadeEsperada" },
                    { "mData": "QuantidadeReal" },
                    { "mData": "UnidadeMedida" },
                    { "mData": "Usuario" },
                    { "mData": "Balanca" },
                    { "mData": "PesoEsperado" },
                    { "mData": "PesoReal" },
                    { "mData": "TipoPaleteEChapatex" },
                    { "mData": "TipoOcorrencia" },
                    { "mData": "DataHora" }

            ], "aoColumnDefs": [
            {
                "aTargets": [3],
                "bSortable": true,
                "bSearchable": true,
                "mRender": function (data, type, row) {
                    if (row.CodItem == null)
                        return "-";
                    return row.CodItem;
                }
            },
            {
                "aTargets": [4],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DescricaoItem == null)
                        return "-";
                    return row.DescricaoItem;
                }
            },
            {
                "aTargets": [5],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.QuantidadeEsperada == null)
                        return "-";
                    return row.QuantidadeEsperada;
                }
            },
            {
                "aTargets": [6],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.QuantidadeReal == null)
                        return "-";
                    return row.QuantidadeReal;
                }
            },
            {
                "aTargets": [7],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.UnidadeMedida == null)
                        return "-";
                    return row.UnidadeMedida;
                }
            },
            {
                "aTargets": [9],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.Balanca == null)
                        return "-";
                    return row.Balanca;
                }
            },
            {
                "aTargets": [10],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.PesoEsperado == null)
                        return "-";
                    return row.PesoEsperado;
                }
            },
            {
                "aTargets": [11],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.PesoReal == null)
                        return "-";
                    return row.PesoReal;
                }
            },
            {
                "aTargets": [12],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.TipoPaleteEChapatex == null)
                        return "-";
                    return row.TipoPaleteEChapatex;
                }
            },
            {
                "aTargets": [14],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DataHora == null)
                        return "-";
                    return moment(row.DataHora).format("DD/MM/YYYY HH:mm:ss");
                }
            }
            ]
        };
    }
});