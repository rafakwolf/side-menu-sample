var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.DataValidadeModel = Class.extend({
    init: function () {
        this.CodigoArmazem = ko.observable();
        this.Codigo = ko.observable();
        this.Descricao = ko.observable();
        this.Quantidade = ko.observable();
    },
    clear: function () {
        this.CodigoArmazem('');
        this.Codigo('');
        this.Descricao('');
        this.Quantidade(0);
    },
    load: function (model) {
        this.CodigoArmazem(model.CodigoArmazem);
        this.Codigo(model.Codigo);
        this.Descricao(model.Descricao);
        this.Quantidade(model.Quantidade);

        var self = this;
    }
});

hbsis.wms.settings.DataValidadeViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    intervalo: ko.observable('0-39'),
    periodo: ko.observable(40),
    urlGetItemsConfered: "",
    init: function (opts) {
        this._super(opts);

        var intervaloDias = this.getQueryStringValue("IntervaloDias");
        if (!intervaloDias)
            intervaloDias = 40;

        $("#Periodo").select2();
        $("#Periodo").select2("val", intervaloDias + "", true);
        this.periodo(intervaloDias);
    },
    getQueryStringValue: function (key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.DataValidadeModel());
    },
    getModelDescription: function (model) {
        return model.CodigoItem;
    },
    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    filtrarPeriodo: function () {
        location.search = "?IntervaloDias=" + this.periodo();
        //location.reload();
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "bFilter": false,
            "bPaginate": false,
            "iDisplayLength": 99999,
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "Intervalo", "value": self.intervalo() });
                aoData.push({
                    "name": "IntervaloDias",
                    "value": self.periodo()
                });
                aoData[4].value = 99999;
            },

            "aoColumns": [
              { "mData": "CodigoArmazem" },
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
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false
                }
            ]
        };
    }
});