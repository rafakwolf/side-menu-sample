var hbsis = hbsis || { wms: {} };
hbsis.wms.management = hbsis.wms.management || {};

hbsis.wms.management.LiberacaoCarga = Class.extend({
    obterBoxes: function () {
        var boxList = {};
        $.ajax({
            dataType: "json",
            url: location.href + "/GetBoxLocations",
            success: function (e) {
                boxList = e.Rows;
            }
        });
        return boxList;
    },
    isFullWms: function() {
        return "True";
        debugger;
        var tmp = null;
        $.ajax({
            'async': false,
            'type': "GET",
            'global': false,
            'dataType': "html",
            'url': "/Management/ReleaseLoads/IsFullWms",
            'success': function (data) {
                tmp = data;
            }
        });
        return tmp;
    }
});

hbsis.wms.management.LiberacaoCargaViewPerform = Class.extend({
    populaCombo: function (boxes, mapa, chk) {
        var mapaId = mapa;
        var liberacaoCarga = new hbsis.wms.management.LiberacaoCarga();
        var isFullWms = liberacaoCarga.isFullWms();

        function obterDadosBox() {
            var idBox = $('#idBox_' + mapaId).val();
            var codigoBox = $('#codigoBox_' + mapaId).val();

            return idBox ? { idBox: idBox, codigoBox: codigoBox } : null;
        }

        var arr = $("tbody select").map(function () {
            return this.value;
        }).get();

        var $select = $('#select_' + mapaId);
        var $span = $("#" + mapaId + '> span');
        if (chk) {
            $span.hide();
            $select.show();
            $select.find('option').remove();

            var dadosBox = obterDadosBox();
            if (dadosBox) {
                $("<option>").val(dadosBox.idBox).text(dadosBox.codigoBox).appendTo($select);
            } else {
                $("<option>").val("").text("Selecione").appendTo($select);
            }

            $.each(boxes, function (key, value) {
                if (isFullWms == "True") {
                    if ($.inArray(value.Id, arr) == -1) {
                        $("<option>").val(value.Id).text(value.Code).appendTo($select);
                    }
                } else {
                    $("<option>").val(value.Id).text(value.Code).appendTo($select);
                }
            });

        } else {
            $span.show();
            $select.hide();
        }
    },
    limpaBox: function () {
        $("tbody select").each(function () {
            var selectName = $(this).attr("rel");
            $(this).children(":selected").each(function () {
    
            });
        });
    },
    liberaBotoes: function () {
        $("#botaoLiberar").removeProp("disabled");
        $("#botaoCancelar").removeProp("disabled");
        $("#botaoEmEspera").removeProp("disabled");
    }
});

$(".content").on("click", ".loadId", function () {
    var liberacaoCargaViewPerform = new hbsis.wms.management.LiberacaoCargaViewPerform();
    var liberacaoCarga = new hbsis.wms.management.LiberacaoCarga();
    var boxes;
    var mapa = $(this).val();
    var chk = false;

    if ($(this).is(":checked")) {
        chk = true;
    }

    $.ajax({
        dataType: "json",
        url: location.href + "/GetBoxLocations",
        success: function (e) {
            boxes = e.Rows;
            liberacaoCargaViewPerform.populaCombo(boxes, mapa, chk);
            liberacaoCargaViewPerform.liberaBotoes();
        }
    });

});

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) {
            console.log(haystack[i] + "<>" + needle);
            return true;
        }
    }
    return false;
}

function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

$("#botaoLiberar").click(function (e) {
    clearAllMessages();

    var arr = $("tbody select").map(function () {
        return this.value;
    }).get();
    arr = arr.filter(function(i) {
        return i != undefined && i != "";
    });

    var checado = "";
    var msg = "";

    var jsonObj = [];
    $.each(($("input[type=checkbox]:checked")), function (index, obj) {
        item = {}
        var cargaId = obj.parentElement.parentElement.id;
        item["mapCode"] = obj.value;
        item["boxId"] = $("#select_" + obj.value + " option:selected").val();
        item["status"] = $("#status" + obj.value).text().replace(/\s/g, '')
        item["cargaId"] = cargaId;
        jsonObj.push(item);
        if (item["mapCode"] != "" && item["boxId"] != "") {
            checado = true;
        } else {
            checado = false;
            if (item["mapCode"] == "") {
                msg = "Favor selecionar um mapa.";
            } else if (item["boxId"] == "") {
                msg = "Favor selecionar um box para o mapa: " + item["mapCode"];
            }
        }
    });

    if (checado) {
        var sorted_arr = arr.sort();

        var results = [];
        for (var i = 0; i < arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        if (results.length >= 1) {
            checado = false;
            msg = "Favor verificar BOX duplicados.";
        } else {
            checado = true;
        }
    }

    if (checado) {
        waitingDialog.show("Liberando mapa(s)...");
        $.ajax({
            type: "POST",
            data: JSON.stringify({ "mapas": jsonObj }),
            url: location.href + "/Release",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                console.log(result);
                if (result && result.Error) {
                    waitingDialog.hide();
                    showErrorMessage(result.ErrorMessage);
                } else {
                    waitingDialog.hide();
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
    } else {
        showErrorMessage(msg);
    }
});

$("#botaoEmEspera").click(function (e) {
    var checado = false;
    jsonObj = [];
    $.each(($("input[type=checkbox]:checked")), function (index, obj) {
        var cargaId = obj.parentElement.parentElement.id;
        item = {}
        item["mapCode"] = obj.value;
        item["boxId"] = $("#select_" + obj.value + " option:selected").val();
        item["cargaId"] = cargaId;
        jsonObj.push(item);
        if (obj.value != "") {
            checado = true;
        } else {
            checado = false;
        }
    });
    if (checado) {
        waitingDialog.show("Aguarde...");
        $.ajax({
            type: "POST",
            data: JSON.stringify({ "mapList": jsonObj }),
            url: location.href + "/Colocar-Em-Espera",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                console.log(result);
                if (result && result.Error) {
                    waitingDialog.hide();
                    showErrorMessage(result.ErrorMessage);
                } else {
                    waitingDialog.hide();
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
    } else {
        showErrorMessage("Favor selecionar um mapa.");
    }
});


$("#unrelease").click(function (e) {
    var checado = false;
    var jsonObj = [];
    $.each(($("input[type=checkbox]:checked")), function (index, obj) {
        item = {}
        item["mapCode"] = obj.value;
        item["boxId"] = $("#select_" + obj.value + " option:selected").val();
        jsonObj.push(item);
        if (obj.value != "") {
            checado = true;
        } else {
            checado = false;
        }
    });
    if (checado) {
        waitingDialog.show("Bloqueando mapa(s)...");
        $.ajax({
            type: "POST",
            data: JSON.stringify({ "mapList": jsonObj }),
            url: location.href + "/UnRelease",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                console.log(result);
                if (result && result.Error) {
                    waitingDialog.hide();
                    showErrorMessage(result.ErrorMessage);
                } else {
                    waitingDialog.hide();
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
    } else {
        showErrorMessage("Favor selecionar um mapa.");
    }
});

$("#botaoCancelar").click(function (e) {
    var checado = false;
    jsonObj = [];
    $.each(($("input[type=checkbox]:checked")), function (index, obj) {
        item = {}
        item["mapCode"] = obj.value;
        item["boxId"] = $("#select_" + obj.value + " option:selected").val();
        jsonObj.push(item);
        if (obj.value != "") {
            checado = true;
        } else {
            checado = false;
        }
    });
    if (checado) {
        waitingDialog.show("Cancelando mapa(s)...");
        $.ajax({
            type: "POST",
            data: JSON.stringify({ "mapList": jsonObj }),
            url: location.href + "/Cancelar",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                console.log(result);
                if (result && result.Error) {
                    waitingDialog.hide();
                    showErrorMessage(result.ErrorMessage);
                } else {
                    waitingDialog.hide();
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
    } else {
        showErrorMessage("Favor selecionar um mapa.");
    }
});

$("#selectall").click(function (event) {
    if (this.checked) {
        liberaBotoes();
        $(".loadId").each(function () {
            this.checked = true;
            geraCombo(box, this.value, this.checked);
        });
    } else {
        $(".loadId").each(function () {
            this.checked = false;
        });
    }
});
