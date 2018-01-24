var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.RastreabilidadeViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);

        this.refreshDatatable();
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end) {
            this.endDate = moment(end, 'DD/MM/YYYY');
        }

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Tipo"
        });

        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#Evento"
        });

        $("#Tipo").val('');
        $("#Tipo").select2("val", $("#Tipo").val(), true);

        $("#Evento").val('');
        $("#Evento").select2("val", $("#Evento").val(), true);

        this.initDatetimeRangePicker("#reportrange");
    },
    tipoFind: function() {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },

    eventoFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
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
                if ($("#Tipo").val() != "" && $("#Tipo").val() != "") {
                    aoData.push({ "name": "AllTypes", "value": "false" });
                } else {
                    aoData.push({ "name": "AllTypes", "value": "true" });
                }

                if ($("#Tipo").val() != "") {
                    aoData.push({ "name": "FiltrarRastreabilidade", "value": "true" });
                    aoData.push({ "name": "TipoRastreabilidade", "value": $("#Tipo").val() });
                } else {
                    aoData.push({ "name": "FiltrarRastreabilidade", "value": "false" });
                    aoData.push({ "name": "TipoRastreabilidade", "value": $("#Tipo").val() });
                }

                if ($("#Evento").val() != "") {
                    aoData.push({ "name": "FiltrarTipoEvento", "value": "true" });
                    aoData.push({ "name": "EventoRastreabilidade", "value": $("#Evento").val() });
                } else {
                    aoData.push({ "name": "FiltrarTipoEvento", "value": "false" });
                    aoData.push({ "name": "EventoRastreabilidade", "value": $("#Evento").val() });
                }

                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aaSorting": [[4, 'desc']],
            "aoColumns": [
                { "mData": "TipoDescricao" },
                { "mData": "EventoDescricao" },
                { "mData": "Numero" },
                { "mData": "Identificacao" },
                { "mData": "DataHora" },
                { "mData": "NomeUsuario" },
                { "mData": "Endereco" },
                { "mData": "Lote" },
                { "mData": "Item" },
                { "mData": "Quantidade" },
                { "mData": "UnidadeMedida" },
                { "mData": "Equipamento" },
                { "mData": "Placa" },
                { "mData": "Validade" },
                { "mData": "Baia" }
            ],
            "aoColumnDefs": [
                  {
                      "aTargets": [0],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.TipoDescricao;
                      }
                  },
                  {
                      "aTargets": [1],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.EventoDescricao);
                      }
                  },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Numero > 0)
                              return row.Numero;
                          return "-";
                      }
                  },
                  {
                      "aTargets": [3],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Identificacao;
                      }
                  },
                  {
                      "aTargets": [4],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return moment(row.DataHora).format("DD/MM/YYYY HH:mm:ss");
                      }
                  },
                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.NomeUsuario != null && row.NomeUsuario != "")
                              return row.NomeUsuario;
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
                          if (row.Endereco != null && row.Endereco != "")
                              return row.Endereco;
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
                          if (row.Lote != null && row.Lote != "")
                              return row.Lote;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [8],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Item;
                      }
                  },
                  {
                      "aTargets": [9],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Quantidade != 0)
                              return row.Quantidade;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [10],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.UnidadeMedida;
                      }
                  },
                  {
                      "aTargets": [11],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Equipamento != null && row.Equipamento != "")
                              return row.Equipamento;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [12],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Placa != null && row.Placa != "")
                              return row.Placa;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [13],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Validade != null && row.Validade != "")
                              return row.Validade;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [14],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          if (row.Baia != null)
                              return row.Baia;
                          else
                              return '-';
                      }
                  }
            ]
        };
    }
});