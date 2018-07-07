(function() {
    var usage_screenshots = [
        'assets/images/select-location-mobile.png',
        'assets/images/select-product-mobile.png',
        'assets/images/add-to-cart-mobile.png',
        'assets/images/checkout-mobile.png'
    ];
    var screenshot_prev, screenshot_active, screenshot_next, screenshot_last, $screenshots, interval_id;
    screenshot_prev = {
        css_class: 'screenshot-prev',
        next: 'active',
        name: 'prev',
        prev: 'last'
    };
    screenshot_active = {
        css_class: 'screenshot-active',
        next: 'next',
        name: 'active',
        prev: 'prev'
    };
    screenshot_next = {
        css_class: 'screenshot-next',
        next: 'last',
        name: 'next',
        prev: 'active'
    };
    screenshot_last = {
        css_class: 'screenshot-last',
        next: 'prev',
        name: 'last',
        prev: 'next'
    };

    var screenshot_map = {
        'prev': screenshot_prev,
        'active': screenshot_active,
        'next': screenshot_next,
        'last': screenshot_last
    };

    function cycle(direction) {
        $screenshots.each(function(idx, el) {
            var $el = $(el);
            var position = $el.data('position');
            var current_config = screenshot_map[position];

            if (direction === 'left') {
                var next_config = screenshot_map[current_config.prev];
            } else if (direction === 'right') {
                var next_config = screenshot_map[current_config.next];
            }

            $el.removeClass(current_config.css_class)
                .addClass(next_config.css_class)
                .data('position', next_config.name);
        });

        var $desc = $('.js-screenshot-desc');
        $desc.fadeOut(500, function() {
            $desc.text($('.screenshot-active').data('desc')).fadeIn();
        });
    }

    function initScreenshots() {
        $('.js-screenshot-desc').text($('.screenshot-active').data('desc'));

        interval_id = setInterval(function() {
            cycle("left");
        }, 3000);
    }

    function setPaddingBottomToScreenshotWrapper() {
        var $screenshot_wrapper = $('.js-screenshot-wrapper');
        $screenshot_wrapper.removeClass('hidden');
        $screenshot_wrapper.css('padding-bottom', ($('.js-screenshot').height() + 20) + 'px');
    }

    $(document).ready(function() {
        preloadImages(usage_screenshots, function() {
            $screenshots = $('.js-screenshot');
            $('.js-screenshot-loader').addClass('hidden');
            setPaddingBottomToScreenshotWrapper();
            window.onresize = setPaddingBottomToScreenshotWrapper;

            initScreenshots();
        });

        $('.js-display-previous-step').on('click', function() {
            clearInterval(interval_id);
            cycle("right");
            initScreenshots();
        });
        $('.js-display-next-step').on('click', function() {
            clearInterval(interval_id);
            cycle("left");
            initScreenshots();
        });
    });
})();
