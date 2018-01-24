var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.EventoHistoricoModel = Class.extend({
    init: function (evento) {
        this.NomeUsuario = evento.NomeUsuario;
        this.Descricao = evento.Descricao;
        this.Data = evento.Data;
    }
});

hbsis.wms.settings.HitoricoTarefaModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.IdArmazem = ko.observable();
        this.CodigoArmazem = ko.observable();
        this.DescricaoTarefa = ko.observable();
        this.DataUltimoEvento = ko.observable();
        this.UltimoEvento = ko.observable();
        this.StatusAtualTarefa = ko.observable();
        this.DescricaoStatusAtualTarefa = ko.observable();

        this.Eventos = ko.observableArray([]);
    },
    clear: function () {
        this.Id('');
        this.IdArmazem('');
        this.CodigoArmazem('');
        this.DescricaoTarefa('');
        this.DataUltimoEvento('');
        this.UltimoEvento('');
        this.StatusAtualTarefa('');
        this.DescricaoStatusAtualTarefa('');

        this.Eventos([]);
    },
    load: function (model) {
        this.Id(model.Id);
        this.IdArmazem(model.Code);
        this.CodigoArmazem(model.Code);
        this.DescricaoTarefa(model.DescricaoTarefa);
        this.DataUltimoEvento(model.DataUltimoEvento);
        this.UltimoEvento(model.UltimoEvento);
        this.StatusAtualTarefa(model.StatusAtualTarefa);
        this.DescricaoStatusAtualTarefa(model.DescricaoStatusAtualTarefa);

        this.Eventos($.map(model.Eventos, function (el) {
            return new hbsis.wms.settings.EventoHistoricoModel(el);
        }));
    }
});

hbsis.wms.settings.LocationViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
        hbsis.wms.Helpers.initAutoCompleteEnum({
            field: "#StatusAtualTarefa"
        });

        $("#StatusAtualTarefa").val('');
        $("#StatusAtualTarefa").select2("val", $("#StatusAtualTarefa").val(), true);

        this.refreshDatatable();

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
        return ko.observable(new hbsis.wms.settings.HitoricoTarefaModel());
    },
    clearSaveForm: function () {
        this._super();
    },
    edit: function (model) {
        this._super(model);
    },
    getModelDescription: function (model) {
        return model.Name;
    },
    workTypeFind: function () {
        var self = this;
        self.dirty(true);
        self.refreshDatatable();
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                if ($("#StatusAtualTarefa").val() != "") {
                    aoData.push({ "name": "WQStatus", "value": "true" });
                    aoData.push({ "name": "StatusAtualTarefa", "value": $("#StatusAtualTarefa").val() });
                } else {
                    aoData.push({ "name": "WQStatus", "value": "false" });
                    aoData.push({ "name": "StatusAtualTarefa", "value": $("#StatusAtualTarefa").val() });
                }

                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "CodigoArmazem" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                  {
                      "aTargets": [0],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.DescricaoArmazem;
                      }
                  },
                  {
                      "aTargets": [1],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.Processo);
                      }
                  },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.DataUltimoEvento;
                      }
                  },
                  {
                      "aTargets": [3],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.UltimoEvento;
                      }
                  },

                  {
                      "aTargets": [4],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.DescricaoTarefa;
                      }
                  },

                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.DescricaoStatusAtualTarefa;
                      }
                  },
                {
                    "aTargets": [6],
                    "mData": null,
                    "sDefaultContent": self.settings.viewMarkup,
                    "bSortable": false,
                    "bSearchable": false
                }
            ]
        };
    },
    initAutocomplete: function (field, autocompleteUrl, render, searchRequestData) {
        $(field).select2({
            placeholder: resources.get('Search...'),
            ajax: {
                url: autocompleteUrl,
                dataType: 'json',
                data: function (term, page) {

                    if (searchRequestData) {
                        return searchRequestData(term, page);
                    }

                    return {
                        search: term,
                        start: 0,
                        length: 100
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
    }
});