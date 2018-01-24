var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TarefasFabricaViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#WorkType"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Status" });

        $("#WorkType").val('');
        $("#WorkType").select2("val", $("#WorkType").val(), true);

        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);

        this.refreshDatatable();
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        this.initDatetimeRangePicker("#reportrange");
        this.initModalConfirmButton();
    },
    initModalConfirmButton: function () {
        var self = this;
        $("button[id='modal-confirm']").click(function () {
            var modal = $('#confirmModal');
            var id = modal.find('input[id="parameter1"]').val();
            var type = modal.find('input[id="parameter2"]').val();
            var workType = modal.find('input[id="parameter3"]').val();

            self.tableRowId = id;

            $.ajax({
                type: "POST",
                dataType: 'json',
                url: urlPost + '/UpdateStatus/' + id + '/' + type + '/' + workType,
                success: function (data) {
                    var tr = $('tr[id=' + self.tableRowId + ']');
                    self.datatable.fnUpdate(data, tr[0], 8, false);
                    $('#confirmModal').modal('hide');
                },
                error: function (jqXHR) {
                    var results = new hbsis.wms.ErrorHandler(jqXHR);
                    if (results.hasErrors()) {
                        $('#confirmModal').find('.error').html(results.errors[0].Errors[0]);
                    }
                }
            });
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
    workTypeFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
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
                if ($("#WorkType").val() != "" && $("#Status").val() != "") {
                    aoData.push({ "name": "AllTypes", "value": "false" });
                } else {
                    aoData.push({ "name": "AllTypes", "value": "true" });
                }

                if ($("#WorkType").val() != "") {
                    aoData.push({ "name": "WQType", "value": "true" });
                    aoData.push({ "name": "WorkType", "value": $("#WorkType").val() });
                } else {
                    aoData.push({ "name": "WQType", "value": "false" });
                    aoData.push({ "name": "WorkType", "value": $("#WorkType").val() });
                }

                if ($("#Status").val() != "") {
                    aoData.push({ "name": "WQStatus", "value": "true" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                } else {
                    aoData.push({ "name": "WQStatus", "value": "false" });
                    aoData.push({ "name": "Status", "value": $("#Status").val() });
                }

                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
                { "mData": "WarehouseCode" },
                { "mData": "DocumentNumber" },
                { "mData": "SequenceId" },
                { "mData": "LicensePlate" },
                { "mData": "FromLocationCode" },
                { "mData": "LocationCode" },
                { "mData": "PalletDescription" },
                { "mData": "Priority" },
                { "mData": "Status" },
                { "mData": "WorkType" },
                { "mData": "UserLogin" },
                { "mData": "CreatedDate" },
                { "mData": "UpdatedDate" },
                { "mData": null }
            ],
            "aoColumnDefs": [
                  {
                      "aTargets": [0],
                      "mData": null,
                      "bSortable": true,
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
                          return row.DocumentNumber;
                      }
                  },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.SequenceId;
                      }
                  },
                  {
                      "aTargets": [3],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.LicensePlate;
                      }
                  },
                  {
                      "aTargets": [4],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.FromLocationCode != null)
                              return row.FromLocationCode;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.LocationCode != null)
                              return row.LocationCode;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [6],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.PalletDescription != null)
                              return row.PalletDescription;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [7],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Priority;
                      }
                  },
                  {
                      "aTargets": [8],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Status == 'Assigned')
                              return resources.get(row.Status) + " <a name=\"unassoc\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-primary unassoc\" title=\"" + resources.get('Unassoc') + "\"><span style=\"display: none;\" name=\"id\">" + row.Id + "</span><span style=\"display: none;\" name=\"type\">3</span><span style=\"display: none;\" name=\"workType\">" + row.WorkTypeValue + "</span><i class=\"fa fa-times\"></i></a>";
                          else 
                              return resources.get(row.Status);
                      },

                      "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                          var field = sData.split("<")[0].replace(/\s+/g, '');
                          if (field == "Associado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd", "width": "98px" });
                          }
                          else if (field == "Completo") {
                              $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                          }
                          else if (field == "Não Associado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                          }
                          else if (field == "Parcial") {
                              $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                          }
                          else if (field == "Bloqueado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });
                          }
                          else if (field == "Cancelado") {
                              $(nTd).css({ "font-weight": "bold", "color": "#FFA500" });
                          }
                      }
                  },
                  {
                      "aTargets": [9],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.WorkType);
                      }
                  },
                  {
                      "aTargets": [10],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.UserLogin;
                      }
                  },
                  {
                      "aTargets": [11],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.CreatedDate;
                      }
                  },
                  {
                      "aTargets": [12],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.UpdatedDate;
                      }
                  },
                {
                    "aTargets": [13],
                    "mData": null,
                    "sDefaultContent": self.settings.actionsMarkup,
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        var html = "";

                        if (row.CanCancel)
                            html += "<a name=\"cancel\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-danger \" ><span style=\"display: none;\" name=\"id\">" + row.Id + "</span><span style=\"display: none;\" name=\"type\">4</span><span style=\"display: none;\" name=\"workType\">" + row.WorkTypeValue + "</span><li class=\"fa fa-times\" title=\"" + resources.get('Cancel') + "\"></li></a>";
                        if (row.CanBlock)
                            html += "<a name=\"block\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-default \" style=\"margin-left: 4px;\"><span style=\"display: none;\" name=\"id\">" + row.Id + "</span><span style=\"display: none;\" name=\"type\">2</span><span style=\"display: none;\" name=\"workType\">" + row.WorkTypeValue + "</span><li class=\"fa fa-unlock-alt\" title=\"" + resources.get('Block') + "\"></li></a>";
                        if (row.CanUnBlock)
                            html += "<a name=\"unblock\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-default \" style=\"margin-left: 4px;\"><span style=\"display: none;\" name=\"id\">" + row.Id + "</span><span style=\"display: none;\" name=\"type\">5</span><span style=\"display: none;\" name=\"workType\">" + row.WorkTypeValue + "</span><li class=\"fa fa-unlock\" title=\"" + resources.get('Unblock') + "\"></li></a>";

                        return html;
                    }
                }
            ],
            "fnDrawCallback": this.addLink
        };
    },
    addLink: function () {
        function updateModal(ask, fieldObjet) {
            var id = $(fieldObjet).find('span[name=id]').html();
            var type = $(fieldObjet).find('span[name=type]').html();
            var workType = $(fieldObjet).find('span[name=workType]').html();
            var modal = $('#confirmModal');
            modal.find('h4[class="ask"]').html(ask);
            modal.find('input[id="parameter1"]').val(id);
            modal.find('input[id="parameter2"]').val(type);
            modal.find('input[id="parameter3"]').val(workType);

            $('#confirmModal').find('.error').html('');
        }
        
        $("a[name='block']").on('click', function () {
            updateModal(resources.get('BlockTask'), this);
        });

        $("a[name='unblock']").on('click', function () {
            updateModal(resources.get('UnblockTask'), this);
        });

        $("a[name='cancel']").on('click', function () {
            updateModal(resources.get('CancelTask'), this);
        });

        $("a[name='unassoc']").on("click", function () {
            updateModal(resources.get('UnassocTask'), this);
        });
    }
});