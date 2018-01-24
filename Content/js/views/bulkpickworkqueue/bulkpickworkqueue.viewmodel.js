var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.LoadingWorkQueueModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Priority = ko.observable();
    },
    clear: function () {
        this.Id('');
        this.Priority('');


    },
    load: function (model) {
        this.Id(model.Id);
        this.Priority(model.Priority);

    }
});

hbsis.wms.settings.BulkPickWorkQueueViewModel = hbsis.wms.CrudForm.extend({
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
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.LoadingWorkQueueModel());
    },
    renderProfile: function (profile) {
        return profile.Name;
    },
    clearSaveForm: function () {
        this._super();

    },
    edit: function (model) {
        this._super(model);
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "startDate", "value": self.startDate.format(resources.get('DD/MM/YYYY')) });
                aoData.push({ "name": "endDate", "value": self.endDate.format(resources.get('DD/MM/YYYY')) });
            },
            "aoColumns": [
                { "mData": "Warehouse" },
                { "mData": "PickMaster" },
                { "mData": "SequenceId" },
                { "mData": "PickMaster" },
                { "mData": "FromLocation" },
                { "mData": "Location" },
                { "mData": "Priority" },
                { "mData": "Status" },
                { "mData": "User" },
                { "mData": "AuditInfo.CreatedDate" },
                { "mData": null }

            ],
            "aoColumnDefs": [
                  
               {
                   "aTargets": [0], "mData": null, "bSortable": false,
                   "bSearchable": false, "mRender": function (data, type, row) {
                       
                       return row.Warehouse.ShortCode;
                   }
               },
                  {
                      "aTargets": [1], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          if (row.DocumentNumber != null)
                              return row.DocumentNumber;
                          else
                              return '-';
                      }
                  },
                  {
                      "aTargets": [2], "mData": null, "bSortable": true,
                      "bSearchable": false, "mRender": function (data, type, row) {
                          if (row.SequenceId != null)
                              return row.SequenceId;
                          else
                              return '-';
                      }
                  },
                   {
                       "aTargets": [3], "mData": null, "bSortable": false,
                       "bSearchable": false, "mRender": function (data, type, row) {
                           if (row.PickMaster != null)
                               return row.PickMaster.PalletDescription;
                           else
                               return '-';
                       }
                   },

                  {
                      "aTargets": [4], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.FromLocation != null) {
                              return resources.get(row.FromLocation.Code);
                          } else {
                              return " - ";
                          }

                      }
                  },
                  {
                      "aTargets": [5], "mData": null, "bSortable": false,
                      "bSearchable": true, "mRender": function (data, type, row) {
                          if (row.Location != null) {
                              return resources.get(row.Location.Code);
                          } else {
                              return " - ";
                          }

                      }
                  },
                   {
                       "aTargets": [6], "mData": null, "bSortable": true,
                       "bSearchable": false, "mRender": function (data, type, row)
                       { return (row.Priority); }
                   },

                    {
                        "aTargets": [7], "mData": null, "bSortable": true,
                        "bSearchable": false, "mRender": function (data, type, row)
                        { return resources.get(row.Status); },

                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            if (sData == "Associado") {
                                $(nTd).css({ "font-weight": "bold", "color": "#4b8ddd" });
                            }
                            else if (sData == "Completo") {
                                $(nTd).css({ "font-weight": "bold", "color": "#2cc36b" });
                            }
                            else if (sData == "Não Associado") {
                                $(nTd).css({ "font-weight": "bold", "color": "#909089" });
                            }
                            else if (sData == "Parcial") {
                                $(nTd).css({ "font-weight": "bold", "color": "#d4d64c" });
                            }
                            else if (sData == "Bloqueado") {
                                $(nTd).css({ "font-weight": "bold", "color": "#FF0000" });

                            }
                        }
                    },
                    {
                        "aTargets": [8], "mData": null, "bSortable": false,
                        "bSearchable": true, "mRender": function (data, type, row) {
                            if (row.User != null) {
                                return resources.get(row.User.Login);
                            } else {
                                return " - ";
                            }

                        }
                    },

                     {
                         "aTargets": [9], "mData": null, "bSortable": false,
                         "bSearchable": false, "mRender": function (data, type, row) {

                             return moment(row.AuditInfo.CreatedDate).format("DD/MM/YY HH:mm");
                         }
                     },


              {
                  "aTargets": [10],
                  "mData": null,
                  "sDefaultContent": "<a class=\"label label-primary edit\" href=\"#edit\" data-target=\"#save-modal\" data-toggle=\"modal\" >" +
                "<i class=\"fa fa-pencil\"></i></a> ",
                  "bSortable": false,
                  "bSearchable": false

              }

            ]
        };
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
    }
});