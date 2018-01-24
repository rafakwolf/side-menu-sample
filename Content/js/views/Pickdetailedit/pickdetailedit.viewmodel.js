var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
hbsis.wms.settings.WarehouseModel = Class.extend({
    init: function (Warehouse) {
    
        if (!Warehouse) {
            Warehouse = { Id: '', Name: '', ShortCode: '' };
        }

        this.Id = Warehouse.Id;
        this.Name = Warehouse.Name;
        this.ShortCode = Warehouse.ShortCode;
    }
});
hbsis.wms.settings.LocationRefModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});

hbsis.wms.settings.PickDetailEditModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.OrderNumber = ko.observable();
        this.PalletDescription = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.WarehouseModel());
        this.FromLocation= ko.observable(new hbsis.wms.settings.LocationRefModel ());
    },
    clear: function () {
        this.Id('');
        this.OrderNumber('');
        this.PalletDescription('');
        this.Warehouse(new hbsis.wms.settings.WarehouseModel());
        this.FromLocation(new hbsis.wms.settings.LocationRefModel());

    },
    load: function (model) {

        this.Id(model.Id);
        this.OrderNumber(model.OrderNumber);
        this.PalletDescription(model.PalletDescription);
        this.Warehouse(new hbsis.wms.settings.WarehouseModel(model.Warehouse));
        this.FromLocation(new hbsis.wms.settings.LocationRefModel(model.FromLocation));
    }
});

hbsis.wms.settings.PickDetailEditViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#FromLocation_Id", this.settings.LocationAutocompleteUrl, this.renderLocation);
        
        
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");
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
        $("#FromLocation_Id").select2("val", "", true);
      
    },
    edit: function (model) {
        this._super(model);
        $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
        $("#FromLocation_Id").select2("val", $("#FromLocation_Id").val(), true);
       
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PickDetailEditModel());
    },
    getModelDescription: function (model) {
        return model.Number;
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderLot: function (lot) {
        return lot.Number;
    },
    renderCompany: function (company) {
        return company.Name;
    },
    renderLocation: function (location){
        return location.Code
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
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "Warehouse" },
              { "mData": "OrderNumber" },
              { "mData": "PalletDescription" },
              { "mData": "Status" },
              { "mData": "Item" },
              { "mData": "Item" },
              { "mData": "Quantity" },
              { "mData": "PickedQuantity" },
              { "mData": "Location" },
              { "mData": "FromLocation" },
              { "mData": "AuditInfo.CreatedDate" },
              { "mData": "WorkQueue" },
              { "mData": "GenericAttribute1" },
              { "mData": 'Alterar Doca' }
              
            ],
            "aoColumnDefs": [
                {
                "aTargets": [0],"mData": null,"bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row)
                { return row.Warehouse.ShortCode; }
                },
                 {
                     "aTargets": [4], "mData": null, "bSortable": false,
                     "bSearchable": false, "mRender": function (data, type, row)
                     { return row.Item.Code; }
                 },
                  {
                      "aTargets": [5], "mData": null, "bSortable": false,
                      "bSearchable": false, "mRender": function (data, type, row)
                      { return row.Item.Description; }
                  },
                    {
                        "aTargets": [3], "mData": null, "bSortable": false,
                        "bSearchable": false, "mRender": function (data, type, row)
                        {return resources.get(row.Status);}
                    },
                   {
                       "aTargets": [8], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row)
                       { return row.Location.Code; }
                   },
            {
                "aTargets": [9], "mData": null, "bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row)
                { return row.FromLocation.Code; }
            }
             ,
                     {
                         "aTargets": [10],
                         "bSortable": false,
                         "bSearchable": false,
                         "mRender": function (data, type, row) {
                
                             return moment(row.AuditInfo.CreatedDate).format("DD/MM/YY HH:mm");
                         }
                     },
                     {
                         "aTargets": [11],
                         "bSortable": false,
                         "bSearchable": false,
                         "mRender": function (data, type, row) {
                             if (row.WorkQueue == null)
                                 return "Sem Tarefa";

                             return moment(row.WorkQueue.AuditInfo.CreatedDate).format("DD/MM/YY HH:mm")
                             + ", " + resources.get(row.WorkQueue.Status);
                         }
                     },
                     {
                         "aTargets": [13],
                         "mData": null,
                         "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                       "<i class=\"fa fa-search\"></i></a> ",
                         "bSortable": false,
                         "bSearchable": false

                     }
                    
]
            
};
    }
});