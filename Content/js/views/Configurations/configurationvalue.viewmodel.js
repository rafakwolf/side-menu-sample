var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ConfigurationValueModel = Class.extend({
    init: function () {
        var self = this;
        this.Id = ko.observable();
        this.ValueId = ko.observable();
        this.Name = ko.observable();
        this.DisplayName = ko.observable();
        this.Description = ko.observable();
        this.ProcessGroup = ko.observable();
        this.FieldType = ko.observable();
        this.FieldListOptions = ko.observable();
        this.ProcessGroupName = ko.observable();
        this.ConfigurationFieldTypeName = ko.observable();
        this.OptionsList = ko.observableArray();        
        this.Value = ko.observable();
        this.Enabled = ko.observable();
        this.WarehouseName = ko.observable();
        this.DisplayName = ko.observable();
        this.AuditInfo = ko.observable();
        //Tipos possíveis de campos.
        this.ValueDateTime = ko.observable();
        this.ValueDecimal = ko.observable();
        this.ValueInteger = ko.observable();
        this.ValueText = ko.observable();
        this.ValueOption = ko.observable();
        this.ValueLogical = ko.observable();
        this.ValuePassword = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.ValueId('');
        this.Name('');
        this.DisplayName('');
        this.Description('');
        this.ProcessGroup('');
        this.FieldType('');
        this.FieldListOptions('');
        this.ProcessGroupName('');
        this.ConfigurationFieldTypeName('');        
        this.Value('');        
        this.Enabled('');
        this.ValueDateTime('');
        this.ValueDecimal('');
        this.ValueInteger('');
        this.ValueText('');
        this.ValueOption('');
        this.ValueLogical('');
        this.ValuePassword('');
        this.DisplayName('');
        this.WarehouseName('');
        this.AuditInfo('');
    },
    load: function (model) {
        var self = this;
        this.Id(model.Id);
        this.ValueId(model.ValueId);
        this.Name(model.Name);
        this.DisplayName(model.DisplayName);
        this.Description(model.Description);
        this.ProcessGroup(model.ProcessGroup);
        this.FieldType(model.FieldType);
        this.FieldListOptions(model.FieldListOptions);
        this.ProcessGroupName(model.ProcessGroupName);
        this.ConfigurationFieldTypeName(model.ConfigurationFieldTypeName);
        this.OptionsList(model.OptionsList);        
        this.Value(model.Value);
        this.DisplayName(model.DisplayName);
        this.Enabled(model.Enabled);
        this.WarehouseName(model.WarehouseName);
        this.AuditInfo(model.AuditInfo);

        this.ValueDecimal(model.ValueDecimal);
        this.ValueInteger(model.ValueInteger);
        this.ValueText(model.ValueText);
        this.ValueOption(model.ValueOption);
        this.ValueLogical(model.ValueLogical);
        this.ValueDateTime(new moment(model.ValueDateTime).format(resources.get('SmallDateFormat')));
        this.ValuePassword(model.ValuePassword);

        this.hideControls();

        if (this.isFieldText()) {
            $("#textValueField").show();
            $("#ValueText").removeClass("ignore");
        }

        if (this.isFieldDateTime()) {
            $("#datetimeValueField").show();
            $("#ValueDateTime").removeClass("ignore");
        }

        if (this.isFieldLogical()) {
            $("#logicalValueField").show();
            $("#ValueLogical").removeClass("ignore");
        }

        if (this.isFieldInteger()) {
            $("#integerValueField").show();
            $("#ValueInteger").removeClass("ignore");
        }

        if (this.isFieldDecimal()) {
            $("#decimalValueField").show();
            $("#ValueDecimal").removeClass("ignore");
        }

        if (this.isFieldPassword()) {
            $("#passwordValueField").show();
            $("#ValuePassword").removeClass("ignore");
        }

        if (this.isFieldOption()) {            
            $("#optionValueField").show();
            $("#ValueOption").removeClass("ignore");
            $("#ValueOption").empty();
            ko.utils.arrayForEach(this.OptionsList(), function (option) {                
                var selectdValue = false;
                if (model.Value) {
                    selectdValue = option.Key == model.Value;
                }
                if (selectdValue) {
                    $("#ValueOption").append("<option selected value=\"" + option.Key + "\">" + option.Value + "</option>");
                } else {
                    $("#ValueOption").append("<option value=\"" + option.Key + "\">" + option.Value + "</option>");
                }
            });
        }

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#ValueOption"
        });
    },
    isFieldText: function () {
        return this.FieldType() == "Text";
    },
    isFieldDateTime: function () {
        return this.FieldType() == "DateTime";
    },
    isFieldLogical: function () {
        return this.FieldType() == "Logical";
    },
    isFieldOption: function () {
        return this.FieldType() == "OptionList";
    },
    isFieldInteger: function () {
        return this.FieldType() == "Integer";
    },
    isFieldDecimal: function () {
        return this.FieldType() == "Decimal";
    },
    isFieldPassword: function () {
        return this.FieldType() == "Password";
    },
    hideControls: function () {
        $("#datetimeValueField").hide();
        $("#decimalValueField").hide();
        $("#integerValueField").hide();
        $("#textValueField").hide();
        $("#logicalValueField").hide();
        $("#optionValueField").hide();
        $("#passwordValueField").hide();

        $("#ValueDateTime").addClass("ignore");
        $("#ValueDecimal").addClass("ignore");
        $("#ValueInteger").addClass("ignore");
        $("#ValueText").addClass("ignore");
        $("#ValueLogical").addClass("ignore");
        $("#ValueOption").addClass("ignore");
    }
});

hbsis.wms.settings.ConfigurationValueViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);

        this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
        this.initAutocomplete("#ProcessId", this.settings.processesAutocompleteUrl, this.renderProcess);


        hbsis.wms.Helpers.initDatetimePicker({
            id: "#ValueDateTime",
            config: {
                format: resources.get('DatetimePicker.SmallDateFormat'),
                autoclose: true,
                minView: 2,
                todayHighlight: true,
                startDate: new Date(),
                language: resources.get('DatetimePicker.Language')
            }
        })
    },
    edit: function (model) {        
        this._super(model);
        $("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
        $("#ProcessId").select2("val", $("#ProcessId").val(), true);
    },
    save: function (model) {
        this._super(model);
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ConfigurationValueModel());
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "WarehouseName" },
              { "mData": "DisplayName" },
              { "mData": "ProcessGroupName" },
              { "mData": "Enabled" },
              { "mData": "ConfigurationFieldTypeName" },
              { "mData": "GetUpdateBy" },
              { "mData": "GetUpdateDate" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                 {
                     "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                         return row.WarehouseName;
                     }
                 },
                {
                    "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.DisplayName;
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.ProcessGroupName;
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false,
                    "mRender": function (data, type, row) {
                        return resources.get(row.Enabled);
                    },

                    "fnCreatedCell": function (nTd, sData) {
                        if (sData == "Sim") {
                            $(nTd).css({ "font-weight": "bold", "color": "#1E90FF" });
                        }
                        else
                            if (sData == "Não") {
                                $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                            }
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        if (row.FieldType == "Logical") {
                            if (row.Value == "S") {
                                return "Sim";
                            } else {
                                return "Não";
                            }
                        }
                        if (row.FieldType == "OptionList") {
                            return row.OptionValueText;
                        }
                        if (row.FieldType == "Password") {
                            if (row.Value) {
                                return "******";
                            }
                            return "";
                        }
                        return row.Value;
                    }
                },
                {
                    "aTargets": [5], "mRender": function(data, type, row) {
                                return resources.get(row.GetUpdateBy);
                    }
                },
                {
                    "aTargets": [6],"mRender": function(data, type, row) {
                        if (row.GetUpdateDate == null) {
                            return "-";
                        }
                        return moment(row.GetUpdateDate).format("DD/MM/YYYY HH:mm:ss");
                    }
                },
                {
                     "aTargets": [7],
                     "mData": null,
                     "mRender": function (data, type, row) {
                         {
                             return self.settings.editMarkup;
                         }
                     },
                     "bSortable": false,
                     "bSearchable": false
                }
            ]
        };
    },



    initAutocomplete: function (field, autocompleteUrl, render) {
    $(field).select2({
        placeholder: resources.get('Search...'),
        minimumInputLength: 0,
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
    return $.toDictionary(ko.toJS(this.model()));
}
});