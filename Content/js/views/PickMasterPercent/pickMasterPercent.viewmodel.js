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
hbsis.wms.settings.PickMasterPercentModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.OrderNumber = ko.observable();
        this.PalletDescription = ko.observable();
        this.StatusPickMaster = ko.observable();
        this.User = ko.observable();
        this.CompletePercent = ko.observable();
        this.Warehouse = ko.observable(new hbsis.wms.settings.PoWarehouseModel());

               
    },
    clear: function () {
        this.Id('');
        this.OrderNumber('');
        this.PalletDescription('');
        this.StatusPickMaster('');
        this.User('');
        this.CompletePercent('');
        this.Warehouse('');

    
       
    },
    load: function (model) {
        this.Id(model.Id);
        this.OrderNumber(model.OrderNumber);
        this.PalletDescription(model.PalletDescription);
        this.StatusPickMaster(model.StatusPickMaster);
        this.User(model.User);
        this.CompletePercent(model.CompletePercent);
        this.Warehouse(new hbsis.wms.settings.PoWarehouseModel(model.Warehouse));
       
           
    }
});

hbsis.wms.settings.PickMasterPercentViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),

    init: function (opts) {
        this._super(opts);
        this.initAutocomplete("#Warehouse_Id", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Type"
        });


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
                },

            });
       

        },

        clearSaveForm: function () {
            this._super();
            $("#Type").select2("val", "", true);
            $("#Warehouse_Id").select2("val", "", true);

        },

        edit: function (model) {
            this._super(model);
            $("#Warehouse_Id").select2("val", $("#Warehouse_Id").val(), true);
            $("#Type").select2("val", $("#Type").val(), true);

        },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.PickMasterPercentModel());
    },
    renderWarehouse: function (warehouse) {
        return warehouse.ShortCode + ' - ' + warehouse.Name;
    },
    renderProfile: function (profile) {
        return profile.Name;
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
  
    
    getDatatableConfig: function () {
        var self = this;
        return {

            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },

            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),

            "aoColumns": [
              { "mData": "Warehouse" },
              { "mData": "OrderNumber" },
              { "mData": "PalletDescription" },
              { "mData": "StatusPickMaster" },
              { "mData": "User" },
              { "mData": "AuditInfo.CreatedDate" },
               { "mData": "CompletePercent" },
              //{ "mData": null }

            ],
            "aoColumnDefs": [
              //{
              //    "aTargets": [7],
              //    "mData": null,
              //    "sDefaultContent": self.settings.actionsMarkup,
              //    "bSortable": false,
              //    "bSearchable": false
              //},               
                    {
                        "aTargets": [3], "mData": null, "bSortable": true,
                        "bSearchable": false, "mRender": function (data, type, row)
                        {return resources.get(row.StatusPickMaster);}
                    },

                      {
                          "aTargets": [1], "mData": null, "bSortable": true,
                          "bSearchable": false, "mRender": function (data, type, row)
                          { return (row.OrderNumber); }
                      },

              {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        if (row.User == null)
                            return "-";

                        return row.User.Name;
                    }
              },

                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        if (row.Warehouse == null)
                            return "-";

                        return row.Warehouse.ShortCode;
                    }

                },


                     {
                         "aTargets": [5],
                         "bSortable": false,
                         "bSearchable": false,
                         "mRender": function (data, type, row) {

                             return moment(row.AuditInfo.CreatedDate).format("DD/MM/YY HH:mm");
                         }
                     },

                     {
                          "aTargets": [6], "mData": null, "bSortable": false,
                          "bSearchable": false, "mRender": function (data, type, row)
                          { return row.CompletePercent+ "%"; }
                      },

              
            ]
        };
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
    }
});