var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RastreabilidadeModel = Class.extend({
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

hbsis.wms.settings.RastreabilidadeViewModel = hbsis.wms.CrudForm.extend({
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
        return ko.observable(new hbsis.wms.settings.RastreabilidadeModel());
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
                    { "mData": "CodArmazem" },
                    { "mData": "Usuario" },
                    { "mData": "TipoTarefa" },
                    { "mData": "NumeroTarefa" },
                    { "mData": "NumeroDocumento" },
                    { "mData": "DescricaoPalete" },
                    { "mData": "DataHoraInicio" },
                    { "mData": "DataHoraFim" },
                    { "mData": "Esforco" },
                    { "mData": "UltimoEvento" }
            ], "aoColumnDefs": [
            {
                "aTargets": [0],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.CodArmazem;
                }
            },
            {
                "aTargets": [1],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.Usuario;
                }
            },
            {
                 "aTargets": [2],
                 "bSortable": false,
                 "bSearchable": false,
                 "mRender": function (data, type, row) {
                     return row.TipoTarefa;
                 }
           },
           {
                  "aTargets": [3],
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.NumeroTarefa;
                 }
           },
           {
                  "aTargets": [4],
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.NumeroDocumento;
                  }
           },
           {
               "aTargets": [5],
               "bSortable": false,
               "bSearchable": false,
               "mRender": function (data, type, row) {
                   return row.DescricaoPalete;
               }
           },
            {
                "aTargets": [6],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.DataHoraInicio == null)
                        return "-";
                    return moment(row.DataHoraInicio).format("DD/MM/YYYY HH:mm:ss");
                }
            },
            {
            "aTargets": [7],
            "bSortable": false,
            "bSearchable": false,
            "mRender": function (data, type, row) {
                if (row.DataHoraFim == null)
                    return "-";
                return moment(row.DataHoraFim).format("DD/MM/YYYY HH:mm:ss");
            }
            },
            {
                "aTargets": [8],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.Esforco;
                }
            },
            {
                "aTargets": [9],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.UltimoEvento;
                }
            }
            ]
        };
    }
});