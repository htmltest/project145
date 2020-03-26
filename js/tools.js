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

    $('body').on('input', '.form-input textarea', function() {
        this.style.height = '252px';
        this.style.height = (this.scrollHeight) + 'px';
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

    $('body').on('click', '.press-details-item-video-link', function(e) {
        $('.press-details-item-video.start').removeClass('start');
        $('.press-details-item-video-player').html('');
        $(this).parent().parent().addClass('start');
        $(this).parent().parent().find('.press-details-item-video-player').html('<iframe width="560" height="315" src="' + $(this).attr('href') + '?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        e.preventDefault();
    });

    $('body').on('click', '.press-edit-video-add a', function(e) {
        var curID = $('.press-edit-video-add a').data('curID');
        if (curID === undefined) {
            curID = -1;
        }
        curID++;
        $('.press-edit-video-add a').data('curID', 0);
        var hewHTML = $('.press-edit-video-item-template').html();
        hewHTML = hewHTML.replace(/_ID_/g, 'new_' + curID)
        $('.press-edit-video-list').append(hewHTML);
        e.preventDefault();
    });

    $('body').on('click', '.press-details-video-link', function(e) {
        $('.press-details-video.start').removeClass('start');
        $('.press-details-video-player').html('');
        $(this).parent().addClass('start');
        $(this).parent().find('.press-details-video-player').html('<iframe width="560" height="315" src="' + $(this).attr('href') + '?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        e.preventDefault();
    });

    $('body').on('click', '.press-search-link', function(e) {
        $('.press-search').toggleClass('open');
        if ($('.press-search').hasClass('open')) {
            $('.press-search-window-input input').trigger('focus');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.press-search').length == 0) {
            $('.press-search').removeClass('open');
        }
    });

    $('body').on('click', '.support-search-link', function(e) {
        $('.support-search').addClass('open');
        $('.support-search-window-input input').trigger('focus');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.support-search').length == 0) {
            $('.support-search').removeClass('open');
        }
    });

    $('.side-menu-link').click(function(e) {
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('side-menu-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css('margin-top', -curScroll);
        e.preventDefault();
    });

    $('.side-menu-close').click(function(e) {
        $('html').removeClass('side-menu-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $('.wrapper').css('margin-top', 0);
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.order-content-item-services-more a').click(function(e) {
        $(this).parents().filter('.order-content-item-services').toggleClass('open');
        e.preventDefault();
    });

    $('.order-company-btn a').click(function(e) {
        $('.order-company-item:not(.order-company-item-add)').remove();
        $('.order-company').addClass('loading').removeClass('error');
        $('.order-company-message').hide();
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.status) {
                    $('.order-company').removeClass('loading').addClass('loading-success');
                    var newHTML = '';
                    var inputName = $('.order-company-list').attr('data-inputname');
                    for (var i = 0; i < data.data.length; i++) {
                        var curCompany = data.data[i];
                        newHTML += '<div class="order-company-item"><label><input type="radio" name="' + inputName + '" value="' + curCompany.ID + '" /><div class="order-company-item-inner"><div class="order-company-item-logo">';
                        if (curCompany.LOGOTYPE_SRC !== '') {
                            newHTML += '<img src="' + curCompany.LOGOTYPE_SRC + '" alt="" />';
                        }
                        newHTML += '</div><div class="order-company-item-title">' + curCompany.NAME + '</div></div></label></div>';
                    }
                    $('.order-company-list form').append(newHTML);
                } else {
                    $('.order-company').removeClass('loading').addClass('error');
                    $('.order-company-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">' + data.message + '</div></div>');
                    $('.order-company-message').show();
                }
            },
            error: function() {
                $('.order-company').removeClass('loading').addClass('error');
                $('.order-company-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">Загрузка данных невозможна</div></div>');
                $('.order-company-message').show();
            }
        });
        e.preventDefault();
    });

    $('body').on('change', '.order-company-list .order-company-item input', function() {
        $('.order-company-list .order-company-item input:checked').each(function() {
            var curItem = $(this).parents().filter('.order-company-item').addClass('active');
            $('.order-company').addClass('selected');
            $('.order-press').addClass('active');
            $('.send-company-id').val($(this).val());
        });
    });

    $('.order-company-other a').click(function(e) {
        $('.order-company-list .order-company-item input:checked').prop('checked', false);
        $('.order-company-item.active').removeClass('active');
        $('.order-company').removeClass('selected');
        $('.order-press').removeClass('active');
        $('.send-company-id').val('');

        $('.order-press-list .order-press-item input:checked').prop('checked', false);
        $('.order-press').removeClass('selected');
        $('.send-release-id').val('');
        $('.order-press-item').remove();
        $('.order-press').removeClass('loading-success').removeClass('error');
        $('.order-press-message').hide();

        $('.order-type').removeClass('active');
        $('.order-type-list .order-type-item input:checked').prop('checked', false);
        $('.order-type-item.active').removeClass('active');
        $('.order-type').removeClass('selected');
        $('.send-type-id').val('');

        $('.order-send').removeClass('active');

        e.preventDefault();
    });

    $('.order-press-btn a').click(function(e) {
        $('.order-press-item').remove();
        $('.order-press').addClass('loading').removeClass('error');
        $('.order-press-message').hide();
        var filterData = {'company': $('.order-company-list .order-company-item input:checked').val()};
        if ($('.order-filter-date-from').val() != '') {
            filterData['dateFrom'] = $('.order-filter-date-from').val();
        }
        if ($('.order-filter-date-to').val() != '') {
            filterData['dateTo'] = $('.order-filter-date-to').val();
        }
        for (var i = 0; i < $('.order-press-filter .form-checkbox').length; i++) {
            var curInput = $('.order-press-filter .form-checkbox').eq(i).find('input');
            if (curInput.prop('checked')) {
                filterData[curInput.attr('name')] = 'Y';
            }
        }
        if ($('.order-press-search-window-input input').val() != '') {
            filterData[$('.order-press-search-window-input input').attr('name')] = $('.order-press-search-window-input input').val();
        }
        if ($('.order-press-pager .pager a.active').length > 0) {
            filterData['page'] = $('.order-press-pager .pager a.active').html();
        }
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            dataType: 'json',
            data: filterData,
            cache: false,
            success: function(data) {
                if (data.status) {
                    $('.order-press').removeClass('loading').addClass('loading-success');
                    var newHTML = '';
                    var inputName = $('.order-press-list').attr('data-inputname');
                    for (var i = 0; i < data.data.list.length; i++) {
                        var curPress = data.data.list[i];
                        newHTML += '<div class="order-press-item"><label><input type="radio" name="' + inputName + '" value="' + curPress.ID + '" /><div class="order-press-item-inner"><div class="order-press-item-inner-wrap">';
                        newHTML += '<div class="order-press-item-content"><div class="order-press-item-title">' + curPress.NAME + '</div>';
                        newHTML += '<div class="order-press-item-info"><div class="order-press-item-date">' + curPress.DATE + '</div></div></div>';
                        if (curPress.PICTURE_COUNT > 0) {
                            newHTML += '<div class="order-press-item-media">' +
                                            '<div class="order-press-item-media-preview" style="background-image:url(' + curPress.PICTURE_SRC + ')"></div>' +
                                            '<div class="order-press-item-media-count">' +
                                                '<div class="order-press-item-media-count-value">+' + curPress.PICTURE_COUNT + '</div>' +
                                                '<div class="order-press-item-media-count-unit">фото</div>' +
                                            '</div>' +
                                        '</div>';
                        }
                        if (curPress.VIDEO_COUNT > 0) {
                            newHTML += '<div class="order-press-item-media">' +
                                            '<div class="order-press-item-media-preview order-press-item-media-preview-video"" style="background-image:url(' + curPress.VIDEO_SRC + ')"></div>' +
                                            '<div class="order-press-item-media-count">' +
                                                '<div class="order-press-item-media-count-value">+' + curPress.VIDEO_COUNT + '</div>' +
                                                '<div class="order-press-item-media-count-unit">видео</div>' +
                                            '</div>' +
                                        '</div>';
                        }
                        newHTML += '</div></div></label></div>';
                    }
                    $('.order-press-list form').append(newHTML);
                    var pagerHTML = '';
                    if (data.data.pageCount > 1) {
                        pagerHTML += '<div class="pager"><a href="#" class="pager-prev"></a>';
                        for (var i = 0; i < data.data.pageCount; i++) {
                            var curPage = i + 1;
                            if (curPage == data.data.page) {
                                pagerHTML += '<a href="#" class="active">' + curPage + '</a>';
                            } else {
                                pagerHTML += '<a href="#">' + curPage + '</a>';
                            }
                        }
                        pagerHTML += '<a href="#" class="pager-next"></a></div>';
                    }
                    $('.order-press-pager').html(pagerHTML);
                } else {
                    $('.order-press').removeClass('loading').addClass('error');
                    $('.order-press-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">' + data.message + '</div></div>');
                    $('.order-press-message').show();
                }
            },
            error: function() {
                $('.order-press').removeClass('loading').addClass('error');
                $('.order-press-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">Загрузка данных невозможна</div></div>');
                $('.order-press-message').show();
            }
        });
        e.preventDefault();
    });

    $('body').on('change', '.order-press-list .order-press-item input', function() {
        $('.order-press-list .order-press-item input:checked').each(function() {
            var curItem = $(this).parents().filter('.order-press-item').addClass('active');
            $('.order-press').addClass('selected');
            $('.order-type').addClass('active');
            $('.order-type-btn a').trigger('click');
            $('.send-release-id').val($(this).val());
        });
    });

    $('.order-press-other a').click(function(e) {
        $('.order-press-list .order-press-item input:checked').prop('checked', false);
        $('.order-press-item.active').removeClass('active');
        $('.order-press').removeClass('selected');
        $('.send-release-id').val('');

        $('.order-type').removeClass('active');
        $('.order-type-list .order-type-item input:checked').prop('checked', false);
        $('.order-type-item.active').removeClass('active');
        $('.order-type').removeClass('selected');
        $('.send-type-id').val('');

        $('.order-send').removeClass('active');

        e.preventDefault();
    });

    $('body').on('click', '.order-press-filter-link', function() {
        $('html').toggleClass('order-press-fitler-open');
    });

    $(document).click(function(e) {
        var isDatepicker = false;
        var curClass = $(e.target).attr('class');
        if ((curClass !== undefined && curClass.indexOf('datepicker') > -1) || $(e.target).parents().filter('[class^="datepicker"]').length > 0) {
            isDatepicker = true;
        }
        if ($(e.target).parents().filter('.order-press-filter').length == 0 && !isDatepicker) {
            $('html').removeClass('order-press-fitler-open');
        }
    });

    $('.order-press-filter .form-input-date input').each(function() {
        var myDatepicker = $(this).data('datepicker');
        if (myDatepicker) {
            myDatepicker.update('onSelect', function(formattedDate, date, inst) {
                orderFilterUpdate();
            });
        }
    });

    $('body').on('change', '.order-press-filter .form-checkbox input', function(e) {
        orderFilterUpdate();
    });

    $('body').on('change', '.order-press-filter .form-input-date input', function(e) {
        orderFilterUpdate();
    });

    $('.order-press-search-window form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        validator.destroy();
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                $('.order-press-btn a').trigger('click');
            }
        });
    });

    $('body').on('click', '.order-press-filter-param span', function() {
        var curId = $(this).attr('data-id');
        var curField = $('.order-press-filter-params-window *[data-id="' + curId + '"]');
        if (curField.parents().filter('.form-checkbox').length > 0) {
            curField.prop('checked', false);
            curField.trigger('change');
        }
        if (curField.hasClass('order-press-filter-params-window-dates')) {
            curField.find('input').val('');
            curField.find('input').trigger('change');
        }
    });

    $('body').on('click', '.order-press-search-link', function(e) {
        $('.order-press-search').toggleClass('open');
        if ($('.order-press-search').hasClass('open')) {
            $('.order-press-search-window-input input').trigger('focus');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.order-press-search').length == 0) {
            $('.order-press-search').removeClass('open');
        }
    });

    $('body').on('click', '.order-press-pager .pager a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            if (!(curLink.hasClass('pager-prev') && $('.order-press-pager .pager-prev').next().hasClass('active')) && !(curLink.hasClass('pager-next') && $('.order-press-pager .pager-next').prev().hasClass('active'))) {
                $('.order-press-pager .pager a.active').removeClass('active');
                curLink.addClass('active');
                $('.order-press-btn a').trigger('click');
            }
        }
        e.preventDefault();
    });

    $('.order-type-btn a').click(function(e) {
        $('.order-type-item').remove();
        $('.order-type').addClass('loading').removeClass('error');
        $('.order-type-message').hide();
        var filterData = {'company': $('.order-company-list .order-company-item input:checked').val()};
        filterData['press'] = $('.order-press-list .order-press-item input:checked').val();
        if ($('.order-type-date-from').val() != '') {
            filterData['dateFrom'] = $('.order-type-date-from').val();
        }
        if ($('.order-type-date-to').val() != '') {
            filterData['dateTo'] = $('.order-type-date-to').val();
        }
        for (var i = 0; i < $('.order-type-filter .form-checkbox').length; i++) {
            var curInput = $('.order-type-filter .form-checkbox').eq(i).find('input');
            if (curInput.prop('checked')) {
                filterData[curInput.attr('name')] = 'Y';
            }
        }
        if ($('.order-type-search-window-input input').val() != '') {
            filterData[$('.order-type-search-window-input input').attr('name')] = $('.order-type-search-window-input input').val();
        }
        if ($('.order-type-pager .pager a.active').length > 0) {
            filterData['page'] = $('.order-type-pager .pager a.active').html();
        }
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            dataType: 'json',
            data: filterData,
            cache: false,
            success: function(data) {
                if (data.status) {
                    $('.order-type').removeClass('loading').addClass('loading-success');
                    var newHTML = '';
                    var inputName = $('.order-type-list').attr('data-inputname');
                    for (var i = 0; i < data.data.list.length; i++) {
                        var curType = data.data.list[i];
                        newHTML += '<div class="order-type-item"><label><input type="radio" name="' + inputName + '" value="' + curType.ID + '" /><div class="order-type-item-inner"><div class="order-type-item-inner-wrap">';
                        newHTML += '<div class="order-type-item-logo"><img src="' + curType.PICTURE_SRC + '" alt="" /></div>';
                        newHTML += '<div class="order-type-item-content"><div class="order-type-item-title">' + curType.NAME + '</div>';
                        newHTML += '<div class="order-type-item-url"><a href="' + curType.URL_HREF + '">' + curType.URL + '</a></div></div>';
                        newHTML += '</div></div></label></div>';
                    }
                    $('.order-type-list form').append(newHTML);
                    var pagerHTML = '';
                    if (data.data.pageCount > 1) {
                        pagerHTML += '<div class="pager"><a href="#" class="pager-prev"></a>';
                        for (var i = 0; i < data.data.pageCount; i++) {
                            var curPage = i + 1;
                            if (curPage == data.data.page) {
                                pagerHTML += '<a href="#" class="active">' + curPage + '</a>';
                            } else {
                                pagerHTML += '<a href="#">' + curPage + '</a>';
                            }
                        }
                        pagerHTML += '<a href="#" class="pager-next"></a></div>';
                    }
                    $('.order-type-pager').html(pagerHTML);
                } else {
                    $('.order-type').removeClass('loading').addClass('error');
                    $('.order-type-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">' + data.message + '</div></div>');
                    $('.order-type-message').show();
                }
            },
            error: function() {
                $('.order-type').removeClass('loading').addClass('error');
                $('.order-type-message').html('<div class="message message-error"><div class="message-title">Ошибка</div><div class="message-text">Загрузка данных невозможна</div></div>');
                $('.order-type-message').show();
            }
        });
        e.preventDefault();
    });

    $('body').on('change', '.order-type-list .order-type-item input', function() {
        $('.order-type-list .order-type-item input:checked').each(function() {
            var curItem = $(this).parents().filter('.order-type-item').addClass('active');
            $('.order-type').addClass('selected');
            $('.order-send').addClass('active');
            $('.send-type-id').val($(this).val());
        });
    });

    $('body').on('click', '.order-type-filter-link', function() {
        $('html').toggleClass('order-type-fitler-open');
    });

    $(document).click(function(e) {
        var isDatepicker = false;
        var curClass = $(e.target).attr('class');
        if ((curClass !== undefined && curClass.indexOf('datepicker') > -1) || $(e.target).parents().filter('[class^="datepicker"]').length > 0) {
            isDatepicker = true;
        }
        if ($(e.target).parents().filter('.order-type-filter').length == 0 && !isDatepicker) {
            $('html').removeClass('order-type-fitler-open');
        }
    });

    $('.order-type-filter .form-input-date input').each(function() {
        var myDatepicker = $(this).data('datepicker');
        if (myDatepicker) {
            myDatepicker.update('onSelect', function(formattedDate, date, inst) {
                orderFilterTypeUpdate();
            });
        }
    });

    $('body').on('change', '.order-type-filter .form-checkbox input', function(e) {
        orderFilterTypeUpdate();
    });

    $('body').on('change', '.order-type-filter .form-input-date input', function(e) {
        orderFilterTypeUpdate();
    });

    $('.order-type-search-window form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        validator.destroy();
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                $('.order-type-btn a').trigger('click');
            }
        });
    });

    $('body').on('click', '.order-type-filter-param span', function() {
        var curId = $(this).attr('data-id');
        var curField = $('.order-type-filter-params-window *[data-id="' + curId + '"]');
        if (curField.parents().filter('.form-checkbox').length > 0) {
            curField.prop('checked', false);
            curField.trigger('change');
        }
        if (curField.hasClass('order-type-filter-params-window-dates')) {
            curField.find('input').val('');
            curField.find('input').trigger('change');
        }
    });

    $('body').on('click', '.order-type-search-link', function(e) {
        $('.order-type-search').toggleClass('open');
        if ($('.order-type-search').hasClass('open')) {
            $('.order-type-search-window-input input').trigger('focus');
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.order-type-search').length == 0) {
            $('.order-type-search').removeClass('open');
        }
    });

    $('body').on('click', '.order-type-pager .pager a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            if (!(curLink.hasClass('pager-prev') && $('.order-type-pager .pager-prev').next().hasClass('active')) && !(curLink.hasClass('pager-next') && $('.order-type-pager .pager-next').prev().hasClass('active'))) {
                $('.order-type-pager .pager a.active').removeClass('active');
                curLink.addClass('active');
                $('.order-type-btn a').trigger('click');
            }
        }
        e.preventDefault();
    });

});

function orderFilterUpdate() {
    var newHTML = '';
    var id = -1;
    var countFilters = 0;

    if ($('.order-press-filter-params-window-dates').length == 1) {
        id++;
        $('.order-press-filter-params-window-dates').attr('data-id', id);
        var datesText = '';
        if ($('.order-filter-date-from').val() != '') {
            datesText += 'с ' + $('.order-filter-date-from').val();
            countFilters++;
        }
        if ($('.order-filter-date-to').val() != '') {
            if (datesText != '') {
                datesText += ' ';
            }
            datesText += 'по ' + $('.order-filter-date-to').val();
            countFilters++;
        }
        if (datesText != '') {
            newHTML += '<div class="order-press-filter-param">' + datesText + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
        }
    }

    for (var i = 0; i < $('.order-press-filter .form-checkbox').length; i++) {
        var curInput = $('.order-press-filter .form-checkbox').eq(i).find('input');
        id++;
        curInput.attr('data-id', id);
        if (curInput.prop('checked')) {
            newHTML += '<div class="order-press-filter-param">' + curInput.parent().find('span').text() + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
            countFilters++;
        }
    }

    if (countFilters == 0) {
        $('.order-press-filter-link span').remove();
    } else {
        $('.order-press-filter-link span').remove();
        $('.order-press-filter-link').append('<span>' + countFilters + '</span>');
    }

    $('.order-press-filter-params').html(newHTML);

    $('.order-press-btn a').trigger('click');
}

function orderFilterTypeUpdate() {
    var newHTML = '';
    var id = -1;
    var countFilters = 0;

    if ($('.order-type-filter-params-window-dates').length == 1) {
        id++;
        $('.order-type-filter-params-window-dates').attr('data-id', id);
        var datesText = '';
        if ($('.order-type-date-from').val() != '') {
            datesText += 'с ' + $('.order-type-date-from').val();
            countFilters++;
        }
        if ($('.order-type-date-to').val() != '') {
            if (datesText != '') {
                datesText += ' ';
            }
            datesText += 'по ' + $('.order-type-date-to').val();
            countFilters++;
        }
        if (datesText != '') {
            newHTML += '<div class="order-type-filter-param">' + datesText + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
        }
    }

    for (var i = 0; i < $('.order-type-filter .form-checkbox').length; i++) {
        var curInput = $('.order-type-filter .form-checkbox').eq(i).find('input');
        id++;
        curInput.attr('data-id', id);
        if (curInput.prop('checked')) {
            newHTML += '<div class="order-type-filter-param">' + curInput.parent().find('span').text() + '<span data-id="' + id + '"><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
            countFilters++;
        }
    }

    if (countFilters == 0) {
        $('.order-type-filter-link span').remove();
    } else {
        $('.order-type-filter-link span').remove();
        $('.order-type-filter-link').append('<span>' + countFilters + '</span>');
    }

    $('.order-type-filter-params').html(newHTML);

    $('.order-type-btn a').trigger('click');
}

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
            newHTML += '<div class="press-filter-param">' + datesText + '<span data-id="' + id + '"><svg width="7" height="7" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
        }
    }

    for (var i = 0; i < $('.press-filter .form-checkbox').length; i++) {
        var curInput = $('.press-filter .form-checkbox').eq(i).find('input');
        id++;
        curInput.attr('data-id', id);
        if (curInput.prop('checked')) {
            newHTML += '<div class="press-filter-param">' + curInput.parent().find('span').text() + '<span data-id="' + id + '"><svg width="7" height="7" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L4.5 4.5L8 1" stroke-width="1.2"/><path d="M8 8L4.5 4.5L1 8" stroke-width="1.2"/></svg></span></div>';
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