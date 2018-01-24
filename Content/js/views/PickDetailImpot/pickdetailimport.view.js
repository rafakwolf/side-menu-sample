var hbsis = hbsis || { wms: {} };
hbsis.wms.settings = hbsis.wms.settings || {};

hbsis.wms.settings.PickDetailImportView =  Class.extend({
    initializeUpload: function () {
        $('#imgLoadinUpload').hide();
        $('#btnSubmit').prop('disabled', false);

        $('#btnSubmit').click(function () {
            $('#imgLoadinUpload').show();
            $('#btnSubmit').prop('disabled', true);
            $('#uploadForm').submit();
        });
    }
});