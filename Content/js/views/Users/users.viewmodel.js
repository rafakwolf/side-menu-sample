var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.UserModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Shortname = ko.observable();
        this.WarehouseId = ko.observable();
        this.Enabled = ko.observable();
        this.Administrador = ko.observable();
        this.AdministradorCentral = ko.observable();
        this.ProfileId = ko.observable();
        this.ZoneId = ko.observable();
        this.Login = ko.observable();
        this.Email = ko.observable();
        this.Password = ko.observable();
        this.Terminus = ko.observable();
        this.Cpf = ko.observable();
        this.Language = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.Shortname('');
        this.WarehouseId('');
        this.Enabled(true);
        this.Administrador(false);
        this.AdministradorCentral(false);
        this.ProfileId('');
        this.ZoneId('');
        this.Login('');
        this.Email('');
        this.Password('');
        this.Terminus('');
        this.Cpf('');
        this.Language('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.Shortname(model.Shortname);
        this.WarehouseId(model.WarehouseId);
        this.Enabled(model.Enabled);
        this.Administrador(model.Administrador);
        this.AdministradorCentral(model.AdministradorCentral);
        this.ProfileId(model.ProfileId);
        this.ZoneId(model.ZoneId);
        this.Login(model.Login);
        this.Email(model.Email);
        this.Password(model.Password);
        this.Terminus(model.Terminus);
        this.Cpf(model.Cpf);
        this.Language(model.Language);
    }
});

hbsis.wms.settings.UserViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ProfileId", this.settings.profileAutocompleteUrl, this.renderProfile);
        this.initAutocomplete("#ZoneId", this.settings.zoneAutoCompleteUrl, this.renderZone);
        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Language"
        });

        this.verificarAdministrador = function () {
            return this.settings.administrador;
        };
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.UserModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderProfile: function (profile) {
        return profile.Name;
    },
    renderZone: function (zone) {
        return zone.Name;
    },
    clearSaveForm: function () {
        this._super();
        $("#WarehouseId").select2("val", "", true);
        $("#ProfileId").select2("val", "", true);
        $("#ZoneId").select2("val", "", true);

        $("#Language").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ProfileId").select2("val", $("#ProfileId").val(), true);
        $("#ZoneId").select2("val", $("#ZoneId").val(), true);

        $("#Language").select2("val", $("#Language").val(), true);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "WarehouseName" },
              { "mData": "Name" },
              { "mData": "Cpf"},
              { "mData": "Login" },
              { "mData": "ProfileName" },
              { "mData": "ZoneName" },
              { "mData": "Enabled" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [7],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {

                      var html = "";
                      if (self.verificarAdministrador())
                          html = "<a class=\"label label-primary edit\" href=\"javascript:;\" onclick=\"RedefinirSenha('" + row.Id + "')\" id=\"botao-desbloqueio\" style=\"margin-left:3px\">" +
                              "<i class=\"fa fa-unlock\"></i></a> ";
                      return self.settings.actionsMarkup + html;
                  }
              },
              {
                  "aTargets": [6],
                  "mData": null,
                  "bSearchable": true,
                  "mRender": function (data, type, row) {
                      return resources.get(row.Enabled + "");
                  }
              },
              {
                  "aTargets": [4],
                  "mData": null,
                  "mRender": function (data, type, row) {
                      return row.ProfileName;
                  }
              },
              {
                  "aTargets": [5],
                  "mData": null,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      if (row.ZoneName != null)
                          return row.ZoneName;
                      else
                          return "-";
                  }
              },
              {
                  "aTargets": [0],
                  "mData": null,
                  "mRender": function (data, type, row) {
                      return row.WarehouseName;
                  }
              },
              {
                  "aTargets": [1],
                  "mData": null,
                  "mRender": function (data, type, row) {
                      return row.Name + " (" + row.Shortname + ")" +
                          (row.Email ? "</br><a href='mailto:" + row.Email + "'>" + row.Email + "</a>" : "");
                  }
              }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, searchRequestData) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 3,
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {
                    if (searchRequestData) {
                        return searchRequestData(term, page);
                    }
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
        return $.toDictionary(ko.toJS(this.model()));
    }
});

function DesassociarBalanca(id) {
    $.ajax({
        type: "POST",
        data: { balancaId: id },
        url: window.location.href + '/DesassociarBalanca/' + id,
        success: function (data, textStatus, jqXHR) {
            window.location.reload();
        }
    });
}


function RedefinirSenha(id) {
    RemoverMensagens();
    $.ajax({
        type: "POST",
        headers: {
            'Authorization': $.cookie("token")
        },
        url: window.location.protocol + '//' + window.location.hostname + ':8001/wms/api-gateway/autenticacao/usuario/' + id + '/redefinir-senha',
        success: function(data, textStatus, jqXHR) {
            MensagemSucesso(data.message);
        },
        error: function (data, ajaxOptions, thrownError) {
            MensagemErro(data.responseText);
        }
    });
    
}

function RemoverMensagens() {
    $('div#mensagem').remove();
}


function MensagemSucesso(mensagem) {
    var mensagemSucesso = "<div class=\"alert alert-success alert-white-alt rounded\" id=\"mensagem\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>" + mensagem + "</div>";

    $('div.block-flat > div.header').append(mensagemSucesso);
}

function MensagemErro(mensagem) {
    var mensagemErro = "<div class=\"alert alert-danger alert-white-alt rounded\" id=\"mensagem\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>" + mensagem + "</div>";

    $('div.block-flat > div.header').append(mensagemErro);
}