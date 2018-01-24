(function () { var e = false, t = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/; this.Class = function () { }; Class.extend = function (n) { function o() { if (!e && this.init) this.init.apply(this, arguments) } var r = this.prototype; e = true; var i = new this; e = false; for (var s in n) { i[s] = typeof n[s] == "function" && typeof r[s] == "function" && t.test(n[s]) ? function (e, t) { return function () { var n = this._super; this._super = r[e]; var i = t.apply(this, arguments); this._super = n; return i } }(s, n[s]) : n[s] } o.prototype = i; o.prototype.constructor = o; o.extend = arguments.callee; return o } })()

var hbsis = hbsis || {
    wms: {}
};

hbsis.wms.ErrorHandler = Class.extend({
    errors: [],
    hasErrors: function () {
        return this.errors.length > 0;
    },
    init: function (data) {
        if (data != null && typeof data === 'object' && data.responseText) {
            try {
                var response = JSON.parse(data.responseText);
                if (response.Errors)
                    this.errors = this.errors.concat(response.Errors);
            } catch (e) {
                this.errors = [{
                    Errors: [resources.get('Unexpected error')]
                }];
            }
        }

        if (data != null && data.status == "401") {
            this.errors = [{
                Errors: [resources.get('Unauthorized error user')]
            }];
        }
    }
});

hbsis.wms.FormErrorHandler = Class.extend({
    init: function (form, data) {
        this.form = $(form);
        this.results = new hbsis.wms.ErrorHandler(data);

        var alert = "<div class=\"alert alert-danger alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>";

        if (this.results.hasErrors()) {
            alert += "<ul>";
            for (var i = 0; i < this.results.errors.length; i++) {
                alert += "<li>" + this.results.errors[i].Errors[0] + "</li>";
            }
            alert += "</ul></div>";
            this.form.prepend(alert);
        }
    }
});

hbsis.wms.Loader = Class.extend({
    loadingId: '#loading-mask',
    init: function (opts) {

        this.settings = $.extend({
            /* grid */
            loading: this.loadingId,
            parent: null
        }, opts);

        this.loading = $(this.settings.loading);
        if (this.settings.parent == null || this.settings.parent == undefined) {
            this.settings.parent = this.loadingId;
        }
        this.parent = $(this.settings.parent);

        var self = this.loading.data(this.loadingId);
        if (self) {
            self.settings = this.settings;
            return self;
        }

        return this;
    },
    destroy: function () {
        var self = this;
        this.loading.fadeOut({
            duration: 'fast',
            queue: false,
            complete: function () {
                self.parent.find(self.settings.loading).appendTo('body');
            }
        });
        this.loading.data(this.loadingId, null);
    },
    show: function () {
        if (this.parent[0] != document && this.parent[0] != window) {
            this.parent.prepend(this.loading);
        }
        this.loading.fadeIn('fast');
    }
});

hbsis.wms.ConfirmDelete = Class.extend({
    defaultId: 'confirm-delete',
    init: function (opts) {

        this.settings = $.extend({
            /* grid */
            modal: '#' + this.defaultId,
            description: "",
            cancelCallback: null,
            successCallback: null,
            closeCallback: null
        }, opts);

        this.modal = $(this.settings.modal || "#" + this.defaultId);
        if (this.modal.data(this.defaultId))
            return this.modal.data(this.defaultId);

        var self = this;

        this.onSuccess = function (e) {
            if ($.isFunction(self.settings.successCallback))
                self.settings.successCallback.apply(self, [e]);
        };

        this.onCancel = function (e) {
            if ($.isFunction(self.settings.cancelCallback))
                self.settings.cancelCallback.apply(self, [e]);
        };

        this.modal.bind("hidden.bs.modal", function (e) {
            self.modal.find('.btn-success').unbind('click', self.onSuccess);
            self.modal.find('.btn-default').unbind('click', self.onCancel);

            self.clear();
            if ($.isFunction(self.settings.closeCallback))
                self.settings.closeCallback.apply(self, [e]);

            self.destroy();
        });

        this.modal.find('.btn-success').bind('click', self.onSuccess);
        this.modal.find('.btn-default').bind('click', self.onCancel);
        this.modal.data(this.defaultId, this);
    },
    clear: function () {
        this.modal.find(".details").text('');
        this.modal.find(".error").text('');
    },
    show: function () {
        this.modal.find(".details").text(this.settings.description);
        this.modal.modal('show');
    },
    hide: function () {
        this.clear();
        this.modal.modal('hide');
    },
    destroy: function () {
        this.modal.unbind("hidden.bs.modal");
        this.modal.data(this.defaultId, null);
        this.modal = null;
    },
    setError: function (results) {
        var $error = this.modal.find(".error");
        if (results.hasErrors()) {
            $error.html(results.errors[0].Errors[0]);
        }
    }
});

hbsis.wms.CrudForm = Class.extend({
    viewMarkup: "<a class=\"label label-default edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                "<i class=\"fa fa-search\"></i></a> ",
    editMarkup: "<a class=\"label label-default edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                "<i class=\"fa fa-pencil\"></i></a> ",
    deleteMarkup: "<a class=\"label label-danger delete\" href=\"#delete\">" +
                  "<i class=\"fa fa-times\"></i></a>",
    init: function (opts) {

        this.model = this.createModel();

        this.settings = $.extend({
            /* grid */
            datatableId: "#datatable",
            datatableUrl: "",
            datatableLang: "",
            editMarkup: this.editMarkup,
            actionsMarkup: this.editMarkup + this.deleteMarkup,
            deleteSelector: ".delete",
            editSelector: ".edit",
            /* create and edit operations */
            saveModal: '#save-modal',
            saveForm: '#save-form',
            onSaveSuccess: null,
            onSaveError: null,
            onChange: null,
            /* delete operations */
            deleteModal: '#confirm-delete',
            onBeforeDelete: null,
            onAfterDelete: null,
            onDeleteSuccess: null,
            onDeleteError: null,
            /* modal operations */
            onModalClose: null,
            viewMarkup: this.viewMarkup,
        }, opts);

        this.form = $(this.settings.saveForm);
        this.modal = $(this.settings.saveModal);
        this.editMode = ko.observable(false);
        this.dirty = ko.observable(false);
        this.document = $(document);

        var self = this;

        /* Trata o "Enter" no formulário */
        this.form.bind('submit', function (e) {
            self.save(e);
            return false;
        });

        /* Marca o dataTable para forçar um refresh no pipeline 
         * quando alguma operação de create/update/delete é feita
         */
        this.dirty.subscribe(function (newValue) {
            if (newValue === true && self.datatable) {
                self.datatable.clearPipeline();
            }
        });

        /* Ao fechar o modal do formulário limpa o formulário,
         * sai do modo de edição e, se foi feita alguma alteração,
         * atualiza o grid, em seguida dispara o callback
         */
        this.modal.on("hidden.bs.modal", function (e) {
            self.clearSaveForm();
            self.editMode(false);

            self.refreshDatatable();

            if ($.isFunction(self.settings.onModalClose)) {
                self.settings.onModalClose.apply(self, [self.dirty(), e]);
            }
        });

        /* Funções Privadas
         */
        this._delete = function (model, callback) {
            var confirmDeleteModal = $(self.settings.deleteModal).data('confirm-delete');

            var loader = new hbsis.wms.Loader({
                parent: confirmDeleteModal.settings.modal + " .modal-content"
            });
            loader.show();

            var deleteUrl =
                this.deleteUrl != null && this.deleteUrl != undefined ?
                this.deleteUrl(model) :
                self.form.attr('action') + "/" + model.Id;

            $.ajax({
                url: deleteUrl,
                type: "delete",
                success: function () {
                    self.dirty(true);

                    if ($.isFunction(self.settings.onDeleteSuccess))
                        self.settings.onDeleteSuccess.apply(model, arguments);

                    if ($.isFunction(self.settings.onChange))
                        self.settings.onChange.apply(model, arguments);

                    self.refreshDatatable();

                    if (confirmDeleteModal) {
                        confirmDeleteModal.hide();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    if (jqXHR.status == 302) {
                        var url = /<a href=\"(.*)\">here<\/a>/.exec(jqXHR.responseText)[1];
                        location.href = url;
                    }

                    if ($.isFunction(self.settings.onDeleteError))
                        self.settings.onDeleteError.apply(model, arguments);

                    this.results = new hbsis.wms.ErrorHandler(jqXHR);

                    if (confirmDeleteModal) {
                        confirmDeleteModal.setError(this.results);
                    }
                }
            }).always(function () {
                loader.destroy();
                delete loader;
            });
        }
        self.datatable = this.initDatatable();
    },
    /* Cria o modelo especializado
     * @virtual
     * @return Object
     */
    createModel: function () {
        return {};
    },
    /* Retorna a descrição do modelo
     * @virtual
     * @return String
     */
    getModelDescription: function (model) {
        return "";
    },
    /* Retorna a configuração da datatable
     * @virtual
     * @return Object
     */
    getDatatableConfig: function () {
        return {};
    },
    /* Inicializa a jQuery.datatables 
     * @return DataTable 
     */
    initDatatable: function () {
        var self = this;

        self.settings.dataTableConfig = self.getDatatableConfig();

        var datatable = $(self.settings.datatableId).dataTable({
            'processing': true,
            'serverSide': true,
            'ajax': $.fn.dataTable.pipeline({ url: self.settings.datatableUrl }, self.settings.dataTableConfig.data),
            "preDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 3 }),
            "createdRow": function (nRow, aData, iDataIndex) { $(nRow).attr('id', aData.Id); },
            "deferRender": true,
            "columns": self.settings.dataTableConfig.columns,
            "columnDefs": self.settings.dataTableConfig.columnDefs,
            "language": { "url": self.settings.datatableLang },
            "displayStart": self.getCurrentPage(),
            "pageLength": self.getCurrentLength(),
            "drawCallback": self.settings.dataTableConfig.drawCallback/*,
            "rowCallback": self.settings.dataTableConfig.rowCallback*/
        }).api();

        datatable = datatable.on('init.dt', function () {
            $('.dataTables_filter input').addClass('form-control').attr('placeholder', resources.get('Search...'));
            $('.dataTables_length select').addClass('form-control');
        });

        return datatable;
    },
    getCurrentPage: function () {
        var start = hbsis.wms.Helpers.querystring("Start");
        if (start != undefined && start != "") {
            return parseInt(start, 10);
        } else {
            return 0;
        }
    },
    getCurrentLength: function () {
        var length = hbsis.wms.Helpers.querystring("Length");
        if (length != undefined && length != "") {
            var length = parseInt(length, 10);
            return (length < 10) ? 10 : length;
        } else {
            return 10;
        }
    },
    refreshDatatable: function () {
        if (this.dirty() && this.datatable) {
            this.datatable.draw(false);
            this.dirty(false);
        }
    },
    applyDatabind: function (ko) {
        var self = this;

        if (self.datatable != null) {
            self.document.on("click", self.settings.datatableId + " " + self.settings.deleteSelector, function (e) {
                var row = $(this).parents('tr')[0];
                var model = self.datatable.row(row).data();
                self.delete(model);
            });
            self.document.on("click", self.settings.datatableId + " " + self.settings.editSelector, function (e) {
                var row = $(this).parents('tr')[0];
                var model = self.datatable.row(row).data();
                self.edit(model);
            });
        }

        ko.applyBindings(self);
    },
    clearSaveForm: function (obj, el) {
        if ($.isFunction(this.form.parsley)) {
            this.form.parsley('reset');
        } else if ($.isFunction(this.form.validate)) {
            this.form.trigger('reset.unobtrusiveValidation');
        }
        this.model().clear();
        this.clearErrorAlert();
    },
    clearErrorAlert: function () {
        var error = this.form.find(".alert");
        if (error.length > 0) {
            error.remove();
        }
    },
    closeSaveForm: function () {
        this.modal.modal('hide');
    },
    'delete': function (model) {
        var selectedRow = $("#" + model.Id).addClass("primary-emphasis");
        var proceed = true;

        if ($.isFunction(this.settings.onBeforeDelete)) {
            proceed = this.settings.onBeforeDelete(model);
        }

        if (proceed) {
            var description = this.getModelDescription(model);
            var self = this;

            new hbsis.wms.ConfirmDelete({
                modal: self.settings.deleteModal,
                description: description,
                cancelCallback: null,
                successCallback: function (e) {
                    self._delete(model);
                },
                closeCallback: function (e) {
                    selectedRow.removeClass("primary-emphasis");
                }
            }).show();
        }
    },
    getFormData: function () {
        return this.form.serialize();
    },
    save: function (e) {
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
        var url = this.form.attr('action') + (this.editMode() ? "/" + id : "");
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
    edit: function (model) {
        this.model().load(model);
        this.editMode(true);
    }
});

hbsis.wms.Helpers = {
    querystring: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", "i");
        var results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    renderAddress: function (address) {
        if (!address)
            return "";

        return address.Street + (address.Number ? ", " + address.Number : "") + (address.District ? " - " + address.District : "") +
        (address.Zip || address.City ? "<br/>" : "") + (address.Zip || address.City) + (address.Zip ? " - " + address.City : "") +
        (address.State || address.Country ? "<br/>" : "") + (address.State || resources[address.Country] || address.Country) + (address.State ? "/" + (resources.get(address.Country)) : "") +
        "<br/>(<a href=\"https://www.google.com/maps/place/" + (address.Street || "") + ", " + (address.Number || "") + ", " + (address.District || "") +
        ", " + (address.Zip || "") + ", " + (address.City || "") + ", " + (address.State || "") + ", " + (resources.get(address.Country) || "") + "\" target=\"_blank\">" + resources.get("SeeOnMap") + "</a>)";
    },
    renderContact: function (contact) {
        if (!contact)
            return "";

        var content = "";
        if (contact.Name) {
            if (contact.Email) {
                content += "<a href=\"mailto://" + contact.Email + "\">" + contact.Name + "</a>";
            } else {
                content += "" + contact.Name + "";
            }
            if (contact.Phone)
                content += "<br/>";
        }
        if (contact.Phone) {
            content += "<a href=\"callto://" + contact.Phone + "\" >" + contact.Phone + "</a> ";
        }
        return content;
    },
    initDatetimePicker: function (opts) {
        $(opts.id).datetimepicker(opts.config);
    },
    initDatetimeRangePicker: function (opts) {

        var ranges = {};
        ranges[resources.get('Today')] = [moment(), moment()];
        ranges[resources.get('Tomorrow')] = [moment().add(1, 'days'), moment().add(1, 'days')];
        ranges[resources.get('Yesterday')] = [moment().subtract('days', 1), moment().subtract('days', 1)],
        ranges[resources.get('Last 7 Days')] = [moment().subtract('days', 6), moment()],
        ranges[resources.get('Last 30 Days')] = [moment().subtract('days', 29), moment()],
        ranges[resources.get('This Month')] = [moment().startOf('month'), moment().endOf('month')],
        ranges[resources.get('Last Month')] = [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]

        var settings = $.extend(true, {
            field: "",
            config: {
                ranges: ranges,
                startDate: moment(),
                endDate: moment(),
                opens: 'right',
                ranges: ranges,
                buttonClasses: ['btn btn-default'],
                applyClass: 'btn-small btn-primary',
                cancelClass: 'btn-small',
                format: resources.get('SmallDateFormat'),
                separator: resources.get(' to '),
                locale: {
                    applyLabel: resources.get('Submit'),
                    cancelLabel: resources.get('Clear'),
                    fromLabel: resources.get('From'),
                    toLabel: resources.get('To'),
                    customRangeLabel: resources.get('Custom')
                }
            },
            callback: null
        }, opts);

        settings.defaultValue = settings.config.startDate.format('MMMM D, YYYY') + ' - ' +
            settings.config.endDate.format('MMMM D, YYYY');

        $(settings.field + ' span').html(settings.defaultValue);

        $(settings.field).daterangepicker(settings.config, function (start, end) {

            $(settings.field + ' span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            if ($.isFunction(settings.callback))
                settings.callback(start, end);
        });
    },

    initAutoCompleteEnum: function (opts) {
        var settings = $.extend({
            field: "",
            placeholder: resources.get('Search...')
        }, opts);

        var field = $(settings.field);
        if (field.length > 0) {
            if (field.find('option:first').val() != '')
                field.prepend($("<option value=''></option>"));

            field.select2({
                placeholder: settings.placeholder,
                width: '100%',
                allowClear: true
            });
        }
    },

    formatarDataDDMMYYYYHHMMSS: function (valor) {

        var data = new Date(valor);

        var dia = data.getDate();
        if (dia.toString().length == 1)
            dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length == 1)
            mes = "0" + mes;
        var ano = data.getFullYear();

        var resultadoFormatado = dia + "/" + mes + "/" + ano + " - " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

        return resultadoFormatado;
    },
    formatarDataDDMMYYYY: function (valor) {
        return new moment(valor).format(resources.get('SmallDateFormat'));
    },
    formatarValorMonetarioSemCifrao: function (valor, decimals) {
        return hbsis.wms.Helpers.formatarValorDecimal(valor, decimals).replace('.', resources.get('DecimalSeparator'));
    },
    formatarValorMonetario: function (valor, decimals) {
        return resources.get('$') + ' ' + hbsis.wms.Helpers.formatarValorDecimal(valor, decimals).replace('.', resources.get('DecimalSeparator'));
    },
    formatarValorDecimal: function (valor, decimals) {
        var resultado = parseFloat(valor);
        if (isNaN(resultado)) {
            return "";
        }
        return resultado.toFixed(decimals || 2);
    }
};

/*!
 * jQuery toDictionary() plugin
 *
 * Version 1.2 (11 Apr 2011)
 *
 * Copyright (c) 2011 Robert Koritnik
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (b) { if (b.isFunction(String.prototype.format) === false) { String.prototype.format = function () { var d = this; var c = arguments.length; while (c--) { d = d.replace(new RegExp("\\{" + c + "\\}", "gim"), arguments[c]) } return d } } if (b.isFunction(Date.prototype.toISOString) === false) { Date.prototype.toISOString = function () { var c = function (g, d) { g = g.toString(); for (var f = g.length; f < d; f++) { g = "0" + g } return g }; var e = this; return "{0}-{1}-{2}T{3}:{4}:{5}.{6}Z".format(e.getUTCFullYear(), c(e.getUTCMonth() + 1, 2), c(e.getUTCDate(), 2), c(e.getUTCHours(), 2), c(e.getUTCMinutes(), 2), c(e.getUTCSeconds(), 2), c(e.getUTCMilliseconds(), 3)) } } var a = function (d, c, f, e) { if (b.isPlainObject(d)) { for (var g in d) { if (e === true || typeof (d[g]) !== "undefined" && d[g] !== null) { a(d[g], c, f.length > 0 ? f + "." + g : g, e) } } } else { if (b.isArray(d)) { b.each(d, function (i, j) { a(j, c, "{0}[{1}]".format(f, i)) }); return } if (!b.isFunction(d)) { if (d instanceof Date) { c.push({ name: f, value: d.toISOString() }) } else { var h = typeof (d); switch (h) { case "boolean": case "number": h = d; break; case "object": if (e !== true) { return } default: h = d || "" } c.push({ name: f, value: h }) } } } }; b.extend({ toDictionary: function (f, e, d) { f = b.isFunction(f) ? f.call() : f; if (arguments.length === 2 && typeof (e) === "boolean") { d = e; e = "" } d = typeof (d) === "boolean" ? d : false; var c = []; a(f, c, e || "", d); return c } }) })(jQuery);



$(function () {

    window.onunload = function () {
        new hbsis.wms.Loader({
            parent: 'body'
        }).show();
    }

    // Seleciona a opção ativa no menu
    $("#main-menu a[href='" + location.pathname + "']").parent("li").addClass("active");

    if ($.validator) {
        $.validator.setDefaults({
            ignore: ".ignore",
            highlight: function (element, errorClass, validClass) {
                $(element).closest(":input")
                    .addClass("field-validation-error");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).closest(":input")
                    .removeClass("field-validation-error");
            }
        });
    }

    //Functions
    function toggleSideBar() {
        var b = $("#sidebar-collapse")[0];
        var w = $("#cl-wrapper");
        var s = $(".cl-sidebar");

        if (w.hasClass("sb-collapsed")) {
            $(".fa", b).addClass("fa-angle-left").removeClass("fa-angle-right");
            w.removeClass("sb-collapsed");
        } else {
            $(".fa", b).removeClass("fa-angle-left").addClass("fa-angle-right");
            w.addClass("sb-collapsed");
        }
    }

    /*VERTICAL MENU*/
    $(".cl-vnavigation li ul").each(function () {
        $(this).parent().addClass("parent");
    });

    $(".cl-vnavigation li ul li.active").each(function () {
        $(this).parent().css({ 'display': 'block' });
        $(this).parent().parent().addClass("open");
    });

    $('.cl-vnavigation li > a').on('click', function (e) {
        if ($(this).next().hasClass('sub-menu') === false) {
            return;
        }
        var parent = $(this).parent().parent();
        parent.children('li.open').children('a').children('.arrow').removeClass('open');
        parent.children('li.open').children('a').children('.arrow').removeClass('active');
        parent.children('li.open').children('.sub-menu').slideUp(200);
        parent.children('li').removeClass('open');
        if ($('#cl-wrapper').hasClass('sb-collapsed') === false) {
            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("active");
                sub.slideUp(200, function () {
                    handleSidebarAndContentHeight();
                });
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(200, function () {
                    handleSidebarAndContentHeight();
                });
            }
        }
        e.preventDefault();
    });

 //Auto close open menus in Condensed menu
    if ($('#cl-wrapper').hasClass('sb-collapsed')) {
        var elem = $('.cl-sidebar ul');
        elem.children('li.open').children('a').children('.arrow').removeClass('open');
        elem.children('li.open').children('a').children('.arrow').removeClass('active');
        elem.children('li.open').children('.sub-menu').slideUp(0);
        elem.children('li').removeClass('open');
    }

 var handleSidebarAndContentHeight = function () {
        var content = $('.page-content');
        var sidebar = $('.cl-vnavigation');

        if (!content.attr("data-height")) {
            content.attr("data-height", content.height());
        }

        if (sidebar.height() > content.height()) {
            content.css("min-height", sidebar.height() + 120);
        } else {
            content.css("min-height", content.attr("data-height"));
        }
    };

    /*Small devices toggle*/
    $(".cl-toggle").click(function (e) {
        var ul = $(".cl-vnavigation");
        ul.slideToggle(300, 'swing', function () {
        });
        e.preventDefault();
    });

    /*Collapse sidebar*/
    $("#sidebar-collapse").click(function () {
        toggleSideBar();
    });


    if ($("#cl-wrapper").hasClass("fixed-menu")) {
        var scroll = $("#cl-wrapper .menu-space");
        scroll.addClass("nano nscroller");

        function update_height() {
            var button = $("#cl-wrapper .collapse-button");
            var collapseH = button.outerHeight();
            var navH = $("#head-nav").height();
            var height = $(window).height() - ((button.is(":visible")) ? collapseH : 0);
            scroll.css("height", height);
            $("#cl-wrapper .nscroller").nanoScroller({ preventPageScrolling: true });
        }

        $(window).resize(function () {
            update_height();
        });

        update_height();
        $("#cl-wrapper .nscroller").nanoScroller({ preventPageScrolling: true });
    }

    /*SubMenu hover */
    var tool = $("<div id='sub-menu-nav' style='position:fixed;z-index:9999;'></div>");

    function showMenu(_this, e) {
        if (($("#cl-wrapper").hasClass("sb-collapsed") || ($(window).width() > 755 && $(window).width() < 963)) && $("ul", _this).length > 0) {
            $(_this).removeClass("ocult");
            var menu = $("ul", _this);
            if (!$(".dropdown-header", _this).length) {
                var head = '<li class="dropdown-header">' + $(_this).children().html() + "</li>";
                menu.prepend(head);
            }

            tool.appendTo("body");
            var top = ($(_this).offset().top + 8) - $(window).scrollTop();
            var left = $(_this).width();

            tool.css({
                'top': top,
                'left': left + 8
            });
            tool.html('<ul class="sub-menu">' + menu.html() + '</ul>');
            tool.show();

            menu.css('top', top);
        } else {
            tool.hide();
        }
    }

    $(".cl-vnavigation li").hover(function (e) {
        showMenu(this, e);
    }, function (e) {
        tool.removeClass("over");
        setTimeout(function () {
            if (!tool.hasClass("over") && !$(".cl-vnavigation li:hover").length > 0) {
                tool.hide();
            }
        }, 500);
    });

    tool.hover(function (e) {
        $(this).addClass("over");
    }, function () {
        $(this).removeClass("over");
        tool.fadeOut("fast");
    });


    $(document).click(function () {
        tool.hide();
    });
    $(document).on('touchstart click', function (e) {
        tool.fadeOut("fast");
    });

    tool.click(function (e) {
        e.stopPropagation();
    });

    $(".cl-vnavigation li").click(function (e) {
        if ((($("#cl-wrapper").hasClass("sb-collapsed") || ($(window).width() > 755 && $(window).width() < 963)) && $("ul", this).length > 0) && !($(window).width() < 755)) {
            showMenu(this, e);
            e.stopPropagation();
        }
    });

    /*Return to top*/
    var offset = 220;
    var duration = 500;
    var button = $('<a href="#" class="back-to-top"><i class="fa fa-angle-up"></i></a>');
    button.appendTo("body");

    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top').fadeIn(duration);
        } else {
            jQuery('.back-to-top').fadeOut(duration);
        }
    });

    jQuery('.back-to-top').click(function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    });

    /*Side Chat*/
    $('.toggle-menu').jPushMenu();

    /*Datepicker UI*/
    $(".ui-datepicker").datepicker();

    /*Tooltips*/
    $('.ttip, [data-toggle="tooltip"]').tooltip();

    /*Popover*/
    $('[data-popover="popover"]').popover();

    /*NanoScroller*/
    $(".nscroller").nanoScroller();


    /*Bind plugins on hidden elements*/
    /*Dropdown shown event*/
    $('.dropdown').on('shown.bs.dropdown', function () {
        $(".nscroller").nanoScroller();
    });

    /*Tabs refresh hidden elements*/
    $('.nav-tabs').on('shown.bs.tab', function (e) {
        $(".nscroller").nanoScroller();
    });
});

$(function () {

    //flag que indica quando um binding não deve ser aplicado
    ko.bindingHandlers.stopBinding = {
        init: function () {
            return { controlsDescendantBindings: true };
        }
    }
    ko.virtualElements.allowedBindings.stopBinding = true;

    /**
     * Knockout binding handler for bootstrapSwitch indicating the status
     * of the switch (on/off): https://github.com/nostalgiaz/bootstrap-switch
     */
    if ($.isFunction($.fn.bootstrapSwitch)) {

        function _isDisabled(allBindingsAccessor) {
            if (allBindingsAccessor().disable) {
                return allBindingsAccessor().disable();
            }
            return false;
        }

        ko.bindingHandlers.bootstrapSwitchOn = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                $(element).bootstrapSwitch();
                $(element).bootstrapSwitch('onText', 'Sim');
                $(element).bootstrapSwitch('offText', 'N&atilde;o');
                var state = $(element).bootstrapSwitch('state') != ko.utils.unwrapObservable(valueAccessor());
                if (state) {
                    $(element).bootstrapSwitch('toggleState');
                }
                $(element).on('switchChange.bootstrapSwitch', function (e, data) {
                    valueAccessor()(data);
                });
                $(element).bootstrapSwitch('disabled', _isDisabled(allBindingsAccessor));
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var vmStatus = ko.utils.unwrapObservable(valueAccessor());
                var vStatus = $(element).bootstrapSwitch('state');
                if (vStatus != vmStatus) {
                    $(element).bootstrapSwitch('toggleState');
                }
                $(element).bootstrapSwitch('disabled', _isDisabled(allBindingsAccessor));
            }
        };
    }

    //função de formatação padrão
    ko.observable.fn.formatacaoMonetaria = function (decimals) {
        var observable = this;
        observable.decimals = decimals;
        observable.formatado = ko.computed({
            read: function (key) {
                return hbsis.wms.Helpers.formatarValorMonetario(observable(), observable.decimals);
            },
            write: function (value) {
                observable(hbsis.wms.Helpers.formatarValorDecimal(value, observable.decimals));
            }
        });

        return observable;
    }

    //função de formatação padrão
    ko.observable.fn.formatacaoMonetariaSemCifrao = function (decimals) {
        var observable = this;
        observable.decimals = decimals;
        observable.formatado = ko.computed({
            read: function (key) {
                return hbsis.wms.Helpers.formatarValorMonetarioSemCifrao(observable(), observable.decimals);
            },
            write: function (value) {
                observable(hbsis.wms.Helpers.formatarValorDecimal(value, observable.decimals));
            }
        });

        return observable;
    }

    ko.computed.fn.formatacaoMonetariaSemCifrao = ko.observable.fn.formatacaoMonetariaSemCifrao;
    ko.computed.fn.formatacaoMonetaria = ko.observable.fn.formatacaoMonetaria;

    if ($('body').hasClass('animated')) {
        $("#cl-wrapper").css({ opacity: 1, 'margin-left': 0 });
    }

    /*Porlets Actions*/
    $('.minimize').click(function (e) {
        var h = $(this).parents(".header");
        var c = h.next('.content');
        var p = h.parent();

        c.slideToggle();

        p.toggleClass('closed');

        e.preventDefault();
    });

    $('.refresh').click(function (e) {
        var h = $(this).parents(".header");
        var p = h.parent();
        var loading = $('<div class="loading"><i class="fa fa-refresh fa-spin"></i></div>');

        loading.appendTo(p);
        loading.fadeIn();
        setTimeout(function () {
            loading.fadeOut();
        }, 1000);

        e.preventDefault();
    });

    $('.close-down').click(function (e) {
        var h = $(this).parents(".header");
        var p = h.parent();

        p.fadeOut(function () {
            $(this).remove();
        });
        e.preventDefault();
    });
    /*End of porlets actions*/

    /*Chat*/

    $('.side-chat .content .contacts li a').click(function (e) {
        var user = $('<span>' + $(this).html() + '</span>');
        user.find('i').remove();

        $('#chat-box').fadeIn();
        $('#chat-box .header span').html(user.html());
        $("#chat-box .nano").nanoScroller();
        $("#chat-box .nano").nanoScroller({ scroll: 'top' });
        e.preventDefault();
    });

    $('#chat-box .header .close').click(function (r) {
        var h = $(this).parents(".header");
        var p = h.parent();

        p.fadeOut();
        r.preventDefault();
    });

    function addText(input) {
        var message = input.val();
        var chat = input.parents('#chat-box').find('.content .conversation');

        if (message != '') {
            input.val('');
            chat.append('<li class="text-right"><p>' + message + '</p></li>');
            $("#chat-box .nano .content").animate({ scrollTop: $("#chat-box .nano .content .conversation").height() }, 1000);
        }
    }


    $('.chat-input .input-group button').click(function () {
        addText($(this).parents('.input-group').find('input'));
    });

    $('.chat-input .input-group input').keypress(function (e) {
        if (e.which == 13) {
            addText($(this));
        }
    });

    $(document).click(function () {
        $('#chat-box').fadeOut();
    });
});