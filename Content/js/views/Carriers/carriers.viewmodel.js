var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.CarrierModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.ShortName = ko.observable();
        this.Document = ko.observable();
        this.Code = ko.observable();
        this.AddressStreet = ko.observable();
        this.AddressNumber = ko.observable();
        this.AddressDistrict = ko.observable();
        this.AddressCity = ko.observable();
        this.AddressZip = ko.observable();
        this.AddressState = ko.observable();
        this.AddressCountry = ko.observable();
        this.AddressComplement = ko.observable();
        this.CompanyContactName = ko.observable();
        this.CompanyContactPhone = ko.observable();
        this.CompanyContactEmail = ko.observable();
        this.CompanyResponsibleName = ko.observable();
        this.CompanyResponsiblePhone = ko.observable();
        this.CompanyResponsibleEmail = ko.observable();        
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.ShortName('');
        this.Document('');
        this.Code('');
        this.AddressStreet('');
        this.AddressNumber('');
        this.AddressComplement('');
        this.AddressDistrict('');
        this.AddressCity('');
        this.AddressZip('');
        this.AddressState('');
        this.AddressCountry('');
        this.CompanyContactName('');
        this.CompanyContactPhone('');
        this.CompanyContactEmail('');
        this.CompanyResponsibleName('');
        this.CompanyResponsiblePhone('');
        this.CompanyResponsibleEmail('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Name(model.Name);
        this.ShortName(model.ShortName);
        this.Document(model.Document);
        this.Code(model.Code);
        if (model.Address) {
            this.AddressStreet(model.Address.Street);
            this.AddressNumber(model.Address.Number);
            this.AddressDistrict(model.Address.District);
            this.AddressCity(model.Address.City);
            this.AddressZip(model.Address.Zip);
            this.AddressState(model.Address.State);
            this.AddressCountry(model.Address.Country);
            this.AddressComplement(model.Address.Complement);
        }
        if (model.CompanyContact) {
            this.CompanyContactName(model.CompanyContact.Name);
            this.CompanyContactPhone(model.CompanyContact.Phone);
            this.CompanyContactEmail(model.CompanyContact.Email);
        }
        if (model.CompanyResponsible) {
            this.CompanyResponsibleName(model.CompanyResponsible.Name);
            this.CompanyResponsiblePhone(model.CompanyResponsible.Phone);
            this.CompanyResponsibleEmail(model.CompanyResponsible.Email);
        }
    }
});

hbsis.wms.settings.CarrierViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.CarrierModel());
    },
    renderContact: function (contact) {
        return hbsis.wms.Helpers.renderContact(contact);
    },
    renderAddress: function (address) {
        return hbsis.wms.Helpers.renderAddress(address);
    },
    renderName: function (client) {
        return client.Name + (client.ShortName ? "<br/>(" + client.ShortName + ")" : "");
    },
    clearSaveForm: function () {
        this._super();
        $("#form-tabs a:first").tab('show');
    },
    getModelDescription: function (model) {
        return model.Document + ' - ' + model.Name;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
               { "mData": "Code" },
                { "mData": "Name" },
              { "mData": "Address" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [3],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },
              //{
              //    "aTargets": [3],

              //    "mRender": function (data, type, row) {
              //        var content = "";
              //        if (row.CompanyContact) {
              //            content += self.renderContact(row.CompanyContact);
              //        }
              //        if (row.CompanyResponsible) {
              //            content += (content ? "<hr/>" : "") + self.renderContact(row.CompanyResponsible);
              //        }
              //        return content;
              //    },
              //    "bSortable": false
              //},
              {
                  "aTargets": [2],
                  "mRender": function (data, type, row) {
                      return self.renderAddress(row.Address);
                  },
                  "bSortable": false
              },
              {
                  "aTargets": [1],
                  "mRender": function (data, type, row) {
                      return self.renderName(row);
                  }
              }
            ]
        };
    }
});