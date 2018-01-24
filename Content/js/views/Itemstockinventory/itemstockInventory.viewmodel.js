var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemStockInventoryViewModel = hbsis.wms.CrudForm.extend({
    init: function(opts) {
        this._super(opts);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
            "aoColumns": [
              { "mData": "WarehouseCode" },
              { "mData": "Item" },
              { "mData": "Description" },
              { "mData": "Lote" },
              { "mData": "LocationName" },
              { "mData": "TipoEndereco" },
              { "mData": "Quantity" }, /* Dinamíco, se for fábrica Mostra Controle */
              { "mData": "QuantidadeCaixas" }, /* Dinamíco, se for fábrica Mostra Paletes */
              { "mData": "ExpirationDate" }, 
              { "mData": "Status" },
              { "mData": "LpnNumber" }
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
                          return row.Item;
                      }
                  },
                  {
                      "aTargets": [2],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.Description;
                      }
                  },
                  //{
                  //    "aTargets": [3],
                  //    "mData": null,
                  //    "bSortable": false,
                  //    "bSearchable": false,
                  //    "mRender": function (data, type, row) {
                  //        return row.Lote;
                  //    }
                  //},
                  {
                      "aTargets": [4],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.LocationName;
                      }
                  },
                  {
                      "aTargets": [5],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.TipoEndereco;
                      }
                  },
                  {
                      "aTargets": [6],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.EhFabrica ? row.QuantidadePaletes : row.QuantidadeCaixas;
                      }
                  },
                  {
                      "aTargets": [7],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.EhFabrica ? row.QuantidadeControle : row.Quantity;
                      }
                  },
                  {
                      "aTargets": [8],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.ExpirationDate;
                      }
                  },
                  {
                      "aTargets": [9],
                      "mData": null,
                      "bSortable": true,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return resources.get(row.Status);
                      }
                  },
                  {
                      "aTargets": [10],
                      "mData": null,
                      "bSortable": false,
                      "bSearchable": false,
                      "mRender": function (data, type, row) {
                          return row.LpnNumber;
                      }
                  }
            ],
            "fnHeaderCallback": function (header, data, iStart, iEnd, aiDisplay) {
                if (data.length > 0 && data[0].EhFabrica) {
                    header.cells[6].innerHTML = "<strong>Qtd. Palete</strong>";
                    header.cells[7].innerHTML = "<strong>Qtd. Controle</strong>";
                }
            }
        };
    }
});