var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.BloqueioEstoqueModel = Class.extend({
    init: function () {
        this.CodigoEndereco = ko.observable();
        this.Codigo = ko.observable();
        this.Descricao = ko.observable();
        this.Quantidade = ko.observable();
    },
    clear: function () {
        this.CodigoEndereco('');
        this.Codigo('');
        this.Descricao('');
        this.Quantidade(0);
    },
    load: function (model) {
        this.CodigoEndereco(model.CodigoEndereco);
        this.Codigo(model.Codigo);
        this.Descricao(model.Descricao);
        this.Quantidade(model.Quantidade);

        var self = this;
    }
});

hbsis.wms.settings.BloqueioEstoqueViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    motivo: ko.observable(""),
    urlGetItemsConfered: "",
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.BloqueioEstoqueModel());
    },
    getModelDescription: function (model) {
        return model.CodigoItem;
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
                aoData.push({ "name": "Motivo", "value": self.motivo() });
                aoData[4].value = 99999;
                console.log(self.datatable);
            },

            "aoColumns": [
              { "mData": "CodigoEndereco" },
              { "mData": "Codigo" },
              { "mData": "Descricao" },
              { "mData": "Quantidade" }
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
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return Number(row.Quantidade).toFixed(2);
                    }
                }
            ]
        };
    }
});