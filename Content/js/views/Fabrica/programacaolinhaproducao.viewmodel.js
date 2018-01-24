var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ProgramacaoLinhaProducao = Class.extend({
    init: function () {
        self = this;
        this.Id = ko.observable();
        this.LinhaProducaoId = ko.observable();
        this.LinhaProducaoCodigo = ko.observable();
        this.LinhaProducaoNome = ko.observable();
        this.ItemId = ko.observable();
        this.ItemCodigo = ko.observable();
        this.ItemDescricao = ko.observable();
        this.Margem = ko.observable('30');
        this.Quantidade = ko.observable();
        this.Situacao = ko.observable();
        this.Inicio = ko.observable();
        this.Fim = ko.observable();
        this.Analise = ko.observableArray();
        this.Insumos = ko.observableArray();
        this.VisualizarAnalise = ko.computed(function () {
            return self.Analise.length > 0;
        }, this);
    },
    clear: function () {
        this.Id('');
        this.LinhaProducaoId('');
        this.LinhaProducaoCodigo('');
        this.LinhaProducaoNome('');
        this.ItemId('');
        this.ItemCodigo('');
        this.ItemDescricao('');
        this.Margem('');
        this.Quantidade('');
        this.Situacao('');
        this.Inicio('');
        this.Fim('');
        this.Analise([]);
        this.Insumos([]);
    },
    load: function (model) {
        this.Id(model.Id);
        this.LinhaProducaoId(model.LinhaProducaoId);
        this.LinhaProducaoCodigo(model.LinhaProducaoCodigo);
        this.LinhaProducaoNome(model.LinhaProducaoNome);
        this.ItemId(model.ItemId);
        this.ItemCodigo(model.ItemCodigo);
        this.ItemDescricao(model.ItemDescricao);
        this.Margem(model.Margem);
        this.Quantidade(model.Quantidade);
        this.Analise([]);
        this.Insumos([]);
        this.Situacao(model.Situacao);
        this.Inicio(model.Inicio);
        this.Fim(model.Fim);
    }
});

hbsis.wms.settings.ResultadoValidacao = Class.extend({
    init: function () {
        this.Tipo = ko.observable();
        this.Solicitado = ko.observable(0);
        this.Insumos = ko.observableArray();
        this.Mensagens = ko.observableArray();
    },
    clear: function () {
        this.Tipo({});
        this.Solicitado(0);
        this.Insumos([]);
        this.Mensagens([]);
    },
    load: function (model) {
        self = this;
        this.Tipo(model.Tipo);
        this.Solicitado(model.Solicitado);
        if (model.Insumos) {
            $.each(model.Insumos, function (index, item) {
                var insumo = new hbsis.wms.settings.ResultadoInsumoValidacao();
                insumo.load(item);
                self.Insumos.push(insumo);
            });
        }
        this.Mensagens(model.Mensagens);
    }
});

hbsis.wms.settings.ResultadoInsumoValidacao = Class.extend({
    init: function () {
        this.Solicitado = ko.observable();
        this.Disponivel = ko.observable();
        this.TemSaldoSuficiente = ko.observable();
        this.EhPrincipal = ko.observable();
        this.Item = ko.observable();
    },
    clear: function () {
        this.Solicitado('');
        this.Disponivel('');
        this.TemSaldoSuficiente('');
        this.EhPrincipal('');
        this.Item('');
    },
    load: function (model) {
        this.Solicitado(model.Solicitado);
        this.Disponivel(model.Disponivel);
        this.TemSaldoSuficiente(model.TemSaldoSuficiente);
        this.EhPrincipal(model.EhPrincipal);
        this.Item(model.Item);
    }
});

hbsis.wms.settings.TipoInsumo = Class.extend({
    init: function () {
        this.Tipo = ko.observable();
        this.Solicitado = ko.observable(0);
        this.Insumos = ko.observableArray();
    },
    clear: function () {
        this.Tipo('');
        this.Solicitado(0);
        this.Insumos([]);
    },
    load: function (model) {
        self = this;
        this.Tipo(model.Tipo);
        this.Solicitado(model.Solicitado);
        if (model.Insumos) {
            $.each(model.Insumos, function (index, item) {
                var insumo = new hbsis.wms.settings.Insumo();
                insumo.load(item);
                self.Insumos.push(insumo);
            });
        }
    }
});

hbsis.wms.settings.Insumo = Class.extend({
    init: function () {
        this.Disponivel = ko.observable();
        this.Tipo = ko.observable();
        this.ItemCodigo = ko.observable();
        this.ItemDescricao = ko.observable();
    },
    clear: function () {
        this.Disponivel('');
        this.Tipo('');
        this.ItemCodigo('');
        this.ItemDescricao('');
    },
    load: function (model) {
        this.Disponivel(model.Disponivel);
        this.Tipo(model.Tipo);
        this.ItemCodigo(model.ItemCodigo);
        this.ItemDescricao(model.ItemDescricao);
    }
});

hbsis.wms.settings.ProgramacaoLinhaProducaoViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    PodeSalvar: ko.observable(true),
    AnaliseHabilitado: ko.observable(true),
    PodeGerarTarefa: ko.observable(false),
    PodeAnalisar: ko.observable(false),
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#LinhaProducaoId", this.settings.defaultLinhaProducaoAutocompleteUrl, this.renderLinhaProducao);
        this.initAutocomplete("#ItemId", this.settings.defaultItemAutocompleteUrl, this.renderItem);

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

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Situacao"
        });

        var start = moment().startOf('month');
        if (start) {
            this.startDate = moment(start, 'DD/MM/YYYY');
        }

        var end = moment().endOf('month');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }
        $("#Situacao").val('');
        $("#Situacao").select2("val", $("#Situacao").val(), true);

        this.initDatetimeRangePicker("#reportrange");
    },
    statusFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    renderLinhaProducao: function (linhaProducao) {
        return linhaProducao.Code + ' - ' + linhaProducao.Description;
    },
    renderItem: function (item) {
        return item.Code + ' - ' + item.Description;
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ProgramacaoLinhaProducao());
    },
    getModelDescription: function (model) {
        return model.LinhaProducaoCodigo;
    },
    save: function (e) {
        this._super(e);
        this.AnaliseHabilitado(true);
        this.model().Analise([]);
    },
    clearSaveForm: function () {
        this._super();
        $("#LinhaProducaoId").select2("val", "", true);
        $("#ItemId").select2("val", "", true);
        $("#Situacao").select2("val", "", true);
        $("#Situacao").select2("enable", true);

        $("#Margem").val("30");
        this.AnaliseHabilitado(true);
        this.PodeAnalisar(false);
        this.PodeGerarTarefa(false);
        this.PodeSalvar(true);
        this.closeSaveForm();
    },
    edit: function (model) {
        this._super(model);
        if (this.model().Situacao() != 'Programado') {
            this.PodeAnalisar(false);
            this.PodeGerarTarefa(false);
            this.PodeSalvar(false);
        }
        $("#LinhaProducaoId").select2("val", $("#LinhaProducaoId").val(), true);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
        $("#Situacao").select2("val", $("#Situacao").val(), true);
        this.carregarDetalhes();
    },
    carregarDetalhes: function () {
        var self = this;
        var currentModel = this.model();
        $.ajax({
            async: true,
            url: this.form.attr('action') + "/BuscarDetalhes/" + currentModel.Id(),
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                $.each(data, function (i, item) {
                    var tipo = new hbsis.wms.settings.TipoInsumo();
                    tipo.load(item);
                    currentModel.Insumos.push(tipo);
                });
                if (data.length == 0) {
                    self.PodeAnalisar(true);
                }
            }
        });
    },
    gerarTarefas: function () {
        var loader = new hbsis.wms.Loader({
            parent: this.settings.saveModal + " .modal-content"
        });
        loader.show();

        var id = this.form.find("#Id").val();
        var url = this.form.attr('action') + "/gerarTarefas/" + id;
        var self = this;

        $.ajax({
            type: "POST",
            url: url,
            success: function (data, textStatus, jqXHR) {
                self.dirty(true);

                if ($.isFunction(self.settings.onSaveSuccess)) {
                    self.settings.onSaveSuccess.apply(self, arguments);
                }

                if ($.isFunction(self.settings.onChange)) {
                    self.settings.onChange.apply(self, arguments);
                }

                if (data.erro) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + data.mensagem + "</div>";
                    self.form.prepend(error);
                } else {
                    self.model().Analise([]);
                    $.each(data, function (index, item) {
                        var res = new hbsis.wms.settings.TipoInsumo();
                        res.load(item);
                        self.model().Insumos.push(res);
                    });
                    self.PodeGerarTarefa(false);
                    self.PodeAnalisar(false);
                    self.PodeSalvar(false);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 500) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Ocorreu um erro interno do servidor!</div>";

                    self.form.prepend(error);
                    return;
                }
                if (jqXHR.status == 401) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
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
                    var message = JSON.parse(jqXHR.responseText).message;
                    if (message) {
                        var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + JSON.parse(jqXHR.responseText).message + "</div>";

                        self.form.prepend(alert);
                    }
                }
            }
        }).always(function () {
            loader.destroy();
            delete loader;
        });
    },
    analisar: function () {
        var loader = new hbsis.wms.Loader({
            parent: this.settings.saveModal + " .modal-content"
        });
        loader.show();

        var id = this.form.find("#Id").val();
        var url = this.form.attr('action') + "/analisar/" + id;
        var self = this;

        $.ajax({
            type: "POST",
            url: url,
            success: function (data, textStatus, jqXHR) {
                self.dirty(true);

                if ($.isFunction(self.settings.onSaveSuccess)) {
                    self.settings.onSaveSuccess.apply(self, arguments);
                }

                if ($.isFunction(self.settings.onChange)) {
                    self.settings.onChange.apply(self, arguments);
                }

                if (data.erro) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + data.mensagem + "</div>";
                    self.form.prepend(error);
                } else {
                    $.each(data.resultado, function (index, item) {
                        var res = new hbsis.wms.settings.ResultadoValidacao();
                        res.load(item);
                        self.model().Analise.push(res);
                    });
                    self.PodeGerarTarefa(data.podeGerarTarefa);
                }
                self.AnaliseHabilitado(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                self.AnaliseHabilitado(true);
                if (jqXHR.status == 500) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>Ocorreu um erro interno do servidor!</div>";

                    self.form.prepend(error);
                    return;
                }
                if (jqXHR.status == 401) {
                    var error = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
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
                    var message = JSON.parse(jqXHR.responseText).message;
                    if (message) {
                        var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + JSON.parse(jqXHR.responseText).message + "</div>";

                        self.form.prepend(alert);
                    }
                }
            }
        }).always(function () {
            loader.destroy();
            delete loader;
        });
    },
    initAutocomplete: function (field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 2,
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                if ($("#Situacao").val() != "") {
                    aoData.push({ "name": "FiltrarTipoSituacao", "value": "true" });
                    aoData.push({ "name": "SituacaoProgramacao", "value": $("#Situacao").val() });
                } else {
                    aoData.push({ "name": "FiltrarTipoSituacao", "value": "false" });
                    aoData.push({ "name": "SituacaoProgramacao", "value": $("#Situacao").val() });
                }

                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "LinhaProducaoCodigo" },
              { "mData": "LinhaProducaoDescricao" },
              { "mData": "ItemCodigo" },
              { "mData": "ItemDescricao" },
              { "mData": "Inicio" },
              { "mData": "Fim" },
              { "mData": "Quantidade" },
              { "mData": "Situacao" },
              { "mData": null }
            ],
            "aoColumnDefs": [

            { "aTargets": [0], "mData": null, "bSortable": true, "bSearchable": false },
            { "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false },
            { "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false },
            { "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": false },
            { "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false },
            { "aTargets": [5], "mData": null, "bSortable": false, "bSearchable": false },
            { "aTargets": [6], "mData": null, "bSortable": false, "bSearchable": false },
            { "aTargets": [7], "mData": null, "bSortable": false, "bSearchable": false },
            {
                "aTargets": [8],
                "mData": null,
                "sDefaultContent": self.settings.actionsMarkup,
                "bSortable": false,
                "bSearchable": false
            }
            ]
        };
    }
});