var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RelatorioModel = Class.extend({
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

hbsis.wms.settings.RelatorioViewModel = hbsis.wms.CrudForm.extend({
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
        return ko.observable(new hbsis.wms.settings.RelatorioModel());
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
                    { "mData": "NumeroDocumento" },
                    { "mData": "DescricaoPalete" },
                    { "mData": "ItemCodigo" },
                    { "mData": "DescricaoItem" },
                    { "mData": "DescricaoUnidadeMedida" },
                    { "mData": "QuantidadeEsperada" },
                    { "mData": "QuantidadeReal" },
                    { "mData": "Usuario" },
                    { "mData": "Balanca" },
                    { "mData": "PesoEsperado" },
                    { "mData": "PesoReal" },
                    { "mData": "QuantidadeChapatex" },
                    { "mData": "QuantidadePapelao" },
                    { "mData": "Tipo" },
                    { "mData": "NomeAtivoGiro" },
                    { "mData": "UtilizaRtls" },
                    { "mData": "DataHora" }
            ], "aoColumnDefs": [
            {
                "aTargets": [0],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.NumeroDocumento;
                }
            },
            {
                "aTargets": [1],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DescricaoPalete == null)
                        return "-";
                    return row.DescricaoPalete;
                }
            },
            {
                "aTargets": [2],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DescricaoItem == null)
                        return "-";
                    return row.DescricaoItem;
                }
            },
            {
                "aTargets": [3],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.ItemCodigo == null)
                        return "-";
                    return row.ItemCodigo;
                }
            },
            {
                "aTargets": [4],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DescricaoUnidadeMedida == null)
                        return "-";
                    return row.DescricaoUnidadeMedida;
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
                    if (row.Usuario == null)
                        return "-";
                    return row.Usuario;
                }
            },
            {
                "aTargets": [8],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.Balanca == null)
                        return "-";
                    return row.Balanca;
                }
            },
            {
                "aTargets": [09],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.PesoEsperado == null || row.PesoEsperado == "")
                        return "-";
                    return row.PesoEsperado.toLocaleString();;
                }
            },
            {
                "aTargets": [10],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.PesoReal == null)
                        return "-";
                    return row.PesoReal.toLocaleString();
                }
            },
            {
                "aTargets": [11],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.QuantidadeChapatex == null)
                        return "-";
                    return row.QuantidadeChapatex;
                }
            },
            {
                "aTargets": [12],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.QuantidadePapelao == null)
                        return "-";
                    return row.QuantidadePapelao;
                }
            },
            {
                "aTargets": [13],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.Tipo == null)
                        return "-";
                    return row.Tipo;
                }
            },
                {
                    "aTargets": [14],
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        if (row.NomeAtivoGiro == null)
                            return "-";
                        return row.NomeAtivoGiro;
                    }
                },
            {
                "aTargets": [15],
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.UtilizaRtls)
                        return "OK";
                    else
                        return "NOK";
                }
            },
            {
                "aTargets": [16],
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DataHora == null)
                        return "-";
                    return moment(row.DataHora).format("DD/MM/YYYY HH:mm:ss");
                }
            },
            ]
        };
    }
});