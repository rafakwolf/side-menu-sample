var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ConfigurationFieldModel = Class.extend({



    init: function () {

        var self = this;
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.DisplayName = ko.observable();
        this.Description = ko.observable();
        this.ProcessGroup = ko.observable();
        this.FieldType = ko.observable();
        this.FieldListOptions = ko.observable();
        this.ProcessGroupName = ko.observable();
        this.ConfigurationFieldTypeName = ko.observable();
        this.OptionsList = ko.observableArray();
        this.OptionsListString = ko.observable();
        this.ValueDateTime = ko.observable();
        this.ValueDecimal = ko.observable();
        this.ValueInteger = ko.observable();
        this.ValueText = ko.observable();
        this.ValueOption = ko.observable();
        this.ValueLogical = ko.observable();
        this.ValuePassword = ko.observable();
        this.AuditInfo = ko.observable();
    },




    clear: function () {
     
        this.Id('');
        this.Name('');
        this.DisplayName('');
        this.Description('');
        this.ProcessGroup('');
        this.FieldType('');
        this.FieldListOptions('');
        this.ProcessGroupName('');
        this.ConfigurationFieldTypeName('');
        this.OptionsList.removeAll();
        this.OptionsListString('');
        this.ValueDateTime('');
        this.ValueDecimal('');
        this.ValueInteger('');
        this.ValueText('');
        this.ValueOption('');
        this.ValueLogical('');
        this.ValuePassword('');
        this.AuditInfo('');
    },





    load: function (model) {
        if (!model) {
            return;
        }

        var self = this;
        this.Id(model.Id);

       
        this.Name(model.Name);
        this.DisplayName(model.DisplayName);
        this.Description(model.Description);
        this.ProcessGroup(model.ProcessGroup);
        this.FieldType(model.FieldType);
        this.FieldListOptions(model.FieldListOptions);
        this.ProcessGroupName(model.ProcessGroupName);
        this.ConfigurationFieldTypeName(model.ConfigurationFieldTypeName);
        this.OptionsList(model.OptionsList);
        this.OptionsListString(model.OptionsListString);
        this.ValueDecimal(model.ValueDecimal);
        this.ValueInteger(model.ValueInteger);
        this.ValueText(model.ValueText);
        this.ValueOption(model.ValueOption);
        this.ValueLogical(model.ValueLogical);
        this.ValueDateTime(new moment(model.ValueDateTime).format(resources.get('SmallDateFormat')));
        this.ValuePassword(model.ValuePassword);
        this.AuditInfo(model.AuditInfo);

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
        $('#optionsPanel').hide();



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



        if (model.FieldType == "OptionList") {
            $('#optionsPanel').show();
        } else {
            $('#optionsPanel').hide();
        }

        //if (this.isFieldOption()) {
        //    $("#optionValueField").show();
        //    $("#ValueOption").removeClass("ignore");
        //    $("#ValueOption").empty();
        //    ko.utils.arrayForEach(this.OptionsList(), function (option) {
        //        var selectdValue = false;
        //        if (model.Value) {
        //            selectdValue = option.Key == model.Value;
        //        }
        //        if (selectdValue) {
        //            $("#ValueOption").append("<option selected value=\"" + option.Key + "\">" + option.Value + "</option>");
        //        } else {
        //            $("#ValueOption").append("<option value=\"" + option.Key + "\">" + option.Value + "</option>");
        //        }
        //    });
        //}

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

        if (model.FieldType == "OptionList") {
            $('#optionsPanel').show();
        } else {
            $('#optionsPanel').hide();
        }
    },


    addItem: function (model) {
        var newOption = { "Key": "", "Value": "" };
        model.OptionsList.push(newOption);
    }

});

hbsis.wms.settings.ConfigurationFieldViewModel = hbsis.wms.CrudForm.extend({
    crudModel: "",
    init: function (opts) {
        this._super(opts);

        crudModel = this;


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
        });


        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#ProcessGroup"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#FieldType"
        });


        $("#FieldType").on("select2-selecting",
            function (e) {

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
                $('#optionsPanel').hide();

                if (e.val == "Text") {
                    $("#textValueField").show();
                    $("#ValueText").removeClass("ignore");
                }

                if (e.val == "DateTime") {
                    $("#datetimeValueField").show();
                    $("#ValueDateTime").removeClass("ignore");
                }

                if (e.val == "Logical") {
                    $("#logicalValueField").show();
                    $("#ValueLogical").removeClass("ignore");
                }

                if (e.val == "Integer") {
                    $("#integerValueField").show();
                    $("#ValueInteger").removeClass("ignore");
                }

                if (e.val == "Decimal") {
                    $("#decimalValueField").show();
                    $("#ValueDecimal").removeClass("ignore");
                }

                if (e.val == "Password") {
                    $("#passwordValueField").show();
                    $("#ValuePassword").removeClass("ignore");
                }

                if (e.val == "OptionList") {
                    $('#optionsPanel').show(200);
                }

            }
        );
    },



    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ConfigurationFieldModel());
    },


    edit: function (model) {
        this._super(model);
        $("#ProcessGroup").select2("val", $("#ProcessGroup").val(), true);
        $("#FieldType").select2("val", $("#FieldType").val(), true);
    },



    clearSaveForm: function () {
        this._super();
        $("#ProcessGroup").select2("val", "", true);
        $("#FieldType").select2("val", "", true);
        $('#optionsPanel').hide();
    },




    removeItem: function (model) {
        crudModel.model().OptionsList.remove(model);
    },


    getFormData: function () {
        
        var optionListString = "";
        ko.utils.arrayForEach(this.model().OptionsList(), function (option) {
            optionListString += option.Key + ";" + option.Value + "|";
        });
        this.model().OptionsListString(optionListString);
        return this.form.serialize();
    },


    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "Name" },
              { "mData": "DisplayName" },
              { "mData": "ProcessGroupName" },
              { "mData": "ConfigurationFieldTypeName" },
              { "mData": "GetUpdateBy" },
              { "mData": "GetUpdateDate" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.Name;
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
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.ConfigurationFieldTypeName;
                    }
                },
                {
                    "aTargets": [4], "mRender": function(data, type, row) {
                                return resources.get(row.GetUpdateBy);
                    }
                },
                {
                    "aTargets": [5],"mRender": function(data, type, row) {
                            if (row.GetUpdateDate != null)
                                return moment(row.GetUpdateDate).format("DD/MM/YYYY HH:mm:ss");
                            else {
                                return "-";
                            }
                    }
                },
                {
                    "aTargets": [6],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
    }
});