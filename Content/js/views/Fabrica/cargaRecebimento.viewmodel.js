var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.CargaRecebimentoModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.NumeroRecebimento = ko.observable();
        this.PlacaVeiculo = ko.observable();
        this.IdVeiculo = ko.observable();
        this.StatusCargaRecebimento = ko.observable();
        this.VeiculoEditavel = ko.observable();
        this.Details = ko.observableArray();
    },
    clear: function () {
        this.Id('');
        this.CodigoArmazem('');
        this.NumeroRecebimento('');
        this.PlacaVeiculo('');
        this.IdVeiculo('');
        this.StatusCargaRecebimento('');
        this.VeiculoEditavel(false);
        this.Details.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArmazem(model.CodigoArmazem);
        this.NumeroRecebimento(model.NumeroRecebimento);
        this.PlacaVeiculo(model.PlacaVeiculo);
        this.IdVeiculo(model.IdVeiculo);
        this.VeiculoEditavel(model.VeiculoEditavel);
        this.StatusCargaRecebimento(model.StatusCargaRecebimento);

        for (var i = 0; i < model.Details.length; i++) {
            this.Details.push(new hbsis.wms.settings.RecebimentoDetailModel(model.Details[i]));
        }

        var self = this;
    }
});

hbsis.wms.settings.RecebimentoDetailModel = Class.extend({
    init: function (model) {
        this.Id = model.Id;
        this.Codigo = model.Codigo;
        this.Descricao = model.Descricao;
        this.QuantidadePrevista = model.QuantidadePrevista;
        this.QuantidadeConferida = model.QuantidadeConferida;
        this.StatusCargaRecebimento = model.StatusCargaRecebimento;
        this.Diferenca = model.Diferenca;

        this.Editar = function () {
            return self.settings.editMarkup;
        };
    }
});

hbsis.wms.settings.CargaRecebimentoViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    urlGetItemsConfered: "",
    init: function(opts) {
        this._super(opts);

        this.initAutocomplete("#IdVeiculo", this.settings.vehicleAutocompleteUrl, this.renderVehicle);

        this.urlGetItemsConfered = this.settings.cargaRecebimentoUrl;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#StatusCargaRecebimento"
        });

        $("#IdVeiculo").addClass("ignore");
        $("#StatusCargaRecebimento").select2("val", $("#StatusOrdemDescarga").val(), true);
    },
    initDatetimeRangePicker: function(field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function(start, end) {
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
    clearSaveForm: function() {
        this._super();
        $("#Id").select2("val", "", true);
        $("#IdVeiculo").select2("val", "", true);
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.CargaRecebimentoModel());
    },
    renderVehicle: function (veiculo) {
        console.log(veiculo.LicensePlate);
        return veiculo.LicensePlate;
    },
    getModelDescription: function (model) {
        return model.NumeroRecebimento;
    },
    obterUrlSalvar: function (id) {
        return this.form.attr('action') + "/LiberarNRI" + "/" + id;
    },
    salvarForm: function (modal) {
        var currentModel = this.model();
        var id = this.form.find("#Id").val();
        var data = this.getFormData.call(this);
        var url = this.obterUrlSalvar(id);
        var self = this;
        $.ajax({
            type: self.editMode() ? "PUT" : "POST",
            url: url,
            data: data,
            success: function (data, textStatus, jqXHR) {
                currentModel.Details.removeAll();
                $.each(data.Details, function (i, item) {
                    currentModel.Details.push(new hbsis.wms.settings.RecebimentoDetailModel(item));
                });

                self.dirty(true);
                self.refreshDatatable();


                if ($.isFunction(self.settings.onSaveSuccess)) {
                    self.settings.onSaveSuccess.apply(self, arguments);
                }

                if ($.isFunction(self.settings.onChange)) {
                    self.settings.onChange.apply(self, arguments);
                }

                if (!self.editMode()) {
                    self.clearSaveForm();

                    if (document.getElementById('MSG')) {
                        $("#MSG").remove();
                    }

                    if (data.id != '') {
                        var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegisteredSuccessfully') + '</div>';
                        self.form.prepend(alert);

                    }
                    else if (data.length > 1) {
                        var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + data.length + resources.get('ManyRegisteredSuccessfully') + '</div>';
                        self.form.prepend(alert);

                    }

                } else {

                    if (document.getElementById('MSG')) {
                        $("#MSG").remove();
                    }

                    var alert = "<div id='MSG' class=\"alert alert-success alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegistryEditedWithSuccess') + '</div>';
                    self.form.prepend(alert);

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

                if (document.getElementById('MSG')) {
                    $("#MSG").remove();
                }

                if (jqXHR.status == 500) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Ocorreu um erro interno do servidor!</div>";

                    self.form.prepend(error);
                    return;
                }
                if (jqXHR.status == 300) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Não existem modificações para serem salvas. Favor verificar!</div>";
                    self.form.prepend(error);

                    return;
                }
                if (jqXHR.status == 400) {
                    this.results = new hbsis.wms.ErrorHandler(jqXHR);

                    var alert = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>";

                    if (this.results.hasErrors()) {
                        alert += "<ul>";
                        for (var i = 0; i < this.results.errors.length; i++) {
                            alert += "<li>" + this.results.errors[i].Errors[0] + "</li>";
                        }
                        alert += "</ul></div>";
                        self.form.prepend(alert);
                    }

                    return;
                }
                if (jqXHR.status == 401) {
                    var error = "<div id='MSG' class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + resources.get('Unauthorized error user') + "</div>";

                    self.form.prepend(error);
                    return;
                }
                if (jqXHR.status == 302) {
                    var url = /<a href=\"(.*)\">here<\/a>/.exec(jqXHR.responseText)[1];
                    location.href = url;
                }

                else {

                    if (document.getElementById('MSG')) {
                        $("#MSG").remove();
                    }

                    var message = JSON.parse(jqXHR.responseText).message;
                    if (message) {
                        var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + JSON.parse(jqXHR.responseText).message + "</div>";

                        self.form.prepend(alert);
                    }
                }

                if ($.isFunction(self.settings.onSaveError)) {
                    self.settings.onSaveError.apply(self, arguments);
                }
            }
        }).always(function () {
            //loader.destroy();
            delete loader;
        });
    },
    edit: function (model) {
        this._super(model);
        var currentModel = this.model();
        $("#IdVeiculo").select2("val", model.IdVeiculo, true);
        $.ajax({
            async: true,
            url: this.urlGetItemsConfered + "/BuscarDetalhes/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                currentModel.Details.removeAll();
                $.each(data, function (i, item) {

                    currentModel.Details.push(new hbsis.wms.settings.RecebimentoDetailModel(item));
                });
            }
        });
    },
    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function (data, page) {
                    return { results: data.Rows };
                }
            },
            id: function (data) { return data.Id; },
            initSelection: function (element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function (data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,
            escapeMarkup: function (m) { return m; }
        });
    },
    getFormData: function () {
        var self = this;
        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "NumeroRecebimento", "value": $('#NumeroRecebimento').val() });
                aoData.push({ "name": "Veiculo", "value": $('#IdVeiculo').val() });
                aoData.push({ "name": "StatusCargaRecebimento", "value": $('#StatusOrdemDescarga').val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });

                if ($("#StatusCargaRecebimento").val() !== "") {
                    aoData.push({ "name": "NRIStatus", "value": "true" });
                    aoData.push({ "name": "StatusCargaRecebimento", "value": $("#StatusOrdemDescarga").val() });
                } else {
                    aoData.push({ "name": "NRIStatus", "value": "false" });
                    aoData.push({ "name": "StatusCargaRecebimento", "value": $("#StatusOrdemDescarga").val() });
                }
            },

            "aoColumns": [
              { "mData": "CodigoArmazem" },
              { "mData": "NumeroRecebimento" },
              { "mData": "PlacaVeiculo" },
              { "mData": "StatusCargaRecebimento" },
              { "mData": null }

            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.CodigoArmazem;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": false
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.PlacaVeiculo == null)
                            return '-';
                        return row.PlacaVeiculo;
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.StatusCargaRecebimento);
                    },

                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {                        
                        var field = sData.split("<")[0].replace(/\s+/g, '');
                        if (field == "Pendente") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c", "width": "98px" });
                        } else if (field == "Conferido") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "Liberado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        } else if (field == "Conferidocomdivergência") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "Conferidocomdatadivergente") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "AguardandoArquivoBlitz") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        } if (sData == "Associado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }else if (sData == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }else if (sData == "Não Associado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        }else if (sData == "Parcial") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        }else if (sData == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                        }else if (sData == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }



                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false,
                    "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                    "<i class=\"fa fa-search\"></i></a> "
                }
            ]
        };
    }
});