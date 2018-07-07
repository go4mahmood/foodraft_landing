(function() {
    window.preloadImages = function (image_urls, callback) {
        var preload_count = image_urls.length;

        $(image_urls).each(function(index, src) {
            var img = new Image();
            var $img = $(img);

            $img.attr({src: src});

            if (img.complete || img.readyState === 4) {
                preload_count--;

                if (preload_count === 0) {
                    callback();
                }
            } else {
                $img.load(function(resp, status, xhr) {
                    if (status === 'error') {
                        // image could not be loaded
                    } else {
                        preload_count--;
                        if (preload_count === 0) {
                            callback();
                        }
                    }
                });
            }
        })
    }
})();
