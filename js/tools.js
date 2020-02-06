$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-name').html(curName);
        } else {
            curField.find('.form-file-name').html('');
        }
    });

    $.validator.addMethod('inputDate',
        function(curDate, element) {
            if (this.optional(element) && curDate == '') {
                return true;
            } else {
                if (curDate.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
                    var userDate = new Date(curDate.substr(6, 4), Number(curDate.substr(3, 2)) - 1, Number(curDate.substr(0, 2)));
                    if ($(element).attr('min')) {
                        var minDateStr = $(element).attr('min');
                        var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                        if (userDate < minDate) {
                            $.validator.messages['inputDate'] = 'Минимальная дата - ' + minDateStr;
                            return false;
                        }
                    }
                    if ($(element).attr('max')) {
                        var maxDateStr = $(element).attr('max');
                        var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                        if (userDate > maxDate) {
                            $.validator.messages['inputDate'] = 'Максимальная дата - ' + maxDateStr;
                            return false;
                        }
                    }
                    return true;
                } else {
                    $.validator.messages['inputDate'] = 'Дата введена некорректно';
                    return false;
                }
            }
        },
        ''
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.gallery').each(function() {
        var curGallery = $(this);
        curGallery.on('init', function(event, slick) {
            var curSlide = curGallery.find('.slick-current');
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
        curGallery.slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            adaptiveHeight: true,
            fade: true,
            dots: true,
            responsive: [
                {
                    breakpoint: 1159,
                    settings: {
                        arrows: false
                    }
                }
            ]
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
            var curSlide = curGallery.find('.slick-slide:not(.slick-cloned)').eq(nextSlide);
            var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
            curGallery.find('.slick-dots').css({'top': curPhotoHeight});
            curGallery.find('.slick-prev').css({'top': curPhotoHeight / 2});
            curGallery.find('.slick-next').css({'top': curPhotoHeight / 2});
        });
    });

    $('.side-inner').mCustomScrollbar({
        axis: 'y'
    });

    $('.company-logo a').click(function(e) {
        $('.company-logo').remove();
        $('.company-logo-file').addClass('required');
        e.preventDefault();
    });

    $('.tabs-menu ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curTabs = curLi.parents().filter('.tabs');
            curTabs.find('.tabs-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curTabs.find('.tabs-menu ul li').index(curLi);
            curTabs.find('.tabs-content.active').removeClass('active');
            curTabs.find('.tabs-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('body').on('click', '.press-filter-link', function() {
        $('html').toggleClass('press-fitler-open');
    });

    $(document).click(function(e) {
        var isDatepicker = false;
        var curClass = $(e.target).attr('class');
        if ((curClass !== undefined && curClass.indexOf('datepicker') > -1) || $(e.target).parents().filter('[class^="datepicker"]').length > 0) {
            isDatepicker = true;
        }
        if ($(e.target).parents().filter('.press-filter').length == 0 && !isDatepicker) {
            $('html').removeClass('press-fitler-open');
        }
    });

    $('.press-filter').each(function() {
        filterUpdate();
        $('.press-filter .form-input-date input').each(function() {
            var myDatepicker = $(this).data('datepicker');
            if (myDatepicker) {
                myDatepicker.update('onSelect', function(formattedDate, date, inst) {
                    filterUpdate();
                });
            }
        });
    });

    $('body').on('change', '.press-filter .form-checkbox input', function(e) {
        filterUpdate();
    });

    $('body').on('change', '.press-filter .form-input-date input', function(e) {
        filterUpdate();
    });

    $('body').on('click', '.press-filter-param span', function() {
        var curId = $(this).attr('data-id');
        var curField = $('.press-filter-params-window *[data-id="' + curId + '"]');
        if (curField.parents().filter('.form-checkbox').length > 0) {
            curField.prop('checked', false);
            curField.trigger('change');
        }
        if (curField.hasClass('press-filter-params-window-dates')) {
            curField.find('input').val('');
            curField.find('input').trigger('change');
        }
    });

});

function filterUpdate() {
    var newHTML = '';
    var id = -1;

    if ($('.press-filter-params-window-dates').length == 1) {
        id++;
        $('.press-filter-params-window-dates').attr('data-id', id);
        var datesText = '';
        if ($('.filter-date-from').val() != '') {
            datesText += 'с ' + $('.filter-date-from').val();
        }
        if ($('.filter-date-to').val() != '') {
            if (datesText != '') {
                datesText += ' ';
            }
            datesText += 'по ' + $('.filter-date-to').val();
        }
        if (datesText != '') {
            newHTML += '<div class="press-filter-param">' + datesText + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
        }
    }

    for (var i = 0; i < $('.press-filter .form-checkbox').length; i++) {
        var curInput = $('.press-filter .form-checkbox').eq(i).find('input');
        id++;
        curInput.attr('data-id', id);
        if (curInput.prop('checked')) {
            newHTML += '<div class="press-filter-param">' + curInput.parent().find('span').text() + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
        }
    }

    $('.press-filter-params').html(newHTML);

    $('.press-container').addClass('loading');
    var curForm = $('.press-filter-params-window form');
    $.ajax({
        type: 'POST',
        url: curForm.attr('action'),
        dataType: 'html',
        data: curForm.serialize(),
        cache: false
    }).done(function(html) {
        $('.press-container').html(html)
        $('.press-container').removeClass('loading');
    });
}

function initForm(curForm) {
    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
        $(this).on('input', function() {
            this.style.height = '99px';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    curForm.find('.form-input-date input').mask('00.00.0000');
    curForm.find('.form-input-date input').attr('autocomplete', 'off');
    curForm.find('.form-input-date input').addClass('inputDate');

    curForm.find('.form-input-date input').on('keyup', function() {
        var curValue = $(this).val();
        if (curValue.match(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/)) {
            var isCorrectDate = true;
            var userDate = new Date(curValue.substr(6, 4), Number(curValue.substr(3, 2)) - 1, Number(curValue.substr(0, 2)));
            if ($(this).attr('min')) {
                var minDateStr = $(this).attr('min');
                var minDate = new Date(minDateStr.substr(6, 4), Number(minDateStr.substr(3, 2)) - 1, Number(minDateStr.substr(0, 2)));
                if (userDate < minDate) {
                    isCorrectDate = false;
                }
            }
            if ($(this).attr('max')) {
                var maxDateStr = $(this).attr('max');
                var maxDate = new Date(maxDateStr.substr(6, 4), Number(maxDateStr.substr(3, 2)) - 1, Number(maxDateStr.substr(0, 2)));
                if (userDate > maxDate) {
                    isCorrectDate = false;
                }
            }
            if (isCorrectDate) {
                var myDatepicker = $(this).data('datepicker');
                if (myDatepicker) {
                    var curValueArray = curValue.split('.');
                    myDatepicker.selectDate(new Date(Number(curValueArray[2]), Number(curValueArray[1]) - 1, Number(curValueArray[0])));
                    myDatepicker.show();
                    $(this).focus();
                }
            } else {
                $(this).addClass('error');
                return false;
            }
        }
    });

    curForm.find('.form-input-date input').each(function() {
        var minDateText = $(this).attr('min');
        var minDate = null;
        if (typeof (minDateText) != 'undefined') {
            var minDateArray = minDateText.split('.');
            minDate = new Date(Number(minDateArray[2]), Number(minDateArray[1]) - 1, Number(minDateArray[0]));
        }
        var maxDateText = $(this).attr('max');
        var maxDate = null;
        if (typeof (maxDateText) != 'undefined') {
            var maxDateArray = maxDateText.split('.');
            maxDate = new Date(Number(maxDateArray[2]), Number(maxDateArray[1]) - 1, Number(maxDateArray[0]));
        }
        if ($(this).hasClass('maxDate1Year')) {
            var curDate = new Date();
            curDate.setFullYear(curDate.getFullYear() + 1);
            curDate.setDate(curDate.getDate() - 1);
            maxDate = curDate;
            var maxDay = curDate.getDate();
            if (maxDay < 10) {
                maxDay = '0' + maxDay
            }
            var maxMonth = curDate.getMonth() + 1;
            if (maxMonth < 10) {
                maxMonth = '0' + maxMonth
            }
            $(this).attr('max', maxDay + '.' + maxMonth + '.' + curDate.getFullYear());
        }
        var startDate = new Date();
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
            }
        }
        $(this).datepicker({
            language: 'ru',
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            toggleSelected: false
        });
        if (typeof ($(this).attr('value')) != 'undefined') {
            var curValue = $(this).val();
            if (curValue != '') {
                var startDateArray = curValue.split('.');
                startDate = new Date(Number(startDateArray[2]), Number(startDateArray[1]) - 1 , Number(startDateArray[0]));
                $(this).data('datepicker').selectDate(startDate);
            }
        }
    });

    $('.form-reset input').click(function() {
        window.setTimeout(function() {
            curForm.find('.form-input input, .form-input textarea').each(function() {
                $(this).parent().removeClass('focus');
                if ($(this).val() != '') {
                    $(this).parent().addClass('full');
                } else {
                    $(this).parent().removeClass('full');
                }
            });

            curForm.find('.form-input textarea').each(function() {
                $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
                $(this).on('input', function() {
                    this.style.height = '99px';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            });

            curForm.find('.form-file input').each(function() {
                var curInput = $(this);
                var curField = curInput.parents().filter('.form-file');
                var curName = curInput.val().replace(/.*(\/|\\)/, '');
                if (curName != '') {
                    curField.find('.form-file-name').html(curName);
                } else {
                    curField.find('.form-file-name').html('');
                }
            });

            curForm.find('.form-select select').each(function() {
                var curSelect = $(this);
                curSelect.trigger({type: 'select2:select'});
            });
        }, 100);
    });

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 20
        }
        if (curSelect.prop('multiple')) {
            options['closeOnSelect'] = false;
        }

        curSelect.select2(options);
        curSelect.on('select2:selecting', function (e) {
            if (curSelect.prop('multiple')) {
                var $searchfield = $(this).parent().find('.select2-search__field');
                $searchfield.val('').trigger('focus');
            }
        });
        if (curSelect.find('option:selected').legnth > 0 || curSelect.find('option').legnth == 1 || curSelect.find('option:first').html() != '') {
            curSelect.trigger({type: 'select2:select'})
        }
    });

    curForm.validate({
        ignore: ''
    });
}