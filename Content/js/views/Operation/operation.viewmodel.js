var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.OperationLocationTypeModel = Class.extend({
    init: function (locationType) {
        this.Id = locationType.Id;
        this.Name = locationType.Name;
    }
});
hbsis.wms.settings.OperationReasonModel = Class.extend({
    init: function (reason) {
        this.Id = reason.Id;
        this.Name = reason.Nome;
    }
});
hbsis.wms.settings.OperationModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Code = ko.observable();
        this.Description = ko.observableArray();
        this.Responsability = ko.observable('Ambos');
        this.Action = ko.observable('Ambos');

        this.SelectedFromLocationTypes = ko.observableArray([]);
        this.FromLocationTypesIds = ko.observableArray([]);
        this.AvailableFromLocationTypes = ko.observableArray([]);

        this.SelectedToLocationTypes = ko.observableArray([]);
        this.ToLocationTypesIds = ko.observableArray([]);
        this.AvailableToLocationTypes = ko.observableArray([]);

        this.SelectedReasons = ko.observableArray([]);
        this.ReasonsIds = ko.observableArray([]);
        this.AvailableReasons = ko.observableArray([]);
    },
    clear: function () {
        this.Id('');
        this.Code('');
        this.Description('');
        this.Responsability('Ambos');
        this.Action = ko.observable('Ambos');
        this.SelectedFromLocationTypes([]);
        this.SelectedToLocationTypes([]);
        this.SelectedReasons([]);
    },
    load: function (model) {
        this.Id(model.Id);
        this.Code(model.Code);
        this.Description(model.Description);
        this.Responsability(model.Responsability);
        this.Action(model.Action);
        
        var self = this;

        this.SelectedFromLocationTypes($.map(model.SelectedFromLocationTypes, function (el) {
            return $.grep(self.AvailableFromLocationTypes(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.FromLocationTypesIds($.map(this.SelectedFromLocationTypes(), function (el) {
            return el.Id;
        }));



        this.SelectedToLocationTypes($.map(model.SelectedToLocationTypes, function (el) {
            return $.grep(self.AvailableToLocationTypes(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.ToLocationTypesIds($.map(this.SelectedToLocationTypes(), function (el) {
            return el.Id;
        }));
        this.SelectedReasons($.map(model.SelectedReasons, function (el) {
            return $.grep(self.AvailableReasons(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.ReasonsIds($.map(this.SelectedReasons(), function (el) {
            return el.Id;
        }));
    }
});

hbsis.wms.settings.OperationViewModel = hbsis.wms.CrudForm.extend({
    errorProcessAlert: "<div id=\"errorDetailContent\" class=\"alert alert-danger alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errormessage}</div>",
    crudModel: "",
    postDeleteItemUrl: "",
    init: function (opts) {
        this._super(opts);

        crudModel = this;

        this.initFromLocationMultiSelect("#SelectedFromLocationTypes", this.settings.locationTypesAutocompleteUrl);
        this.initToLocationMultiSelect("#SelectedToLocationTypes", this.settings.locationTypesAutocompleteUrl);
        this.initReasonMultiSelect("#SelectedReasons", this.settings.reasonsAutocompleteUrl);
        
        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Responsability"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Action"
        });

        $("#datatable").on('draw.dt', function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.OperationModel());
    },
    clearSaveForm: function () {
        this._super();
        $("#Responsability").select2("enable", true);
        $("#Action").select2("enable", true);
        $("#SelectedFromLocationTypes").multiSelect('refresh');
        $("#SelectedToLocationTypes").multiSelect('refresh');
        $("#SelectedReasons").multiSelect('refresh');
    },
    edit: function (model) {
        this._super(model);
        $("#Responsability").select2("val", model.Responsability, true);
        $("#Action").select2("val", model.Action, true);
        $("#SelectedFromLocationTypes").multiSelect('refresh');
        $("#SelectedToLocationTypes").multiSelect('refresh');
        $("#SelectedReasons").multiSelect('refresh');
    },
    save: function (e) {
        var errorContent = "#errorDetailContent";
        $(errorContent).remove();

        this._super(e);
    },
    getModelDescription: function (model) {
        return model.Description;
    },
    getFormData: function () {
        var self = this;
        this.model().SelectedFromLocationTypes($.map(this.model().FromLocationTypesIds(), function (el) {
            return $.grep(self.model().AvailableFromLocationTypes(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        this.model().SelectedToLocationTypes($.map(this.model().ToLocationTypesIds(), function (el) {
            return $.grep(self.model().AvailableToLocationTypes(), function (el2) {
                return el == el2.Id;
            })[0];
        }));
        this.model().SelectedReasons($.map(this.model().ReasonsIds(), function (el) {
            return $.grep(self.model().AvailableReasons(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 0 }),
            "aoColumns": [
              { "mData": "Code" },
              { "mData": "Description" },
              { "mData": "Action" },
              { "mData": null }
            ],
            "aoColumnDefs": [
             {
                 "aTargets": [0],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     return row.Code;
                 }
             },

             {
                 "aTargets": [1],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     return row.Description;
                 }
             },

             {
                 "aTargets": [2],
                 "mData": null,
                 "bSortable": false,
                 "mRender": function (data, type, row) {
                     return row.DisplayResponsability;
                 }
             },

            {
                 "aTargets": [3],
                "mData": null,
                "bSortable": false,
                "mRender": function (data, type, row) {
                    return row.DisplayAction;
                }
            },
            {
                "aTargets": [4],
                "mData": null,
                "sDefaultContent": self.settings.actionsMarkup,
                "bSortable": false,
                "bSearchable": false
            }
            ]
        };
    },
    initFromLocationMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Code', direction: 'asc' },
            dataType: 'json',
            success: function(data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var operationLocationTypes = $.map(data.Rows, function(el) {
                        return new hbsis.wms.settings.OperationLocationTypeModel(el);
                    });
                    self.model().AvailableFromLocationTypes(operationLocationTypes);
                    $(field).multiSelect();
                }
            }
        });
    },
    initToLocationMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Code', direction: 'asc' },
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var operationLocationTypes = $.map(data.Rows, function (el) {
                        return new hbsis.wms.settings.OperationLocationTypeModel(el);
                    });
                    self.model().AvailableToLocationTypes(operationLocationTypes);
                    $(field).multiSelect();
                }
            }
        });
    },
    initReasonMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept: "application/json" },
            data: { start: 0, length: 500, sort: 'Code', direction: 'asc' },
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var operationReason = $.map(data.Rows, function (el) {
                        return new hbsis.wms.settings.OperationReasonModel(el);
                    });
                    self.model().AvailableReasons(operationReason);
                    $(field).multiSelect();
                }
            }
        });
    }
});