var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.TemposSeparacaoPorItemViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    init: function (opts) {
        this._super(opts);
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
              { "mData": "DataEntrega" },
              { "mData": "Mapa" },
              { "mData": "Palete" },
              { "mData": "AreaSeparacao" },
              { "mData": "Usuario" },
              { "mData": "Item" },
              { "mData": "Quantidade" },
              { "mData": "Origem" },
              { "mData": "Destino" },
              { "mData": "DataHoraInicio" },
              { "mData": "DataHoraFim" },
              { "mData": "Esforco" }
            ], "aoColumnDefs": [
                {
                    "aTargets": [0], "mData": null, "bSortable": false,
                    "bSearchable": false, "mRender": function (data, type, row) {
                        return row.DataEntrega;
                    }
                },
                 {
                     "aTargets": [1], "mData": null, "bSortable": true,
                     "bSearchable": false, "mRender": function (data, type, row) {
                         return row.Mapa;
                     }
                 },
                  {
                      "aTargets": [2], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          return row.Palete;
                      }
                  },
                  {
                      "aTargets": [3], "mData": null, "bSortable": false,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          return row.AreaSeparacao;
                      }
                  },
                   {
                       "aTargets": [4], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row) {
                           return row.Usuario;
                       }
                   },
                   {
                       "aTargets": [5], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row) {
                           return row.Item;
                       }
                   },
                   {
                       "aTargets": [6],
                       "bSortable": false, "sClass": "text-center",
                       "bSearchable": false,
                       "mRender": function (data, type, row) {

                       	if (row.Quantidade == '0')
                               return "-";
                       	return row.Quantidade;
                       }
                   },
                  {
                      "aTargets": [7],
                      "bSortable": false, "sClass": "text-center",
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Origem;
                      }
                  },
                   {
                       "aTargets": [8],
                       "bSortable": false, "sClass": "text-center",
                       "bSearchable": false,
                       "mRender": function (data, type, row) {
                       	    return row.Destino;
                       }
                   },
                {
                    "aTargets": [9],
                    "bSortable": true,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return row.DataHoraInicio;
                    }
                },
               {
                   "aTargets": [10],
                   "bSortable": false, "sClass": "text-center",
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                   	    return row.DataHoraFim;
                   }
               },
               {
                   "aTargets": [11],
                   "bSortable": false, "sClass": "text-center",
                   "bSearchable": false,
                   "mRender": function (data, type, row) {
                       return row.Esforco;
                   }
               },
            ]
        };
    }
});