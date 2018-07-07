(function() {
    var location_selector;
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
        console.log("location",location);
        location_selector.closeMapModal();
        location.href = location.protocol + "//" + location.host + "/" + city + "#!/products/milk";
    }

    function showPosition(position) {

        location_selector.currentGPSPosition.lat = position.coords.latitude;
        location_selector.currentGPSPosition.long = position.coords.longitude;
        location_selector.openMapModal();

        $.when(location_selector.getGeoName(location_selector.currentGPSPosition.lat, location_selector.currentGPSPosition.long)).then(function(data){
            if(data.results.length>0){
                location_selector.currentGPSPosition.name = data.results[0].address_components[1].long_name +", "+ data.results[0].address_components[2].long_name;
            }
            else{
                location_selector.currentGPSPosition.name = "Your Location";
            }
            location_selector.updateCookie(location_selector.currentGPSPosition.lat, location_selector.currentGPSPosition.long, location_selector.currentGPSPosition.name);
            location_selector.reinitialize();

            /*redirectToDairyApp();*/
        });
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }

    function initMapInModal(lat, long) {
        var mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    function modalShowProducts(){
        location_selector.updateCookie(location_selector.currentGPSPosition.lat, location_selector.currentGPSPosition.long, location_selector.currentGPSPosition.name);
        redirectToDairyApp();
    }

    function changeCity(idx) {
        $('.js-selected-city').text(cities[parseInt(idx)]);
        docCookies.setItem('city', idx);
        docCookies.removeItem('lat_lng');
        docCookies.removeItem('location_name');
        location_selector.reinitialize();
    }

    function checkCookieAndRedirect(){
        /*if(docCookies.hasItem("lat_lng") && docCookies.hasItem('city')){
            var location = window.location;
            var city = cities[parseInt(docCookies.getItem('city'))].toLowerCase();
            location.href = location.protocol + "//" + location.host + "/" + city + "#!/products/milk";
        }
        else{
            $( "#body-child" ).removeClass( "hide" )
        }*/

        $( "#body-child" ).removeClass( "hide" )
    }

    $(document).ready(function() {
        checkCookieAndRedirect();
        var options = {
            el: $location_selector
        };

        /*location_selector = new LocationSelector(options);
        location_selector.init();*/

        $('.js-city-dropdown a').on('click', function (e) {
            e.preventDefault();
            changeCity($(this).data('city'));
        });

        $('.js-city-select').on('change', function () {
            changeCity($(this).val());
        });

        $('.js-btn-get-current-gps').on('click', getCurrentLocation);

        $('#js-locate-me-modal').on('shown.bs.modal', function(){
            google.maps.event.trigger(map, 'resize');
            console.log("location_selector",location_selector);
            initMapInModal(location_selector.currentGPSPosition.lat, location_selector.currentGPSPosition.long);
            google.maps.event.addListener(map, "dragend", function() {
                console.log(map.getCenter().toUrlValue());
                var gps = map.getCenter().toUrlValue().split(",");
                location_selector.currentGPSPosition.lat = gps[0];
                location_selector.currentGPSPosition.long = gps[1];

                $.when(location_selector.getGeoName(location_selector.currentGPSPosition.lat, location_selector.currentGPSPosition.long)).then(function(data){
                    if(data.results.length>0){
                        location_selector.currentGPSPosition.name = data.results[0].address_components[1].long_name +", "+ data.results[0].address_components[2].long_name;
                    }
                    else{
                        location_selector.currentGPSPosition.name = "Your Location";
                    }
                });

            });
        });

        $('#js-map-location-selector').on('click', modalShowProducts);
    });
})();
