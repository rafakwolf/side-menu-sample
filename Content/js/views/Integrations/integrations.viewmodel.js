var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.BusinessTaskModel = Class.extend({
    init: function () {
        this.Status = ko.observable();
        this.ProcessName = ko.observable();
        this.StatusName = ko.observable();
        this.TraceMessage = ko.observable();
        this.RequestValueNotValidated = ko.observable();
        this.RequestValue = ko.observable();
        this.ResponseValue = ko.observable();
    },
    clear: function () {
        this.Status('');
        this.ProcessName('');
        this.StatusName('');
        this.TraceMessage('');
        this.RequestValueNotValidated('');
        this.RequestValue('');
        this.ResponseValue('');
    },
    load: function (model) {
        this.ProcessName(model.ProcessName);
        this.StatusName(model.StatusName);
        this.TraceMessage(model.TraceMessage);
        this.RequestValueNotValidated(model.RequestValueNotValidated);
        this.RequestValue(model.RequestValue);
        this.ResponseValue(model.ResponseValue);
    }
});

hbsis.wms.settings.BusinessTaskModelViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),

    editMarkup: "<a class=\"label label-default edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" ><i class=\"fa fa-exclamation-circle\"></i></a> ",
    processMarkup: "<a class=\"label label-default process\" href=\"#process\"><i class=\"fa fa-cogs\" title=\"Reprocessar Tarefa.\"></i></a>",        

    successProcess: "<div class=\"alert alert-success alert-white-alt rounded\">" +
            "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
            "<div class=\"icon\"><i class=\"fa fa-check-circle\"></i></div>{successMessage}</div>",

	errorProcessAlert: "<div class=\"alert alert-danger alert-white-alt rounded\">" +
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>" +
                "<div class=\"icon\"><i class=\"fa fa-times-circle\"></i></div>{errorMessage}</div>",

	processTaskUrl: "",
	init: function (opts) {
	    this._super(opts);
	    this.processTaskUrl = this.settings.processTaskUrl + '/ProcessTask';

		var start = hbsis.wms.Helpers.querystring('startDate');
		if (start)
		    this.startDate = moment(start, 'DD/MM/YYYY');

		var end = hbsis.wms.Helpers.querystring('endDate');
		if (end)
		    this.endDate = moment(end, 'DD/MM/YYYY');

		this.initDatetimeRangePicker("#reportrange");

		hbsis.wms.Helpers.initAutoCompleteEnum({
		    field: "#Status"
		});

		hbsis.wms.Helpers.initAutoCompleteEnum({
		    field: "#Type"
		});

		hbsis.wms.Helpers.initAutoCompleteEnum({
		    field: "#ProcessTypeFilter"
		});

		$("#Type").val('');
		$("#Type").select2("val", $("#Type").val(), true);

		$("#ProcessTypeFilter").val('');
		$("#ProcessTypeFilter").select2("val", $("#ProcessTypeFilter").val(), true);
	},
	createModel: function () {
	    return ko.observable(new hbsis.wms.settings.BusinessTaskModel());
	},
	statusFind: function () {
	    var self = this;	    
	    self.dirty(true);
	    self.refreshDatatable();
	},
	applyDatabind: function (ko) {
		var self = this;

		if (self.datatable != null) {
			self.document.on("click", self.settings.datatableId + " " + ".process", function (e) {
				var row = $(this).parents('tr')[0];
				var model = self.datatable.fnGetData(row);
				self.processTask(model);
			});
		}

		this._super(ko);
	},
	processTask: function (model) {	    
	    var self = this;
	    var cloneModel = { Id : model.Id };
	    waitingDialog.show('Reprocessando...');
	    var successResult = false;
	    $.ajax({
	        async: true,
	        url: this.processTaskUrl,
	        data: cloneModel,
	        dataType: "JSON",
	        type: "POST",
	        success: function (data, textStatus, jqXHR) {
	            waitingDialog.hide();
	            successResult = data.success;
	            if (successResult) {
	                var errorAlert = self.successProcess.replace("{successMessage}", data.message);
	                $("#modelContentMessage").prepend(errorAlert);
	            } else {
	                var errorAlert = self.errorProcessAlert.replace("{errorMessage}", data.message);
	                $("#modelContentMessage").prepend(errorAlert);
	            }	            
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	            waitingDialog.hide();
	            var errorAlert = self.errorProcessAlert.replace("{errorMessage}", errorThrown);
	            $("#modelContentMessage").prepend(errorAlert);
	        },
	        complete: function (jqXRH, textStatus) {
	            self.dirty(true);
	            self.refreshDatatable();
	        }
	    });
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
	getDatatableConfig: function () {
		var self = this;
		return {
		    "fnServerParams": function (aoData) {		        
		        aoData.push({ "name": "status", "value": $("#Status").val() });
		        aoData.push({ "name": "type", "value": $("#Type").val() });
		        if ($("#Type").val() != "") {
		            aoData.push({ "name": "allTypes", "value": "false" });
		        } else {
		            aoData.push({ "name": "allTypes", "value": "true" });
		        }
		        aoData.push({ "name": "processTypeFilter", "value": $("#ProcessTypeFilter").val() });
		        if ($("#ProcessTypeFilter").val() != "") {
		            aoData.push({ "name": "allProcess", "value": "false" });
		        } else {
		            aoData.push({ "name": "allProcess", "value": "true" });
		        }

		        aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
		        aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
		    },
			"aoColumns": [
              { "mData": "Id" },
              { "mData": "IntegratorName" },
              { "mData": "CreatedDate" },
              { "mData": "ProcessName" },
              { "mData": "Description" },
              { "mData": "Status" },
              { "mData": null }
			],
			"aoColumnDefs": [
                {
                	"aTargets": [0], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                		return row.SequenceId;
                	}
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": false, "bSearchable": false, "mRender": function (data, type, row) {
                        return row.IntegratorName;
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": true, "bSearchable": true, "mRender": function (data, type, row) {
                        if (row.CreatedDate == null) {
                            return "-";
                        }
                        return moment(row.CreatedDate).format("DD/MM/YYYY HH:mm");
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                		return row.ProcessName;
                	}
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                		return row.Description;
                	}
                },
                {
                    "aTargets": [5], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                		return row.StatusName;
                	},
                	"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {                	    
                        if (sData == "Erro") {
                            $(nTd).addClass("businessTaskError");
                        } else if (sData == "Reprocessado") {
                            $(nTd).addClass("businessTaskReprocess");
                        }
                    }
                },
                {
                    "aTargets": [6], "mData": null, "sDefaultContent": self.editMarkup, "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        var erro = oData.Status == "Error";
                        var desabilitado = oData.Status == "Desabilitada";                         
                        if (erro) {
                            $(nTd).append(self.processMarkup);
                            var editElement = $(nTd).children()[0];
                            var selectEditElement = $(editElement);
                            selectEditElement.removeClass('label-default');
                            selectEditElement.addClass('label-danger');
                        }
                        if (desabilitado) {
                            $(nTd).append(self.processMarkup);
                        }                        
                    }
                }
			]
		};
	}
});

hbsis.wms.settings.BusinessTaskModelProcessViewModel = hbsis.wms.settings.BusinessTaskModelViewModel.extend({
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "status", "value": $("#Status").val() });
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "Id" },
              { "mData": "CreatedDate" },
              { "mData": "ProcessName" },
              { "mData": "Description" },
              { "mData": "Status" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.SequenceId;
                    }
                },
                {
                    "aTargets": [1], "mData": null, "bSortable": true, "bSearchable": true, "mRender": function (data, type, row) {
                        if (row.CreatedDate == null) {
                            return "-";
                        }
                        return moment(row.CreatedDate).format("DD/MM/YYYY HH:mm");
                    }
                },
                {
                    "aTargets": [2], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.ProcessName;
                    }
                },
                {
                    "aTargets": [3], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.Description;
                    }
                },
                {
                    "aTargets": [4], "mData": null, "bSortable": false, "bSearchable": true, "mRender": function (data, type, row) {
                        return row.StatusName;
                    },
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (sData == "Erro") {
                            $(nTd).addClass("businessTaskError");
                        } else if (sData == "Reprocessado") {
                            $(nTd).addClass("businessTaskReprocess");
                        }
                    }
                },
                {
                    "aTargets": [5], "mData": null, "sDefaultContent": self.editMarkup + self.processMarkup, "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        var enabled = oData.Status == "Error";
                        if (!enabled) {
                            $(nTd).children()[1].style.display = 'none';
                            var editElement = $(nTd).children()[0];
                            var selectEditElement = $(editElement);
                            selectEditElement.removeClass('label-danger');
                            selectEditElement.addClass('label-default');
                        }
                    }
                }
            ]
        };
    }
});