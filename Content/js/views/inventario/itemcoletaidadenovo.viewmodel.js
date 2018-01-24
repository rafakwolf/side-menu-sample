var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.ItemColetaIdadeNovoModel = Class.extend({
    init: function () {
        this.Itens = ko.observableArray();
        this.ItemId = ko.observable();
        this.WarehouseId  = ko.observable();
        this.Id= ko.observable();
        this.ItemId = ko.observable();
        this.ItemCode = ko.observable();
        this.ItemDescription = ko.observable();

    },
    clear: function () {
        this.Itens.removeAll();
        this.ItemId("");
    },
    load: function (model) {
        
    }
});
self: null;
hbsis.wms.settings.ItemColetaIdadeNovoViewModel = hbsis.wms.CrudForm.extend({
    init: function (opts) {
        this._super(opts);
        self = this;
        this.initAutocomplete("#ItemId", this.settings.itemAutocompleteUrl, this.renderItem);
        $("#s2id_ItemId").css("border", "4px solid #FFF");

    },
    createModel: function () {
        return ko.observable(new hbsis.wms.settings.ItemColetaIdadeNovoModel());
    },
    renderItem: function (item) {
        document.getElementById('botaoAdicionarItem').className = "btn btn-success";
        return item.ShortCode + ' - ' + item.ShortDescription;
    },
    getModelDescription: function (model) {
        return model.Code;
    },
    clearSaveForm: function () {
        this._super();
        $("#ItemId").select2("val", "", true);
    },
    edit: function (model) {
        this._super(model);
        $("#ItemId").select2("val", $("#ItemId").val(), true);
    },
    adicionarItemN: function () {
        debugger;
        var item = $("#ItemId").val();
        var descricao = $(".select2-chosen").html();
        var novoItem = { Descricao: descricao, Id: item };

        if (item === "[object HTMLInputElement]" || item === "") {
            $("#s2id_ItemId").css("border", "4px solid #F00").delay(200).animate({ borderColor: "#FFF" }, 1000);
            return;
        }

        var estanalista = false;

        $(this.model().Itens()).each(function () {
            if (this.Id === novoItem.Id)
                estanalista = true;
        });

        if (estanalista === false) {
            this.model().Itens.push(novoItem);
            this.model().ItemId("");
            this.model().ItemDescription("");
        } else {
            $("#s2id_ItemId").css("border", "4px solid #F00").delay(200).animate({ borderColor: "#FFF" }, 1000);
            setTimeout(function() {
                $("#"+novoItem.Id).parent().css("border", "4px solid #F00").delay(200).animate({ borderColor: "#FFF" }, 1000);
            }, 200);
        }
    },
    excluirItemN: function () {
        self.model().Itens.remove(this);
    },

    limparBuscaTipoSujeitoRevisao: function () {
        $("#IdTipoSujeitoRevisao").select2("val", "", true);
        this.autoCompleteTipoContagem("#IdTipoSujeitoRevisao", this.renderTipoContagem);
    },
    validarAntesDeSalvar: function () {
        this.save();

        var etapaConfiguracao = gerenciadorErros.obterEtapaConfiguracaoComErro();
        if (etapaConfiguracao >= 0) {
            gerenciadorInterface.mostrarConfiguracao(etapaConfiguracao);
            var botaoParaAtivar = document.querySelectorAll('.btn-navegacao')[etapaConfiguracao];
            gerenciadorInterface.controlarBotaoAtivo(null, botaoParaAtivar);
        }
    },
    initAutocomplete: function (field, autocompleteUrl, render) {

        $(field).select2({
            placeholder: resources.get('Search...'),
            minimumInputLength: 2,
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
    getDatatableConfig: function () {
        var self = this;
        return {
            "aoColumns": [
              { "mData": "ItemCode" },
              { "mData": null }
            ],
            "aoColumnDefs": [
              
            {
                "aTargets": [0], "mData": null, "bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return row.ItemCode + " - " + row.ItemDescription;
                }
            },
            {
                "aTargets": [1], "mData": null, "bSortable": false,
                "bSearchable": false, "mRender": function (data, type, row) {
                    return self.settings.deleteMarkup;
                }
            }
            ]
        };
    },
    getFormData: function () {
        return $.toDictionary(ko.toJS(this.model()));
    }
});


$("#botaoSalvarItens").click(function (e) {
    var listaitens = {'itens': []};

    $(self.model().Itens()).each(function () {
        listaitens.itens.push({ 'Id': this.Id, 'Descricao': this.Descricao});
    });
    
    var listaitensJson = JSON.stringify(listaitens);

    $.ajax({
        type: "POST",
        data: listaitensJson,
        url: location.href + "/SalvarItens",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            console.log(result);
            if (result && result.Error) {
                showErrorMessage(result.ErrorMessage);
            } else {
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            waitingDialog.hide();
            showErrorMessage(errorThrown);
        },
        complete: function (msg) {
            waitingDialog.hide();
        }
    });
});

function GerenciadorInterface() {
    document
      .querySelectorAll('.btn-navegacao')
      .forEach(function (botao, chave) {
          botao.addEventListener('click', this.controlarBotaoAtivo);
      }.bind(this));
}
GerenciadorInterface.prototype = {
    mostrarConfiguracao: function (configuracao) {
        var interfacesConfiguracao = document.querySelectorAll('[data-configuracao]');
        interfacesConfiguracao.forEach(function (interface, chave) {
            (configuracao == chave) ? interface.classList.add("ativo") : interface.classList.remove("ativo");
        });
    },
    controlarBotaoAtivo: function (evento, botao) {
        var botoesNavegacao = document.querySelectorAll('.btn-navegacao');
        botoesNavegacao.forEach(function (botao, chave) {
            botao.classList.remove("ativo");
        });

        var botaoParaAtivar = null;
        if (evento)
            botaoParaAtivar = evento.path[1].tagName == 'A' ? evento.path[1] : evento.path[0];
        else if (botao)
            botaoParaAtivar = botao;

        botaoParaAtivar.classList.add("ativo");
    }
};

function GerenciadorErros() { this.container = null; }
GerenciadorErros.prototype = {
    obterEtapaConfiguracaoComErro: function () {
        var campoComErro = document.querySelector('.field-validation-error');
        this._procurarContainer(campoComErro);
        if (this.container) return +this.container.getAttribute('data-configuracao');

        return false;
    },
    _procurarContainer: function (node) {
        if (!node)
            return;
        if (node.hasAttribute && node.hasAttribute('data-configuracao')) {
            this.container = node;
        } else {
            this._procurarContainer(node.parentNode);
        }
    }
};

window.gerenciadorInterface = new GerenciadorInterface();
window.gerenciadorErros = new GerenciadorErros();