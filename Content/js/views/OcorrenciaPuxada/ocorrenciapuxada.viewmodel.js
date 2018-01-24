var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.OcorrenciaPuxadaModel = Class.extend({
    init: function () {
        this.TipoAnomalia = ko.observable();
    },
    clear: function () {
        this.TipoAnomalia('');
    },
    load: function (model) {
        if (!model)
            return;
        var self = this;            
    }
});

hbsis.wms.settings.OcorrenciaPuxadaViewModel = hbsis.wms.CrudForm.extend({
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


        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#TipoAnomalia"
        });

        $("#TipoAnomalia").val('');
        $("#TipoAnomalia").select2("val", $("#TipoAnomalia").val(), true);
      
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
        return ko.observable(new hbsis.wms.settings.OcorrenciaPuxadaModel());
    },
    typeFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    getModelDescription: function (model) {
        return model.body;
    },
    clearSaveForm: function () {
        this._super();
       
    },
    edit: function(model) {
        this._super(model);
      
    },    
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                if ($("#TipoAnomalia").val() != "") {
                    aoData.push({ "name": "TodosTipos", "value": "false" });
                    aoData.push({ "name": "TipoAnomalia", "value": $("#TipoAnomalia").val() });
                } else {
                    aoData.push({ "name": "TodosTipos", "value": "true" });
                    aoData.push({ "name": "TipoAnomalia", "value": $("#TipoAnomalia").val() });
                }
            aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
            aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
        },        
            "aoColumns": [
                { "mData": "ArmazemDescricao" },
                { "mData": "NumeroDocumento" },
                { "mData": "CodigoFabrica" },
                { "mData": "Codigo" },
                { "mData": "Codigo" },
                { "mData": "Descricao" },
                { "mData": "Unidade" },
                { "mData": "Quantidade" },
                { "mData": "TipoAnomalia" },
                { "mData": "DataValidade"},
                { "mData": "UsuarioNome" },
                { "mData": "AuditInfo.UpdatedDate" }

            ], "aoColumnDefs": [
            {
                "aTargets": [0],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.ArmazemDescricao;

                }
            },
            {
                "aTargets": [1],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.NumeroDocumento;

                }
            },
            {
                "aTargets": [2],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.CodigoFabrica == null)
                        return "-";
                    else
                    return row.CodigoFabrica;

                }
            },
            {
                "aTargets": [3],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.CodigoInversao !== "-") {
                        return "<div id='iconInversaoItem'></div>";
                    }
                    return "<div />";

                }
            },
            {
                "aTargets": [4],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.CodigoInversao !== "-") {
                        return "<div>" + row.Codigo + "</div><div style='color: #ea5c5c;'>" + row.CodigoInversao + "</div>";
                    }
                    return row.Codigo;
                }
            },
            {
                "aTargets": [5],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.ItemInversao !== "-") {
                        return "<div>" + row.Descricao + "</div><div style='color: #ea5c5c;'>" + row.ItemInversao + "</div>";
                    }
                    return row.Descricao;
                }
            },
            {
                "aTargets": [6],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.UnidadeInversao !== "-") {
                        return "<div>" + row.Unidade + "</div><div style='color: #ea5c5c;'>" + row.UnidadeInversao + "<div>";
                    }
                    return row.Unidade;
                }
            },
            {
                "aTargets": [7],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                    return row.Quantidade;
                }

            },
            {
                "aTargets": [8],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function(data, type, row) {
                        return row.TipoAnomalia;
                }
            },
            {
                "aTargets": [9],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.DataValidade;
                }
            },
            {
                "aTargets": [10],
                "mData": null,
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.UsuarioNome;
                }
            },
            {
                "aTargets": [11],
                "bSortable": true,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.AuditInfo.UpdatedDate == null)
                        return "NULO";

                    return moment(row.AuditInfo.UpdatedDate).format("DD/MM/YYYY HH:mm:ss");
                }
            }]
        };
    }
});