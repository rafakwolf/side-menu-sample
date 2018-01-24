var hbsis = hbsis || { wms: {} };
hbsis.wms = hbsis.wms || {};

hbsis.wms.SignIn = {
    init: function () {
        $("#login-form").submit(function () {
            window.sessionStorage.clear();
        });
    }
};
