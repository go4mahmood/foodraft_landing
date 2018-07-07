(function() {
    var current_step;
    var all_screenshots_loaded = false;
    var usage_screenshots = [
        'assets/images/select-location-new.png',
        'assets/images/select-product-new.png',
        'assets/images/add-to-cart-new.png',
        'assets/images/checkout-new.png'
    ];

    function displayUsageScreenshot(e) {
        var $selected_step, step_number;

        $('.js-display-usage-screenshot').removeClass('active');
        if (e) {
            e.preventDefault();
            $selected_step = $(e.currentTarget);
            step_number = Number($selected_step.data('step'));
            current_step = step_number;
            $selected_step.addClass('active');
            clearInterval(interval_id);
            initScreenshotSlider();
        } else {
            step_number = current_step;
            $('.js-display-usage-screenshot[data-step=' + current_step + ']').addClass('active');
        }


        if (all_screenshots_loaded) {
            $('.js-usage-screenshot').attr('src', usage_screenshots[step_number-1]);
        }
    };

    function initScreenshotSlider() {
        interval_id = setInterval(function() {
            current_step = current_step === usage_screenshots.length ? 1 : current_step + 1;
            displayUsageScreenshot();
        }, 3000);
    }

    function initScreenshots() {
        all_screenshots_loaded = true;
        $('.js-screenshot-loader').addClass('hidden');
        $('.js-usage-screenshot').removeClass('hidden');
        current_step = Number($('.js-display-usage-screenshot.active').data('step'));
        displayUsageScreenshot();
        initScreenshotSlider();
    };

    $(document).ready(function() {
        preloadImages(usage_screenshots, initScreenshots);

        $('.js-display-usage-screenshot').on('click', displayUsageScreenshot);
    });
})();
