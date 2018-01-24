var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.MessageUserModel = Class.extend({
    init: function (users) {
        this.Id = users.Id;
        this.Name = users.Name;
    }
});

hbsis.wms.settings.MessageModel = Class.extend({
    init: function () {
        this.Id = ko.observable();
        this.Body = ko.observable();
        this.ExpirationDate = ko.observable();
        this.Users = ko.observableArray([]);
        this.UsersIds = ko.observableArray([]);
        this.AvailableUsers = ko.observableArray([]);
    },
    clear: function () {
        this.Id('');
        this.Body('');
        this.ExpirationDate('');
        this.Users([]);
    },
    load: function (model) {
        if (!model)
            return;
        var self = this;

        this.Id(model.Id);
        this.Body(model.Body);

        this.ExpirationDate(new moment(model.ExpirationDate).format(resources.get('SmallDateFormat')));

        this.Users($.map(model.Users, function (el) {
            return $.grep(self.AvailableUsers(), function (el2) {
                return el.Id == el2.Id;
            })[0];
        }));

        this.UsersIds($.map(this.Users(), function (el) {
            return el.Id;
        }));        
    }
});

hbsis.wms.settings.MessagesViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        this.initProcessMultiSelect("#Users", this.settings.messagesDataUrl);
        hbsis.wms.Helpers.initDatetimePicker({
            id: "#ValueDateTime",
            config: {
                format: resources.get('DatetimePicker.SmallDateFormat'),
                autoclose: true,
                minView: 2,
                todayHighlight: true,
                startDate: new Date(),
                language: resources.get('DatetimePicker.Language')
            }
        })
    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.MessageModel());
    },
    getModelDescription: function (model) {
        return model.body;
    },
    initProcessMultiSelect: function (field, url) {
        var self = this;
        $.ajax({
            url: url,
            headers: { Accept : "application/json" },
            data: { start: 0, length: 1000, sort: 'Name', direction: 'asc' },
            dataType: 'json',
            success: function (data, textState, jqXHR) {
                if (data.Rows.length > 0) {
                    var messagesUsers = $.map(data.Rows, function (el) {
                        return new hbsis.wms.settings.MessageUserModel(el);
                    });
                    self.model().AvailableUsers(messagesUsers);
                    $(field).multiSelect();
                }
            }
        })
    },
    clearSaveForm: function () {
        this._super();
        $("#Users").multiSelect('refresh');
    },
    edit: function(model) {
        this._super(model);
        $("#Users").multiSelect('refresh');
    },
    getFormData: function () {
        var self = this;
        this.model().Users($.map(this.model().UsersIds(), function (el) {
            return $.grep(self.model().AvailableUsers(), function (el2) {
                return el == el2.Id;
            })[0];
        }));

        return $.toDictionary(ko.toJS(this.model()));
    },
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ExpirationDate" },
              { "mData": "Body" },
              { "mData": "Users" },
              { "mData": null }
            ],
            "aoColumnDefs": [
                {
                    "aTargets": [0],
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function (data, type, row) {
                        return hbsis.wms.Helpers.formatarDataDDMMYYYY(row.ExpirationDate);
                    }
                },
              {
                  "aTargets": [3],
                  "mData": null,
                  "sDefaultContent": self.settings.actionsMarkup,
                  "bSortable": false,
                  "bSearchable": false
              }
              ,
              {
                  "aTargets": [2],
                  "mRender": function (data, type, row) {
                      if (!$.isArray(row.Users))
                          return "";

                      var users = "<ul>";

                      for (var i = 0; i < row.Users.length; i++) {
                          users += "<li>" + resources.get(row.Users[i].Name) + "</li>";
                      }
                      return users + "</ul>";
                  },
                  "bSortable": false,
                  "bSearchable": false
              }
            ]
        };
    }
});