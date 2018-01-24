var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};
var paginaAtualZero = true;
var dataInicio = null;
var dataFinal = null;

hbsis.wms.settings.TaskManagerViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#WorkType"
        });

        $("#Status option[value='Completed']").remove();
        hbsis.wms.Helpers.initAutoCompleteEnum({ field: "#Status" });

        $("#WorkType").val('');
        $("#WorkType").select2("val", $("#WorkType").val(), true);

        $("#Status").val('');
        $("#Status").select2("val", $("#Status").val(), true);

 dataInicio = moment().startOf('day');
 dataFinal = moment().endOf('day');

        this.refreshDatatable();
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start !== '' && start) {
           this.startDate = moment(start, 'DD/MM/YYYY');
          
        }

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end !== '' && end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
           
        }

        this.initDatetimeRangePicker("#reportrange");
        this.initModalConfirmButton();
    },
    buscar: function() {   
        paginaAtualZero = true;   
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
        $("#datatable").DataTable().page('first');
        paginaAtualZero = false;
    },
    csv: function() {
        var dados = this.recuperarValores();
        var rota = "TaskManager/Download?mapa="+dados.mapa+"&status="+dados.status+"&workType="+dados.WorkType+
                    "&WQStatus="+dados.wqStatus+"&AllTypes="+dados.allTypes+"&WQType="+dados.wqType+
                    "&placa="+dados.placa+"&enderecoOrigem="+dados.enderecoOrigem+"&enderecoDestino="+dados.enderecoDestino+
                    "&dataInicio="+dados.startDate+"&dataFinal="+dados.endDate;
        
        window.open(rota);
    },
    recuperarValores: function() {
        var data = {};
        if ($("#WorkType").val() != "" && $("#Status").val() != "") {
            data.allTypes = false;
        } else {
            data.allTypes = true;
        }

        if ($("#WorkType").val() != "") {
            data.wqType = true;
        } else {
            data.wqType = false;
        }
        data.WorkType = $("#WorkType").val();

        if ($("#Status").val() != "") {
            data.wqStatus = true;
        } else {
            data.wqStatus = false;
        }
        data.mapa = $("#mapa").val(),
        data.placa = $("#placa").val(),
        data.enderecoOrigem = $("#origem").val(),
        data.enderecoDestino = $("#destino").val(),
        data.status = $("#Status").val();
        data.startDate = moment(dataInicio).startOf('day').format('YYYY-M-DD H:mm:ss');
        data.endDate = moment(dataFinal).endOf('day').format('YYYY-M-DD H:mm:ss');
        return data;
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
                    self.dirty(true);
                    self.refreshDatatable();
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
                    dataInicio = start;
                }
                if (self.endDate != endDate) {
                    self.endDate = endDate;
                    dataFinal = end;
                }
            }
        });
    },
    workTypeFind: function () {
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
            "data": function () {
                var data = {};
                if ($("#WorkType").val() != "" && $("#Status").val() != "") {
                    data.AllTypes = false;
                } else {
                    data.AllTypes = true;
                }

                if ($("#WorkType").val() != "") {
                    data.WQType = true;
                } else {
                    data.WQType = false;
                }
                data.WorkType = $("#WorkType").val();

                if ($("#Status").val() != "") {
                    data.WQStatus = true;
                } else {
                    data.WQStatus = false;
                }
                data.Mapa = $("#mapa").val(),
                data.Placa = $("#placa").val(),
                data.EnderecoOrigem = $("#origem").val(),
                data.EnderecoDestino = $("#destino").val(),
                data.Status = $("#Status").val();
                data.startDate = self.startDate.format(resources.get('DD/MM/YYYY'));
                data.endDate = self.endDate.format(resources.get('DD/MM/YYYY'));
                if (paginaAtualZero) {
                     data.start = 0;
                }            
                return data;
            },
            "preDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "columns": [
                { "data": "WarehouseCode" },
                { "data": "DocumentNumber" },
                { "data": "SequenceId" },
                { "data": "LicensePlate" },
                { "data": "FromLocationCode" },
                { "data": "LocationCode" },
                { "data": "PalletDescription" },
                { "data": "Priority" },
                { "data": "Status" },
                { "data": "WorkType" },
                { "data": "UserLogin" },
                { "data": "CreatedDate" },
                { "data": "DataUltimaAssociacao" },
                { "data": "UpdatedDate" },
                { "data": null }
            ],
            "columnDefs": [
                  {
                      "targets": 0,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {
                      "targets": 1,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {

                      "targets": 2,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {
                      "targets": 3,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {

                      "targets": 4,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          if (data != null) {
                              return data;
                          } else {
                              return '-';
                          }
                      }
                  },
                  {
                      "targets": 5,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          if (data != null) {
                              return data;
                          } else {
                              return '-';
                          }
                      }
                  },
                  {
                      "targets": 6,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          if (data != null) {
                              return data;
                          } else {
                              return '-';
                          }
                      }
                  },
                  {
                      "targets": 7,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          if (data != null) {
                              return data;
                          } else {
                              return '-';
                          }
                      }
                  },
                  {
                      "targets": 8,
                      "data": null,
                      "orderable": true,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          if (data == 'Associada') {
                              return resources.get(data) + " <a name=\"unassoc\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-primary unassoc\" title=\"" + resources.get('Unassoc') + "\"><span style=\"display: none;\" name=\"id\">" + full.Id + "</span><span style=\"display: none;\" name=\"type\">3</span><span style=\"display: none;\" name=\"workType\">" + full.WorkTypeValue + "</span><i class=\"fa fa-times\"></i></a>";
                          } else {
                              return resources.get(data);
                          }
                      },
                      "createdCell": function (td, cellData, rowData, Row, col) {
                          var field = cellData.split("<")[0].replace(/\s+/g, '');
                          field = resources.get(field);

                          if (field == "Associada") {
                              $(td).css({ "font-weight": "bold", "color": "#4b8ddd", "width": "98px" });
                          }
                          else if (field == "Concluída" || field == "Completa") {
                              $(td).css({ "font-weight": "bold", "color": "#2cc36b" });
                          }
                          else if (field == "Não Associada") {
                              $(td).css({ "font-weight": "bold", "color": "#909089" });
                          }
                          else if (field == "Parcial") {
                              $(td).css({ "font-weight": "bold", "color": "#d4d64c" });
                          }
                          else if (field == "Bloqueada") {
                              $(td).css({ "font-weight": "bold", "color": "#FF0000" });
                          }
                          else if (field == "Cancelada") {
                              $(td).css({ "font-weight": "bold", "color": "#FFA500" });
                          }
                      }
                  },
                  {
                      "targets": 9,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return resources.get(data);
                      }
                  },
                  {
                      "targets": 10,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {
                      "targets": 11,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                  {
                      "targets": 12,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data !== undefined && data !== null
                            ? moment(data).format("DD/MM/YY HH:mm:ss")
                            : null;
                      }
                  },
                  {
                      "targets": 13,
                      "data": null,
                      "orderable": false,
                      "searchable": false,
                      "render": function (data, type, full, meta) {
                          return data;
                      }
                  },
                {
                    "targets": 14,
                    "data": null,
                    "defaultContent": self.settings.actionsMarkup,
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";

                        if (full.CanCancel)
                            html += "<a name=\"cancel\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-danger \" ><span style=\"display: none;\" name=\"id\">" + full.Id + "</span><span style=\"display: none;\" name=\"type\">4</span><span style=\"display: none;\" name=\"workType\">" + full.WorkTypeValue + "</span><li class=\"fa fa-times\" title=\"" + resources.get('Cancel') + "\"></li></a>";
                        if (full.CanBlock)
                            html += "<a name=\"block\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-default \" style=\"margin-left: 4px;\"><span style=\"display: none;\" name=\"id\">" + full.Id + "</span><span style=\"display: none;\" name=\"type\">2</span><span style=\"display: none;\" name=\"workType\">" + full.WorkTypeValue + "</span><li class=\"fa fa-unlock-alt\" title=\"" + resources.get('Block') + "\"></li></a>";
                        if (full.CanUnBlock)
                            html += "<a name=\"unblock\" data-toggle=\"modal\" data-target=\"#confirmModal\" class=\"label label-default \" style=\"margin-left: 4px;\"><span style=\"display: none;\" name=\"id\">" + full.Id + "</span><span style=\"display: none;\" name=\"type\">5</span><span style=\"display: none;\" name=\"workType\">" + full.WorkTypeValue + "</span><li class=\"fa fa-unlock\" title=\"" + resources.get('Unblock') + "\"></li></a>";

                        return html;
                    }
                }
            ],
            "drawCallback": this.addLink/*,
            "rowCallback": this.rowCallbackStatus*/
        };
    },
    addLink: function (settings) {
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
    }/*,
    rowCallbackStatus: function (row, data, index) {
        var self = this;
        self.dataTable.Api().row(row).data(data);
    }*/
});
