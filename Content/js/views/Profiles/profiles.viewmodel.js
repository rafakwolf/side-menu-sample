var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.FuncaoModel = Class.extend({
    init: function (funcao) {
        this.Codigo = funcao.Codigo;
        this.Descricao = funcao.Descricao;
    }
});


hbsis.wms.settings.RoleModel = Class.extend({
    init: function (role) {
        this.Codigo = role.Codigo;
        this.Descricao = role.Descricao;
    }
});

hbsis.wms.settings.MenuModel = Class.extend({
    init: function (menu) {
        if (!menu) {
            this.Id = '';
            this.Title = '---';
        } else {
            this.Id = menu.Id;
            this.Title = menu.Title;
        }
    }
});

hbsis.wms.settings.ProfileModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Enabled = ko.observable();
        this.MenuId = ko.observable();
        this.TipoAcesso = ko.observable();

        this.Funcoes = ko.observable([]);
        this.FuncoesDisponiveis = ko.observableArray([]);
        this.FuncoesIds = ko.observableArray([]);
        
        this.Roles = ko.observable([]);
        this.RolesDisponiveis = ko.observableArray([]);
        this.RolesIds = ko.observableArray([]);
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Enabled(false);
        this.MenuId('');
        this.TipoAcesso('');

        this.Funcoes([]);
        this.FuncoesIds([]);

        this.Roles([]);
        this.RolesIds([]);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Enabled(model.Enabled);
        this.MenuId(model.MenuId);
        this.TipoAcesso(model.TipoAcesso);

        var self = this;
        
        this.Funcoes($.map(model.Funcoes, function (el) {
            return $.grep(self.FuncoesDisponiveis(), function (el2) {
                return el.Codigo == el2.Codigo;
            })[0];
        }));

        this.FuncoesIds($.map(this.Funcoes(), function (el) {
            return el.Codigo;
        }));



        this.Roles($.map(model.Roles, function (el) {
            return $.grep(self.RolesDisponiveis(), function (el2) {
                return el.Codigo == el2.Codigo;
            })[0];
        }));

        this.RolesIds($.map(this.Roles(), function (el) {
            return el.Codigo;
        }));
    }
});

hbsis.wms.settings.ProfilesViewModel = hbsis.wms.CrudForm.extend({
    init: function(opts) {
        this._super(opts);
        this.initAutocomplete("#MenuId", this.settings.menuAutocompleteUrl, this.renderMenu);
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#TipoAcesso" });

        this.initProcessMultiSelect("#Funcoes", this.settings.funcaoAutocompleteUrl);
        this.initRolesMultiSelect("#Roles", this.settings.roleAutocompleteUrl);
    },
    createModel: function() {
        return ko.observable(new hbsis.wms.settings.ProfileModel());
    },
    getModelDescription: function(model) {
        return model.Name;
    },
    renderMenu: function(s) {
        return s.Title;
    },
    clearSaveForm: function() {
        this._super();
        $("#MenuId").select2("val", "", true);
        $("#TipoAcesso").select2("val", "", true);
        $("#Funcoes").multiSelect('refresh');
        $("#Roles").multiSelect('refresh');
        
    },
    edit: function(model) {
        this._super(model);
        $("#MenuId").select2("val", $("#MenuId").val(), true);
        $("#TipoAcesso").select2("val", $("#TipoAcesso").val(), true);
        $("#Funcoes").multiSelect('refresh');
        $("#Roles").multiSelect('refresh');
    },
    getFormData: function() {
        var self = this;

        this.model().Funcoes($.map(this.model().FuncoesIds(), function (el) {
            return $.grep(self.model().FuncoesDisponiveis(), function (el2) {
                return el == el2.Codigo;
            })[0];
        }));


        this.model().Roles($.map(this.model().RolesIds(), function (el) {
            return $.grep(self.model().RolesDisponiveis(), function (el2) {
                return el == el2.Codigo;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },

    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
                { "mData": "Name" },
                { "mData": "Enabled" },
                { "mData": "MenuTitle" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [1],
                    "bSortable": true,
                    "mRender": function(data, type, row) {
                        return resources.get(row.Enabled);
                    }
                },
                {
                    "aTargets": [2],
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return resources.get(row.MenuTitle);
                    }
                },
                {
                    "aTargets": [3],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
    },
    initAutocomplete: function(field, autocompleteUrl, render) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function(term, page) {
                    return {
                        search: term,
                        start: 0,
                        length: 10
                    };
                },
                results: function(data, page) {
                    return { results: data.Rows };
                }
            },
            id: function(data) { return data.Id; },
            initSelection: function(element, callback) {
                var id = $(element).val();
                if (id !== "") {
                    $.ajax(autocompleteUrl + "/" + id, {
                        dataType: "json"
                    }).done(function(data) { callback(data); });
                }
            },
            width: '100%',
            formatResult: render,
            formatSelection: render,
            allowClear: true,
            escapeMarkup: function(m) { return m; }
        });
    },
    initProcessMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Descricao', direction: 'asc' },
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var funcoes = $.map(data.Rows, function (el) {
                        return new hbsis.wms.settings.FuncaoModel(el);
                    });
                    self.model().FuncoesDisponiveis(funcoes);
                    $(field).multiSelect();
                }
            }
        });
    },
    initRolesMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Descricao', direction: 'asc' },
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var roles = $.map(data.Rows, function (el) {
                        return new hbsis.wms.settings.RoleModel(el);
                    });
                    self.model().RolesDisponiveis(roles);
                    $(field).multiSelect();
                }
            }
        });
    }
});