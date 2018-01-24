var hbsis = hbsis || {
  wms: {}
};
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PickMapDashboardView = Class.extend({
  init: function (opts) {
    this.settings = $.extend({
      detalhesCargasUrl: "",
      summaryDataURL: "",
      summaryCargoDataURL: "",
      containerAssembly: null,
      containerCargo: null,
      packagesTypes: null,
      filters: null
    }, opts);

    this.summary = ko.observableArray();
    this.temDadosDetalhesCargas = ko.observable(false);
    this.hasCargoSummary = ko.observable(false);
  },
  getSummaryData: function () {
    var self = this;

    $.ajax({
      url: self.settings.summaryDataURL,
      headers: {
        Accept: "application/json"
      },
      traditional: true,
      data: self.settings.filters,
      dataType: 'json',
      success: function (data, textState, jqXHR) {
        var hasData = (data.length > 0);
        var dataSet = [];
        var options = null;

        if (hasData) {
          var ticks = [];
          var maxTotal = 0;

          $(data).each(function (index, value) {
            var objType = $.grep(self.settings.packagesTypes, function (item) {
              return item.value == value.Status;
            });

            if (objType.length == 1) {
              objType = objType[0];
              if (value.Total > maxTotal) {
                maxTotal = value.Total;
              }

              dataSet.push({
                data: [
                  [value.Total, index]
                ],
                color: objType.color
              });

              ticks.push([index, objType.desc]);
            }
          });

          options = {
            series: {
              bars: {
                show: true
              }
            },
            bars: {
              align: "center",
              barWidth: 0.8,
              horizontal: true,
              fillColor: {
                colors: [
                  {
                    opacity: 1
                  }, {
                    opacity: 1
                  }
                ]
              },
              lineWidth: 1,
              numbers: {
                show: true,
                yAlign: function (y) {
                  return y;
                }
              }
            },
            xaxis: {
              axisLabel: "Montagem - Paletes por status",
              axisLabelUseCanvas: true,
              axisLabelFontSizePixels: 12,
              max: maxTotal + 5,
              tickColor: "#f0f0f0",
              color: "black",
              labelHeight: 30
            },
            yaxis: {
              axisLabelUseCanvas: true,
              tickColor: "#f0f0f0",
              ticks: ticks,
              color: "black",
              labelWidth: 100
            },
            legend: {
              show: false
            },
            grid: {
              borderWidth: 1,
              borderColor: '#e7e7e7'
            }
          };
        }

        self.summary(data);

        // montagem de pallets
        if (hasData) {
          $.plot(self.settings.containerAssembly, dataSet, options);
        }
      }
    });
  },
  getCargoSummaryData: function () {
    var self = this;

    $.ajax({
      url: self.settings.summaryCargoDataURL,
      headers: {
        Accept: "application/json"
      },
      traditional: true,
      data: self.settings.filters,
      dataType: 'json',
      success: function (data, textState, jqXHR) {
        var maxTotal = Math
          .max
          .apply(null, [data.CompletPalletes, data.ConferencePalletes, data.LoadedPalletes]);
        var hasData = (maxTotal > 0);
        var dataSet = [];
        var options = null;

        if (hasData) {
          var ticks = [
            [
              2, 'Separado'
            ],
            [
              1, 'Conferido'
            ],
            [0, 'Carregado']
          ];

          dataSet = [
            {
              data: [
                [data.CompletPalletes, 2]
              ],
              color: '#C1FFC1'
            }, {
              data: [
                [data.ConferencePalletes, 1]
              ],
              color: '#7CCD7C'
            }, {
              data: [
                [data.LoadedPalletes, 0]
              ],
              color: '#548B54'
            }
          ]

          options = {
            series: {
              bars: {
                show: true
              }
            },
            bars: {
              align: "center",
              barWidth: 0.8,
              horizontal: true,
              fillColor: {
                colors: [
                  {
                    opacity: 1
                  }, {
                    opacity: 1
                  }
                ]
              },
              lineWidth: 1,
              numbers: {
                show: true,
                yAlign: function (y) {
                  return y;
                }
              }
            },
            xaxis: {
              axisLabel: "Carregamento",
              axisLabelUseCanvas: true,
              axisLabelFontSizePixels: 12,
              max: maxTotal + 5,
              tickColor: "#f0f0f0",
              color: "black",
              labelHeight: 30
            },
            yaxis: {
              axisLabelUseCanvas: true,
              tickColor: "#f0f0f0",
              ticks: ticks,
              color: "black",
              labelWidth: 100
            },
            legend: {
              show: false
            },
            grid: {
              borderWidth: 1,
              borderColor: '#e7e7e7'
            }
          };
        }

        self.hasCargoSummary(hasData);

        // Grafico de carregamento
        if (hasData) {
          $.plot(self.settings.containerCargo, dataSet, options);
        }
      }
    });
  },
  obterDadosDetalhesCargas: function () {
    var self = this;

    $.ajax({
      url: self.settings.detalhesCargasUrl,
      headers: {
        Accept: "application/json"
      },
      traditional: true,
      data: self.settings.filters,
      dataType: 'json',
      success: function (data, textState, jqXHR) {
        function labelFormatter(label, series) {
          return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
        }
        self.settings.loading.fadeOut('fast');
        self.temDadosDetalhesCargas(data.GraficoPizza != null);

        var graficoPizza = data.GraficoPizza;
        var rotulos = data.Rotulos;

        if(data.GraficoPizza == null)
            return;

        var htmlTotalImportados = "Total de importados: <span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalImportados + "</span><br/>";

        var htmlTotalLiberados = "<div class='rotulo-principal-relatorio-detalhes-carga'><div class='rotulo-liberados'></div>Liberados: <span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberados + "</span></div>";
        var htmlPmPfLiberados = "<span class='subrotulo-relatorio-detalhes-carga'>PM: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberadosPaleteMisto
            + "</span><span class='pf-relatorio-detalhes-carga'>PF: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberadosPaleteFechado + "</span><br/>";
        var htmlDescartaveisRetornaveisLiberados = "<span class='subrotulo-relatorio-detalhes-carga'>Descart: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberadosPaletesDescartaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Retorn: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberadosPaletesRetornaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Ambos: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalLiberadosPaletesDescartaveisRetornaveis + "</span><br/>";

        var htmlTotalNaoLiberados = "<div class='rotulo-principal-relatorio-detalhes-carga'><div class='rotulo-nao-liberados'></div>Não Liberados: <span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberados + "</span></div>";
        var htmlPmPfNaoLiberados = "<span class='subrotulo-relatorio-detalhes-carga'>PM:<span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberadosPaleteMisto
            + "</span></span><span class='pf-relatorio-detalhes-carga'>PF: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberadosPaleteFechado + "</span><br/>";
        var htmlDescartaveisRetornaveisNaoLiberados = "<span class='subrotulo-relatorio-detalhes-carga'>Descart: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberadosPaletesDescartaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Retorn: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberadosPaletesRetornaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Ambos: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoLiberadosPaletesDescartaveisRetornaveis +"</span><br/>";

        var htmlTotalNaoCalculados = "<div class='rotulo-principal-relatorio-detalhes-carga'><div class='rotulo-nao-calculados'></div>Não Calculados: <span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculados  + "</span></div>";
        var htmlPmPfNaoCalculados = "<span class='subrotulo-relatorio-detalhes-carga'>PM: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculadosPaleteMisto
            + "</span><span class='pf-relatorio-detalhes-carga'>PF: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculadosPaleteFechado  + "</span><br/>";
        var htmlDescartaveisRetornaveisNaoCalculados = "<span class='subrotulo-relatorio-detalhes-carga'>Descart: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculadosPaletesDescartaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Retorn: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculadosPaletesRetornaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Ambos: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalNaoCalculadosPaletesDescartaveisRetornaveis  + "</span><br/>";

        var htmlTotalCarregados = "<div class='rotulo-principal-relatorio-detalhes-carga'><div class='rotulo-carregados'></div>Carregados: <span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregados  + "</span></div>";
        var htmlPmPfCarregados = "<span class='subrotulo-relatorio-detalhes-carga'>PM: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregadosPaleteMisto
            + "</span><span class='pf-relatorio-detalhes-carga'>PF: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregadosPaleteFechado  + "</span><br/>";
        var htmlDescartaveisRetornaveisCarregados = "<span class='subrotulo-relatorio-detalhes-carga'>Descart: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregadosPaletesDescartaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Retorn: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregadosPaletesRetornaveis
            + "</span><span class='retorn-relatorio-detalhes-carga'>Ambos: </span><span class='rotulo-relatorio-detalhes-carga'>" + rotulos.TotalCarregadosPaletesDescartaveisRetornaveis + "</span>";

        document.querySelector("#rotulos-relatorio-detalhes-carga").innerHTML = htmlTotalImportados + htmlTotalLiberados + htmlPmPfLiberados
            + htmlDescartaveisRetornaveisLiberados + htmlTotalNaoLiberados + htmlPmPfNaoLiberados + htmlDescartaveisRetornaveisNaoLiberados
            + htmlTotalNaoCalculados + htmlPmPfNaoCalculados + htmlDescartaveisRetornaveisNaoCalculados + htmlTotalCarregados + htmlPmPfCarregados
            + htmlDescartaveisRetornaveisCarregados;

        Highcharts.chart('grafico-pizza', {
          chart: {
            type: 'pie'
          },
          tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          title: {
            text: null
          },
          subtitle: {
            text: null
          },
          plotOptions: {
            pie: {
              size: 120,
              allowPointSelect: false,
              dataLabels: {
                enabled: true,
                connectorPadding: 1,
                crop: false,
                distance: 20,
                rotation: 10,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  "color": "contrast",
                  "fontSize": "10px",
                  "fontWeight": "bold"
                }
              }
            }
          },
          series: [
            {
              data: graficoPizza
            }
          ]
        });
      }
    });
  }
});