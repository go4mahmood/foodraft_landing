(function() {
    var cta_height;
    var $location_selector = $('#js-location-selector');
    var cities = ["Hyderabad", "Bangalore"];

    function redirectToDairyApp(e) {
        if(e!=undefined){
            e.preventDefault();
        }

        if (!docCookies.getItem("lat_lng") || !$location_selector.val()) {
            $location_selector.focus();
            return;
        }

        var location = window.location;
        var city = cities[parseInt(docCookies.getItem('city'))].toLowerCase();

        location.href = location.protocol + "//" + location.host + "/" + city + "#!/products/milk";
    }

    function scrollToSearchBar() {
        $('html, body').animate({
            scrollTop: $('.js-title').offset().top - cta_height - 10
        }, 500, function() {
            $location_selector.focus();
        });
    }


    $(document).ready(function() {

        if (!docCookies.hasItem('city')) {
            docCookies.setItem('city', 0);
        }

        cta_height = $('.js-cta-bar').outerHeight();

        $(".js-selected-city").text(cities[parseInt(docCookies.getItem('city')) || 0]);
        $(".js-city-select").val(docCookies.getItem('city'));
        /*$('#js-location-selector-form').on('submit', redirectToDairyApp);*/
        $('#js-location-selector-form-submit').on('click', redirectToDairyApp);
        $('.js-btn-cta').on('click', scrollToSearchBar);
    })

    function adjustStyle(width) {
        width = parseInt(width);
        if (width < 481) {
            $("#size-stylesheet").attr("href", "assets/stylesheets/landing_page_new/mobile.css");
        } else {
            $("#size-stylesheet").attr("href", "assets/stylesheets/landing_page_new/app.css");
        }
    }

    $(function() {
        adjustStyle($(this).width());
        $(window).resize(function() {
            adjustStyle($(this).width());
        });
    });

})();
