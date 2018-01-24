var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.UsuarioHabilitadoModel = Class.extend({
    init: function (usuario) {
        this.Id = usuario.Id;
        this.Nome = usuario.Name;
    }
});

hbsis.wms.settings.UsuariosHabilitadosModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.UsuariosHabilitados = ko.observableArray([]);
        this.UsuariosHabilitadosIds = ko.observableArray([]);
        this.UsuariosDisponiveis = ko.observableArray([]);
    },
    clear: function () {
        this.Id('');
        this.CodigoArmazem('');
        this.UsuariosHabilitados([]);
    },
    load: function (model) {
        this.Id(model.Id);
        this.CodigoArmazem(model.CodigoArmazem);

        var self = this;

        this.UsuariosHabilitados($.map(model.UsuariosHabilitados, function (el) {
            return $.grep(self.UsuariosDisponiveis(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.UsuariosHabilitadosIds($.map(this.UsuariosHabilitados(), function (el) {
            return el.Id;
        }));
    }
});

hbsis.wms.settings.UsuariosHabilitadosViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initProcessMultiSelect("#UsuariosHabilitados", this.settings.userAutocompleteUrl);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.UsuariosHabilitadosModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#UsuariosHabilitados").multiSelect('refresh');
        
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#UsuariosHabilitados").multiSelect('refresh');
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
                { "mData": "CodigoArmazem" },
                { "mData": null },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.CodigoArmazem;
                    }
                },
                {
                    "aTargets": [1],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        return 'Usuários TaskInterleaving';
                    }
                },
                {
                    "aTargets": [2],
                    "mData": null,
                    "sDefaultContent": self.settings.editMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
    },
    getFormData: function () {
        var self = this;
        this.model().UsuariosHabilitados($.map(this.model().UsuariosHabilitadosIds(), function (el) {
            return $.grep(self.model().UsuariosDisponiveis(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    initProcessMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Name', direction: 'asc' },
            dataType: 'json',
            success: function(data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var usuarioHabilitado = $.map(data.Rows, function(el) {
                        return new hbsis.wms.settings.UsuarioHabilitadoModel(el);
                    });
                    self.model().UsuariosDisponiveis(usuarioHabilitado);
                    $(field).multiSelect();
                }
            }
        });
    }
});