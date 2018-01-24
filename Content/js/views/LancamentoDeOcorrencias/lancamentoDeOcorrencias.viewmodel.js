var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

//hbsis.wms.settings.OccurrenceUserModel = Class.extend({
//    init: function(UsuarioResponsavel) {
//        this.Name = UsuarioResponsavel.Name;
//    }
//});

//hbsis.wms.settings.OccurrenceWarehouseModel = Class.extend({
//    init: function(Armazem) {
//        if (!Armazem) {
//            Armazem = { Id: "", Name: "", ShortCode: "" };
//        }

//        this.Id = Armazem.Id;
//        this.Name = Armazem.Name;
//        this.ShortCode = Armazem.ShortCode;
//    }
//});

hbsis.wms.settings.OccurrenceModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoOperacao = ko.observable();
        this.UsuarioAfericao = ko.observable("");
        this.Endereco = ko.observable("");
        this.Item = ko.observable("");
        this.UnidadeMedida = ko.observable("");
        this.Quantidade = ko.observable("");
        this.MovimentaAG = ko.observable("");
        this.DataCriacao = ko.observable("");
        this.Fotos = ko.observableArray();
        this.Motivo = ko.observable("");

    },
    clear: function () {
        this.Id("");
    },
    load: function (model) {
        if (!model)
            return;

        var self = this;
    }
});

hbsis.wms.settings.OccurrencesViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        var start = hbsis.wms.Helpers.querystring("startDate");
        if (start)
            this.startDate = moment(start, "DD/MM/YYYY");

        var end = hbsis.wms.Helpers.querystring("endDate");
        if (end)
            this.endDate = moment(end, "DD/MM/YYYY");

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

                var startDate = start.format(resources.get("SmallDateFormat"));
                var endDate = end.format(resources.get("SmallDateFormat"));

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
        return ko.observable(new hbsis.wms.settings.OccurrenceModel());
    },
    getModelDescription: function (model) {
        return model.body;
    },
    renderWarehouse: function (armazem) {
        return armazem.ShortCode + " - " + armazem.Name;
    },
    initProcessMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 1000, sort: "Name", direction: "asc" },
            dataType: "json",
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var messagesUsers = $.map(data.Rows,
                        function (el) {
                            return new hbsis.wms.settings.MessageUserModel(el);
                        });
                    self.model().AvailableUsers(messagesUsers);
                    $(field).multiSelect();
                }
            }
        });
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
    },
    getFormData: function () {
        var self = this;
        this.model()
            .Zones($.map(this.model().ZonesIds(),
                function (el) {
                    return $.grep(self.model().AvailableZones(),
                        function (el2) {
                            return el == el2.Id;
                        })[0];
                }));

        return $.toDictionary(ko.toJS(this.model()));
    },

    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get("DD/MM/YYYY")) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get("DD/MM/YYYY")) });

            },
            "aoColumns": [
                { "mData": "DataCriacao" },
                { "mData": "CodigoOperacao" },
                { "mData": "UsuarioResponsavel" },
                { "mData": "UsuarioAfericao" },
                { "mData": "Endereco" },
                { "mData": "Item" },
                { "mData": "UnidadeMedida" },
                { "mData": "MovimentaAG" },
                { "mData": "Quantidade" },
                { "mData": "Motivo"},
                { "mData": "Fotos" }

            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.DataCriacao == null)
                            return "NULO";

                        return moment(row.DataCriacao).format("DD/MM/YYYY HH:mm:ss");
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.CodigoOperacao);
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {

                        if (row.UsuarioResponsavel != null)
                            return row.UsuarioResponsavel;
                        else
                            return "-";
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.UsuarioAfericao != null)
                            return row.UsuarioAfericao;
                        else
                            return "-";


                    }
                },
                {
                    "aTargets": [4],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Endereco;

                    }
                },
                {
                    "aTargets": [5],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Item;

                    }
                },
                {
                    "aTargets": [6],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.UnidadeMedida;

                    }
                },
                {
                    "aTargets": [7],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Quantidade;

                    }
                },
                {
                    "aTargets": [8],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.MovimentaAG ? "Sim" : "Não";

                    }
                },
                {
                    "aTargets": [9],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return row.Motivo;

                    },
                },
                {
                    "aTargets": [10],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        var html = "";
                        for (var i = 0; i < row.Fotos.length; i++) {
                            var soma = i + 1;
                            html += "<a href=\"#\" onclick=\"vizializarImagem('" + row.Fotos[i].Identificador + "')\" data-target=\"#save-modal\" data-toggle=\"modal\"> Foto - " + soma + " <i class=\"glyphicon glyphicon-eye-open\" ></i> </a>";
                            html += "</br>";
                        }
                        return html;
                    }
                 }
            ]
        };
    }
});

var objetoFoto = null;

function vizializarImagem(obj) {
    objetoFoto = obj;
    var url = "/Inventory/LancamentoDeOcorrencias/VisualizarFoto/" + obj;
    var requisicao = new XMLHttpRequest();
    requisicao.onreadystatechange = function () {
        if (requisicao.readyState === 4 && requisicao.status === 200) {
            var foto = requisicao.response;
            var fotoConvertidaString64 = "" + foto;
            $("#fotoOcorrencia").empty();
            var html = "<CENTER> <img align=\"middle\" src=\"data:image/png;base64," + fotoConvertidaString64 + "\" style=\"max-height: 480px; max-width: 720px;\" /></CENTER>";
            $("#fotoOcorrencia").append(html);
        }
    }
    requisicao.responseType = "json";
    requisicao.open("GET", url);
    requisicao.send();
}

function baixarFoto () {
    window.open("/Inventory/LancamentoDeOcorrencias/DownloadFoto/" + objetoFoto);
}