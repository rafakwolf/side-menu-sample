var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PickMapView = Class.extend({
    init: function (opts) {
        this.settings = $.extend({
            dataURL: "",
            container: null,
            loading: null,
            /*progressRedThreshold: 0,*/
            dataRefreshInterval: 60 * 1000,
            packagesTypes: null,
            interval: null,
            filters: null
        }, opts);

        this.dashboard = null;
        this.maps = ko.observableArray();
        this.summary = ko.observableArray();
        this.detalhesCargas = ko.observableArray();
        this.cargoSummary = ko.observableArray();

        this.initFilterStatus();
        this.initCalendar();
        this.initDashboard(opts);
    },
    applyDatabind: function (ko) {
        ko.applyBindings(this, this.settings.container.get(0));
    },
    initFilterStatus: function () {
        var self = this;

        $(this.settings.packagesTypes).each(function (index, value) {
            value.selected = ko.observable(true);
        });

        this.status = $.map(this.settings.packagesTypes, function (v, i) {
            return v.value;
        });
    },
    initCalendar: function () {
        var periodoDoDia = moment().format('a');
        var passouDoMeioDia = periodoDoDia.toUpperCase() == 'PM';
        this.startDate = passouDoMeioDia
            ? moment().add(1, 'days').format('DD/MM/YYYY') 
            : moment().format('DD/MM/YYYY');

        this.initSingleDatetimePicker("#reportrange");
    },
    initDashboard: function (opts) {
        this.dashboard = new hbsis.wms.settings.PickMapDashboardView(opts);
    },
    updateFilters: function () {
        this.settings.filters = {
            startDate: this.startDate,
            selectedStatus: this.status
        }

        this.dashboard.settings.filters = this.settings.filters;
    },
    initData: function () {
        var self = this;
        self.settings.loading.fadeIn('fast');

        self.loadData();

        if (this.settings.interval != null) {
            clearInterval(this.settings.interval);
        }

        this.settings.interval = setInterval(function () {
            self.loadData();
        }, self.settings.dataRefreshInterval);
    },
    loadData: function () {
        this.updateFilters();
        this.dashboard.obterDadosDetalhesCargas();
        this.getData();
        this.dashboard.getSummaryData();
        this.dashboard.getCargoSummaryData();
    },
    initSingleDatetimePicker: function (field) {
        var self = this;
        hbsis.wms.Helpers.initSingleDatetimePicker({
            field: field,
            config: {
                startDate: this.startDate
            },
            callback: function (start) {
                var startDate = start.format(resources.get('SmallDateFormat'));

                if (self.startDate != startDate) {
                    self.startDate = startDate;
                }

                self.initData();
            }
        });
    },
    filterByStatus: function (type) {
        var self = this;

        var index = self.status.indexOf(type.value);
        if (index > -1) {
            self.status.splice(index, 1);
            type.selected(false);
        }
        else {
            self.status.push(type.value);
            type.selected(true);
        }

        self.initData();
    },
    getData: function () {
        var self = this;
        $.ajax({
            url: self.settings.dataURL,
            headers: { Accept: "application/json" },
            traditional: true,
            data: self.settings.filters,
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                $(data).each(function (index, value) {
                    value.cssStatus = 'alert ' + (value.WarningAlert ? 'on' : 'off');
                    value.descStatus = 'Mapa ' + (value.WarningAlert ? 'com' : 'sem') + ' pontos de atenção';
                    $(value.Data).each(function (i, v) {
                        var css = '';

                        switch (v.Status) {
                            case 0:
                                css = 'gray';
                                break;
                            case 1:
                                css = 'blue';
                                break;
                            case 2:
                                css = 'green';
                                break;
                            case 3:
                                css = 'yellow';
                                break;
                            case 4:
                                break;
                            case 5:
                                css = 'loaded';
                                break;
                            case 6:
                                css = 'loaded';
                                break;
                            case 8:
                                css = "conferred";
                                break;
                            case 10:
                                css = "separacao-balanca";
                                break;
                        }

                        if (v.BulkPallet) {
                            css = css + ' full';
                        }

                        if (v.Status == 7) {
                            css = css + ' calledoff';
                        }

                        if (v.Description.match(/Z_Item_Nao/i)) {
                            css = css + ' npal';
                        }
                        if (v.IsRepack) {
                            css = css + ' isrepack';
                        }

                        if (v.Description.match(/Descart/)) {
                            css = css + ' package-item-round';
                        }

                        v.css = css;
                    });
                });

                self.maps(data);

                var opts = { gravity: 'n', fade: true, html: true };
                $('.table .package-item').tipsy();
                $('.table .alert').tipsy();
            }
        });
    }
});