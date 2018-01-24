//forms
; (function ($) {
    $.fn.forms = function (o) {
        return this.each(function () {
            var th = $(this),
                _ = th.data('forms') || {
                    errorDiv: '#' + th.attr('id') + "-error",
                    validate: true,
                    trigger: null,
                    triggerEvent: null,
                    loaderOptions: undefined,
                    ajaxOptions: undefined,
                    ajaxOptionsOriginal: {},
                    rx: {
                        ".name": { rx: /^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/, target: 'input' },
                        ".state": { rx: /^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/, target: 'input' },
                        ".email": { rx: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i, target: 'input' },
                        ".phone": { rx: /^\+?(\d[\d\-\+\(\) ]{5,}\d$)/, target: 'input' },
                        ".fax": { rx: /^\+?(\d[\d\-\+\(\) ]{5,}\d$)/, target: 'input' },
                        ".message": { rx: /.{20}/, target: 'textarea' }
                    },
                    removerErroTexto: function () {
                        var $this = $(this);
                        if ($this.val().length > 0) {
                            var controlGroup = $this.parents('.control-group');
                            controlGroup.removeClass('error');
                            controlGroup.find('span.help-inline').hide();
                            $(this).unbind('keyup', _.removerErroTexto);
                        }
                    },
                    removerErroCheck: function () {
                        var $this = $(this);
                        var controlGroup = $this.parents('.control-group');
                        if (controlGroup.find('input:checked').length > 0) {
                            controlGroup.removeClass('error');
                            controlGroup.find('span.help-inline').hide();
                            controlGroup.find('input[type="' + $this.attr('type') + '"]').unbind('change', _.removerErroCheck);
                        }
                    },
                    tratarErros: function (request) {
                        if (!request.error)
                            return;

                        var errors = request.error;
                        var generalErrors = [];
                        if (request.message) {
                            generalErrors.push(request.message);
                        } else {
                            for (id in errors) {
                                if (errors.hasOwnProperty(id)) {
                                    var field = $('#' + id);
                                    if (field.length > 0) {
                                        var controlGroup = field.parents('.control-group');
                                        controlGroup.find('span.help-inline')
                                            .html('* ' + errors[id])
                                            .show();
                                        controlGroup.addClass('error');
                                        if (field.attr('type') == 'radio' || field.attr('type') == 'checkbox') {
                                            controlGroup.find('input[type="' + field.attr('type') + '"]').bind('change', _.removerErroCheck);
                                        } else {
                                            field.bind('keyup', _.removerErroTexto);
                                        }
                                    } else {
                                        generalErrors.push(errors[id]);
                                    }
                                }
                            }
                        }
                        if (generalErrors.length > 0 && $(_.errorDiv).length > 0) {
                            var alert = $("<div class=\"alert alert-error\">" +
                                "<a class=\"close\" data-dismiss=\"alert\" href=\"#\">&times;</a>" +
                                "<b>Erro!</b>" +
                                "&nbsp;" + generalErrors.join('<br/>') + "</span>");

                            $(_.errorDiv).append(alert);
                            $(_.errorDiv + " > div").alert();
                        }
                    },
                    validateForm: function () {
                        return;
                    },
                    ajaxOnBeforeSend: function (jqXHR, settings) {
                        _.form.loading(_.loaderOptions);
                        $('#loading-mask').fadeIn('slow');
                        _.ajaxOptionsOriginal.beforeSend && _.ajaxOptionsOriginal.beforeSend(jqXHR, settings);
                    },
                    ajaxOnComplete: function (jqXHR, textStatus) {
                        _.form.loading('destroy');
                        _.ajaxOptionsOriginal.complete && _.ajaxOptionsOriginal.complete(jqXHR, textStatus);
                    },
                    ajaxOnSuccess: function (data, textStatus, jqXHR) {
                        if (data.error) {
                            _.tratarErros(data);
                        } else {
                            _.ajaxOptionsOriginal.success && _.ajaxOptionsOriginal.success(data, textStatus, jqXHR);
                        }
                    },
                    ajaxOnError: function (jqXHR, textStatus, errorThrown) {
                        try {
                            var data = JSON.parse(jqXHR.responseText);
                            if (data.error) {
                                _.tratarErros(data);
                            } else {
                                _.ajaxOptionsOriginal.error && _.ajaxOptionsOriginal.error(jqXHR, textStatus, errorThrown);
                            }
                        } catch (e) {
                            _.ajaxOptionsOriginal.error && _.ajaxOptionsOriginal.error(jqXHR, textStatus, errorThrown);
                        }
                    },
                    ajaxSubmit: function () {
                        _.ajaxOptions.data = _.form.serialize();
                        _.ajaxOptions.headers = { Accept: "application/json" };
                        $.ajax(_.ajaxOptions)
                    },
                    onFormSubmit: function () {
                        var tiny = window.tinymce || false;
                        if (tiny)
                            tinymce.triggerSave();

                        $(_.errorDiv).html('');
                        _.form.find('.error').removeClass('error');
                        if (_.validate) {
                            _.validateForm();
                        }

                        if (_.onSubmit && typeof _.onSubmit === 'function')
                            _.onSubmit();

                        if (_.ajaxOptions)
                            _.ajaxSubmit();
                        else
                            _.form[0].submit();

                        return false;
                    },
                    onFormReset: function () {
                        _.form.find('.error').removeClass('error');
                        if (_.onReset && typeof _.onReset === 'function')
                            _.onReset();
                    },
                    init: function () {
                        _.form = _.me

                        if (_.trigger == null || _.triggerEvent == null || $(_.trigger).length == 0) {
                            _.form
                                .bind('submit', _.onFormSubmit)
                                .bind('reset', _.onFormReset);
                        } else {
                            $(_.trigger).bind(_.triggerEvent, _.onFormSubmit);
                        }

                        if (_.ajaxOptions) {
                            _.ajaxOptionsOriginal = $.extend({}, _.ajaxOptions);

                            if (!_.ajaxOptions.url)
                                _.ajaxOptions.url = _.form[0].action;
                            if (!_.ajaxOptions.type)
                                _.ajaxOptions.type = _.form[0].method;

                            _.ajaxOptions.beforeSend = _.ajaxOnBeforeSend;
                            _.ajaxOptions.complete = _.ajaxOnComplete;
                            _.ajaxOptions.success = _.ajaxOnSuccess;
                            _.ajaxOptions.error = _.ajaxOnError;
                        }
                    }
                }
            typeof o == 'object' && $.extend(_, o)
            _.me || _.init(_.me = th.data({ forms: _ }))
        })
    }
})(jQuery);