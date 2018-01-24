var DateTimePickerRange = (function () {

    function ctor(datepickerSelector, startTimepickerSelector, endTimepickerSelector) {
        this._datepickerSelector = datepickerSelector;
        this._startTimepickerSelector = startTimepickerSelector;
        this._endTimepickerSelector = endTimepickerSelector;
        this._startTimepickerClass = 'startTimepicker';
        this._endTimepickerClass = 'endTimepicker';
        this._hasFormattedDateClass = 'hasFormattedDate';
        _init.bind(this)();
    }

    function _getDatepickerFormattedDate() {
        return $(this._datepickerSelector).datepicker('getFormattedDate');
    }

    function _getDatepickerDate() {
        return $(this._datepickerSelector).datepicker('getDate');
    }

    function _validElements() {
        if (!$(this._datepickerSelector).length) {
            console.log("Elemento para o seletor '" + this._datepickerSelector + "' não encontrado.");
            return false;
        }
        if (!$(this._startTimepickerSelector).length) {
            console.log("Elemento para o seletor '" + this._startTimepickerSelector + "' não encontrado.");
            return false;
        }
        if (!$(this._endTimepickerSelector).length) {
            console.log("Elemento para o seletor '" + this._endTimepickerSelector + "' não encontrado.");
            return false;
        }
        return true;
    }

    function _initDatepicker() {
        $(this._datepickerSelector).datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        }).on('changeDate', function (e) {
            $(this._startTimepickerSelector).prop("disabled", false);
            $(this._startTimepickerSelector).val('');
            $(this._endTimepickerSelector).val('');
            $(this._startTimepickerSelector).removeClass(this._hasFormattedDateClass);
            $(this._endTimepickerSelector).prop("disabled", true);
        }.bind(this)).on('clearDate', function (e) {
            $(this._startTimepickerSelector).prop("disabled", true);
            $(this._endTimepickerSelector).prop("disabled", true);
            $(this._startTimepickerSelector).val('');
            $(this._endTimepickerSelector).val('');
            $(this._startTimepickerSelector).removeClass(this._hasFormattedDateClass);
        }.bind(this));
    }

    function _initStartTimepicker() {
        $(this._startTimepickerSelector).timepicker({
            step: 60,
            timeFormat: 'H:i',
            className: this._startTimepickerClass,
            forceRoundTime: true
        });
        $(this._startTimepickerSelector).prop("disabled", true);
    }

    function _initEndTimepicker() {
        $(this._endTimepickerSelector).timepicker({
            step: 60,
            timeFormat: 'H:i',
            className: this._endTimepickerClass,
            forceRoundTime: true
        });
        $(this._endTimepickerSelector).prop("disabled", true);
    }

    function _configStartTimepicker() {
        var startTimepicker = $(this._startTimepickerSelector);
        startTimepicker.on('showTimepicker', function (param) {
            var hasClass = startTimepicker.hasClass(this._hasFormattedDateClass);
            if (!hasClass) {
                var formattedDate = _getDatepickerFormattedDate.bind(this)();
                if (formattedDate) {
                    if (this._oldLiStartFormattedDate) {
                        this._oldLiStartFormattedDate.remove();
                    }

                    var li = $('<li/>')
						.append(formattedDate)
						.addClass('ui-timepicker-disabled');

                    this._oldLiStartFormattedDate = li;

                    startTimepicker.addClass(this._hasFormattedDateClass);
                    var timepickerList = $('.' + this._startTimepickerClass + ' .ui-timepicker-list');
                    timepickerList.prepend(li);
                }
            }
        }.bind(this));

        startTimepicker.on('selectTime', function (param) {
            var endTimepicker = $(this._endTimepickerSelector);
            var datepickerDate = _getDatepickerDate.bind(this)();

            var time = startTimepicker.timepicker('getTime', datepickerDate);
            var newDate = new Date(time.getTime() + 60 * 60000);
            var minEndTime = newDate.getHours() + ':' + ("00" + newDate.getMinutes()).slice(-2);

            endTimepicker.timepicker('option', {
                minTime: minEndTime
            });

            endTimepicker.prop("disabled", false);
        }.bind(this));

        startTimepicker.on('change', function (element) {
            if ($(element.currentTarget).val() == '') {
                $(this._endTimepickerSelector).val('');
                $(this._endTimepickerSelector).prop("disabled", true);
            } else {
                var datepickerDate = _getDatepickerDate.bind(this)();

                var time = startTimepicker.timepicker('getTime', datepickerDate);
                var newDate = new Date(time.getTime() + 60 * 60000);
                var minEndTime = newDate.getHours() + ':' + ("00" + newDate.getMinutes()).slice(-2);

                endTimepicker.timepicker('option', {
                    minTime: minEndTime
                });

                $(this._endTimepickerSelector).val('');
                $(this._endTimepickerSelector).prop("disabled", false);
            }
        }.bind(this));

        var endTimepicker = $(this._endTimepickerSelector);
        endTimepicker.on('showTimepicker', function () {
            var timepickerList = $('.' + this._endTimepickerClass + ' .ui-timepicker-list');
            if (this._oldLiEndFormattedDate) {
                this._oldLiEndFormattedDate.remove();
            }

            var datepickerDate = _getDatepickerDate.bind(this)();
            datepickerDate.setDate(datepickerDate.getDate() + 1);

            var getDate = datepickerDate.getDate();
            var getMonth = (datepickerDate.getMonth() + 1);
            var getYear = datepickerDate.getFullYear();
            var date = getDate + '/' + getMonth + '/' + getYear;

            var newLi = $('<li/>')
				.append(date)
				.addClass('ui-timepicker-disabled');

            this._oldLiEndFormattedDate = newLi;

            var endTimepickerLiList = $('.' + this._endTimepickerClass + ' .ui-timepicker-list li');

            var liMidnight = endTimepickerLiList.filter(function (index) {
                return $(this).text() == '00:00';
            });

            newLi.insertBefore(liMidnight);

            var newLiIndex = Array.prototype.indexOf.call($(newLi).parent()[0].childNodes, $(newLi)[0]);

            endTimepickerLiList.filter(function (index) {
                var thisIndex = Array.prototype.indexOf.call($(this).parent()[0].childNodes, $(this)[0]);
                return thisIndex > newLiIndex;
            }).addClass("anotherDay");
        }.bind(this));
    }

    function _init() {
        if (!_validElements.bind(this)()) {
            console.log('Não foi possível iniciar o seletor de faixa de tempo para datas.');
        } else {
            _initDatepicker.bind(this)();
            _initStartTimepicker.bind(this)();
            _initEndTimepicker.bind(this)();
            _configStartTimepicker.bind(this)();
        }
    }

    ctor.prototype = {
        getStartDate: function () {
            var date = _getDatepickerDate.bind(this)();
            var startTimepicker = $(this._startTimepickerSelector);
            var startDate = startTimepicker.timepicker('getTime', date);
            return moment(startDate).format('DD/MM/YYYY HH:mm');
        },
        getEndDate: function () {
            var date = _getDatepickerDate.bind(this)();

            var startTimepicker = $(this._startTimepickerSelector);
            var startDate = startTimepicker.timepicker('getTime', date);

            var endTimepicker = $(this._endTimepickerSelector);
            var endDate = endTimepicker.timepicker('getTime', date);

            if (moment(endDate).hours() == moment(startDate).hours()) {
                if (moment(endDate).minutes() > moment(startDate).minutes()) {
                    endDate.AddDays(1);
                }
            } else if (moment(endDate).hours() < moment(startDate).hours()) {
                endDate.setDate(endDate.getDate() + 1);
            }

            return moment(endDate).format('DD/MM/YYYY HH:mm');
        }
    };

    return ctor;
})();