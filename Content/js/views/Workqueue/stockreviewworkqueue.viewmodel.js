var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.StockReviewWorkQueueModel = Class.extend({
    init: function () {
        this.WarehouseId = ko.observable();
        this.UserId = ko.observable();
        this.FromLocationId = ko.observable();
        this.ToLocationId = ko.observable();
        this.ItemId = ko.observable();
        this.Priority = ko.observable();
        this.ExpirationDateRequired = ko.observable();
    },
    clear: function () {
        this.WarehouseId('');
        this.UserId('');
        this.FromLocationId('');
        this.ToLocationId('');
        this.ItemId('');
        this.Priority('');
        this.ExpirationDateRequired('');
    },
    load: function (model) {
        this.WarehouseId(model.WarehouseId);

        if (model.Assignments != null && model.Assignments.length > 0) {
            this.UserId(model.Assignments[0].User.Id);
        }

        if (model.ToLocationId != null) {
            this.ToLocationId(model.ToLocationId);
        }

        if (model.FromLocationId != null) {
            this.LocationId(model.FromLocationId);
        }

        if (model.ItemId != null) {
            this.ItemId(model.ItemId);
        }

        if (model.Priority != null) {
            this.Priority(model.Priority);
        }

        if (model.ExpirationDateRequired != null) {
            this.ExpirationDateRequired(model.ExpirationDateRequired);
        }

        if (model.Recount != null) {
            $("#row-recount").show();
        }
    }
});

hbsis.wms.settings.StockReviewWorkQueueViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start) {
            this.startDate = moment(start, 'DD/MM/YYYY');
        }

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        $("#ByLocationTrue, #ByLocationFalse").change(function () {
            if ($("#ByLocationTrue").is(":checked")) {
                $("#row-review-by-location").show();
                $("#row-review-by-item").hide();

                $("#FromLocationId").removeClass("ignore");
                $("#ToLocationId").removeClass("ignore");
                $("#ItemId").addClass("ignore");

                $("#ItemId").select2("val", "", true);
            }
            else if ($("#ByLocationFalse").is(":checked")) {
                $("#row-review-by-location").hide();
                $("#row-review-by-item").show();

                $("#FromLocationId").addClass("ignore");
                $("#ToLocationId").addClass("ignore");
                $("#ItemId").removeClass("ignore");

                $("#FromLocationId").select2("val", "", true);
                $("#ToLocationId").select2("val", "", true);
            }
        });

        $("#WarehouseId").change(function () {
            if (!$("#WarehouseId").is(":disabled")) {
                if ($("#WarehouseId").val() != null && $("#WarehouseId").val() != "") {
                    $("#UserId").removeAttr("disabled");
                }
                else {
                    $("#UserId").select2("val", "", true);
                    $("#UserId").attr("disabled", true);
                }
            }
        });

        $("#FromLocationId").change(function (event) {
            if ($("#ToLocationId").val() == "" && event.added != null) {
                $("#ToLocationId").select2("val", this.value, true);
            }
        });

        this.initDatetimeRangePicker("#reportrange");

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#UserId", this.settings.userAutocompleteUrl, this.renderUser);
        this.initAutocomplete("#FromLocationId", this.settings.locationAutocompleteUrl, this.renderLocation);
        this.initAutocomplete("#ToLocationId", this.settings.toLocationAutocompleteUrl, this.renderToLocation);
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderToItem);

        $("#UserId").addClass("ignore");
        $("#ItemId").addClass("ignore");
    },
    renderWarehouse: function (warehouse) {
        return warehouse.Name;
    },
    renderUser: function (user) {
        return user.Name;
    },
    renderLocation: function (location) {
        return location.Code + ' - ' + location.Description;
    },
    renderToLocation: function (toLocation) {
        return toLocation.Code + ' - ' + toLocation.Description;
    },
    renderToItem: function (item) {
        return item.Code + ' - ' + item.ShortDescription;
    },
    clearSaveForm: function () {
        this._super();

        $("#WarehouseId").select2("val", "", true);
        $("#UserId").select2("val", "", true);
        $("#FromLocationId").select2("val", "", true);
        $("#ToLocationId").select2("val", "", true);
        $("#ItemId").select2("val", "", true);

        $("#row-review-by-location").show();
        $("#row-review-by-item").hide();

        $("#FromLocationId").removeClass("ignore");
        $("#ToLocationId").removeClass("ignore");
        $("#ItemId").addClass("ignore");

        $("#UserId").attr("disabled", true);

        $("#row-recount").hide();
    },
    edit: function (model) {
        this._super(model);

        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#UserId").select2("val", $("#UsuarioId").val(), true);

        $("#FromLocationId").select2("val", $("#FromLocationId").val(), true);
        $("#ToLocationId").select2("val", $("#ToLocationId").val(), true);
        $("#ItemId").select2("val", $("#ItemId").val(), true);

        if ($("#ItemId").val() != null && $("#ItemId").val() != "") {
            $("#ByLocationTrue")[0].checked = false;
            $("#ByLocationFalse")[0].checked = true;
            $("#row-review-by-location").hide();
            $("#row-review-by-item").show();
        }
        else {
            $("#ByLocationTrue")[0].checked = true;
            $("#ByLocationFalse")[0].checked = false;
            $("#row-review-by-location").show();
            $("#row-review-by-item").hide();
        }
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.StockReviewWorkQueueModel());
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "Priority" },
              { "mData": "LocationCode" },
              { "mData": "ItemCode" },
			  { "mData": "ItemDescription" },
              { "mData": "UserName" },
              { "mData": "Status" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.WarehouseCode;
                    }
                },
				{
				    "aTargets": [1],
				    "mData": null,
				    "bSortable": true,
				    "bSearchable": false,
				    "mRender": function (data, type, row) {
				        return row.Priority;
				    }
				},
				{
				    "aTargets": [2],
				    "mData": null,
				    "bSortable": true,
				    "bSearchable": false,
				    "mRender": function (data, type, row) {
				        return row.LocationCode;
				    }
				},
				{
				    "aTargets": [3],
				    "mData": null,
				    "bSortable": true,
				    "bSearchable": false,
				    "mRender": function (data, type, row) {
				        return (row.ItemCode != null ? row.ItemCode : '-');
				    }
				},
                {
                    "aTargets": [4],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return (row.ItemDescription != null ? row.ItemDescription : '-');
                    }
                },
                {
                    "aTargets": [5],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        return (row.UserName != null ? row.UserName : '-');
                    }
                },
                {
                    "aTargets": [6],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.Status);
                    },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Associado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                        }
                        else if (sData == "Completo") {
                            $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                        }
                        else if (sData == "Não Associado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                        }
                        else if (sData == "Parcial") {
                            $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                        }
                        else if (sData == "Bloqueado") {
                            $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });

                        }
                    }

                },
                {
                    "aTargets": [7],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
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
                        SearchByIdentityWarehouse: true,
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