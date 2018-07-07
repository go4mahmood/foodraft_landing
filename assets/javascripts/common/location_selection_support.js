(function ( $, docCookies ) {
  function similateArrowDownOnEnter(input) {
      //http://stackoverflow.com/a/11703018/1482899
      var _listener = input.addEventListener || input.attachEvent;

      function addEventListenerWrapper(type, listener) {
          if(type === 'keydown') {
              var orig_listener = listener;

              listener = function(event) {
                   var suggestion_selected = $('.pac-item-selected').length > 0;
                   var simulated_downarrow;

                   if (event.which === 13 && !suggestion_selected) {
                        simulated_downarrow = $.Event("keydown", {
                            keyCode: 40,
                            which: 40
                        });
                        orig_listener.apply(input, [simulated_downarrow]);
                   }

                   orig_listener.apply(input, arguments);
              };
          }

          _listener.apply(input, arguments);
      }

      if (input.addEventListener) {
          input.addEventListener = addEventListenerWrapper;
      } else {
          input.attachEvent = addEventListenerWrapper;
      }
  };

  var LocationSelector = function ( options ) {
    var south_west = new google.maps.LatLng(17.113804,78.129272);
    var north_east = new google.maps.LatLng(17.632816,78.758240);
    var defaults = {
      componentRestrictions: { country: 'IN' },
      bounds: (new google.maps.LatLngBounds(south_west, north_east))
    };

    options.geocompleteOptions = $.extend( defaults, options.geocompleteOptions );

    this.options = options;

    this.currentGPSPosition = {
          lat: '',
          long: '',
          name: ''
      }
  };

  LocationSelector.prototype = {
    stringifyLatLng: function ( lattitude, longitude ) {
      return [ lattitude, longitude ].join( ',' );
    },

    updateCookie: function ( lattitude, longitude, address ) {
      docCookies.removeItem( 'lat_lng' );
      docCookies.setItem( 'lat_lng', this.stringifyLatLng( lattitude, longitude ) );
      docCookies.removeItem( 'location_name' );
      docCookies.setItem( 'location_name', address );
    },

    onPlaceChange: function () {
      var lattitude, longitude,
          place = this.autocomplete.getPlace();

      if ( ! place.geometry ) {
        return;
      }

      lattitude = place.geometry.location.lat(),
      longitude = place.geometry.location.lng();

        this.currentGPSPosition.lat = place.geometry.location.lat();
        this.currentGPSPosition.long = place.geometry.location.lng();
        this.currentGPSPosition.name = place.name;


        //ga('send', 'event', 'Info', 'GPS Location Name Entered', 'Location: ' + location);


        //this.updateCookie( lattitude, longitude, place.name );

      if ( $.isFunction( this.options.onLocationSet ) ) {
        this.options.onLocationSet( lattitude, longitude, place.name );
      }
        else{
          this.openMapModal();
          this.updateCookie( lattitude, longitude, place.name );
      }

      this.location_being_changed = false;
    },

    handleEnterKeyEvent: function( e ) {
      var input = String.fromCharCode( e.which );

      if ( e.which === 13 ) {
        if ( this.location_being_changed ) {
            e.preventDefault();
            e.stopPropagation();
        }
      } else if ( /[a-zA-Z0-9-_ ]/.test( input ) ) {
        this.location_being_changed = true;
      }
    },

    reinitialize: function() {
      this.$el.val('');
      google.maps.event.removeListener(this.place_change_listener_handle);
      google.maps.event.removeListener(this.keypress_listener_handle);
      this.init();
    },

      openMapModal: function () {
          $('#js-locate-me-modal')
              .prop('class', 'modal fade') // revert to default
              .addClass( 'bottom direction' );
          $('#js-locate-me-modal').modal('show');
      },

      closeMapModal: function () {
          $('#js-locate-me-modal')
              .prop('class', 'modal fade') // revert to default
              .removeClass( 'bottom direction' );
          $('#js-locate-me-modal').modal('hide');
      },

      getGeoName: function(lat, long) {
          return $.ajax({
              url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyCBYbCquzqQLt_OYm_QIvPdX4wWmJicnhU"
          }).then(function(data) {
              return data;
          });
      },

    init: function () {
      var options = this.options.geocompleteOptions;
      var $el = $( this.options.el );
      var el = $el[ 0 ];

      similateArrowDownOnEnter(el);

      this.$el = $el;
      this.autocomplete = new google.maps.places.Autocomplete( el, options );
      this.place_change_listener_handle = google.maps.event.addListener( this.autocomplete,
                                                                         'place_changed',
                                                                         $.proxy( this.onPlaceChange, this ) );
      this.keypress_listener_handle = google.maps.event.addDomListener( el, 'keypress',
                                                                        $.proxy( this.handleEnterKeyEvent, this ) );

      if ( docCookies.hasItem( 'location_name' ) ) {
        $el.val( decodeURIComponent( docCookies.getItem( 'location_name' ) ) );
      }

      //$el.focus();
    }
  }

  window.LocationSelector = LocationSelector;
})( jQuery, docCookies );
