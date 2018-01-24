var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.LocationWarehouseModel = Class.extend({
	init: function (Warehouse) {
		if (!Warehouse) {
			Warehouse = { Id: '', Name: '', ShortCode: '' };
		}

		this.Id = Warehouse.Id;
		this.Name = Warehouse.Name;
		this.ShortCode = Warehouse.ShortCode;
	}
});

hbsis.wms.settings.PickAreaModel = Class.extend({
    init: function () {
		this.Id = ko.observable();
		this.Code = ko.observable();
		this.Description = ko.observable();
		this.Warehouse = ko.observable(new hbsis.wms.settings.LocationWarehouseModel());
	},
	clear: function () {
		this.Id('');
		this.Code('');
		this.Description('');
		this.Warehouse(new hbsis.wms.settings.LocationWarehouseModel());
	},
	load: function (model) {
		this.Id(model.Id);
		this.Code(model.Code);
		this.Description(model.Description);
		this.Warehouse(new hbsis.wms.settings.LocationWarehouseModel(model.Warehouse));
	}
});

hbsis.wms.settings.PickAreaViewModel = hbsis.wms.CrudForm.extend({
	init: function (opts) {
		this._super(opts);
		this.initAutocomplete("#WarehouseId", this.settings.warehouseAutocompleteUrl, this.renderWarehouse);
	},
	createModel: function () {
		return ko.observable(new hbsis.wms.settings.PickAreaModel());
	},
	renderWarehouse: function (warehouse) {
		return warehouse.ShortCode + ' - ' + warehouse.Name;
	},
	clearSaveForm: function () {
		this._super();
		$("#WarehouseId").select2("val", "", true);
	},
	edit: function (model) {
		this._super(model);
		$("#WarehouseId").select2("val", $("#WarehouseId").val(), true);
	},
	getModelDescription: function (model) {
		return model.Name;
	},
	getDatatableConfig: function () {
		var self = this;
		return {
			"fnPreDrawCallback": $.fn.dataTable.minLengthFilter({ minLength: 2 }),
			"aoColumns": [
              { "mData": "WarehouseName" },
              { "mData": "Code" },
              { "mData": "Description" },
              { "mData": null }
			],
			"aoColumnDefs": [
                {
                    "aTargets": [0],
                    "mData": null,
                    "bSortable": true,
                    "bSearchable": true,
                    "mRender": function (data, type, row) {
                        return row.WarehouseName;
                    }
                },
                {
               	"aTargets": [1], "mData": null, "bSortable": true,
               	"bSearchable": false, "mRender": function (data, type, row) {
               		if (row.Code == null)
               			return "-";
               		return row.Code;
               	}
               },
              {
              	"aTargets": [2],
              	"mData": null,
              	"bSortable": true,
              	"bSearchable": true,
              	"mRender": function (data, type, row) {
              		return row.Description;
              	}
              },
              {
              	"aTargets": [3],
              	"mData": null,
              	"sDefaultContent": self.settings.actionsMarkup,
              	"bSortable": false,
              	"bSearchable": false,
              	"mRender": function (data, type, row) {
              	    
              	},
              	"fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
              	    
              	}
              },
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
	},
	getFormData: function () {
		var self = this;
		return $.toDictionary(ko.toJS(this.model()));
	}
});