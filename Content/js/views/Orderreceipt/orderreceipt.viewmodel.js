var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.OrderReceiptModel = Class.extend({
    init: function () {
                   
    },
    clear: function () {
       
    },
    load: function (model) {
        if (!model)
            return;

        var self = this;            
    }
});

hbsis.wms.settings.OrderReceiptsViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
                       
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
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.OrderReceiptModel());
    },
    getModelDescription: function (model) {
        return model.body;
    },
    clearSaveForm: function () {
        this._super();
       
    },
    edit: function(model) {
        this._super(model);
      
    },    
    getDatatableConfig: function () {
        var self = this;
        return {
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
            aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
        },        
            "aoColumns": [
                { "mData": "Order.Number" },
                { "mData": "Item.Code" },
                { "mData": "AuditInfo.UpdatedDate" },
                { "mData": "User.Name" },
                { "mData": "Lot" },
                { "mData": "Quantity" },
                { "mData": "QuantityExpected" }

            ],"aoColumnDefs": [
            {
                "aTargets": [2],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.AuditInfo.CreatedDate == null)
                        return "NULO";

                    return moment(row.AuditInfo.CreatedDate).format("DD/MM/YYYY HH:mm:ss");
                }
            },
            {
                "aTargets": [4],
                "bSortable": false,
                "bSearchable": false,
                "mRender": function (data, type, row) {
                    if (row.Lot == null)
                        return "-";

                    return row.Lot.Number;
                }
            }

            ]
        };
    }
});