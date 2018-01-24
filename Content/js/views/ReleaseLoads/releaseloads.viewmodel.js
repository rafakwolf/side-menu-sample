var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.ReleaseLoadsLocationModel = Class.extend({
    init: function (Location) {
        if (!Location) {
            Location = { Id: '', Code: '' };
        }

        this.Id = Location.Id;
        this.Code = Location.Code;
    }
});


hbsis.wms.management.ReleaseLoadsModel = Class.extend({
    init: function () {
    },
    clear: function () {
    },
    load: function (model) {
    }
});

function clearAllMessages() {
    $("#releaseLoadsErrorMessage").remove();
    $("#releaseLoadsSuccessMessage").remove();
};

function showErrorMessage(message) {
    clearAllMessages();
    var errorProcessAlert =
        "<div id=\"releaseLoadsErrorMessage\" class=\"alert alert-danger alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errorMessage}</div>";
    var errorAlert = errorProcessAlert.replace("{errorMessage}", message);    
    $("#modelContentMessage").prepend(errorAlert);
};

function showSuccessMessage(message) {
    clearAllMessages();
    var successProcess =
        "<div id=\"releaseLoadsSuccessMessage\" class=\"alert alert-success alert-white-alt rounded\">" +
        "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
        "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>{successMessage}</div>";
    var successAlert = successProcess.replace("{successMessage}", message);    
    $("#modelContentMessage").prepend(successAlert);
}

hbsis.wms.management.ReleaseLoadsViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment().add(1, 'days'),
    endDate: moment().add(1, 'days'),
    init: function(opts) {
        this._super(opts);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        var self = this;

        $("#datatable").on('draw.dt', function() {
            $('[data-toggle="tooltip"]').tooltip();
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Status"
        });
        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);
    },
    initDatetimeRangePicker: function(field) {
        var self = this;
        hbsis.wms.Helpers.initDatetimeRangePicker({
            field: field,
            config: {
                startDate: self.startDate,
                endDate: self.endDate
            },
            callback: function(start, end) {

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
    createModel: function() {
        return ko.observable(new hbsis.wms.management.ReleaseLoadsModel());
    },
    getModelDescription: function(model) {
        return model.Description;
    },
    clearSaveForm: function() {
        this._super();
    },
    edit: function(model) {
        this._super(model);
    },
    statusFinder: function() {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    searchRequestDataPickArea: function(term, page) {
        var warehouse = $("#Warehouse_Id").val();
        if (warehouse) {
            return {
                search: term,
                start: 0,
                length: 10,
                field1: 'code',
                value1: String(warehouse)
            };
        }
        return {
            search: term,
            start: 0,
            length: 10
        };
    },
    myAction: function() {
        console.log("hi");
        return true;
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function(aoData) {
                aoData.push({ "name": "status", "value": $("#Status").val() });
                if ($("#Status").val() != "") {
                    aoData.push({ "name": "allStatus", "value": "false" });
                } else {
                    aoData.push({ "name": "allStatus", "value": "true" });
                }
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": null },
                { "mData": "WarehouseCode" },
                { "mData": "Code" },
                { "mData": "LicensePlate" },
                { "mData": null },
                { "mData": null },
                { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.Status == "New" || row.Status == "Released" || row.Status == "Hold") {
                            return '<input type="checkbox" class="loadId" value="' + row.Code + '" >';
                        } else {
                            return " - ";
                        }
                        
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.WarehouseCode; }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.Code; }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row)
                    { return row.Type; }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false,
                    "bSearchable": true, "mRender": function (data, type, row) {
                        if (row.LicensePlate == null)
                            return "-";
                        return row.LicensePlate;
                    }
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.DeliveryDate == null)
                            return "-";
                        return moment(row.DeliveryDate).format("DD/MM/YYYY");
                    }
                },
                {
                    "aTargets": [6], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row)
                    { return resources.get(row.Status); },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                        else if (sData == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Novo") {
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
                        else if (sData == "Cancelado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (sData == "Liberado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                        }
                        else if (sData == "Separado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Em Execução") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        } else if (sData == "Não Calculado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                        }
                    }
                },
                {
                    "aTargets": [7], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.BoxCode != null) {
                            return row.BoxCode;
                        } else {
                            return '<span id="' + row.Code + '"> - </span>';
                        }
                    }
                }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, minimumInput) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: minimumInput,
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
                if (id !== "" && id.split("-").length == 5) {
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