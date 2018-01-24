var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.FechamentoDTModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.NumeroDocumento = ko.observable();
        this.PlacaVeiculo = ko.observable();
        this.Status = ko.observable();
        this.Justificativa = ko.observable();
        this.Details = ko.observableArray();        
    },
    clear: function () {
        this.Id('');
        this.CodigoArmazem('');
        this.NumeroDocumento('');
        this.PlacaVeiculo('');
        this.Status('');
        this.Justificativa('');        
        this.Details.removeAll();
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArmazem(model.CodigoArmazem);
        this.NumeroDocumento(model.NumeroDocumento);
        this.PlacaVeiculo(model.PlacaVeiculo);
        this.Status(model.Status);

        for (var i = 0; i < model.Details.length; i++) {
            this.Details.push(new hbsis.wms.settings.DTDetailModel(model.Details[i]));
        }

        var self = this;
    }
});

hbsis.wms.settings.DTDetailModel = Class.extend({
    init: function (model) {
        this.Id = model.Id;
        this.Codigo = model.Codigo;
        this.Descricao = model.Descricao;
        this.QtdeTotal = model.QtdeTotal;
        this.Divergencia = model.Divergencia;
        this.QuantidadeInformada = model.QuantidadeInformada;
        this.Status = model.Status;
        this.UnidadeMedida = model.UnidadeMedida;

        this.Editar = function () {
            return self.settings.editMarkup;

        };
    }
});

hbsis.wms.settings.FechamentoDTViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    urlGetItemsConfered: "",
    init: function (opts) {
        this._super(opts);

        this.urlGetItemsConfered = this.settings.fechamentoDtUrl;

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"

        });

        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);
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
    clearSaveForm: function () {
        this._super();
        $("#Id").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#Id").select2("val", $("#Id").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.FechamentoDTModel());
    },
    getModelDescription: function (model) {
        return model.NumeroDocumento;
    },
    obterUrlSalvar: function (id) {
        return this.form.attr('action') + "/SalvarDetalhes" + "/" + id;
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
                $.each(data, function (i, item) {
                    currentModel.Details.push(new hbsis.wms.settings.DTDetailModel(item));
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
        $.ajax({
            async: true,
            url: this.urlGetItemsConfered + "/BuscarDetalhes/" + model.Id,
            dataType: "JSON",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                currentModel.Details.removeAll();
                $.each(data, function (i, item) {

                    currentModel.Details.push(new hbsis.wms.settings.DTDetailModel(item));
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
                aoData.push({ "name": "NumeroDocumento", "value": $('#NumeroDocumento').val() });
                aoData.push({ "name": "NumeroDocumento", "value": $('#Veiculo').val() });
                aoData.push({ "name": "Status", "value": $('#Status').val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });

                if ($("#Status").val() !== "") {
                    aoData.push({ "name": "WQStatus", "value": "true" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                } else {
                    aoData.push({ "name": "WQStatus", "value": "false" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                }
            },
            "aoColumns": [
              { "mData": "CodigoArmazem" },
              { "mData": "NumeroDocumento" },
              { "mData": "PlacaVeiculo" },
              { "mData": "Status" },
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
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Status);
                    },

                    "fnCreatedCell": function(nTd, sData, oData, iRow, iCol) {
                        var field = sData.split("<")[0].replace(/\s+/g, '');
                        debugger;
                        if (field == "Associado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd", "width": "98px" });
                        } else if (field == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        } else if (field == "NãoAssociado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        } else if (field == "Parcial") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        } else if (field == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                        } else if (field == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        } else if (field == "NãoAssociado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
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