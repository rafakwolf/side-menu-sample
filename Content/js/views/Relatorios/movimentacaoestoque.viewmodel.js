var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.MovimentacaoEstoqueModel = Class.extend({
    init: function () {
        this.ItemCodigo = ko.observable();
        this.ItemNome = ko.observable();
        this.TotalEstoqueInicial = ko.observable();
        this.TotalSaidas = ko.observable();
        this.TotalEntradas = ko.observable();
        this.TotalPerdas = ko.observable();
        this.TotalSobras = ko.observable();
        this.TotalEstoqueFinal = ko.observable();
        this.Lotes = ko.observableArray();
    }
});

hbsis.wms.settings.MovimentacaoEstoqueViewModel = hbsis.wms.CrudForm.extend({
    startDate: moment(),
    endDate: moment(),
    urldetalheMovimentacao: "",
    init: function (opts) {
        this._super(opts);
        var self = this;
        urldetalheMovimentacao = this.settings.urldetalheMovimentacao;
        var start = hbsis.wms.Helpers.querystring('startDate');
        if (start)
            this.startDate = moment(start, 'DD/MM/YYYY');

        var end = hbsis.wms.Helpers.querystring('endDate');
        if (end)
            this.endDate = moment(end, 'DD/MM/YYYY');

        this.initDatetimeRangePicker("#reportrange");

        if (self.datatable != null) {
            self.document.on("click",
                this.settings.datatableId + " .mostrarDetalhe",
                function (e) {
                    var row = $(this).closest('tr')[0];
                    var model = self.datatable.fnGetData(row);
                    var detalhe = $(self.settings.datatableId).find('tr.detalhe');
                    var detalheDaLinhaAtual = $(self.settings.datatableId).find('tr.c' + model.ItemCodigo);
                    if (detalhe[0]) {
                        $('.linha-detalhe').unbind();
                        detalhe.remove();
                    }
                    if (!detalheDaLinhaAtual[0]) {
                        $(row).addClass('c' + model.ItemCodigo);
                        var html = $(self.mostrarLotesDoItem(model));
                        $(row).after(html);

                        $('.linha-detalhe').click(function () {
                            var codigoItem = $(this).attr('codigoitem');
                            var codigoLote = $(this).attr('codigolote');
                            var dataInicial = self.startDate.format(resources.get('DD/MM/YYYY'));
                            var dataFinal = self.endDate.format(resources.get('DD/MM/YYYY'));

                            var uriget = urldetalheMovimentacao +
                                '?codigoItem=' + codigoItem + '&codigoLote=' + codigoLote + '&dataInicial=' + dataInicial + '&dataFinal=' + dataFinal;

                            $.get(uriget, function (data) {
                                debugger;
                                $("#modal-detalhe").html(data);
                                $("#modal-entradas-saidas").modal();
                            });

                        });
                    } else {
                        $('.linha-detalhe').unbind();
                        $(row).removeClass('c' + model.ItemCodigo);
                    }
                });
        }
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
        return ko.observable(new hbsis.wms.settings.MovimentacaoEstoqueModel());
    },
    getModelDescription: function (model) {
        return model.body;
    },
    applyDatabind: function (ko) {
        var self = this;

        this._super(ko);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "bFilter": false,
            "bPaginate": false,
            "iDisplayLength": 99999,
            "fnRowCallback": function (nRow, data, index) {
            },
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "ItemCodigo" },
                { "mData": "ItemNome" },
                { "mData": "TotalEstoqueInicial" },
                { "mData": "TotalEntradas" },
                { "mData": "TotalSaidas" },
                { "mData": "TotalEstoqueFinal" }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0], "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).prepend("<i class=\"fa fa-plus mostrarDetalhe\"></i>");
                    }
                },
                { "aTargets": [1], "className": "dt-body-right", "bSortable": false, "bSearchable": false },
                {
                    "aTargets": [2], "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).addClass("text-right");
                    },
                    "mRender": function (data, type, row) {
                        return row.TotalEstoqueInicial;
                    }
                },
                {
                    "aTargets": [3], "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).addClass("text-right");
                    }
                },
                {
                    "aTargets": [4], "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).addClass("text-right");
                    }
                },
                {
                    "aTargets": [5], "bSortable": false, "bSearchable": false,
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).addClass("text-right");
                    }
                }
            ]
        };
    },
    mostrarLotesDoItem(item) {
        var detalhe =
            '<tr class="detalhe"><td colspan=6><table>';

        $.each(item.Lotes, function (key, value) {
            detalhe +=
                '<tr class="linha-detalhe" codigoitem="' + item.ItemCodigo + '" codigolote="' + (value.CodigoLote ? value.CodigoLote : 'nulo') + '">' +
                    '<td width="47%">' + (value.CodigoLote ? value.CodigoLote : 'Sem Lote') + '</td>' +
                    '<td width="15%">' + value.TotalEstoqueInicial + '</td>' +
                    '<td width="12%">' + value.TotalEntradas + '</td>' +
                    '<td width="12%">' + value.TotalSaidas + '</td>' +
                    '<td width="15%">' + value.TotalEstoqueFinal + '</td>' +
                '</tr>';
        });

        detalhe += '</table></td></tr>';

        return detalhe;
    }
});