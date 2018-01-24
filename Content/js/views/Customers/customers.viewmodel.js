var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.CustomerModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.ShortName = ko.observable();
        this.Document = ko.observable();
        this.AddressStreet = ko.observable();
        this.AddressNumber = ko.observable();
        this.AddressDistrict = ko.observable();
        this.AddressCity = ko.observable();
        this.AddressZip = ko.observable();
        this.AddressState = ko.observable();
        this.AddressCountry = ko.observable();
        this.CompanyContactName = ko.observable();
        this.CompanyContactPhone = ko.observable();
        this.CompanyContactEmail = ko.observable();
        this.CompanyResponsibleName = ko.observable();
        this.CompanyResponsiblePhone = ko.observable();
        this.CompanyResponsiblePhone = ko.observable();
        this.CompanyResponsibleEmail = ko.observable();
        this.AddressComplement = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Name('');
        this.ShortName('');
        this.Document('');
        this.AddressStreet('');
        this.AddressComplement('');
        this.AddressNumber('');
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

hbsis.wms.settings.CustomerViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.CustomerModel());
    },
    renderContact: function (contact) {
        return hbsis.wms.Helpers.renderContact(contact);
    },
    renderAddress: function (address) {
        return hbsis.wms.Helpers.renderAddress(address);
    },
    renderName: function (customer) {
        return customer.Name + (customer.ShortName ? "<br/>(" + customer.ShortName + ")" : "");
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
                  { "mData": "Document" },
              { "mData": "Name" },
              { "mData": "Address" },
              { "mData": "CompanyContactName" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              {
                  "aTargets": [0],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.Document;
                  }
              },
              {
                  "aTargets": [1],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.Name;
                  }
              },
              {
                  "aTargets": [2],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.Address;
                  }
              },{
                  "aTargets": [3],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return row.CompanyContactName;
                  }
              },
              {
                  "aTargets": [4],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              },              
            ]
        };
    }
});