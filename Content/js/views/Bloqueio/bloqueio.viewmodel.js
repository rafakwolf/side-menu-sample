var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.BloqueioModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.IdOcorrencia = ko.observable();
        this.Endereco = ko.observable();
        this.Data = ko.observable();
        this.Motivo = ko.observable();
        this.DescricaoItem = ko.observable();
        this.StatusEndereco = ko.observable();
        this.ObservacaoBloqueio = ko.observable();
        this.ObservacaoLiberacao = ko.observable();
        this.Desbloqueando = ko.observable(false);
        this.DetalhesItem = ko.observableArray();
        this.ItemDescription = ko.observable();
        this.ItemId = ko.observable();
        this.MotivoDescricao = ko.observable(false);
    },
    clear: function () {
        this.Id('');
        this.IdOcorrencia('');
        this.Endereco('');
        this.Data('');
        this.Motivo('');
        this.DescricaoItem('');
        this.StatusEndereco('');
        this.ObservacaoBloqueio('');
        this.ObservacaoLiberacao('');
        this.Desbloqueando(false);
        this.DetalhesItem.removeAll();
        this.ItemDescription('');
        this.ItemId('');
        this.MotivoDescricao('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.IdOcorrencia(model.Id);
        this.Endereco(model.Endereco);
        this.Data(moment(model.Data).format("DD/MM/YYYY HH:mm:ss"));
        this.Motivo(model.Motivo);
        this.DescricaoItem(model.DescricaoItem);
        this.StatusEndereco(model.StatusEndereco);
        this.ObservacaoBloqueio(model.ObservacaoBloqueio);
        this.ObservacaoLiberacao(model.ObservacaoLiberacao);
        this.Desbloqueando(false);
        this.ItemDescription(model.ItemDescription);
        this.ItemId(model.ItemId);
        this.MotivoDescricao(model.MotivoDescricao);
        for (var i = 0; i < model.DetalhesItem.length; i++) {
            this.DetalhesItem.push(new hbsis.wms.settings.BloqueioDetailModel(model.DetalhesItem[i]));
        }
    }
});

hbsis.wms.settings.BloqueioDetailModel = Class.extend({
    init: function (model) {
        this.Id = model.Id;
        this.Codigo = model.Codigo;
        this.Descricao = model.Descricao;
        this.Quantidade = model.Quantidade;
    }
});

hbsis.wms.settings.BloqueioViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    ocorrenciasUrl: "",
    init: function (opts) {
        this._super(opts);
        this.ocorrenciasUrl = this.settings.ocorrenciasUrl;
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start) {
            this.startDate = moment(start, 'DD/MM/YYYY');
        }

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#StatusEndereco"
        });

        $("#StatusEndereco").select2("val", "Bloqueado");
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
        return ko.observable(new hbsis.wms.settings.BloqueioModel());
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
        var currentModel = this.model();
        if (model.IdItem !== null) {
            $.ajax({
                async: true,
                url: this.ocorrenciasUrl + "/BuscarDetalhes/" + model.IdItem + "/"+ model.Endereco,
                dataType: "JSON",
                type: "GET",
                success: function(data, textStatus, jqXHR) {
                    currentModel.DetalhesItem.removeAll();
                    $.each(data,
                        function(i, item) {
                            currentModel.DetalhesItem.push(new hbsis.wms.settings.BloqueioDetailModel(item));
                        });
                }
            });
        } else {
            $.ajax({
                async: true,
                url: this.ocorrenciasUrl + "/BuscarDetalhesEndereco/" + model.Endereco.toString(),
                dataType: "JSON",
                type: "GET",
                success: function(data, textStatus, jqXHR) {
                    currentModel.DetalhesItem.removeAll();
                    $.each(data,
                        function(i, item) {
                            currentModel.DetalhesItem.push(new hbsis.wms.settings.BloqueioDetailModel(item));
                        });
                }
            });
        }
    },

    filterChange: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },

    desbloquear: function (model) {
        this.model().load(model);
        this.editMode(true);
        this.model().Desbloqueando(true);
    },

    applyDatabind: function (ko) {
        var self = this;

        if (self.datatable != null) {
            self.document.on("click",
                self.settings.datatableId + " .desbloquear",
                function (e) {
                    var row = $(this).parents('tr')[0];
                    var model = self.datatable.fnGetData(row);
                    self.desbloquear(model);
                });
        }

        this._super(ko);
    },

    salvar: function () {
        debugger;
        this.clearErrorAlert();
        var valid = true;
        if ($.isFunction(this.form.parsley)) {
            valid = this.form.parsley('validate');
        } else if ($.isFunction(this.form.validate)) {
            var validationInfo = this.form.data("unobtrusiveValidation");
            valid = !validationInfo || !validationInfo.validate || validationInfo.validate();
        }

        if (!valid)
            return;

        var loader = new hbsis.wms.Loader({
            parent: this.settings.saveModal + " .modal-content"
        });
        loader.show();

        var id = this.form.find("#Id").val();
        var data = this.getFormData.call(this);
        var url = this.obterUrlSalvar(id);
        var self = this;

        $.ajax({
            type: self.editMode() ? "PUT" : "POST",
            url: url,
            data: data,
            success: function (data, textStatus, jqXHR) {
                self.dirty(true);

                if ($.isFunction(self.settings.onSaveSuccess)) {
                    self.settings.onSaveSuccess.apply(self, arguments);
                }

                if ($.isFunction(self.settings.onChange)) {
                    self.settings.onChange.apply(self, arguments);
                }

                if (!self.editMode()) {
                    self.clearSaveForm();

                    if (data.id != '') {
                        var alert = "<div class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegisteredSuccessfully') + '</div>';

                        self.form.prepend(alert);
                    }
                    else if (data.length > 1) {
                        var alert = "<div class=\"alert alert-success alert-white-alt rounded\">" +
                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                           "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + data.length + resources.get('ManyRegisteredSuccessfully') + '</div>';

                        self.form.prepend(alert);
                    }

                } else {
                    var alert = "<div class=\"alert alert-success alert-white-alt rounded\">" +
                            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                            "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + resources.get('RegistryEditedWithSuccess') + '</div>';

                    self.form.prepend(alert);
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

                if ($.isFunction(self.settings.onSaveError)) {
                    self.settings.onSaveError.apply(self, arguments);
                }

                new hbsis.wms.FormErrorHandler(self.settings.saveForm, jqXHR);
            }
        }).always(function () {
            loader.destroy();
            delete loader;
        });

    },

    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });

                if ($("#StatusEndereco").val() !== "") {
                    aoData.push({ "name": "WQStatus", "value": "true" });
                    aoData.push({ "name": "StatusEndereco", "value": $("#StatusEndereco").val() });
                } else {
                    aoData.push({ "name": "WQStatus", "value": "false" });
                    aoData.push({ "name": "StatusEndereco", "value": $("#StatusEndereco").val() });
                }
            },

            "aoColumns": [
              { "mData": "Endereco" },
              { "mData": "Data" },
              { "mData": "Motivo" },
              { "mData": "Item" },
              { "mData": "StatusEndereco" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Endereco;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return moment(row.Data).format("DD/MM/YYYY HH:mm:ss");
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.MotivoDescricao);
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": true, "bSearchable": false,
                    "mRender": function (data, type, row) {
                        if (row.Item != null)
                            return row.Item + " - " + row.ItemDescription;
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
                        return resources.get(row.StatusEndereco);
                    },

                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        var field = sData.split("<")[0].replace(/\s+/g, '');
                        if (field == "Liberado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#006400", "width": "98px" });
                        } else if (field == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#dc143c" });
                        }
                    }
                },
                {
                    "aTargets": [5], "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        var html = "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\">" +
                                "<i class=\"fa fa-search\"></i></a> ";

                        if (row.EnderecoBloqueado) {
                            //html +=
                            //    "<a class=\"label label-primary\" endereco= " + row.Endereco + " id=\"BtnBloqueio\" href=\"#Bloqueio\" data-target=\"#desbloqueio-modal\" data-toggle=\"modal\">" +
                            //    "<i class=\"fa fa-unlock\"></i></a>";

                            html += "<a class=\"label label-primary desbloquear\" href=\"#desbloquear\" data-target=\"#save-modal\" data-toggle=\"modal\">" +
                                                            "<i class=\"fa fa-unlock\"></i></a> ";
                        }
                        return html;
                    }
                }
            ]
        };
    }
});