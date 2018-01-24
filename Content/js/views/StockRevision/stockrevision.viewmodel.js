var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.WorkQueueModel = Class.extend({
    init: function () {
        //this.Id = ko.observable();
        //this.Item = ko.observable();
        //this.Quantity = ko.observable();
        //this.Warehouse = ko.observable(new hbsis.wms.settings.ItemStockWarehouseModel());
        //this.location = ko.observable(new hbsis.wms.settings.ItemStockLocationRefModel());
        //this.Lot = ko.observable(new hbsis.wms.settings.LotRefModel());
        //this.ExpirationDate = ko.observable();
        //this.LotNumber = ko.observable();
        //this.Status = ko.observable();
    }
});

hbsis.wms.settings.StockRevisionModel = Class.extend({
    init: function () {
        //this.Id = ko.observable();
        //this.Item = ko.observable();
        //this.Quantity = ko.observable();
        //this.Warehouse = ko.observable(new hbsis.wms.settings.ItemStockWarehouseModel());
        //this.location = ko.observable(new hbsis.wms.settings.ItemStockLocationRefModel());
        //this.Lot = ko.observable(new hbsis.wms.settings.LotRefModel());
        //this.ExpirationDate = ko.observable();
        //this.LotNumber = ko.observable();
        //this.Status = ko.observable();
    }
});

hbsis.wms.settings.WorkQueueViewModel = hbsis.wms.CrudForm.extend({
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
        return ko.observable(new hbsis.wms.settings.WorkQueueModel());
    },
    getModelDescription: function (model) {
        return model.Number;
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
        this.model().Zones($.map(this.model().ZonesIds(), function (el) {
            return $.grep(self.model().AvailableZones(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

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
              { "mData": "Location" },
              { "mData": "Item" },
              { "mData": "AuditInfo.UpdatedDate" },
              { "mData": "AuditInfo.UpdatedBy" },
              { "mData": null },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return row.Warehouse.ShortCode; }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return (row.Location != null) ? row.Location.Code : " - "; }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Item != null)
                            return row.Item.Code + ' - ' + row.Item.Description;
                        else
                            return '-';
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return moment(row.AuditInfo.UpdatedDate).format("DD/MM/YYYY HH:mm"); }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": true,
                    "bSearchable": false, "mRender": function (data, type, row)
                    {
                        if (row.Assignments.length > 0) {
                            return row.Assignments[row.Assignments.length - 1].User.Name;
                        }
                        else {
                            return '-'
                        }
                    }
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.HasDivergence) {
                            return '<a name="Options" class="label label-danger" href="javascript:void(0)">' + window.StockRevisionDataTable.i18n.details + '</a>'
                        } else {
                            return '<a name="Options" class="label label-default" href="javascript:void(0)">' + window.StockRevisionDataTable.i18n.details + '</a>'
                        }
                    }
                },
                {
                    "aTargets": [6], "mData": null, "bSortable": false,
                    "bSearchable": false, "sDefaultContent": '<a name="Recount" class="label label-default" href="javascript:void(0)"> ' + window.RecountRequest.label + "</a> "
                }
            ],
            "fnDrawCallback": this.addLink
        };
    },

    addLink : function(oSettings)
    {
        // cria link para sub-tabela
        /*
        $('#datatable tbody tr').each(function () {

            // não exibe o link se não houver registros
            if (oSettings._iRecordsTotal === 0) return;

            var nTds = $('td', this);
            nTds.last().html('<a href="javascript:void(0)">' + window.StockRevisionDataTable.i18n.details + '</a>');
        });
        */

        $("a[name='Recount']").on('click', function () {
            var nTr = $(this).parents('tr')[0];
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: window.RecountRequest.endpointRecount + "/" + nTr.id,
                success: function (data, textStatus, jqXHR) {
                    if (data.success) {
                        $("#modelContentMessage").prepend(window.RecountRequest.successProcessAlert);
                    } else {
                        $("#modelContentMessage").prepend(window.RecountRequest.errorProcessAlert.replace("{errormessage}", data.message));
                    }
                }
            });
        });
        
        $("a[name='Options']").on('click', function () {
            var dt = window.StockRevisionDataTable,
                nTr = $(this).parents('tr')[0];

            if (oSettings.oInstance.fnIsOpen(nTr)) {
                this.text = dt.i18n.details;

                oSettings.oInstance.fnClose(nTr);
            }
            else {
                this.text = dt.i18n.hide;
                oSettings.oInstance.fnOpen(nTr, '<table id="details_' + nTr.id + '" class="table"></table>', '');

                $('#details_' + nTr.id).css({ "border":"solid", "border-width":"1px" });

                $('#details_' + nTr.id).dataTable({
                    "sDom": '<"top">rt<"bottom"><"clear">',
                    "bProcessing": true,
                    "bPaginate": false,
                    "bDeferRender": true,
                    "bServerSide": true,
                    "fnServerData": $.fn.dataTable.pipeline({ url: dt.datatableUrl + '/' + nTr.id }),
                    "fnCreatedRow": function (nRow, aData, iDataIndex) { $(nRow).attr('id', aData.Id); },
                    "oLanguage": { "sUrl": dt.datatableLang },
                    "aoColumns": dt.columnModel,
                    "aoColumnDefs": [
                        {
                            "aTargets": [0], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            {
                                if (row.ItemExpected != null) {
                                    return row.ItemExpected.ShortCode + " - " + row.ItemExpected.ShortDescription;
                                }
                                else {
                                    return "-";
                                }
                            }
                        },
                        {
                            "aTargets": [1], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            { 
                                if (row.ItemMeasured != null) {
                                    return row.ItemMeasured.ShortCode + " - " + row.ItemMeasured.ShortDescription;
                                }
                                else {
                                    return "-";
                                }
                            }
                        },
                        {
                            "aTargets": [2], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            { return (row.QuantityExpected != null ? row.QuantityExpected : "-"); }
                        },
                        {
                            "aTargets": [3], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            { return (row.QuantityMeasured != null ? row.QuantityMeasured : "-"); }
                        },
                        {
                            "aTargets": [4], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            { return (row.ExpirationDateExpected != null ? moment(row.ExpirationDateExpected).format("DD/MM/YYYY") : "-"); }
                        },
                        {
                            "aTargets": [5], "mData": null, "bSortable": false,
                            "bSearchable": false, "mRender": function (data, type, row)
                            { return (row.ExpirationDateMeasured != null ? moment(row.ExpirationDateMeasured).format("DD/MM/YYYY") : "-"); }
                        }
                    ],
                    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        if (aData.ItemExpected != null && aData.ItemMeasured == null ||
                            aData.ItemExpected == null && aData.ItemMeasured != null ||
                            (aData.ItemExpected != null && aData.ItemMeasured != null && aData.ItemExpected.Id != aData.ItemMeasured.Id)) {
                            $('td:eq(0)', nRow).addClass('red');
                            $('td:eq(1)', nRow).addClass('red');
                        }

                        if (aData.QuantityExpected != aData.QuantityMeasured) {
                            $('td:eq(2)', nRow).addClass('red');
                            $('td:eq(3)', nRow).addClass('red');
                        }

                        if (aData.ExpirationDateExpected != aData.ExpirationDateMeasured) {
                            $('td:eq(4)', nRow).addClass('red');
                            $('td:eq(5)', nRow).addClass('red');
                        }
                    }
                });

            }
        });
    }
});