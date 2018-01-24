var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.EntradaSaidaModel = Class.extend({
    init: function () {
        this.CodigoArmazem = ko.observable();
        this.Descricao = ko.observable();
        this.Quantidade = ko.observable();
        this.EhEntrada = ko.observable();
    },
    clear: function () {
        this.CodigoArmazem('');
        this.Descricao('');
        this.Quantidade(0);
        this.EhEntrada('');
    },
    load: function (model) {
        this.CodigoArmazem(model.CodigoArmazem);
        this.Descricao(model.Descricao);
        this.Quantidade(model.Quantidade);
        this.EhEntrada(model.EhEntrada);

        var self = this;
    }
});

hbsis.wms.settings.EntradaSaidaViewModel = hbsis.wms.CrudForm.extend({
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
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.EntradaSaidaModel());
    },
    getModelDescription: function (model) {
        return model.Descricao;
    },
    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "bFilter": false,
            "bPaginate": false,
            "iDisplayLength": 99999,
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
                aoData[4].value = 99999;
            },

            "aoColumns": [
              { "mData": "CodigoArmazem" },
              { "mData": "Descricao" },
              { "mData": "Quantidade" },
              { "mData": "EhEntrada" }
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
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.EhEntrada)
                            return 'Entrada';
                        return "Saída";
                    }
                }
            ]
        };
    }
});