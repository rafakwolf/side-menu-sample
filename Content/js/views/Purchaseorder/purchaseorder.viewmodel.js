var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.PoWarehouseModel = Class.extend({
    init: function (Warehouse) {
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});

hbsis.wms.settings.PoCompanyModel = Class.extend({
    init: function (Company) {
        if (!Company) {
            Company = { Id: '', Name: '' };
        }

        this.Id = Company.Id;
        this.Name = Company.Name;
    }
});

hbsis.wms.settings.PoDetailModel = Class.extend({
    init: function (PurchaseOrderDetail) {
        if (!PurchaseOrderDetail) {
            PurchaseOrderDetail = { Item: '', Quantity: '' };
        }

        this.Item = PurchaseOrderDetail.Item.Code;
        this.Quantity = PurchaseOrderDetail.Quantity;
        this.PickingQuantity = (PurchaseOrderDetail.PickingQuantity != null) ? PurchaseOrderDetail.PickingQuantity : " - ";
        this.PalletQuantity = (PurchaseOrderDetail.PalletQuantity != null) ? PurchaseOrderDetail.PalletQuantity : " - ";
        this.State = resources.get(PurchaseOrderDetail.State);
        this.Carrier = (PurchaseOrderDetail.Carrier != null) ? PurchaseOrderDetail.Carrier.Name : " - ";
        this.Vendor = (PurchaseOrderDetail.Vendor != null) ? PurchaseOrderDetail.Vendor.Name : " - ";
        this.ExpectedArrival = hbsis.wms.Helpers.formatarDataDDMMYYYY(PurchaseOrderDetail.ExpectedArrival);
        this.DateArrival = hbsis.wms.Helpers.formatarDataDDMMYYYY(PurchaseOrderDetail.DateArrival);
        this.Description = PurchaseOrderDetail.Item.Description;
        this.CodigoLote = PurchaseOrderDetail.CodigoLote;
        this.DataValidade = hbsis.wms.Helpers.formatarDataDDMMYYYY(PurchaseOrderDetail.DataValidade);
    }
});

hbsis.wms.settings.PurchaseOrderModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Number = ko.observable();
        this.VehicleId = ko.observable();
        this.Status = ko.observable();
        this.Date = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.PoWarehouseModel());
        this.ExpectedArrival = ko.observable();        
        this.CodigoLote = ko.observable();
        this.DataValidade = ko.observable();
        this.Customer = ko.observable(new hbsis.wms.settings.PoCompanyModel());
        this.Vendor = ko.observable(new hbsis.wms.settings.PoCompanyModel());
        this.Carrier = ko.observable(new hbsis.wms.settings.PoCompanyModel());
        this.Details = ko.observable();
        this.OrderTypeName = ko.observable();
        this.Type = ko.observable();
        this.TaxInvoice = ko.observable();
        this.CodigoFabrica = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Number('');
        
        this.VehicleId('');
        this.Status('');
        this.Date('');
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel());

        this.ExpectedArrival('');
        this.CodigoLote('');
        this.DataValidade('');
        this.Customer(new hbsis.wms.settings.PoCompanyModel());
        this.Vendor(new hbsis.wms.settings.PoCompanyModel());
        this.Carrier(new hbsis.wms.settings.PoCompanyModel());
        this.OrderTypeName('');
        this.Type('');
        this.TaxInvoice('');
        this.CodigoFabrica('');
    },
    load: function (model) {
        this.Id(model.Id);
        this.Number(model.Number);
        this.VehicleId(model.VehicleId);
        this.Status(model.Status);
        this.Date(model.Date);
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel(model.Warehouse));
        this.ExpectedArrival(hbsis.wms.Helpers.formatarDataDDMMYYYY(model.ExpectedArrival));
        this.Customer(new hbsis.wms.settings.PoCompanyModel(model.Customer));
        this.Vendor(new hbsis.wms.settings.PoCompanyModel(model.Vendor));
        this.Carrier(new hbsis.wms.settings.PoCompanyModel(model.Carrier));
        this.OrderTypeName(model.OrderTypeName);
        this.TaxInvoice(model.TaxInvoice);
        this.CodigoFabrica(model.CodigoFabrica);

        var details = new Array();
        for (var i = 0; i < model.Details.length; i++)
            details.push(new hbsis.wms.settings.PoDetailModel(model.Details[i]));

        this.Details(details);
    }
});

hbsis.wms.settings.PurchaseOrderViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#Carrier_Id", this.settings.carrierAutocompleteUrl, this.renderCompany);
        this.initAutocomplete("#Vendor_Id", this.settings.vendorAutocompleteUrl, this.renderCompany);
        this.initAutocomplete("#Customer_Id", this.settings.customerAutocompleteUrl, this.renderCompany);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Type"
        });

        $("#Type").val('');
        $("#Type").select2("val", $("#Type").val(), true);
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

                if (self.startDate != startDate) {
                    self.startDate = startDate;
                    self.dirty(true);
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                    self.dirty(true);
                }
                self.refreshDatatable();
            }
        });
    },
    clearSaveForm: function () {
        this._super();
        $("#Warehouse_Id").select2("val", "", true);
        $("#Carrier_Id").select2("val", "", true);
        $("#Vendor_Id").select2("val", "", true);
        $("#Customer_Id").select2("val", "", true);

    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#Carrier_Id").select2("val", $("#Carrier_Id").val(), true);
        $("#Vendor_Id").select2("val", $("#Vendor_Id").val(), true);
        $("#Customer_Id").select2("val", $("#Customer_Id").val(), true);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PurchaseOrderModel());
    },
    typeFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderCompany: function (company) {
        return company.Name;
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
                if ($("#Type").val() != "") {
                    aoData.push({ "name": "allTypes", "value": "false" });
                    aoData.push({ "name": "type", "value": $("#Type").val() });
                } else {
                    aoData.push({ "name": "allTypes", "value": "true" });
                    aoData.push({ "name": "type", "value": $("#Type").val() });
                }
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "Warehouse" },
              { "mData": "Number" },
              { "mData": "VehicleId" },
              { "mData": null },
              { "mData": "Status" },
              { "mData": "ExpectedArrival" },
              { "mData": "Carrier" },
              { "mData": "Vendor" },
              { "mData": "Customer" },
              { "mData": "CodigoFabrica" }
              

            ],
            "aoColumnDefs": [

               {
                   "aTargets": [0],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       return row.Warehouse.ShortCode;
                   }
               },
               {
                   "aTargets": [1],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false
               },
               {
                   "aTargets": [2],
                   "mData": null,
                   "bSortable": false,
                   "bSearchable": false
               },
              {
                  "aTargets": [3],
                  "mData": null,
                  "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                "<i class=\"fa fa-search\"></i></a> ",
                  "bSortable": false,
                  "bSearchable": false

              },
              {
                  "aTargets": [4],
                  "mData": null,
                  "bSortable": false,
                  "bSearchable": false,
                  "mRender": function (data, type, row) {
                      return resources.get(row.Status);
                  },
                  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                      if (sData == "Executando") {
                          $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                      }
                      else if (sData == "Finalizado") {
                          $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                      }
                      else if (sData == "Conferido") {
                          $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                      }
                      else if (sData == "Aberto") {
                          $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                      }
                      else if (sData == "Parcial") {
                          $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                      }
                      else if (sData == "Bloqueado") {
                          $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                      }
                      else if (sData == "Carregado") {
                          $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                      }
                      else if (sData == "Expedido") {
                          $(nTd).css({ "font-weight": "bold", "color": "#008000" });
                      }
                      else if (sData == "Cancelado") {
                          $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });

                      }
                  }


              },
               {
                   "aTargets": [5],
                   "bSortable": false,
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       return hbsis.wms.Helpers.formatarDataDDMMYYYYHHMMSS(row.ExpectedArrival);
                   }
               },

                {
                    "aTargets": [6],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Carrier != null ?
                                    row.Carrier.Name :
                                    '-';
                    }
                },
                {
                    "aTargets": [7],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Vendor != null ?
                                    row.Vendor.Name :
                                    '-';
                    }
                },
                {
                    "aTargets": [8],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.Customer != null ?
                                    row.Customer.Name :
                                    '-';
                    }
                },
            {
                "aTargets": [9],
                "mData": null,
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    return row.CodigoFabrica;
                }
            }            
            ]
        };
    }
});