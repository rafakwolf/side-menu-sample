var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.BalancaModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Nome = ko.observable();
        this.Ip = ko.observable();
        this.Porta = ko.observable();
        this.Armazem = ko.observable();
        this.UsuarioAssociado = ko.observable();
        this.Modelo = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Nome('');
        this.Ip('');
        this.Porta('');
        this.Armazem('');
        this.UsuarioAssociado('');
        this.Modelo('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Nome(model.Nome);
        this.Ip(model.Ip);
        this.Porta(model.Porta);
        this.Armazem(model.Armazem);
        this.UsuarioAssociado(model.UsuarioAssociado);
        this.Modelo(model.Modelo);
    }
});

hbsis.wms.settings.ConferenciaPesoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        
        hbsis.wms.Helpers.initAutoCompleteEnum({field: "#Modelo"});

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.BalancaModel());
    },
    edit: function (model) {
        this._super(model);
        $("#Modelo").select2("val", $("#Modelo").val(), true);
    },
    getDatatableConfig: function() {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Nome" },
              { "mData": "Ip" },
              { "mData": "Porta" },
              { "mData": "UsuarioAssociado" },
              { "mData": "Modelo" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [5],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {

                      var html = "";
                      if(row.UsuarioAssociado != null)
                          html = "<a class=\"label label-primary edit\" href=\"javascript:;\" onclick=\"DesassociarBalanca('" + row.Id + "')\" id=\"botao-desbloqueio\" style=\"margin-left:3px\">" +
                              "<i class=\"fa fa-unlock\"></i></a> ";
                      return self.settings.actionsMarkup + html;
                  }
              }
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});

function DesassociarBalanca(id) {
    $.ajax({
        type: "POST",
        data: {balancaId : id},
        url: window.location.href + '/DesassociarBalanca/' + id,
        success: function(data, textStatus, jqXHR) {
            window.location.reload();
        }
    });
}